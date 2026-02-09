
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PanelMode } from '../types.ts';

export const DESIGN_FIDELITY_TOKENS = {
  GENERAL: [
    "professional graphic design, contemporary aesthetic, high-fidelity rendering, clean execution, intentional design choice"
  ],
  [PanelMode.VECTOR]: [
    "strictly flat vector illustration, safe for work, professional graphic design aesthetic",
    "clean silhouettes, intentional negative space, bold color storytelling, vector-ready art",
    "modern digital illustration, cheerful and communicative mood, simple shapes, crisp edges",
    "solid flat fills, zero gradients, uniform color blocks, high contrast palette",
    "simplified expressive forms, geometric character construction, 4-8 bold saturated colors"
  ],
  [PanelMode.TYPOGRAPHY]: [
    "word as art, typography as primary subject, cohesive visual shape, legible and artistic",
    "clean glyph construction, mathematical balance, legible and aesthetic form",
    "no environmental scenes, solid background, focused typographic execution",
    "high-contrast letterforms, artistic stroke treatment, vector-sharp glyph edges"
  ],
  [PanelMode.MONOGRAM]: [
    "identity-focused mark, recognizable elegance, balanced geometric forms",
    "symmetrical geometry, clean line work, scalable vector precision",
    "letterform discernibility, negative space optimization, balanced weights"
  ],
  [PanelMode.EXTRACTOR]: [
    "style analysis mode, visual language decoding, aesthetic forensic analysis",
    "color harmony extraction, form language deconstruction",
    "reusable style preset creation, prompt template generation"
  ]
};

/**
 * Injects design-focused fidelity tokens appropriate for the specific mode.
 */
export function injectAntiCensor(prompt: string, mode?: PanelMode): string {
  let tokenSet = DESIGN_FIDELITY_TOKENS.GENERAL;
  
  if (mode && DESIGN_FIDELITY_TOKENS[mode]) {
    tokenSet = [...DESIGN_FIDELITY_TOKENS[mode], ...DESIGN_FIDELITY_TOKENS.GENERAL];
  }

  // Shuffle and select a limited number of tokens to keep the prompt clean
  const shuffledTokens = [...tokenSet].sort(() => Math.random() - 0.5);
  const selectedTokens = shuffledTokens.slice(0, 3);
  
  return selectedTokens.length > 0 
    ? `${selectedTokens.join(', ')}, ${prompt}` 
    : prompt;
}
