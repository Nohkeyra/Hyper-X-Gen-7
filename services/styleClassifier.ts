
import { PanelMode, StyleCategory } from '../types.ts';
import { PRESET_REGISTRY } from '../presets/index.ts';

export class StyleClassifier {
  /**
   * Auto-detect which panel a style belongs to
   */
  // Refined return type to strictly use StyleCategory enum
  static classifyStyle(styleDescription: string, features?: any): {
    category: StyleCategory;
    confidence: number;
    recommendedPanel: PanelMode;
    matchingPresets: string[];
  } {
    const keywords = this.extractKeywords(styleDescription.toLowerCase());
    
    // 1. Check for Graffiti Specificity (Master Rules Override)
    const graffitiScore = this.calculateGraffitiScore(keywords);
    if (graffitiScore > 65) {
      return {
        category: StyleCategory.GRAFFITI,
        confidence: graffitiScore,
        recommendedPanel: PanelMode.TYPOGRAPHY,
        matchingPresets: this.findMatchingPresets(StyleCategory.TYPOGRAPHY, keywords, styleDescription)
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
    
    // Find matching presets
    const matchingPresets = this.findMatchingPresets(
      winner.category as StyleCategory,
      keywords,
      styleDescription
    );
    
    return {
      category: winner.category as StyleCategory,
      confidence: winner.score,
      recommendedPanel: this.mapCategoryToPanel(winner.category as StyleCategory),
      matchingPresets
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
    if (keywords.some(k => ['stacked', 'radial', 'symmetr', 'mirror', 'radial', 'centered'].includes(k))) score += 30;
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
  
  /**
   * Extract architectural keywords only, ignoring visual content/subjects.
   */
  public static extractKeywords(text: string): string[] {
    const stopWords = ['the', 'and', 'for', 'with', 'style', 'design', 'art', 'image', 'photo', 'picture', 'draw', 'look', 'shows', 'contains', 'background'];
    
    // Subjects to explicitly ignore
    const visualSubjects = [
      'cat', 'dog', 'person', 'human', 'man', 'woman', 'tree', 'car', 'animal', 
      'nature', 'object', 'thing', 'bird', 'fish', 'landscape', 'mountain', 
      'face', 'body', 'hand', 'flower', 'fruit', 'food', 'drink', 'bottle'
    ];
    
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
  
  private static findMatchingPresets(
    category: StyleCategory,
    keywords: string[],
    description: string
  ): string[] {
    const panelMode = this.mapCategoryToPanel(category);
    const registry = PRESET_REGISTRY[panelMode.toUpperCase()];
    if (!registry) return [];
    
    const matches: { id: string; score: number }[] = [];
    const allPresets = registry.libraries.flatMap(lib => lib.items);
    
    allPresets.forEach(preset => {
      let score = 0;
      const presetText = `${preset.name} ${preset.description} ${preset.prompt}`.toLowerCase();
      keywords.forEach(keyword => {
        if (presetText.includes(keyword)) score += 25; // High weight for architectural keyword matches
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
      default: return PanelMode.VECTOR;
    }
  }
}
