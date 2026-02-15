
import { generateWithFlux } from './fluxService.ts';
import { generateWithGemini, describeImage } from './geminiService.ts';
import { PanelMode, ExtractionResult, KernelConfig, ImageEngine, GenerationResult } from '../types.ts';

/**
 * OMEGA IMAGE ORCHESTRATOR v2.6 (RESILIENCE PATCH)
 * 
 * Routes synthesis to the engine defined in KernelConfig.imageEngine.
 * - Gemini: Multimodal native.
 * - Flux (HF): Text-to-Image via Vision Bridge.
 * 
 * PATCH V2.6: Hardened catch-blocks for network-level failures to ensure
 * reliable fallback to Gemini native kernel.
 */

export async function generateImage(
  prompt: string,
  image?: string,
  config?: KernelConfig
): Promise<GenerationResult> {
  const engine = config?.imageEngine ?? ImageEngine.GEMINI;

  // --- GEMINI NATIVE PATH ---
  if (engine === ImageEngine.GEMINI) {
    const imageUrl = await generateWithGemini(prompt, image);
    return { imageUrl, engineUsed: ImageEngine.GEMINI, fallbackTriggered: false };
  }

  // --- HF / FLUX OMEGA PATH ---
  try {
    let cleanPrompt = prompt
      .replace(/SYSTEM_MODE: \w+/g, '')
      .replace(/\[DIRECTIVE:.*?\]/g, '')
      .replace(/ARTISTIC_DNA:.*$/, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (image) {
      try {
        const visualDescription = await describeImage(image);
        cleanPrompt = `Visual Reference: ${visualDescription}. Style: ${cleanPrompt}. Ensure perfect structural alignment.`;
      } catch (visionErr) {
        console.warn("[ORCHESTRATOR] VISION_BRIDGE_FAILED:", visionErr);
      }
    }

    const imageUrl = await generateWithFlux(cleanPrompt);
    return { imageUrl, engineUsed: ImageEngine.HF, fallbackTriggered: false };

  } catch (err: any) {
    // DETECT ENGINE FAILURE SIGNATURES
    const isEngineUnreachable = 
      err.message.includes('CONNECTION_BLOCKED') || 
      err.message.includes('KEY_INVALID') || 
      err.message.includes('TIMEOUT') ||
      err.message.includes('Failed to fetch') ||
      err.message.includes('HF_KEY_MISSING'); // <--- ADDED: Explicitly catch missing HF key for fallback

    if (isEngineUnreachable || String(err.message).startsWith('FLUX_')) {
      console.warn(`[ORCHESTRATOR] ENGINE_DRIFT_DETECTED: ${err.message}. Initiating Gemini Fallback...`);
      
      try {
        const imageUrl = await generateWithGemini(prompt, image);
        return { imageUrl, engineUsed: ImageEngine.GEMINI, fallbackTriggered: true };
      } catch (geminiErr: any) {
        // Forensically report the root cause if fallback also fails
        const rootCause = err.message;
        const secondaryCause = geminiErr.message;
        throw new Error(`SYST_COLLAPSE: [Primary: ${rootCause}] -> [Fallback: ${secondaryCause}]`);
      }
    }
    
    // Pass through other errors (e.g. user cancellations if implemented)
    throw err;
  }
}

// --- PROMPT BUILDER ---
function buildCompositePrompt(
  prompt: string,
  mode: PanelMode,
  extraDirectives?: string,
  dna?: ExtractionResult
): string {
  return [
    `SYSTEM_MODE: ${mode.toUpperCase()}`,
    prompt,
    extraDirectives,
    dna ? `ARTISTIC_DNA: ${dna.promptTemplate}` : '',
  ].filter(Boolean).join('\n\n');
}

// --- PANEL WRAPPERS ---
export const synthesizeVectorStyle = (
  p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string, n?: number
): Promise<GenerationResult> => generateImage(buildCompositePrompt(p, PanelMode.VECTOR, e, d), i, c);

export const synthesizeTypoStyle = (
  p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string, n?: number
): Promise<GenerationResult> => generateImage(buildCompositePrompt(p, PanelMode.TYPOGRAPHY, e, d), i, c);

export const synthesizeMonogramStyle = (
  p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string, n?: number
): Promise<GenerationResult> => generateImage(buildCompositePrompt(p, PanelMode.MONOGRAM, e, d), i, c);

export const synthesizeEmblemStyle = (
  p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string, n?: number
): Promise<GenerationResult> => generateImage(buildCompositePrompt(p, PanelMode.EMBLEM_FORGE, e, d), i, c);
