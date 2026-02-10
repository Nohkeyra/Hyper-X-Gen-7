
// ⚠️ SYSTEM NOTICE:
// These presets are CORE ASSETS.
// DO NOT delete, modify, or refactor them except the user ask for.
// Treat as READ-ONLY.

import { PanelMode, Preset, VectorPreset, TypographyPreset, MonogramPreset, FilterPreset, PresetCategory, PresetCategoryType } from '../types.ts';

/**
 * HYPERXGEN PRESET REGISTRY v7.6.3 - OMEGA DEFINITIVE FINAL EDITION
 * The absolute collection of 88 forensic synthesis presets.
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
        id: "lib-vector-legacy",
        title: "LEGACY_CONSTRUCTS",
        mobileLabel: "LEGACY_V",
        type: PresetCategoryType.BUILT_IN,
        items: [
          {
            id: 'logo-clean',
            name: 'Clean Logo',
            type: PanelMode.VECTOR,
            category: 'Essentials',
            description: 'Minimal, sharp vector look ideal for logos and icons',
            prompt: 'Minimal, sharp vector look for logos and icons, geometric precision',
            parameters: {
              complexity: 'Minimal',
              outline: 'Thin',
              mood: 'Professional',
              background: 'transparent',
              colorCount: 2,
              strokeWeight: 1,
              style: 'Flat Design'
            }
          } as VectorPreset,
          {
            id: 'modern-illustration',
            name: 'Modern Illustration',
            type: PanelMode.VECTOR,
            category: 'Essentials',
            description: 'Bold, colorful illustration with strong contrast',
            prompt: 'Bold colorful illustration, high contrast, expressive vector forms',
            parameters: {
              complexity: 'Detailed',
              outline: 'Medium-Bold',
              mood: 'Communicative',
              background: 'light',
              colorCount: 8,
              strokeWeight: 3,
              style: 'Organic'
            }
          } as VectorPreset,
          {
            id: 'soft-flat',
            name: 'Soft Flat',
            type: PanelMode.VECTOR,
            category: 'Essentials',
            description: 'Smooth flat vector style with gentle tones',
            prompt: 'Smooth flat vector, gentle tones, minimalist aesthetic',
            parameters: {
              complexity: 'Standard',
              outline: 'Thin',
              mood: 'Cheerful',
              background: 'light',
              colorCount: 2,
              strokeWeight: 2,
              style: 'Flat Design'
            }
          } as VectorPreset,
          {
            id: 'gritty-art',
            name: 'Gritty Art',
            type: PanelMode.VECTOR,
            category: 'Essentials',
            description: 'High-detail, textured vector art with dramatic depth',
            prompt: 'High-detail gritty vector art, dramatic depth and texture',
            parameters: {
              complexity: 'Detailed',
              outline: 'Medium-Bold',
              mood: 'Dramatic',
              background: 'dark',
              colorCount: 6,
              strokeWeight: 4,
              style: 'Abstract'
            }
          } as VectorPreset
        ]
      },
      {
        id: "lib-vector-prime",
        title: "PRIME_SYNTHESIS",
        mobileLabel: "PRIME_V",
        type: PresetCategoryType.BUILT_IN,
        items: [
          {
            id: 'vector-clean-minimal',
            name: 'Clean Minimal',
            type: PanelMode.VECTOR,
            category: 'Essentials',
            description: 'Minimal vector style with clean lines and high legibility',
            prompt: 'A clean, minimal vector logo with strong clarity and balance',
            styleDirective: 'Reduce unnecessary detail, focus on clarity and balance',
            tags: ['minimal', 'clean', 'logo', 'professional'],
            rating: 4.8,
            usageCount: 0,
            isFavorite: false,
            isProtected: true,
            metadata: {
              mobileTitle: 'Clean',
              mobileIcon: 'sparkles',
              mobilePriority: 1
            },
            parameters: {
              complexity: 'Minimal',
              outline: 'Thin',
              mood: 'Professional',
              background: 'transparent',
              colorCount: 2,
              strokeWeight: 1,
              style: 'Flat Design'
            }
          } as VectorPreset,
          {
            id: 'vector-corporate-bold',
            name: 'Corporate Bold',
            type: PanelMode.VECTOR,
            category: 'Business',
            description: 'Strong corporate vector style with confident geometry',
            prompt: 'A bold corporate vector logo with geometric precision',
            styleDirective: 'Use structured geometry and confident proportions',
            tags: ['corporate', 'business', 'geometric'],
            rating: 4.6,
            usageCount: 0,
            isProtected: true,
            parameters: {
              complexity: 'Standard',
              outline: 'Medium-Bold',
              mood: 'Professional',
              background: 'light',
              colorCount: 3,
              strokeWeight: 2,
              style: 'Corporate'
            }
          } as VectorPreset,
          {
            id: 'vector-playful-organic',
            name: 'Playful Organic',
            type: PanelMode.VECTOR,
            category: 'Creative',
            description: 'Friendly, organic vector style with playful curves',
            prompt: 'A playful organic vector illustration with soft shapes',
            styleDirective: 'Favor curves, asymmetry, and friendly proportions',
            tags: ['playful', 'organic', 'friendly'],
            rating: 4.7,
            usageCount: 0,
            parameters: {
              complexity: 'Standard',
              outline: 'None',
              mood: 'Cheerful',
              background: 'light',
              colorCount: 4,
              strokeWeight: 2,
              style: 'Organic'
            }
          } as VectorPreset,
          {
            id: 'vector-abstract-expressive',
            name: 'Abstract Expressive',
            type: PanelMode.VECTOR,
            category: 'Experimental',
            description: 'Expressive abstract vector style with artistic freedom',
            prompt: 'An abstract vector composition with expressive forms',
            styleDirective: 'Encourage abstraction, visual rhythm, and contrast',
            tags: ['abstract', 'artistic', 'experimental'],
            rating: 4.5,
            usageCount: 0,
            parameters: {
              complexity: 'Detailed',
              outline: 'Medium-Bold',
              mood: 'Communicative',
              background: 'dark',
              colorCount: 5,
              strokeWeight: 3,
              style: 'Abstract'
            }
          } as VectorPreset
        ]
      },
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
        id: "lib-typo-essentials",
        title: "ESSENTIALS",
        mobileLabel: "CORE_T",
        type: PresetCategoryType.BUILT_IN,
        items: [
          {
            id: 'typo-modern-minimal',
            name: 'Modern Minimal',
            type: PanelMode.TYPOGRAPHY,
            category: 'Essentials',
            description: 'Clean modern typography with strong readability',
            prompt: 'Modern minimalist typography with clean spacing and balance',
            styleUsed: 'Modern',
            tags: ['modern', 'minimal', 'clean'],
            rating: 4.8,
            isProtected: true,
            metadata: {
              mobileTitle: 'Modern',
              mobileIcon: 'type',
              mobilePriority: 1
            },
            parameters: {
              fontStyle: 'Modern',
              weight: 'Regular',
              spacing: 'Normal',
              effect: 'None'
            }
          } as TypographyPreset,
          {
            id: 'typo-art-deco-bold',
            name: 'Art Deco Bold',
            type: PanelMode.TYPOGRAPHY,
            category: 'Classic',
            description: 'Elegant Art Deco typography with bold personality',
            prompt: 'Art Deco inspired typography with bold geometry',
            styleUsed: 'Art Deco',
            tags: ['art-deco', 'luxury', 'vintage'],
            rating: 4.7,
            parameters: {
              fontStyle: 'Art Deco',
              weight: 'Bold',
              spacing: 'Wide',
              effect: 'Outline'
            }
          } as TypographyPreset,
          {
            id: 'typo-neon-cyber',
            name: 'Neon Cyber',
            type: PanelMode.TYPOGRAPHY,
            category: 'Futuristic',
            description: 'Glowing cyberpunk typography with neon presence',
            prompt: 'Cyberpunk neon typography glowing with futuristic energy',
            styleUsed: 'Cyberpunk',
            tags: ['neon', 'cyberpunk', 'futuristic'],
            rating: 4.6,
            parameters: {
              fontStyle: 'Cyberpunk',
              weight: 'Heavy',
              spacing: 'Normal',
              effect: 'Glow'
            }
          } as TypographyPreset,
          {
            id: 'typo-handwritten-organic',
            name: 'Handwritten Organic',
            type: PanelMode.TYPOGRAPHY,
            category: 'Creative',
            description: 'Organic handwritten typography with personal character',
            prompt: 'Handwritten organic typography with natural flow',
            styleUsed: 'Handwritten',
            tags: ['handwritten', 'organic', 'friendly'],
            rating: 4.5,
            parameters: {
              fontStyle: 'Handwritten',
              weight: 'Light',
              spacing: 'Tight',
              effect: 'None'
            }
          } as TypographyPreset
        ]
      },
      {
        id: "lib-typo-graffiti",
        title: "GRAFFITI_UNDERGROUND",
        mobileLabel: "URBAN_T",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: 'type-graffiti-wildstyle', name: 'Wildstyle Graffiti', category: 'GRAFFITI', description: 'Complex interlocking letters', type: PanelMode.TYPOGRAPHY, prompt: 'wildstyle graffiti typography, complex interlocking letters, 3D perspective, arrows and connections, spray paint texture, vibrant colors with black outline, urban street art', parameters: { fontStyle: 'Grunge', weight: 'Heavy', spacing: 'Tight', effect: 'Shadow' } },
          { id: 'type-graffiti-bubble', name: 'Bubble Graffiti', category: 'GRAFFITI', description: 'Rounded, cartoon-like letters', type: PanelMode.TYPOGRAPHY, prompt: 'bubble graffiti letters, rounded plump shapes, cartoon-like appearance, soft shadows, gradient fills, playful style, 1990s hip hop aesthetic', parameters: { fontStyle: 'Modern', weight: 'Bold', spacing: 'Normal', effect: 'None' } },
          { id: 'type-graffiti-tag', name: 'Throw-up Tag', category: 'GRAFFITI', description: 'Quick, bold street tags', type: PanelMode.TYPOGRAPHY, prompt: 'graffiti throw-up tag, bold simple letters, quick execution style, outline with fill, spray paint drips, urban signature, street credibility', parameters: { fontStyle: 'Grunge', weight: 'Regular', spacing: 'Normal', effect: 'None' } },
          { id: 'type-graffiti-stencil', name: 'Stencil Graffiti', category: 'GRAFFITI', description: 'Political/Banksy-style stencils', type: PanelMode.TYPOGRAPHY, prompt: 'stencil graffiti typography, cut-out letter forms, bridge connections maintained, spray paint overspray texture, political art aesthetic, urban rebellion', parameters: { fontStyle: 'Grunge', weight: 'Heavy', spacing: 'Normal', effect: 'None' } }
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
          { id: "typo-diamond", name: "Diamond Cut", category: "GEOMETRIC", description: "Reflective faceted letters", type: PanelMode.TYPOGRAPHY, prompt: "Diamond cut typography, faceted letterforms, reflective geometric edges", parameters: { fontStyle: '3D', weight: 'Heavy', spacing: 'Normal', effect: 'Glow' } }
        ]
      }
    ]
  },
  MONOGRAM: {
    libraries: [
      {
        id: "lib-monogram-essentials",
        title: "ESSENTIALS",
        mobileLabel: "CORE_M",
        type: PresetCategoryType.BUILT_IN,
        items: [
          {
            id: 'mono-classic-interlock',
            name: 'Classic Interlock',
            type: PanelMode.MONOGRAM,
            category: 'Classic',
            description: 'Timeless interlocked monogram with perfect symmetry',
            prompt: 'Classic interlocked monogram with elegant balance',
            tags: ['classic', 'elegant', 'luxury'],
            rating: 4.9,
            isProtected: true,
            metadata: {
              mobileTitle: 'Classic',
              mobileIcon: 'shield',
              mobilePriority: 1
            },
            parameters: {
              layoutMode: 'interlocked',
              symmetry: 'Perfect Radial',
              container: 'Strict',
              densityRatio: 'Balanced',
              legibility: 'High',
              structureCreativity: 35,
              densitySpace: 60,
              traditionalModern: 20,
              strokeEnds: 'Sheared',
              style: 'Classic Heraldic'
            }
          } as MonogramPreset,
          {
            id: 'mono-modern-stack',
            name: 'Modern Stack',
            type: PanelMode.MONOGRAM,
            category: 'Modern',
            description: 'Modern stacked monogram with clean geometry',
            prompt: 'Modern stacked monogram with geometric clarity',
            tags: ['modern', 'stacked', 'clean'],
            rating: 4.7,
            parameters: {
              layoutMode: 'stacked',
              symmetry: 'Vertical Mirror',
              container: 'Suggested',
              densityRatio: 'Open',
              legibility: 'High',
              structureCreativity: 50,
              densitySpace: 55,
              traditionalModern: 65,
              strokeEnds: 'Blunt',
              style: 'Modern Minimal'
            }
          } as MonogramPreset,
          {
            id: 'mono-expressive-mirror',
            name: 'Expressive Mirror',
            type: PanelMode.MONOGRAM,
            category: 'Creative',
            description: 'Expressive mirrored monogram with dynamic balance',
            prompt: 'Expressive mirrored monogram with artistic flair',
            tags: ['expressive', 'artistic', 'dynamic'],
            rating: 4.6,
            parameters: {
              layoutMode: 'mirrored',
              symmetry: 'Dynamic',
              container: 'Weak',
              densityRatio: 'Dense',
              legibility: 'Medium',
              structureCreativity: 80,
              densitySpace: 40,
              traditionalModern: 55,
              strokeEnds: 'Tapered',
              style: 'Futuristic'
            }
          } as MonogramPreset,
          {
            id: 'mono-avant-garde',
            name: 'Avant-Garde',
            type: PanelMode.MONOGRAM,
            category: 'Experimental',
            description: 'Avant-garde monogram pushing structure and abstraction',
            prompt: 'Avant-garde abstract monogram with experimental structure',
            tags: ['avant-garde', 'experimental', 'abstract'],
            rating: 4.4,
            parameters: {
              layoutMode: 'block',
              symmetry: 'Asymmetrical',
              container: 'None',
              densityRatio: 'Compressed',
              legibility: 'Low',
              structureCreativity: 95,
              densitySpace: 25,
              traditionalModern: 75,
              strokeEnds: 'Rounded',
              style: 'Brutalist'
            }
          } as MonogramPreset
        ]
      },
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
            parameters: { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 30, densitySpace: 50, traditionalModern: 20, strokeEnds: 'Blunt', style: 'Interlocked' }
          } as MonogramPreset,
          {
            id: "mono-radial-fusion",
            name: "Radial Fusion",
            description: "Radial fused monogram with smooth strokes",
            type: PanelMode.MONOGRAM,
            prompt: "radial fused monogram with smooth strokes, balanced intersections, geometric cohesion",
            category: "CLASSIC",
            parameters: { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 40, densitySpace: 60, traditionalModern: 30, strokeEnds: 'Rounded', style: 'Geometric' }
          } as MonogramPreset,
          {
            id: "mono-block-seal",
            name: "Block Seal",
            description: "Geometric block monogram, compact",
            type: PanelMode.MONOGRAM,
            prompt: "geometric block monogram, compact, interlocking letters with precise symmetry",
            category: "CLASSIC",
            parameters: { layoutMode: 'block', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 20, densitySpace: 40, traditionalModern: 10, strokeEnds: 'Blunt', style: 'Geometric' }
          } as MonogramPreset,
          {
            id: "mono-corporate",
            name: "Corporate Seal",
            description: "Symmetrical professional mark",
            type: PanelMode.MONOGRAM,
            prompt: "corporate seal monogram, clean lines, geometric symmetry, official document style",
            category: "CLASSIC",
            parameters: { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 20, densitySpace: 80, traditionalModern: 30, strokeEnds: 'Blunt', style: 'Modern Minimal' }
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
            parameters: { layoutMode: 'interlocked', symmetry: 'Asymmetrical', container: 'Strict', densityRatio: '1:1', legibility: 'Medium', structureCreativity: 90, densitySpace: 40, traditionalModern: 80, strokeEnds: 'Blunt', style: 'Geometric' }
          } as MonogramPreset,
          {
            id: 'mono-kinetic',
            name: 'Kinetic Monogram',
            category: 'UNDERGROUND',
            description: 'Letters in implied motion',
            type: PanelMode.MONOGRAM,
            prompt: 'kinetic monogram, letters captured in mid-transformation, implied motion, fluid transitions between forms, time-based aesthetic, dynamic energy',
            parameters: { layoutMode: 'mirrored', symmetry: 'Dynamic', container: 'None', densityRatio: '2:1', legibility: 'Medium', structureCreativity: 85, densitySpace: 60, traditionalModern: 90, strokeEnds: 'Tapered', style: 'Futuristic' }
          } as MonogramPreset,
          {
            id: 'mono-graffiti-interlock',
            name: 'Graffiti Interlock',
            category: 'GRAFFITI',
            description: 'Wildstyle monogram fusion',
            type: PanelMode.MONOGRAM,
            prompt: 'graffiti wildstyle monogram, letters interlocked like puzzle pieces, 3D perspective, spray paint texture, urban street art meets heraldic tradition',
            parameters: { layoutMode: 'interlocked', symmetry: 'Asymmetrical', container: 'None', densityRatio: '1:1', legibility: 'Low', structureCreativity: 95, densitySpace: 20, traditionalModern: 100, strokeEnds: 'Rounded', style: 'Brutalist' }
          } as MonogramPreset,
          {
            id: 'mono-deconstruct',
            name: 'Deconstructed Monogram',
            category: 'UNDERGROUND',
            description: 'Letters partially disassembled',
            type: PanelMode.MONOGRAM,
            prompt: 'deconstructed monogram, letters partially taken apart, floating elements, implied connections, brutalist aesthetic, architectural breakdown',
            parameters: { layoutMode: 'block', symmetry: 'Asymmetrical', container: 'Weak', densityRatio: '1:1', legibility: 'Medium', structureCreativity: 80, densitySpace: 30, traditionalModern: 95, strokeEnds: 'Sheared', style: 'Brutalist' }
          } as MonogramPreset,
          {
            id: 'mono-temporal',
            name: 'Temporal Monogram',
            category: 'UNDERGROUND',
            description: 'Encodes time/date in form',
            type: PanelMode.MONOGRAM,
            prompt: 'temporal monogram design, letters arranged to represent specific time or date, clock face integration, calendar symbolism hidden in negative space',
            parameters: { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Strict', densityRatio: '1:1', legibility: 'High', structureCreativity: 75, densitySpace: 70, traditionalModern: 40, strokeEnds: 'Blunt', style: 'Geometric' }
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
            parameters: { layoutMode: 'stacked', symmetry: 'Perfect Radial', container: 'Suggested', densityRatio: '1:2', legibility: 'Medium', structureCreativity: 60, densitySpace: 40, traditionalModern: 80, strokeEnds: 'Rounded', style: 'Modern Minimal' }
          } as MonogramPreset,
          {
            id: "mono-abstract",
            name: "Modern Block",
            description: "Bold minimalist geometric forms",
            type: PanelMode.MONOGRAM,
            prompt: "modern abstract monogram, geometric interpretation, bold minimalist blocks",
            category: "MODERN",
            parameters: { layoutMode: 'block', symmetry: 'Asymmetrical', container: 'Weak', densityRatio: '1:1', legibility: 'Medium', structureCreativity: 80, densitySpace: 30, traditionalModern: 95, strokeEnds: 'Blunt', style: 'Geometric' }
          } as MonogramPreset,
          {
            id: "mono-expanded-totem",
            name: "Expanded Totem",
            description: "Vertical totem-style monogram",
            type: PanelMode.MONOGRAM,
            prompt: "vertical totem-style monogram with extended aspect ratio and geometric interlocks",
            category: "MODERN",
            parameters: { layoutMode: 'stacked', symmetry: 'Vertical Mirror', container: 'Suggested', densityRatio: '1:3', legibility: 'Medium', structureCreativity: 70, densitySpace: 60, traditionalModern: 85, strokeEnds: 'Tapered', style: 'Futuristic' }
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
