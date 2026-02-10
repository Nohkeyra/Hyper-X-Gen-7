
import React, { memo } from 'react';
import { ThemeToggle } from './PanelShared';

interface PanelHeaderProps {
  title?: string;
  onBack?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onToggleLogViewer?: () => void; 
  latticeStatus?: 'IDLE' | 'SYNCED' | 'DRIFT' | 'LOCKED';
}

export const PanelHeader: React.FC<PanelHeaderProps> = memo(({ 
  title = "HYPERXGEN", 
  onBack = () => {}, 
  isDarkMode,
  onToggleTheme,
  onToggleLogViewer,
  latticeStatus = 'IDLE'
}) => {
  return (
    <header className={`fixed top-0 left-0 right-0 h-[var(--header-h)] ${isDarkMode ? 'bg-brandDeep' : 'bg-brandBlue'} flex z-[100] border-b border-white/5 shadow-2xl backdrop-blur-xl bg-opacity-95 transition-all duration-300 panel-header-with-glow select-none`}>
      <div className="w-full max-w-[1400px] mx-auto flex flex-row items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-3 md:gap-6 min-w-0">
          <button onClick={onBack} className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0">
            <div className="relative w-3 h-3 md:w-4 md:h-4">
               <div className={`absolute inset-0 ${isDarkMode ? 'bg-brandRed' : 'bg-brandYellow'} rounded-full animate-ping opacity-30`}></div>
               <div className={`relative w-3 h-3 md:w-4 md:h-4 ${isDarkMode ? 'bg-brandRed' : 'bg-brandYellow'} rounded-full shadow-[0_0_12px_rgba(255,204,0,1)] flex items-center justify-center`}>
                 <div className={`w-0.5 h-0.5 md:w-1 md:h-1 ${isDarkMode ? 'bg-white' : 'bg-brandBlue'} rounded-full`}></div>
               </div>
            </div>
            <div className="flex flex-col items-start leading-none min-w-0">
              <div className="font-black text-xs md:text-sm tracking-[0.15em] md:tracking-[0.25em] text-white uppercase italic group-hover:text-brandYellow transition-colors duration-300 truncate">
                {title}
              </div>
              <span className={`text-[6px] md:text-[7px] font-black ${isDarkMode ? 'text-brandRed' : 'text-brandYellow'} tracking-[0.1em] opacity-80 uppercase mt-0.5 hidden xs:block`}>OMEGA_CORE_ACTIVE</span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          {/* Lattice Bridge Status */}
          <div className="hidden sm:flex items-center gap-3 px-4 border-x border-white/10 h-8">
             <div className="flex flex-col items-end leading-none">
                <span className="text-[6px] font-black text-white/30 uppercase tracking-widest">Lattice_Bridge</span>
                <span className={`text-[8px] font-black uppercase italic ${latticeStatus === 'SYNCED' ? 'text-brandYellow' : 'text-white/40'}`}>
                  {latticeStatus}
                </span>
             </div>
             <div className={`w-1.5 h-1.5 rounded-full ${latticeStatus === 'SYNCED' ? 'bg-brandYellow animate-pulse' : 'bg-white/10'}`} />
          </div>

          <div className="flex gap-1 md:gap-2 items-center">
             {onToggleLogViewer && (
                <button 
                  onClick={onToggleLogViewer} 
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-white/10 bg-white/5 text-white hover:border-brandRed hover:text-brandRed transition-all rounded-sm group shadow-sm hover:shadow-lg" 
                  title="View System Logs"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-y-px transition-transform md:w-[18px] md:h-[18px]"><path d="M12 20h9M12 4h9M4 12h17M4 12l-3-3m3 3l-3 3"/></svg>
                </button>
             )}

             {onToggleTheme && (
                <div className="ml-1 md:ml-2 border-l border-white/10 pl-2 md:pl-4">
                  <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
                </div>
             )}
          </div>
        </div>
      </div>
    </header>
  );
});
