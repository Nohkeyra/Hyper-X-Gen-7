
import React, { memo } from 'react';
import { ThemeToggle } from './PanelShared';
import { SettingsIcon, MalaysiaSymbolIcon } from './Icons';
import { ImageEngine } from '../types';

interface PanelHeaderProps {
  title?: string;
  onBack?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onToggleLogViewer?: () => void; 
  onToggleSettings?: () => void;
  latticeStatus?: 'IDLE' | 'SYNCED' | 'DRIFT' | 'LOCKED';
  activeEngine?: ImageEngine;
}

export const PanelHeader: React.FC<PanelHeaderProps> = memo(({ 
  title = "HYPERXGEN", 
  onBack = () => {}, 
  isDarkMode,
  onToggleTheme,
  onToggleLogViewer,
  onToggleSettings,
  latticeStatus = 'IDLE',
  activeEngine = 'gemini' // Default to Gemini if undefined
}) => {
  const isFlux = activeEngine === 'hf';

  return (
    <header className={`fixed top-0 left-0 right-0 h-[var(--header-h)] z-[100] flex backdrop-blur-2xl transition-all duration-500 panel-header-with-glow select-none
      ${isDarkMode 
        ? 'bg-black/80 border-b border-brandBlue/30 shadow-[0_4px_30px_-5px_rgba(0,50,160,0.6)]' 
        : 'bg-brandYellow/95 border-b border-brandRed/20 shadow-2xl'}
    `}>
      <div className="w-full max-w-screen-2xl mx-auto flex flex-row items-center justify-between h-full px-4 md:px-8">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-4 min-w-0">
          <button 
            onClick={onBack} 
            className="group flex items-center gap-4 cursor-pointer btn-tactile"
          >
            {/* Malaysia Flag Icon (Canton Blue Background + Yellow Crescent & Star) */}
            <div className={`relative w-8 h-8 md:w-10 md:h-10 bg-brandBlue rounded-full flex items-center justify-center shadow-lg border-2 transition-all overflow-hidden shrink-0 group-hover:border-brandYellow
              ${isDarkMode ? 'border-brandYellow/20 shadow-[0_0_15px_rgba(0,50,160,0.5)]' : 'border-white/10'}
            `}>
               <MalaysiaSymbolIcon className="w-5 h-5 md:w-6 md:h-6 text-brandYellow" />
            </div>

            <div className="flex flex-col items-start leading-none min-w-0">
              <div className={`font-black text-sm md:text-lg tracking-tighter uppercase italic transition-all duration-300 truncate ${isDarkMode ? 'text-white group-hover:text-brandRed text-glow-blue' : 'text-brandBlue group-hover:text-brandRed'}`}>
                {title}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[7px] font-black ${isDarkMode ? 'text-brandRed' : 'text-brandRed'} tracking-[0.2em] uppercase`}>Lattice_Core_v7.6</span>
                <div className={`h-px w-4 ${isDarkMode ? 'bg-white/20' : 'bg-brandBlue/20'}`} />
                <span className={`text-[7px] font-black uppercase ${isDarkMode ? 'text-white/40' : 'text-brandBlue/40'}`}>Safe_State</span>
              </div>
            </div>
          </button>
        </div>

        {/* STATUS & CONTROLS */}
        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          
          {/* ENGINE TELEMETRY (NEW) */}
          <div className={`hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-sm border transition-all duration-500
             ${isFlux 
                ? 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : (isDarkMode ? 'bg-brandBlue/10 border-brandBlue/30' : 'bg-white/30 border-brandBlue/10')
             }
          `}>
             <div className="flex flex-col items-end leading-none">
                <span className={`text-[6px] font-black uppercase tracking-widest opacity-60 ${isFlux ? 'text-emerald-400' : (isDarkMode ? 'text-brandBlue' : 'text-brandBlue')}`}>
                   Synthesis_Engine
                </span>
                <span className={`text-[9px] font-black uppercase italic tracking-wider ${isFlux ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]' : (isDarkMode ? 'text-white' : 'text-brandCharcoal')}`}>
                   {isFlux ? 'FLUX_OMEGA' : 'GEMINI_PRO'}
                </span>
             </div>
             <div className="relative w-2 h-2">
                <div className={`absolute inset-0 rounded-full animate-ping ${isFlux ? 'bg-emerald-500' : 'bg-brandBlue'}`} />
                <div className={`absolute inset-0 rounded-full ${isFlux ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-brandBlue'}`} />
             </div>
          </div>

          {/* LATTICE TELEMETRY (Desktop Only) */}
          <div className={`hidden md:flex items-center gap-4 px-6 py-2 rounded-sm border transition-colors ${isDarkMode ? 'bg-black/40 border-brandBlue/20 shadow-[0_0_10px_rgba(0,50,160,0.2)]' : 'bg-white/40 border-brandRed/10'}`}>
             <div className="flex flex-col items-end leading-none">
                <span className={`text-[7px] font-black uppercase tracking-widest ${isDarkMode ? 'text-brandBlue' : 'text-brandBlue/40'}`}>Bridging_State</span>
                <span className={`text-[10px] font-black uppercase italic ${latticeStatus === 'SYNCED' ? 'text-brandYellow dark:text-brandRed animate-pulse' : (isDarkMode ? 'text-white/40' : 'text-brandRed/60')}`}>
                  {latticeStatus === 'SYNCED' ? 'LINK_ACTIVE' : 'READY_STANDBY'}
                </span>
             </div>
             <div className="flex flex-col gap-0.5">
                {[1,2,3].map(i => (
                  <div key={i} className={`w-3 h-0.5 rounded-full ${latticeStatus === 'SYNCED' ? 'bg-brandYellow' : (isDarkMode ? 'bg-brandBlue/40' : 'bg-brandRed/20')} transition-colors duration-500`} />
                ))}
             </div>
          </div>

          {/* ACTION CLUSTER */}
          <div className="flex gap-2 items-center">
             {onToggleLogViewer && (
                <button 
                  onClick={onToggleLogViewer} 
                  className={`w-10 h-10 flex items-center justify-center border transition-all rounded-sm group btn-tactile
                    ${isDarkMode 
                      ? 'border-brandBlue/20 bg-black/40 text-brandBlue hover:bg-brandRed hover:border-brandRed hover:text-white shadow-[0_0_10px_rgba(0,50,160,0.1)]' 
                      : 'border-brandRed/10 bg-white/20 text-brandBlue hover:bg-brandRed hover:text-white hover:border-brandRed'}
                  `}
                  title="System Trace"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
                </button>
             )}
            
             {onToggleSettings && (
                <button
                  onClick={onToggleSettings}
                  className={`w-10 h-10 flex items-center justify-center border transition-all rounded-sm group btn-tactile
                    ${isDarkMode
                      ? 'border-brandBlue/20 bg-black/40 text-brandBlue hover:bg-brandYellow hover:text-brandBlue hover:shadow-neon-yellow'
                      : 'border-brandRed/10 bg-white/20 text-brandBlue hover:bg-brandBlue hover:text-brandYellow'}
                  `}
                  title="Engine Tuning"
                >
                  <SettingsIcon className="group-hover:rotate-90 transition-transform duration-500 w-5 h-5" />
                </button>
              )}

             <div className={`ml-2 pl-4 border-l ${isDarkMode ? 'border-white/10' : 'border-brandBlue/10'}`}>
               <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme || (() => {})} />
             </div>
          </div>
        </div>
      </div>
    </header>
  );
});
