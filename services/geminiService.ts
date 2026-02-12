


import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ExtractionResult, KernelConfig, PanelMode, StyleCategory } from "../types.ts";
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

/**
 * AI-POWERED STYLE CLASSIFIER
 * Analyzes architectural design DNA to route to the correct synthesis module.
 */
export async function classifyStyleWithAI(
  styleDescription: string,
  features?: any,
  config: KernelConfig = DEFAULT_CONFIG
): Promise<{
  category: StyleCategory;
  confidence: number;
  recommendedPanel: PanelMode;
}> {
  validateModuleAccess(config.model);
  const ai = createAIInstance();
  if (!ai) {
    // Fallback to a very basic classifier if AI is not available
    if (styleDescription.toLowerCase().includes('monogram')) return { category: StyleCategory.MONOGRAM, confidence: 80, recommendedPanel: PanelMode.MONOGRAM };
    if (styleDescription.toLowerCase().includes('emblem')) return { category: StyleCategory.EMBLEM, confidence: 80, recommendedPanel: PanelMode.EMBLEM_FORGE };
    if (styleDescription.toLowerCase().includes('typo') || styleDescription.toLowerCase().includes('graffiti')) return { category: StyleCategory.TYPOGRAPHY, confidence: 80, recommendedPanel: PanelMode.TYPOGRAPHY };
    return { category: StyleCategory.VECTOR, confidence: 70, recommendedPanel: PanelMode.VECTOR };
  }

  const featureString = features ? `ADDITIONAL_FEATURES_DETECTED: ${JSON.stringify(features)}` : '';
  const textPrompt = `Analyze the following style description and classify it.
  DESCRIPTION: "${styleDescription}"
  ${featureString}
  Based on this, determine the primary style category and the most appropriate synthesis panel.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: textPrompt }] },
    config: {
      systemInstruction: `You are an expert Art Director. Your task is to analyze a style description and classify it into ONE of the following categories: MONOGRAM, TYPOGRAPHY, VECTOR, EMBLEM, GRAFFITI. Provide a confidence score and recommend the best synthesis panel (monogram, typography, vector, emblem_forge).`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: Object.values(StyleCategory).filter(c => c !== StyleCategory.UNKNOWN && c !== StyleCategory.FILTER) },
          confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 100" },
          recommendedPanel: { type: Type.STRING, enum: [PanelMode.MONOGRAM, PanelMode.TYPOGRAPHY, PanelMode.VECTOR, PanelMode.EMBLEM_FORGE] },
        },
        required: ['category', 'confidence', 'recommendedPanel']
      }
    }
  });
  
  const result = JSON.parse(response.text || "{}");
  
  // Ensure the returned types match our enums, with a fallback.
  return {
      category: Object.values(StyleCategory).includes(result.category) ? result.category : StyleCategory.VECTOR,
      confidence: result.confidence || 75,
      recommendedPanel: Object.values(PanelMode).includes(result.recommendedPanel) ? result.recommendedPanel : PanelMode.VECTOR,
  };
}


export async function extractStyleFromImage(
  base64Image: string, 
  config: KernelConfig = DEFAULT_CONFIG,
  prompt: string
): Promise<ExtractionResult> {
  validateModuleAccess(config.model);
  const ai = createAIInstance();
  if (!ai) return { 
    domain: 'Mock_Engine', name: 'Identity_Null', description: 'Free mode fallback.',
    styleAuthenticityScore: 50, palette: ['#CC0001', '#010066'], mood: ['Static'],
    category: 'Mock', formLanguage: 'Geometric', styleAdjectives: ['Placeholder'], technique: 'Mockup', promptTemplate: 'style of fallback',
    features: { hasLetters: false, isGeometric: true, isAbstract: false, hasSymmetry: true, usesNegativeSpace: true, strokeBased: true, colorBased: true, textureBased: false }
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
        systemInstruction: "AESTHETIC_PRESET_FORENSICS: Map visual traits to design parameters. IGNORE SUBJECT MATTER. MANDATORY: The 'name' property must be a unique, all-caps descriptive label based on extracted traits (e.g. 'NEON_GLITCH_VECTOR' or 'MINIMAL_CHROME_MONO'). Do not use generic names.",
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             domain: { type: Type.STRING },
             category: { type: Type.STRING },
             name: { type: Type.STRING, description: "Highly descriptive traits-based name in CAPS" },
             description: { type: Type.STRING },
             styleAuthenticityScore: { type: Type.NUMBER },
             palette: { type: Type.ARRAY, items: { type: Type.STRING } },
             mood: { type: Type.ARRAY, items: { type: Type.STRING } },
             formLanguage: { type: Type.STRING },
             styleAdjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
             technique: { type: Type.STRING },
             promptTemplate: { type: Type.STRING },
             features: {
               type: Type.OBJECT,
               properties: {
                 hasLetters: { type: Type.BOOLEAN },
                 isGeometric: { type: Type.BOOLEAN },
                 isAbstract: { type: Type.BOOLEAN },
                 hasSymmetry: { type: Type.BOOLEAN },
                 usesNegativeSpace: { type: Type.BOOLEAN },
                 strokeBased: { type: Type.BOOLEAN },
                 colorBased: { type: Type.BOOLEAN },
                 textureBased: { type: Type.BOOLEAN }
               },
               required: ['hasLetters', 'isGeometric', 'isAbstract', 'hasSymmetry', 'usesNegativeSpace', 'strokeBased', 'colorBased', 'textureBased']
             }
           },
           required: ['domain', 'category', 'name', 'description', 'styleAuthenticityScore', 'palette', 'mood', 'formLanguage', 'styleAdjectives', 'technique', 'promptTemplate', 'features']
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
  validateModuleAccess('gemini-2.5-flash-image'); 
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
        systemInstruction: `High-fidelity ${mode} design engine. MANDATORY: Zero text annotations in the final result unless explicitly for Typography module. Production-ready output.`,
        temperature: config.temperature,
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
export const synthesizeEmblemStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string) => performSynthesis(p, PanelMode.EMBLEM_FORGE, i, c, d, e);

export async function refineTextPrompt(prompt: string, mode: PanelMode, config: KernelConfig = DEFAULT_CONFIG, dna?: ExtractionResult): Promise<string> {
  const ai = createAIInstance();
  if (!ai) return prompt;
  return reliableRequest(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: `Refine for ${mode} synthesis engine: "${prompt}".`,
      config: { 
        systemInstruction: "Prompt Architect. Optimize visual descriptors. Return pure string, no quotes.",
        temperature: 0.7
      }
    });
    return response.text?.replace(/"/g, '') || prompt;
  });
}