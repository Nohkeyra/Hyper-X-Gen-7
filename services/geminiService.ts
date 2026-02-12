
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ExtractionResult, KernelConfig, PanelMode, StyleCategory } from "../types.ts";
import { injectAntiCensor } from '../utils/antiCensor.ts';
import { ERROR_MESSAGES, APP_CONSTANTS } from '../constants.ts';

// --- PERFORMANCE CACHE LAYER ---
const generationCache = new Map<string, { result: any, timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour in ms

// Internal tracker to avoid redundant state transmissions
let lastDnaIdSent: string | null = null;

// --- FREE TIER PROTOCOLS ---
// Strictly enforce models that have a free tier available.
const FREE_TIER_MODELS = {
    TEXT: 'gemini-3-flash-preview',
    IMAGE: 'gemini-2.5-flash-image',
    FALLBACK: 'gemini-2.0-flash-exp'
};

function getCacheKey(method: string, args: any): string {
  return `${method}_${JSON.stringify(args)}`;
}

function checkCache<T>(key: string): T | null {
  const cached = generationCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.result as T;
  }
  return null;
}

function setCache(key: string, result: any): void {
  if (generationCache.size > 100) generationCache.clear();
  generationCache.set(key, { result, timestamp: Date.now() });
}

function getPureBase64Data(dataUrl: string | null | undefined): string | null {
  if (!dataUrl) return null;
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : null;
}

const DEFAULT_CONFIG: KernelConfig = {
  thinkingBudget: 0,
  temperature: 0.1,
  model: FREE_TIER_MODELS.TEXT, 
  deviceContext: 'MAXIMUM_ARCHITECTURE_OMEGA_V5'
};

function validateModuleAccess(modelName: string, config?: any): void {
  const forbiddenModels = ['veo', 'tts', 'imagen-4', 'gemini-3-pro-image', 'gemini-2.5-flash-native-audio'];
  const isForbidden = forbiddenModels.some(m => modelName.toLowerCase().includes(m));
  
  // EXTRA SAFETY: If a paid model is detected, we don't just throw, we might want to return a safe fallback in future logic,
  // but for now, the Master Rule is to deny paid models to ensure free usage.
  if (isForbidden) throw new Error("MASTER_RULES_BLOCK: PAID_MODULE_ACCESS_DENIED");
}

function createAIInstance(): GoogleGenAI | null {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

async function reliableRequest<T>(requestFn: () => Promise<T>, retries: number = APP_CONSTANTS.RETRY_ATTEMPTS): Promise<T> {
  try {
    return await requestFn();
  } catch (error: any) {
    const errorStr = JSON.stringify(error).toLowerCase();
    const isQuota = errorStr.includes("429") || errorStr.includes("quota") || errorStr.includes("exhausted");
    
    if (isQuota) {
        console.warn(`[FREE_TIER_SATURATION]: Rate limit hit. Cooling down... (${retries} attempts left)`);
        
        if (retries > 0) {
            // Exponential backoff optimized for Free Tier (longer wait time to recover bucket)
            const delay = Math.pow(2, (APP_CONSTANTS.RETRY_ATTEMPTS + 1 - retries)) * 1500; 
            await new Promise(resolve => setTimeout(resolve, delay));
            return reliableRequest(requestFn, retries - 1);
        }
    }
    throw error;
  }
}

async function performSynthesis(
  prompt: string, mode: PanelMode, base64Image?: string, config: KernelConfig = DEFAULT_CONFIG,
  dna?: ExtractionResult, extraDirectives?: string
): Promise<string> {
  const cacheKey = getCacheKey('synth', { prompt, mode, dnaId: dna?.id, directives: !!extraDirectives });
  const cachedResult = checkCache<string>(cacheKey);
  if (cachedResult) return cachedResult;

  // STRICT FORCE: Always use the Free Tier Image Model regardless of config
  const targetModel = FREE_TIER_MODELS.IMAGE;
  validateModuleAccess(targetModel); 

  const ai = createAIInstance();
  if (!ai) return "";

  const dnaChanged = dna?.id !== lastDnaIdSent;

  const result = await reliableRequest(async () => {
    // Optimization: Dense tokens for faster inference
    const densityTokens = "high-fidelity, die-cut silhouette, vector-sharp, solid-fills, 8k-resolution-output";
    const visualPrompt = injectAntiCensor(`${densityTokens}, {MODE: ${mode}} ${dnaChanged ? `{DNA: ${dna?.promptTemplate || ""}}` : ""} ${prompt}`, mode);
    
    const contents: any = { parts: [{ text: visualPrompt }] };
    const pureData = getPureBase64Data(base64Image);
    if (pureData) contents.parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: pureData } });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: targetModel,
      contents,
      config: { 
        systemInstruction: `Production-ready vector aesthetic. No text unless requested.`,
        temperature: 0.2,
        imageConfig: { aspectRatio: "1:1" } // 1:1 is the most optimized tile for Flash
      }
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
        lastDnaIdSent = dna?.id || null;
        return `data:image/png;base64,${imagePart.inlineData.data}`;
    }
    return "";
  });

  if (result) setCache(cacheKey, result);
  return result;
}

export const synthesizeVectorStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string) => performSynthesis(p, PanelMode.VECTOR, i, c, d, e);
export const synthesizeTypoStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string) => performSynthesis(p, PanelMode.TYPOGRAPHY, i, c, d, e);
export const synthesizeMonogramStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string) => performSynthesis(p, PanelMode.MONOGRAM, i, c, d, e);
export const synthesizeEmblemStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string) => performSynthesis(p, PanelMode.EMBLEM_FORGE, i, c, d, e);

export async function refineTextPrompt(prompt: string, mode: PanelMode, config: KernelConfig = DEFAULT_CONFIG, dna?: ExtractionResult): Promise<string> {
  const cacheKey = getCacheKey('refine', { prompt, mode });
  const cached = checkCache<string>(cacheKey);
  if (cached) return cached;

  const ai = createAIInstance();
  if (!ai) return prompt;

  const result = await reliableRequest(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: FREE_TIER_MODELS.TEXT, 
      contents: `Refine: "${prompt}" for ${mode}. Keep it under 20 words.`,
      config: { systemInstruction: "Output string only.", temperature: 0.4 }
    });
    return response.text?.replace(/"/g, '') || prompt;
  });

  setCache(cacheKey, result);
  return result;
}

export async function extractStyleFromImage(base64Image: string, config: KernelConfig = DEFAULT_CONFIG, prompt: string): Promise<ExtractionResult> {
    const ai = createAIInstance();
    if (!ai) return { domain: 'None', category: 'None', name: 'Identity', description: 'None', styleAuthenticityScore: 0, palette: [], mood: [], formLanguage: '', styleAdjectives: [], technique: '', promptTemplate: '', features: { hasLetters: false, isGeometric: false, isAbstract: false, hasSymmetry: false, usesNegativeSpace: false, strokeBased: false, colorBased: false, textureBased: false } };
    return reliableRequest(async () => {
        const dataOnly = getPureBase64Data(base64Image);
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: FREE_TIER_MODELS.TEXT,
            contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: dataOnly! } }, { text: prompt }] },
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    });
}

export async function classifyStyleWithAI(styleDescription: string, features?: any, config: KernelConfig = DEFAULT_CONFIG): Promise<any> {
    const ai = createAIInstance();
    if (!ai) return { category: StyleCategory.VECTOR, confidence: 70, recommendedPanel: PanelMode.VECTOR };
    return reliableRequest(async () => {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: FREE_TIER_MODELS.TEXT,
            contents: `Classify: ${styleDescription}`,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    });
}
