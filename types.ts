// ===================== ENUMS =====================
export enum PanelMode {
  START = 'start',
  VECTOR = 'vector',
  TYPOGRAPHY = 'typography',
  MONOGRAM = 'monogram',
  EXTRACTOR = 'extractor',
  FILTERS = 'filters',
  EMBLEM_FORGE = 'emblem_forge'
}

export enum LogType {
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning'
}

export enum LatticeStatus {
  IDLE = 'IDLE',
  SYNCED = 'SYNCED',
  DRIFT = 'DRIFT',
  LOCKED = 'LOCKED'
}

export enum StyleCategory {
  MONOGRAM = 'MONOGRAM',
  TYPOGRAPHY = 'TYPOGRAPHY', 
  VECTOR = 'VECTOR',
  FILTER = 'FILTER',
  GRAFFITI = 'GRAFFITI',
  EMBLEM = 'EMBLEM',
  UNKNOWN = 'UNKNOWN'
}

export enum ImageEngine {
  GEMINI = 'gemini',
  HF = 'hf'
}

// ===================== CORE INTERFACES =====================
export interface KernelConfig {
  thinkingBudget: number;
  temperature: number;
  model: string;
  deviceContext: string;
  imageEngine: ImageEngine;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: LogType;
}

export interface LatticeBuffer {
  imageUrl?: string;
  dna?: ExtractionResult;
  prompt?: string;
  timestamp: number;
  sourceMode: PanelMode;
}

export interface PanelState {
  type: PanelMode;
  prompt: string;
  name: string;
  uploadedImage: string | null;
  generatedOutput: string | null;
  dna: ExtractionResult | null;
  settings: Record<string, unknown>;
  latticeStatus?: LatticeStatus;
}

// ==================== PRESET TYPES ====================

export enum PresetCategoryType {
  BUILT_IN = 'BUILT_IN',
  USER = 'USER',
  GENERATED = 'GENERATED',
  VAULT = 'VAULT'
}

export interface BasePreset {
  id: string;
  name: string;
  type: PanelMode;
  category: string;
  description: string;
  prompt: string;
  styleDirective?: string; 
  imageUrl?: string;
  thumbnailUrl?: string;
  dna?: ExtractionResult | null;
  timestamp?: string;
  tags?: string[];
  rating?: number;
  usageCount?: number;
  isFavorite?: boolean;
  isProtected?: boolean;
  metadata?: {
    mobileTitle?: string;
    mobileIcon?: string;
    mobilePriority?: number;
    [key: string]: any;
  };
}

export interface VectorDna {
  detail_fidelity: 'Minimal' | 'Moderate' | 'High' | 'Maximum';
  edge_quality: string;
  palette_strategy: string;
  color_direction: string;
  background: string;
  form_language: string;
  stroke_preset: 'Uniform Thin' | 'Uniform Medium' | 'Uniform Heavy' | 'None';
  effect?: string;
  refinement?: string;
  palette_forced?: string;
  notation?: string;
  fills?: string;
  fidelity_priority?: 'Maximum';
  edge_softness?: 'High';
  perspective?: 'Isometric';
  curvature?: 'High';
  tech_influence?: 'High';
  abstraction_level?: 'High';
  ethereal_quality?: 'High';
}

export interface VectorPreset extends BasePreset {
  type: PanelMode.VECTOR;
  parameters: VectorDna;
}

export interface TypographyDna {
  letterform_style: string;
  layout: string;
  spacing: string;
  effects: string;
  background: string;
  color_logic: string;
  texture: string;
  ornamentation: string;
}

export interface TypographyPreset extends BasePreset {
  type: PanelMode.TYPOGRAPHY;
  parameters: TypographyDna;
}

export interface MonogramDna {
  letter_relationship: string;
  symmetry: string;
  container: string;
  legibility_target: string;
  form_language: string;
  stroke_character: string;
  spatial_density: string;
  abstraction_tolerance: string;
  period_influence: string;
}

export interface MonogramPreset extends BasePreset {
  type: PanelMode.MONOGRAM;
  parameters: MonogramDna;
}

export interface FilterPreset extends BasePreset {
  type: PanelMode.FILTERS;
  parameters: {
    intensity: number;
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
    filterType: FilterType;
  };
}

export type FilterType = 
  | 'Vintage' 
  | 'Cinematic' 
  | 'Cyberpunk' 
  | 'Pastel' 
  | 'Monochrome' 
  | 'High Contrast' 
  | 'Soft Glow'
  | 'Custom';

export interface EmblemDna {
  containment: string;
  border: string;
  illustration: string;
  illustration_style: string;
  typography_layout: string;
  text_hierarchy: string;
  background: string;
  period_influence: string;
  effects?: string;
}

export interface EmblemPreset extends BasePreset {
  type: PanelMode.EMBLEM_FORGE;
  parameters: EmblemDna;
}

// Fix: Add ExtractorPreset type to represent presets from the Style Extractor panel.
export interface ExtractorPreset extends BasePreset {
  type: PanelMode.EXTRACTOR;
  parameters: {};
}

// Fix: Add ExtractorPreset to the main Preset union type to resolve type errors.
export type Preset = VectorPreset | TypographyPreset | MonogramPreset | FilterPreset | EmblemPreset | ExtractorPreset;

export const isVectorPreset = (preset: Preset): preset is VectorPreset => preset.type === PanelMode.VECTOR;
export const isTypographyPreset = (preset: Preset): preset is TypographyPreset => preset.type === PanelMode.TYPOGRAPHY;
export const isMonogramPreset = (preset: Preset): preset is MonogramPreset => preset.type === PanelMode.MONOGRAM;
export const isFilterPreset = (preset: Preset): preset is FilterPreset => preset.type === PanelMode.FILTERS;
export const isEmblemPreset = (preset: Preset): preset is EmblemPreset => preset.type === PanelMode.EMBLEM_FORGE;
// Fix: Add a type guard for the new ExtractorPreset.
export const isExtractorPreset = (preset: Preset): preset is ExtractorPreset => preset.type === PanelMode.EXTRACTOR;

export type PresetItem = Preset;

export interface PresetCategory {
  id: string;
  title: string;
  mobileLabel?: string; 
  description?: string;
  type: PresetCategoryType;
  items: Preset[];
  icon?: string;
  color?: string;
  isCollapsible?: boolean;
}

export interface ExtractionResult {
  id?: string;
  domain: string;
  category: string;
  name: string;
  description: string;
  styleAuthenticityScore: number;
  palette: string[];
  mood: string[];
  formLanguage: string;
  styleAdjectives: string[];
  technique: string;
  promptTemplate: string;
  preview_png?: string;
  confidence?: number;
  extractedFrom?: string;
  metadata?: any;
  features?: {
    hasLetters: boolean;
    isGeometric: boolean;
    isAbstract: boolean;
    hasSymmetry: boolean;
    usesNegativeSpace: boolean;
    strokeBased: boolean;
    colorBased: boolean;
    textureBased: boolean;
  };
}

export interface ExtractedStyle {
  id: string;
  name: string;
  description: string;
  category: StyleCategory;
  confidence: number; 
  features: {
    hasLetters: boolean;
    isGeometric: boolean;
    isAbstract: boolean;
    hasSymmetry: boolean;
    usesNegativeSpace: boolean;
    strokeBased: boolean;
    colorBased: boolean;
    textureBased: boolean;
  };
  recommendedPresets: string[]; 
}