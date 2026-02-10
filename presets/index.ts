import { PanelMode, Preset, VectorPreset, TypographyPreset, MonogramPreset, FilterPreset, PresetCategory, PresetCategoryType } from '../types.ts';

/**
 * HYPERXGEN PRESET REGISTRY v7.6 - OMEGA DEFINITIVE FINAL EDITION
 * The absolute collection of 100+ forensic synthesis presets.
 */

export type PresetRegistry = {
  [key: string]: {
    libraries: PresetCategory[];
  };
};

export const PRESET_REGISTRY: PresetRegistry = {
  VECTOR: {
    libraries: [
      {
        id: "lib-vector-core",
        title: "ESSENTIALS",
        mobileLabel: "CORE_VEC",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "vec-logo", name: "Logo", category: "ESSENTIALS", description: "Clean geometric emblem", type: PanelMode.VECTOR, prompt: "Clean geometric emblem, monoweight strokes, high negative space", parameters: { complexity: 'Standard', outline: 'None', mood: 'Professional', background: 'White', colorCount: 4, strokeWeight: 0, style: 'Flat Design' } },
          { id: "vec-sticker-icon", name: "Sticker", category: "ESSENTIALS", description: "Flat graphic, bold strokes", type: PanelMode.VECTOR, prompt: "Flat vector sticker, bold strokes, minimal shapes", parameters: { complexity: 'Minimal', outline: 'Medium-Bold', mood: 'Cheerful', background: 'White', colorCount: 3, strokeWeight: 2, style: 'Flat Design' } },
          { id: "vec-minimalist", name: "Minimalist", category: "ESSENTIALS", description: "Few shapes, high space", type: PanelMode.VECTOR, prompt: "Minimalist vector, clean lines, maximum breathing room", parameters: { complexity: 'Minimal', outline: 'None', mood: 'Professional', background: 'White', colorCount: 2, strokeWeight: 0, style: 'Geometric' } },
          { id: "vec-technical", name: "Technical", category: "ESSENTIALS", description: "Precise geometric grids", type: PanelMode.VECTOR, prompt: "Technical diagram, precise geometric shapes, grid-aligned", parameters: { complexity: 'Standard', outline: 'Thin', mood: 'Professional', background: 'White', colorCount: 3, strokeWeight: 1, style: 'Geometric' } },
          { id: "vec-badge", name: "Badge", category: "ESSENTIALS", description: "Circular identity mark", type: PanelMode.VECTOR, prompt: "Vector badge, circular composition, professional seal", parameters: { complexity: 'Standard', outline: 'Thin', mood: 'Professional', background: 'White', colorCount: 4, strokeWeight: 1, style: 'Corporate' } },
          { id: "vec-glyph", name: "Glyph", category: "ESSENTIALS", description: "Solid black icon form", type: PanelMode.VECTOR, prompt: "Solid glyph icon, sharp edges, high contrast silhouette", parameters: { complexity: 'Minimal', outline: 'None', mood: 'Professional', background: 'White', colorCount: 1, strokeWeight: 0, style: 'Flat Design' } },
          { id: "vec-product", name: "Product Pack", category: "ESSENTIALS", description: "Vectorized product mock", type: PanelMode.VECTOR, prompt: "Clean product vector illustration, packaging focus, isometric", parameters: { complexity: 'Detailed', outline: 'Thin', mood: 'Professional', background: 'White', colorCount: 5, strokeWeight: 1, style: 'Corporate' } },
          { id: "vec-pictogram", name: "Pictogram", category: "ESSENTIALS", description: "Universal symbol language", type: PanelMode.VECTOR, prompt: "Universal pictogram symbol, rounded corners, professional signage aesthetic", parameters: { complexity: 'Minimal', outline: 'None', mood: 'Professional', background: 'White', colorCount: 2, strokeWeight: 0, style: 'Flat Design' } }
        ]
      },
      {
        id: "lib-vector-artistic",
        title: "ARTISTIC_STUDIO",
        mobileLabel: "ART_VEC",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "vec-illustration", name: "Illustration", category: "ARTISTIC", description: "Detailed layered shapes", type: PanelMode.VECTOR, prompt: "Detailed illustration, layered shapes, smooth strokes", parameters: { complexity: 'Detailed', outline: 'None', mood: 'Communicative', background: 'White', colorCount: 6, strokeWeight: 0, style: 'Organic' } },
          { id: "vec-photo-vec", name: "Photo-Style", category: "ARTISTIC", description: "High-detail vector tracing", type: PanelMode.VECTOR, prompt: "High-detail vector tracing, color accuracy prioritized", parameters: { complexity: 'Detailed', outline: 'None', mood: 'Professional', background: 'White', colorCount: 8, strokeWeight: 0, style: 'Organic' } },
          { id: "vec-line-art", name: "Line Art", category: "ARTISTIC", description: "Simplified line drawing", type: PanelMode.VECTOR, prompt: "Clean line art, uniform strokes, no fills", parameters: { complexity: 'Minimal', outline: 'Thin', mood: 'Professional', background: 'White', colorCount: 1, strokeWeight: 1, style: 'Line Art' } },
          { id: "vec-watercolor", name: "Watercolor", category: "ARTISTIC", description: "Soft flowing vector layers", type: PanelMode.VECTOR, prompt: "Watercolor style vector, transparent layers, organic edges", parameters: { complexity: 'Standard', outline: 'None', mood: 'Communicative', background: 'Soft', colorCount: 5, strokeWeight: 0, style: 'Organic' } },
          { id: "vec-painterly", name: "Painterly", category: "ARTISTIC", description: "Brush-stroke vector style", type: PanelMode.VECTOR, prompt: "Painterly vector, visible strokes, expressive forms", parameters: { complexity: 'Detailed', outline: 'None', mood: 'Cheerful', background: 'White', colorCount: 7, strokeWeight: 0, style: 'Organic' } },
          { id: "vec-sketch", name: "Pencil Sketch", category: "ARTISTIC", description: "Rough vector linework", type: PanelMode.VECTOR, prompt: "Vector sketch style, rough lines, graphite aesthetic", parameters: { complexity: 'Standard', outline: 'Thin', mood: 'Professional', background: 'White', colorCount: 2, strokeWeight: 1, style: 'Line Art' } },
          { id: "vec-botanical", name: "Botanical", category: "ARTISTIC", description: "Organic plant vectors", type: PanelMode.VECTOR, prompt: "Detailed botanical vector, organic leaf patterns, soft gradients", parameters: { complexity: 'Detailed', outline: 'None', mood: 'Communicative', background: 'Soft', colorCount: 6, strokeWeight: 0, style: 'Organic' } },
          { id: "vec-popart", name: "Pop Art", category: "ARTISTIC", description: "Bold Ben-Day dots style", type: PanelMode.VECTOR, prompt: "Pop art vector illustration, bold comic outlines, vibrant primary colors, halftone patterns", parameters: { complexity: 'Detailed', outline: 'Medium-Bold', mood: 'Cheerful', background: 'Vibrant', colorCount: 5, strokeWeight: 2, style: 'Playful' } },
          { id: "vec-lowpoly", name: "Low-Poly", category: "ARTISTIC", description: "Geometric triangle mesh", type: PanelMode.VECTOR, prompt: "Low-poly vector art, geometric triangle facets, sharp edges, 3D suggestion", parameters: { complexity: 'Standard', outline: 'None', mood: 'Professional', background: 'White', colorCount: 7, strokeWeight: 0, style: 'Geometric' } }
        ]
      },
      {
        id: "lib-vector-brutalist",
        title: "BRUTALIST_UI",
        mobileLabel: "BRUT_VEC",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "vec-raw", name: "Raw Form", category: "BRUTALIST", description: "Unaltered geometric blocks", type: PanelMode.VECTOR, prompt: "Brutalist raw vector forms, massive geometric blocks, high contrast black and red", parameters: { complexity: 'Minimal', outline: 'None', mood: 'Professional', background: 'Gray', colorCount: 2, strokeWeight: 0, style: 'Geometric' } },
          { id: "vec-hazard", name: "Hazard", category: "BRUTALIST", description: "Industrial warning aesthetic", type: PanelMode.VECTOR, prompt: "Industrial hazard vector, safety stripes, warning icons, high-visibility yellow", parameters: { complexity: 'Standard', outline: 'Medium-Bold', mood: 'Professional', background: 'Black', colorCount: 2, strokeWeight: 2, style: 'Corporate' } },
          { id: "vec-grid-lock", name: "Gridlock", category: "BRUTALIST", description: "Strict modular construction", type: PanelMode.VECTOR, prompt: "Strict grid-locked vector design, modular blocks, interlocking rectangles", parameters: { complexity: 'Detailed', outline: 'Thin', mood: 'Professional', background: 'White', colorCount: 3, strokeWeight: 1, style: 'Geometric' } }
        ]
      }
    ]
  },
  TYPOGRAPHY: {
    libraries: [
      {
        id: "lib-typo-kinetic",
        title: "KINETIC_MOTION",
        mobileLabel: "MOTION_T",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "typo-blur", name: "Speed Blur", category: "KINETIC", description: "Motion-blurred glyphs", type: PanelMode.TYPOGRAPHY, prompt: "Kinetic typography with heavy directional blur, speed trails, high contrast", parameters: { fontStyle: 'Modern', weight: 'Heavy', spacing: 'Tight', effect: 'None' } },
          { id: "typo-vibrate", name: "Vibrating", category: "KINETIC", description: "Optical frequency shift", type: PanelMode.TYPOGRAPHY, prompt: "Vibrating typography, multiple offset layers, cyan and magenta fringes", parameters: { fontStyle: 'Modern', weight: 'Bold', spacing: 'Normal', effect: 'Shadow' } },
          { id: "typo-warp", name: "Liquid Warp", category: "KINETIC", description: "Distorted fluid paths", type: PanelMode.TYPOGRAPHY, prompt: "Warped liquid typography, fluid distorted letters, melting path aesthetic", parameters: { fontStyle: 'Modern', weight: 'Bold', spacing: 'Wide', effect: 'None' } }
        ]
      },
      {
        id: "lib-typo-urban",
        title: "URBAN_SYSTEMS",
        mobileLabel: "URBAN_T",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "typo-grunge", name: "Grunge", category: "URBAN", description: "Distressed urban texture", type: PanelMode.TYPOGRAPHY, prompt: "Distressed grunge typography, rough eroded edges", parameters: { fontStyle: 'Grunge', weight: 'Bold', spacing: 'Tight', effect: 'None' } },
          { id: "typo-cyber", name: "Cyberpunk", category: "URBAN", description: "Holographic glitch style", type: PanelMode.TYPOGRAPHY, prompt: "Cyberpunk neon typography, glitch effects", parameters: { fontStyle: 'Cyberpunk', weight: 'Bold', spacing: 'Normal', effect: 'Glow' } },
          { id: "typo-neon", name: "Neon Tube", category: "URBAN", description: "Vibrant glowing gas", type: PanelMode.TYPOGRAPHY, prompt: "Glowing neon typography, dark background", parameters: { fontStyle: 'Neon', weight: 'Regular', spacing: 'Normal', effect: 'Glow' } },
          { id: "typo-street", name: "Street Block", category: "URBAN", description: "Blocky urban kinetic", type: PanelMode.TYPOGRAPHY, prompt: "Blocky street lettering, kinetic interlocking", parameters: { fontStyle: 'Grunge', weight: 'Heavy', spacing: 'Tight', effect: 'Outline' } },
          { id: "typo-graffiti", name: "Wildstyle", category: "URBAN", description: "Wildstyle urban graffiti", type: PanelMode.TYPOGRAPHY, prompt: "Graffiti wildstyle typography, sharp arrows", parameters: { fontStyle: 'Grunge', weight: 'Heavy', spacing: 'Tight', effect: 'Shadow' } }
        ]
      },
      {
        id: "lib-typo-era",
        title: "HISTORICAL_DNA",
        mobileLabel: "ERA_T",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "typo-deco", name: "Art Deco", category: "HISTORICAL", description: "Premium geometric", type: PanelMode.TYPOGRAPHY, prompt: "Art Deco typography, gold and black palette", parameters: { fontStyle: 'Art Deco', weight: 'Light', spacing: 'Wide', effect: 'None' } },
          { id: "typo-vint", name: "Vintage", category: "HISTORICAL", description: "Ornate classic engraving", type: PanelMode.TYPOGRAPHY, prompt: "Vintage ornate typography, Victorian engraving", parameters: { fontStyle: 'Vintage', weight: 'Bold', spacing: 'Normal', effect: 'Outline' } },
          { id: "typo-script", name: "Renaissance", category: "HISTORICAL", description: "Fine ink swashes", type: PanelMode.TYPOGRAPHY, prompt: "Renaissance script typography, fine ink swashes, calligraphic precision", parameters: { fontStyle: 'Vintage', weight: 'Light', spacing: 'Wide', effect: 'None' } }
        ]
      }
    ]
  },
  MONOGRAM: {
    libraries: [
      {
        id: "lib-mono-esoteric",
        title: "ESOTERIC_CORE",
        mobileLabel: "ESO_M",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "mono-occult", name: "Alchemical", category: "ESOTERIC", description: "Secret society symbols", type: PanelMode.MONOGRAM, prompt: "Alchemical monogram, thin linework, esoteric geometric symbols", parameters: { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'Medium', structureCreativity: 70, densitySpace: 40, traditionalModern: 10, strokeEnds: 'Tapered' } },
          { id: "mono-sacred", name: "Sacred Geo", category: "ESOTERIC", description: "Mathematical divinity", type: PanelMode.MONOGRAM, prompt: "Sacred geometry monogram, recursive paths, perfect ratios", parameters: { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'Low', structureCreativity: 90, densitySpace: 60, traditionalModern: 5, strokeEnds: 'Blunt' } }
        ]
      },
      {
        id: "lib-mono-tech",
        title: "TECH_IDENTITY",
        mobileLabel: "TECH_M",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "mono-cyber-seal", name: "Cyber Seal", category: "TECH", description: "Futuristic agency mark", type: PanelMode.MONOGRAM, prompt: "Cyberpunk corporate seal monogram, digital mesh patterns, glowing edges", parameters: { layoutMode: 'block', symmetry: 'Asymmetrical', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 50, densitySpace: 30, traditionalModern: 95, strokeEnds: 'Sheared' } },
          { id: "mono-liquid-metal", name: "Chrome Flow", category: "TECH", description: "Mercury-style initials", type: PanelMode.MONOGRAM, prompt: "Liquid metal monogram, chrome reflections, flowing viscous letters", parameters: { layoutMode: 'interlocked', symmetry: 'Dynamic', container: 'None', densityRatio: '1:2', legibility: 'Medium', structureCreativity: 80, densitySpace: 50, traditionalModern: 100, strokeEnds: 'Rounded' } }
        ]
      }
    ]
  },
  FILTERS: {
    libraries: [
      {
        id: "lib-filt-spectral",
        title: "SPECTRAL_ENGINE",
        mobileLabel: "SPEC_F",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "filt-thermal", name: "Thermal", category: "SPECTRAL", description: "Heat signature map", type: PanelMode.FILTERS, prompt: "Thermal vision filter, orange/blue heat zones", parameters: { filterType: 'Cyberpunk', intensity: 100, brightness: 110, contrast: 130, saturation: 180, hue: 45 } },
          { id: "filt-xray", name: "X-Ray", category: "SPECTRAL", description: "Bone/Structure scan", type: PanelMode.FILTERS, prompt: "X-ray spectral filter, inverted luminance, cyan shadows", parameters: { filterType: 'Monochrome', intensity: 100, brightness: 120, contrast: 150, saturation: 0, hue: 180 } },
          { id: "filt-infrared", name: "Infrared", category: "SPECTRAL", description: "Aero-spectral shift", type: PanelMode.FILTERS, prompt: "Infrared film filter, red foliage, cyan skies", parameters: { filterType: 'Vintage', intensity: 80, brightness: 100, contrast: 120, saturation: 140, hue: 320 } }
        ]
      },
      {
        id: "lib-filt-retro",
        title: "RETRO_COMPUTING",
        mobileLabel: "COMP_F",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "filt-green-crt", name: "Phosphor", category: "RETRO", description: "Mainframe green screen", type: PanelMode.FILTERS, prompt: "Green phosphor CRT filter, scanlines, flickering bloom", parameters: { filterType: 'Monochrome', intensity: 100, brightness: 90, contrast: 130, saturation: 0, hue: 120 } },
          { id: "filt-amber-crt", name: "Amber", category: "RETRO", description: "Early terminal gold", type: PanelMode.FILTERS, prompt: "Amber terminal filter, retro glow, high contrast black/gold", parameters: { filterType: 'Monochrome', intensity: 100, brightness: 100, contrast: 140, saturation: 0, hue: 40 } },
          { id: "filt-vhs", name: "VHS Rip", category: "RETRO", description: "Magnetic tape tracking", type: PanelMode.FILTERS, prompt: "VHS tape filter, chromatic aberration, tracking errors", parameters: { filterType: 'Vintage', intensity: 60, brightness: 110, contrast: 90, saturation: 120, hue: 0 } }
        ]
      }
    ]
  }
};

/**
 * Creates a dynamic USER_VAULT category for standard preset handling in panels.
 */
export function createUserVaultCategory(mode: PanelMode, userPresets: Preset[]): PresetCategory {
  const modeKey = mode.toUpperCase();
  return {
    id: `user-vault-${modeKey.toLowerCase()}`,
    title: "USER_VAULT",
    mobileLabel: "MY_VAULT",
    type: PresetCategoryType.USER,
    items: userPresets.filter(p => p.type === mode)
  };
}

/**
 * Returns categories with a maximum of 32 items for mobile performance.
 */
export function getMobileCategories(mode: PanelMode, userPresets: Preset[] = []): PresetCategory[] {
  const modeKey = mode.toUpperCase();
  const builtIn = PRESET_REGISTRY[modeKey]?.libraries || [];
  
  const categories = [...builtIn];
  if (userPresets.length > 0) {
    const userVault = createUserVaultCategory(mode, userPresets);
    if (userVault.items.length > 0) {
      categories.unshift(userVault);
    }
  }
  
  return categories.map(cat => ({
    ...cat,
    items: cat.items.slice(0, 32)
  }));
}

export function getPresetsByMode(mode: PanelMode): Preset[] {
  const modeKey = mode.toUpperCase();
  if (!PRESET_REGISTRY[modeKey]) return [];
  return PRESET_REGISTRY[modeKey].libraries.flatMap(lib => lib.items);
}

export function findPresetById(id: string): Preset | undefined {
  for (const key in PRESET_REGISTRY) {
    const preset = PRESET_REGISTRY[key].libraries
      .flatMap(lib => lib.items)
      .find(item => item.id === id);
    if (preset) return preset;
  }
  return undefined;
}

export function getPresetCategoriesByMode(mode: PanelMode): PresetCategory[] {
  const modeKey = mode.toUpperCase();
  return PRESET_REGISTRY[modeKey]?.libraries || [];
}

export function searchPresets(query: string, mode?: PanelMode): Preset[] {
  const results: Preset[] = [];
  const searchTerm = query.toLowerCase();
  
  const searchInMode = mode 
    ? { [mode.toUpperCase()]: PRESET_REGISTRY[mode.toUpperCase()] }
    : PRESET_REGISTRY;
  
  Object.values(searchInMode).forEach(registry => {
    registry.libraries.forEach(category => {
      category.items.forEach(preset => {
        if (
          preset.name.toLowerCase().includes(searchTerm) ||
          preset.description.toLowerCase().includes(searchTerm) ||
          preset.category.toLowerCase().includes(searchTerm)
        ) {
          results.push(preset);
        }
      });
    });
  });
  
  return results;
}