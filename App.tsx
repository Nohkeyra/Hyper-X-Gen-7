


import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { 
  PanelMode, 
  KernelConfig, 
  LogEntry, 
  ExtractionResult, 
  LogType,
  Preset,
  LatticeBuffer,
  PanelState,
  VectorPreset,
  TypographyPreset,
  MonogramPreset,
  FilterPreset,
  EmblemPreset,
  BasePreset,
  LatticeStatus
} from './types.ts';
import { BootScreen } from './components/BootScreen.tsx';
import { StartScreen } from './components/StartScreen.tsx';
import { PanelHeader } from './components/PanelHeader.tsx';
import { AppControlsBar } from './components/AppControlsBar.tsx';
import { LogViewer } from './components/LogViewer.tsx';
import { LoadingSpinner } from './components/Loading.tsx';
import { DeviceBadge } from './components/DeviceDetector.tsx';
import { LS_KEYS, SUCCESS_MESSAGES } from './constants.ts';
import { vaultDb } from './services/dbService.ts';

// Lazy-load panel components
const VectorPanel = lazy(() => import('./components/VectorPanel.tsx').then(m => ({ default: m.VectorPanel })));
const TypographyPanel = lazy(() => import('./components/TypographyPanel.tsx').then(m => ({ default: m.TypographyPanel })));
const MonogramPanel = lazy(() => import('./components/MonogramPanel.tsx').then(m => ({ default: m.MonogramPanel })));
const StyleExtractorPanel = lazy(() => import('./components/StyleExtractorPanel.tsx').then(m => ({ default: m.StyleExtractorPanel })));
const ImageFilterPanel = lazy(() => import('./components/ImageFilterPanel.tsx').then(m => ({ default: m.ImageFilterPanel })));
const EmblemForgePanel = lazy(() => import('./components/EmblemForgePanel.tsx').then(m => ({ default: m.EmblemForgePanel })));

export const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [currentPanel, setCurrentPanel] = useState<PanelMode>(PanelMode.START);
  const [transferData, setTransferData] = useState<Preset | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [enabledModes, setEnabledModes] = useState<PanelMode[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogViewer, setShowLogViewer] = useState(false);
  const [currentPanelState, setCurrentPanelState] = useState<PanelState | null>(null);

  // LATTICE_LINK
  const [latticeBuffer, setLatticeBuffer] = useState<LatticeBuffer | null>(null);
  const [latticeStatus, setLatticeStatus] = useState<LatticeStatus>(LatticeStatus.IDLE);

  const [kernelConfig, setKernelConfig] = useState<KernelConfig>({
    thinkingBudget: 0,
    temperature: 0.1,
    model: 'gemini-3-flash-preview',
    deviceContext: 'MAXIMUM_ARCHITECTURE_OMEGA_V5'
  });

  const [recentWorks, setRecentWorks] = useState<Preset[]>([]);
  const [savedPresets, setSavedPresets] = useState<Preset[]>([]);
  const [globalDna, setGlobalDna] = useState<ExtractionResult | null>(null);

  const addLog = useCallback((message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    setLogs(prev => {
      const newLogEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        message,
        type: type as LogType,
      };
      return [newLogEntry, ...prev].slice(0, 50);
    });
  }, []);

  const handleClearLattice = useCallback(() => {
    setLatticeBuffer(null);
    setLatticeStatus(LatticeStatus.IDLE);
    setTransferData(prev => prev?.category === 'LATTICE_BRIDGE' ? null : prev);
    addLog("LATTICE_DECOUPLED: Bridge connection terminated", "warning");
  }, [addLog]);

  useEffect(() => {
    const storedTheme = localStorage.getItem(LS_KEYS.THEME);
    if (storedTheme) setIsDarkMode(storedTheme === 'dark');
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDarkMode(true);
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
          await vaultDb.init();
          
          const response = await fetch('/config.json');
          const appConfig = await response.json();
          
          const configuredModes: PanelMode[] = appConfig.panels.enabled.map(panelName => {
            switch (panelName) {
              case 'VectorPanel': return PanelMode.VECTOR;
              case 'TypographyPanel': return PanelMode.TYPOGRAPHY;
              case 'MonogramPanel': return PanelMode.MONOGRAM;
              case 'EmblemForgePanel': return PanelMode.EMBLEM_FORGE;
              case 'StyleExtractorPanel': return PanelMode.EXTRACTOR;
              case 'ImageFilterPanel': return PanelMode.FILTERS;
              default: return PanelMode.START;
            }
          }).filter(mode => (mode as PanelMode) !== PanelMode.START);
          setEnabledModes(configuredModes);

          setSavedPresets(await vaultDb.getAll<Preset>('presets'));
          setRecentWorks(await vaultDb.getAll<Preset>('recent'));
          
          const storedConfig = await vaultDb.getItem<KernelConfig>('config', 'kernel');
          if (storedConfig) setKernelConfig(prev => ({...prev, ...storedConfig}));
          
          const storedLogs = await vaultDb.getItem<LogEntry[]>('logs', 'entries');
          if (storedLogs) setLogs(storedLogs);

          const storedDna = await vaultDb.getItem<ExtractionResult | null>('global_dna', 'dna');
          if (typeof storedDna !== 'undefined') setGlobalDna(storedDna);
          
          setHasInitialized(true);
          addLog("ARCHITECTURE: MASTER_PROTOCOL_ACTIVE", 'success');
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
      vaultDb.saveAll('presets', savedPresets);
      vaultDb.saveAll('recent', recentWorks.slice(0, 15));
      vaultDb.saveItem('config', 'kernel', kernelConfig);
      vaultDb.saveItem('logs', 'entries', logs);
      vaultDb.saveItem('global_dna', 'dna', globalDna);
    }
  }, [savedPresets, recentWorks, kernelConfig, logs, globalDna, hasInitialized]);

  const handleCommitToVault = useCallback(() => {
    if (!currentPanelState || (!currentPanelState.generatedOutput && !currentPanelState.dna)) {
      addLog("COMMIT_FAIL: NO_ENTITY_DETECTED", 'error');
      return;
    }

    const { type, prompt, dna, uploadedImage, generatedOutput, settings } = currentPanelState;
    const name = currentPanelState.name || (prompt ? `Commit: ${prompt.substring(0, 20)}` : `Commit: ${type}_SYNTH`);

    const basePreset: BasePreset = {
      id: `preset-${Date.now()}`,
      name,
      category: 'USER_COMMIT',
      description: `Synthesized on ${new Date().toLocaleDateString()}`,
      prompt: prompt || '',
      dna: dna || undefined,
      imageUrl: generatedOutput || uploadedImage || undefined,
      timestamp: new Date().toISOString(),
      type: type,
    };

    let newPreset: Preset;

    switch (type) {
      case PanelMode.VECTOR:
        newPreset = { ...basePreset, type: PanelMode.VECTOR, parameters: settings as VectorPreset['parameters'] };
        break;
      case PanelMode.TYPOGRAPHY:
        // FIX: Removed 'styleUsed' property which does not exist on TypographyPreset type.
        newPreset = { ...basePreset, type: PanelMode.TYPOGRAPHY, parameters: settings as TypographyPreset['parameters'] };
        break;
      case PanelMode.MONOGRAM:
        newPreset = { ...basePreset, type: PanelMode.MONOGRAM, parameters: settings as MonogramPreset['parameters'] };
        break;
      case PanelMode.FILTERS:
        newPreset = { ...basePreset, type: PanelMode.FILTERS, parameters: settings as FilterPreset['parameters'] };
        break;
      case PanelMode.EMBLEM_FORGE:
        newPreset = { ...basePreset, type: PanelMode.EMBLEM_FORGE, parameters: settings as EmblemPreset['parameters'] };
        break;
      default:
        addLog(`COMMIT_FAIL: Unsupported panel type "${type}" for vault commit.`, 'error');
        return;
    }

    setSavedPresets(prev => [newPreset, ...prev]);
    addLog("COMMIT_SUCCESS: VAULT_SYNCHRONIZED", 'success');
  }, [currentPanelState, addLog]);

  useEffect(() => {
    if (currentPanelState?.generatedOutput && currentPanel !== PanelMode.START) {
      setLatticeBuffer({
        imageUrl: currentPanelState.generatedOutput,
        dna: currentPanelState.dna || undefined,
        prompt: currentPanelState.prompt || '',
        sourceMode: currentPanel,
        timestamp: Date.now()
      });
      setLatticeStatus(LatticeStatus.SYNCED);
    }
  }, [currentPanelState?.generatedOutput, currentPanelState?.dna, currentPanelState?.prompt, currentPanel]);

  const handleModeSwitch = useCallback((mode: PanelMode, data: Preset | null = null) => {
    let finalData = data;
    
    if (!finalData && latticeBuffer && mode !== PanelMode.START && mode !== latticeBuffer.sourceMode) {
       addLog(`LATTICE_BRIDGE: HANDSHAKE_${latticeBuffer.sourceMode}_TO_${mode}`, 'info');
       finalData = {
         id: `bridge-${Date.now()}`,
         name: `Bridged: ${latticeBuffer.prompt || 'Artifact'}`,
         type: mode,
         category: 'LATTICE_BRIDGE',
         description: `Bridged from ${latticeBuffer.sourceMode} module`,
         prompt: latticeBuffer.prompt || '',
         imageUrl: latticeBuffer.imageUrl,
         dna: latticeBuffer.dna,
         timestamp: new Date().toISOString()
       } as any;
       setLatticeStatus(LatticeStatus.LOCKED);
    }

    if (mode === PanelMode.START) {
      setTransferData(null);
      setLatticeStatus(LatticeStatus.IDLE);
    } else {
      setTransferData(finalData);
    }
    
    setCurrentPanel(mode);
    addLog(`OMEGA_PIVOT: ${mode.toUpperCase()}_ENGAGED`, 'info');
  }, [addLog, latticeBuffer]);

  const handleLoadItem = useCallback((item: Preset) => {
    const mode = item.type;
    if (mode && (mode as any) !== PanelMode.START) {
      handleModeSwitch(mode, item);
    }
    addLog(`RECALLED: ${item.name}`, 'info');
  }, [handleModeSwitch, addLog]);

  const handleBootComplete = useCallback(() => { setIsBooting(false); }, []);

  if (isBooting) return <BootScreen onBootComplete={handleBootComplete} isDarkMode={isDarkMode} />;

  const commonProps = {
    kernelConfig,
    integrity: 100,
    uiRefined: false,
    onSaveToHistory: (work: Preset) => setRecentWorks(prev => [work, ...prev].slice(0, 15)),
    onModeSwitch: handleModeSwitch,
    savedPresets,
    onStateUpdate: setCurrentPanelState,
    addLog,
    onSetGlobalDna: setGlobalDna,
    globalDna: globalDna,
    latticeBuffer: latticeBuffer,
    onClearLattice: handleClearLattice
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PanelHeader 
        onBack={() => handleModeSwitch(PanelMode.START)} 
        title={currentPanel === PanelMode.START ? "HYPERXGEN 7" : currentPanel.toUpperCase().replace('_', ' ')}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onToggleLogViewer={() => setShowLogViewer(p => !p)}
        latticeStatus={latticeStatus}
      />
      <main className="flex-1 overflow-hidden" style={{ paddingTop: 'var(--header-h)', paddingBottom: 'var(--app-controls-bar-h)' }}>
        <Suspense fallback={<LoadingSpinner />}>
          {currentPanel === PanelMode.START && <StartScreen onSelectMode={handleModeSwitch} recentCount={recentWorks.length} enabledModes={enabledModes} />}
          {currentPanel === PanelMode.VECTOR && <VectorPanel {...commonProps} initialData={transferData} />}
          {currentPanel === PanelMode.TYPOGRAPHY && <TypographyPanel {...commonProps} initialData={transferData} />}
          {currentPanel === PanelMode.MONOGRAM && <MonogramPanel {...commonProps} initialData={transferData} />}
          {currentPanel === PanelMode.EMBLEM_FORGE && <EmblemForgePanel {...commonProps} initialData={transferData} />}
          {currentPanel === PanelMode.EXTRACTOR && <StyleExtractorPanel {...commonProps} initialData={transferData} onSaveToPresets={(p) => setSavedPresets(prev => [p as any, ...prev])} onDeletePreset={(id) => setSavedPresets(prev => prev.filter(p => p.id !== id))} onApiKeyError={() => {}} />}
          {currentPanel === PanelMode.FILTERS && <ImageFilterPanel {...commonProps} initialData={transferData} />}
        </Suspense>
      </main>
      <AppControlsBar 
        activeMode={currentPanel} 
        onSwitchMode={handleModeSwitch} 
        recentWorks={recentWorks} 
        savedPresets={savedPresets}
        onLoadHistoryItem={handleLoadItem}
        onClearRecentWorks={() => { setRecentWorks([]); vaultDb.clearStore('recent'); addLog(SUCCESS_MESSAGES.HISTORY_CLEARED, 'success'); }}
        onClearSavedPresets={() => { setSavedPresets([]); vaultDb.clearStore('presets'); addLog(SUCCESS_MESSAGES.VAULT_CLEARED, 'success'); }}
        onForceSave={handleCommitToVault}
        enabledModes={enabledModes}
      />
      <LogViewer logs={logs} onClear={() => setLogs([])} isOpen={showLogViewer} onClose={() => setShowLogViewer(false)} />
      <DeviceBadge />
    </div>
  );
};