

import React from 'react';

interface PresetCardProps {
  name: string;
  description: string;
  prompt?: string;
  isActive: boolean;
  onClick: () => void;
  iconChar: string;
}

export const PresetCard: React.FC<PresetCardProps> = ({ name, description, prompt, isActive, onClick, iconChar }) => (
  <button 
    onClick={onClick} 
    className={`w-full p-3 flex flex-col transition-all duration-300 rounded-sm text-left relative overflow-hidden group border-2 will-change-transform
      ${isActive 
        ? 'bg-brandBlue text-white border-brandBlue shadow-lg scale-[1.02] dark:bg-black dark:border-brandYellow dark:text-brandYellow dark:box-glow-intense-yellow' 
        : 'bg-white border-brandCharcoal/10 text-brandCharcoal hover:border-brandBlue hover:text-brandBlue dark:bg-white/10 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/20 dark:hover:border-white/30'
      }
    `}
  >
    {/* Active State Scanner Overlay (Dark Mode Only) */}
    {isActive && (
      <div className="hidden dark:block absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_2px,rgba(255,204,0,0.3)_2px)] bg-[length:100%_4px] animate-scan" />
    )}

    <div className="flex items-center gap-3 w-full relative z-10">
      <div className={`shrink-0 w-8 h-8 flex items-center justify-center font-black text-[10px] rounded-sm transition-all duration-300
        ${isActive 
          ? 'bg-white text-brandBlue dark:bg-brandYellow dark:text-black dark:shadow-[0_0_15px_rgba(255,204,0,0.8)]' 
          : 'bg-brandCharcoal/5 text-brandCharcoal group-hover:bg-brandBlue group-hover:text-white dark:bg-brandBlue/10 dark:text-brandBlue dark:group-hover:bg-brandBlue dark:group-hover:text-white dark:group-hover:shadow-neon-red'
        }
      `}>
        {iconChar}
      </div>
      
      <div className="min-w-0 flex-1">
        <h4 className={`text-[10px] font-black uppercase truncate leading-tight transition-colors tracking-widest
          ${isActive 
            ? 'text-white dark:text-brandYellow dark:text-neon-yellow' 
            : 'text-brandCharcoal dark:text-white/80 group-hover:text-brandBlue dark:group-hover:text-brandBlue'
          }
        `}>
          {name}
        </h4>
        {!isActive && <div className={`h-[1px] transition-all duration-500 mt-0.5 ${isActive ? 'bg-white/40 w-full' : 'bg-brandCharcoal/10 w-4 group-hover:w-8 group-hover:bg-brandBlue dark:bg-white/20'}`} />}
      </div>

      {isActive && (
        <div className="flex-none animate-in fade-in zoom-in duration-300">
           <span className="text-[7px] font-black bg-white text-brandBlue dark:bg-brandYellow dark:text-black px-2 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm">LOCKED</span>
        </div>
      )}
    </div>

    {isActive && (
      <div className="mt-3 pt-3 border-t border-white/20 dark:border-brandYellow/40 space-y-2 animate-in slide-in-from-top-2 duration-300 w-full">
        <p className="text-[9px] font-bold leading-relaxed uppercase italic text-white/90 dark:text-brandYellow/80 text-shadow-sm">
          {description}
        </p>
        {prompt && (
          <div className="bg-black/20 dark:bg-brandYellow/10 p-2 rounded-sm border border-white/20 dark:border-brandYellow/30">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[7px] text-white dark:text-brandYellow uppercase tracking-widest font-black">Kernel_Prompt</span>
              <div className="w-1.5 h-1.5 bg-white dark:bg-brandYellow rounded-full animate-ping" />
            </div>
            <p className="text-[8px] font-mono text-white/80 dark:text-brandYellow/90 leading-tight break-words">
              {prompt}
            </p>
          </div>
        )}
      </div>
    )}
  </button>
);