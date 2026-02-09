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
  const [apiKeyReady, setApiKeyReady] = useState(false);
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

  const handleApiKeyError = useCallback(() => {
    addLog("API_KEY_INVALID: Resetting key selection.", 'error');
    setApiKeyReady(false);
  }, [addLog]);

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
    const checkApiKey = async () => {
        if (!isBooting && hasInitialized) {
            if (apiKeyReady) return; // Don't re-check if already marked as ready
            
            if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
                try {
                    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
                    setApiKeyReady(hasKey);
                    if (!hasKey) {
                        addLog("API_KEY_MISSING: User selection required.", 'warning');
                    } else {
                        addLog("API_KEY_VALIDATED: System ready.", 'success');
                    }
                } catch (e: any) {
                    addLog(`API_KEY_CHECK_FAILED: ${e.message}`, 'error');
                    setApiKeyReady(true); // Failsafe to prevent getting stuck
                }
            } else {
                addLog("Running outside AI Studio, assuming API key is set.", 'info');
                setApiKeyReady(true);
            }
        }
    };
    checkApiKey();
  }, [isBooting, hasInitialized, addLog, apiKeyReady]);

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

  const handleSelectKey = async () => {
    if ((window as any).aistudio && typeof (window as any).aistudio.openSelectKey === 'function') {
      try {
        await (window as any).aistudio.openSelectKey();
        // As per guidelines, assume success to avoid race conditions.
        setApiKeyReady(true);
        addLog("API_KEY_SELECTED: Resuming operations.", 'success');
      } catch(e: any) {
        addLog(`API_KEY_SELECTION_ERROR: ${e.message}`, 'error');
      }
    }
  };

  if (isBooting) return <BootScreen onBootComplete={handleBootComplete} isDarkMode={isDarkMode} />;

  if (hasInitialized && !apiKeyReady) {
    return (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-brandNeutral dark:bg-brandDeep p-8 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 mb-8 border-4 border-brandRed rounded-full flex items-center justify-center shadow-lg dark:shadow-neon-red-soft">
                <svg className="w-12 h-12 text-brandRed" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h1 className="text-2xl font-black text-brandCharcoal dark:text-white uppercase italic tracking-tighter mb-4">API Key Required</h1>
            <p className="max-w-md text-sm text-brandCharcoalMuted dark:text-white/70 mb-8">
                This application requires a Gemini API key to function. Please select a key from a Google Cloud project with billing enabled to proceed.
            </p>
            <button
                onClick={handleSelectKey}
                className="px-8 py-3 bg-brandRed text-white text-sm font-black uppercase tracking-widest hover:bg-opacity-90 transition-all rounded-sm shadow-[4px_4px_0px_0px_rgba(204,0,1,0.3)]"
            >
                Select API Key
            </button>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="mt-6 text-xs text-brandCharcoalMuted dark:text-white/50 underline hover:text-brandRed transition-colors">
                Learn more about billing
            </a>
        </div>
    );
  }

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
    onApiKeyError: handleApiKeyError,
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
          {currentPanel === PanelMode.EXTRACTOR && <StyleExtractorPanel kernelConfig={kernelConfig} savedPresets={savedPresets} onSaveToPresets={(p) => setSavedPresets(prev => [p, ...prev])} onDeletePreset={(id) => setSavedPresets(prev => prev.filter(p => p.id !== id))} addLog={addLog} onApiKeyError={handleApiKeyError} />}
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
      <LogViewer logs={logs} onClear={() => setLogs([])} isOpen={showLogViewer} onClose={() => setShowLogViewer(false)} />
    </div>
  );
};