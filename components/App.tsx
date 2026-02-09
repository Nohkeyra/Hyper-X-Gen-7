
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { PanelMode, KernelConfig, CloudArchiveEntry, LogEntry, ExtractionResult } from '../types.ts';
import { BootScreen } from './BootScreen.tsx';
import { RealRefineDiagnostic } from './RealRefineDiagnostic.tsx';
import { RealRepairDiagnostic } from './RealRepairDiagnostic.tsx';
import { useDeviceDetection } from './DeviceDetector.tsx';
import { StartScreen } from './StartScreen.tsx';
import { PanelHeader } from './PanelHeader.tsx';
import { AppControlsBar } from './AppControlsBar.tsx';
import { LogViewer } from './LogViewer.tsx';
import { LoadingSpinner } from './Loading.tsx';
import { LS_KEYS } from '../constants.ts';

// Lazy-load panel components
const VectorPanel = lazy(() => import('./VectorPanel.tsx').then(m => ({ default: m.VectorPanel })));
const TypographyPanel = lazy(() => import('./TypographyPanel.tsx').then(m => ({ default: m.TypographyPanel })));
const MonogramPanel = lazy(() => import('./MonogramPanel.tsx').then(m => ({ default: m.MonogramPanel })));
const StyleExtractorPanel = lazy(() => import('./StyleExtractorPanel.tsx').then(m => ({ default: m.StyleExtractorPanel })));
const ImageFilterPanel = lazy(() => import('./ImageFilterPanel.tsx').then(m => ({ default: m.ImageFilterPanel })));
const SystemAuditPanel = lazy(() => import('./SystemAuditPanel.tsx').then(m => ({ default: m.SystemAuditPanel })));

interface AppConfig {
  panels: {
    enabled: string[];
    disabled: string[];
    panelOrder: string[];
  };
}

export const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [apiKeyReady, setApiKeyReady] = useState(true); // Always ready for free mode
  const [currentPanel, setCurrentPanel] = useState<PanelMode>(PanelMode.START);
  const [transferData, setTransferData] = useState<any>(null);
  const [isRepairing, setIsRepairing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [systemIntegrity, setSystemIntegrity] = useState(100);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [enabledModes, setEnabledModes] = useState<PanelMode[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogViewer, setShowLogViewer] = useState(false);
  const [currentPanelState, setCurrentPanelState] = useState<any>(null);

  const deviceInfo = useDeviceDetection();
  const [uiRefinementLevel, setUiRefinementLevel] = useState(0);

  const [kernelConfig, setKernelConfig] = useState<KernelConfig>({
    thinkingBudget: 0,
    temperature: 0.1,
    model: 'gemini-3-flash-preview',
    deviceContext: 'MAXIMUM_ARCHITECTURE_OMEGA_V5'
  });

  const [recentWorks, setRecentWorks] = useState<any[]>([]);
  const [savedPresets, setSavedPresets] = useState<any[]>([]);
  const [cloudArchives, setCloudArchives] = useState<CloudArchiveEntry[]>([]);
  const [globalDna, setGlobalDna] = useState<ExtractionResult | null>(null);

  const addLog = useCallback((message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    setLogs(prev => {
      const newLogEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      };
      return [newLogEntry, ...prev].slice(0, 50);
    });
  }, []);

  const handleApiKeyError = useCallback(() => {
    addLog("API_KEY_INVALID: Detected. (Free mode enabled, this should not occur).", 'error');
  }, [addLog]);

  // FIX: Move safeParse outside useEffect and wrap in useCallback
  const safeParse = useCallback((key: string, fallback: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      localStorage.removeItem(key);
      return fallback;
    }
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem(LS_KEYS.THEME);
    if (storedTheme) setIsDarkMode(storedTheme === 'dark');
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDarkMode(true);

    const storedConfig = localStorage.getItem(LS_KEYS.CONFIG);
    if (storedConfig) {
      try { setKernelConfig(prev => ({ ...prev, ...JSON.parse(storedConfig) })); }
      catch { localStorage.removeItem(LS_KEYS.CONFIG); }
    }

    const storedLogs = localStorage.getItem(LS_KEYS.LOGS);
    if (storedLogs) {
      try { setLogs(JSON.parse(storedLogs)); } 
      catch { localStorage.removeItem(LS_KEYS.LOGS); }
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem(LS_KEYS.THEME, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);

  useEffect(() => {
    if (!isBooting && !hasInitialized) {
      const boot = async () => {
        try {
          addLog("INITIATING: OMEGA_KERNEL_BOOT", 'info');
          const response = await fetch('/config.json');
          const appConfig: AppConfig = await response.json();
          
          const configuredModes: PanelMode[] = appConfig.panels.enabled.map(panelName => {
            switch (panelName) {
              case 'VectorPanel': return PanelMode.VECTOR;
              case 'TypographyPanel': return PanelMode.TYPOGRAPHY;
              case 'MonogramPanel': return PanelMode.MONOGRAM;
              case 'StyleExtractorPanel': return PanelMode.EXTRACTOR;
              case 'ImageFilterPanel': return PanelMode.FILTERS;
              case 'SystemAuditPanel': return PanelMode.AUDIT;
              default: return PanelMode.START;
            }
          }).filter(mode => mode !== PanelMode.START);
          setEnabledModes(configuredModes);

          // FIX: Use memoized safeParse
          setSavedPresets(safeParse(LS_KEYS.PRESETS, []));
          setRecentWorks(safeParse(LS_KEYS.RECENT, []));
          setCloudArchives(safeParse(LS_KEYS.ARCHIVES, []));
          
          setHasInitialized(true);
          addLog("ARCHITECTURE: PARITY_CHECK_OK", 'success');
        } catch (e) {
          setHasInitialized(true);
          addLog(`CRITICAL_KERNEL_PANIC: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      };
      boot();
    }
  }, [addLog, isBooting, hasInitialized, safeParse]); // Added safeParse to dependencies

  useEffect(() => {
    if (hasInitialized) {
      try {
        localStorage.setItem(LS_KEYS.PRESETS, JSON.stringify(savedPresets));
        localStorage.setItem(LS_KEYS.RECENT, JSON.stringify(recentWorks.slice(0, 15)));
        localStorage.setItem(LS_KEYS.ARCHIVES, JSON.stringify(cloudArchives));
        localStorage.setItem(LS_KEYS.CONFIG, JSON.stringify(kernelConfig));
        localStorage.setItem(LS_KEYS.LOGS, JSON.stringify(logs));
      } catch (e) {
        console.error("Failed to write to localStorage:", e);
        addLog("STORAGE_ERROR: Could not persist session. Storage may be full.", 'error');
      }
    }
  }, [savedPresets, recentWorks, cloudArchives, kernelConfig, logs, hasInitialized, addLog]);

  const handleCommitToVault = useCallback(() => {
    if (!currentPanelState) { addLog("COMMIT_FAIL: NO_ACTIVE_LATTICE_TO_BUFFER", 'error'); return; }
    
    const name = currentPanelState.prompt ? `Commit: ${currentPanelState.prompt.substring(0, 15)}` : currentPanelState.name || `Commit: ${currentPanelState.type}`;
    const { generatedOutput, ...restOfState } = currentPanelState;
    const newPreset = { id: `preset-${Date.now()}`, name, type: currentPanelState.type, description: `Committed on ${new Date().toLocaleDateString()}`, ...restOfState, imageUrl: currentPanelState.uploadedImage, timestamp: new Date().toLocaleTimeString() };
    
    if (savedPresets.some(p => p.name === newPreset.name && p.type === newPreset.type && p.prompt === newPreset.prompt)) {
      addLog("COMMIT_INFO: IDENTICAL_PRESET_IN_VAULT", 'info');
      return;
    }
    
    setSavedPresets(prev => [newPreset, ...prev]);
    addLog("COMMIT_SUCCESS: PRESET_BUFFERED_TO_VAULT", 'success');
  }, [currentPanelState, addLog, savedPresets]);

  const handleModeSwitch = useCallback((mode: PanelMode, data?: any) => {
    setCurrentPanel(mode);
    setTransferData(data || null);
    addLog(`OMEGA_PIVOT: ${mode.toUpperCase()}_ENGAGED`, 'info');
  }, [addLog]);

  const handleClearRecentWorks = useCallback(() => { setRecentWorks([]); addLog("BUFFER_PURGED: SESSION_HISTORY_CLEARED", 'warning'); }, [addLog]);
  const handleClearSavedPresets = useCallback(() => { setSavedPresets([]); addLog("VAULT_PURGED: ALL_PRESETS_REMOVED", 'warning'); }, [addLog]);
  const handleLoadItem = useCallback((item: any) => { if (item.type && item.type !== PanelMode.START) handleModeSwitch(item.type, item); addLog("ITEM_LOADED", 'info'); }, [handleModeSwitch, addLog]);
  const handleBootComplete = useCallback(() => { setIsBooting(false); }, []);

  if (isBooting) return <BootScreen onBootComplete={handleBootComplete} isDarkMode={isDarkMode} />;

  if (isRepairing) return <RealRepairDiagnostic onComplete={(summary) => { addLog(`REPAIR_SUMMARY: ${summary.repairedNodes}/${summary.totalNodes} nodes restored.`, 'success'); setSystemIntegrity(summary.systemStabilityScore); setIsRepairing(false); }} />;
  if (isRefining) return <RealRefineDiagnostic onComplete={(summary) => { addLog(`REFINE_SUMMARY: ${summary.resolvedIssues}/${summary.totalIssues} issues resolved.`, 'success'); setUiRefinementLevel(prev => prev + summary.resolvedIssues); setIsRefining(false); }} />;

  const commonProps = {
    kernelConfig,
    integrity: systemIntegrity,
    uiRefined: uiRefinementLevel > 0,
    refinementLevel: uiRefinementLevel,
    onSaveToHistory: (work: any) => setRecentWorks(prev => [work, ...prev]),
    onModeSwitch: handleModeSwitch,
    savedPresets,
    onStateUpdate: setCurrentPanelState,
    addLog,
    onSetGlobalDna: setGlobalDna,
    globalDna: globalDna,
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PanelHeader 
        onBack={() => setCurrentPanel(PanelMode.START)} 
        title={currentPanel.replace('_', ' ')}
        onStartRepair={() => setIsRepairing(true)}
        onStartRefine={() => setIsRefining(true)}
        integrity={systemIntegrity}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onToggleLogViewer={() => setShowLogViewer(p => !p)}
      />
      <main className="flex-1 overflow-hidden" style={{ paddingTop: 'var(--header-h)', paddingBottom: 'var(--app-controls-bar-h)' }}>
        <Suspense fallback={<LoadingSpinner />}>
          {currentPanel === PanelMode.START && <StartScreen onSelectMode={handleModeSwitch} recentCount={recentWorks.length} enabledModes={enabledModes} />}
          {currentPanel === PanelMode.VECTOR && <VectorPanel {...commonProps} initialData={transferData} />}
          {currentPanel === PanelMode.TYPOGRAPHY && <TypographyPanel {...commonProps} initialData={transferData} />}
          {currentPanel === PanelMode.MONOGRAM && <MonogramPanel {...commonProps} initialData={transferData} />}
          {currentPanel === PanelMode.EXTRACTOR && <StyleExtractorPanel kernelConfig={kernelConfig} savedPresets={savedPresets} onSaveToPresets={(p) => setSavedPresets(prev => [p, ...prev])} onDeletePreset={(id) => setSavedPresets(prev => prev.filter(p => p.id !== id))} addLog={addLog} onApiKeyError={handleApiKeyError} onModeSwitch={handleModeSwitch} />}
          {currentPanel === PanelMode.FILTERS && <ImageFilterPanel onSaveToHistory={(w) => setRecentWorks(p => [w, ...p])} kernelConfig={kernelConfig} onModeSwitch={handleModeSwitch} onStateUpdate={setCurrentPanelState} />}
          {currentPanel === PanelMode.AUDIT && <SystemAuditPanel />}
        </Suspense>
      </main>
      <AppControlsBar 
        activeMode={currentPanel} 
        onSwitchMode={handleModeSwitch} 
        recentWorks={recentWorks} 
        savedPresets={savedPresets}
        onLoadHistoryItem={handleLoadItem}
        onClearRecentWorks={handleClearRecentWorks}
        onClearSavedPresets={handleClearSavedPresets}
        onForceSave={handleCommitToVault}
        enabledModes={enabledModes}
      />
      <LogViewer logs={logs}