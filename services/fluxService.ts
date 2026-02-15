import { ENV } from '../constants.ts';

/**
 * FLUX SYNTHESIS SERVICE — OMEGA V9.3 (NETWORK HARDENED & DIAGNOSTIC)
 * Deterministic image synthesis via Hugging Face Inference API.
 * 
 * PATCH V9.3: Improved error messages for network-level failures ('Failed to fetch')
 * to guide users in checking local network blocks (AdBlock/Firewall) AND API key validity,
 * as invalid keys can sometimes trigger pre-emptive network blocking.
 */

export async function generateWithFlux(prompt: string, retryCount = 0): Promise<string> {
  // 1. Sanitize Inputs
  const manualKey = localStorage.getItem('HYPERXGEN_HF_KEY');
  const rawToken = manualKey || ENV.HF_TOKEN || '';
  const hfToken = rawToken.trim();
  
  const rawModelId = ENV.HF_MODEL || 'black-forest-labs/FLUX.1-schnell';
  const modelId = rawModelId.trim();
  
  // Use a stable URL without dynamic params for initial preflight consistency
  const url = `https://api-inference.huggingface.co/models/${modelId}`;

  if (!hfToken || hfToken.length < 5) {
    throw new Error('HF_KEY_MISSING: Access Settings to inject Flux credentials.');
  }

  // Adaptive Configuration based on Model Architecture
  const isDev = modelId.toLowerCase().includes('dev');
  const inferenceSteps = isDev ? 28 : 4; 
  const guidanceScale  = isDev ? 3.5 : 0.0; 

  try {
    // Check if the user is even online before attempting fetch
    if (!window.navigator.onLine) {
      throw new Error('LOCAL_NETWORK_OFFLINE: Device has no active connection.');
    }

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', // Explicitly enforce CORS
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        inputs: prompt,
        parameters: {
          num_inference_steps: inferenceSteps,
          guidance_scale: guidanceScale,
          width: 1024,
          height: 1024
        }
      }),
    });

    // 401/403: Auth Errors
    if (response.status === 401 || response.status === 403) {
      throw new Error('HF_KEY_INVALID: Gateway rejected credentials. Verify token in Settings.');
    }

    // 429: Rate Limit
    if (response.status === 429) {
      throw new Error('FLUX_QUOTA_EXCEEDED: Rate limit reached. Cooldown required.');
    }

    // 503: Model Loading (Cold Start)
    if (response.status === 503) {
      if (retryCount < 5) {
        const data = await response.json().catch(() => ({}));
        const delay = Math.min((data.estimated_time || 5) * 1000, 10000);
        console.log(`[FLUX] LATTICE_WAKING (${modelId}): Waiting ${delay/1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        return generateWithFlux(prompt, retryCount + 1);
      } else {
        throw new Error('FLUX_TIMEOUT: Engine cold-start exceeded 60s limit.');
      }
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`FLUX_GATEWAY_ERROR: ${response.status} - ${errText.substring(0, 50)}`);
    }

    const blob = await response.blob();
    
    // Safety check: if API returns JSON instead of binary image (even with 200 OK)
    if (blob.type.includes('application/json')) {
        const text = await blob.text();
        const json = JSON.parse(text);
        if (json.error) throw new Error(`FLUX_INTERNAL_ERR: ${json.error}`);
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror  = () => reject(new Error('BUFFER_READ_FAIL'));
      reader.readAsDataURL(blob);
    });

  } catch (err: any) {
    // CATCH TYPEERRORS (Failed to fetch)
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
       console.error("[FLUX] NETWORK_LATTICE_INTERRUPTED:", err);
       throw new Error('FLUX_CONNECTION_BLOCKED: Request killed by browser, local network, or firewall. Check AdBlockers, VPNs, security settings, AND verify your Hugging Face API key in app settings. Primary engine offline.');
    }
    
    // Re-throw already handled specific errors
    throw err;
  }
}