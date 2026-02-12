
import React, { useState, memo, useMemo } from 'react';
import { PanelMode } from '../types';
import { VectorIcon, TypographyIcon, MonogramIcon, ExtractorIcon, FilterIcon, StarIcon, BoxIcon, EmblemIcon, TrashIcon } from './Icons'; 

interface HistoryItem {
  id: string;
  name: string;
  type: PanelMode;
  // Fix: make timestamp optional to match Preset type in types.ts which extends BasePreset
  timestamp?: string;
}

interface PresetItem {
  id: string;
  name: string;
  type: PanelMode;
  description: string;
}

interface AppModeMenuProps {
  visibleModes: { id: PanelMode; label: string; Icon: React.ElementType }[];
  activeMode: PanelMode;
  onSwitchMode: (mode: PanelMode) => void;
  isDarkMode: boolean;
}

const AppModeMenu: React.FC<AppModeMenuProps> = memo(({ visibleModes, activeMode, onSwitchMode, isDarkMode }) => {
  return (
    <div className="flex-1 flex items-stretch border-r border-white/10 dark:border-brandBlue/20 overflow-x-auto no-scrollbar mask-gradient-right">
      {visibleModes.map((m) => (
        <button 
          key={m.id} 
          onClick={() => onSwitchMode(m.id)} 
          className={`px-3 md:px-5 flex flex-col md:flex-col items-center justify-center gap-1 md:gap-1.5 transition-all relative min-w-[60px] md:min-w-[80px] border-r border-white/5 dark:border-brandBlue/20
            ${activeMode === m.id 
              ? 'bg-brandYellow text-brandBlue' 
              : 'text-white/60 hover:bg-brandYellow/10'
            }
          `}
        >
          <m.Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${activeMode === m.id ? 'animate-pulse' : ''}`} />
          <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest leading-none">{m.label}</span>
          {activeMode === m.id && (
            <div className="absolute top-0 left-0 right-0 h-0.5 md:h-1 bg-brandRed" />
          )}
        </button>
      ))}
    </div>
  );
});


interface AppControlsBarProps {
  recentWorks?: HistoryItem[];
  savedPresets?: PresetItem[];
  isSaving?: boolean;
  activeMode?: PanelMode;
  onSwitchMode?: (mode: PanelMode) => void;
  onLoadHistoryItem?: (item: any) => void;
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
  onSwitchMode = (_mode) => {},
  onLoadHistoryItem = (_item) => {},
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

  const handleClearRecent = () => {
    if (window.confirm('Are you sure you want to purge the session buffer? This action cannot be undone.')) {
      onClearRecentWorks();
    }
  };

  const handleClearVault = () => {
    if (window.confirm('Are you sure you want to purge all saved styles from the vault? This action cannot be undone.')) {
      onClearSavedPresets();
    }
  };

  const renderHistoryItem = (item: any) => {
    const isDna = (item.type === PanelMode.EXTRACTOR || item.mode === PanelMode.EXTRACTOR) && !!item.dna;
    
    let iconComponent: React.ElementType = BoxIcon;
    let iconColorClass = 'text-brandRed';
    
    if (isDna) {
      iconComponent = StarIcon;
      iconColorClass = 'text-brandRed';
    } else {
      switch (item.type || item.mode) {
        case PanelMode.VECTOR: iconComponent = VectorIcon; iconColorClass = 'text-brandRed'; break;
        case PanelMode.TYPOGRAPHY: iconComponent = TypographyIcon; iconColorClass = 'text-brandYellow'; break;
        case PanelMode.MONOGRAM: iconComponent = MonogramIcon; iconColorClass = 'text-brandBlue'; break;
        case PanelMode.EXTRACTOR: iconComponent = ExtractorIcon; iconColorClass = 'text-brandRed'; break;
        case PanelMode.FILTERS: iconComponent = FilterIcon; iconColorClass = 'text-brandBlue'; break;
        case PanelMode.EMBLEM_FORGE: iconComponent = EmblemIcon; iconColorClass = 'text-brandYellow'; break;
        default: iconComponent = BoxIcon; iconColorClass = 'text-brandCharcoalMuted dark:text-white/60'; break;
      }
    }

    return (
      <div key={item.id} className="history-item flex items-center justify-between group p-2 hover:bg-brandBlue/5 cursor-pointer border-b border-brandYellow/10 dark:border-white/5 last:border-b-0 transition-colors" onClick={() => onLoadHistoryItem(item)}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-7 h-7 shrink-0 bg-brandNeutral dark:bg-zinc-800 flex items-center justify-center text-[9px] font-black italic border border-brandRed/10 group-hover:bg-brandRed group-hover:text-white transition-all rounded-sm ${iconColorClass}`}>
            {React.createElement(iconComponent, { className: 'w-3.5 h-3.5' })}
          </div>
          <div className="history-info min-w-0 truncate">
            <span className="history-word truncate block text-[9px] font-black text-brandBlue dark:text-brandNeutral group-hover:text-brandRed transition-colors uppercase tracking-tight">{item.name}</span>
            <span className="text-[6px] text-brandCharcoalMuted dark:text-white/30 uppercase font-black tracking-widest">{item.timestamp || 'BLUEPRINT'}</span>
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onLoadHistoryItem(item); }} className={`shrink-0 px-2 py-0.5 border border-brandBlue/10 dark:border-white/5 text-[7px] font-black text-brandBlue dark:text-white/40 hover:bg-brandRed hover:text-white transition-all uppercase rounded-sm`}>
          {isDna ? 'APPLY' : 'LOAD'}
        </button>
      </div>
    );
  };

  const allModes = useMemo(() => [
    { id: PanelMode.VECTOR, label: 'VECTOR', Icon: VectorIcon }, 
    { id: PanelMode.TYPOGRAPHY, label: 'TYPO', Icon: TypographyIcon }, 
    { id: PanelMode.MONOGRAM, label: 'MONO', Icon: MonogramIcon },
    { id: PanelMode.EMBLEM_FORGE, label: 'EMBLEM', Icon: EmblemIcon },
    { id: PanelMode.EXTRACTOR, label: 'EXTRACT', Icon: ExtractorIcon }, 
    { id: PanelMode.FILTERS, label: 'FILTERS', Icon: FilterIcon }
  ], []);

  const visibleModes = useMemo(() => {
    return allModes.filter(m => enabledModes.includes(m.id));
  }, [allModes, enabledModes]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[var(--app-controls-bar-h)] bg-brandBlue text-white border-t-2 md:border-t-4 border-brandYellow flex flex-row z-[120] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-colors duration-300 app-controls-bar-with-glow">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-row h-full">
        <AppModeMenu 
          visibleModes={visibleModes} 
          activeMode={activeMode} 
          onSwitchMode={onSwitchMode} 
          isDarkMode={isDarkMode}
        />

        <div className="flex-none flex items-stretch">
          <div className="flex items-stretch">
            <button 
              onClick={() => togglePanel('recent')} 
              className={`px-3 md:px-6 flex items-center justify-center gap-2 md:gap-3 text-[10px] font-black uppercase tracking-widest transition-all border-r border-white/10
                ${activePanel === 'recent' ? 'bg-brandRed text-white' : 'hover:bg-white/10'}
              `}
              title="History"
            >
              <BoxIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">History</span>
              {recentWorks.length > 0 && <span className="text-[7px] md:text-[8px] opacity-60">[{recentWorks.length}]</span>}
            </button>
            <button 
              onClick={() => togglePanel('presets')} 
              className={`px-3 md:px-6 flex items-center justify-center gap-2 md:gap-3 text-[10px] font-black uppercase tracking-widest transition-all border-r border-white/10
                ${activePanel === 'presets' ? 'bg-brandYellow text-brandBlue' : 'hover:bg-white/10'}
              `}
              title="Vault"
            >
              <StarIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Vault</span>
            </button>
          </div>

          <div className="flex items-stretch">
            <div className="flex items-center gap-2 md:gap-4 px-3 md:px-6 border-l border-white/10">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em]">Kernel_Status</span>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-brandYellow animate-ping' : 'bg-brandYellow'}`} />
                  <span className={`text-[9px] font-black uppercase ${isSaving ? 'text-brandYellow animate-pulse' : 'text-white'}`}>
                    {isSaving ? 'SYNC_ACTIVE' : 'IDLE'}
                  </span>
                </div>
              </div>
              <button 
                onClick={onForceSave} 
                disabled={isSaving} 
                className="px-2 md:px-4 py-1.5 md:py-2 bg-brandRed text-white text-[8px] md:text-[9px] font-black uppercase italic tracking-widest hover:bg-brandYellow hover:text-brandBlue transition-all shadow-[2px_2px_0px_0px_rgba(255,204,0,0.3)] md:shadow-[4px_4px_0px_0px_rgba(255,204,0,0.3)] rounded-sm"
              >
                <span className="hidden sm:inline">COMMIT</span>
                <span className="sm:hidden">SAVE</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {activePanel && (
        <div className="absolute bottom-[calc(100%+2px)] left-0 right-0 sm:left-auto sm:right-0 sm:w-80 bg-brandDeep dark:bg-black/60 border-t-4 sm:border-4 border-brandYellow dark:border-brandYellow shadow-[0_-10px_40px_rgba(0,0,0,0.2)] sm:shadow-[12px_12px_0px_0px_rgba(0,50,160,1)] sm:dark:shadow-[12px_12px_0px_0px_rgba(255,204,0,0.3)] animate-in slide-in-from-bottom-2 duration-200 sm:rounded-sm overflow-hidden flex flex-col max-h-[50vh] sm:max-h-[400px]">
          {/* Header */}
          <div className={`px-4 py-2 border-b-2 border-brandBlue dark:border-brandYellow/10 flex justify-between items-center ${activePanel === 'recent' ? 'bg-brandRed text-white' : 'bg-brandYellow text-brandBlue'}`}>
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] italic">
              {activePanel === 'recent' ? 'SESSION_BUFFER' : 'STYLE_ARCHIVES'}
            </h4>
            <div className="flex items-center gap-2">
              {activePanel === 'recent' && recentWorks.length > 0 && (
                <button onClick={handleClearRecent} className="text-[8px] font-black uppercase hover:opacity-70 flex items-center gap-1 transition-opacity" title="Clear History">
                  <TrashIcon className="w-3 h-3" /> CLEAR
                </button>
              )}
              {activePanel === 'presets' && savedPresets.length > 0 && (
                <button onClick={handleClearVault} className="text-[8px] font-black uppercase hover:opacity-70 flex items-center gap-1 transition-opacity" title="Clear Vault">
                  <TrashIcon className="w-3 h-3" /> CLEAR
                </button>
              )}
              <button onClick={() => setActivePanel(null)} className="text-[9px] font-black uppercase p-2 -mr-2">✕</button>
            </div>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto custom-scrollbar flex-1 bg-brandNeutral dark:bg-brandDeep">
            {activePanel === 'recent' ? (
              recentWorks.length === 0 ? <p className="text-[9px] p-6 text-brandCharcoalMuted dark:text-white/20 uppercase font-black text-center tracking-widest italic">Buffer_Empty</p> : recentWorks.map(renderHistoryItem)
            ) : (
              savedPresets.length === 0 ? <p className="text-[9px] p-6 text-brandCharcoalMuted dark:text-white/20 uppercase font-black text-center tracking-widest italic">No_Presets_Buffered</p> : savedPresets.map(renderHistoryItem)
            )}
          </div>

          {/* Footer for mobile status */}
          <div className="lg:hidden p-2 border-t-2 border-brandBlue dark:border-brandYellow/10 flex justify-between items-center bg-brandNeutral dark:bg-brandDeep">
              <span className="text-[7px] font-black text-brandCharcoalMuted dark:text-white/40 uppercase tracking-[0.2em]">Kernel_Status</span>
              <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-brandYellow animate-ping' : 'bg-brandYellow'}`} />
                  <span className={`text-[9px] font-black uppercase ${isSaving ? 'text-brandYellow' : 'text-brandCharcoal dark:text-white'}`}>
                      {isSaving ? 'SYNC_ACTIVE' : 'IDLE'}
                  </span>
              </div>
          </div>
        </div>
      )}
    </div>
  );
});
