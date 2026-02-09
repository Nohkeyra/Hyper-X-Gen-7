import { TypographyPreset, VectorPreset, MonogramPreset, PresetItem, PresetCategory, PanelMode } from '../types.ts';

/* =========================================================
   TYPOGRAPHY — 5 PRESET PERFECT SET
   ========================================================= */

export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
  {
    id: 'typo-urban-fracture',
    name: 'Urban Fracture',
    category: 'Graffiti Kinetic',
    description: 'Aggressive deconstructed graffiti letterforms with kinetic energy.',
    prompt: 'Graffiti-inspired typography with fractured strokes, sharp cuts, aggressive flow, and urban motion.',
    parameters: {
      weight: 'bold',
      terminals: 'spike',
      capHeight: 110,
      strokeContrast: 80,
      splicingIntensity: 70,
      interlockGutter: 15,
      xHeightBias: 95,
      ligatureThreshold: 'aggressive',
    },
  },
  {
    id: 'typo-brutalist-ink',
    name: 'Brutalist Ink',
    category: 'Industrial Hand',
    description: 'Heavy raw strokes with blunt industrial presence.',
    prompt: 'Brutalist hand-drawn typography with thick strokes, blunt terminals, and mechanical weight.',
    parameters: {
      weight: 'ultra',
      terminals: 'clipped',
      capHeight: 100,
      strokeContrast: 20,
      splicingIntensity: 10,
      interlockGutter: 5,
      xHeightBias: 100,
      ligatureThreshold: 'manual',
    },
  },
  {
    id: 'typo-calligraphic-surge',
    name: 'Calligraphic Surge',
    category: 'Expressive Script',
    description: 'Fluid calligraphic motion with dramatic pressure shifts.',
    prompt: 'Expressive calligraphic typography with flowing strokes, dynamic pressure, and organic rhythm.',
    parameters: {
      weight: 'regular',
      terminals: 'flare',
      capHeight: 120,
      strokeContrast: 90,
      splicingIntensity: 25,
      interlockGutter: 12,
      xHeightBias: 105,
      ligatureThreshold: 'auto',
    },
  },
  {
    id: 'typo-neo-grotesk',
    name: 'Neo Grotesk Warp',
    category: 'Modern Display',
    description: 'Clean modern typography pushed into controlled distortion.',
    prompt: 'Modern grotesk typography with clean structure, subtle warping, and controlled rhythm.',
    parameters: {
      weight: 'regular',
      terminals: 'rounded',
      capHeight: 100,
      strokeContrast: 40,
      splicingIntensity: 15,
      interlockGutter: 10,
      xHeightBias: 100,
      ligatureThreshold: 'auto',
    },
  },
  {
    id: 'typo-cyber-sigil',
    name: 'Cyber Sigil',
    category: 'Futurist Glyph',
    description: 'Sharp synthetic glyphs with encoded structure.',
    prompt: 'Futuristic glyph-based typography with angular cuts, synthetic structure, and coded rhythm.',
    parameters: {
      weight: 'bold',
      terminals: 'spike',
      capHeight: 95,
      strokeContrast: 60,
      splicingIntensity: 50,
      interlockGutter: 8,
      xHeightBias: 90,
      ligatureThreshold: 'manual',
    },
  },
];

/* =========================================================
   VECTOR — 5 PRESET PERFECT SET
   ========================================================= */

export const VECTOR_PRESETS: VectorPreset[] = [
  {
    id: 'vec-geometric-core',
    name: 'Geometric Core',
    category: 'Bauhaus Minimal',
    description: 'Pure geometric balance using fundamental shapes.',
    prompt: 'Minimalist geometric vector logo using circles, squares, and strict proportional balance.',
  },
  {
    id: 'vec-totemic-mark',
    name: 'Totemic Mark',
    category: 'Symbolic Emblem',
    description: 'Bold symbolic form with strong silhouette.',
    prompt: 'Iconic totemic vector symbol with heavy silhouette and cultural emblem presence.',
  },
  {
    id: 'vec-parametric-flow',
    name: 'Parametric Flow',
    category: 'Algorithmic Form',
    description: 'Procedural geometry with rhythmic variation.',
    prompt: 'Parametric vector form with algorithmic curves, rhythmic structure, and generative balance.',
  },
  {
    id: 'vec-organic-signal',
    name: 'Organic Signal',
    category: 'Biomorphic Vector',
    description: 'Fluid organic shapes with natural motion.',
    prompt: 'Organic flowing vector shapes inspired by natural motion and soft curvature.',
  },
  {
    id: 'vec-hybrid-construct',
    name: 'Hybrid Construct',
    category: 'Mixed Logic',
    description: 'Fusion of geometry and organic distortion.',
    prompt: 'Hybrid vector mark combining strict geometry with organic distortion.',
  },
];

/* =========================================================
   MONOGRAM — 5 PRESET PERFECT SET
   ========================================================= */

export const MONOGRAM_PRESETS: MonogramPreset[] = [
  {
    id: 'mono-royal-seal',
    name: 'Royal Seal',
    category: 'Classic Emblem',
    description: 'Formal monogram with heritage authority.',
    prompt: 'Classic royal monogram with symmetrical balance and emblematic authority.',
    parameters: {
      layoutMode: 'stacked',
      initialCount: 2,
      orientation: 'horizontal',
      intersectionGap: 2,
      autoWeave: true,
      strokeWeight: 'bold',
      terminalShape: 'blunt',
      cornerRadius: 10,
      aspectRatio: 'normal',
      geoFrame: 'shield',
      opticalKerning: true,
    },
  },
  {
    id: 'mono-modern-interlock',
    name: 'Modern Interlock',
    category: 'Contemporary Identity',
    description: 'Clean interlocking initials with modern clarity.',
    prompt: 'Modern interlocking monogram with precise spacing and contemporary balance.',
    parameters: {
      layoutMode: 'interlocked',
      initialCount: 2,
      orientation: 'horizontal',
      intersectionGap: 2,
      autoWeave: true,
      strokeWeight: 'regular',
      terminalShape: 'rounded',
      cornerRadius: 20,
      aspectRatio: 'normal',
      geoFrame: 'none',
      opticalKerning: true,
    },
  },
  {
    id: 'mono-glyph-knot',
    name: 'Glyph Knot',
    category: 'Dense Symbol',
    description: 'Tightly woven symbolic glyph.',
    prompt: 'Dense woven monogram forming a compact symbolic glyph.',
    parameters: {
      layoutMode: 'interlocked',
      initialCount: 3,
      orientation: 'diagonal',
      intersectionGap: 1,
      autoWeave: true,
      strokeWeight: 'bold',
      terminalShape: 'sheared',
      cornerRadius: 5,
      aspectRatio: 'condensed',
      geoFrame: 'none',
      opticalKerning: false,
    },
  },
  {
    id: 'mono-architect-frame',
    name: 'Architect Frame',
    category: 'Structured Mark',
    description: 'Monogram constrained within geometric structure.',
    prompt: 'Architectural monogram constrained within a strong geometric frame.',
    parameters: {
      layoutMode: 'block',
      initialCount: 2,
      orientation: 'vertical',
      intersectionGap: 3,
      autoWeave: false,
      strokeWeight: 'regular',
      terminalShape: 'blunt',
      cornerRadius: 0,
      aspectRatio: 'normal',
      geoFrame: 'hexagon',
      opticalKerning: true,
    },
  },
  {
    id: 'mono-sigil-minimal',
    name: 'Sigil Minimal',
    category: 'Abstract Mark',
    description: 'Ultra-minimal abstract monogram.',
    prompt: 'Minimal abstract monogram distilled into a symbolic sigil.',
    parameters: {
      layoutMode: 'mirrored',
      initialCount: 1,
      orientation: 'horizontal',
      intersectionGap: 4,
      autoWeave: false,
      strokeWeight: 'hairline',
      terminalShape: 'tapered',
      cornerRadius: 30,
      aspectRatio: 'expanded',
      geoFrame: 'none',
      opticalKerning: true,
    },
  },
];


const mapVectorPresetToPresetItem = (preset: VectorPreset): PresetItem => ({
  id: preset.id,
  name: preset.name,
  category: preset.category,
  description: preset.description,
  type: 'vector',
  prompt: preset.prompt,
});

const mapTypoPresetToPresetItem = (preset: TypographyPreset): PresetItem => ({
  id: preset.id,
  name: preset.name,
  category: preset.category,
  description: preset.description,
  type: 'typography',
  prompt: preset.prompt,
  parameters: preset.parameters,
});

const mapMonoPresetToPresetItem = (preset: MonogramPreset): PresetItem => ({
  id: preset.id,
  name: preset.name,
  category: preset.category,
  description: preset.description,
  type: 'monogram',
  prompt: preset.prompt,
  parameters: preset.parameters,
});

const groupItemsByCategory = <T extends { category: string }>(items: T[], itemMapper: (item: T) => PresetItem): PresetCategory[] => {
  const categoryMap: Record<string, PresetItem[]> = {};
  items.forEach(item => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = [];
    }
    categoryMap[item.category].push(itemMapper(item));
  });
  return Object.entries(categoryMap).map(([title, items]) => ({
    title,
    items,
  }));
};

const VECTOR_PRESETS_CATEGORIZED: PresetCategory[] = groupItemsByCategory(VECTOR_PRESETS, mapVectorPresetToPresetItem);
const TYPOGRAPHY_PRESETS_CATEGORIZED: PresetCategory[] = groupItemsByCategory(TYPOGRAPHY_PRESETS, mapTypoPresetToPresetItem);
const MONOGRAM_PRESETS_CATEGORIZED: PresetCategory[] = groupItemsByCategory(MONOGRAM_PRESETS, mapMonoPresetToPresetItem);

// Note: Filters are not part of the new perfect set, this will be empty to avoid breaking FilterPanel.
const FILTERS_PRESETS: PresetCategory[] = [];

export const PRESET_REGISTRY = {
  VECTOR: { libraries: VECTOR_PRESETS_CATEGORIZED },
  TYPOGRAPHY: { libraries: TYPOGRAPHY_PRESETS_CATEGORIZED },
  MONOGRAM: { libraries: MONOGRAM_PRESETS_CATEGORIZED },
  FILTERS: { libraries: FILTERS_PRESETS },
};

export const VECTOR_FIDELITY_TOKENS = [
  "mathematical precision, constructed geometry, vector-perfect curves, bezier path optimization",
  "minimalist geometric forms, Bauhaus-inspired composition, structural balance, architectural intent",
  "Swiss design principles, grid-based alignment, intentional white space, typographic hierarchy",
  "Constructivist geometric shapes, primary form deconstruction, solid fills, zero gradients",
  "uniform line weights, mono-weight strokes, geometric purity, mathematical tessellation",
  "high-contrast flat color palette, Pantone-accurate fills, solid opaque surfaces, zero textures",
  "minimalist visual hierarchy, legibility-first construction, clean isolated subject, mathematical kerning",
  "geometric abstraction, simplified silhouette, thick uniform outlines, iconic visual strength",
  "flat vector aesthetic, minimal detail for maximum impact, hard-edged shapes, crisp geometric borders",
  "monochrome high-contrast seal, symmetric geometric monogram, interlocked character geometry",
  "infinite scalability logic, vector-ready outlines, sharp geometric edges, mathematically defined paths",
  "clean subject isolation, white background purity, zero raster noise, zero artifacts",
  "geometric precision, modular construction, repeating geometric motifs, rhythmic symmetry"
];

export const TYPOGRAPHY_FIDELITY_TOKENS = [
  "kinetic flow, gestural movement, high-energy strokes, dynamic rhythm",
  "expressive calligraphy, sharp terminals, aggressive angles, urban wildstyle",
  "chisel-tip logic, fat cap spray, graffiti-inspired forms, explosive motion",
  "hand-drawn authenticity, raw ink strokes, brutalist weight, strong presence",
  "fluid brushwork, dramatic pressure shifts, organic script, flowing ligatures",
  "deconstructed letterforms, fractured geometry, sharp cuts, interlocking shapes",
  "synthetic glyphs, angular structure, coded rhythm, futuristic sigils",
  "clean modern grotesk, controlled distortion, subtle warping, precise kerning",
  "heavy industrial weight, blunt terminals, mechanical precision, solid form",
  "high-impact visual density, razor-sharp edges, urban decay aesthetic, controlled chaos",
  "legibility secondary to energy, structural coherence, bold visual statement",
  "monoline construction, rounded terminals, neo-grotesk clarity, minimalist typography"
];

/**
 * Injects style-focused fidelity tokens to ensure the model adheres to 
 * kinetic and stylistic construction rules.
 */
export function injectPresetTokens(prompt: string, mode: PanelMode): string {
  let tokenSet;
  switch (mode) {
    case PanelMode.TYPOGRAPHY:
      tokenSet = TYPOGRAPHY_FIDELITY_TOKENS;
      break;
    case PanelMode.VECTOR:
    case PanelMode.MONOGRAM:
    default:
      tokenSet = VECTOR_FIDELITY_TOKENS;
      break;
  }

  const shuffledTokens = [...tokenSet].sort(() => Math.random() - 0.5);
  // Pick a random number of tokens to inject, between 2 and 3
  const tokensToInject = shuffledTokens.slice(0, Math.floor(Math.random() * 2) + 2); 
  
  return `${tokensToInject.join(', ')}, ${prompt}`;
}
