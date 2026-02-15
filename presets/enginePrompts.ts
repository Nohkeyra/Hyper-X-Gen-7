

import { PanelMode } from '../types.ts';

export const SYSTEM_DIRECTIVES: Record<PanelMode, string> = {
  [PanelMode.START]: "HYPERXGEN OMEGA START PROTOCOL.",
  [PanelMode.VECTOR]: "DIRECTIVE: REFINED_VECTOR_ILLUSTRATION_V7. Flat illustration lock. 4-8 bold saturated colors. No gradients. Simplified forms. Crisp edges.",
  [PanelMode.TYPOGRAPHY]: "DIRECTIVE: TYPOGRAPHY_ART_SYNTAX_V3. The text is the artwork. Absolute style fidelity. Solid background. Readability mandate.",
  [PanelMode.MONOGRAM]: "DIRECTIVE: REFINED_MONOGRAM_V8. Create a single identity symbol from 1-3 initials. Fuse letters via interlocking, stacking, or layering. No side-by-side placement. Strict adherence to layout and style constraints.",
  [PanelMode.EXTRACTOR]: "DIRECTIVE: STYLE_DNA_ANALYSIS_V1. Subject-agnostic deconstruction. Forensic style decoding.",
  [PanelMode.FILTERS]: "DIRECTIVE: SPECTRAL_TRANSFORMATION_V3. Intensity-based pixel manipulation.",
  [PanelMode.EMBLEM_FORGE]: "DIRECTIVE: EMBLEM_FORGE_V1. Compositional unity. Shield containment. Multi-line typography hierarchy."
};

export const getSystemPrompt = (mode: PanelMode) => SYSTEM_DIRECTIVES[mode] || SYSTEM_DIRECTIVES[PanelMode.START];
