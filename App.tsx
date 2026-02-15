
import React, { useState, useEffect, useCallback } from 'react';
import {
  PanelMode,
  Preset,
  LogEntry,
  LogType,
  KernelConfig,
  ImageEngine,
  ExtractionResult,
  LatticeBuffer,
} from './types.ts';
import {
  VectorPanel,
  TypographyPanel,
  MonogramPanel,
  StyleExtractorPanel,
  ImageFilterPanel,
  EmblemForgePanel,
  SettingsPanel,
  LogViewer,
  PanelHeader,
  AppControlsBar,
  BootScreen,
  StartScreen,
} from './components/index.ts';
import { vaultDb } from './services/dbService.ts';
import { LS_KEYS, APP_CONSTANTS, ENV } from './constants.ts'; // Import ENV

// ─── System Alert Overlay ────────────────────────────────────────────────────
interface SystemAlert { title: string; message: string; type: 'warning' | 'error' | 'info'; }

const SystemAlertOverlay: React.FC<{ alert: SystemAlert | null; onClose: () => void }> = ({ alert, onClose }) => {
  if (!alert) return null;
  const border = alert.type === 'warning' ? 'border-brandYellow' : alert.type === 'error' ? 'border-brandRed' : 'border-brandBlue';
  const text   = alert.type === 'warning' ? 'text-brandYellow'  : alert.type === 'error' ? 'text-brandRed'  : 'text-brandBlue';
  const bg     = alert.type === 'warning' ? 'bg-brandYellow/10' : alert.type === 'error' ? 'bg-brandRed/10' : 'bg-brandBlue/10';
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-md px-4 animate-in slide-in-from-top-4 duration-500">
      <div className={`relative p-4 md:p-6 bg-brandCharcoal/95 dark:bg-black/95 backdrop-blur-xl border-l-4 ${border} ${bg} rounded-r-sm shadow-2xl flex items-start gap-4`}>
        <div className={`mt-1 p-2 rounded-full border ${border} ${text}`}>
          {alert.type === 'warning'
            ? <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          }
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${text}`}>{alert.title}</h4>
          <p className="text-[10px] font-mono text-white/80 leading-relaxed">{alert.message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 animate-[shimmer_5s_linear_forwards] w-full" />
      </div>
    </div>
  );
};

// ─── App ─────────────────────────────────────────────────────────────────────
export const App: React.FC = () => {
  const [booting,      setBooting]      = useState(true);
  const [activeMode,   setActiveMode]   = useState<PanelMode>(PanelMode.START);
  const [isDarkMode,   setIsDarkMode]   = useState(() => {
    const saved = localStorage.getItem(LS_KEYS.THEME);
    return saved ? saved === 'dark' : true;
  });

  const [recentWorks,  setRecentWorks]  = useState<Preset[]>([]);
  const [savedPresets, setSavedPresets] = useState<Preset[]>([]);
  const [logs,         setLogs]         = useState<LogEntry[]>([]);
  const [globalDna,    setGlobalDna]    = useState<ExtractionResult | null>(null);
  const [latticeBuffer,setLatticeBuffer]= useState<LatticeBuffer | null>(null);

  const [showLogs,     setShowLogs]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving,     setIsSaving]     = useState(false);
  const [systemAlert,  setSystemAlert]  = useState<SystemAlert | null>(null);

  const [kernelConfig, setKernelConfig] = useState<KernelConfig>({
    thinkingBudget: 0,
    temperature:    0.2,
    model:          'gemini-3-flash-preview',
    deviceContext:  'desktop',
    imageEngine:    ImageEngine.GEMINI,
  });

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const initApp = async () => {
      await vaultDb.init();
      const [presets, recent, dbLogs, dna, savedConfig] = await Promise.all([
        vaultDb.getAll<Preset>('presets'),
        vaultDb.getAll<Preset>('recent'),
        vaultDb.getAll<LogEntry>('logs'),
        vaultDb.getItem<ExtractionResult>('global_dna', 'current'),
        vaultDb.getItem<KernelConfig>('config', 'kernel'),
      ]);
      setSavedPresets(presets || []);
      setRecentWorks(recent  || []);
      setLogs(dbLogs         || []);
      setGlobalDna(dna       || null);

      let initialKernelConfig = kernelConfig;
      if (savedConfig) {
        initialKernelConfig = { ...initialKernelConfig, ...savedConfig };
      }
      setKernelConfig(initialKernelConfig);

      if (isDarkMode) document.documentElement.classList.add('dark');
      else            document.documentElement.classList.remove('dark');
    };
    initApp();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    vaultDb.saveItem('config', 'kernel', kernelConfig);
  }, [kernelConfig]);

  // ── Logging ───────────────────────────────────────────────────────────────
  const addLog = useCallback((message: string, type: LogType = LogType.INFO) => {
    const newLog: LogEntry = {
      id:        `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setLogs(prev => [...prev, newLog].slice(-APP_CONSTANTS.MAX_LOG_ENTRIES));

    if (type === LogType.ERROR) {
      const u = message.toUpperCase();
      if (u.includes('QUOTA') || u.includes('LIMIT') || u.includes('OVERLOAD') || u.includes('429') || u.includes('RESOURCE_EXHAUSTED')) {
        const isPersistent = logs.filter(l => l.type === 'error' && l.message.includes('429')).length > 2;
        setSystemAlert({ 
          title: isPersistent ? 'DAILY QUOTA EXHAUSTED' : 'SYSTEM COOLDOWN ACTIVE', 
          message: isPersistent 
            ? 'Total request capacity reached. If you have waited 24h, verify your API Key is valid in AI Studio.' 
            : 'Neural engines at max capacity. Please wait 60 seconds.', 
          type: 'warning' 
        });
        setTimeout(() => setSystemAlert(null), 10000);
        return;
      }
      if (u.includes('KEY') || u.includes('AUTH') || u.includes('CREDENTIAL') || u.includes('API_KEY_INVALID')) {
        setSystemAlert({ title: 'SECURITY PROTOCOL FAILURE', message: 'API handshake failed. Check your API key status or connectivity.', type: 'error' });
        setTimeout(() => setSystemAlert(null), 8000);
        return;
      }
      if (u.includes('FAIL') || u.includes('ERROR')) {
        setSystemAlert({ title: 'SYNTHESIS INTERRUPTED', message: message.replace(/^(VECTORIZATION_|TYPO_|MONO_|EMBLEM_)?ERROR: /, ''), type: 'error' });
        setTimeout(() => setSystemAlert(null), 5000);
      }
    }
  }, [logs]);

  // ── Persistence helpers ───────────────────────────────────────────────────
  const saveToHistory = useCallback((work: Preset) => {
    setRecentWorks(prev => {
      const updated = [work, ...prev].slice(0, APP_CONSTANTS.MAX_RECENT_ITEMS);
      vaultDb.saveAll('recent', updated);
      return updated;
    });
  }, []);

  const saveToVault = useCallback((preset: Preset) => {
    setSavedPresets(prev => {
      const updated = [preset, ...prev];
      vaultDb.saveAll('presets', updated);
      return updated;
    });
    addLog(`ARTIFACT_COMMITTED: ${preset.name}`, LogType.SUCCESS);
  }, [addLog]);

  const deletePreset = useCallback((id: string) => {
    setSavedPresets(prev => {
      const updated = prev.filter(p => p.id !== id);
      vaultDb.saveAll('presets', updated);
      return updated;
    });
    addLog(`ARTIFACT_PURGED: ${id}`, LogType.WARNING);
  }, [addLog]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem(LS_KEYS.THEME, next ? 'dark' : 'light');
      if (next) document.documentElement.classList.add('dark');
      else      document.documentElement.classList.remove('dark');
      addLog(`THEME_SHIFT: ${next ? 'DARK' : 'LIGHT'}`, LogType.INFO);
      return next;
    });
  }, [addLog]);

  const handleModeSwitch = useCallback((mode: PanelMode, data?: any) => {
    setActiveMode(mode);
    if (data) {
      setLatticeBuffer({ imageUrl: data.imageUrl, dna: data.dna, prompt: data.prompt, timestamp: Date.now(), sourceMode: mode });
      addLog(`LATTICE_BRIDGE_SYNC: ${mode.toUpperCase()}`, LogType.INFO);
    } else {
      setLatticeBuffer(null);
    }
  }, [addLog]);

  const clearSession = useCallback(() => {
    setRecentWorks([]);
    vaultDb.clearStore('recent');
    addLog('SESSION_BUFFER_PURGED', LogType.WARNING);
  }, [addLog]);

  const clearVault = useCallback(() => {
    setSavedPresets([]);
    vaultDb.clearStore('presets');
    addLog('VAULT_ARCHIVES_DEEP_CLEANED', LogType.WARNING);
  }, [addLog]);

  const commonProps = {
    kernelConfig,
    integrity: 100,
    savedPresets,
    globalDna,
    onSetGlobalDna: setGlobalDna,
    addLog,
    onSaveToHistory: saveToHistory,
    onModeSwitch: handleModeSwitch,
    latticeBuffer,
    onClearLattice: () => setLatticeBuffer(null),
  };

  return (
    <div className={`flex flex-col h-screen w-screen bg-brandNeutral dark:bg-brandDeep transition-colors duration-500 overflow-hidden relative ${booting ? 'items-center justify-center' : ''}`}>
      <SystemAlertOverlay alert={systemAlert} onClose={() => setSystemAlert(null)} />

      {booting && (
        <BootScreen
          isDarkMode={isDarkMode}
          onBootComplete={() => {
            setBooting(false);
            addLog('SYSTEM_READY: OMEGA_V7.6', LogType.SUCCESS);
          }}
        />
      )}

      {!booting && (
        <PanelHeader
          title={`HYPERXGEN 7.6 // ${activeMode.toUpperCase()}`}
          onBack={() => setActiveMode(PanelMode.START)}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onToggleLogViewer={() => setShowLogs(true)}
          onToggleSettings={() => setShowSettings(true)}
          latticeStatus={latticeBuffer ? 'SYNCED' : 'IDLE'}
          activeEngine={kernelConfig.imageEngine}
        />
      )}

      <main className={`flex-1 transition-opacity duration-1000 ${booting ? 'opacity-0' : 'opacity-100'} mt-[var(--header-h)] mb-[var(--app-controls-bar-h)] relative overflow-hidden`}>
        {activeMode === PanelMode.START && (
          <StartScreen onSelectMode={setActiveMode} recentCount={recentWorks.length} />
        )}
        {activeMode === PanelMode.VECTOR && (
          <VectorPanel {...commonProps} />
        )}
        {activeMode === PanelMode.TYPOGRAPHY && (
          <TypographyPanel {...commonProps} />
        )}
        {activeMode === PanelMode.MONOGRAM && (
          <MonogramPanel {...commonProps} />
        )}
        {activeMode === PanelMode.EXTRACTOR && (
          <StyleExtractorPanel
            kernelConfig={kernelConfig}
            savedPresets={savedPresets}
            onSaveToPresets={saveToVault}
            onDeletePreset={deletePreset}
            addLog={addLog}
            onModeSwitch={handleModeSwitch}
            onApiKeyError={() => {}}
          />
        )}
        {activeMode === PanelMode.FILTERS && (
          <ImageFilterPanel
            kernelConfig={kernelConfig}
            addLog={addLog}
            onModeSwitch={handleModeSwitch}
            latticeBuffer={latticeBuffer}
            savedPresets={savedPresets}
            onSaveToHistory={saveToHistory}
          />
        )}
        {activeMode === PanelMode.EMBLEM_FORGE && (
          <EmblemForgePanel {...commonProps} />
        )}
      </main>

      {!booting && (
        <AppControlsBar
          recentWorks={recentWorks}
          savedPresets={savedPresets}
          activeMode={activeMode}
          onSwitchMode={setActiveMode}
          onLoadHistoryItem={item => handleModeSwitch(item.type, item)}
          onForceSave={() => addLog('MANUAL_SYNC_TRIGGERED', LogType.INFO)}
          onClearRecentWorks={clearSession}
          onClearSavedPresets={clearVault}
          isSaving={isSaving}
        />
      )}

      <LogViewer
        logs={logs}
        isOpen={showLogs}
        onClose={() => setShowLogs(false)}
        onClear={() => { setLogs([]); vaultDb.clearStore('logs'); }}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        kernelConfig={kernelConfig}
        onConfigChange={setKernelConfig}
        addLog={addLog}
      />
    </div>
  );
};
