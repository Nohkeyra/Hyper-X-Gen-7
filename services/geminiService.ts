import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
// FIX: MonogramPreset is defined in types.ts and should be imported from there.
import { ExtractionResult, KernelConfig, PanelMode, RealIssue, TypographyPreset, MonogramPreset } from "../types.ts";
import { injectAntiCensor } from '../utils/antiCensor.ts';
import { 
    GLOBAL_VECTOR_LOCK, 
    GLOBAL_TYPO_LOCK, 
    GLOBAL_MONO_LOCK,
    monogramPresets,
    typographyPresets,
    ENGINE_PROMPTS,
    GLOBAL_STYLE_EXTRACTOR_LOCK,
    injectPresetTokens
} from '../presets/enginePrompts.ts';

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

const BASE_SYSTEM_DIRECTIVE = `You are a high-density computation and design analysis engine. 
All operations must be geometric, precise, and deterministic. 
Maintain absolute architectural consistency across the lattice.`;

const IMAGE_GEN_SYSTEM_DIRECTIVE = `You are a specialized image generation engine focused on geometric purity and industrial precision. Your output must be abstract, safe-for-work, and adhere to strict design principles.
1. STRICT VISUAL ONLY: Render only the visual geometry described.
2. NO TEXT RENDER: Your output must be a pure image. Absolutely do not render any text, including characters from the user's prompt or any words from these instructions. Use prompt text only as a reference for the geometric shape to create. The final image must contain zero text characters.
3. HIGH CONTRAST & PRECISION: Prioritize sharp edges, mathematical accuracy, and clean vector aesthetics.
4. CONTENT SAFETY LOCK: Generate only abstract geometric patterns, logos, typographic art, or technical illustrations. Strictly avoid generating photorealistic images, people, faces, or any potentially sensitive or controversial content. Adherence to this rule is mandatory.
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
  return `${a}-${n} ${i}`;
}

async function reliableRequest<T>(requestFn: () => Promise<T>, retries = 5): Promise<T> {
  try {
    return await requestFn();
  } catch (error: any) {
    const message = error?.message || "";
    const status = error?.status || error?.code || 0;
    const errorStr = `${message} ${status} ${JSON.stringify(error)}`.toLowerCase();
    
    const isQuota = errorStr.includes("429") || errorStr.includes("quota") || errorStr.includes("resource_exhausted") || status === 429;
    
    if (isQuota && retries > 0) {
      // Exponential backoff: 2s, 4s, 8s, 16s, 32s
      const delay = Math.pow(2, (6 - retries)) * 1000;
      console.warn(`[KERNEL_QUOTA]: Rate limit reached. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return reliableRequest(requestFn, retries - 1);
    }
    
    const isKeyError = errorStr.includes("requested entity was not found") || errorStr.includes("api_key_invalid");
    if (isKeyError) {
      if ((window as any).aistudio && typeof (window as any).aistudio.openSelectKey === 'function') {
        await (window as any).aistudio.openSelectKey();
        return await requestFn();
      }
    }
    
    throw error;
  }
}

function compileVisualPrompt(subject: string, mode: 'vector' | 'typo' | 'monogram', dna?: ExtractionResult, extraParams?: string, hasImage = false): string {
  let globalLock = "";
  let workflowDirective = "";

  if (mode === 'vector') {
    globalLock = GLOBAL_VECTOR_LOCK;
    workflowDirective = hasImage 
      ? "[JOB: VECTORIZE_SOURCE] -> Render SOURCE_BUFFER as clean geometric vector lattice. Maintain silhouette integrity."
      : "[JOB: VECTOR_SYNTHESIS] -> Synthesize new geometric subject from prompt.";
  } else if (mode === 'typo') {
    globalLock = GLOBAL_TYPO_LOCK;
    workflowDirective = `[JOB: TYPOGRAPHIC_STYLE_TRANSFER] -> Content: "${subject}". Apply DNA Skeleton/Skin logic.`;
  } else {
    globalLock = GLOBAL_MONO_LOCK;
    workflowDirective = `[JOB: SEAL_ARCHITECT] -> Construct monogram: "${subject}". Radial symmetry required.`;
  }

  const subjectText = subject.trim() || "Abstract geometric synthesis.";
  
  let dnaContext = "";
  if (dna && dna.parameters) {
    const palette = Array.isArray(dna.palette) ? dna.palette.join(', ') : "industrial";
    dnaContext = `[DNA_INJECTION]:
    - DOMAIN: ${dna.domain}
    - THRESHOLD: 0.65% (LOCKED)
    - SMOOTHING: 0.40% (LOCKED)
    - STROKE_SKIN: SOURCE_MATCH_LOCKED
    - PALETTE: ${palette}`;
  }
  
  const combined = `
    ${globalLock}
    ${workflowDirective}
    ${dnaContext}
    ${extraParams ? `[ARCHITECT_DIRECTIVES]: ${extraParams}\n` : ''}
    [SUBJECT_DATA]: ${subjectText}
  `.trim();
  
  return injectAntiCensor(combined);
}

export async function extractStyleFromImage(
  base64Image: string, 
  config: KernelConfig = DEFAULT_CONFIG,
  prompt: string
): Promise<ExtractionResult> {
  return reliableRequest(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const dataOnly = getPureBase64Data(base64Image);
    if (!dataOnly) throw new Error("Empty buffer.");
    
    const systemInstruction = `${BASE_SYSTEM_DIRECTIVE}\nROLE: AUTONOMOUS_FORENSIC_AUTHENTICATOR.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: dataOnly } },
          { text: prompt }
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             domain: { type: Type.STRING, enum: ['Vector', 'Typography', 'Monogram'] },
             category: { type: Type.STRING },
             name: { type: Type.STRING },
             description: { type: Type.STRING },
             confidence: { type: Type.NUMBER },
             styleAuthenticityScore: { type: Type.NUMBER },
             palette: { type: Type.ARRAY, items: { type: Type.STRING } },
             parameters: {
               type: Type.OBJECT,
               properties: {
                 threshold: { type: Type.NUMBER },
                 smoothing: { type: Type.NUMBER },
                 detail: { type: Type.NUMBER },
                 edge: { type: Type.NUMBER }
               },
               required: ['threshold', 'smoothing', 'detail', 'edge']
             }
           },
           required: ['domain', 'category', 'name', 'description', 'confidence', 'styleAuthenticityScore', 'palette', 'parameters']
         }
      }
    });
    const result = JSON.parse(response.text || "{}");
    return {
      domain: (result.domain || 'Vector') as any,
      category: result.category || 'Auto-Extract',
      name: result.name || `FAIL_${generateStylisticName()}`,
      description: result.description || 'Autonomous extraction failed to generate summary.',
      confidence: result.confidence || 0,
      styleAuthenticityScore: result.styleAuthenticityScore || 100,
      palette: Array.isArray(result.palette) ? result.palette : [],
      parameters: {
        threshold: result.parameters?.threshold || 0.65,
        smoothing: result.parameters?.smoothing || 0.40,
        detail: result.parameters?.detail || 50,
        edge: result.parameters?.edge || 50
      }
    };
  });
}

export async function refineVectorComposition(
  base64Image: string,
  config: KernelConfig = DEFAULT_CONFIG,
): Promise<string> {
  return reliableRequest(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const pureBase64Data = getPureBase64Data(base64Image);
    if (!pureBase64Data) throw new Error("Empty buffer for refinement.");

    const prompt = `[PROTOCOL: AESTHETIC_COMPOSITION_V2]
1.  ANALYZE: Analyze the provided vector image for visual balance, element placement, and scale.
2.  REFINE: Adjust the composition to better align with principles of visual harmony, specifically the golden ratio.
3.  CONSTRAINTS:
    - Maintain the original art style, colors, stroke weights, and geometric primitives.
    - Do not add or remove any elements. Only reposition and rescale existing elements.
    - The output must be a visually refined version of the input image.
[OUTPUT]: High-fidelity raster image of the refined vector composition.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: pureBase64Data } },
          { text: prompt }
        ],
      },
      config: {
        systemInstruction: IMAGE_GEN_SYSTEM_DIRECTIVE,
        temperature: 0.1
      }
    });

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Composition refinement failed.");
  });
}

export async function synthesizeVectorStyle(
  prompt: string,
  base64Image?: string,
  config: any = DEFAULT_CONFIG,
  dna?: ExtractionResult,
  extraDirectives?: string
): Promise<string> {
  return reliableRequest(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const visualPrompt = compileVisualPrompt(prompt, 'vector', dna, extraDirectives, !!base64Image);
    const contents: any = { parts: [{ text: visualPrompt }] };
    const pureBase64Data = getPureBase64Data(base64Image);
    if (pureBase64Data) contents.parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: pureBase64Data } });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents,
      config: { systemInstruction: IMAGE_GEN_SYSTEM_DIRECTIVE, temperature: 0.1 }
    });
    
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Lattice synthesis failed. The model may have refused the prompt due to safety filters.");
  });
}

export async function synthesizeTypoStyle(
  prompt: string,
  base64Image?: string,
  config: any = DEFAULT_CONFIG,
  dna?: ExtractionResult,
  extraDirectives?: string
): Promise<string> {
  return reliableRequest(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const visualPrompt = compileVisualPrompt(prompt, 'typo', dna, extraDirectives, !!base64Image);
    const contents: any = { parts: [{ text: visualPrompt }] };
    const pureBase64Data = getPureBase64Data(base64Image);
    if (pureBase64Data) contents.parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: pureBase64Data } });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents,
      config: { systemInstruction: IMAGE_GEN_SYSTEM_DIRECTIVE, temperature: 0.1 }
    });
    
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Typo synthesis failed. The model may have refused the prompt due to safety filters.");
  });
}

export async function synthesizeMonogramStyle(
  prompt: string,
  base64Image?: string,
  config: any = DEFAULT_CONFIG,
  dna?: ExtractionResult,
  extraDirectives?: string
): Promise<string> {
  return reliableRequest(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const visualPrompt = compileVisualPrompt(prompt, 'monogram', dna, extraDirectives, !!base64Image);
    const contents: any = { parts: [{ text: visualPrompt }] };
    const pureBase64Data = getPureBase64Data(base64Image);
    if (pureBase64Data) contents.parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: pureBase64Data } });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents,
      config: { systemInstruction: IMAGE_GEN_SYSTEM_DIRECTIVE, temperature: 0.1 }
    });
    
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Monogram synthesis failed. The model may have refused the prompt due to safety filters.");
  });
}

export async function refineTextPrompt(
  prompt: string,
  mode: PanelMode,
  config: KernelConfig = DEFAULT_CONFIG,
  dna?: ExtractionResult
): Promise<string> {
  return reliableRequest(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let contents = `Refine: "${prompt}". DNA: ${dna?.name || 'none'}. Output only the refined string.`;
    let systemInstruction = "Prompt Architect V5.2";
    let temperature = 0.7;

    if (mode === PanelMode.TYPOGRAPHY) {
      systemInstruction = `You are an expert graffiti artist and typographer specializing in aggressive, high-energy styles. Your task is to rewrite a user's prompt to be extremely dynamic and infused with street art terminology.
      - Keywords to use: wildstyle, razor-sharp edges, explosive energy, kinetic flow, chisel-tip calligraphy, fat cap, urban decay, aggressive interlocking forms, drips.
      - The output MUST BE ONLY the refined prompt string. Do not add any conversational text, explanations, or quotes.`;
      contents = `Rewrite for maximum aggression: "${prompt}"`;
      temperature = 0.85; // Increase creativity for more aggressive styles
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: { 
        systemInstruction: systemInstruction, 
        temperature: temperature 
      }
    });
    return response.text?.replace(/"/g, '') || prompt;
  });
}

export async function analyzeCodeForRefinements(code: string): Promise<RealIssue[]> {
  return reliableRequest(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    try {
      const result = JSON.parse(response.text || "[]");
      // Ensure the result is always an array.
      return Array.isArray(result) ? result : [];
    } catch (e) {
      console.error("Failed to parse JSON response for code analysis:", e);
      // Return an empty array on parsing failure to prevent crashes.
      return [];
    }
  });
}

// To use fs for saving, you'd need node types: npm i -D @types/node
// import fs from 'fs'; 

/**
 * =================================================================================
 * HYPERXGEN - BACKEND / GEMINI USAGE EXAMPLES
 * =================================================================================
 * This file serves as a backend/CLI usage example for the synthesis engine.
 * It is not directly wired into the frontend application but demonstrates how to 
 * programmatically call the synthesis services for each panel.
 * 
 * To run this example (requires ts-node and a .env file with GEMINI_API_KEY):
 * > npx ts-node --esm services/geminiService.ts
 * =================================================================================
 */

// --- SHARED CONFIGURATION ---

const KERNEL_CONFIG: KernelConfig = {
    thinkingBudget: 0,
    temperature: 0.1,
    model: 'gemini-3-flash-preview',
    deviceContext: 'MAXIMUM_ARCHITECTURE_OMEGA_V5'
};

// A placeholder 1x1 black pixel PNG for image-based examples
const PLACEHOLDER_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// --- EXAMPLE: MONOGRAM PANEL ---

async function runMonogramSynthesisExample() {
    console.log("\n--- [1/4] Starting Monogram Synthesis Example ---");
    const selectedPresetName = 'Radial Fusion';
    const userInitials = 'HXG';
    const preset = monogramPresets.find(p => p.name === selectedPresetName);

    if (!preset) {
        console.error(`Error: Monogram Preset "${selectedPresetName}" not found.`);
        return;
    }

    const textPrompt = `${preset.prompt}. The monogram should fuse the initials: ${userInitials}.`;
    const extraDirectives = Object.entries(preset)
        .filter(([key]) => !['name', 'prompt', 'directives'].includes(key))
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '_$1').toUpperCase()}: ${String(value).toUpperCase()}`)
        .join('\n');

    try {
        console.log(`Requesting monogram with preset: ${preset.name}`);
        const result = await synthesizeMonogramStyle(textPrompt, undefined, KERNEL_CONFIG, undefined, extraDirectives);
        console.log('✅ Monogram Synthesis successful! (Output: base64 data URL)');
    } catch (error) {
        console.error('❌ Monogram Synthesis failed:', error);
    }
}

// --- EXAMPLE: VECTOR PANEL ---

async function runVectorSynthesisExample() {
    console.log("\n--- [2/4] Starting Vector Synthesis Example ---");
    const preset = ENGINE_PROMPTS.find(p => p.id === 'sig-vec-01'); // Omega Lattice Alpha
    if (!preset) {
        console.error('Error: Vector Preset "sig-vec-01" not found.');
        return;
    }

    const textPrompt = `A complex, symmetrical logo for a quantum computing company. ${preset.prompt}`;
    const extraDirectives = `
      GEOMETRY_ENGINE: PRIMITIVES
      PRIMITIVE_LOCK: ALL
      NODE_COMPLEXITY: 8/10
      STROKE_PARITY: MONOWEIGHT_ENFORCED
      CORNER_RADIUS: 5%
      ALIGNMENT_GRID: ISOMETRIC
      NEGATIVE_SPACE_RATIO: 15%
    `.trim();
    
    try {
        console.log(`Requesting vector with preset: ${preset.name}`);
        const result = await synthesizeVectorStyle(textPrompt, undefined, KERNEL_CONFIG, undefined, extraDirectives);
        console.log('✅ Vector Synthesis successful! (Output: base64 data URL)');
    } catch (error) {
        console.error('❌ Vector Synthesis failed:', error);
    }
}

// --- EXAMPLE: TYPOGRAPHY PANEL ---

async function runTypoSynthesisExample() {
    console.log("\n--- [3/4] Starting Typography Synthesis Example ---");
    const presetName = "Urban Graffiti";
    const preset = typographyPresets.find(p => p.name === presetName);
    
    if (!preset) {
        console.error(`Error: Typography Preset "${presetName}" not found.`);
        return;
    }
    
    const textPrompt = `The word 'HYPERX' rendered in a ${injectPresetTokens(preset.prompt)}`;
    const extraDirectives = `
      CAP_HEIGHT: ${preset.capHeight}%
      STROKE_CONTRAST: ${preset.strokeContrast}%
      TERMINAL_LOGIC: ${preset.terminals.toUpperCase()}
      FONT_WEIGHT: ${preset.weight.toUpperCase()}
      SPLICING_INTENSITY: ${preset.splicingIntensity}%
      INTERLOCK_GUTTER: ${preset.interlockGutter}px
      X_HEIGHT_BIAS: ${preset.xHeightBias}%
      LIGATURE_LOGIC: ${preset.ligatureThreshold.toUpperCase()}
    `.trim();

    try {
        console.log(`Requesting typography with preset: ${preset.name}`);
        const result = await synthesizeTypoStyle(textPrompt, undefined, KERNEL_CONFIG, undefined, extraDirectives);
        console.log('✅ Typography Synthesis successful! (Output: base64 data URL)');
    } catch (error) {
        console.error('❌ Typography Synthesis failed:', error);
    }
}

// --- EXAMPLE: STYLE EXTRACTOR PANEL ---

async function runStyleExtractionExample() {
    console.log("\n--- [4/4] Starting Style Extractor Example ---");
    try {
        console.log("Requesting style extraction from a placeholder image...");
        const result = await extractStyleFromImage(PLACEHOLDER_IMAGE_BASE64, KERNEL_CONFIG, GLOBAL_STYLE_EXTRACTOR_LOCK);
        console.log('✅ Style Extraction successful!');
        console.log('Extracted DNA:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('❌ Style Extraction failed:', error);
    }
}

// --- MAIN EXECUTION ---

async function runAllExamples() {
    console.log("=================================================");
    console.log("  HYPERXGEN BACKEND/GEMINI EXAMPLES");
    console.log("=================================================");

    await runMonogramSynthesisExample();
    await runVectorSynthesisExample();
    await runTypoSynthesisExample();
    await runStyleExtractionExample();

    console.log("\n--- All examples finished ---");
}

// Fix: Commented out Node.js-specific CLI execution logic that causes build errors in a browser environment.
// This block is intended for backend/CLI testing only and is not part of the main application bundle.
/*
if (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) {
    if (process.env.GEMINI_API_KEY === 'PLACEHOLDER_API_KEY') {
        console.error("\nERROR: GEMINI_API_KEY is a placeholder. Please create a .env file and set your API key.");
    } else {
       // Check if being run directly from node
       if (typeof require !== 'undefined' && require.main === module) {
          runAllExamples();
       }
    }
}
*/