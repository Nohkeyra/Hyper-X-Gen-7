
import { PanelMode, KernelConfig } from '../types.ts';
import { injectAntiCensor } from '../utils/antiCensor.ts';
import { ENV } from '../constants.ts';

const HUGGING_FACE_MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";

// --- UTILITY FUNCTIONS ---
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

/**
 * Pure Hugging Face generation service.
 * This is gated by the presence of a Hugging Face API key.
 */
export const generateWithFluxHF = async (
  prompt: string,
  mode: PanelMode,
  config: KernelConfig,
  extraDirectives?: string
): Promise<string> => {
  const huggingFaceApiKey = ENV.HUGGING_FACE_API_KEY;
  if (!huggingFaceApiKey || huggingFaceApiKey === 'PLACEHOLDER_HF_KEY') {
    throw new Error("HF Engine Error: The Hugging Face API key is missing. Please add your key to the `.env.local` file and restart the application.");
  }

  const fullPrompt = [prompt, extraDirectives || ""].filter(Boolean).join('\n\n');
  const visualPrompt = injectAntiCensor(fullPrompt, mode);
  
  const response = await fetch(
    HUGGING_FACE_MODEL_URL,
    {
      headers: { Authorization: `Bearer ${huggingFaceApiKey}` },
      method: "POST",
      body: JSON.stringify({ inputs: visualPrompt }),
    }
  );

  if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 429) {
        throw new Error(`Hugging Face API error: Rate limit exceeded. Please wait and try again.`);
      }
      throw new Error(`Hugging Face API error: ${response.status} ${errorBody}`);
  }

  const resultBlob = await response.blob();
  return await blobToBase64(resultBlob);
};