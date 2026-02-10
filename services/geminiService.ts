
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ExtractionResult, KernelConfig, PanelMode, RealIssue } from "../types.ts";
import { injectAntiCensor } from '../utils/antiCensor.ts';
import { ERROR_MESSAGES, APP_CONSTANTS } from '../constants.ts';

// Helper function to extract pure base64 data
function getPureBase64Data(dataUrl: string | null | undefined): string | null {
  if (!dataUrl) return null;
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : null;
}

const DEFAULT_CONFIG: KernelConfig = {
  thinkingBudget: 0,
  temperature: 0.1,
  model: 'gemini-3-flash-preview', 
  deviceContext: 'MAXIMUM_ARCHITECTURE_OMEGA_V5'
};

/**
 * BLOCKING PROTOCOL: OMEGA_SECURITY
 * Blocks forbidden modules attempting to install/execute.
 * Enforces use of standard Flash/Pro models only, preventing paid-only Imagen/Veo calls.
 */
function validateModuleAccess(modelName: string, config?: any): void {
  const forbiddenModels = ['veo', 'tts', 'imagen-4', 'gemini-3-pro-image', 'gemini-2.5-flash-native-audio'];
  const isForbidden = forbiddenModels.some(m => modelName.toLowerCase().includes(m));
  const isAudioRequest = config?.responseModalities?.includes('AUDIO') || config?.speechConfig;

  if (isForbidden || isAudioRequest) {
    throw new Error("MASTER_RULES_BLOCK: UNAUTHORIZED_MODULE_ACCESS_DENIED");
  }
}

function createAIInstance(): GoogleGenAI | null {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    console.warn(ERROR_MESSAGES.API_KEY_MISSING);
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

async function reliableRequest<T>(requestFn: () => Promise<T>, retries: number = APP_CONSTANTS.RETRY_ATTEMPTS): Promise<T> {
  try {
    return await requestFn();
  } catch (error: any) {
    const errorStr = JSON.stringify(error).toLowerCase();
    const isQuota = errorStr.includes("429") || errorStr.includes("quota");
    
    if (isQuota && retries > 0) {
      const delay = Math.pow(2, (APP_CONSTANTS.RETRY_ATTEMPTS + 1 - retries)) * 1000;
      console.warn(`[KERNEL_QUOTA]: Rate limit reached. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return reliableRequest(requestFn, retries - 1);
    }
    throw error;
  }
}

export async function extractStyleFromImage(
  base64Image: string, 
  config: KernelConfig = DEFAULT_CONFIG,
  prompt: string
): Promise<ExtractionResult> {
  validateModuleAccess(config.model);
  const ai = createAIInstance();
  if (!ai) return { 
    domain: 'Mock_Engine', name: 'Identity_Null', description: 'Free mode fallback extraction result.',
    styleAuthenticityScore: 50, palette: ['#CC0001', '#010066'], mood: ['Static'],
    category: 'Mock', formLanguage: 'Geometric', styleAdjectives: ['Placeholder'], technique: 'Mockup', promptTemplate: 'style of fallback'
  };

  return reliableRequest(async () => {
    const dataOnly = getPureBase64Data(base64Image);
    if (!dataOnly) throw new Error("Null buffer detected.");
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: dataOnly } },
          { text: prompt }
        ],
      },
      config: {
        systemInstruction: "Aesthetic Forensic Analyst. Decode visual language into structured JSON DNA.",
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             domain: { type: Type.STRING },
             category: { type: Type.STRING },
             name: { type: Type.STRING },
             description: { type: Type.STRING },
             styleAuthenticityScore: { type: Type.NUMBER },
             palette: { type: Type.ARRAY, items: { type: Type.STRING } },
             mood: { type: Type.ARRAY, items: { type: Type.STRING } },
             formLanguage: { type: Type.STRING },
             styleAdjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
             technique: { type: Type.STRING },
             promptTemplate: { type: Type.STRING }
           },
           required: ['domain', 'category', 'name', 'description', 'styleAuthenticityScore', 'palette', 'mood', 'formLanguage', 'styleAdjectives', 'technique', 'promptTemplate']
         }
      }
    });
    return JSON.parse(response.text || "{}");
  });
}

async function performSynthesis(
  prompt: string, mode: PanelMode, base64Image?: string, config: KernelConfig = DEFAULT_CONFIG,
  dna?: ExtractionResult, extraDirectives?: string
): Promise<string> {
  validateModuleAccess('gemini-2.5-flash-image'); // Synthesis always uses standard image model
  const ai = createAIInstance();
  if (!ai) return "";

  return reliableRequest(async () => {
    const visualPrompt = injectAntiCensor(`{SYNTH_MODE: ${mode.toUpperCase()}} {DIRECTIVES: ${extraDirectives || ""}} {DNA: ${dna?.promptTemplate || "none"}} {PROMPT: ${prompt}}`, mode);
    const contents: any = { parts: [{ text: visualPrompt }] };
    const pureData = getPureBase64Data(base64Image);
    if (pureData) contents.parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: pureData } });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents,
      config: { 
        systemInstruction: `High-fidelity ${mode} design engine. Priority: Recognizable elegance. 
        CRITICAL RULE: DO NOT INCLUDE ANY TEXT LABELS OR WORDS. 
        STRICT PROHIBITION: Never write words like "MONOGRAM", "SYNTHESIS", "REFINED", "PROTOCOL", "ENGINE", or "HYPERXGEN" inside the graphic. 
        Only render the letters explicitly asked for in the prompt. If no letters are asked for, render ZERO text. 
        Labels, peripheral annotations, and decorative word borders are strictly forbidden.`,
        temperature: config.temperature 
      }
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) return `data:image/png;base64,${imagePart.inlineData.data}`;
    
    return "";
  });
}

export const synthesizeVectorStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string) => performSynthesis(p, PanelMode.VECTOR, i, c, d, e);
export const synthesizeTypoStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string) => performSynthesis(p, PanelMode.TYPOGRAPHY, i, c, d, e);
export const synthesizeMonogramStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string) => performSynthesis(p, PanelMode.MONOGRAM, i, c, d, e);

export async function refineTextPrompt(prompt: string, mode: PanelMode, config: KernelConfig = DEFAULT_CONFIG, dna?: ExtractionResult): Promise<string> {
  const ai = createAIInstance();
  if (!ai) return prompt;
  return reliableRequest(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Switched to flash for efficiency and safety
      contents: `Refine for ${mode} synthesis engine: "${prompt}". Focus on visual subjects. Short and precise.`,
      config: { 
        systemInstruction: "Prompt Architect v5.2. Optimize visual descriptors for image synthesis kernels.",
        temperature: 0.7
      }
    });
    return response.text?.replace(/"/g, '') || prompt;
  });
}

export async function analyzeCodeForRefinements(code: string): Promise<RealIssue[]> {
  const ai = createAIInstance();
  if (!ai) return [];
  return reliableRequest(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Switched to flash to avoid paid-tier reasoning overhead
      contents: `Audit code for React/Vite/CSS best practices:\n${code}`,
      config: {
        systemInstruction: "Architect Audit. Return JSON array of valid issues.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              severity: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              file: { type: Type.STRING },
              codeSnippet: { type: Type.STRING },
              fix: { type: Type.STRING },
              fixed: { type: Type.BOOLEAN },
              canAutoFix: { type: Type.BOOLEAN },
              timestamp: { type: Type.NUMBER },
              impact: { type: Type.STRING },
            },
            required: ['id', 'type', 'severity', 'title', 'description', 'file', 'codeSnippet', 'fix', 'fixed', 'canAutoFix', 'timestamp', 'impact'],
          },
        },
      }
    });
    return JSON.parse(response.text || "[]");
  });
}
