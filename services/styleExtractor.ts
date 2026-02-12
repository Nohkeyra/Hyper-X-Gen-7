


import { KernelConfig, ExtractionResult, PanelMode, StyleCategory } from '../types.ts';
import { classifyStyleWithAI, extractStyleFromImage } from './geminiService.ts';
import { PRESET_REGISTRY } from '../presets/index.ts';

// --- HELPER FUNCTIONS (moved from StyleClassifier) ---

function extractKeywords(text: string): string[] {
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

function findMatchingPresets(panelMode: PanelMode, description: string): string[] {
    const keywords = extractKeywords(description);
    const registryKey = panelMode.toUpperCase();
    const registry = PRESET_REGISTRY[registryKey];
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

export class EnhancedStyleExtractor {
  /**
   * Extract style with auto-categorization
   */
  static async extractStyleWithCategory(
    imageUrl: string,
    kernelConfig: KernelConfig,
    userDescription?: string
  ): Promise<{
    extraction: ExtractionResult;
    category: StyleCategory;
    confidence: number;
    recommendedPanel: PanelMode;
    matchingPresets: string[];
  }> {
    // 1. Extract style traits using Subject-Agnostic Gemini Vision
    const extractionResult = await this.extractStyleFeatures(imageUrl, kernelConfig);
    
    // 2. Determine description (strictly design-focused)
    const description = userDescription || extractionResult.description || "Architectural design DNA.";
    
    // 3. Classify the style using the new AI-powered classifier
    const classification = await classifyStyleWithAI(
      description,
      extractionResult.features,
      kernelConfig
    );
    
    // 4. Find matching presets locally
    const matchingPresets = findMatchingPresets(classification.recommendedPanel, description + " " + extractionResult.promptTemplate);
    
    // 5. Enrich the extraction result
    const extraction: ExtractionResult = {
      ...extractionResult,
      id: `dna-${Date.now()}`,
      name: extractionResult.name || this.generateStyleName(description),
      extractedFrom: imageUrl,
      confidence: classification.confidence,
      metadata: {
        category: classification.category,
        confidence: classification.confidence,
        recommendedPanel: classification.recommendedPanel,
        keywords: extractKeywords(description),
        matchingPresets: matchingPresets
      }
    };
    
    return {
      extraction,
      ...classification,
      matchingPresets
    };
  }
  
  /**
   * Extract architectural traits for preset mapping via Gemini.
   * Mandates subject-agnostic analysis.
   */
  private static async extractStyleFeatures(
    imageUrl: string,
    kernelConfig: KernelConfig
  ): Promise<ExtractionResult> {
    const prompt = `
      SYNTHESIS_PARAM_EXTRACTION_PROTOCOL:
      Identify ONLY the architectural design logic of this image.
      MANDATORY: NO SUBJECTS. Do not mention what is in the image (cat, person, house, etc.).
      ONLY IDENTIFY:
      - Vector markers (Complexity, Outline weight, Mood, Shape language).
      - Typography markers (Grunge, Neon, Art Deco, Geometric glyphs).
      - Monogram markers (Interlocked, Symmetrical, Radial, Block).
      
      Your 'description' and 'promptTemplate' must describe a style that can be applied to ANY new subject.
    `;
    
    return await extractStyleFromImage(imageUrl, kernelConfig, prompt);
  }

  /**
   * Generate a functional name based on style keywords
   */
  private static generateStyleName(description: string): string {
    const keywords = extractKeywords(description);
    if (keywords.length >= 2) {
      return `${keywords[0]?.toUpperCase()}_${keywords[1]?.toUpperCase()}_DNA`;
    }
    return "ARCHITECTURAL_PRESET_V2";
  }
}