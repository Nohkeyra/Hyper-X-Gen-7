
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { ExtractionResult, KernelConfig, PanelMode, StyleCategory } from '../types.ts';

const getPureBase64Data = (dataUrl: string | null | undefined): string | null => {
  if (!dataUrl) return null;
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : null;
};

/**
 * GEMINI_SYNTHESIS_GATEWAY v8.2
 * Strictly follows @google/genai 2025/2026 standards.
 * Added enhanced error classification.
 */

export async function generateWithGemini(prompt: string, imageBase64?: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = 'gemini-2.5-flash-image';

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
      model: modelId,
      contents: { parts },
      config: {
        systemInstruction: 'You are an absolute design engine. Output high-fidelity graphic design. No text in images unless requested. Maximum aesthetic precision.',
        temperature: 0.1,
        imageConfig: { aspectRatio: '1:1' },
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
    const base64 = imagePart?.inlineData?.data;

    if (!base64) {
      const finishReason = response.candidates?.[0]?.finishReason;
      if (finishReason === 'SAFETY') throw new Error('LATTICE_REJECTED: Prompt triggered safety filters.');
      if (finishReason === 'RECITATION') throw new Error('LATTICE_REJECTED: Copyright filter match.');
      throw new Error('SYNTHESIS_FAILED: Null Buffer returned from engine.');
    }

    return `data:image/png;base64,${base64}`;

  } catch (err: any) {
    const msg = String(err.message).toUpperCase();
    if (msg.includes('429') || msg.includes('QUOTA') || msg.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('QUOTA_LIMIT_EXCEEDED: Your Gemini free-tier requests are temporarily exhausted.');
    }
    if (msg.includes('API_KEY_INVALID') || msg.includes('403') || msg.includes('AUTHENTICATION')) {
      throw new Error('API_KEY_INVALID: The project credentials have expired or are incorrect.');
    }
    throw new Error(`GEMINI_GATEWAY_ERROR: ${err.message}`);
  }
}

export async function describeImage(imageBase64: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dataOnly = getPureBase64Data(imageBase64);
  if (!dataOnly) throw new Error('INVALID_BUFFER');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: dataOnly } },
          { text: "ANALYZE: Style, color, geometry, and layout. Avoid subject descriptions. One dense design-focused paragraph." }
        ]
      },
    });
    return response.text || "Generic visual lattice.";
  } catch (err) {
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `REFINED_SYNTAX for ${mode}: "${prompt}". High density, visual only, <30 words.`,
      config: { temperature: 0.8 },
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dataOnly = getPureBase64Data(base64Image);
  if (!dataOnly) throw new Error('INVALID_BUFFER');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: dataOnly } }, { text: prompt }] },
      config: { 
        responseMimeType: 'application/json',
        systemInstruction: "You are a forensic design analyst. Output valid JSON only."
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    throw error;
  }
}

export async function classifyStyleWithAI(
  description: string,
  features: any,
  config: KernelConfig
): Promise<{ category: StyleCategory; confidence: number; recommendedPanel: PanelMode }> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CLASSIFY: "${description}". DNA: ${JSON.stringify(features)}`,
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
