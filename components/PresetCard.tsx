
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
        ? 'bg-brandRed border-brandRed text-white shadow-[0_4px_12px_rgba(253,30,74,0.3)] z-10 dark:bg-black dark:border-brandYellow dark:text-brandYellow dark:shadow-neon-yellow' 
        : 'bg-white/5 border-white/5 text-brandNeutral hover:bg-white/10 hover:border-brandRed/30 dark:bg-brandYellow dark:border-brandYellow dark:text-black dark:hover:bg-brandYellow/90'
      }
    `}
  >
    <div className="flex items-center gap-3 w-full">
      <div className={`shrink-0 w-8 h-8 flex items-center justify-center font-black text-[10px] rounded-sm transition-all duration-300
        ${isActive 
          ? 'bg-white text-brandRed scale-105 shadow-sm dark:bg-brandYellow dark:text-black' 
          : 'bg-brandRed/10 text-brandRed group-hover:bg-brandRed group-hover:text-white dark:bg-black/20 dark:text-black'
        }
      `}>
        {iconChar}
      </div>
      
      <div className="min-w-0 flex-1 relative z-10">
        <h4 className={`text-[10px] font-black uppercase truncate leading-tight transition-colors tracking-widest
          ${isActive 
            ? 'text-white dark:text-brandYellow' 
            : 'text-brandCharcoal dark:text-black'
          }
        `}>
          {name}
        </h4>
        {!isActive && <div className={`h-[1px] transition-all duration-500 mt-0.5 ${isActive ? 'bg-white/40 w-full dark:bg-brandYellow/40' : 'bg-brandRed/20 w-4 group-hover:w-8 dark:bg-black/20'}`} />}
      </div>

      {isActive && (
        <div className="flex-none animate-in fade-in zoom-in duration-300">
           <span className="text-[7px] font-black bg-white/20 dark:bg-brandYellow/20 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Active</span>
        </div>
      )}
    </div>

    {isActive && (
      <div className="mt-3 pt-3 border-t border-white/20 dark:border-brandYellow/20 space-y-2 animate-in slide-in-from-top-2 duration-300 w-full">
        <p className={`text-[9px] font-bold leading-relaxed uppercase italic ${isActive ? 'text-white/80 dark:text-brandYellow/80' : ''}`}>
          {description}
        </p>
        {prompt && (
          <div className="bg-black/30 dark:bg-black/60 p-2 rounded-sm border border-white/5 dark:border-brandYellow/20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[7px] text-white/40 dark:text-brandYellow/40 uppercase tracking-widest font-black">Kernel_Prompt</span>
              <div className="w-1 h-1 bg-brandYellow rounded-full animate-pulse shadow-neon-yellow" />
            </div>
            <p className="text-[8px] font-mono text-brandYellow/90 leading-tight break-words">
              {prompt}
            </p>
          </div>
        )}
      </div>
    )}
  </button>
);
