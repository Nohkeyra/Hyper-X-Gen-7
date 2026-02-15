import React, { useRef, useEffect, useState, useCallback } from 'react';

interface GenerationBarProps {
  onGenerate: () => void;
  isProcessing: boolean;
  prompt?: string;
  setPrompt?: (v: string) => void;
  placeholder?: string;
  activePresetName?: string | null;
  children?: React.ReactNode;
  additionalControls?: React.ReactNode;
  refineButton?: React.ReactNode;
  bridgedThumbnail?: string | null;
  onClearBridge?: () => void;
}

export const GenerationBar: React.FC<GenerationBarProps> = ({ 
  onGenerate, 
  isProcessing, 
  prompt, 
  setPrompt, 
  placeholder = "Input synthesis parameters...", 
  activePresetName,
  children, 
  additionalControls, 
  refineButton,
  bridgedThumbnail,
  onClearBridge
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [latticeId, setLatticeId] = useState('');
  const [isThrottled, setIsThrottled] = useState(false);

  useEffect(() => {
    const genId = () => {
      const hex = Math.random().toString(16).substring(2, 8).toUpperCase();
      setLatticeId(`LAT-CORE-${hex}`);
    };
    genId();
    if (isProcessing) {
      const interval = setInterval(genId, 150);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const handleExecute = useCallback(() => {
    if (isProcessing || isThrottled) return;
    setIsThrottled(true);
    onGenerate();
    setTimeout(() => setIsThrottled(false), 2000); 
  }, [isProcessing, isThrottled, onGenerate]);

  return (
    <div className="w-full glass-panel border-t-2 border-brandRed dark:border-brandYellow p-2 md:p-6 z-50 rounded-sm shadow-2xl bg-brandBlue dark:bg-black/80 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Glow Pulse (Dark Only) */}
      <div className="hidden dark:block absolute inset-0 bg-brandRed/5 dark:bg-brandYellow/5 animate-pulse pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-stretch gap-0 border-2 border-brandYellow/30 dark:border-brandYellow bg-white/10 dark:bg-black overflow-hidden shadow-md dark:shadow-[0_0_20px_rgba(255,204,0,0.15)] relative z-10 backdrop-blur-sm">
        
        {/* BRIDGE/CONTROL HUB */}
        <div className="flex-none bg-brandSecondary dark:bg-brandYellow/10 border-b md:border-b-0 md:border-r border-white/20 dark:border-brandYellow/30 px-3 md:px-4 flex items-center py-2 md:py-0 gap-2 md:gap-3">
          {bridgedThumbnail && (
            <div 
              className={`relative w-10 h-10 md:w-12 md:h-12 border-2 ${isProcessing ? 'border-brandBlue dark:border-brandYellow animate-pulse' : 'border-brandRed'} rounded-sm overflow-hidden shrink-0 shadow-lg cursor-pointer group transition-all active:scale-95`}
              onClick={!isProcessing ? onClearBridge : undefined}
            >
              <img src={bridgedThumbnail} className="w-full h-full object-cover" alt="Bridge Source" />
              {!isProcessing && (
                <div className="absolute inset-0 bg-brandRed/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-lg font-black leading-none">×</span>
                </div>
              )}
            </div>
          )}
          <div className="flex-1 md:flex-none">{additionalControls}</div>
        </div>
        
        {/* INPUT CORE */}
        <div className="flex-1 flex min-w-0 items-center bg-transparent relative group">
          {activePresetName && (
            <div className="absolute left-3 -top-2 md:top-auto md:relative md:left-0 md:pl-6 z-10">
              <div className="px-2 md:px-3 py-1 md:py-1.5 bg-brandRed dark:bg-brandYellow text-white dark:text-black text-[7px] md:text-[9px] font-black uppercase italic tracking-widest rounded-sm border border-white/20 shadow-lg flex items-center gap-1.5 md:gap-2 animate-in fade-in slide-in-from-left-2">
                <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isProcessing ? 'bg-white dark:bg-brandRed animate-ping' : 'bg-brandYellow dark:bg-brandRed'}`} />
                DNA_{activePresetName.replace(/\s/g, '_').substring(0, 12)}
              </div>
            </div>
          )}

          <div className="flex-1 flex min-w-0 h-full relative">
            {children || (
              <input
                ref={inputRef}
                type="text"
                value={prompt || ''}
                onChange={e => setPrompt?.(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleExecute()}
                placeholder={placeholder}
                disabled={isProcessing}
                className="w-full px-4 md:px-6 py-4 md:py-5 bg-transparent text-white dark:text-brandYellow font-mono text-xs md:text-base focus:outline-none placeholder-white/40 dark:placeholder-brandYellow/30 min-w-0 caret-brandYellow dark:caret-brandYellow"
              />
            )}
          </div>
          
          {refineButton && <div className="flex items-center pr-2 md:pr-4">{refineButton}</div>}
        </div>

        {/* EXECUTION UNIT */}
        <button
          onClick={handleExecute}
          disabled={isProcessing || isThrottled}
          className={`flex-none px-6 md:px-16 py-4 md:py-5 font-black uppercase text-xs md:text-sm italic tracking-[0.2em] md:tracking-[0.3em] transition-all flex items-center justify-center gap-2 md:gap-3 border-l-2 md:border-l-2 border-white/20 dark:border-brandYellow btn-tactile relative overflow-hidden
            ${(isProcessing || isThrottled)
              ? 'bg-black text-brandYellow cursor-wait shadow-inner' 
              : 'bg-brandYellow dark:bg-brandYellow text-brandBlue dark:text-black hover:brightness-110 shadow-md dark:shadow-neon-yellow'
            }
          `}
        >
          {/* Animated Glint */}
          {!isProcessing && !isThrottled && (
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-200%] animate-[shimmer_3s_infinite]" />
          )}

          {isProcessing ? (
            <>
              <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 md:border-3 border-current border-t-transparent rounded-full animate-spin" />
              <span className="leading-none">SYNTH</span>
            </>
          ) : (
            <span className="relative z-10 leading-none">{isThrottled ? 'BUSY' : 'EXECUTE'}</span>
          )}
        </button>
      </div>
      
      {/* HUD TELEMETRY */}
      <div className="max-w-screen-2xl mx-auto mt-2 md:mt-3 flex justify-between items-center px-1 md:px-2 opacity-60">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isProcessing ? 'bg-brandRed animate-ping' : 'bg-brandYellow dark:bg-brandYellow animate-pulse dark:shadow-neon-yellow'}`} />
            <span className="text-[6px] md:text-[8px] font-black text-white dark:text-brandYellow dark:text-neon-yellow uppercase tracking-[0.15em] md:tracking-[0.2em]">
              {isProcessing ? 'Devour_Active' : 'Lattice_Ready'}
            </span>
          </div>
          <div className="hidden xs:flex items-center gap-1">
             {[1,2,3].map(i => (
               <div key={i} className={`w-0.5 h-2 md:w-1 md:h-3 rounded-full ${isProcessing ? 'bg-brandRed animate-bounce' : 'bg-white/20 dark:bg-brandYellow/20'}`} style={{ animationDelay: `${i*100}ms` }} />
             ))}
          </div>
        </div>
        <span className="text-[6px] md:text-[8px] font-mono text-white dark:text-brandYellow font-black tracking-widest bg-white/10 dark:bg-white/5 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-white/10 dark:border-brandYellow/20">
          {latticeId}
        </span>
      </div>
    </div>
  );
};