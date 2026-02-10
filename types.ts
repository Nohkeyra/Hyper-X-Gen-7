
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

export enum IssueSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO'
}

export enum ImpactType {
  VISUAL = 'VISUAL',
  PERFORMANCE = 'PERFORMANCE',
  ACCESSIBILITY = 'ACCESSIBILITY',
  MAINTAINABILITY = 'MAINTAINABILITY'
}

export enum IssueType {
  CSS = 'CSS',
  ACCESSIBILITY = 'Accessibility',
  PERFORMANCE = 'Performance',
  TYPESCRIPT = 'TypeScript',
  REACT = 'React'
}

export enum LatticeStatus {
  IDLE = 'IDLE',
  SYNCED = 'SYNCED',
  DRIFT = 'DRIFT',
  LOCKED = 'LOCKED'
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

// ===================== LATTICE LINK (Update 4) =====================
export interface LatticeBuffer {
  imageUrl?: string;
  dna?: ExtractionResult;
  prompt?: string;
  timestamp: number;
  sourceMode: PanelMode;
}

// ===================== PANEL STATE =====================
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

// Preset base interface
export interface BasePreset {
  id: string;
  name: string;
  type: PanelMode;
  category: string;
  description: string;
  prompt: string;
  styleDirective?: string; // High-fidelity engine instructions
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

// Vector Preset with specific parameters
export interface VectorPreset extends BasePreset {
  type: PanelMode.VECTOR;
  parameters: {
    complexity: 'Standard' | 'Minimal' | 'Detailed';
    outline: 'None' | 'Medium-Bold' | 'Thin';
    mood: 'Cheerful' | 'Professional' | 'Communicative';
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

// Typography Preset
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
  | '3D';

// Monogram Preset
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
  };
}

// Filter Preset
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

// Type guard functions
export const isVectorPreset = (preset: Preset): preset is VectorPreset => preset.type === PanelMode.VECTOR;
export const isTypographyPreset = (preset: Preset): preset is TypographyPreset => preset.type === PanelMode.TYPOGRAPHY;
export const isMonogramPreset = (preset: Preset): preset is MonogramPreset => preset.type === PanelMode.MONOGRAM;
export const isFilterPreset = (preset: Preset): preset is FilterPreset => preset.type === PanelMode.FILTERS;

// Logic Types
export type PresetItem = Preset;

export interface PresetCategory {
  id: string;
  title: string;
  mobileLabel?: string; // Standardized mobile title
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
}

export interface RepairSummary {
  totalNodes: number;
  repairedNodes: number;
  failedNodes: number;
  averageRepairTime: number;
  totalTime: number;
  criticalFailures: number;
  systemStabilityScore: number;
}

export interface CloudRepairSummary extends RepairSummary {
  id: string;
  timestamp: string;
  type: 'RepairReport';
  integrityAfterRepair: number;
}

export interface RefineSummary {
  totalIssues: number;
  resolvedIssues: number;
  performanceGain: number;
  visualScore: number;
  totalTime: number;
  mode: string;
  uxScore: number;
  aestheticCohesionIndex: number;
}

export interface CloudRefineSummary extends RefineSummary {
  id: string;
  timestamp: string;
  type: 'RefineReport';
  uiRefinementLevelAfterRefine: number;
}

export type CloudArchiveEntry = CloudRepairSummary | CloudRefineSummary;

export interface RealIssue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  title: string;
  description: string;
  file: string;
  line?: number;
  codeSnippet: string;
  fix: string;
  fixed: boolean;
  canAutoFix: boolean;
  timestamp: number;
  impact: ImpactType;
}
