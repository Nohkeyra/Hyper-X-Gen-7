
import { PanelMode, StyleCategory } from '../types.ts';

export interface StyleScore {
  category: StyleCategory;
  score: number;
  reason: string;
}

export class StyleClassifier {
  static analyzeKeywords(text: string): string[] {
    const keywords = text.toLowerCase().match(/\w+/g) || [];
    const stopWords = new Set(['the', 'and', 'for', 'with', 'style', 'design', 'art', 'image']);
    return keywords.filter(w => w.length > 2 && !stopWords.has(w));
  }

  static getRecommendedPanel(category: StyleCategory): PanelMode {
    switch (category) {
      case StyleCategory.MONOGRAM: return PanelMode.MONOGRAM;
      case StyleCategory.TYPOGRAPHY: return PanelMode.TYPOGRAPHY;
      case StyleCategory.VECTOR: return PanelMode.VECTOR;
      case StyleCategory.FILTER: return PanelMode.FILTERS;
      case StyleCategory.EMBLEM: return PanelMode.EMBLEM_FORGE;
      default: return PanelMode.VECTOR;
    }
  }

  static heuristicClassify(description: string, features: any): StyleCategory {
    const d = description.toLowerCase();
    
    if (features?.hasLetters && (d.includes('monogram') || d.includes('interlocked') || d.includes('initial'))) {
      return StyleCategory.MONOGRAM;
    }
    
    if (features?.hasLetters || d.includes('typography') || d.includes('text') || d.includes('font')) {
      return StyleCategory.TYPOGRAPHY;
    }
    
    if (d.includes('emblem') || d.includes('crest') || d.includes('shield') || d.includes('badge')) {
      return StyleCategory.EMBLEM;
    }
    
    if (d.includes('filter') || d.includes('effect') || d.includes('spectral')) {
      return StyleCategory.FILTER;
    }

    return StyleCategory.VECTOR;
  }
}
