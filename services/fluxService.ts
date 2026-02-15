import { ENV } from '../constants.ts';

/**
 * FLUX SYNTHESIS SERVICE — OMEGA V9.1 (CORS OPTIMIZED)
 * Deterministic image synthesis via Hugging Face Inference API.
 * 
 * PATCH V9.1: Removed custom X- headers to resolve CORS preflight failures ("Failed to fetch").
 * Added timestamp cache-busting.
 */

export async function generateWithFlux(prompt: string, retryCount = 0): Promise<string> {
  // 1. Sanitize Inputs
  const manualKey = localStorage.getItem('HYPERXGEN_HF_KEY');
  const rawToken = manualKey || ENV.HF_TOKEN || '';
  const hfToken = rawToken.trim();
  
  const rawModelId = ENV.HF_MODEL || 'black-forest-labs/FLUX.1-schnell';
  const modelId = rawModelId.trim();
  
  // Cache-busting URL to prevent stale network errors
  const url = `https://api-inference.huggingface.co/models/${modelId}?t=${Date.now()}`;

  // Adaptive Configuration based on Model Architecture
  const isDev = modelId.toLowerCase().includes('dev');
  const inferenceSteps = isDev ? 28 : 4; 
  const guidanceScale  = isDev ? 3.5 : 0.0; 

  if (!hfToken || hfToken.length < 5) {
    throw new Error('HF_KEY_MISSING: Inject key in Settings > Flux Gateway');
  }

  // Diagnostic Log (Masked Key)
  if (retryCount === 0) {
    console.log(`[FLUX] CONNECTING: ${modelId} (Key: ...${hfToken.slice(-4)})`);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      // 'mode' and 'credentials' defaults are usually safer for standard CORS
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
        // REMOVED custom headers (X-Wait-For-Model) to fix CORS 'Failed to fetch' in strict envs
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
      throw new Error('HF_KEY_INVALID: The provided token was rejected by Hugging Face.');
    }

    // 429: Rate Limit
    if (response.status === 429) {
      throw new Error('FLUX_QUOTA_EXCEEDED: Rate limit hit. Wait 60s.');
    }

    // 503: Model Loading (Cold Start)
    if (response.status === 503) {
      if (retryCount < 5) {
        const data = await response.json().catch(() => ({}));
        const estimatedTime = data.estimated_time || 5;
        const delay = Math.min(estimatedTime * 1000, 10000); // Cap wait at 10s per retry
        
        console.log(`[FLUX] MODEL_LOADING (${modelId}): Waiting ${delay/1000}s... (Attempt ${retryCount + 1}/5)`);
        await new Promise(r => setTimeout(r, delay));
        return generateWithFlux(prompt, retryCount + 1);
      } else {
        throw new Error('FLUX_TIMEOUT: Model took too long to load.');
      }
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[FLUX] API_ERROR: ${response.status} - ${errText}`);
      throw new Error(`FLUX_ERROR: ${response.status} - ${errText.substring(0, 50)}`);
    }

    const blob = await response.blob();
    
    // Safety check for JSON error inside 200 OK response
    if (blob.type.includes('application/json')) {
        const text = await blob.text();
        try {
            const json = JSON.parse(text);
            if (json.error) throw new Error(`FLUX_API_REPORTED_ERROR: ${json.error}`);
        } catch (e) { /* ignore parse error if not json */ }
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror  = () => reject(new Error('FLUX_BLOB_READ_ERROR'));
      reader.readAsDataURL(blob);
    });

  } catch (err: any) {
    // Pass through known specific errors
    const knownMessages = ['HF_KEY', 'FLUX_', 'TIMEOUT'];
    if (knownMessages.some(m => err.message.includes(m))) throw err;
    
    // Handle Network/CORS errors explicitly
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
       console.error("[FLUX] NETWORK_BLOCK:", err);
       // Provide a more actionable error message
       throw new Error('FLUX_CONNECTION_FAILED: Network blocked request to Hugging Face. Try disabling AdBlockers or VPNs, or check your firewall rules for "api-inference.huggingface.co".');
    }
    
    console.error("[FLUX] UNKNOWN_FATAL:", err);
    throw new Error(`FLUX_SYSTEM_FAILURE: ${err.message}`);
  }
}