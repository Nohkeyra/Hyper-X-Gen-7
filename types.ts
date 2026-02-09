
export enum PanelMode {
  START = 'start',
  VECTOR = 'vector',
  TYPOGRAPHY = 'typography',
  MONOGRAM = 'monogram',
  EXTRACTOR = 'extractor',
  FILTERS = 'filters',
  AUDIT = 'audit'
}

export interface KernelConfig {
  thinkingBudget: number;
  temperature: number;
  model: string;
  deviceContext: string;
}

export interface PresetItem {
  id: string;
  name: string;
  category: string;
  description: string;
  type?: string;
  parameters?: Record<string, any>;
  timestamp?: string;
  filter?: string; 
  dna?: ExtractionResult;
  imageUrl?: string;
  prompt?: string;
}

export type TypographyPreset = {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  parameters: {
    weight: 'light' | 'regular' | 'bold' | 'ultra';
    terminals: 'clipped' | 'flare' | 'rounded' | 'spike';
    capHeight: number;
    strokeContrast: number;
    splicingIntensity: number;
    interlockGutter: number;
    xHeightBias: number;
    ligatureThreshold: 'manual' | 'auto' | 'aggressive';
  };
};

export type VectorPreset = {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  parameters: {
    complexity?: 'Standard' | 'Minimal' | 'Detailed';
    outline?: 'None' | 'Medium-Bold';
    mood?: string;
    background?: string;
  };
};

export type MonogramPreset = {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  parameters: {
    layoutMode?: 'interlocked' | 'stacked' | 'block' | 'mirrored';
    symmetry?: 'Perfect Radial' | 'Vertical Mirror' | 'Asymmetrical' | 'Dynamic';
    container?: 'Strict' | 'Suggested' | 'Weak' | 'None';
    densityRatio?: string;
    legibility?: 'High' | 'Medium-High' | 'Artistic';
    structureCreativity?: number; // 0-100
    densitySpace?: number; // 0-100
    traditionalModern?: number; // 0-100
    strokeEnds?: 'Sheared' | 'Rounded' | 'Blunt' | 'Tapered';
    interlockStyle?: 'Tight' | 'Elegant' | 'Loose';
  };
};

export interface PresetCategory {
  title: string;
  items: PresetItem[];
}

export type PanelCategory = PresetCategory;

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
}

export interface ExtractionResult {
  domain: string; // e.g., 'Flat_Illustration', 'Line_Art'
  category: string; // e.g., 'Modern_Cheerful'
  name: string; // Style name
  styleAuthenticityScore: number; // 0-100
  palette: string[]; // hex codes
  mood: string[]; // mood adjectives
  formLanguage: string; // description of forms
  styleAdjectives: string[]; // style descriptors
  technique: string; // technique description
  promptTemplate: string; // generated prompt template
  preview_png?: string;
  description: string;
  confidence?: number; // kept for compatibility
}

export interface AppState {
  currentMode: PanelMode;
  selectedPresetId: string | null;
  isProcessing: boolean;
  subjectFocus: boolean;
  parameters: Record<string, number>;
  history: any[];
}

export interface PanelPersona {
  role: string;
  specialty: string;
  motto: string;
  tagline: string;
  icon: string;
  personality: {
    traits: string[];
    communication: {
      toAI: string;
      toTypography?: string;
      toVector?: string;
      toColor?: string;
      toExport?: string;
    };
    quirks: string[];
  };
  performance: {
    anchorEfficiency?: string;
    symmetryBalance?: string;
    optimizationRate?: string;
    status: string;
    glyphMorphing?: string;
    textFlow?: string;
    styleInfusion?: string;
    readabilityScore?: string;
    brandAlignment?: string;
    styleConsistency?: string;
    renderingQuality?: string;
    systemHarmony?: string;
    legibility?: string;
    aestheticCohesionIndex?: string;
    emotionalResonance?: string;
  };
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
  type: 'CSS' | 'Accessibility' | 'Performance' | 'TypeScript' | 'React';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  description: string;
  file: string;
  line?: number;
  codeSnippet: string;
  fix: string;
  fixed: boolean;
  canAutoFix: boolean;
  timestamp: number;
  impact: 'VISUAL' | 'PERFORMANCE' | 'ACCESSIBILITY' | 'MAINTAINABILITY';
}
