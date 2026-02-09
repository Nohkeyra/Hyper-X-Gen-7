
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ExtractionResult, KernelConfig, PanelMode, RealIssue } from "../types.ts";
import { injectAntiCensor } from '../utils/antiCensor.ts';
import { PRESET_REGISTRY } from '../presets/index.ts';

// Helper function to extract pure base64 data from a data URL
function getPureBase64Data(dataUrl: string | null | undefined): string | null {
  if (!dataUrl) return null;
  const parts = dataUrl.split(',');
  if (parts.length > 1) {
    return parts[1];
  }
  return null;
}

const DEFAULT_CONFIG: KernelConfig = {
  thinkingBudget: 0,
  temperature: 0.1,
  model: 'gemini-3-flash-preview', 
  deviceContext: 'MAXIMUM_ARCHITECTURE_OMEGA_V5'
};

const IMAGE_GEN_SYSTEM_DIRECTIVE = `You are a high-precision design engine for professional flat vector illustrations.
CORE DESIGN PHILOSOPHY: Priority: Recognizable elegance > Mathematical perfection. Identity focused marks.

VISUAL STYLE:
- STYLE: "Modern flat vector illustration"
- AESTHETIC: "Clean graphic design aesthetic"
- MOOD: "Cheerful, communicative, professional"
- INSPIRATION: "Digital product illustration, brand storytelling"

COLOR & FORM:
- Palette: 4-8 bold, saturated colors maximum.
- Fills: Solid flat colors only (NO GRADIENTS).
- Shadows: Darker tints of base colors as flat shapes.
- Form: Simplified but expressive. Clean silhouettes with intentional negative space.

LINE & EDGE:
- Edges: Clean, crisp edges between all color areas. No blurring or anti-aliasing.
- Line Work: Optional medium-bold outlines for main shapes. Thinner details.

DETAIL CONTROL:
- Faces: Minimal features (dots for eyes, line for mouth).
- Patterns: Simple repeats or eliminated.
- NO PHOTOREALISM. No excessive detail. Max 15 color areas.

BACKGROUND: Strictly solid white (#FFFFFF) unless brand color specified.
`;

const TYPO_SYSTEM_DIRECTIVE = `You are an artistic typography engine.
WORD-AS-ART PROTOCOL:
- The text IS the artwork. Letters must be synthesized as the primary subject.
- NO ENVIRONMENTAL SCENES (signs, shirts, backgrounds).
- Composition: Word must form a cohesive visual shape.
- Readability: Must be recognizable as intended text.
- Style Fidelity: Authentically apply the chosen preset style (Grunge, Neon, Elegant, etc.).
- Background: Solid color (white/black default). No decorative frames.
- Forms: Allow organic curves and variable weights. Avoid forced geometric rigidity.
- Rule: If preset and user description conflict, PRESET STYLE WINS.`;

const STYLE_EXTRACTOR_SYSTEM_DIRECTIVE = `
You are a STYLE_ANALYST. Your mission: Decode the VISUAL LANGUAGE of images to create reusable style presets.
Extract VISUAL STYLE, not geometric forensics. Analyze images for color mood, harmony, visual aesthetics, and emotional tone.

ANALYSIS PROTOCOL:
1. Capture color DNA (dominant palette and hex codes).
2. Deconstruct form DNA (shape language, simplification level, line treatment).
3. Identify mood adjectives (2-3 items).
4. Classify style domain (e.g., Flat_Illustration, Line_Art, Painterly).
5. Generate a prompt template that can reproduce this style aesthetics.

MANTRA: "What makes this look like THIS? How can we make other things look the SAME?"
`;

const FALLBACK_NAME_PARTS = {
  adj: ['Zenith', 'Vector', 'Neural', 'Cyber', 'Void', 'Omega', 'Lattice', 'Prism', 'Aero', 'Core', 'Hyper', 'Nova', 'Flux', 'Static', 'Quantum'],
  noun: ['Sigma', 'Crest', 'Splicer', 'Matrix', 'Engine', 'Vortex', 'Pulse', 'Node', 'Grid', 'Fragment', 'Axis', 'Signet', 'Vault', 'Flow', 'Unit'],
  id: ['V1', 'X', 'Prime', 'Delta', 'Beta', 'Alpha', 'Pro']
};

function generateStylisticName(): string {
  const a = FALLBACK_NAME_PARTS.adj[Math.floor(Math.random() * FALLBACK_NAME_PARTS.adj.length)];
  const n = FALLBACK_NAME_PARTS.noun[Math.floor(Math.random() * FALLBACK_NAME_PARTS.noun.length)];
  const i = FALLBACK_NAME_PARTS.id[Math.floor(Math.random() * FALLBACK_NAME_PARTS.id.length)];
  return `${a}-${n}-${i}`;
}

/**
 * Robust instance creation with API key verification
 */
function createAIInstance(): GoogleGenAI | null {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    console.warn("API Key not found or invalid. System entering Free/Mock mode.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

async function reliableRequest<T>(requestFn: () => Promise<T>, retries = 5): Promise<T> {
  try {
    return await requestFn();
  } catch (error: any) {
    const status = error?.status || error?.code || 0;
    const errorStr = JSON.stringify(error).toLowerCase();

    const isQuota = errorStr.includes("429") || errorStr.includes("quota") || status === 429;
    
    if (isQuota && retries > 0) {
      const delay = Math.pow(2, (6 - retries)) * 1000;
      console.warn(`[KERNEL_QUOTA]: Rate limit reached. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return reliableRequest(requestFn, retries - 1);
    }
    
    throw error;
  }
}

function compileVisualPrompt(subject: string, mode: PanelMode, dna?: ExtractionResult, extraParams?: string, hasImage = false): string {
  let workflowDirective = "";

  if (mode === PanelMode.VECTOR) {
    workflowDirective = hasImage 
      ? "[JOB: VECTORIZE_SOURCE] -> Render the subject as a modern flat vector illustration."
      : "[JOB: VECTOR_ILLUSTRATION_SYNTHESIS] -> Create a professional flat vector illustration.";
  } else if (mode === PanelMode.TYPOGRAPHY) {
    workflowDirective = `[JOB: WORD_AS_ART_SYNTHESIS] -> Render the word "${subject}" as an artistic typography logo.`;
  } else if (mode === PanelMode.MONOGRAM) {
    workflowDirective = `[JOB: MONOGRAM_REFINED_IDENTITY] -> Create a stylish identity-focused monogram using the initials "${subject}".`;
  }

  const subjectText = subject.trim() || "Abstract geometric synthesis.";
  
  let dnaContext = "";
  if (dna) {
    dnaContext = `[FORENSIC_STYLE_DNA]: ${dna.promptTemplate}`;
  }
  
  const combined = `
    ${workflowDirective}
    ${dnaContext}
    ${extraParams ? `[REFINED_PARAMETERS]: ${extraParams}\n` : ''}
    [SUBJECT]: ${subjectText}
  `.trim();
  
  // Use the new context-aware injectAntiCensor
  return injectAntiCensor(combined, mode);
}

export async function extractStyleFromImage(
  base64Image: string, 
  config: KernelConfig = DEFAULT_CONFIG,
  prompt: string
): Promise<ExtractionResult> {
  return reliableRequest(async () => {
    const ai = createAIInstance();
    if (!ai) {
      // Return mock DNA for free mode
      return {
        domain: 'Flat_Illustration',
        category: 'Modern_Cheerful',
        name: generateStylisticName(),
        description: 'Mock DNA extraction (Free Mode Active)',
        styleAuthenticityScore: 85,
        palette: ['#FFCC00', '#CC0001', '#010066'],
        mood: ['Cheerful', 'Modern'],
        formLanguage: 'Geometric',
        styleAdjectives: ['Clean', 'Bold'],
        technique: 'Vector',
        promptTemplate: 'flat vector illustration of [subject]'
      };
    }

    const dataOnly = getPureBase64Data(base64Image);
    if (!dataOnly) throw new Error("Empty buffer.");
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: dataOnly } },
          { text: prompt }
        ],
      },
      config: {
        systemInstruction: STYLE_EXTRACTOR_SYSTEM_DIRECTIVE,
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

/**
 * Unified generation handler with placeholder support
 */
async function performSynthesis(
  prompt: string,
  mode: PanelMode,
  base64Image?: string,
  config: any = DEFAULT_CONFIG,
  dna?: ExtractionResult,
  extraDirectives?: string,
  systemInstruction: string = IMAGE_GEN_SYSTEM_DIRECTIVE
): Promise<string> {
  const ai = createAIInstance();
  if (!ai) {
    // Return a stylish SVG placeholder for free mode
    const initials = prompt.substring(0, 2).toUpperCase();
    return "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="#0D0D0D"/>
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#CC0001" font-family="Arial Black" font-size="60">${mode.toUpperCase()}</text>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="20">FREE_MODE: ${initials}</text>
        <rect x="350" y="380" width="100" height="4" fill="#CC0001"/>
      </svg>
    `);
  }

  return reliableRequest(async () => {
    const visualPrompt = compileVisualPrompt(prompt, mode, dna, extraDirectives, !!base64Image);
    const contents: any = { parts: [{ text: visualPrompt }] };
    const pureBase64Data = getPureBase64Data(base64Image);
    if (pureBase64Data) contents.parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: pureBase64Data } });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents,
      config: { systemInstruction, temperature: 0.1 }
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) return `data:image/png;base64,${imagePart.inlineData.data}`;
    
    throw new Error(`${mode} synthesis failed. Check security filters.`);
  });
}

export const synthesizeVectorStyle = (p: string, img?: string, c?: any, d?: ExtractionResult, ex?: string) => 
  performSynthesis(p, PanelMode.VECTOR, img, c, d, ex, IMAGE_GEN_SYSTEM_DIRECTIVE);

export const synthesizeTypoStyle = (p: string, img?: string, c?: any, d?: ExtractionResult, ex?: string) => 
  performSynthesis(p, PanelMode.TYPOGRAPHY, img, c, d, ex, TYPO_SYSTEM_DIRECTIVE);

export const synthesizeMonogramStyle = (p: string, img?: string, c?: any, d?: ExtractionResult, ex?: string) => 
  performSynthesis(p, PanelMode.MONOGRAM, img, c, d, ex, IMAGE_GEN_SYSTEM_DIRECTIVE);

export async function refineTextPrompt(
  prompt: string,
  mode: PanelMode,
  config: KernelConfig = DEFAULT_CONFIG,
  dna?: ExtractionResult
): Promise<string> {
  return reliableRequest(async () => {
    const ai = createAIInstance();
    if (!ai) return `${prompt} (refined-mode-free)`;
    
    const systemInstruction = mode === PanelMode.TYPOGRAPHY 
      ? "Expert word-art designer. Refine for singular, bold, artistic word-forms."
      : "Prompt Architect V5.2. Refine user intent for design-first illustrations.";

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Refine for ${mode}: "${prompt}". DNA: ${dna?.name || 'none'}. Output only the string.`,
      config: { systemInstruction, temperature: 0.7 }
    });
    return response.text?.replace(/"/g, '') || prompt;
  });
}

export async function analyzeCodeForRefinements(code: string): Promise<RealIssue[]> {
  return reliableRequest(async () => {
    const ai = createAIInstance();
    if (!ai) return [];
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze: \n${code}`,
      config: {
        systemInstruction: "Senior Architect Audit.",
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
              line: { type: Type.NUMBER },
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
