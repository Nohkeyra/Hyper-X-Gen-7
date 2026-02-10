
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ExtractionResult, KernelConfig, PanelMode, RealIssue, StyleCategory } from "../types.ts";
import { injectAntiCensor } from '../utils/antiCensor.ts';
import { ERROR_MESSAGES, APP_CONSTANTS } from '../constants.ts';
import { PRESET_REGISTRY } from '../presets/index.ts';

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
 * DETERMINISTIC STYLE CLASSIFIER
 * Analyzes architectural design DNA to route to the correct synthesis module.
 */
export class StyleClassifier {
  static classifyStyle(styleDescription: string, features?: any): {
    category: StyleCategory;
    confidence: number;
    recommendedPanel: PanelMode;
    matchingPresets: string[];
  } {
    const keywords = this.extractKeywords(styleDescription.toLowerCase());
    
    // 1. Check for Graffiti Specificity (Master Rules Override)
    const graffitiScore = this.calculateGraffitiScore(keywords);
    if (graffitiScore > 50) {
      return {
        category: StyleCategory.GRAFFITI,
        confidence: graffitiScore,
        recommendedPanel: PanelMode.TYPOGRAPHY,
        matchingPresets: this.findMatchingPresets(StyleCategory.TYPOGRAPHY, keywords)
      };
    }

    // 2. Standard Architectural Scores
    const monogramScore = this.calculateMonogramScore(keywords, features);
    const typographyScore = this.calculateTypographyScore(keywords, features);
    const vectorScore = this.calculateVectorScore(keywords, features);
    
    // Determine winner
    const scores = [
      { category: StyleCategory.MONOGRAM, score: monogramScore },
      { category: StyleCategory.TYPOGRAPHY, score: typographyScore },
      { category: StyleCategory.VECTOR, score: vectorScore }
    ];
    
    scores.sort((a, b) => b.score - a.score);
    const winner = scores[0] || { category: StyleCategory.UNKNOWN, score: 0 };
    
    return {
      category: winner.category as StyleCategory,
      confidence: winner.score,
      recommendedPanel: this.mapCategoryToPanel(winner.category as StyleCategory),
      matchingPresets: this.findMatchingPresets(winner.category as StyleCategory, keywords)
    };
  }

  private static calculateGraffitiScore(keywords: string[]): number {
    let score = 0;
    if (keywords.some(k => ['graffiti', 'wildstyle', 'throwup', 'tag', 'streetart'].includes(k))) score += 60;
    if (keywords.some(k => ['spray', 'urban', 'hiphop', 'drip', 'stencil'].includes(k))) score += 40;
    if (keywords.some(k => ['bubble', 'block', 'burner', 'piece'].includes(k))) score += 30;
    return Math.min(score, 100);
  }
  
  private static calculateMonogramScore(keywords: string[], features?: any): number {
    let score = 0;
    if (keywords.some(k => ['monogram', 'logo', 'seal', 'emblem', 'initials', 'letter', 'interlocked', 'shield', 'crest'].includes(k))) score += 50;
    if (keywords.some(k => ['stacked', 'radial', 'symmetry', 'mirror', 'radial', 'centered'].includes(k))) score += 30;
    if (features) {
      if (features.hasSymmetry) score += 20;
      if (features.usesNegativeSpace) score += 10;
    }
    return Math.min(score, 100);
  }
  
  private static calculateTypographyScore(keywords: string[], features?: any): number {
    let score = 0;
    if (keywords.some(k => ['typography', 'font', 'typeface', 'lettering', 'text', 'word', 'glyph', 'characters'].includes(k))) score += 50;
    if (keywords.some(k => ['grunge', 'neon', 'vintage', 'artdeco', 'retro', 'cursive', 'stencil', 'cyberpunk'].includes(k))) score += 30;
    if (features?.hasLetters) score += 40;
    return Math.min(score, 100);
  }
  
  private static calculateVectorScore(keywords: string[], features?: any): number {
    let score = 0;
    if (keywords.some(k => ['vector', 'illustration', 'flat', 'icon', 'sticker', 'lineart', 'silhouette'].includes(k))) score += 50;
    if (keywords.some(k => ['minimal', 'geometric', 'organic', 'abstract', 'flatdesign', 'modernist'].includes(k))) score += 30;
    if (features?.isAbstract || features?.isGeometric) score += 10;
    return Math.min(score, 100);
  }
  
  public static extractKeywords(text: string): string[] {
    const stopWords = ['the', 'and', 'for', 'with', 'style', 'design', 'art', 'image', 'photo', 'picture', 'draw', 'look', 'shows', 'contains', 'background'];
    const visualSubjects = ['cat', 'dog', 'person', 'human', 'man', 'woman', 'tree', 'car', 'animal', 'nature', 'object', 'thing', 'bird', 'fish', 'landscape', 'mountain', 'face', 'body', 'hand', 'flower', 'fruit', 'food', 'drink', 'bottle'];
    
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 2 && 
        !stopWords.includes(word) && 
        !visualSubjects.includes(word)
      );
    return [...new Set(words)];
  }
  
  private static findMatchingPresets(category: StyleCategory, keywords: string[]): string[] {
    const panelMode = this.mapCategoryToPanel(category);
    const registry = PRESET_REGISTRY[panelMode.toUpperCase()];
    if (!registry) return [];
    
    const matches: { id: string; score: number }[] = [];
    const allPresets = registry.libraries.flatMap(lib => lib.items);
    
    allPresets.forEach(preset => {
      let score = 0;
      const presetText = `${preset.name} ${preset.description} ${preset.prompt}`.toLowerCase();
      keywords.forEach(keyword => {
        if (presetText.includes(keyword)) score += 25;
      });
      if (score > 15) matches.push({ id: preset.id, score });
    });
    
    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(m => m.id);
  }
  
  private static mapCategoryToPanel(category: StyleCategory): PanelMode {
    switch (category) {
      case StyleCategory.MONOGRAM: return PanelMode.MONOGRAM;
      case StyleCategory.TYPOGRAPHY: return PanelMode.TYPOGRAPHY;
      case StyleCategory.VECTOR: return PanelMode.VECTOR;
      case StyleCategory.FILTER: return PanelMode.FILTERS;
      case StyleCategory.GRAFFITI: return PanelMode.TYPOGRAPHY;
      default: return PanelMode.VECTOR;
    }
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
        systemInstruction: "AESTHETIC_PRESET_FORENSICS: Map visual traits to design parameters. IGNORE SUBJECT MATTER.",
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
        systemInstruction: `High-fidelity ${mode} design engine. DO NOT INCLUDE ANY TEXT LABELS.`,
        temperature: config.temperature,
        thinkingConfig: { thinkingBudget: 50 } // Added for more reliable image generation
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
      model: 'gemini-3-flash-preview', 
      contents: `Refine for ${mode} synthesis engine: "${prompt}".`,
      config: { 
        systemInstruction: "Prompt Architect. Optimize visual descriptors.",
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
      model: 'gemini-3-flash-preview', 
      contents: `Audit code:\n${code}`,
      config: {
        systemInstruction: "Architect Audit. Return JSON array.",
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