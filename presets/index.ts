
import { PanelMode, Preset, VectorPreset, TypographyPreset, MonogramPreset, FilterPreset, PresetCategory, PresetCategoryType } from '../types.ts';

/**
 * HYPERXGEN PRESET REGISTRY v7.6 - OMEGA DEFINITIVE FINAL EDITION
 * The absolute collection of 72 forensic synthesis presets.
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
        id: "lib-vector-essentials",
        title: "ESSENTIALS",
        mobileLabel: "CORE_V",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "vec-logo", name: "Logo", category: "ESSENTIALS", description: "Clean geometric emblem", type: PanelMode.VECTOR, prompt: "Clean geometric emblem, monoweight strokes, high negative space", parameters: { complexity: 'Standard', outline: 'None', mood: 'Professional', background: 'White', colorCount: 4, strokeWeight: 0, style: 'Flat Design' } },
          { id: "vec-sticker-icon", name: "Sticker/Icon", category: "ESSENTIALS", description: "Flat graphic icon, bold strokes", type: PanelMode.VECTOR, prompt: "Flat vector sticker, bold strokes, minimal shapes", parameters: { complexity: 'Minimal', outline: 'Medium-Bold', mood: 'Cheerful', background: 'White', colorCount: 3, strokeWeight: 2, style: 'Flat Design' } },
          { id: "vec-minimalist", name: "Minimalist", category: "ESSENTIALS", description: "Few shapes, high space", type: PanelMode.VECTOR, prompt: "Minimalist vector, clean lines, maximum breathing room", parameters: { complexity: 'Minimal', outline: 'None', mood: 'Professional', background: 'White', colorCount: 2, strokeWeight: 0, style: 'Geometric' } },
          { id: "vec-technical", name: "Technical Diagram", category: "ESSENTIALS", description: "Precise geometric grids", type: PanelMode.VECTOR, prompt: "Technical diagram, precise geometric shapes, grid-aligned", parameters: { complexity: 'Standard', outline: 'Thin', mood: 'Professional', background: 'White', colorCount: 3, strokeWeight: 1, style: 'Geometric' } }
        ]
      },
      {
        id: "lib-vector-underground",
        title: "UNDERGROUND_LABS",
        mobileLabel: "VOID_V",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { 
            id: 'vector-data-mosh', 
            name: 'Data Corruption', 
            category: 'UNDERGROUND', 
            description: 'Intentional digital glitches as aesthetic', 
            type: PanelMode.VECTOR,
            prompt: 'vector art with controlled data corruption, RGB channel separation, intentional artifacts, digital glitch aesthetic but clean execution, geometric disruption',
            parameters: { complexity: 'Detailed', outline: 'Thin', mood: 'Communicative', background: 'Dark', colorCount: 8, strokeWeight: 1, style: 'Abstract' }
          },
          { 
            id: 'vector-brutalist', 
            name: 'Brutalist Vector', 
            category: 'UNDERGROUND', 
            description: 'Raw, unpolished geometric aesthetic', 
            type: PanelMode.VECTOR,
            prompt: 'brutalist vector art, raw geometric shapes, default system colors, intentional awkward spacing, anti-design aesthetic, structural honesty',
            parameters: { complexity: 'Minimal', outline: 'Medium-Bold', mood: 'Professional', background: 'White', colorCount: 3, strokeWeight: 3, style: 'Geometric' }
          },
          { 
            id: 'vector-neo-construct', 
            name: 'Neo-Constructivist', 
            category: 'UNDERGROUND', 
            description: 'Soviet meets cyberpunk fusion', 
            type: PanelMode.VECTOR,
            prompt: 'neo-constructivist vector style, geometric propaganda aesthetic, cyberpunk elements, red and black palette with single electric blue accent, mixed Cyrillic influences',
            parameters: { complexity: 'Standard', outline: 'Thin', mood: 'Professional', background: 'Dark', colorCount: 4, strokeWeight: 1, style: 'Geometric' }
          },
          { 
            id: 'vector-chem-diagram', 
            name: 'Chemical Diagrams', 
            category: 'UNDERGROUND', 
            description: 'Molecular structures as art', 
            type: PanelMode.VECTOR,
            prompt: 'vector chemical diagram aesthetic, molecular structures, bond lines and electron dots, laboratory precision, scientific illustration style, clean connections',
            parameters: { complexity: 'Minimal', outline: 'Thin', mood: 'Professional', background: 'White', colorCount: 2, strokeWeight: 1, style: 'Line Art' }
          }
        ]
      },
      {
        id: "lib-vector-artistic",
        title: "ARTISTIC_STUDIO",
        mobileLabel: "ART_V",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "vec-illustration", name: "Illustration", category: "ARTISTIC", description: "Detailed layered shapes", type: PanelMode.VECTOR, prompt: "Detailed illustration, layered shapes, smooth strokes", parameters: { complexity: 'Detailed', outline: 'None', mood: 'Communicative', background: 'White', colorCount: 6, strokeWeight: 0, style: 'Organic' } },
          { id: "vec-photo-vec", name: "Photo Vectorization", category: "ARTISTIC", description: "High-detail vector tracing", type: PanelMode.VECTOR, prompt: "High-detail vector tracing, color accuracy prioritized", parameters: { complexity: 'Detailed', outline: 'None', mood: 'Professional', background: 'White', colorCount: 8, strokeWeight: 0, style: 'Organic' } },
          { id: "vec-line-art", name: "Line Art", category: "ARTISTIC", description: "Simplified line drawing", type: PanelMode.VECTOR, prompt: "Clean line art, uniform strokes, no fills", parameters: { complexity: 'Minimal', outline: 'Thin', mood: 'Professional', background: 'White', colorCount: 1, strokeWeight: 1, style: 'Line Art' } },
          { id: "vec-watercolor", name: "Watercolor", category: "ARTISTIC", description: "Soft flowing vector layers", type: PanelMode.VECTOR, prompt: "Watercolor style vector, transparent layers, organic edges", parameters: { complexity: 'Standard', outline: 'None', mood: 'Communicative', background: 'Soft', colorCount: 5, strokeWeight: 0, style: 'Organic' } },
          { id: "vec-abstract", name: "Abstract", category: "ARTISTIC", description: "Non-objective vector forms", type: PanelMode.VECTOR, prompt: "Abstract vector shapes, non-objective composition, dynamic balance", parameters: { complexity: 'Standard', outline: 'None', mood: 'Communicative', background: 'White', colorCount: 4, strokeWeight: 0, style: 'Abstract' } },
          { id: "vec-fantasy", name: "Fantasy", category: "ARTISTIC", description: "Whimsical dreamlike vectors", type: PanelMode.VECTOR, prompt: "Fantasy illustration, magical lighting, ethereal vector shapes", parameters: { complexity: 'Detailed', outline: 'None', mood: 'Cheerful', background: 'Soft', colorCount: 6, strokeWeight: 0, style: 'Organic' } },
          { id: "vec-isometric", name: "Isometric", category: "ARTISTIC", description: "3D-effect vector perspective", type: PanelMode.VECTOR, prompt: "Isometric vector illustration, 3D perspective, geometric precision", parameters: { complexity: 'Detailed', outline: 'Thin', mood: 'Professional', background: 'White', colorCount: 5, strokeWeight: 1, style: 'Geometric' } },
          { id: "vec-organic", name: "Organic", category: "ARTISTIC", description: "Nature-inspired fluid forms", type: PanelMode.VECTOR, prompt: "Fluid organic vector forms, biological inspiration, soft curves", parameters: { complexity: 'Standard', outline: 'None', mood: 'Communicative', background: 'Soft', colorCount: 5, strokeWeight: 0, style: 'Organic' } },
          { id: "vec-tech", name: "Tech", category: "ARTISTIC", description: "Digital circuit aesthetic", type: PanelMode.VECTOR, prompt: "High-tech vector UI, circuit patterns, digital aesthetic", parameters: { complexity: 'Detailed', outline: 'Thin', mood: 'Professional', background: 'Dark', colorCount: 4, strokeWeight: 1, style: 'Corporate' } }
        ]
      }
    ]
  },
  TYPOGRAPHY: {
    libraries: [
      {
        id: "lib-typo-graffiti",
        title: "GRAFFITI_UNDERGROUND",
        mobileLabel: "URBAN_T",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: 'type-graffiti-wildstyle', name: 'Wildstyle Graffiti', category: 'GRAFFITI', description: 'Complex interlocking letters', type: PanelMode.TYPOGRAPHY, prompt: 'wildstyle graffiti typography, complex interlocking letters, 3D perspective, arrows and connections, spray paint texture, vibrant colors with black outline, urban street art', parameters: { fontStyle: 'Grunge', weight: 'Heavy', spacing: 'Tight', effect: 'Shadow' } },
          { id: 'type-graffiti-bubble', name: 'Bubble Graffiti', category: 'GRAFFITI', description: 'Rounded, cartoon-like letters', type: PanelMode.TYPOGRAPHY, prompt: 'bubble graffiti letters, rounded plump shapes, cartoon-like appearance, soft shadows, gradient fills, playful style, 1990s hip hop aesthetic', parameters: { fontStyle: 'Modern', weight: 'Bold', spacing: 'Normal', effect: 'None' } },
          { id: 'type-graffiti-tag', name: 'Throw-up Tag', category: 'GRAFFITI', description: 'Quick, bold street tags', type: PanelMode.TYPOGRAPHY, prompt: 'graffiti throw-up tag, bold simple letters, quick execution style, outline with fill, spray paint drips, urban signature, street credibility', parameters: { fontStyle: 'Grunge', weight: 'Regular', spacing: 'Normal', effect: 'None' } },
          { id: 'type-graffiti-stencil', name: 'Stencil Graffiti', category: 'GRAFFITI', description: 'Political/Banksy-style stencils', type: PanelMode.TYPOGRAPHY, prompt: 'stencil graffiti typography, cut-out letter forms, bridge connections maintained, spray paint overspray texture, political art aesthetic, urban rebellion', parameters: { fontStyle: 'Grunge', weight: 'Heavy', spacing: 'Normal', effect: 'None' } },
          { id: 'type-illegible', name: 'Illegible Statement', category: 'UNDERGROUND', description: 'Form over readability', type: PanelMode.TYPOGRAPHY, prompt: 'experimental illegible typography, form over function, engineered chaos, perfectly kerned confusion, emotional expression through letter deformation', parameters: { fontStyle: 'Modern', weight: 'Bold', spacing: 'Tight', effect: 'None' } },
          { id: 'type-chemical', name: 'Chemical Typography', category: 'UNDERGROUND', description: 'Molecular structure letters', type: PanelMode.TYPOGRAPHY, prompt: 'chemical diagram typography, letters constructed from molecular structures, bond lines as connectors, atom dots as decorative elements, scientific aesthetic', parameters: { fontStyle: 'Geometric', weight: 'Regular', spacing: 'Normal', effect: 'None' } }
        ]
      },
      {
        id: "lib-typo-geometric",
        title: "GEOMETRIC_FUSION",
        mobileLabel: "GEO_T",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "typo-triangle", name: "Triangle Text", category: "GEOMETRIC", description: "Sharp triangular glyphs", type: PanelMode.TYPOGRAPHY, prompt: "Typography composed of interlocking triangular shapes, sharp edges, geometric", parameters: { fontStyle: 'Geometric', weight: 'Bold', spacing: 'Normal', effect: 'None' } },
          { id: "typo-hexa", name: "Hexa Glyphs", category: "GEOMETRIC", description: "Modular hexagonal letters", type: PanelMode.TYPOGRAPHY, prompt: "Hexagonal modular typography, geometric honeycomb structure", parameters: { fontStyle: 'Geometric', weight: 'Bold', spacing: 'Tight', effect: 'None' } },
          { id: "typo-diamond", name: "Diamond Cut", category: "GEOMETRIC", description: "Reflective faceted letters", type: PanelMode.TYPOGRAPHY, prompt: "Diamond cut typography, faceted letterforms, reflective geometric edges", parameters: { fontStyle: '3D', weight: 'Heavy', spacing: 'Normal', effect: 'Glow' } },
          { id: "typo-poly", name: "Polygon Fusion", category: "GEOMETRIC", description: "Complex low-poly words", type: PanelMode.TYPOGRAPHY, prompt: "Low-poly polygon fusion typography, geometric facets, sharp shadows", parameters: { fontStyle: 'Geometric', weight: 'Bold', spacing: 'Normal', effect: 'Shadow' } },
          { id: "typo-square", name: "Square Block", category: "GEOMETRIC", description: "Ultra-heavy block type", type: PanelMode.TYPOGRAPHY, prompt: "Square block typography, massive weights, zero curves", parameters: { fontStyle: 'Modern', weight: 'Heavy', spacing: 'Tight', effect: 'None' } },
          { id: "typo-circ", name: "Circular Flow", category: "GEOMETRIC", description: "Perfectly rounded paths", type: PanelMode.TYPOGRAPHY, prompt: "Circular flow typography, perfectly round paths, geometric harmony", parameters: { fontStyle: 'Modern', weight: 'Regular', spacing: 'Wide', effect: 'None' } }
        ]
      },
      {
        id: "lib-typo-urban",
        title: "URBAN_SYSTEMS",
        mobileLabel: "SPEC_T",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "typo-street", name: "Street Block", category: "URBAN", description: "Stencil-style urban mark", type: PanelMode.TYPOGRAPHY, prompt: "Street block typography, stencil aesthetic, urban graffiti influence", parameters: { fontStyle: 'Grunge', weight: 'Heavy', spacing: 'Tight', effect: 'None' } },
          { id: "typo-neon", name: "Neon Glow", category: "URBAN", description: "Vibrant gas tube letters", type: PanelMode.TYPOGRAPHY, prompt: "Neon tube typography, vibrant glow, dark background focus", parameters: { fontStyle: 'Neon', weight: 'Regular', spacing: 'Normal', effect: 'Glow' } },
          { id: "typo-sci", name: "Sci-Fi", category: "URBAN", description: "Futuristic digital type", type: PanelMode.TYPOGRAPHY, prompt: "Sci-fi futuristic typography, data-stream aesthetics, tech-focused", parameters: { fontStyle: 'Cyberpunk', weight: 'Bold', spacing: 'Wide', effect: 'Glow' } },
          { id: "typo-cyber", name: "Cyber Glitch", category: "URBAN", description: "Distorted digital glyphs", type: PanelMode.TYPOGRAPHY, prompt: "Cyberpunk glitch typography, offset channels, digital distortion", parameters: { fontStyle: 'Cyberpunk', weight: 'Bold', spacing: 'Normal', effect: 'Shadow' } },
          { id: "typo-raw", name: "Raw Brutalist", category: "URBAN", description: "Unfinished concrete type", type: PanelMode.TYPOGRAPHY, prompt: "Brutalist raw typography, massive concrete concrete forms, high contrast", parameters: { fontStyle: 'Modern', weight: 'Heavy', spacing: 'Tight', effect: 'None' } },
          { id: "typo-hologram", name: "Holographic", category: "URBAN", description: "Etherial light projection", type: PanelMode.TYPOGRAPHY, prompt: "Holographic typography, spectral colors, transparent light layers", parameters: { fontStyle: 'Modern', weight: 'Light', spacing: 'Wide', effect: 'Glow' } }
        ]
      },
      {
        id: "lib-typo-retro",
        title: "RETRO_ARCHIVE",
        mobileLabel: "RETRO_T",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "typo-script", name: "Retro Script", category: "RETRO", description: "Mid-century cursive", type: PanelMode.TYPOGRAPHY, prompt: "Retro script typography, 1950s signage style, connected swashes", parameters: { fontStyle: 'Retro', weight: 'Regular', spacing: 'Normal', effect: 'Shadow' } },
          { id: "typo-vint", name: "Vintage Engraved", category: "RETRO", description: "Ornate classic etching", type: PanelMode.TYPOGRAPHY, prompt: "Vintage engraved typography, ornate scrolls, classic book aesthetic", parameters: { fontStyle: 'Vintage', weight: 'Bold', spacing: 'Normal', effect: 'Outline' } },
          { id: "typo-artdeco", name: "Art Deco", category: "RETRO", description: "1920s geometric luxury", type: PanelMode.TYPOGRAPHY, prompt: "Art Deco typography, luxury gold and black, geometric elegance", parameters: { fontStyle: 'Art Deco', weight: 'Light', spacing: 'Wide', effect: 'None' } },
          { id: "typo-bauhaus", name: "Bauhaus", category: "RETRO", description: "Early modernism rules", type: PanelMode.TYPOGRAPHY, prompt: "Bauhaus typography, primary colors, circle/square/triangle shapes", parameters: { fontStyle: 'Geometric', weight: 'Bold', spacing: 'Tight', effect: 'None' } },
          { id: "typo-psycho", name: "Psychedelic", category: "RETRO", description: "Warped 60s liquid type", type: PanelMode.TYPOGRAPHY, prompt: "Psychedelic liquid typography, warped fluid forms, vibrant gradients", parameters: { fontStyle: 'Watercolor', weight: 'Bold', spacing: 'Tight', effect: 'None' } },
          { id: "typo-pixel", name: "Pixel Art", category: "RETRO", description: "8-bit digital nostalgia", type: PanelMode.TYPOGRAPHY, prompt: "Pixel art typography, 8-bit aesthetic, aliased blocks", parameters: { fontStyle: 'Modern', weight: 'Bold', spacing: 'Normal', effect: 'None' } }
        ]
      },
      {
        id: "lib-typo-artistic",
        title: "ARTISTIC_FLOW",
        mobileLabel: "ART_T",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: "typo-water", name: "Watercolor", category: "ARTISTIC", description: "Soft bleeding ink edges", type: PanelMode.TYPOGRAPHY, prompt: "Watercolor typography, bleeding ink edges, organic textures", parameters: { fontStyle: 'Watercolor', weight: 'Regular', spacing: 'Normal', effect: 'None' } },
          { id: "typo-brush", name: "Brush Stroke", category: "ARTISTIC", description: "Hand-painted expression", type: PanelMode.TYPOGRAPHY, prompt: "Hand-painted brush stroke typography, visible bristles, expressive speed", parameters: { fontStyle: 'Handwritten', weight: 'Bold', spacing: 'Normal', effect: 'None' } },
          { id: "typo-minimal", name: "Minimalist Sans", category: "ARTISTIC", description: "Clean breathing room", type: PanelMode.TYPOGRAPHY, prompt: "Minimalist sans-serif typography, maximum negative space, elegant weights", parameters: { fontStyle: 'Minimalist', weight: 'Light', spacing: 'Wide', effect: 'None' } },
          { id: "typo-stencil", name: "Industrial Stencil", category: "ARTISTIC", description: "Spray-painted marking", type: PanelMode.TYPOGRAPHY, prompt: "Industrial stencil typography, spray-paint texture, warehouse aesthetic", parameters: { fontStyle: 'Grunge', weight: 'Heavy', spacing: 'Normal', effect: 'None' } },
          { id: "typo-metal", name: "Liquid Metal", category: "ARTISTIC", description: "Molten chrome glyphs", type: PanelMode.TYPOGRAPHY, prompt: "Liquid metal typography, chrome reflections, molten fluid forms", parameters: { fontStyle: '3D', weight: 'Heavy', spacing: 'Normal', effect: 'None' } },
          { id: "typo-organic", name: "Organic Vine", category: "ARTISTIC", description: "Growing biological paths", type: PanelMode.TYPOGRAPHY, prompt: "Organic vine typography, intertwined biological paths, leaf-like swashes", parameters: { fontStyle: 'Organic', weight: 'Regular', spacing: 'Wide', effect: 'None' } }
        ]
      }
    ]
  },
  MONOGRAM: {
    libraries: [
      {
        id: "lib-monogram-core",
        title: "CLASSIC_STYLES",
        mobileLabel: "CLASS_M",
        type: PresetCategoryType.BUILT_IN,
        items: [
          {
            id: "mono-classic-interlocked",
            name: "Classic Interlocked",
            description: "Elegant interlocked geometric monogram",
            type: PanelMode.MONOGRAM,
            prompt: "elegant, interlocked geometric monogram with subtle negative space and radial symmetry",
            category: "CLASSIC",
            parameters: { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 30, densitySpace: 50, traditionalModern: 20, strokeEnds: 'Blunt' }
          } as MonogramPreset,
          {
            id: "mono-radial-fusion",
            name: "Radial Fusion",
            description: "Radial fused monogram with smooth strokes",
            type: PanelMode.MONOGRAM,
            prompt: "radial fused monogram with smooth strokes, balanced intersections, geometric cohesion",
            category: "CLASSIC",
            parameters: { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 40, densitySpace: 60, traditionalModern: 30, strokeEnds: 'Rounded' }
          } as MonogramPreset,
          {
            id: "mono-block-seal",
            name: "Block Seal",
            description: "Geometric block monogram, compact",
            type: PanelMode.MONOGRAM,
            prompt: "geometric block monogram, compact, interlocking letters with precise symmetry",
            category: "CLASSIC",
            parameters: { layoutMode: 'block', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 20, densitySpace: 40, traditionalModern: 10, strokeEnds: 'Blunt' }
          } as MonogramPreset,
          {
            id: "mono-corporate",
            name: "Corporate Seal",
            description: "Symmetrical professional mark",
            type: PanelMode.MONOGRAM,
            prompt: "corporate seal monogram, clean lines, geometric symmetry, official document style",
            category: "CLASSIC",
            parameters: { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 20, densitySpace: 80, traditionalModern: 30, strokeEnds: 'Blunt' }
          } as MonogramPreset
        ]
      },
      {
        id: "lib-monogram-underground",
        title: "UNDERGROUND_LABS",
        mobileLabel: "VOID_M",
        type: PresetCategoryType.BUILT_IN,
        items: [
          {
            id: 'mono-negative-lock',
            name: 'Negative Space Lock',
            category: 'UNDERGROUND',
            description: 'Letters sharing negative space',
            type: PanelMode.MONOGRAM,
            prompt: 'monogram with negative space locking, letters share contours perfectly, works in positive/negative reversal, optical illusion effect, precise geometry',
            parameters: { layoutMode: 'interlocked', symmetry: 'Asymmetrical', container: 'Strict', densityRatio: '1:1', legibility: 'Medium', structureCreativity: 90, densitySpace: 40, traditionalModern: 80, strokeEnds: 'Blunt' }
          } as MonogramPreset,
          {
            id: 'mono-kinetic',
            name: 'Kinetic Monogram',
            category: 'UNDERGROUND',
            description: 'Letters in implied motion',
            type: PanelMode.MONOGRAM,
            prompt: 'kinetic monogram, letters captured in mid-transformation, implied motion, fluid transitions between forms, time-based aesthetic, dynamic energy',
            parameters: { layoutMode: 'mirrored', symmetry: 'Dynamic', container: 'None', densityRatio: '2:1', legibility: 'Medium', structureCreativity: 85, densitySpace: 60, traditionalModern: 90, strokeEnds: 'Tapered' }
          } as MonogramPreset,
          {
            id: 'mono-graffiti-interlock',
            name: 'Graffiti Interlock',
            category: 'GRAFFITI',
            description: 'Wildstyle monogram fusion',
            type: PanelMode.MONOGRAM,
            prompt: 'graffiti wildstyle monogram, letters interlocked like puzzle pieces, 3D perspective, spray paint texture, urban street art meets heraldic tradition',
            parameters: { layoutMode: 'interlocked', symmetry: 'Asymmetrical', container: 'None', densityRatio: '1:1', legibility: 'Low', structureCreativity: 95, densitySpace: 20, traditionalModern: 100, strokeEnds: 'Rounded' }
          } as MonogramPreset,
          {
            id: 'mono-deconstruct',
            name: 'Deconstructed Monogram',
            category: 'UNDERGROUND',
            description: 'Letters partially disassembled',
            type: PanelMode.MONOGRAM,
            prompt: 'deconstructed monogram, letters partially taken apart, floating elements, implied connections, brutalist aesthetic, architectural breakdown',
            parameters: { layoutMode: 'block', symmetry: 'Asymmetrical', container: 'Weak', densityRatio: '1:1', legibility: 'Medium', structureCreativity: 80, densitySpace: 30, traditionalModern: 95, strokeEnds: 'Sheared' }
          } as MonogramPreset,
          {
            id: 'mono-temporal',
            name: 'Temporal Monogram',
            category: 'UNDERGROUND',
            description: 'Encodes time/date in form',
            type: PanelMode.MONOGRAM,
            prompt: 'temporal monogram design, letters arranged to represent specific time or date, clock face integration, calendar symbolism hidden in negative space',
            parameters: { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 75, densitySpace: 70, traditionalModern: 40, strokeEnds: 'Blunt' }
          } as MonogramPreset
        ]
      },
      {
        id: "lib-monogram-modern",
        title: "MODERN_STYLES",
        mobileLabel: "MOD_M",
        type: PresetCategoryType.BUILT_IN,
        items: [
          {
            id: "mono-stacked-modern",
            name: "Stacked Modern",
            description: "Stacked geometric monogram, modern minimal",
            type: PanelMode.MONOGRAM,
            prompt: "stacked geometric monogram, modern minimal style, radial symmetry enforced",
            category: "MODERN",
            parameters: { layoutMode: 'stacked', symmetry: 'Perfect Radial', container: 'Suggested', densityRatio: '1:2', legibility: 'Medium', structureCreativity: 60, densitySpace: 40, traditionalModern: 80, strokeEnds: 'Rounded' }
          } as MonogramPreset,
          {
            id: "mono-abstract",
            name: "Modern Block",
            description: "Bold minimalist geometric forms",
            type: PanelMode.MONOGRAM,
            prompt: "modern abstract monogram, geometric interpretation, bold minimalist blocks",
            category: "MODERN",
            parameters: { layoutMode: 'block', symmetry: 'Asymmetrical', container: 'Weak', densityRatio: '1:1', legibility: 'Medium', structureCreativity: 80, densitySpace: 30, traditionalModern: 95, strokeEnds: 'Blunt' }
          } as MonogramPreset,
          {
            id: "mono-expanded-totem",
            name: "Expanded Totem",
            description: "Vertical totem-style monogram",
            type: PanelMode.MONOGRAM,
            prompt: "vertical totem-style monogram with extended aspect ratio and geometric interlocks",
            category: "MODERN",
            parameters: { layoutMode: 'stacked', symmetry: 'Vertical Mirror', container: 'Suggested', densityRatio: '1:3', legibility: 'Medium', structureCreativity: 70, densitySpace: 60, traditionalModern: 85, strokeEnds: 'Tapered' }
          } as MonogramPreset
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
    title: "MY_SAVED_STYLES",
    mobileLabel: "MY_VAULT",
    type: PresetCategoryType.USER,
    items: userPresets.filter(p => p.type === mode)
  };
}

/**
 * Returns categories with integrated user presets.
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