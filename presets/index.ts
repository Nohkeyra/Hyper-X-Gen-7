
// ⚠️ SYSTEM NOTICE:
// These presets are CORE ASSETS.
// DO NOT delete, modify, or refactor them except the user ask for.
// Treat as READ-ONLY.

import { PanelMode, Preset, VectorPreset, TypographyPreset, MonogramPreset, FilterPreset, EmblemPreset, PresetCategory, PresetCategoryType, ImageEngine, ColorMode, PaletteDepth, DetailFidelity, StrokePreset, MaterialAppearance, LayoutType, VectorArtStyleCategory, SubjectType, VisualComplexity } from '../types.ts';

/**
 * HYPERXGEN PRESET REGISTRY v7.6.3 - OMEGA DEFINITIVE FINAL EDITION
 * The absolute collection of forensic synthesis presets.
 */

export type PresetRegistry = {
  [key: string]: {
    libraries: PresetCategory[];
  };
};

// Helper to map color_palette strings to PaletteDepth enum
const getPaletteDepth = (colorPalette: string): PaletteDepth => {
  if (colorPalette.includes('2 colors')) return '2';
  if (colorPalette.includes('3 colors')) return '3';
  if (colorPalette.includes('4 colors')) return '4';
  if (colorPalette.includes('5 colors')) return '5';
  if (colorPalette.includes('6 colors')) return '6';
  if (colorPalette.includes('8 colors')) return '8';
  if (colorPalette.includes('10 colors')) return '16'; // Closest reasonable step
  if (colorPalette.includes('12+ colors')) return '20';
  if (colorPalette.includes('12 colors')) return '20';
  if (colorPalette.includes('14 colors')) return '20';
  if (colorPalette.includes('15+ colors')) return '24';
  if (colorPalette.includes('15 colors')) return '24';
  if (colorPalette.includes('16–20 colors')) return '20';
  if (colorPalette.includes('16–24 colors')) return '24';
  if (colorPalette.includes('18–24 colors')) return '24';
  if (colorPalette.includes('20–28 colors')) return '28';
  if (colorPalette.includes('24–32 colors')) return '32';
  if (colorPalette.includes('Maximum (32 colors)')) return '32';
  return '8'; // Default fallback
};

// Helper to map outline_style strings to StrokePreset enum
const getStrokePreset = (outlineStyle: string): StrokePreset => {
  if (outlineStyle.includes('None')) return 'None';
  if (outlineStyle.includes('Very thin') || outlineStyle.includes('Very Thin')) return 'Uniform Very Thin';
  if (outlineStyle.includes('Thin')) return 'Uniform Thin';
  if (outlineStyle.includes('Medium')) return 'Uniform Medium';
  if (outlineStyle.includes('Heavy')) return 'Uniform Heavy';
  return 'None'; // Default
};

// Helper to map visual_style strings to VectorArtStyleCategory
const getVectorArtStyleCategory = (visualStyle: string): VectorArtStyleCategory => {
  if (visualStyle.includes('Photorealistic')) return 'Photorealistic Vector';
  if (visualStyle.includes('Portrait')) return 'Portrait Vector';
  if (visualStyle.includes('Nature') || visualStyle.includes('Landscape')) return 'Nature Vector';
  if (visualStyle.includes('Product') || visualStyle.includes('food')) return 'Product Vector';
  if (visualStyle.includes('Painterly') || visualStyle.includes('Concept art') || visualStyle.includes('Folk art')) return 'Painterly Vector';
  if (visualStyle.includes('Gradient mesh')) return 'Gradient Mesh Vector';
  if (visualStyle.includes('Animal') || visualStyle.includes('Wildlife')) return 'Wildlife Vector';
  if (visualStyle.includes('Geometric') || visualStyle.includes('pattern') || visualStyle.includes('poster')) return 'Geometric'; // Retro poster can be Bold Graphic or Geometric
  if (visualStyle.includes('comic book') || visualStyle.includes('Bold graphic')) return 'Bold Graphic';
  if (visualStyle.includes('Flat')) return 'Modern Flat';
  return 'Modern Flat'; // Default
};

// Helper to map detail_level string to DetailFidelity
const getDetailFidelity = (detailLevel: string): DetailFidelity => {
  if (detailLevel.includes('Very High')) return 'Very High';
  if (detailLevel.includes('Maximum')) return 'Maximum';
  if (detailLevel.includes('High')) return 'High';
  if (detailLevel.includes('Moderate')) return 'Moderate';
  if (detailLevel.includes('Minimal')) return 'Minimal';
  return 'Moderate'; // Default
};

// Helper to map layout types
const getLayoutType = (visualStyle: string): LayoutType => {
  if (visualStyle.includes('Portrait')) return 'Portrait centered';
  if (visualStyle.includes('Landscape') || visualStyle.includes('Nature')) return 'Landscape / Natural scene';
  if (visualStyle.includes('Product') || visualStyle.includes('Food')) return 'Product isolated / centered';
  if (visualStyle.includes('Animal') || visualStyle.includes('Wildlife')) return 'Animal subject centered';
  if (visualStyle.includes('Source-matched')) return 'Source-matched';
  if (visualStyle.includes('Gradient mesh')) return 'Source-matched smooth';
  if (visualStyle.includes('Painterly') || visualStyle.includes('Concept art') || visualStyle.includes('Folk art')) return 'Free painterly composition';
  return 'Flat Lay'; // Default
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
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'logo-clean', name: 'Clean Logo', type: PanelMode.VECTOR, category: 'Legacy', description: 'Minimal vector tracing with sharp edges and aggressive color reduction. Ideal for converting sketches or raster logos into clean brand marks.', prompt: 'Vectorize the uploaded image with minimal detail preservation. Simplify shapes to geometric precision. Enforce sharp, clean edges. Reduce palette to 2 colors. Render on flat transparent background. Prioritize clarity and scalability.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Modern Flat', color_mode: 'limited', palette_depth: '2', detail_fidelity: 'Minimal', edge_quality: 'Sharp, refined', palette_strategy: 'Reduce to 2 colors', color_direction: 'Professional, restrained', background: 'Flat Transparent', form_language: 'Geometric, simplified', stroke_preset: 'Uniform Thin' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'modern-illustration', name: 'Modern Illustration', type: PanelMode.VECTOR, category: 'Legacy', description: 'Bold, colorful vector conversion with expressive forms and high contrast.', prompt: 'Vectorize the uploaded image with balanced detail preservation. Translate forms into bold, expressive shapes. Apply saturated, high-contrast color palette. Medium-bold defining outlines. Render on flat white background.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Modern Flat', color_mode: 'limited', palette_depth: '8', detail_fidelity: 'Moderate', edge_quality: 'Bold, expressive', palette_strategy: 'Moderate reduction (6-8 colors)', color_direction: 'Saturated, high-contrast', background: 'Flat White (#FFFFFF)', form_language: 'Organic, expressive', stroke_preset: 'Uniform Medium' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'soft-flat', name: 'Soft Flat', type: PanelMode.VECTOR, category: 'Legacy', description: 'Smooth, gentle vector conversion with minimalist forms and cheerful, light palette.', prompt: 'Vectorize the uploaded image with strong simplification. Reduce to essential flat shapes. Apply gentle, cheerful color palette. Thin defining outlines. Render on flat white background.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Modern Flat', color_mode: 'limited', palette_depth: '3', detail_fidelity: 'Minimal', edge_quality: 'Soft, refined', palette_strategy: 'Reduce to 2-3 colors', color_direction: 'Cheerful, light', background: 'Flat White (#FFFFFF)', form_language: 'Simplified, rounded', stroke_preset: 'Uniform Thin' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'gritty-art', name: 'Gritty Art', type: PanelMode.VECTOR, category: 'Legacy', description: 'High-detail vector conversion with dramatic contrast and textured aesthetic.', prompt: 'Vectorize the uploaded image with high detail preservation. Translate forms with dramatic contrast. Medium-bold outlines. Render on flat black background. Retain sense of texture and depth through shape complexity.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Bold Graphic', color_mode: 'limited', palette_depth: '6', detail_fidelity: 'High', edge_quality: 'Bold, textured feel', palette_strategy: 'Moderate reduction (6 colors)', color_direction: 'Dramatic, high-contrast', background: 'Flat Black (#000000)', form_language: 'Complex, atmospheric', stroke_preset: 'Uniform Heavy' } },
        ].map(p => p as VectorPreset)
      },
      {
        id: "lib-vector-prime",
        title: "PRIME_SYNTHESIS",
        mobileLabel: "PRIME_V",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'vector-clean-minimal', name: 'Clean Minimal', type: PanelMode.VECTOR, category: 'Prime', description: 'Ultra-minimal vector tracing. Shapes reduced to essentials. High legibility.', prompt: 'Vectorize the uploaded image with extreme simplification. Reduce to essential geometric shapes. Enforce clean, precise edges. Reduce palette to 2 colors. Render on flat transparent background.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Minimal Line', color_mode: 'limited', palette_depth: '2', detail_fidelity: 'Minimal', edge_quality: 'Clean, precise', palette_strategy: 'Reduce to 2 colors', color_direction: 'Professional, neutral', background: 'Flat Transparent', form_language: 'Geometric, reduced', stroke_preset: 'Uniform Thin' } },
          { id: 'vector-corporate-bold', name: 'Corporate Bold', type: PanelMode.VECTOR, category: 'Prime', description: 'Confident vector conversion with geometric precision and professional palette.', prompt: 'Vectorize the uploaded image with strong geometric simplification. Translate forms into bold, confident shapes. Apply professional 3-color palette. Medium-bold outlines. Render on flat white background.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Bold Graphic', color_mode: 'limited', palette_depth: '3', detail_fidelity: 'Moderate', edge_quality: 'Bold, precise', palette_strategy: 'Reduce to 3 colors', color_direction: 'Professional, authoritative', background: 'Flat White (#FFFFFF)', form_language: 'Geometric, structured', stroke_preset: 'Uniform Medium' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'vector-playful-organic', name: 'Playful Organic', type: PanelMode.VECTOR, category: 'Prime', description: 'Friendly, soft vector conversion with no outlines and cheerful colors.', prompt: 'Vectorize the uploaded image with organic simplification. Translate forms into soft, rounded shapes. No outlines. Apply cheerful, friendly color palette. Render on flat white background.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Modern Flat', color_mode: 'limited', palette_depth: '4', detail_fidelity: 'Moderate', edge_quality: 'Soft, organic', palette_strategy: 'Moderate reduction (4 colors)', color_direction: 'Cheerful, warm', background: 'Flat White (#FFFFFF)', form_language: 'Organic, rounded', stroke_preset: 'None' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'vector-abstract-expressive', name: 'Abstract Expressive', type: PanelMode.VECTOR, category: 'Prime', description: 'Artistic vector conversion with expressive interpretation of forms.', prompt: 'Vectorize the uploaded image with artistic license. Translate shapes expressively rather than literal tracing. Medium-bold outlines. Render on flat black background. Prioritize visual rhythm over fidelity.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Free painterly composition', style_category: 'Painterly Vector', color_mode: 'limited', palette_depth: '5', detail_fidelity: 'Moderate', edge_quality: 'Expressive, bold', palette_strategy: 'Moderate reduction (5 colors)', color_direction: 'Communicative, dynamic', background: 'Flat Black (#000000)', form_language: 'Abstract, rhythmic', stroke_preset: 'Uniform Medium' } },
        ].map(p => p as VectorPreset)
      },
      {
        id: "lib-vector-essentials",
        title: "ESSENTIALS",
        mobileLabel: "CORE_V",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: "vec-logo", name: "Logo", type: PanelMode.VECTOR, description: "Clean geometric vector tracing optimized for brand marks. High negative space.", prompt: "Vectorize the uploaded image as a clean geometric emblem. No outlines. Maximize negative space through simplification. Reduce palette to 4 colors. Render on flat white background.", metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Modern Flat', color_mode: 'limited', palette_depth: '4', detail_fidelity: 'Moderate', edge_quality: 'Clean, refined', palette_strategy: 'Moderate reduction (4 colors)', color_direction: 'Professional, balanced', background: 'Flat White (#FFFFFF)', form_language: 'Geometric, emblematic', stroke_preset: 'None' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: "vec-sticker-icon", name: "Sticker/Icon", type: PanelMode.VECTOR, description: "Bold, graphic vector conversion with heavy outlines and minimal shapes.", prompt: "Vectorize the uploaded image as a bold sticker or icon. Heavy defining outlines. Minimal shapes. Reduce palette to 3 colors. Cheerful color direction. Render on flat white background.", metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Bold Graphic', color_mode: 'limited', palette_depth: '3', detail_fidelity: 'Minimal', edge_quality: 'Bold, graphic', palette_strategy: 'Reduce to 3 colors', color_direction: 'Cheerful, punchy', background: 'Flat White (#FFFFFF)', form_language: 'Simplified, iconic', stroke_preset: 'Uniform Heavy' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: "vec-minimalist", name: "Minimalist", type: PanelMode.VECTOR, description: "Extreme reduction. Few shapes. Maximum breathing room. No outlines.", prompt: "Vectorize the uploaded image with extreme minimalist reduction. Translate only the most essential shapes. No outlines. Maximum negative space. Reduce palette to 2 colors. Render on flat white background.", metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Minimal Line', color_mode: 'limited', palette_depth: '2', detail_fidelity: 'Minimal', edge_quality: 'Clean, refined', palette_strategy: 'Reduce to 2 colors', color_direction: 'Professional, calm', background: 'Flat White (#FFFFFF)', form_language: 'Reduced, spacious', stroke_preset: 'None' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: "vec-technical", name: "Technical Diagram", type: PanelMode.VECTOR, description: "Precise, grid-aligned vector tracing. Thin outlines. Engineering aesthetic.", prompt: "Vectorize the uploaded image as a technical diagram. Enforce grid alignment. Thin, precise outlines. Reduce palette to 3 colors. Render on flat white background.", metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Geometric', color_mode: 'limited', palette_depth: '3', detail_fidelity: 'Moderate', edge_quality: 'Precise, technical', palette_strategy: 'Reduce to 3 colors', color_direction: 'Professional, neutral', background: 'Flat White (#FFFFFF)', form_language: 'Grid-aligned, structural', stroke_preset: 'Uniform Thin' } },
        ].map(p => p as VectorPreset)
      },
      {
        id: "lib-vector-flatstyles",
        title: "FLAT_STYLE_CORE",
        mobileLabel: "FLAT_V",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-flat-illustration",
            "name": "Flat Illustration",
            "type": PanelMode.VECTOR,
            "category": "Flat Styles",
            "description": "The definitive modern vector style. Solid fills, zero gradients, clean silhouettes, balanced 5–6 color palette. Foundation preset for app, editorial and marketing illustration.",
            "prompt": "Render as a flat vector-style illustration. Solid color fills only — no gradients, no shadows, no textures. Clean geometric shapes with sharp edges. Simplified forms with strong silhouettes. 5–6 flat matte colors. Generous negative space. Flat white background. Every shape reads as a deliberate flat geometric form. Clean vector aesthetic, raster PNG output.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Modern Flat" as VectorArtStyleCategory,
              "color_mode": "limited" as ColorMode,
              "palette_depth": "6" as PaletteDepth,
              "detail_fidelity": "Moderate" as DetailFidelity,
              "edge_quality": "Sharp, clean geometric",
              "palette_strategy": "Reduce to 5–6 colors",
              "color_direction": "Balanced, contemporary",
              "background": "Flat White (#FFFFFF)",
              "form_language": "Geometric, simplified silhouette",
              "material_appearance": "Flat matte" as MaterialAppearance,
              "stroke_preset": "None" as StrokePreset,
              "visual_complexity": "Medium" as VisualComplexity
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-flat-bold-graphic",
            "name": "Bold Graphic Flat",
            "type": PanelMode.VECTOR,
            "category": "Flat Styles",
            "description": "High-impact flat illustration with bold outlines and strong color blocking. Maximum graphic clarity. Ideal for social media, posters, and brand campaigns.",
            "prompt": "Render as a bold graphic flat vector-style illustration. Strong uniform medium outlines on all major forms. Maximum color contrast between adjacent shapes. 4–5 vibrant flat colors. Zero gradients. All forms simplified to bold readable silhouettes. White background. High-impact graphic result with strong vector aesthetic, raster PNG output.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Bold Graphic" as VectorArtStyleCategory,
              "color_mode": "limited" as ColorMode,
              "palette_depth": "5" as PaletteDepth,
              "detail_fidelity": "Minimal" as DetailFidelity,
              "edge_quality": "Bold, high-contrast",
              "palette_strategy": "Reduce to 4–5 vibrant colors",
              "color_direction": "High contrast, vibrant",
              "background": "Flat White (#FFFFFF)",
              "form_language": "Bold simplified silhouette",
              "material_appearance": "Flat matte" as MaterialAppearance,
              "stroke_preset": "Uniform Medium" as StrokePreset,
              "visual_complexity": "Low" as VisualComplexity
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-flat-duotone",
            "name": "Duotone Flat",
            "type": PanelMode.VECTOR,
            "category": "Flat Styles",
            "description": "Two-color flat poster technique. Subject rendered in one saturated foreground color against a contrasting background. Classic screen-print flat aesthetic.",
            "prompt": "Render as a duotone flat vector-style illustration. Exactly 2 colors only: a saturated foreground color and a contrasting background. Translate all subject detail into flat silhouette shapes using only the foreground color. No gradients. No intermediate tones. Flat poster aesthetic. Clean sharp edges. Raster PNG output.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Bold Graphic" as VectorArtStyleCategory,
              "color_mode": "duotone" as ColorMode,
              "palette_depth": "2" as PaletteDepth,
              "detail_fidelity": "Moderate" as DetailFidelity,
              "edge_quality": "Sharp, poster-precise",
              "palette_strategy": "Exactly 2 colors",
              "color_direction": "High contrast complementary pair",
              "background": "Flat contrasting color (user-defined)",
              "form_language": "Flat silhouette, screen-print",
              "material_appearance": "Flat matte" as MaterialAppearance,
              "stroke_preset": "None" as StrokePreset,
              "visual_complexity": "Low" as VisualComplexity
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-flat-papercut",
            "name": "Paper Cut Layers",
            "type": PanelMode.VECTOR,
            "category": "Flat Styles",
            "description": "Layered flat shapes that simulate paper cut-out depth. Each layer is a distinct flat color. Depth implied through shape overlap only — never gradients or shadows.",
            "prompt": "Render as a paper cut-out layered flat vector-style illustration. Translate subject into stacked flat shape layers — each layer a distinct flat color. Depth implied through shape overlap only, never gradients or drop shadows. 5–7 flat matte colors in stepped tonal sequence. Clean sharp edges on every layer. Off-white background. Craft paper cut aesthetic, clean vector look, raster PNG output.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Modern Flat" as VectorArtStyleCategory,
              "color_mode": "limited" as ColorMode,
              "palette_depth": "6" as PaletteDepth,
              "detail_fidelity": "Moderate" as DetailFidelity,
              "edge_quality": "Clean, crisp layer edges",
              "palette_strategy": "Stepped tonal layers (5–7 colors)",
              "color_direction": "Stepped tonal sequence, craft-inspired",
              "background": "Flat Off-White (#FAF9F7)",
              "form_language": "Layered flat cut-out shapes",
              "material_appearance": "Flat matte with implied paper depth" as MaterialAppearance,
              "stroke_preset": "None" as StrokePreset,
              "visual_complexity": "Medium" as VisualComplexity
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-flat-editorial",
            "name": "Bold Editorial",
            "type": PanelMode.VECTOR,
            "category": "Flat Styles",
            "description": "Magazine-quality flat illustration. Expressive simplified forms, confident color choices, strong composition. Suits editorial, thought leadership, and feature articles.",
            "prompt": "Render as a bold editorial flat vector-style illustration. Translate subject into confident, expressive flat shapes with strong compositional balance. 6–8 curated flat colors. No gradients. Forms are simplified but retain expressive character. Thin outlines on key figure boundaries, none elsewhere. Off-white background. Magazine editorial aesthetic, vector look, raster PNG output.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Modern Flat" as VectorArtStyleCategory,
              "color_mode": "limited" as ColorMode,
              "palette_depth": "8" as PaletteDepth,
              "detail_fidelity": "Moderate" as DetailFidelity,
              "edge_quality": "Expressive, confident",
              "palette_strategy": "Curated editorial palette (6–8 colors)",
              "color_direction": "Sophisticated, editorial, purposeful",
              "background": "Flat Off-White (#FAF9F7)",
              "form_language": "Expressive editorial flat forms",
              "material_appearance": "Flat matte" as MaterialAppearance,
              "stroke_preset": "Uniform Thin" as StrokePreset,
              "visual_complexity": "Medium" as VisualComplexity
            }
          }
        ].map(p => p as VectorPreset)
      },
      {
        id: "lib-vector-experimental",
        title: "EXPERIMENTAL_LAB",
        mobileLabel: "EXP_V",
        type: PresetCategoryType.BUILT_IN,
        items: [
          {
            "id": "vector-data-mosh",
            "name": "Data Corruption",
            "type": PanelMode.VECTOR,
            "category": "Experimental",
            "description": "Intentional digital glitch aesthetic applied during vectorization. Controlled corruption, clean execution.",
            "prompt": "Vectorize the uploaded image with controlled digital corruption. Apply RGB channel separation. Introduce intentional geometric artifacts. Thin outlines. Render on flat black background. 8-color palette.",
            "metadata": { /*preferredEngine: ImageEngine.GEMINI*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Geometric" as VectorArtStyleCategory, // Best fit for glitch with geometric artifacts
              "color_mode": "limited" as ColorMode,
              "palette_depth": "8" as PaletteDepth,
              "detail_fidelity": "High" as DetailFidelity,
              "edge_quality": "Clean with controlled disruption",
              "palette_strategy": "Moderate reduction (8 colors)",
              "color_direction": "Communicative, electronic",
              "background": "Flat Black (#000000)",
              "form_language": "Geometric with glitch artifacts",
              "stroke_preset": "Uniform Thin" as StrokePreset,
              "effect": "Channel separation, controlled artifacts",
              "visual_complexity": "High" as VisualComplexity
            }
          },
          {
            "id": "vector-brutalist",
            "name": "Brutalist Vector",
            "type": PanelMode.VECTOR,
            "category": "Experimental",
            "description": "Raw, unpolished geometric conversion. Intentional awkwardness. Anti-design aesthetic.",
            "prompt": "Vectorize the uploaded image with brutalist rawness. Default system color logic. Intentional awkward spacing. Unpolished geometric simplification. Medium-bold outlines. Render on flat white background. 3-color palette.",
            "metadata": { /*preferredEngine: ImageEngine.GEMINI*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Bold Graphic" as VectorArtStyleCategory, // Brutalist is often bold graphic
              "color_mode": "limited" as ColorMode,
              "palette_depth": "3" as PaletteDepth,
              "detail_fidelity": "Minimal" as DetailFidelity,
              "edge_quality": "Raw, unrefined",
              "palette_strategy": "Reduce to 3 colors",
              "color_direction": "Default system, primary",
              "background": "Flat White (#FFFFFF)",
              "form_language": "Unpolished geometric",
              "stroke_preset": "Uniform Heavy" as StrokePreset,
              "refinement": "Intentional none",
              "visual_complexity": "Low" as VisualComplexity
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vector-neo-construct",
            "name": "Neo-Constructivist",
            "type": PanelMode.VECTOR,
            "category": "Experimental",
            "description": "Soviet cyberpunk fusion. Geometric propaganda aesthetic with electric accents.",
            "prompt": "Vectorize the uploaded image in neo-constructivist style. Geometric propaganda forms with cyberpunk influence. Palette restricted to red, black, and single electric blue accent. Thin outlines. Render on flat black background. 8-color palette.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Geometric" as VectorArtStyleCategory,
              "color_mode": "limited" as ColorMode, // Technically limited to 3
              "palette_depth": "3" as PaletteDepth,
              "detail_fidelity": "Moderate" as DetailFidelity,
              "edge_quality": "Refined, geometric",
              "palette_strategy": "Fixed palette (Red, Black, Electric Blue)",
              "color_direction": "Revolutionary, intense",
              "background": "Flat Black (#000000)",
              "form_language": "Constructivist geometric",
              "stroke_preset": "Uniform Thin" as StrokePreset,
              "palette_forced": "#FF0000, #000000, #00FFFF",
              "visual_complexity": "Medium" as VisualComplexity
            }
          },
          {
            "id": "vector-chem-diagram",
            "name": "Chemical Diagrams",
            "type": PanelMode.VECTOR,
            "category": "Experimental",
            "description": "Scientific illustration aesthetic. Molecular precision. Bond lines and electron dots.",
            "prompt": "Vectorize the uploaded image as a chemical diagram. Translate forms into molecular structure aesthetic. Bond lines and electron dot patterns. Thin outlines. Render on flat white background. 2-color palette.",
            "metadata": { /*preferredEngine: ImageEngine.GEMINI*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Geometric" as VectorArtStyleCategory, // Diagrams are inherently geometric
              "color_mode": "limited" as ColorMode,
              "palette_depth": "2" as PaletteDepth,
              "detail_fidelity": "Minimal" as DetailFidelity,
              "edge_quality": "Precise, technical",
              "palette_strategy": "Reduce to 2 colors",
              "color_direction": "Scientific, neutral",
              "background": "Flat White (#FFFFFF)",
              "form_language": "Molecular, diagrammatic",
              "stroke_preset": "Uniform Thin" as StrokePreset,
              "notation": "Bond lines, electron dots",
              "visual_complexity": "Low" as VisualComplexity
            }
          }
        ].map(p => p as VectorPreset)
      },
      {
        id: "lib-vector-artistic",
        title: "ARTISTIC_STUDIO",
        mobileLabel: "ART_V",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: "vec-illustration", name: "Illustration", type: PanelMode.VECTOR, description: "Detailed vector conversion with layered shapes and smooth forms. No outlines.", prompt: "Vectorize the uploaded image as a detailed illustration. Translate forms into layered, smooth shapes. No outlines. Reduce palette to 6 colors. Render on flat white background.", metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Modern Flat', color_mode: 'limited', palette_depth: '6', detail_fidelity: 'High', edge_quality: 'Smooth, organic', palette_strategy: 'Moderate reduction (6 colors)', color_direction: 'Communicative, rich', background: 'Flat White (#FFFFFF)', form_language: 'Layered, illustrative', stroke_preset: 'None' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-photo-vec",
            "name": "Retro Screen Print",
            "type": PanelMode.VECTOR,
            "category": "Artistic",
            "description": "Classic screen-print / risograph flat vector aesthetic. Deliberately 3-color palette, vintage print feel, color zone tension suggesting hand-pulled registration.",
            "prompt": "Render as a retro screen-print flat vector-style illustration. Simulate a 3-color screen print: background layer, midtone layer, foreground detail layer. Clean flat fills only. Slight color zone tension suggesting hand-pulled print registration. No gradients. Warm vintage palette: cream, burnt sienna, navy. Flat off-white background. Screen-print vector aesthetic, raster PNG output.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Bold Graphic" as VectorArtStyleCategory,
              "color_mode": "limited" as ColorMode,
              "palette_depth": "3" as PaletteDepth,
              "detail_fidelity": "Moderate" as DetailFidelity,
              "edge_quality": "Bold, print-graphic",
              "palette_strategy": "Fixed 3-color screen print layers",
              "color_direction": "Warm vintage: cream, sienna, navy",
              "background": "Flat Off-White (#FDF5E6)",
              "form_language": "Screen-print layered flat graphic",
              "material_appearance": "Flat matte with print layer tension" as MaterialAppearance,
              "stroke_preset": "None" as StrokePreset,
              "visual_complexity": "Low" as VisualComplexity,
              "era_influence": "Vintage Screen Print / Risograph"
            }
          },
          { id: "vec-line-art", name: "Line Art", type: PanelMode.VECTOR, description: "Clean, uniform stroke conversion. No fills. Simplified line drawing aesthetic.", prompt: "Vectorize the uploaded image as clean line art. Convert to uniform strokes. No fills. Single color. Thin, consistent outlines. Render on flat white background.", metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Minimal Line', color_mode: 'monochrome', palette_depth: '2', detail_fidelity: 'Minimal', edge_quality: 'Clean, uniform', palette_strategy: 'Single color', color_direction: 'Monochrome', background: 'Flat White (#FFFFFF)', form_language: 'Linear, simplified', stroke_preset: 'Uniform Thin', fills: 'None' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-watercolor",
            "name": "Soft Pastel Flat",
            "type": PanelMode.VECTOR,
            "category": "Artistic",
            "description": "Gentle flat vector illustration with soft pastel palette. Rounded organic shapes, no outlines, light airy feel. True vector replacement for the gradient-heavy watercolor style.",
            "prompt": "Render as a soft pastel flat vector-style illustration. Organic rounded shapes with clean edges. No outlines. Soft pastel palette: blush pink, mint, lavender, butter yellow, soft peach, white. Zero gradients — solid flat fills only. Light, airy, gentle composition. Flat white background. Clean vector aesthetic, raster PNG output.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Modern Flat" as VectorArtStyleCategory,
              "color_mode": "limited" as ColorMode,
              "palette_depth": "6" as PaletteDepth,
              "detail_fidelity": "Moderate" as DetailFidelity,
              "edge_quality": "Soft, rounded, organic",
              "palette_strategy": "Soft pastel palette (5–6 colors)",
              "color_direction": "Pastel, light, airy",
              "background": "Flat White (#FFFFFF)",
              "form_language": "Rounded organic flat shapes",
              "material_appearance": "Flat matte" as MaterialAppearance,
              "stroke_preset": "None" as StrokePreset,
              "visual_complexity": "Low" as VisualComplexity
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: "vec-abstract", name: "Abstract", type: PanelMode.VECTOR, description: "Non-objective vector interpretation. Dynamic composition. Artistic reduction.", prompt: "Vectorize the uploaded image as abstract vector forms. Translate shapes non-objectively. Dynamic compositional balance. No outlines. Render on flat white background. 4-color palette.", metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Free painterly composition', style_category: 'Painterly Vector', color_mode: 'limited', palette_depth: '4', detail_fidelity: 'Moderate', edge_quality: 'Clean, considered', palette_strategy: 'Moderate reduction (4 colors)', color_direction: 'Communicative, balanced', background: 'Flat White (#FFFFFF)', form_language: 'Abstract, compositional', stroke_preset: 'None', abstraction_level: 'High' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-fantasy",
            "name": "Geometric Pattern",
            "type": PanelMode.VECTOR,
            "category": "Artistic",
            "description": "Flat geometric pattern and repeat design aesthetic. Subject translated into tessellating shapes. Clean grid-based or radial composition.",
            "prompt": "Render as a flat geometric pattern vector-style illustration. Translate subject into repeating or radiating geometric shapes: hexagons, triangles, diamonds. No gradients. Flat bold fills. 4–6 high-contrast colors. Clean grid or radial composition. Pattern elements tile logically. White background. Strong geometric vector aesthetic, raster PNG output.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": "Flat Lay" as LayoutType,
              "style_category": "Geometric" as VectorArtStyleCategory,
              "color_mode": "limited" as ColorMode,
              "palette_depth": "6" as PaletteDepth,
              "detail_fidelity": "Minimal" as DetailFidelity,
              "edge_quality": "Precise, grid-perfect",
              "palette_strategy": "High contrast (4–6 colors)",
              "color_direction": "Bold, pattern-optimized",
              "background": "Flat White (#FFFFFF)",
              "form_language": "Geometric tessellating pattern",
              "material_appearance": "Flat matte" as MaterialAppearance,
              "stroke_preset": "None" as StrokePreset,
              "visual_complexity": "Medium" as VisualComplexity
            }
          },
          { id: "vec-isometric", name: "Isometric", type: PanelMode.VECTOR, description: "3D-effect vector conversion. Geometric perspective. Grid-aligned precision.", prompt: "Vectorize the uploaded image in isometric perspective. Translate forms into 3D-effect geometric projection. Grid alignment. Thin outlines. Render on flat white background. 5-color professional palette.", metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { layout_type: 'Isometric', style_category: 'Geometric', color_mode: 'limited', palette_depth: '5', detail_fidelity: 'High', edge_quality: 'Precise, technical', palette_strategy: 'Moderate reduction (5 colors)', color_direction: 'Professional, dimensional', background: 'Flat White (#FFFFFF)', form_language: 'Isometric, geometric', stroke_preset: 'Uniform Thin', perspective: 'Isometric' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: "vec-organic", name: "Organic", type: PanelMode.VECTOR, description: "Nature-inspired fluid forms. Biological curves. Soft, no outlines.", prompt: "Vectorize the uploaded image with organic, fluid forms. Biological inspiration. Soft, curved translation. No outlines. Render on flat soft gray background. 5-color communicative palette.", metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Free painterly composition', style_category: 'Modern Flat', color_mode: 'limited', palette_depth: '5', detail_fidelity: 'Moderate', edge_quality: 'Fluid, organic', palette_strategy: 'Moderate reduction (5 colors)', color_direction: 'Communicative, natural', background: 'Flat Soft Gray (#F5F5F2)', form_language: 'Biological, flowing', stroke_preset: 'None', curvature: 'High' } },
          { id: "vec-tech", name: "Tech", type: PanelMode.VECTOR, description: "Digital circuit aesthetic. High-tech UI influence. Dark background.", prompt: "Vectorize the uploaded image with high-tech digital aesthetic. Circuit pattern influence in form language. UI design language. Thin outlines. Render on flat black background. 4-color professional palette.", metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { layout_type: 'Flat Lay', style_category: 'Geometric', color_mode: 'limited', palette_depth: '4', detail_fidelity: 'High', edge_quality: 'Refined, technical', palette_strategy: 'Moderate reduction (4 colors)', color_direction: 'Professional, futuristic', background: 'Flat Black (#000000)', form_language: 'Digital, circuit-influenced', stroke_preset: 'Uniform Thin', tech_influence: 'High' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: "vec-architectural-realism", name: "Architectural Realism", type: PanelMode.VECTOR, description: "Precise architectural vector illustration with clean modular forms and soft daylight realism.", prompt: "Vectorize the uploaded image as a flat architectural illustration. Enforce clean geometric lines, modular building facades, and a symmetrical central perspective. Emulate soft natural daylight with a warm earth tone palette accented by cerulean sky. Ligne Claire vector style with precise fine-line definition.", metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { layout_type: 'Source-matched', style_category: 'Geometric', color_mode: 'limited', palette_depth: '6', detail_fidelity: 'High', edge_quality: 'Precise, fine-line', palette_strategy: 'Moderate reduction (6 colors)', color_direction: 'Warm earth tones, cerulean accents', background: 'Flat Off-White (#FAF9F7)', form_language: 'Modular architectural, geometric', stroke_preset: 'Uniform Thin' } },
        ].map(p => p as VectorPreset)
      },
      {
        id: "lib-vector-fullcolor",
        title: "FULL_COLOR_ILLUSTRATION", // Updated title
        mobileLabel: "FULL_COLOR",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-editorial-rich",
            "name": "Editorial Rich",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Magazine-quality illustration with 12+ color palette, soft shading, and editorial sophistication.",
            "prompt": "Vectorize the uploaded image as rich editorial illustration. Preserve maximum detail with 12+ color palette. Smooth gradient-like transitions through layered shapes. Sophisticated color harmony. No outlines. Soft shading through overlapping forms. Render on flat white background.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Editorial magazine illustration"),
              "style_category": getVectorArtStyleCategory("Editorial magazine illustration"),
              "color_mode": "full-color" as ColorMode, // Editorial rich suggests full color
              "palette_depth": getPaletteDepth("12+ colors"),
              "color_preservation": "High", // Implicit from description
              "detail_fidelity": getDetailFidelity("Very High"),
              "edge_quality": "Smooth, refined",
              "palette_strategy": "Extensive palette (12+ colors)",
              "color_direction": "Sophisticated, harmonious",
              "background": "Flat White (#FFFFFF)",
              "form_language": "Layered, editorial quality",
              "material_appearance": "Smooth flat color zones", // Implied soft shading
              "stroke_preset": getStrokePreset("None"),
              "visual_complexity": "Very High", // Implied from detail level
              "shading_technique": "Overlapping shapes for depth"
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-childrens-book",
            "name": "Children's Book",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Warm, friendly full-color style with rounded forms and cheerful 10-color palette.",
            "prompt": "Vectorize the uploaded image as children's book illustration. Translate forms into warm, rounded shapes. Apply cheerful 10-color palette with soft tones. Thin friendly outlines. Soft edge treatment. Render on flat soft cream background. Emphasis on approachability and warmth.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Children's book illustration"),
              "style_category": getVectorArtStyleCategory("Children's book illustration"),
              "color_mode": "full-color" as ColorMode, // Cheerful 10-color suggests full color for kids
              "palette_depth": getPaletteDepth("10 colors"),
              "color_preservation": "Moderate",
              "detail_fidelity": getDetailFidelity("High"),
              "edge_quality": "Soft, rounded",
              "palette_strategy": "Rich palette (10 colors)",
              "color_direction": "Warm, cheerful, soft",
              "background": "Flat Soft Cream (#FFF8F0)",
              "form_language": "Rounded, friendly",
              "material_appearance": "Flat matte",
              "stroke_preset": getStrokePreset("Thin friendly outlines"),
              "visual_complexity": "Medium",
              "character": "Approachable, warm"
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-nature-detailed",
            "name": "Nature Detailed",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Botanical and nature illustration with rich natural colors, organic forms, and 15+ color palette.",
            "prompt": "Vectorize the uploaded image as detailed nature illustration. Maximum organic detail preservation. Rich natural color palette with 15+ colors. Very thin natural outlines. Flowing organic edges. Botanical accuracy in form. Render on flat off-white background. Emphasis on natural texture through color variation.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Detailed nature illustration"),
              "style_category": getVectorArtStyleCategory("Detailed nature illustration"),
              "color_mode": "full-color" as ColorMode,
              "palette_depth": getPaletteDepth("15+ colors"),
              "color_preservation": "Maximum",
              "detail_fidelity": getDetailFidelity("Maximum"),
              "edge_quality": "Organic, flowing",
              "palette_strategy": "Extensive natural palette (15+ colors)",
              "color_direction": "Natural, earthy, rich",
              "background": "Flat Off-White (#FAF9F7)",
              "form_language": "Organic, botanical",
              "material_appearance": "Flat color zones", // Implied from natural texture
              "stroke_preset": getStrokePreset("Very thin natural outlines"),
              "visual_complexity": "Very High", // Implied from detail level
              "detail_emphasis": "Natural texture variations"
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-retro-poster",
            "name": "Retro Poster",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Vintage travel poster aesthetic with 8-color palette, bold forms, and nostalgic charm.",
            "prompt": "Vectorize the uploaded image as vintage travel poster. Simplify to bold iconic forms. Apply 8-color vintage palette with slightly muted tones. Medium bold outlines for definition. Clean geometric simplification. Render on flat cream background. Emphasis on nostalgic poster aesthetic.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Vintage travel poster"),
              "style_category": getVectorArtStyleCategory("Vintage travel poster"),
              "color_mode": "limited" as ColorMode, // 8 colors is limited for full color
              "palette_depth": getPaletteDepth("8 colors vintage"),
              "color_preservation": "Moderate",
              "detail_fidelity": getDetailFidelity("Moderate"),
              "edge_quality": "Clean, bold",
              "palette_strategy": "Moderate palette (8 colors)",
              "color_direction": "Vintage, slightly muted",
              "background": "Flat Cream (#F5EFE0)",
              "form_language": "Bold, simplified, iconic",
              "material_appearance": "Flat matte" as MaterialAppearance,
              "stroke_preset": getStrokePreset("Medium bold outlines"),
              "visual_complexity": "Low",
              "aesthetic": "Vintage travel poster"
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-concept-art",
            "name": "Concept Art",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Game/film concept art style with dramatic lighting, 14-color palette, and atmospheric depth.",
            "prompt": "Vectorize the uploaded image as concept art illustration. Preserve dramatic lighting and atmosphere. Apply 14-color palette with strong value contrast. No outlines. Painterly edge quality. Layered depth with atmospheric perspective. Render on flat dark gray background. Emphasis on cinematic mood.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Concept art illustration"),
              "style_category": getVectorArtStyleCategory("Concept art illustration"),
              "color_mode": "full-color" as ColorMode,
              "palette_depth": getPaletteDepth("14 colors"),
              "color_preservation": "High",
              "detail_fidelity": getDetailFidelity("Very High"),
              "edge_quality": "Painterly, atmospheric",
              "palette_strategy": "Rich dramatic palette (14 colors)",
              "color_direction": "Dramatic, high contrast",
              "background": "Flat Dark Gray (#2B2B2B)",
              "form_language": "Cinematic, atmospheric",
              "material_appearance": "Flat with depth faces", // Painterly suggests some implied depth
              "stroke_preset": getStrokePreset("None"),
              "visual_complexity": "Very High",
              "lighting_emphasis": "Dramatic, directional"
            }
          },
          {
            "id": "vec-comic-full",
            "name": "Comic Full Color",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Full-color comic book style with bold outlines, dynamic forms, and 10-color vibrant palette.",
            "prompt": "Vectorize the uploaded image as full-color comic book illustration. Bold dynamic forms with heavy black outlines. Apply vibrant 10-color palette with high saturation. Strong edge definition. Dynamic composition. Render on flat white background. Emphasis on action and energy.",
            "metadata": { /*preferredEngine: ImageEngine.GEMINI*/ },
            "parameters": {
              "layout_type": getLayoutType("Full-color comic book"),
              "style_category": getVectorArtStyleCategory("Full-color comic book"),
              "color_mode": "full-color" as ColorMode,
              "palette_depth": getPaletteDepth("10 colors vibrant"),
              "color_preservation": "High",
              "detail_fidelity": getDetailFidelity("High"),
              "edge_quality": "Bold, dynamic",
              "palette_strategy": "Vibrant palette (10 colors)",
              "color_direction": "Saturated, high-energy",
              "background": "Flat White (#FFFFFF)",
              "form_language": "Dynamic, action-oriented",
              "material_appearance": "Flat matte",
              "stroke_preset": getStrokePreset("Heavy black outlines"),
              "visual_complexity": "High",
              "contrast": "High, dramatic"
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-food-delicious",
            "name": "Food Illustration",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Appetizing food illustration with rich colors, detailed textures, and 12-color palette.",
            "prompt": "Vectorize the uploaded image as detailed food illustration. Maximum detail for appetizing appearance. Rich 12-color palette emphasizing delicious tones. Very thin outlines or none. Smooth edges suggesting texture. Highlight freshness and appeal. Render on flat soft white background.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Detailed food illustration"),
              "style_category": getVectorArtStyleCategory("Detailed food illustration"),
              "color_mode": "full-color" as ColorMode,
              "palette_depth": getPaletteDepth("12 colors rich"),
              "color_preservation": "Maximum",
              "detail_fidelity": getDetailFidelity("Very High"),
              "edge_quality": "Smooth, appetizing",
              "palette_strategy": "Rich palette (12 colors)",
              "color_direction": "Appetizing, rich, warm",
              "background": "Flat Soft White (#FAFAFA)",
              "form_language": "Smooth, detailed",
              "material_appearance": "Flat zones representing material surfaces", // for detailed texture
              "stroke_preset": getStrokePreset("Very thin or none"), // Default to Very Thin if not none
              "visual_complexity": "Very High",
              "emphasis": "Appetizing appeal"
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-portrait-stylized",
            "name": "Portrait Stylized",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Stylized portrait illustration with 10-color skin tones, expressive features, soft shading.",
            "prompt": "Vectorize the uploaded image as stylized portrait illustration. Preserve facial features and expression. Apply 10-color palette with accurate skin tones. Thin subtle outlines. Smooth shading through color layering. Expressive character emphasis. Render on flat soft gray background.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Stylized portrait illustration"),
              "style_category": getVectorArtStyleCategory("Stylized portrait illustration"),
              "color_mode": "full-color" as ColorMode,
              "palette_depth": getPaletteDepth("10 colors including skin tones"),
              "color_preservation": "High",
              "detail_fidelity": getDetailFidelity("High"),
              "edge_quality": "Smooth, refined",
              "palette_strategy": "Balanced palette (10 colors)",
              "color_direction": "Accurate skin tones, expressive",
              "background": "Flat Soft Gray (#F0F0F2)",
              "form_language": "Character-focused, expressive",
              "material_appearance": "Smooth flat color zones",
              "stroke_preset": getStrokePreset("Thin subtle outlines"),
              "smoothing": "High" as "High",
              "subject_type": "Portrait" as SubjectType,
              "visual_complexity": "High",
              "skin_tone_priority": true,
              "emphasis": "Facial features and expression"
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-landscape-scenic",
            "name": "Scenic Landscape",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Atmospheric landscape with depth layers, 15-color palette, and scenic beauty.",
            "prompt": "Vectorize the uploaded image as scenic landscape illustration. Create depth through atmospheric layers. Apply 15-color atmospheric palette with sky gradations. No outlines. Soft edges suggesting distance and atmosphere. Emphasis on scenic beauty and depth. Integrated background.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Scenic landscape illustration"),
              "style_category": getVectorArtStyleCategory("Scenic landscape illustration"),
              "color_mode": "full-color" as ColorMode,
              "palette_depth": getPaletteDepth("15 colors atmospheric"),
              "color_preservation": "High",
              "detail_fidelity": getDetailFidelity("Very High"),
              "edge_quality": "Soft, atmospheric",
              "palette_strategy": "Extensive atmospheric palette (15 colors)",
              "color_direction": "Atmospheric, scenic",
              "background": "Integrated landscape", // Special background handling
              "form_language": "Layered depth, atmospheric",
              "material_appearance": "Flat color zones",
              "stroke_preset": getStrokePreset("None"),
              "visual_complexity": "High",
              "depth_technique": "Atmospheric perspective"
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-pattern-rich",
            "name": "Pattern & Textile",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Detailed pattern illustration with 12+ colors, intricate details, and textile quality.",
            "prompt": "Vectorize the uploaded image as detailed pattern illustration. Preserve intricate details and repetition. Apply coordinated 12+ color palette. Very thin precise outlines. Maximum detail preservation. Emphasis on pattern clarity and textile quality. Render on flat white background.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Detailed pattern illustration"),
              "style_category": getVectorArtStyleCategory("Detailed pattern illustration"),
              "color_mode": "full-color" as ColorMode,
              "palette_depth": getPaletteDepth("12+ colors coordinated"),
              "color_preservation": "Maximum",
              "detail_fidelity": getDetailFidelity("Maximum"),
              "edge_quality": "Precise, detailed",
              "palette_strategy": "Coordinated rich palette (12+ colors)",
              "color_direction": "Harmonious, coordinated",
              "background": "Flat White (#FFFFFF)",
              "form_language": "Intricate, detailed",
              "material_appearance": "Flat matte",
              "stroke_preset": getStrokePreset("Very thin precise"),
              "visual_complexity": "Very High",
              "emphasis": "Pattern detail and clarity"
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-animals-realistic",
            "name": "Animals Realistic",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Realistic animal illustration with natural colors, fur/feather details, 14-color palette.",
            "prompt": "Vectorize the uploaded image as realistic animal illustration. Preserve natural fur/feather/scale textures through color variation. Apply 14-color natural palette. Very thin outlines or none. Textured edges suggesting natural materials. Realistic anatomical accuracy. Render on flat off-white background.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Realistic animal illustration"),
              "style_category": getVectorArtStyleCategory("Realistic animal illustration"),
              "color_mode": "full-color" as ColorMode,
              "palette_depth": getPaletteDepth("14 colors natural"),
              "color_preservation": "High",
              "detail_fidelity": getDetailFidelity("Very High"),
              "edge_quality": "Textured, natural",
              "palette_strategy": "Natural detailed palette (14 colors)",
              "color_direction": "Natural, realistic",
              "background": "Flat Off-White (#FAF9F7)",
              "form_language": "Naturalistic, anatomically accurate",
              "material_appearance": "Flat zones representing coat/feather texture",
              "stroke_preset": getStrokePreset("Very thin or none"),
              "subject_type": "Animal" as SubjectType,
              "visual_complexity": "High",
              "texture_emphasis": "Fur/feather/scale detail"
            }
          },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          {
            "id": "vec-cultural-folk",
            "name": "Cultural Folk Art",
            "type": PanelMode.VECTOR,
            "category": "Full Color Illustration",
            "description": "Folk art style with traditional patterns, vibrant 10-color palette, cultural motifs.",
            "prompt": "Vectorize the uploaded image as cultural folk art illustration. Emphasize traditional patterns and motifs. Apply vibrant 10-color traditional palette. Medium decorative outlines. Bold cultural forms. Respect cultural aesthetic traditions. Render on flat warm cream background.",
            "metadata": { /*preferredEngine: ImageEngine.HF*/ },
            "parameters": {
              "layout_type": getLayoutType("Cultural folk art illustration"),
              "style_category": getVectorArtStyleCategory("Cultural folk art illustration"),
              "color_mode": "full-color" as ColorMode,
              "palette_depth": getPaletteDepth("10 colors vibrant traditional"),
              "color_preservation": "High",
              "detail_fidelity": getDetailFidelity("High"),
              "edge_quality": "Bold, decorative",
              "palette_strategy": "Vibrant traditional palette (10 colors)",
              "color_direction": "Cultural, vibrant, traditional",
              "background": "Flat Warm Cream (#F5E8D0)",
              "form_language": "Decorative, cultural, traditional",
              "material_appearance": "Flat matte",
              "stroke_preset": getStrokePreset("Medium decorative outlines"),
              "visual_complexity": "Medium",
              "cultural_respect": "Traditional aesthetic preservation"
            }
          }
        ].map(p => p as VectorPreset)
      }
    ]
  },
  TYPOGRAPHY: {
    libraries: [
      {
        id: "lib-typo-modern-fusion",
        title: "MODERN_FUSION",
        mobileLabel: "MODERN",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'neo-vintage', name: 'Neo Vintage', type: PanelMode.TYPOGRAPHY, category: 'Modern', description: 'Retro-modern serif with vintage elegance', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using elegant serif typography in a retro-modern fusion style. Arrange letters in a clean horizontal layout with balanced spacing. Apply smooth color gradients and soft ambient shadows for depth. Maintain clean composition with generous negative space. Use a solid flat color background in warm vintage tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Serif', layout: 'Horizontal', spacing: 'Balanced', effects: 'Gradients', background: 'Warm', color_logic: 'Retro', texture: 'None', ornamentation: 'Minimal' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'minimal-3d', name: 'Minimal 3D', type: PanelMode.TYPOGRAPHY, category: 'Modern', description: 'Clean minimal sans-serif with subtle depth', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using clean modern sans-serif typography. Arrange letters in a clean horizontal layout with balanced spacing. Apply subtle 3D extrusion with clean shadow depth (2-4 layers). Use minimalist composition with maximum white space and breathing room. Use a solid flat color background in neutral tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Sans-Serif', layout: 'Horizontal', spacing: 'Clean', effects: '3D Extrusion', background: 'Neutral', color_logic: 'Minimal', texture: 'None', ornamentation: 'None' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'vaporwave-retro', name: 'Vaporwave', type: PanelMode.TYPOGRAPHY, category: 'Modern', description: 'Tilted sans-serif with 80s aesthetic', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using bold sans-serif typography with 80s aesthetic. Position letters at dynamic angles with perspective distortion. Add chrome reflections, neon glow, and retro grid accents. Create nostalgic vaporwave composition. Use a gradient background with pink-purple-cyan retro colors.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Bold Sans', layout: 'Tilted', spacing: 'Dynamic', effects: 'Chrome, Glow', background: 'Gradient', color_logic: 'Retro Neon', texture: 'Grid', ornamentation: 'None' } },
          { id: 'holographic-text', name: 'Holographic', type: PanelMode.TYPOGRAPHY, category: 'Modern', description: 'Futuristic metallic with rainbow reflection', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using modern sans-serif typography with futuristic finish. Arrange letters in a clean horizontal layout with balanced spacing. Apply iridescent holographic rainbow reflections and metallic chrome surface. Create high-tech futuristic aesthetic. Use a dark moody background to enhance holographic shine.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Sans-Serif', layout: 'Horizontal', spacing: 'Balanced', effects: 'Holographic', background: 'Dark', color_logic: 'Iridescent', texture: 'Metallic', ornamentation: 'None' } },
          { id: 'neon-sign-script', name: 'Neon Script', type: PanelMode.TYPOGRAPHY, category: 'Modern', description: 'Glowing neon sign tubes', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using flowing script typography mimicking neon tubes. Arrange letters in a clean horizontal layout following neon tube bends. Add vibrant neon glow effects with light bloom like illuminated signage. Create retro nightlife aesthetic. Use a dark moody background to enhance neon glow.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Script', layout: 'Horizontal', spacing: 'Connected', effects: 'Neon Glow', background: 'Dark', color_logic: 'Vibrant', texture: 'Light Bloom', ornamentation: 'Tubes' } },
          { id: 'retro-comic', name: 'Retro Comic', type: PanelMode.TYPOGRAPHY, category: 'Modern', description: 'Pop-art style with halftone dots', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using playful sans-serif typography with pop-art energy. Arrange letters in a clean horizontal layout. Style letters with bold comic book outlines and pop-art aesthetic with halftone dots. Create fun retro comic aesthetic. Use a solid flat color background in bold primary colors.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Playful Sans', layout: 'Horizontal', spacing: 'Tight', effects: 'Outlines', background: 'Primary', color_logic: 'Pop Art', texture: 'Halftone', ornamentation: 'Dots' } },
        ].map(p => p as TypographyPreset)
      },
      {
        id: "lib-typo-organic-flow",
        title: "ORGANIC_FLOW",
        mobileLabel: "ORGANIC",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'organic-flow', name: 'Organic Flow', type: PanelMode.TYPOGRAPHY, category: 'Organic', description: 'Script integrated with natural elements', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using flowing script typography integrated with natural elements. Flow letters organically following natural curves inspired by leaves, waves, and flames. Integrate organic botanical elements seamlessly into letterforms. Arrange with artistic freedom prioritizing aesthetic beauty. Use a solid flat color background in earthy natural tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Script', layout: 'Organic', spacing: 'Flowing', effects: 'None', background: 'Earthy', color_logic: 'Natural', texture: 'Organic', ornamentation: 'Botanical' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'liquid-ink', name: 'Liquid Ink', type: PanelMode.TYPOGRAPHY, category: 'Organic', description: 'Fluid script appearing as liquid ink', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using fluid script typography appearing as flowing liquid. Flow letters organically following natural curves. Make letters appear as flowing liquid ink with organic drips and paint flows. Arrange with artistic freedom and fluid movement. Use a solid flat color background in complementary tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Fluid Script', layout: 'Organic', spacing: 'Flowing', effects: 'Liquid', background: 'Complementary', color_logic: 'Ink', texture: 'Gloss', ornamentation: 'Drips' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'liquid-watercolor', name: 'Liquid Watercolor', type: PanelMode.TYPOGRAPHY, category: 'Organic', description: 'Artistic watercolor paint flows', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using elegant script typography with artistic fluidity. Flow letters organically following watercolor spread. Create letters with liquid watercolor paint flows and organic color bleeds. Create artistic watercolor aesthetic. Use a solid flat color background in soft paper tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Script', layout: 'Fluid', spacing: 'Loose', effects: 'Watercolor', background: 'Paper', color_logic: 'Pastel', texture: 'Paper Grain', ornamentation: 'Bleeds' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'liquid-metal', name: 'Liquid Metal', type: PanelMode.TYPOGRAPHY, category: 'Organic', description: 'Reflective metallic chrome mercury', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using bold decorative typography with premium finish. Flow letters organically following fluid curves. Create reflective metallic chrome mercury liquid surface with high shine. Create premium liquid metal aesthetic. Use a dark moody background to enhance reflections.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Bold Decorative', layout: 'Fluid', spacing: 'Tight', effects: 'Chrome', background: 'Dark', color_logic: 'Metallic', texture: 'Mercury', ornamentation: 'None' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'smoke-fire', name: 'Smoke & Fire', type: PanelMode.TYPOGRAPHY, category: 'Organic', description: 'Formed from smoke and flame', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using dynamic script typography with elemental energy. Position letters at dynamic angles for movement. Shape letters from smoke wisps and flame effects with ethereal trails. Create powerful elemental aesthetic. Use a dark moody background with fire glow accents.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Script', layout: 'Angled', spacing: 'Loose', effects: 'Elemental', background: 'Dark', color_logic: 'Fire', texture: 'Smoke', ornamentation: 'Flames' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'botanical-illustration', name: 'Botanical', type: PanelMode.TYPOGRAPHY, category: 'Organic', description: 'Elegant serif with floral integration', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using elegant serif typography with natural decoration. Arrange letters in a circular or curved composition. Integrate organic leaves and flowers seamlessly into letterforms with botanical illustration detail. Create elegant natural aesthetic. Use a solid flat color background in soft natural tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Serif', layout: 'Curved', spacing: 'Balanced', effects: 'None', background: 'Soft', color_logic: 'Natural', texture: 'None', ornamentation: 'Floral' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'animal-fusion', name: 'Animal Fusion', type: PanelMode.TYPOGRAPHY, category: 'Organic', description: 'Illustrated with animal silhouettes', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using illustrated typography with natural character. Interweave letters so they connect seamlessly. Subtly integrate animal silhouettes into letter shapes with organic integration. Create playful natural aesthetic. Use a solid flat color background in wildlife natural tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Illustrated', layout: 'Interwoven', spacing: 'Connected', effects: 'None', background: 'Natural', color_logic: 'Wildlife', texture: 'None', ornamentation: 'Silhouettes' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'hand-painted-brush', name: 'Hand Painted', type: PanelMode.TYPOGRAPHY, category: 'Organic', description: 'Authentic brush strokes', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using artistic script typography with handcrafted character. Flow letters organically with natural variation. Paint letters with visible natural brush stroke texture and paint splatter. Create authentic hand-painted aesthetic. Use a solid flat color background in canvas tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Brush Script', layout: 'Organic', spacing: 'Varied', effects: 'Paint', background: 'Canvas', color_logic: 'Paint', texture: 'Brush', ornamentation: 'Splatter' } },
        ].map(p => p as TypographyPreset)
      },
      {
        id: "lib-typo-tech-construct",
        title: "TECH_CONSTRUCT",
        mobileLabel: "TECH",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'kinetic-typography', name: 'Kinetic', type: PanelMode.TYPOGRAPHY, category: 'Tech', description: 'Dynamic angular sans-serif', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using bold modern sans-serif typography with energetic motion. Position letters at dynamic angles (5-15 degrees) for kinetic energy. Create dynamic asymmetric balance with letters at varying angles. Compose with visual tension and movement. Use a solid flat color background in vibrant contrasting colors.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Bold Sans', layout: 'Angled', spacing: 'Dynamic', effects: 'Motion', background: 'Vibrant', color_logic: 'Contrast', texture: 'None', ornamentation: 'None' } },
          { id: 'cyberpunk-neon', name: 'Cyberpunk Neon', type: PanelMode.TYPOGRAPHY, category: 'Tech', description: 'Futuristic sans-serif with glow', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using futuristic sans-serif typography with cyberpunk aesthetic. Arrange letters in a clean horizontal layout with wide letter spacing. Add vibrant neon glow effects with light bloom and digital glitch artifacts. Create high-contrast composition with bold presence. Use a dark moody background with neon color accents.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Futuristic Sans', layout: 'Wide', spacing: 'Spaced', effects: 'Glow, Glitch', background: 'Dark', color_logic: 'Neon', texture: 'None', ornamentation: 'None' } },
          { id: 'fractal-type', name: 'Fractal', type: PanelMode.TYPOGRAPHY, category: 'Tech', description: 'Geometric forms from math patterns', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using geometric structured typography formed from mathematical patterns. Compose letters in an abstract artistic arrangement. Form letters using repeating mathematical fractal patterns and geometric recursion. Create complex visual interest through pattern repetition. Use a solid flat color background in technical monochrome.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Geometric', layout: 'Abstract', spacing: 'Complex', effects: 'None', background: 'Monochrome', color_logic: 'Technical', texture: 'Fractal', ornamentation: 'Recursion' } },
          { id: 'pixel-mosaic', name: 'Pixel Mosaic', type: PanelMode.TYPOGRAPHY, category: 'Tech', description: 'Retro 8-bit aesthetic', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using blocky sans-serif typography with retro digital aesthetic. Arrange letters in solid block formation. Construct letters from pixel fragments and 8-bit mosaic blocks. Create nostalgic retro gaming composition. Use a solid flat color background in bold primary colors.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Blocky', layout: 'Block', spacing: 'Grid', effects: 'Pixelation', background: 'Primary', color_logic: 'Retro', texture: 'Mosaic', ornamentation: 'None' } },
          { id: 'geometric-wireframe', name: 'Wireframe', type: PanelMode.TYPOGRAPHY, category: 'Tech', description: '3D construction lines', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using technical sans-serif typography with structural detail. Compose letters in an abstract artistic arrangement. Build letters with visible 3D wireframe construction lines and geometric scaffolding. Create technical architectural aesthetic. Use a solid flat color background in technical blueprint tones.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Technical Sans', layout: 'Abstract', spacing: 'Structural', effects: 'Wireframe', background: 'Blueprint', color_logic: 'Technical', texture: 'Grid', ornamentation: 'Lines' } },
          { id: 'cyber-grid', name: 'Cyber Grid', type: PanelMode.TYPOGRAPHY, category: 'Tech', description: 'Fused with circuit patterns', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using technical geometric typography with digital integration. Compose letters in an abstract artistic arrangement. Fuse letters with circuit board lines and cyber grid patterns with technical precision. Create high-tech digital aesthetic. Use a dark moody background with grid line accents.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Geometric', layout: 'Abstract', spacing: 'Precise', effects: 'None', background: 'Dark', color_logic: 'Digital', texture: 'Circuit', ornamentation: 'Grid' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'futuristic-origami', name: 'Future Origami', type: PanelMode.TYPOGRAPHY, category: 'Tech', description: 'Clean geometric paper folds', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using clean sans-serif typography with geometric craft. Create depth with overlapping letter layers. Fold letters with futuristic minimal geometric paper folds and sharp angles. Create modern minimal origami aesthetic. Use a solid flat color background in clean technical tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Clean Sans', layout: 'Layered', spacing: 'Tight', effects: 'Shadows', background: 'Technical', color_logic: 'Minimal', texture: 'Paper', ornamentation: 'Folds' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'crystal-facets', name: 'Crystal Facets', type: PanelMode.TYPOGRAPHY, category: 'Tech', description: 'Prismatic faceted geometry', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using elegant illustrated typography with prismatic quality. Create depth with overlapping letter layers. Give letters faceted crystal geometry with light refraction and prismatic rainbow splits. Create luxury crystalline aesthetic. Use a solid flat color background in jewel tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Illustrated', layout: 'Layered', spacing: 'Overlapping', effects: 'Refraction', background: 'Jewel', color_logic: 'Prismatic', texture: 'Crystal', ornamentation: 'Facets' } },
        ].map(p => p as TypographyPreset)
      },
      {
        id: "lib-typo-artistic-craft",
        title: "ARTISTIC_CRAFT",
        mobileLabel: "ARTISTIC",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'double-exposure', name: 'Double Exposure', type: PanelMode.TYPOGRAPHY, category: 'Artistic', description: 'Layered with photographic fill', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using bold illustrated typography with layered depth. Create depth with overlapping letter layers. Fill letters with photographic or abstract artistic imagery using double exposure technique. Create complex visual interest through image integration. Use a solid flat color background that complements the imagery.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Bold Illustrated', layout: 'Layered', spacing: 'Overlapping', effects: 'Double Exposure', background: 'Complementary', color_logic: 'Photographic', texture: 'Image', ornamentation: 'None' } },
          { id: 'graffiti-collage', name: 'Graffiti Collage', type: PanelMode.TYPOGRAPHY, category: 'Artistic', description: 'Urban textures and stickers', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using urban graffiti-style typography with street aesthetic. Create depth with overlapping letter layers. Build letters from urban textures, street posters, and sticker collage elements. Create gritty authentic street art composition. Use a solid flat color background in urban concrete tones.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Graffiti', layout: 'Layered', spacing: 'Tight', effects: 'Texture', background: 'Urban', color_logic: 'Street', texture: 'Collage', ornamentation: 'Stickers' } },
          { id: 'collage-cutout', name: 'Collage Cutout', type: PanelMode.TYPOGRAPHY, category: 'Artistic', description: 'Layered paper pieces', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using bold sans-serif typography with crafted texture. Arrange letters in a clean horizontal layout. Construct letters from layered paper cutout collage pieces with visible edges. Create handmade craft aesthetic. Use a solid flat color background in paper tones.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Bold Sans', layout: 'Horizontal', spacing: 'Standard', effects: 'Shadows', background: 'Paper', color_logic: 'Craft', texture: 'Cutout', ornamentation: 'None' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'origami-letters', name: 'Origami', type: PanelMode.TYPOGRAPHY, category: 'Artistic', description: 'Dimensional paper folds', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using modern illustrated typography with dimensional craft. Create depth with overlapping letter layers. Fold letters like paper origami sculptures with visible creases and paper texture. Create dimensional handcrafted aesthetic. Use a solid flat color background in clean minimal tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Illustrated', layout: 'Layered', spacing: 'Tight', effects: 'Shadows', background: 'Minimal', color_logic: 'Paper', texture: 'Creases', ornamentation: 'Folds' } },
          { id: 'cosmic-space', name: 'Cosmic Space', type: PanelMode.TYPOGRAPHY, category: 'Artistic', description: 'Filled with nebula and stars', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using bold illustrated typography with cosmic theme. Compose letters in an abstract artistic arrangement. Fill letters with galaxy nebula and star field textures with cosmic depth. Create mystical space aesthetic. Use a dark moody background with deep space colors.', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letterform_style: 'Bold Illustrated', layout: 'Abstract', spacing: 'Loose', effects: 'Glow', background: 'Space', color_logic: 'Cosmic', texture: 'Nebula', ornamentation: 'Stars' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'steampunk-gear', name: 'Steampunk', type: PanelMode.TYPOGRAPHY, category: 'Artistic', description: 'Gears and mechanical parts', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using ornamental decorative typography with industrial detail. Stack letters tightly with interlocking forms. Integrate steampunk gears and mechanical Victorian parts into letterforms. Create complex mechanical aesthetic. Use a solid flat color background in brass and copper tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Decorative', layout: 'Stacked', spacing: 'Tight', effects: 'None', background: 'Brass', color_logic: 'Metallic', texture: 'Metal', ornamentation: 'Gears' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'metallic-engraved', name: 'Engraved', type: PanelMode.TYPOGRAPHY, category: 'Artistic', description: 'Embossed surface detail', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using classic serif typography with premium finish. Stack letters tightly with strong presence. Add metallic engraving and embossed surface detail with carved depth. Create luxury heritage aesthetic. Use a solid flat color background in rich metallic tones.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Serif', layout: 'Stacked', spacing: 'Tight', effects: 'Embossing', background: 'Metallic', color_logic: 'Rich', texture: 'Engraved', ornamentation: 'Carving' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'bioluminescent-glow', name: 'Bioluminescent', type: PanelMode.TYPOGRAPHY, category: 'Artistic', description: 'Organic natural glow', prompt: 'Generate a high-fidelity typography artwork for the text "{TEXT}" using organic script typography with natural luminescence. Flow letters organically following natural curves. Make letters glow with organic bioluminescent light effect like deep sea creatures. Create mystical natural glow aesthetic. Use a dark moody background to enhance glow.', metadata: { /*preferredEngine: ImageEngine.HF*/ }, parameters: { letterform_style: 'Organic Script', layout: 'Flowing', spacing: 'Natural', effects: 'Glow', background: 'Dark', color_logic: 'Bioluminescent', texture: 'None', ornamentation: 'None' } },
        ].map(p => p as TypographyPreset)
      }
    ]
  },
  MONOGRAM: {
    libraries: [
      {
        id: "lib-mono-luxury",
        title: "LUXURY_TEXTURE",
        mobileLabel: "LUXURY",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-velvet-interlock', name: 'Velvet Interlock', type: PanelMode.MONOGRAM, category: 'Luxury', description: 'Luxury interlocking serif with gold foil on black velvet', prompt: 'Create an elegant interlocking monogram with intertwined serif letters, luxury aesthetic with gold foil embossing effect on rich black velvet texture, symmetrical design with balanced negative space, uppercase letters with sophisticated elegance', metadata: { layout: 'interlocking', style: 'serif', theme: 'Luxury', twist: 'Gold foil on black velvet', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'interwoven', symmetry: 'symmetrical', container: 'none', legibility_target: 'Medium', form_language: 'elegant-serif', stroke_character: 'Standard', spatial_density: 'Balanced', abstraction_tolerance: 'Low', period_influence: 'Luxury' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-royal-seal', name: 'Royal Seal', type: PanelMode.MONOGRAM, category: 'Regal', description: 'Circular ornamental regal with wax seal effect', prompt: 'Create a circular ornamental monogram with centered letters in royal seal design, regal aesthetic with wax seal effect on aged parchment, radial symmetry with royal flourishes and ornate frame, uppercase letters with embossed seal impression texture', metadata: { layout: 'circular', style: 'ornamental', theme: 'Regal', twist: 'Wax seal on parchment', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'centered-circular', symmetry: 'radial-symmetry', container: 'circular-ornate', legibility_target: 'Medium', form_language: 'ornamental-flourish', stroke_character: 'Complex', spatial_density: 'Dense', abstraction_tolerance: 'Low', period_influence: 'Regal' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-stone-mason', name: 'Stone Mason', type: PanelMode.MONOGRAM, category: 'Historical', description: 'Historical crest carved into granite with deep shadows', prompt: 'Create a historical crest monogram with letters carved into granite stone, shield frame with ornate heraldic design, chiseled serif letters with deep shadow effects, uppercase letters with weathered stone texture and symmetrical composition', metadata: { layout: 'crest', style: 'serif-chiseled', theme: 'Historical', twist: 'Carved granite stone', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'shield-centered', symmetry: 'heraldic-symmetry', container: 'shield', legibility_target: 'High', form_language: 'chiseled-serif', stroke_character: 'Sharp', spatial_density: 'Dense', abstraction_tolerance: 'Low', period_influence: 'Historical' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-stained-glass', name: 'Stained Glass', type: PanelMode.MONOGRAM, category: 'Religious', description: 'Circular gothic religious with backlit colored glass segments', prompt: 'Create a circular gothic monogram with centered radial letter arrangement, religious stained glass aesthetic with colored glass segments and lead lines, backlit glow effect with jewel tone colors, uppercase letters in ornate gothic style with translucent glass texture', metadata: { layout: 'circular', style: 'gothic', theme: 'Religious', twist: 'Backlit stained glass', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'centered-radial', symmetry: 'radial-gothic', container: 'circular-ornate', legibility_target: 'Medium', form_language: 'leaded-glass', stroke_character: 'Lead', spatial_density: 'Dense', abstraction_tolerance: 'Medium', period_influence: 'Religious' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-embroidery', name: 'Embroidery', type: PanelMode.MONOGRAM, category: 'Craft', description: 'Horizontal script craft with realistic thread texture', prompt: 'Create a horizontal script monogram with flowing letter arrangement, craft aesthetic with realistic embroidered thread texture and visible stitches, balanced composition on fabric background, mixed case letters with raised thread embroidery effect', metadata: { layout: 'horizontal', style: 'script', theme: 'Craft', twist: 'Embroidered thread on fabric', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'flowing-script', symmetry: 'balanced', container: 'none', legibility_target: 'High', form_language: 'thread-stitch', stroke_character: 'Textured', spatial_density: 'Tight', abstraction_tolerance: 'Low', period_influence: 'Craft' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-botanical-wreath', name: 'Botanical Wreath', type: PanelMode.MONOGRAM, category: 'Romantic', description: 'Circular serif romantic with laurels or wildflowers woven around', prompt: 'Create a circular botanical monogram with centered letters surrounded by laurel or wildflower wreath, romantic elegant serif design with hand-illustrated botanical details, radial natural symmetry with delicate floral integration, mixed case letters with soft watercolor botanical frame', metadata: { layout: 'circular', style: 'serif-elegant', theme: 'Romantic', twist: 'Hand-illustrated botanicals', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'centered-wreath', symmetry: 'radial-natural', container: 'botanical-circle', legibility_target: 'Medium', form_language: 'flowing-botanical', stroke_character: 'Vine', spatial_density: 'Dense', abstraction_tolerance: 'Low', period_influence: 'Romantic' } },
          { id: 'mono-fashion-brand', name: 'Fashion Brand', type: PanelMode.MONOGRAM, category: 'Chic', description: 'Interlocking serif high contrast chic, intertwined luxury icons', prompt: 'Create an interlocking fashion brand monogram with mirrored intertwined letters like iconic C/G/L logos, chic high-contrast serif design with elegant thin-thick stroke variation, mirrored symmetry with refined negative space, uppercase letters in luxury fashion aesthetic', metadata: { layout: 'interlocking', style: 'serif-high-contrast', theme: 'Chic', twist: 'Clean vector luxury', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'mirrored-intertwined', symmetry: 'mirrored', container: 'none', legibility_target: 'High', form_language: 'thin-thick-contrast', stroke_character: 'Standard', spatial_density: 'Balanced', abstraction_tolerance: 'Low', period_influence: 'Chic' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-floral-fusion', name: 'Floral Fusion', type: PanelMode.MONOGRAM, category: 'Romantic', description: 'Interlocking illustrated romantic with intertwined flowers and leaves', prompt: 'Create an interlocking illustrated monogram with letters composed of intertwined flowers and leaves, romantic floral fusion design with hand-illustrated botanical details, organic symmetry with delicate floral texture, decorative letterforms flowing with botanical elements', metadata: { layout: 'interlocking', style: 'illustrated-floral', theme: 'Romantic', twist: 'Hand-illustrated flowers', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'floral-intertwined', symmetry: 'organic-symmetry', container: 'organic', legibility_target: 'Medium', form_language: 'flowing-organic', stroke_character: 'Vine', spatial_density: 'Dense', abstraction_tolerance: 'Medium', period_influence: 'Romantic' } },
        ].map(p => p as MonogramPreset)
      },
      {
        id: "lib-mono-urban",
        title: "URBAN_KINETIC",
        mobileLabel: "URBAN",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-street-tag', name: 'Street Tag', type: PanelMode.MONOGRAM, category: 'Urban', description: 'Layered graffiti urban with drip paint & overspray', prompt: 'Create a layered graffiti monogram with dynamically overlapping letters, urban street art aesthetic with spray paint drips and overspray texture, asymmetrical composition with raw paint texture, mixed case letters with wild graffiti style', metadata: { layout: 'layered', style: 'graffiti', theme: 'Urban', twist: 'Spray paint on wall', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'overlapping-dynamic', symmetry: 'asymmetrical', container: 'none', legibility_target: 'Medium', form_language: 'graffiti-wild', stroke_character: 'Round', spatial_density: 'Tight', abstraction_tolerance: 'Medium', period_influence: 'Urban' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-neon-sign', name: 'Neon Sign', type: PanelMode.MONOGRAM, category: 'Nightlife', description: 'Stacked script nightlife with realistic glass tubing & bloom', prompt: 'Create a stacked script monogram with vertical letter arrangement, nightlife aesthetic with realistic glass neon tubing and light bloom effects, centered composition with glowing outline, mixed case letters forming continuous tube design', metadata: { layout: 'stacked', style: 'script', theme: 'Nightlife', twist: 'Glass neon tubes', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'vertical-stack', symmetry: 'centered', container: 'none', legibility_target: 'High', form_language: 'tube-continuous', stroke_character: 'Tubular', spatial_density: 'Open', abstraction_tolerance: 'Low', period_influence: 'Nightlife' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-industrial-stencil', name: 'Industrial Stencil', type: PanelMode.MONOGRAM, category: 'Utility', description: 'Horizontal military utility with spray paint stencil on rust', prompt: 'Create a horizontal military stencil monogram with spaced letter arrangement, industrial utility aesthetic with spray paint stencil effect on rusted metal, functional design with stencil bridge connections, uppercase bold letters with weathered rust texture and paint overspray', metadata: { layout: 'horizontal', style: 'military-stencil', theme: 'Utility', twist: 'Spray paint on rusted metal', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'stencil-spaced', symmetry: 'functional', container: 'none', legibility_target: 'High', form_language: 'stencil-bridges', stroke_character: 'Block', spatial_density: 'Uniform', abstraction_tolerance: 'Low', period_influence: 'Utility' } },
          { id: 'mono-urban-collage', name: 'Urban Collage', type: PanelMode.MONOGRAM, category: 'Street / Creative', description: 'Layered illustrated street/creative from stickers, posters, graffiti', prompt: 'Create a layered illustrated monogram with letters formed from urban collage of stickers, posters, and graffiti textures, street creative aesthetic with chaotic layered elements, asymmetrical composition with textured street art finish, mixed case letters built from urban collage materials', metadata: { layout: 'layered', style: 'illustrated-urban', theme: 'Street / Creative', twist: 'Stickers, posters, graffiti textures', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'collage-layers', symmetry: 'asymmetrical', container: 'none', legibility_target: 'Medium', form_language: 'collage-mixed', stroke_character: 'None', spatial_density: 'Dense', abstraction_tolerance: 'Medium', period_influence: 'Street / Creative' } },
          { id: 'mono-neon-outline', name: 'Neon Outline', type: PanelMode.MONOGRAM, category: 'Urban', description: 'Horizontal sans-serif urban with bright neon outline, subtle glow', prompt: 'Create a horizontal sans-serif monogram with side-by-side letters, urban modern aesthetic with bright neon outline and subtle glow effect, balanced composition with clean negative space, uppercase outline letters with vibrant neon tube effect', metadata: { layout: 'horizontal', style: 'sans-serif-bold', theme: 'Urban', twist: 'Neon tube outline', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'side-by-side', symmetry: 'balanced', container: 'none', legibility_target: 'High', form_language: 'neon-outline', stroke_character: 'Glow', spatial_density: 'Open', abstraction_tolerance: 'Low', period_influence: 'Urban' } },
          { id: 'mono-fire-smoke', name: 'Fire & Smoke', type: PanelMode.MONOGRAM, category: 'Dramatic', description: 'Tilted illustrated dramatic with realistic flames and smoke trails', prompt: 'Create a tilted illustrated monogram with letters formed from realistic flames and smoke trails, dramatic elemental design with fire flicker and smoke wisps, dynamic rising composition with flame-merged connections, letterforms created from orange-red fire with gray smoke tendrils', metadata: { layout: 'tilted', style: 'illustrated-elemental', theme: 'Dramatic', twist: 'Fire and smoke elements', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'flame-rising', symmetry: 'dynamic-rising', container: 'none', legibility_target: 'Low', form_language: 'fire-organic', stroke_character: 'Flame', spatial_density: 'Variable', abstraction_tolerance: 'High', period_influence: 'Dramatic' } },
        ].map(p => p as MonogramPreset)
      },
      {
        id: "lib-mono-tech",
        title: "FUTURE_TECH",
        mobileLabel: "TECH",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-cyber-glyph', name: 'Cyber-Glyph', type: PanelMode.MONOGRAM, category: 'Futuristic', description: 'Abstract futuristic tech letters formed by glowing circuits', prompt: 'Create an abstract futuristic monogram with letters formed by glowing circuit board patterns, cybernetic design with neon cyan circuits and tech grid, asymmetrical composition with digital artifacts, technical geometric style', metadata: { layout: 'abstract', style: 'tech-geometric', theme: 'Futuristic', twist: 'Glowing circuit board', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'fused', symmetry: 'asymmetrical', container: 'none', legibility_target: 'Medium', form_language: 'circuit-lines', stroke_character: 'Line', spatial_density: 'Dense', abstraction_tolerance: 'Medium', period_influence: 'Futuristic' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-vaporwave-grid', name: 'Vaporwave Grid', type: PanelMode.MONOGRAM, category: 'Retro-Digital', description: 'Tilted retro-digital with glitch artifacts & chrome gradient', prompt: 'Create a tilted retro-digital monogram with perspective-angled letters, vaporwave aesthetic with chrome gradient and glitch artifacts, grid pattern background with asymmetrical composition, uppercase letters with holographic finish and scan lines', metadata: { layout: 'tilted', style: 'retro-digital', theme: 'Retro-Digital', twist: 'Chrome gradient with glitch', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'perspective-angled', symmetry: 'asymmetrical', container: 'none', legibility_target: 'Medium', form_language: 'retro-digital', stroke_character: 'Pixel', spatial_density: 'Variable', abstraction_tolerance: 'Medium', period_influence: 'Retro-Digital' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-liquid-metal', name: 'Liquid Metal', type: PanelMode.MONOGRAM, category: 'Y2K', description: 'Fluid 3D chrome Y2K with mercury-like reflection', prompt: 'Create a fluid 3D chrome monogram with flowing merged letters, Y2K aesthetic with liquid mercury metal effect and melting reflections, organic flowing composition with high-shine chrome finish, uppercase letters with reflective liquid metal texture', metadata: { layout: 'fluid', style: '3d-chrome', theme: 'Y2K', twist: 'Liquid mercury chrome', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'flowing-merged', symmetry: 'organic-flow', container: 'none', legibility_target: 'Medium', form_language: 'fluid-chrome', stroke_character: 'Rounded', spatial_density: 'Variable', abstraction_tolerance: 'Medium', period_influence: 'Y2K' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-digital-circuit', name: 'Digital Circuit', type: PanelMode.MONOGRAM, category: 'Tech', description: 'Abstract illustrated tech with glowing circuit board patterns', prompt: 'Create an abstract illustrated monogram with letters formed by glowing circuit board patterns, tech design with circuit traces and electronic components, technical pattern composition with neon glow effects, letterforms built from cyan glowing circuit paths on PCB background', metadata: { layout: 'abstract', style: 'illustrated-circuit', theme: 'Tech', twist: 'Glowing circuit board', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'circuit-formed', symmetry: 'technical-pattern', container: 'none', legibility_target: 'Medium', form_language: 'circuit-paths', stroke_character: 'Trace', spatial_density: 'Dense', abstraction_tolerance: 'Medium', period_influence: 'Tech' } },
          { id: 'mono-blueprint', name: 'Blueprint', type: PanelMode.MONOGRAM, category: 'Engineering', description: 'Stacked technical engineering with white lines on blue grid', prompt: 'Create a stacked technical monogram with vertical precise letter arrangement, engineering blueprint aesthetic with white lines on blue grid background, technical precision with dimension marks and grid pattern, uppercase letters in precise technical drafting style', metadata: { layout: 'stacked', style: 'technical-sans', theme: 'Engineering', twist: 'Blueprint paper', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'vertical-technical', symmetry: 'technical-precision', container: 'technical-border', legibility_target: 'High', form_language: 'technical-drafting', stroke_character: 'Line', spatial_density: 'Uniform', abstraction_tolerance: 'Low', period_influence: 'Engineering' } },
          { id: 'mono-galaxy-merge', name: 'Galaxy Merge', type: PanelMode.MONOGRAM, category: 'Cosmic', description: 'Abstract illustrated cosmic with swirling galaxy patterns', prompt: 'Create an abstract illustrated monogram with letters formed by swirling galaxy nebula patterns, cosmic design with spiral galaxy arms and star clusters, organic spiral composition with deep space negative space, abstract letterforms created from luminous nebula gas and cosmic matter', metadata: { layout: 'abstract', style: 'illustrated-galaxy', theme: 'Cosmic', twist: 'Swirling galaxy nebula', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'swirling-merged', symmetry: 'spiral-organic', container: 'none', legibility_target: 'Medium', form_language: 'spiral-galaxy', stroke_character: 'Dust', spatial_density: 'Variable', abstraction_tolerance: 'High', period_influence: 'Cosmic' } },
          { id: 'mono-cosmic-spark', name: 'Cosmic Spark', type: PanelMode.MONOGRAM, category: 'Mystical', description: 'Abstract illustrated mystical with stars or cosmic particle patterns', prompt: 'Create an abstract illustrated monogram with letters formed by cosmic stars and particle patterns, mystical design with glowing constellation of particles, ethereal composition with luminous cosmic void negative space, abstract letterforms created from starlight and energy particles', metadata: { layout: 'abstract', style: 'illustrated-cosmic', theme: 'Mystical', twist: 'Glowing cosmic particles', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'particle-formed', symmetry: 'constellation-pattern', container: 'none', legibility_target: 'Medium', form_language: 'constellation-dots', stroke_character: 'Point', spatial_density: 'Sparse', abstraction_tolerance: 'High', period_influence: 'Mystical' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-origami-fold', name: 'Origami Fold', type: PanelMode.MONOGRAM, category: 'Delicate', description: 'Layered papercraft with sharp creases and paper texture', prompt: 'Create a layered papercraft monogram with letters formed by origami folds, delicate design with sharp paper creases and realistic paper texture, geometric folding patterns with paper shadow depth, uppercase letters with matte paper finish', metadata: { layout: 'layered', style: 'papercraft', theme: 'Delicate', twist: 'Folded paper origami', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'folded-layers', symmetry: 'geometric-fold', container: 'none', legibility_target: 'Medium', form_language: 'geometric-fold', stroke_character: 'Sharp', spatial_density: 'Open', abstraction_tolerance: 'Medium', period_influence: 'Delicate' } },
        ].map(p => p as MonogramPreset)
      },
      {
        id: "lib-mono-structural",
        title: "STRUCTURAL_CORE",
        mobileLabel: "STRUCT",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: 'mono-corporate-prime', name: 'Corporate Prime', type: PanelMode.MONOGRAM, category: 'Professional', description: 'Professional horizontal geometric with negative space icon', prompt: 'Create a professional horizontal monogram with geometric sans-serif letters arranged side-by-side, corporate design where negative space forms an arrow or icon symbol, clean balanced composition with prominent negative space, uppercase bold letters', metadata: { layout: 'horizontal', style: 'sans-geometric', theme: 'Professional', twist: 'Clean flat design', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'side-by-side', symmetry: 'balanced', container: 'none', legibility_target: 'High', form_language: 'geometric-clean', stroke_character: 'Bold', spatial_density: 'Tight', abstraction_tolerance: 'Low', period_influence: 'Professional' } },
          { id: 'mono-vector-badge', name: 'Vector Badge', type: PanelMode.MONOGRAM, category: 'Sport', description: 'Shield bold sans sport with thick strokes, flat vector', prompt: 'Create a shield badge monogram with centered bold sans-serif letters, sport aesthetic with thick strokes and flat vector colors, symmetrical composition with clean vector negative space, uppercase extra-bold letters in athletic badge design', metadata: { layout: 'shield', style: 'bold-sans', theme: 'Sport', twist: 'Flat vector design', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'centered-badge', symmetry: 'symmetrical', container: 'shield-badge', legibility_target: 'High', form_language: 'thick-stroke', stroke_character: 'Thick', spatial_density: 'Tight', abstraction_tolerance: 'Low', period_influence: 'Sport' } },
          { id: 'mono-varsity-bold', name: 'Varsity Bold', type: PanelMode.MONOGRAM, category: 'Athletic', description: 'Stacked slab-serif athletic with blocky bold letters', prompt: 'Create a stacked slab-serif monogram with vertical athletic letter arrangement, varsity athletic aesthetic with blocky bold letterforms, centered composition with tight stacking, uppercase extra-bold slab serif letters in school spirit colors', metadata: { layout: 'stacked', style: 'slab-serif-bold', theme: 'Athletic', twist: 'Flat vector athletic', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'vertical-athletic', symmetry: 'centered', container: 'none', legibility_target: 'High', form_language: 'blocky-athletic', stroke_character: 'Heavy', spatial_density: 'Tight', abstraction_tolerance: 'Low', period_influence: 'Athletic' } },
          { id: 'mono-minimalist-dot', name: 'Minimalist Dot', type: PanelMode.MONOGRAM, category: 'Modern Minimalist', description: 'Horizontal sans-serif modern minimalist, separated by single dot', prompt: 'Create a horizontal sans-serif monogram with letters separated by single dot or thin line, modern minimalist aesthetic with ultra-clean design and generous negative space, balanced minimal composition with light to medium weight, uppercase letters with simple dot separator', metadata: { layout: 'horizontal', style: 'sans-serif-thin', theme: 'Modern Minimalist', twist: 'Clean minimal vector', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'dot-separated', symmetry: 'balanced-minimal', container: 'none', legibility_target: 'High', form_language: 'clean-minimal', stroke_character: 'Thin', spatial_density: 'Open', abstraction_tolerance: 'Low', period_influence: 'Modern Minimalist' } },
        ].map(p => p as MonogramPreset)
      },
      {
        id: "lib-mono-artistic",
        title: "ARTISTIC_FLUID",
        mobileLabel: "ART",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: 'mono-celtic-knot', name: 'Celtic Knot', type: PanelMode.MONOGRAM, category: 'Mystical', description: 'Interlocking ornamental mystical with endless woven line', prompt: 'Create an interlocking Celtic knot monogram with letters woven in endless continuous lines, mystical ornamental design with traditional Celtic knotwork patterns, radial symmetry with decorative weaving, ancient carved texture with aged patina finish', metadata: { layout: 'interlocking', style: 'ornamental-celtic', theme: 'Mystical', twist: 'Ancient carved stone or metal', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'woven-endless', symmetry: 'radial-symmetry', container: 'circular', legibility_target: 'Medium', form_language: 'continuous-weave', stroke_character: 'Line', spatial_density: 'Dense', abstraction_tolerance: 'Medium', period_influence: 'Mystical' } },
          { id: 'mono-optic-illusion', name: 'Optic Illusion', type: PanelMode.MONOGRAM, category: 'Trippy', description: 'Abstract geometric trippy with impossible geometry', prompt: 'Create an abstract geometric monogram with letters formed by impossible Escher-style geometry, trippy optical illusion design with paradoxical spatial relationships, clean geometric lines creating visual paradox, abstract letterforms with impossible construction', metadata: { layout: 'abstract', style: 'geometric-abstract', theme: 'Trippy', twist: 'Optical illusion', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'impossible-geometry', symmetry: 'escher-style', container: 'none', legibility_target: 'Medium', form_language: 'impossible-construct', stroke_character: 'Line', spatial_density: 'Dense', abstraction_tolerance: 'Medium', period_influence: 'Trippy' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-smoke-signal', name: 'Smoke Signal', type: PanelMode.MONOGRAM, category: 'Ethereal', description: 'Fluid abstract ethereal letters formed by wisps of smoke', prompt: 'Create a fluid abstract monogram with letters formed by flowing wisps of smoke, ethereal design with soft dissipating vapor texture and smoke tendrils, organic flowing composition with ghostly smoke gradients, abstract letterforms emerging from smoke', metadata: { layout: 'fluid', style: 'abstract-organic', theme: 'Ethereal', twist: 'Smoke wisps', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'flowing-wisps', symmetry: 'organic-flow', container: 'none', legibility_target: 'Low', form_language: 'smoke-tendrils', stroke_character: 'Soft', spatial_density: 'Sparse', abstraction_tolerance: 'High', period_influence: 'Ethereal' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-double-exposure', name: 'Double Exposure', type: PanelMode.MONOGRAM, category: 'Cinematic', description: 'Layered photographic cinematic with landscape imagery inside letters', prompt: 'Create a layered photographic monogram with letters filled with landscape imagery using double exposure technique, cinematic design with artistic photo blending and silhouette letterforms, artistic balance with photographic reveal in negative space, uppercase bold outline letters', metadata: { layout: 'layered', style: 'photographic', theme: 'Cinematic', twist: 'Double exposure photography', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'image-filled', symmetry: 'artistic-balance', container: 'none', legibility_target: 'High', form_language: 'photo-silhouette', stroke_character: 'None', spatial_density: 'Full', abstraction_tolerance: 'Low', period_influence: 'Cinematic' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-watercolor-dream', name: 'Watercolor Dream', type: PanelMode.MONOGRAM, category: 'Ethereal', description: 'Fluid illustrated ethereal painted in soft watercolor strokes', prompt: 'Create a fluid illustrated monogram with letters painted in soft watercolor strokes, ethereal dreamy aesthetic with watercolor paint blooms and organic bleeds, flowing painted arrangement with soft paper texture, abstract letterforms created from delicate watercolor brush strokes', metadata: { layout: 'fluid', style: 'illustrated-watercolor', theme: 'Ethereal', twist: 'Watercolor paint on paper', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'flowing-painted', symmetry: 'organic-balance', container: 'none', legibility_target: 'Medium', form_language: 'brush-strokes', stroke_character: 'Brush', spatial_density: 'Variable', abstraction_tolerance: 'Medium', period_influence: 'Ethereal' } },
          { id: 'mono-fantasy-rune', name: 'Fantasy Rune', type: PanelMode.MONOGRAM, category: 'Mystical', description: 'Interlocking illustrated mystical styled like ancient runes with glow', prompt: 'Create an interlocking illustrated monogram with letters styled as ancient fantasy runes with glowing magical accents, mystical design with carved stone texture and magic energy glow, balanced composition within magical circle frame, runic symbols intertwined with blue magic glow', metadata: { layout: 'interlocking', style: 'illustrated-runic', theme: 'Mystical', twist: 'Ancient carved runes', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'runic-intertwined', symmetry: 'mystical-balance', container: 'magical-circle', legibility_target: 'Medium', form_language: 'ancient-runes', stroke_character: 'Carved', spatial_density: 'Variable', abstraction_tolerance: 'Medium', period_influence: 'Mystical' } },
          { id: 'mono-cosmic-ink', name: 'Cosmic Ink', type: PanelMode.MONOGRAM, category: 'Mystical', description: 'Circular illustrated mystical with ink splatters and star particles', prompt: 'Create a circular illustrated monogram with letters formed by cosmic ink splatters and glowing star particles, mystical design with stardust and ink flowing together, radial cosmic composition within circular frame, cosmic script letterforms with purple ink and gold star accents', metadata: { layout: 'circular', style: 'illustrated-cosmic-ink', theme: 'Mystical', twist: 'Ink splatters with star particles', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'cosmic-centered', symmetry: 'radial-cosmic', container: 'circular-cosmic', legibility_target: 'Medium', form_language: 'cosmic-splatter', stroke_character: 'Liquid', spatial_density: 'Variable', abstraction_tolerance: 'High', period_influence: 'Mystical' } },
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-origami-fold', name: 'Origami Fold', type: PanelMode.MONOGRAM, category: 'Delicate', description: 'Layered papercraft with sharp creases and paper texture', prompt: 'Create a layered papercraft monogram with letters formed by origami folds, delicate design with sharp paper creases and realistic paper texture, geometric folding patterns with paper shadow depth, uppercase letters with matte paper finish', metadata: { layout: 'layered', style: 'papercraft', theme: 'Delicate', twist: 'Folded paper origami', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'folded-layers', symmetry: 'geometric-fold', container: 'none', legibility_target: 'Medium', form_language: 'geometric-fold', stroke_character: 'Sharp', spatial_density: 'Open', abstraction_tolerance: 'Medium', period_influence: 'Delicate' } },
        ].map(p => p as MonogramPreset)
      },
      {
        id: "lib-mono-playful",
        title: "PLAYFUL_POP",
        mobileLabel: "POP",
        type: PresetCategoryType.BUILT_IN,
        items: [
          // FIX: Changed ImageEngine.FLUX to ImageEngine.HF
          { id: 'mono-origami-creature', name: 'Origami Creature', type: PanelMode.MONOGRAM, category: 'Playful', description: 'Layered illustrated playful with letters folded into animal shapes', prompt: 'Create a layered illustrated monogram with letters folded into playful origami animal shapes, whimsical design with paper fold creases and creature features, creative composition with animal form and paper shadow depth, letterforms transformed into cute origami creatures', metadata: { layout: 'layered', style: 'illustrated-origami', theme: 'Playful', twist: 'Folded paper animals', /*preferredEngine: ImageEngine.HF*/ }, parameters: { letter_relationship: 'creature-shaped', symmetry: 'creature-form', container: 'none', legibility_target: 'Medium', form_language: 'fold-lines', stroke_character: 'Fold', spatial_density: 'Variable', abstraction_tolerance: 'High', period_influence: 'Playful' } },
          { id: 'mono-pop-art-burst', name: 'Pop-Art Burst', type: PanelMode.MONOGRAM, category: 'Playful', description: 'Horizontal illustrated playful filled with comic-book dots and bursts', prompt: 'Create a horizontal illustrated monogram with letters filled with comic-book style halftone dots and action bursts, playful pop-art aesthetic with Ben-Day dots and bold outlines, balanced composition with comic energy and burst effects, uppercase bold letters in vibrant primary pop-art colors', metadata: { layout: 'horizontal', style: 'illustrated-pop-art', theme: 'Playful', twist: 'Comic book print', /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { letter_relationship: 'side-by-side-pop', symmetry: 'balanced-pop', container: 'none', legibility_target: 'High', form_language: 'comic-outline', stroke_character: 'Bold', spatial_density: 'Tight', abstraction_tolerance: 'Low', period_influence: 'Playful' } },
        ].map(p => p as MonogramPreset)
      }
    ]
  },
  EMBLEM_FORGE: {
    libraries: [
      { id: "lib-emblem-heraldic", title: "HERALDIC_SYSTEMS", mobileLabel: "HERALDRY", type: PresetCategoryType.BUILT_IN, items: [
        { id: 'emblem-heraldic-crest', name: 'Heraldic Crest', type: PanelMode.EMBLEM_FORGE, description: 'Traditional shield containment. Ornamental borders. Central lion or eagle motif. Curved typography top/bottom. Vintage authority.', prompt: 'Generate a traditional heraldic crest emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Shield (Heater or Escutcheon)', border: 'Ornamental scrollwork', illustration: 'Lion rampant or Eagle displayed', illustration_style: 'Traditional heraldic, flat color', typography_layout: 'Curved top/bottom', text_hierarchy: 'Primary dominant, subtext secondary', background: 'Flat Deep Navy (#0A0A1A) or Flat Burgundy (#2A0A0A)', period_influence: 'Medieval / Renaissance' } },
        { id: 'emblem-baroque', name: 'Continental Baroque', type: PanelMode.EMBLEM_FORGE, description: 'Ornate, asymmetrical Rococo influence. Shellwork, foliate scrolls. Cartouche containment. Elegant, opulent.', prompt: 'Generate a Baroque cartouche emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Cartouche (asymmetrical)', border: 'Shellwork, foliate scrolls', illustration: 'Griffin, stag, or floral arrangement', illustration_style: 'Ornate, decorative', typography_layout: 'Flowing, curved', text_hierarchy: 'Integrated within ornament', background: 'Flat Deep Warm Gray (#2A2A1A) or Flat Burgundy (#3A1A1A)', period_influence: 'Baroque / Rococo' } },
        { id: 'emblem-gothic-revival', name: 'Gothic Revival', type: PanelMode.EMBLEM_FORGE, description: 'Pointed arches, quatrefoils, tracery. Ecclesiastical, collegiate. Vertical emphasis. Stained glass color logic.', prompt: 'Generate a Gothic Revival emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Pointed arch / Lancet', border: 'Tracery, quatrefoil, foliate', illustration: 'Book, chalice, lily, or mitre', illustration_style: 'Stained glass influence, flat color', typography_layout: 'Vertical or curved', text_hierarchy: 'Primary dominant, Latin optional', background: 'Flat Deep Jewel (#1A2A3A) or Flat Burgundy (#2A1A2A)', period_influence: 'Gothic / Victorian' } },
      ].map(p => p as EmblemPreset) },
      { id: "lib-emblem-trade", title: "TRADE_GUILDS", mobileLabel: "GUILDS", type: PresetCategoryType.BUILT_IN, items: [
        { id: 'emblem-barbershop', name: 'Barbershop', type: PanelMode.EMBLEM_FORGE, description: 'Circular form. Bold diagonal stripes. Central razor or scissors motif. Playful, masculine.', prompt: 'Generate a barbershop emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle', border: 'Diagonal stripe pattern', illustration: 'Straight razor or scissors', illustration_style: 'Bold graphic, flat color', typography_layout: 'Curved top/bottom', text_hierarchy: 'Primary dominant', background: 'Flat White (#FFFFFF) or Flat Cream (#FAF0E6)', period_influence: 'Traditional / Americana' } },
        { id: 'emblem-coffee-seal', name: 'Coffee Seal', type: PanelMode.EMBLEM_FORGE, description: 'Circular seal. Steam, coffee plant, or mountain motif. Rustic, artisanal typography. Warm, earthy palette.', prompt: 'Generate a coffee seal emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle', border: 'Ornamental dot/line', illustration: 'Coffee plant, steam, mountain', illustration_style: 'Rustic, artisanal', typography_layout: 'Curved top/bottom', text_hierarchy: 'Primary + origin/date optional', background: 'Flat Warm Cream (#FAF3E0) or Flat Terracotta (#8B4C39)', period_influence: 'Artisanal / Craft' } },
        { id: 'emblem-brewery', name: 'Brewery', type: PanelMode.EMBLEM_FORGE, description: 'Oval or barrel shape. Wheat, hop, or stein motif. Vintage slab-serif typography. Rustic, sturdy.', prompt: 'Generate a brewery emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Oval / Barrel', border: 'Barley, hop vine', illustration: 'Wheat sheaf, hop cone, stein', illustration_style: 'Vintage, sturdy', typography_layout: 'Curved top/bottom or straight', text_hierarchy: 'Primary dominant, established date optional', background: 'Flat Warm Brown (#4A3A2A) or Flat Cream (#FAF0E6)', period_influence: 'Traditional / Rustic' } },
        { id: 'emblem-butcher', name: 'Butcher / Charcuterie', type: PanelMode.EMBLEM_FORGE, description: 'Bold, graphic. Hog, cleaver, or sausage motif. Industrial, rustic. Heavy slab typography.', prompt: 'Generate a butcher or charcuterie emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Oval / Shield', border: 'Bold graphic, rope optional', illustration: 'Hog, cleaver, sausage, bone', illustration_style: 'Bold, graphic, flat color', typography_layout: 'Curved or straight', text_hierarchy: 'Primary dominant, established optional', background: 'Flat White (#FFFFFF) or Flat Black (#000000)', period_influence: 'Industrial / Rustic' } },
        { id: 'emblem-bakery', name: 'Bakery', type: PanelMode.EMBLEM_FORGE, description: 'Warm, inviting. Wheat sheaf, rolling pin, or pretzel motif. Script or slab typography. Hearth aesthetic.', prompt: 'Generate a bakery emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle / Oval', border: 'Wheat, flour dust pattern', illustration: 'Wheat sheaf, rolling pin, pretzel, loaf', illustration_style: 'Warm, inviting', typography_layout: 'Curved or arched', text_hierarchy: 'Primary dominant, established optional', background: 'Flat Warm Cream (#FAF0E0) or Flat Terracotta (#8B5A4A)', period_influence: 'Traditional / Hearth' } },
      ].map(p => p as EmblemPreset) },
      { id: "lib-emblem-sports", title: "SPORTS_COMPETITION", mobileLabel: "SPORTS", type: PresetCategoryType.BUILT_IN, items: [
        { id: 'emblem-sports-championship', name: 'Sports Championship', type: PanelMode.EMBLEM_FORGE, description: 'Shield form. Strong geometry. Star or laurel accents. Bold slab-serif. Dynamic, victorious.', prompt: 'Generate a sports championship emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Shield (Modern athletic)', border: 'Geometric, star or laurel', illustration: 'Star, laurel, trophy, or mascot silhouette', illustration_style: 'Bold, dynamic', typography_layout: 'Curved top, straight bottom', text_hierarchy: 'Primary dominant, established optional', background: 'Flat Team Color (customizable base)', period_influence: 'Contemporary Athletic' } },
        { id: 'emblem-esports', name: 'Esports', type: PanelMode.EMBLEM_FORGE, description: 'Aggressive, angular. Cyberpunk influence. Abstract animal/mascot. Glow effects. Futuristic.', prompt: 'Generate an esports emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Hexagon / Angular shield', border: 'Geometric, tech-influenced', illustration: 'Abstract animal head (wolf, lion, eagle, dragon)', illustration_style: 'Aggressive, angular', typography_layout: 'Straight or slightly arched', text_hierarchy: 'Primary dominant, tagline optional', background: 'Flat Black (#000000) or Flat Dark Blue (#0A0A1A)', period_influence: 'Cyberpunk / Esports', effects: 'Subtle typography glow' } },
        { id: 'emblem-olympic', name: 'Olympic Classic', type: PanelMode.EMBLEM_FORGE, description: 'Laurel wreath. Circular seal. Eternal, victorius. Minimal illustration. Timeless.', prompt: 'Generate a classic Olympic-style emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle', border: 'Laurel wreath', illustration: 'Torch, olive branch, victory figure', illustration_style: 'Classical, minimal', typography_layout: 'Curved top/bottom', text_hierarchy: 'Primary + location/date optional', background: 'Flat White (#FFFFFF) or Flat Navy (#1A1A2A)', period_influence: 'Classical / Eternal' } },
      ].map(p => p as EmblemPreset) },
      { id: "lib-emblem-institutional", title: "MILITARY_INSTITUTIONAL", mobileLabel: "INST.", type: PresetCategoryType.BUILT_IN, items: [
        { id: 'emblem-military', name: 'Military', type: PanelMode.EMBLEM_FORGE, description: 'Formal. Eagle, anchor, sword, or crossed rifles. Ribbon banner. Serif caps. Authority.', prompt: 'Generate a military emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Shield / Circle / Star', border: 'Rope, laurel, or geometric', illustration: 'Eagle, anchor, sword, crossed rifles', illustration_style: 'Formal, authoritative', typography_layout: 'Ribbon banner, curved or straight', text_hierarchy: 'Unit + motto', background: 'Flat Navy (#1A1A2A) or Flat Black (#000000)', period_influence: 'Traditional Military' } },
        { id: 'emblem-law-enforcement', name: 'Law Enforcement', type: PanelMode.EMBLEM_FORGE, description: 'Shield star. Eagle, badge, or torch. Thin blue line optional. Authoritative, protective.', prompt: 'Generate a law enforcement emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Star / Shield', border: 'Geometric, rope optional', illustration: 'Eagle, badge, torch, thin blue line', illustration_style: 'Authoritative', typography_layout: 'Curved top/bottom', text_hierarchy: 'Department + motto', background: 'Flat Navy (#1A1A2A) or Flat Blue (#0A1A2A)', period_influence: 'Contemporary Authority' } },
        { id: 'emblem-fire-dept', name: 'Fire Department', type: PanelMode.EMBLEM_FORGE, description: 'Maltese cross. Axe, ladder, hydrant, or dalmatian. Bold, heroic.', prompt: 'Generate a fire department emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Maltese cross', border: 'Rope, geometric', illustration: 'Crossed axes, ladder, hydrant, dalmatian', illustration_style: 'Bold, heroic', typography_layout: 'Curved or straight', text_hierarchy: 'Department + established', background: 'Flat Red (#8B1A1A) or Flat Black (#000000)', period_influence: 'Traditional / Heroic' } },
        { id: 'emblem-university', name: 'University Seal', type: PanelMode.EMBLEM_FORGE, description: 'Traditional circular seal. Book, torch, or lamp motif. Latin optional. Academic, established.', prompt: 'Generate a university seal...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle', border: 'Ornamental, laurel, geometric', illustration: 'Open book, torch, lamp, column', illustration_style: 'Academic, traditional', typography_layout: 'Curved top/bottom', text_hierarchy: 'Institution + motto + established', background: 'Flat Navy (#1A1A2A) or Flat Burgundy (#2A1A1A)', period_influence: 'Academic / Classical' } },
      ].map(p => p as EmblemPreset) },
      { id: "lib-emblem-lodge", title: "LODGE_SOCIETY", mobileLabel: "LODGE", type: PresetCategoryType.BUILT_IN, items: [
        { id: 'emblem-masonic', name: 'Masonic', type: PanelMode.EMBLEM_FORGE, description: 'Square and compass. All-seeing eye. Esoteric geometry. Fraternal authority.', prompt: 'Generate a Masonic fraternal emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle / Geometric', border: 'Rope, geometric', illustration: 'Square and compass, all-seeing eye, pillar', illustration_style: 'Esoteric, geometric', typography_layout: 'Curved top/bottom', text_hierarchy: 'Lodge name + established', background: 'Flat Navy (#1A1A2A) or Flat Black (#000000)', period_influence: 'Fraternal / Esoteric' } },
        { id: 'emblem-knights-columbus', name: 'Knights of Columbus', type: PanelMode.EMBLEM_FORGE, description: 'Shield, cross, sword. Columbian motif. Catholic fraternal.', prompt: 'Generate a Knights of Columbus style emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Shield', border: 'Ornamental, geometric', illustration: 'Cross, sword, dove, globe', illustration_style: 'Traditional, fraternal', typography_layout: 'Curved top/bottom', text_hierarchy: 'Order + established', background: 'Flat Navy (#1A1A2A) or Flat Burgundy (#2A1A2A)', period_influence: 'Catholic Fraternal' } },
        { id: 'emblem-fraternal-order', name: 'Elks / Moose / Eagles', type: PanelMode.EMBLEM_FORGE, description: 'Fraternal animal head. Antlers, tusks. Banners. Civic pride.', prompt: 'Generate a fraternal order emblem (Elks, Moose, Eagles)...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle / Shield', border: 'Rope, laurel', illustration: 'Elk head, moose head, eagle head', illustration_style: 'Fraternal, proud', typography_layout: 'Curved top, banner bottom', text_hierarchy: 'Order + lodge + established', background: 'Flat Navy (#1A1A2A) or Flat Forest (#1A2A1A)', period_influence: 'Fraternal / Civic' } },
      ].map(p => p as EmblemPreset) },
      { id: "lib-emblem-contemporary", title: "CONTEMPORARY_SEALS", mobileLabel: "SEALS", type: PresetCategoryType.BUILT_IN, items: [
        { id: 'emblem-tech-startup', name: 'Tech Startup', type: PanelMode.EMBLEM_FORGE, description: 'Clean, geometric. Circuit, hexagon, or node motif. Sans-serif. Modern, innovative.', prompt: 'Generate a technology startup emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Hexagon / Circle / Geometric', border: 'Clean, minimal', illustration: 'Circuit, hexagon network, node diagram', illustration_style: 'Clean, geometric', typography_layout: 'Straight or curved', text_hierarchy: 'Brand name + established optional', background: 'Flat White (#FFFFFF) or Flat Black (#000000)', period_influence: 'Contemporary / Tech' } },
        { id: 'emblem-craft-artisanal', name: 'Craft / Artisanal', type: PanelMode.EMBLEM_FORGE, description: 'Organic, hand-drawn feel. Tool, leaf, or vessel motif. Warm, authentic.', prompt: 'Generate a craft or artisanal emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle / Oval / Organic', border: 'Hand-drawn, imperfect', illustration: 'Tool, leaf, vessel, hand', illustration_style: 'Hand-drawn, authentic', typography_layout: 'Curved or straight', text_hierarchy: 'Maker + trade + established', background: 'Flat Warm Cream (#FAF3E0) or Flat Terracotta (#8B5A4A)', period_influence: 'Contemporary Craft' } },
        { id: 'emblem-music-recording', name: 'Music / Recording', type: PanelMode.EMBLEM_FORGE, description: 'Vinyl, cassette, waveform, or instrument motif. Retro or modern. Energetic.', prompt: 'Generate a music or recording emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle / Square / Geometric', border: 'Minimal, groove, or wave', illustration: 'Vinyl, cassette, waveform, instrument', illustration_style: 'Retro or modern', typography_layout: 'Curved or straight', text_hierarchy: 'Label + established', background: 'Flat Black (#000000) or Flat White (#FFFFFF)', period_influence: 'Music / Audio' } },
        { id: 'emblem-cannabis', name: 'Cannabis / Apothecary', type: PanelMode.EMBLEM_FORGE, description: 'Leaf, jar, or botanical motif. Vintage pharmaceutical or contemporary organic.', prompt: 'Generate a cannabis or apothecary emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle / Diamond / Hexagon', border: 'Botanical, geometric', illustration: 'Leaf, jar, mortar and pestle, botanical', illustration_style: 'Vintage or contemporary organic', typography_layout: 'Curved or straight', text_hierarchy: 'Brand + established', background: 'Flat Forest (#1A3A1A) or Flat Earth (#4A3A2A)', period_influence: 'Apothecary / Contemporary' } },
        { id: 'emblem-restaurant', name: 'Restaurant / Culinary', type: PanelMode.EMBLEM_FORGE, description: 'Chef\'s hat, knife/fork, pan, or ingredient motif. Warm, inviting.', prompt: 'Generate a restaurant or culinary emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle / Oval / Shield', border: 'Minimal, botanical, geometric', illustration: 'Chef\'s hat, knife/fork, pan, ingredient', illustration_style: 'Warm, appetizing', typography_layout: 'Curved or straight', text_hierarchy: 'Restaurant + established + cuisine', background: 'Flat Warm Cream (#FAF0E0) or Flat Terracotta (#8B4A3A)', period_influence: 'Culinary / Traditional' } },
        { id: 'emblem-wedding', name: 'Wedding / Event', type: PanelMode.EMBLEM_FORGE, description: 'Elegant, romantic. Rings, hearts, florals, or knot motif. Script typography.', prompt: 'Generate a wedding or event emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle / Heart / Lozenge', border: 'Floral, elegant', illustration: 'Rings, hearts, florals, knot', illustration_style: 'Elegant, romantic', typography_layout: 'Curved or flowing', text_hierarchy: 'Couple + date', background: 'Flat White (#FFFFFF) or Flat Blush (#FAF0F0)', period_influence: 'Romantic / Contemporary' } },
        { id: 'emblem-law', name: 'Law / Legal', type: PanelMode.EMBLEM_FORGE, description: 'Scales, column, gavel. Authoritative, traditional. Serif typography.', prompt: 'Generate a law or legal emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Circle / Shield / Octagon', border: 'Geometric, laurel', illustration: 'Scales, column, gavel, torch', illustration_style: 'Authoritative, traditional', typography_layout: 'Curved top/bottom', text_hierarchy: 'Firm + established + practice', background: 'Flat Navy (#1A1A2A) or Flat Burgundy (#2A1A1A)', period_influence: 'Legal / Traditional' } },
      ].map(p => p as EmblemPreset) },
      { id: "lib-emblem-art-nouveau-deco", title: "ART_NOUVEAU_DECO", mobileLabel: "ART", type: PresetCategoryType.BUILT_IN, items: [
        { id: 'emblem-art-nouveau', name: 'Art Nouveau', type: PanelMode.EMBLEM_FORGE, description: 'Organic, flowing borders. Floral ornamentation. Whiplash curves. Elegant, feminine.', prompt: 'Generate an Art Nouveau emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Organic / Asymmetrical', border: 'Floral, whiplash curves', illustration: 'Orchid, peacock, or feminine figure', illustration_style: 'Elegant, organic', typography_layout: 'Flowing, curved', text_hierarchy: 'Integrated within ornament', background: 'Flat Soft Green (#E8F0E0) or Flat Deep Teal (#1A3A3A)', period_influence: 'Art Nouveau / 1900' } },
        { id: 'emblem-art-deco', name: 'Art Deco', type: PanelMode.EMBLEM_FORGE, description: 'Geometric, stepped, sunburst. Zigzag, fan motifs. Glamorous, vertical.', prompt: 'Generate an Art Deco emblem...', metadata: { /*preferredEngine: ImageEngine.GEMINI*/ }, parameters: { containment: 'Geometric / Stepped', border: 'Zigzag, sunburst, geometric', illustration: 'Skyscraper, sunburst, stylized figure', illustration_style: 'Glamorous, geometric', typography_layout: 'Vertical or geometric', text_hierarchy: 'Integrated geometry', background: 'Flat Black (#000000) or Flat Gold (#D4AF37)', period_influence: 'Art Deco / 1920s' } },
      ].map(p => p as EmblemPreset) },
    ]
  },
  EXTRACTOR: {
    libraries: [
      {
        id: "lib-extractor-core",
        title: "FORENSIC_TOOLS",
        mobileLabel: "TOOLS",
        type: PresetCategoryType.BUILT_IN,
        items: []
      }
    ]
  },
  FILTERS: {
    libraries: [
      {
        id: "lib-filters-spectral",
        title: "SPECTRAL_SHIFT",
        mobileLabel: "SPECTRAL",
        type: PresetCategoryType.BUILT_IN,
        items: [
          { id: 'filter-vintage', name: 'Vintage', type: PanelMode.FILTERS, category: 'Spectral', description: 'Warm sepia tones.', prompt: '', parameters: { intensity: 80, brightness: 90, contrast: 85, saturation: 60, hue: 0, filterType: 'Vintage' } },
          { id: 'filter-cinematic', name: 'Cinematic', type: PanelMode.FILTERS, category: 'Spectral', description: 'High contrast, teal/orange push.', prompt: '', parameters: { intensity: 100, brightness: 105, contrast: 120, saturation: 110, hue: 0, filterType: 'Cinematic' } },
          { id: 'filter-cyberpunk', name: 'Cyberpunk', type: PanelMode.FILTERS, category: 'Spectral', description: 'Neon hue shift.', prompt: '', parameters: { intensity: 100, brightness: 110, contrast: 115, saturation: 140, hue: 180, filterType: 'Cyberpunk' } },
          { id: 'filter-monochrome', name: 'Monochrome', type: PanelMode.FILTERS, category: 'Spectral', description: 'Classic black and white.', prompt: '', parameters: { intensity: 100, brightness: 100, contrast: 110, saturation: 0, hue: 0, filterType: 'Monochrome' } },
        ].map(p => p as FilterPreset)
      }
    ]
  }
};

export const getMobileCategories = (mode: PanelMode, savedPresets: any[] = []): PresetCategory[] => {
  const registryKey = mode.toUpperCase();
  const builtInLibs = PRESET_REGISTRY[registryKey]?.libraries || [];
  
  // Filter saved presets for the current mode
  const userItems = savedPresets.filter(p => p.type === mode);
  
  // If user has saved items, create a User Library
  const userLib: PresetCategory | null = userItems.length > 0 ? {
    id: `lib-user-${mode}`,
    title: `USER_VAULT`,
    mobileLabel: "VAULT",
    type: PresetCategoryType.USER,
    items: userItems,
    isCollapsible: true
  } : null;

  return userLib ? [userLib, ...builtInLibs] : builtInLibs;
};
