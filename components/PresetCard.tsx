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
        ? 'bg-brandBlue border-brandYellow text-brandYellow shadow-neon-blue-soft z-10 dark:bg-black dark:border-brandYellow dark:text-brandYellow dark:shadow-neon-yellow-soft' 
        : 'bg-brandDeep dark:bg-black/20 border-white/10 dark:border-white/10 text-brandCharcoalMuted dark:text-white/60 hover:bg-brandBlue/5 dark:hover:bg-white/5'
      }
    `}
  >
    <div className="flex items-center gap-3 w-full">
      <div className={`shrink-0 w-8 h-8 flex items-center justify-center font-black text-[10px] rounded-sm transition-all duration-300
        ${isActive 
          ? 'bg-white text-brandBlue scale-105 shadow-sm dark:bg-brandYellow dark:text-black' 
          : 'bg-brandBlue/10 text-brandBlue group-hover:bg-brandBlue group-hover:text-white dark:bg-white/10 dark:text-white'
        }
      `}>
        {iconChar}
      </div>
      
      <div className="min-w-0 flex-1 relative z-10">
        <h4 className={`text-[10px] font-black uppercase truncate leading-tight transition-colors tracking-widest
          ${isActive 
            ? 'text-brandYellow dark:text-brandYellow' 
            : 'text-brandCharcoal dark:text-white'
          }
        `}>
          {name}
        </h4>
        {!isActive && <div className={`h-[1px] transition-all duration-500 mt-0.5 ${isActive ? 'bg-brandYellow/40 w-full dark:bg-brandYellow/40' : 'bg-brandBlue/20 w-4 group-hover:w-8 dark:bg-white/20'}`} />}
      </div>

      {isActive && (
        <div className="flex-none animate-in fade-in zoom-in duration-300">
           <span className="text-[7px] font-black bg-white/20 dark:bg-brandYellow/20 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Active</span>
        </div>
      )}
    </div>

    {isActive && (
      <div className="mt-3 pt-3 border-t border-brandYellow/20 dark:border-brandYellow/20 space-y-2 animate-in slide-in-from-top-2 duration-300 w-full">
        <p className={`text-[9px] font-bold leading-relaxed uppercase italic ${isActive ? 'text-brandYellow/80 dark:text-brandYellow/80' : ''}`}>
          {description}
        </p>
        {prompt && (
          <div className="bg-black/30 dark:bg-black/60 p-2 rounded-sm border border-brandYellow/20 dark:border-brandYellow/20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[7px] text-brandYellow/40 dark:text-brandYellow/40 uppercase tracking-widest font-black">Kernel_Prompt</span>
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