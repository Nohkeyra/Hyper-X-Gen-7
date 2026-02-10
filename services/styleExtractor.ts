import { KernelConfig, ExtractionResult, PanelMode, StyleCategory } from '../types.ts';
import { StyleClassifier } from './styleClassifier.ts';
import { extractStyleFromImage } from './geminiService.ts';

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
    
    // 3. Classify the style using the deterministic StyleClassifier logic
    const classification = StyleClassifier.classifyStyle(
      description,
      (extractionResult as any).features
    );
    
    // 4. Enrich the extraction result with classification metadata
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
        keywords: StyleClassifier.extractKeywords(description),
        matchingPresets: classification.matchingPresets
      }
    };
    
    return {
      extraction,
      ...classification
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
    const keywords = StyleClassifier.extractKeywords(description);
    if (keywords.length >= 2) {
      return `${keywords[0]?.toUpperCase()}_${keywords[1]?.toUpperCase()}_DNA`;
    }
    return "ARCHITECTURAL_PRESET_V2";
  }
}
