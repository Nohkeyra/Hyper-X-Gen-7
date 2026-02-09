
import { PanelMode } from '../types.ts';

export interface Preset {
  id: string;
  name: string;
  description: string;
  type: PanelMode;
  prompt: string;
  category: string;
  parameters?: Record<string, any>;
  filter?: string;
}

export interface PresetLibrary {
  title: string;
  items: Preset[];
}

/**
 * FIXED: PresetRegistry must contain an object with a 'libraries' array
 * as expected by the panel components (Vector, Typography, Monogram, Filters).
 */
export type PresetRegistry = {
  [key: string]: {
    libraries: PresetLibrary[];
  };
};

export const PRESET_REGISTRY: PresetRegistry = {
  VECTOR: {
    libraries: [
      {
        title: "REFINED_ILLUSTRATION",
        items: [
          {
            id: "vec-standard",
            name: "Standard Vector",
            description: "Balanced simplification. 6-8 colors.",
            type: PanelMode.VECTOR,
            prompt: "flat vector illustration style, bold colors, clean design",
            category: "Illustration Engine",
            parameters: { complexity: 'Standard', outline: 'None', mood: 'Cheerful' }
          },
          {
            id: "vec-minimal",
            name: "Minimal Icon",
            description: "Extreme simplification. 3-4 colors.",
            type: PanelMode.VECTOR,
            prompt: "minimalist flat vector illustration, simple shapes",
            category: "Illustration Engine",
            parameters: { complexity: 'Minimal', outline: 'None', mood: 'Professional' }
          },
          {
            id: "vec-detailed",
            name: "Detailed Brand",
            description: "Complex forms. 8+ colors allowed.",
            type: PanelMode.VECTOR,
            prompt: "detailed flat vector illustration, premium style",
            category: "Illustration Engine",
            parameters: { complexity: 'Detailed', outline: 'Medium-Bold', mood: 'Communicative' }
          }
        ]
      }
    ]
  },
  TYPOGRAPHY: {
    libraries: [
      {
        title: "WORD_ART_DNA",
        items: [
          {
            id: "typo-grunge",
            name: "Grunge",
            description: "Distressed, textured urban typography.",
            type: PanelMode.TYPOGRAPHY,
            prompt: "distressed grunge typography logo, paint splatters",
            category: "Textured"
          },
          {
            id: "typo-neon",
            name: "Neon",
            description: "Vibrant glowing gas tubes. Glowing glow.",
            type: PanelMode.TYPOGRAPHY,
            prompt: "glowing neon gas tube typography logo",
            category: "Glowing"
          },
          {
            id: "typo-elegant",
            name: "Elegant",
            description: "Premium gold and luxury script.",
            type: PanelMode.TYPOGRAPHY,
            prompt: "elegant serif luxury typography logo, gold palette",
            category: "Luxury"
          }
        ]
      }
    ]
  },
  MONOGRAM: {
    libraries: [
      {
        title: "REFINED_LATTICE",
        items: [
          {
            id: "mono-corporate",
            name: "Corporate Seal",
            description: "Official documents, certifications.",
            type: PanelMode.MONOGRAM,
            prompt: "official corporate seal monogram, perfect radial",
            category: "Professional",
            parameters: { symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High' }
          },
          {
            id: "mono-luxury",
            name: "Luxury Brand",
            description: "Elegant curves, gold/silver palette.",
            type: PanelMode.MONOGRAM,
            prompt: "luxury brand monogram, vertical mirror",
            category: "Luxury",
            parameters: { symmetry: 'Vertical Mirror', container: 'Suggested', densityRatio: '1:2', legibility: 'Medium-High' }
          }
        ]
      }
    ]
  },
  FILTERS: {
    libraries: [
      {
        title: "IMAGE_FILTERS",
        items: [
          // Added missing prompt property to satisfy Preset interface requirement
          { 
            id: "filter-bw", 
            name: "Black & White", 
            description: "Spectral monochrome conversion.", 
            type: PanelMode.FILTERS, 
            filter: "grayscale(100%)", 
            category: "Basic Adjustments",
            prompt: "black and white conversion"
          },
          { 
            id: "filter-sepia", 
            name: "Sepia Tone", 
            description: "Warm-spectrum chroma shift.", 
            type: PanelMode.FILTERS, 
            filter: "sepia(100%)", 
            category: "Basic Adjustments",
            prompt: "sepia tone adjustment"
          }
        ]
      }
    ]
  }
};

/**
 * FIXED: Updated helper to navigate nested libraries structure.
 */
export function getPresetsByMode(mode: PanelMode): Preset[] {
  const modeKey = mode.toUpperCase();
  if (!PRESET_REGISTRY[modeKey]) return [];
  return PRESET_REGISTRY[modeKey].libraries.flatMap(lib => lib.items);
}

/**
 * FIXED: Updated search to navigate nested libraries structure.
 */
export function findPresetById(id: string): Preset | undefined {
  for (const key in PRESET_REGISTRY) {
    const preset = PRESET_REGISTRY[key].libraries
      .flatMap(lib => lib.items)
      .find(item => item.id === id);
    if (preset) return preset;
  }
  return undefined;
}
