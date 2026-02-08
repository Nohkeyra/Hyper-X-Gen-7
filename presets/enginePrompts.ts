import { PresetCategory, PresetItem, TypographyPreset, MonogramPreset } from '../types.ts';

// Optional: Locks or global directives can remain as before
export const GLOBAL_VECTOR_LOCK = "[VECTOR_ENGINE_LOCK] Enforce pure geometry";
export const GLOBAL_TYPO_LOCK = "[TYPO_ENGINE_LOCK] Enforce stylistic DNA";
export const GLOBAL_MONO_LOCK = "[MONO_ENGINE_LOCK] Enforce radial symmetry";
export const GLOBAL_STYLE_EXTRACTOR_LOCK = "[STYLE_EXTRACTOR_LOCK] Preserve visual fidelity";

export const typographyPresets: TypographyPreset[] = [
  {
    name: "Urban Graffiti",
    prompt: "High-energy street-style lettering with wildstyle flow",
    description: "Dynamic graffiti prompt for maximal edge and flow",
    capHeight: 100,
    strokeContrast: 50,
    terminals: "flare",
    weight: "bold",
    splicingIntensity: 30,
    interlockGutter: 5,
    xHeightBias: 100,
    ligatureThreshold: "aggressive"
  },
  {
    name: "Minimal Serif",
    prompt: "Clean serif lettering with precise kerning and geometric balance",
    description: "Minimal serif prompt for clarity and elegance",
    capHeight: 100,
    strokeContrast: 30,
    terminals: "rounded",
    weight: "regular",
    splicingIntensity: 10,
    interlockGutter: 4,
    xHeightBias: 100,
    ligatureThreshold: "auto"
  },
  {
    name: "Techno Block",
    prompt: "Modular, futuristic block lettering with sharp edges",
    description: "Futuristic block prompt for high-tech logos",
    capHeight: 100,
    strokeContrast: 40,
    terminals: "blunt",
    weight: "bold",
    splicingIntensity: 20,
    interlockGutter: 6,
    xHeightBias: 100,
    ligatureThreshold: "manual"
  }
];

export const monogramPresets: MonogramPreset[] = [
  {
    name: "Radial Fusion",
    prompt: "Monogram with radial symmetry and interlocked initials",
    description: "Radial interlock for strong geometric identity",
    layoutMode: "interlocked",
    initialCount: 2,
    orientation: "horizontal",
    intersectionGap: 2,
    autoWeave: true,
    strokeWeight: "regular",
    terminalShape: "blunt",
    cornerRadius: 0,
    aspectRatio: "normal",
    geoFrame: "none",
    opticalKerning: true
  },
  {
    name: "Shielded Crest",
    prompt: "Monogram within a shield frame with angular symmetry",
    description: "Bold shield identity for logos",
    layoutMode: "stacked",
    initialCount: 2,
    orientation: "vertical",
    intersectionGap: 1.5,
    autoWeave: false,
    strokeWeight: "bold",
    terminalShape: "tapered",
    cornerRadius: 5,
    aspectRatio: "normal",
    geoFrame: "shield",
    opticalKerning: true
  },
  {
    name: "Hexagonal Seal",
    prompt: "Interlocked initials in hexagonal symmetry",
    description: "Compact hex seal for emblematic use",
    layoutMode: "block",
    initialCount: 3,
    orientation: "diagonal",
    intersectionGap: 2,
    autoWeave: true,
    strokeWeight: "regular",
    terminalShape: "rounded",
    cornerRadius: 3,
    aspectRatio: "condensed",
    geoFrame: "hexagon",
    opticalKerning: true
  }
];

export interface EnginePrompt {
  id: string;
  type: "vector" | "typography" | "monogram" | "filter";
  category: string;
  name: string;
  description: string;
  prompt: string;
  filter?: string;
}


export const ENGINE_PROMPTS: EnginePrompt[] = [
  {
    id: "sig-vec-01",
    type: "vector",
    category: "Vector Core",
    name: "Omega Lattice Alpha",
    prompt: "Complex geometric lattice with modular nodes and precise symmetry",
    description: "Vector lattice prompt emphasizing precision and symmetry",
  },
  {
    id: "sig-vec-02",
    type: "vector",
    category: "Vector Core",
    name: "Quantum Grid",
    prompt: "Interlocking grid structure with high contrast and scalable vectors",
    description: "Minimalist vector grid for scalable designs",
  },
  {
    id: "sig-vec-03",
    type: "vector",
    category: "Vector Core",
    name: "Prismatic Flow",
    prompt: "Dynamic geometric shapes forming continuous prismatic flow",
    description: "Prismatic abstract prompt for vector compositions",
  }
];

export const groupAllPromptsByCategory = (type: "vector" | "typography" | "monogram" | "filter"): PresetCategory[] => {
  const filtered = ENGINE_PROMPTS.filter(p => p.type === type);
  const categories = Array.from(new Set(filtered.map(p => p.category)));
  
  return categories.map(catName => ({
    title: catName,
    items: filtered
      .filter(p => p.category === catName)
      .map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        filter: p.filter,
        prompt: p.prompt,
        type: p.type
      } as PresetItem))
  }));
};

// Add a small utility to inject style tokens per call
export function injectPresetTokens(prompt: string): string {
  const tokens = [
    "geometric purity",
    "vector-perfect curves",
    "sharp edges",
    "high-contrast minimalism",
    "structural balance",
    "modular symmetry",
    "architectural intent",
    "interlocked forms",
    "typographic hierarchy",
    "mathematical tessellation",
  ];
  
  // Pick 2 random tokens to prepend for uniqueness
  const randomTokens = [tokens[Math.floor(Math.random() * tokens.length)], tokens[Math.floor(Math.random() * tokens.length)]];
  
  return `${randomTokens.join(', ')}, ${prompt}`;
}