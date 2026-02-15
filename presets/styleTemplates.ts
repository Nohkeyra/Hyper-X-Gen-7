
import { ExtractionResult } from '../types.ts';

export const DNA_TEMPLATES: Record<string, ExtractionResult> = {
  "SWISS_MINIMAL": {
    domain: "Graphic Design",
    category: "Modernism",
    name: "SWISS_MINIMAL",
    description: "Grid-based modularity with heavy focus on Akzidenz-Grotesk adjacent forms and primary contrast.",
    styleAuthenticityScore: 98,
    palette: ["#FFFFFF", "#000000", "#FF0000"],
    mood: ["Authoritative", "Clean", "Structured"],
    formLanguage: "Geometric Sans",
    styleAdjectives: ["Modular", "Grid-locked", "Bold"],
    technique: "International Typographic Style",
    promptTemplate: "Minimalist swiss style design, high contrast grid, bold sans-serif, clean negative space."
  },
  "NEON_BRUTALIST": {
    domain: "Digital Art",
    category: "Brutalism",
    name: "NEON_BRUTALIST",
    description: "Raw architectural weight meets electric digital vibrancy. High contrast, aggressive forms.",
    styleAuthenticityScore: 92,
    palette: ["#050505", "#00FF41", "#FF00FF"],
    mood: ["Aggressive", "Electronic", "Unapologetic"],
    formLanguage: "Architectural Heavy",
    styleAdjectives: ["Glow", "Raw", "Structural"],
    technique: "Anti-design digital",
    promptTemplate: "Neon brutalist aesthetic, glowing outlines, heavy blocky silhouettes, pitch black background."
  }
};
