
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { ExtractionResult, KernelConfig, PanelMode, StyleCategory } from '../types.ts';

const getPureBase64Data = (dataUrl: string | null | undefined): string | null => {
  if (!dataUrl) return null;
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : null;
};

const MODELS = {
  TEXT:  'gemini-3-flash-preview',
  IMAGE: 'gemini-2.5-flash-image',
};

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

let _aiInstance: GoogleGenAI | null = null;
const getAI = (): GoogleGenAI => {
  if (!_aiInstance) {
    if (!process.env.API_KEY) throw new Error('GEMINI_API_KEY_MISSING');
    _aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return _aiInstance;
};

export async function generateWithGemini(prompt: string, imageBase64?: string, retryCount = 0): Promise<string> {
  const ai = getAI();

  try {
    const parts: any[] = [{ text: prompt }];
    
    if (imageBase64) {
      const dataOnly = getPureBase64Data(imageBase64);
      if (dataOnly) {
        parts.unshift({
          inlineData: {
            mimeType: 'image/jpeg',
            data: dataOnly,
          },
        });
      }
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODELS.IMAGE,
      contents: { parts },
      config: {
        systemInstruction: 'Production-ready graphic design output. No text unless explicitly requested. High fidelity, vector-sharp aesthetic.',
        temperature: 0.2,
        imageConfig: { aspectRatio: '1:1' },
      },
    });

    if (!response) throw new Error('GEMINI_NULL_RESPONSE');

    const imagePart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
    const base64    = imagePart?.inlineData?.data;

    if (!base64) {
      if (response.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error('SAFETY_BLOCK: Prompt rejected by safety filters.');
      }
      throw new Error('GEMINI_INVALID_RESPONSE');
    }

    return `data:image/png;base64,${base64}`;

  } catch (err: any) {
    if (err.status === 429 || String(err.message).includes('429')) {
      if (retryCount < 2) {
        const delay = 4000 * (retryCount + 1) + Math.floor(Math.random() * 1000);
        await wait(delay);
        return generateWithGemini(prompt, imageBase64, retryCount + 1);
      }
      throw new Error('GEMINI_QUOTA_EXHAUSTED');
    }
    throw new Error(`GEMINI_ERROR: ${err.message || 'Unknown'}`);
  }
}

/**
 * VISION_BRIDGE_PROTOCOL:
 * Converts a source image into a high-density textual description for text-only engines (Flux).
 */
export async function describeImage(imageBase64: string): Promise<string> {
  const ai = getAI();
  const dataOnly = getPureBase64Data(imageBase64);
  if (!dataOnly) throw new Error('INVALID_IMAGE_DATA');

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODELS.TEXT,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: dataOnly } },
          { text: "Deconstruct this image for a synthesis engine. Describe the subject, composition, key colors, and stylistic markers in high detail. Do not use conversational language. Output a single descriptive paragraph." }
        ]
      },
      config: { temperature: 0.2 },
    });
    return response.text || "A visual graphic.";
  } catch (err) {
    console.error("[GEMINI_SERVICE] DESCRIBE_IMAGE_FAILED:", err);
    throw err;
  }
}

export async function refineTextPrompt(
  prompt: string,
  mode: PanelMode,
  config: KernelConfig,
  dna?: ExtractionResult
): Promise<string> {
  try {
    const ai = getAI();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODELS.TEXT,
      contents: `Refine for ${mode}: "${prompt}". High density visual description, under 30 words. Output string only, no chat.`,
      config: { temperature: 0.7 },
    });
    return response.text?.replace(/"/g, '') || prompt;
  } catch {
    return prompt;
  }
}

export async function extractStyleFromImage(
  base64Image: string,
  config: KernelConfig,
  prompt: string
): Promise<ExtractionResult> {
  const ai = getAI();
  const dataOnly = getPureBase64Data(base64Image);
  if (!dataOnly) throw new Error('INVALID_IMAGE_DATA');

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODELS.TEXT,
      contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: dataOnly } }, { text: prompt }] },
      config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    if (String(error).includes('429') || String(error).includes('limit')) {
      throw new Error('DAILY_LIMIT_REACHED');
    }
    throw error;
  }
}

export async function classifyStyleWithAI(
  description: string,
  features: any,
  config: KernelConfig
): Promise<{ category: StyleCategory; confidence: number; recommendedPanel: PanelMode }> {
  try {
    const ai = getAI();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODELS.TEXT,
      contents: `Classify this design style: "${description}". Features: ${JSON.stringify(features)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            recommendedPanel: { type: Type.STRING },
          },
          required: ['category', 'confidence', 'recommendedPanel'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    return {
      category: (data.category as StyleCategory) || StyleCategory.UNKNOWN,
      confidence: data.confidence || 0,
      recommendedPanel: (data.recommendedPanel as PanelMode) || PanelMode.VECTOR,
    };
  } catch {
    return { category: StyleCategory.UNKNOWN, confidence: 0, recommendedPanel: PanelMode.VECTOR };
  }
}
