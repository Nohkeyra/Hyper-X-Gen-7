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
    <header className={`fixed top-0 left-0 right-0 h-[var(--header-h)] z-[300] flex backdrop-blur-2xl transition-all duration-500 panel-header-with-glow select-none pt-[var(--sat)]
      ${isDarkMode 
        ? 'bg-black/90 border-b border-brandBlue/30 shadow-[0_4px_30px_-5px_rgba(0,50,160,0.4)]' 
        : 'bg-brandYellow/95 border-b border-brandRed/20 shadow-2xl'}
    `}>
      <div className="w-full max-w-screen-2xl mx-auto flex flex-row items-center justify-between h-full px-3 md:px-8">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <button 
            onClick={onBack} 
            className="group flex items-center gap-2 md:gap-4 cursor-pointer btn-tactile"
          >
            {/* Malaysia Flag Icon */}
            <div className={`relative w-7 h-7 md:w-10 md:h-10 bg-brandBlue rounded-full flex items-center justify-center shadow-lg border-2 transition-all overflow-hidden shrink-0 group-hover:border-brandYellow
              ${isDarkMode ? 'border-brandYellow/20 shadow-[0_0_15px_rgba(0,50,160,0.4)]' : 'border-white/10'}
            `}>
               <MalaysiaSymbolIcon className="w-4 h-4 md:w-6 md:h-6 text-brandYellow" />
            </div>

            <div className="flex flex-col items-start leading-none min-w-0">
              <div className={`font-black text-xs md:text-lg tracking-tighter uppercase italic transition-all duration-300 truncate ${isDarkMode ? 'text-white group-hover:text-brandRed text-glow-blue' : 'text-brandBlue group-hover:text-brandRed'}`}>
                {title.split(' // ')[0]}
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                <span className={`text-[6px] md:text-[7px] font-black ${isDarkMode ? 'text-brandRed' : 'text-brandRed'} tracking-[0.1em] md:tracking-[0.2em] uppercase`}>OMEGA_v7.6</span>
                <div className={`h-px w-2 md:w-4 ${isDarkMode ? 'bg-white/20' : 'bg-brandBlue/20'}`} />
                <span className={`text-[6px] md:text-[7px] font-black uppercase hidden xs:inline ${isDarkMode ? 'text-white/40' : 'text-brandBlue/40'}`}>Safe_State</span>
              </div>
            </div>
          </button>
        </div>

        {/* STATUS & CONTROLS */}
        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          
          {/* ENGINE TELEMETRY */}
          <div className={`hidden sm:flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1 md:py-1.5 rounded-sm border transition-all duration-500
             ${isFlux 
                ? 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : (isDarkMode ? 'bg-brandBlue/10 border-brandBlue/30' : 'bg-white/30 border-brandBlue/10')
             }
          `}>
             <div className="flex flex-col items-end leading-none">
                <span className={`text-[5px] md:text-[6px] font-black uppercase tracking-widest opacity-60 ${isFlux ? 'text-emerald-400' : 'text-brandBlue'}`}>
                   Engine
                </span>
                <span className={`text-[8px] md:text-[9px] font-black uppercase italic tracking-wider ${isFlux ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]' : (isDarkMode ? 'text-white' : 'text-brandCharcoal')}`}>
                   {isFlux ? 'FLUX' : 'GEMINI'}
                </span>
             </div>
             <div className="relative w-1.5 h-1.5">
                <div className={`absolute inset-0 rounded-full animate-ping ${isFlux ? 'bg-emerald-500' : 'bg-brandBlue'}`} />
                <div className={`absolute inset-0 rounded-full ${isFlux ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-brandBlue'}`} />
             </div>
          </div>

          {/* ACTION CLUSTER */}
          <div className="flex gap-1.5 md:gap-2 items-center">
             {onToggleLogViewer && (
                <button 
                  onClick={onToggleLogViewer} 
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border transition-all rounded-sm group btn-tactile
                    ${isDarkMode 
                      ? 'border-brandBlue/20 bg-black/40 text-brandBlue hover:bg-brandRed hover:border-brandRed hover:text-white' 
                      : 'border-brandRed/10 bg-white/20 text-brandBlue hover:bg-brandRed hover:text-white hover:border-brandRed'}
                  `}
                  title="System Trace"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="md:w-4 md:h-4"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
                </button>
             )}
            
             {onToggleSettings && (
                <button
                  onClick={onToggleSettings}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border transition-all rounded-sm group btn-tactile
                    ${isDarkMode
                      ? 'border-brandBlue/20 bg-black/40 text-brandBlue hover:bg-brandYellow hover:text-brandBlue'
                      : 'border-brandRed/10 bg-white/20 text-brandBlue hover:bg-brandBlue hover:text-brandYellow'}
                  `}
                  title="Engine Tuning"
                >
                  <SettingsIcon className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              )}

             <div className={`ml-1 pl-3 md:pl-4 border-l ${isDarkMode ? 'border-white/10' : 'border-brandBlue/10'}`}>
               <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                 <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme || (() => {})} />
               </div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
});