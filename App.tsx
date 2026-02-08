
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { PanelMode, KernelConfig, CloudArchiveEntry, LogEntry } from './types.ts';
import { BootScreen } from './components/BootScreen.tsx';
import { RealRefineDiagnostic } from './components/RealRefineDiagnostic.tsx';
import { RealRepairDiagnostic } from './components/RealRepairDiagnostic.tsx';
import { useDeviceDetection } from './components/DeviceDetector.tsx';
import { StartScreen } from './components/StartScreen.tsx';
import { PanelHeader } from './components/PanelHeader.tsx';
import { AppControlsBar } from './components/AppControlsBar.tsx';
import { LogViewer } from './components/LogViewer.tsx';
import { LoadingSpinner } from './components/Loading.tsx';
import { LS_KEYS } from './constants.ts';

// Lazy-load panel components
const VectorPanel = lazy(() => import('./components/VectorPanel.tsx').then(m => ({ default: m.VectorPanel })));
const TypographyPanel = lazy(() => import('./components/TypographyPanel.tsx').then(m => ({ default: m.TypographyPanel })));
const MonogramPanel = lazy(() => import('./components/MonogramPanel.tsx').then(m => ({ default: m.MonogramPanel })));
const StyleExtractorPanel = lazy(() => import('./components/StyleExtractorPanel.tsx').then(m => ({ default: m.StyleExtractorPanel })));
const ImageFilterPanel = lazy(() => import('./components/ImageFilterPanel.tsx').then(m => ({ default: m.ImageFilterPanel })));
const SystemAuditPanel = lazy(() => import('./components/SystemAuditPanel.tsx').then(m => ({ default: m.SystemAuditPanel })));

interface AppConfig {
  panels: {
    enabled: string[];
    disabled: string[];
    panelOrder: string[];
  };
}

export const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
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

          const safeParse = (key: string, fallback: any) => {
            try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : fallback; } 
            catch { localStorage.removeItem(key); return fallback; }
          };

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
  }, [addLog, isBooting, hasInitialized]);

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

  const renderPanel = () => {
    if (!hasInitialized) return null;
    const commonProps = { initialData: transferData, kernelConfig, integrity: systemIntegrity, refinementLevel: uiRefinementLevel, onSaveToHistory: (w: any) => { setRecentWorks(p => [w, ...p]); }, onModeSwitch: handleModeSwitch, savedPresets, addLog };
    
    switch (currentPanel) {
      case PanelMode.START: return <StartScreen recentCount={recentWorks.length} onSelectMode={handleModeSwitch} enabledModes={enabledModes} />;
      case PanelMode.VECTOR: return <VectorPanel {...commonProps} onStateUpdate={setCurrentPanelState} />;
      case PanelMode.TYPOGRAPHY: return <TypographyPanel {...commonProps} onStateUpdate={setCurrentPanelState} />;
      case PanelMode.MONOGRAM: return <MonogramPanel {...commonProps} onStateUpdate={setCurrentPanelState} />;
      case PanelMode.EXTRACTOR: return <StyleExtractorPanel {...commonProps} onSaveToPresets={(p) => { setSavedPresets(prev => [p, ...prev]); addLog(`DNA_VAULT: FRAGMENT_STORED`, 'success'); }} onDeletePreset={(id) => { setSavedPresets(prev => prev.filter(p => p.id !== id)); addLog("VAULT_PURGED: FRAGMENT_REMOVED", 'warning'); }} onSaveFeedback={() => addLog("COMMIT_SUCCESS: BUFFER_LOCKED", 'success')} />;
      case PanelMode.FILTERS: return <ImageFilterPanel {...commonProps} onStateUpdate={setCurrentPanelState} />;
      case PanelMode.AUDIT: return <SystemAuditPanel />;
      default: return null;
    }
  };

  return (
    <div className="app-shell relative">
      <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] bg-grid-pattern"></div>
      {isRepairing && <RealRepairDiagnostic onComplete={(r) => { setIsRepairing(false); setSystemIntegrity(r.systemStabilityScore); addLog(`FORENSIC_SYNC: SUBSYSTEMS_RECONSTRUCTED`, 'success'); }} />}
      {isRefining && <RealRefineDiagnostic onComplete={(r) => { setIsRefining(false); setUiRefinementLevel(r.visualScore); addLog(`REFINE_REPORT: AESTHETIC_${r.visualScore}%`, 'success'); }} />}
      <PanelHeader title="HYPERXGEN" integrity={systemIntegrity} onBack={() => handleModeSwitch(PanelMode.START)} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onStartRepair={() => { setIsRepairing(true); addLog("DIAGNOSTIC: FORENSIC_KERNEL_AUDIT", 'info'); }} onStartRefine={() => { setIsRefining(true); addLog("DIAGNOSTIC: UI_REFINE_INITIATED", 'info'); }} onToggleLogViewer={() => setShowLogViewer(prev => !prev)} />
      <div className="app-main"><div className="app-main-content-area custom-scrollbar"><Suspense fallback={<LoadingSpinner />}>{renderPanel()}</Suspense></div></div>
      <AppControlsBar activeMode={currentPanel} recentWorks={recentWorks} savedPresets={savedPresets} cloudArchives={cloudArchives} onSwitchMode={handleModeSwitch} onForceSave={handleCommitToVault} onLoadHistoryItem={handleLoadItem} onClearRecentWorks={handleClearRecentWorks} onClearSavedPresets={handleClearSavedPresets} enabledModes={enabledModes} />
      <LogViewer logs={logs} onClear={() => setLogs([])} isOpen={showLogViewer} onClose={() => setShowLogViewer(false)} />
    </div>
  );
};
