/**
 * HYPERXGEN_COMPONENT_BARREL v7.1
 * Unified entry point for all architectural UI modules.
 */

// Core Panels (Main Synthesis Modules)
export { VectorPanel } from './VectorPanel.tsx';
export { TypographyPanel } from './TypographyPanel.tsx';
export { MonogramPanel } from './MonogramPanel.tsx';
export { StyleExtractorPanel } from './StyleExtractorPanel.tsx';
export { ImageFilterPanel } from './ImageFilterPanel.tsx';
export { SystemAuditPanel } from './SystemAuditPanel.tsx';

// Screen-Level Components
export { BootScreen } from './BootScreen.tsx';
export { StartScreen } from './StartScreen.tsx';

// Diagnostic & Repair Modules
export { RealRefineDiagnostic } from './RealRefineDiagnostic.tsx';
export { RealRepairDiagnostic } from './RealRepairDiagnostic.tsx';

// Global UI Layout & Controls
export { PanelHeader } from './PanelHeader.tsx';
export { AppControlsBar } from './AppControlsBar.tsx';
export { LogViewer } from './LogViewer.tsx';
export { LoadingSpinner } from './Loading.tsx';

// Shared UI Elements
export { CanvasStage } from './CanvasStage.tsx';
export { GenerationBar } from './GenerationBar.tsx';
export { PresetCard } from './PresetCard.tsx';
export { PresetCarousel } from './PresetCarousel.tsx';
export { ThemeToggle, CanvasFloatingControls } from './PanelShared.tsx';

// Layout & HUD Utilities
export { SidebarHeader, PanelLayout, PageLayout } from './Layouts.tsx';
export { DevourerHUD, ReconHUD, FilterHUD } from './HUD.tsx';

// Vectors & Icons
export * from './Icons.tsx';
