

import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ExtractionResult, KernelConfig, PanelMode, StyleCategory, ImageEngine } from "../types.ts";
import { injectAntiCensor } from '../utils/antiCensor.ts';
import { ERROR_MESSAGES, APP_CONSTANTS, ENV } from '../constants.ts';
import { generateWithFluxHF } from './fluxService.ts';

// --- UTILITY FUNCTIONS ---
const getPureBase64Data = (dataUrl: string | null | undefined): string | null => {
  if (!dataUrl) return null;
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : null;
};

// --- SERVICE CONFIGURATION ---
const generationCache = new Map<string, { result: any, timestamp: number }>();
const CACHE_TTL = 3600000;
let lastDnaIdSent: string | null = null;

const FREE_TIER_MODELS = {
    TEXT: 'gemini-3-flash-preview',
    IMAGE: 'gemini-2.5-flash-image',
    FALLBACK: 'gemini-2.0-flash-exp'
};

// --- CACHING & HELPERS ---
function getCacheKey(method: string, args: any): string { return `${method}_${JSON.stringify(args)}`; }
function checkCache<T>(key: string): T | null {
  const cached = generationCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) { return cached.result as T; }
  return null;
}
function setCache(key: string, result: any): void {
  if (generationCache.size > 100) generationCache.clear();
  generationCache.set(key, { result, timestamp: Date.now() });
}

const DEFAULT_CONFIG: KernelConfig = {
  thinkingBudget: 0, temperature: 0.1, model: FREE_TIER_MODELS.TEXT, 
  deviceContext: 'MAXIMUM_ARCHITECTURE_OMEGA_V5', imageEngine: ImageEngine.GEMINI
};

function isQuotaError(error: any): boolean {
  const errorStr = JSON.stringify(error).toLowerCase();
  return ["429", "402", "quota", "exhausted", "limit", "billing", "resource has been exhausted", "rate limit"].some(k => errorStr.includes(k));
}

function validateModuleAccess(modelName: string): void {
  if (['veo', 'tts', 'gemini-3-pro-image', 'gemini-2.5-flash-native-audio'].some(m => modelName.toLowerCase().includes(m))) {
    throw new Error("MASTER_RULES_BLOCK: PAID_MODULE_ACCESS_DENIED");
  }
}

function createAIInstance(): GoogleGenAI | null {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

async function reliableRequest<T>(requestFn: () => Promise<T>, retries: number = APP_CONSTANTS.RETRY_ATTEMPTS): Promise<T> {
  try { return await requestFn(); } catch (error: any) {
    if (isQuotaError(error) && retries > 0) {
      console.warn(`[FREE_TIER_SATURATION]: Rate limit hit. Cooling down... (${retries} attempts left)`);
      const delay = Math.pow(2, (APP_CONSTANTS.RETRY_ATTEMPTS + 1 - retries)) * 1500;
      await new Promise(resolve => setTimeout(resolve, delay));
      return reliableRequest(requestFn, retries - 1);
    }
    throw error;
  }
}

// --- Synthesis Dispatcher ---
async function performSynthesis(
  prompt: string, mode: PanelMode, base64Image?: string, config: KernelConfig = DEFAULT_CONFIG,
  dna?: ExtractionResult, extraDirectives?: string, generationSeed?: number
): Promise<string> {
  const cacheKey = getCacheKey('synth', { prompt, mode, dnaId: dna?.id, directives: !!extraDirectives, generationSeed, engine: config.imageEngine });
  const cachedResult = checkCache<string>(cacheKey);
  if (cachedResult) return cachedResult;

  const ai = createAIInstance();

  const generateWithGemini = async (): Promise<string> => {
    if (!ai) return "";
    const targetModel = FREE_TIER_MODELS.IMAGE;
    validateModuleAccess(targetModel);
    const dnaChanged = dna?.id !== lastDnaIdSent;
    const densityTokens = "high-fidelity, die-cut silhouette, vector-sharp, solid-fills, 8k-resolution-output";
    const fullPrompt = [densityTokens, `{MODE: ${mode}}`, dnaChanged ? `{DNA: ${dna?.promptTemplate || ""}}` : "", prompt, extraDirectives || ""].filter(Boolean).join('\n\n');
    const visualPrompt = injectAntiCensor(fullPrompt, mode);
    const contents: any = { parts: [{ text: visualPrompt }] };
    const pureData = getPureBase64Data(base64Image);
    if (pureData) contents.parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: pureData } });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: targetModel, contents, config: { systemInstruction: `Production-ready vector aesthetic. No text unless requested.`, temperature: 0.2, imageConfig: { aspectRatio: "1:1" } }
    });
    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
      lastDnaIdSent = dna?.id || null;
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }
    throw new Error("Gemini synthesis returned no image data.");
  };
  
  let result = "";
  let primaryEngineFn: () => Promise<string>;

  switch(config.imageEngine) {
    case ImageEngine.HF:
      if (base64Image) throw new Error("The HF engine does not support image-to-image synthesis.");
      primaryEngineFn = () => generateWithFluxHF(prompt, mode, config, extraDirectives);
      break;
    default:
      primaryEngineFn = generateWithGemini;
  }
  
  try { result = await primaryEngineFn(); } catch (primaryError) {
    if (isQuotaError(primaryError) && config.imageEngine !== ImageEngine.GEMINI) {
      console.warn(`[${config.imageEngine.toUpperCase()}_QUOTA_EXHAUSTED]: Falling back to Gemini engine.`);
      try { result = await generateWithGemini(); } catch (geminiError) {
        if (isQuotaError(geminiError)) { throw new Error("Daily free generation limit reached on all available engines."); }
        throw geminiError;
      }
    } else { throw primaryError; }
  }

  if (result) setCache(cacheKey, result);
  return result;
}

export const synthesizeVectorStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string, gs?: number) => performSynthesis(p, PanelMode.VECTOR, i, c, d, e, gs);
export const synthesizeTypoStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string, gs?: number) => performSynthesis(p, PanelMode.TYPOGRAPHY, i, c, d, e, gs);
export const synthesizeMonogramStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string, gs?: number) => performSynthesis(p, PanelMode.MONOGRAM, i, c, d, e, gs);
export const synthesizeEmblemStyle = (p: string, i?: string, c?: KernelConfig, d?: ExtractionResult, e?: string, gs?: number) => performSynthesis(p, PanelMode.EMBLEM_FORGE, i, c, d, e, gs);

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