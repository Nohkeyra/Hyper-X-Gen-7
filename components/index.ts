
/**
 * HYPERXGEN_COMPONENT_BARREL v7.2
 * Unified entry point for all architectural UI modules.
 */

// Core Panels
export { VectorPanel }         from './VectorPanel.tsx';
export { TypographyPanel }     from './TypographyPanel.tsx';
export { MonogramPanel }       from './MonogramPanel.tsx';
export { StyleExtractorPanel } from './StyleExtractorPanel.tsx';
export { ImageFilterPanel }    from './ImageFilterPanel.tsx';
export { EmblemForgePanel }    from './EmblemForgePanel.tsx';
// AnalyzerPanel removed
export { SettingsPanel }       from './SettingsPanel.tsx';

// Screen-Level
export { BootScreen }   from './BootScreen.tsx';
export { StartScreen }  from './StartScreen.tsx';

// Global UI
export { PanelHeader }    from './PanelHeader.tsx';
export { AppControlsBar } from './AppControlsBar.tsx';
export { LogViewer }      from './LogViewer.tsx';

// Shared UI
export { CanvasStage }      from './CanvasStage.tsx';
export { GenerationBar }    from './GenerationBar.tsx';
export { PresetCard }       from './PresetCard.tsx';
export { PresetCarousel }   from './PresetCarousel.tsx';
export { ThemeToggle, CanvasFloatingControls } from './PanelShared.tsx';

// Layout & HUD
export { SidebarHeader, PanelLayout, PageLayout } from './Layouts.tsx';
export { DevourerHUD, ReconHUD, FilterHUD }       from './HUD.tsx';

// Icons
export * from './Icons.tsx';
