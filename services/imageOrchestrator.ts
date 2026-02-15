import { generateWithFlux } from './fluxService.ts';
import { generateWithGemini, describeImage } from './geminiService.ts';
import { PanelMode, ExtractionResult, KernelConfig, ImageEngine, GenerationResult } from '../types.ts';

/**
 * OMEGA IMAGE ORCHESTRATOR v2.5 (ERROR PRIORITY PATCH)
 * 
 * Routes synthesis to the engine defined in KernelConfig.imageEngine.
 * - Gemini: Multimodal native.
 * - Flux (HF): Text-to-Image via Vision Bridge.
 */

export async function generateImage(
  prompt: string,
  image?: string,
  config?: KernelConfig
): Promise<GenerationResult> {
  const engine = config?.imageEngine ?? ImageEngine.GEMINI;

  // --- GEMINI NATIVE PATH (Multimodal) ---
  if (engine === ImageEngine.GEMINI) {
    const imageUrl = await generateWithGemini(prompt, image);
    return { imageUrl, engineUsed: ImageEngine.GEMINI, fallbackTriggered: false };
  }

  // --- HF / FLUX OMEGA PATH (Text-to-Image) ---
  try {
    // 1. Sanitize Prompt: Flux hates "SYSTEM_MODE:" and technical directives.
    let cleanPrompt = prompt
      .replace(/SYSTEM_MODE: \w+/g, '')
      .replace(/\[DIRECTIVE:.*?\]/g, '')
      .replace(/ARTISTIC_DNA:.*$/, '') // Remove raw DNA append, it's too technical
      .replace(/\s+/g, ' ')
      .trim();

    // 2. Vision Bridge: If image exists, describe it to Flux.
    if (image) {
      console.log("[ORCHESTRATOR] INITIATING_VISION_BRIDGE: Deconstructing source image for Flux engine...");
      try {
        const visualDescription = await describeImage(image);
        cleanPrompt = `Create a high-fidelity image with exactly this composition: ${visualDescription}. \n\nStyle Application: ${cleanPrompt}. \n\nEnsure exact layout match.`;
      } catch (visionErr) {
        console.warn("[ORCHESTRATOR] VISION_BRIDGE_FAILED: Falling back to user prompt only.", visionErr);
        cleanPrompt = `${cleanPrompt} (Note: Source image analysis failed, generating from text only)`;
      }
    }

    const imageUrl = await generateWithFlux(cleanPrompt);
    return { imageUrl, engineUsed: ImageEngine.HF, fallbackTriggered: false };
  } catch (err: any) {
    // 3. Fallback Protocol
    const isFluxFailure = 
      ['HF_KEY', 'FLUX_', 'TIMEOUT'].some(k => err.message.includes(k)) ||
      String(err.message).startsWith('FLUX_');

    if (isFluxFailure) {
      console.warn(`[ORCHESTRATOR] PRIMARY_ENGINE_FAILURE: ${err.message}. Transitioning to Gemini fallback kernel...`);
      try {
        const imageUrl = await generateWithGemini(prompt, image);
        return { imageUrl, engineUsed: ImageEngine.GEMINI, fallbackTriggered: true };
      } catch (geminiErr: any) {
        // ERROR PRIORITY LOGIC:
        // If Flux failed due to Key/Network, AND Gemini failed due to Quota,
        // The user needs to know about the Flux failure first, as that was their intent.
        
        const fluxErrorMsg = err.message;
        
        if (geminiErr.message === 'GEMINI_QUOTA_EXHAUSTED') {
           // Append the fallback failure as a footnote, but keep the main error Flux-related
           throw new Error(`${fluxErrorMsg} (Fallback Gemini also exhausted).`);
        }
        
        throw new Error(`SYSTEM_CRITICAL: ${fluxErrorMsg} -> ${geminiErr.message}`);
      }
    }
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
  // For Gemini, we pass the full technical context. 
  // For Flux, the Orchestrator will strip the headers later.
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