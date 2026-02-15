import React, { useState, memo, useMemo } from 'react';
import { PanelMode, Preset } from '../types';
import { VectorIcon, TypographyIcon, MonogramIcon, ExtractorIcon, FilterIcon, StarIcon, BoxIcon, EmblemIcon, TrashIcon, NIcon } from './Icons'; 

interface AppModeMenuProps {
  visibleModes: { id: PanelMode; label: string; Icon: React.ElementType }[];
  activeMode: PanelMode;
  onSwitchMode: (mode: PanelMode) => void;
  isDarkMode: boolean;
}

const AppModeMenu: React.FC<AppModeMenuProps> = memo(({ visibleModes, activeMode, onSwitchMode, isDarkMode }) => {
  return (
    <div className={`flex-1 flex items-stretch overflow-x-auto no-scrollbar mask-edge-fade border-r ${isDarkMode ? 'border-brandRed/40' : 'border-white/20'}`}>
      {visibleModes.map((m) => (
        <button 
          key={m.id} 
          onClick={() => onSwitchMode(m.id)} 
          className={`px-3 md:px-6 flex flex-col items-center justify-center gap-1.5 transition-all relative min-w-[64px] md:min-w-[90px] border-r
            ${isDarkMode ? 'border-brandRed/20' : 'border-white/10'}
            ${activeMode === m.id 
              ? (isDarkMode ? 'bg-brandRed/20 text-brandRed box-glow-intense-red' : 'bg-brandYellow text-brandBlue shadow-inner')
              : 'text-white/60 hover:bg-white/10 dark:hover:bg-white/5 dark:hover:text-white'
            }
          `}
        >
          <m.Icon className={`w-3.5 h-3.5 md:w-5 md:h-5 ${activeMode === m.id ? 'scale-110 drop-shadow-md' : 'opacity-70'}`} />
          <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.1em] leading-none whitespace-nowrap">{m.label}</span>
          {activeMode === m.id && (
            <div className={`absolute top-0 left-0 right-0 h-1 ${isDarkMode ? 'bg-brandRed shadow-[0_0_15px_#CC0001]' : 'bg-white'}`} />
          )}
        </button>
      ))}
    </div>
  );
});

interface AppControlsBarProps {
  recentWorks?: Preset[];
  savedPresets?: Preset[];
  isSaving?: boolean;
  activeMode?: PanelMode;
  onSwitchMode?: (mode: PanelMode) => void;
  onLoadHistoryItem?: (item: Preset) => void;
  onForceSave?: () => void;
  onClearRecentWorks?: () => void;
  onClearSavedPresets?: () => void;
  enabledModes?: PanelMode[];
}

export const AppControlsBar: React.FC<AppControlsBarProps> = memo(({
  recentWorks = [],
  savedPresets = [],
  isSaving = false,
  activeMode = PanelMode.START,
  onSwitchMode = (_mode: PanelMode) => {},
  onLoadHistoryItem = (_item: Preset) => {},
  onForceSave = () => {},
  onClearRecentWorks = () => {},
  onClearSavedPresets = () => {},
  enabledModes = Object.values(PanelMode),
}) => {
  const [activePanel, setActivePanel] = useState<'recent' | 'presets' | null>(null);
  const isDarkMode = document.documentElement.classList.contains('dark');

  const togglePanel = (panel: 'recent' | 'presets') => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const allModes = useMemo(() => [
    { id: PanelMode.START, label: 'CORE', Icon: NIcon },
    { id: PanelMode.VECTOR, label: 'VECTOR', Icon: VectorIcon }, 
    { id: PanelMode.TYPOGRAPHY, label: 'TYPO', Icon: TypographyIcon }, 
    { id: PanelMode.MONOGRAM, label: 'MONO', Icon: MonogramIcon },
    { id: PanelMode.EMBLEM_FORGE, label: 'EMBLEM', Icon: EmblemIcon },
    { id: PanelMode.EXTRACTOR, label: 'DNA', Icon: ExtractorIcon },
    { id: PanelMode.FILTERS, label: 'FILTERS', Icon: FilterIcon }
  ], []);

  const visibleModes = useMemo(() => {
    return allModes.filter(m => enabledModes.includes(m.id) || m.id === PanelMode.START);
  }, [allModes, enabledModes]);

  return (
    <div className={`fixed bottom-0 left-0 right-0 h-[var(--app-controls-bar-h)] flex flex-row z-[200] transition-all duration-500 backdrop-blur-md
      ${isDarkMode 
        ? 'bg-black/95 border-t-2 border-brandRed shadow-[0_-10px_30px_rgba(204,0,1,0.4)]' 
        : 'bg-brandBlue border-t-2 border-brandYellow shadow-2xl'}
      pb-[var(--sab)]
    `}>
      <div className="w-full max-w-screen-2xl mx-auto flex flex-row h-full">
        <AppModeMenu 
          visibleModes={visibleModes} 
          activeMode={activeMode} 
          onSwitchMode={onSwitchMode} 
          isDarkMode={isDarkMode}
        />

        <div className="flex-none flex items-stretch">
          <div className={`flex items-stretch divide-x ${isDarkMode ? 'divide-brandRed/20' : 'divide-white/10'}`}>
            <button 
              onClick={() => togglePanel('recent')} 
              className={`px-3 sm:px-4 md:px-8 flex items-center justify-center gap-2 md:gap-3 text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all
                ${activePanel === 'recent' 
                  ? (isDarkMode ? 'bg-brandRed/20 text-brandRed box-glow-intense-red border-t-2 border-brandRed' : 'bg-brandRed text-white shadow-inner border-t-2 border-white') 
                  : 'text-white/80 hover:bg-white/10 dark:text-white/60 dark:hover:bg-white/5'}
              `}
              title="Session History"
            >
              <BoxIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden lg:inline">History</span>
            </button>
            <button 
              onClick={() => togglePanel('presets')} 
              className={`px-3 sm:px-4 md:px-8 flex items-center justify-center gap-2 md:gap-3 text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all
                ${activePanel === 'presets' 
                  ? (isDarkMode ? 'bg-brandYellow/20 text-brandYellow box-glow-intense-yellow border-t-2 border-brandYellow' : 'bg-brandYellow text-brandBlue shadow-inner border-t-2 border-white') 
                  : 'text-white/80 hover:bg-white/10 dark:text-white/60 dark:hover:bg-white/5'}
              `}
              title="Style Vault"
            >
              <StarIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden lg:inline">Vault</span>
            </button>
          </div>

          <div className={`flex items-center px-3 sm:px-4 md:px-8 border-l bg-black/20 ${isDarkMode ? 'border-brandRed/30' : 'border-white/10 bg-black/10'}`}>
            <button 
              onClick={onForceSave} 
              disabled={isSaving} 
              className={`btn-tactile px-4 md:px-6 py-2 text-[9px] md:text-[12px] font-black uppercase italic tracking-widest flex items-center gap-2 md:gap-3 rounded-sm border
                ${isDarkMode 
                   ? 'bg-brandRed text-white border-brandRed shadow-neon-red-soft' 
                   : 'bg-white text-brandBlue border-white shadow-md'}
                ${isSaving ? 'opacity-50 cursor-wait' : 'hover:brightness-110'}
              `}
            >
              {isSaving ? (
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-full animate-pulse" />
              )}
              <span className="leading-none">{isSaving ? 'SYNC' : 'COMMIT'}</span>
            </button>
          </div>
        </div>
      </div>

      {activePanel && (
        <div className={`fixed bottom-[calc(var(--app-controls-bar-h)+4px)] left-0 right-0 sm:left-auto sm:right-4 sm:w-96 glass-panel border-t-4 sm:border-4 animate-in slide-in-from-bottom-4 duration-300 sm:rounded-sm overflow-hidden flex flex-col max-h-[70vh] sm:max-h-[500px] shadow-2xl z-[210]
           ${isDarkMode ? 'border-brandRed shadow-[0_0_50px_rgba(204,0,1,0.4)] bg-black/95' : 'border-brandYellow shadow-2xl bg-white/95'}
        `}>
          {/* Panel Header */}
          <div className={`px-4 md:px-6 py-3 border-b-2 border-white/10 flex justify-between items-center ${activePanel === 'recent' ? (isDarkMode ? 'bg-black text-brandRed' : 'bg-brandRed text-white') : (isDarkMode ? 'bg-black text-brandYellow' : 'bg-brandYellow text-brandBlue')}`}>
            <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] italic">
              {activePanel === 'recent' ? 'SESSION_BUFFER' : 'STYLE_ARCHIVES'}
            </h4>
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={activePanel === 'recent' ? onClearRecentWorks : onClearSavedPresets}
                className="text-[8px] md:text-[9px] font-black uppercase hover:opacity-50 flex items-center gap-1.5 transition-all opacity-70"
              >
                <TrashIcon className="w-3 h-3 md:w-3.5 md:h-3.5" /> PURGE
              </button>
              <button onClick={() => setActivePanel(null)} className="text-[14px] font-black p-1 hover:scale-110 transition-transform">✕</button>
            </div>
          </div>
          
          {/* Panel Content */}
          <div className="overflow-y-auto custom-scrollbar flex-1 p-2 space-y-1 bg-brandNeutral dark:bg-brandDeep">
            {(activePanel === 'recent' ? recentWorks : savedPresets).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 md:py-20 opacity-20 grayscale">
                <BoxIcon className="w-10 h-10 md:w-12 md:h-12 mb-4" />
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] italic">Lattice_Empty</p>
              </div>
            ) : (
              (activePanel === 'recent' ? recentWorks : savedPresets).map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => { onLoadHistoryItem(item); setActivePanel(null); }}
                  className="flex items-center justify-between p-2.5 md:p-3 hover:bg-brandBlue/10 dark:hover:bg-white/5 cursor-pointer border border-transparent hover:border-brandBlue/20 dark:hover:border-white/10 rounded-sm transition-all group"
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-brandBlue/5 dark:bg-white/5 flex items-center justify-center border border-current/10 group-hover:bg-brandRed group-hover:text-white transition-all shrink-0">
                       <span className="font-black text-[10px] md:text-xs italic">{item.name[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] md:text-[10px] font-black uppercase truncate group-hover:text-brandRed transition-colors tracking-tight">{item.name}</p>
                      <p className="text-[6px] md:text-[7px] opacity-40 uppercase font-black tracking-widest">{item.type}</p>
                    </div>
                  </div>
                  <span className="text-[7px] md:text-[8px] font-black opacity-20 group-hover:opacity-100 transition-opacity whitespace-nowrap">LOAD_ARCHIVE</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});