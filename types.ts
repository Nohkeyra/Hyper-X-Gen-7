
// ===================== ENUMS =====================
export enum PanelMode {
  START = 'start',
  VECTOR = 'vector',
  TYPOGRAPHY = 'typography',
  MONOGRAM = 'monogram',
  EXTRACTOR = 'extractor',
  FILTERS = 'filters',
  AUDIT = 'audit'
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
  UNKNOWN = 'UNKNOWN'
}

// ===================== CORE INTERFACES =====================
export interface KernelConfig {
  thinkingBudget: number;
  temperature: number;
  model: string;
  deviceContext: string;
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

export interface VectorPreset extends BasePreset {
  type: PanelMode.VECTOR;
  parameters: {
    complexity: 'Standard' | 'Minimal' | 'Detailed';
    outline: 'None' | 'Medium-Bold' | 'Thin';
    // Fix: Expanded the mood union type to include 'Dramatic' and 'Serene' used in presets and UI selectors.
    mood: 'Cheerful' | 'Professional' | 'Communicative' | 'Dramatic' | 'Serene';
    background: string;
    colorCount: number;
    strokeWeight: number;
    style: VectorStyle;
  };
}

export type VectorStyle = 
  | 'Flat Design' 
  | 'Line Art' 
  | 'Geometric' 
  | 'Organic' 
  | 'Corporate' 
  | 'Playful' 
  | 'Abstract';

export interface TypographyPreset extends BasePreset {
  type: PanelMode.TYPOGRAPHY;
  parameters: {
    fontStyle: TypographyStyle;
    weight: 'Light' | 'Regular' | 'Bold' | 'Heavy';
    spacing: 'Tight' | 'Normal' | 'Wide';
    effect?: 'Shadow' | 'Glow' | 'Outline' | 'None';
  };
  styleUsed?: string;
}

export type TypographyStyle = 
  | 'Grunge' 
  | 'Neon' 
  | 'Cyberpunk' 
  | 'Art Deco' 
  | 'Retro' 
  | 'Vintage' 
  | 'Watercolor' 
  | 'Handwritten' 
  | 'Geometric' 
  | 'Minimalist' 
  | 'Modern' 
  | 'Organic'
  | '3D';

export interface MonogramPreset extends BasePreset {
  type: PanelMode.MONOGRAM;
  parameters: {
    layoutMode: 'interlocked' | 'stacked' | 'block' | 'mirrored';
    symmetry: 'Perfect Radial' | 'Vertical Mirror' | 'Asymmetrical' | 'Dynamic';
    container: 'Strict' | 'Suggested' | 'Weak' | 'None';
    densityRatio: string;
    legibility: 'High' | 'Medium' | 'Low';
    structureCreativity: number;
    densitySpace: number;
    traditionalModern: number;
    strokeEnds: 'Sheared' | 'Rounded' | 'Blunt' | 'Tapered';
    style?: MonogramStyle;
  };
}

export type MonogramStyle = 
  | 'Modern Minimal'
  | 'Classic Heraldic'
  | 'Interlocked'
  | 'Geometric'
  | 'Calligraphic'
  | 'Brutalist'
  | 'Futuristic';

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
  | 'Soft Glow';

export type Preset = VectorPreset | TypographyPreset | MonogramPreset | FilterPreset;

export const isVectorPreset = (preset: Preset): preset is VectorPreset => preset.type === PanelMode.VECTOR;
export const isTypographyPreset = (preset: Preset): preset is TypographyPreset => preset.type === PanelMode.TYPOGRAPHY;
export const isMonogramPreset = (preset: Preset): preset is MonogramPreset => preset.type === PanelMode.MONOGRAM;
export const isFilterPreset = (preset: Preset): preset is FilterPreset => preset.type === PanelMode.FILTERS;

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
