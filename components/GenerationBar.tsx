
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
  placeholder = "Describe synthesis parameters...", 
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
    const generateId = () => {
      const hex = Math.random().toString(16).substring(2, 8).toUpperCase();
      setLatticeId(`LAT_${hex}`);
    };
    generateId();
    if (isProcessing) {
      const interval = setInterval(generateId, 100);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const handleExecute = useCallback(() => {
    if (isProcessing || isThrottled) return;
    
    // SPEED OPTIMIZATION: Hardware throttle to prevent 429 flood
    setIsThrottled(true);
    onGenerate();
    
    setTimeout(() => {
      setIsThrottled(false);
    }, 1500); // 1.5s cool-down between atomic requests
  }, [isProcessing, isThrottled, onGenerate]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleExecute();
  };

  return (
    <div className={`w-full border-t-2 transition-colors duration-500 border-brandRed dark:border-brandYellow bg-brandNeutral dark:bg-brandDeep shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50 rounded-sm py-2 px-3 md:py-4 md:px-6`}>
      <div className={`max-w-screen-2xl mx-auto flex flex-col md:flex-row items-stretch gap-0 border-2 transition-all duration-500 border-brandCharcoal dark:border-brandYellow/30 shadow-[2px_2px_0px_0px_#CC0001] dark:shadow-[4px_4px_0px_0px_#FFCC00] bg-white dark:bg-black/60 overflow-hidden`}>
        
        <div className="flex-none bg-brandCharcoal/5 dark:bg-white/5 border-b md:border-b-0 md:border-r border-brandCharcoal dark:border-brandYellow/20 px-2 md:px-4 flex items-center py-2 md:py-0 gap-2">
          {bridgedThumbnail && !isProcessing && (
            <div 
              className="relative w-10 h-10 border-2 border-brandRed dark:border-brandYellow rounded-sm overflow-hidden shrink-0 shadow-lg cursor-pointer group/bridge"
              onClick={onClearBridge}
            >
              <img src={bridgedThumbnail} className="w-full h-full object-cover opacity-80" alt="Bridge" />
              <div className="absolute inset-0 bg-brandRed/60 flex items-center justify-center opacity-0 group-hover/bridge:opacity-100 transition-opacity">
                <span className="text-white text-lg font-black">×</span>
              </div>
            </div>
          )}
          {additionalControls}
        </div>
        
        <div className="flex-1 flex min-w-0 items-center bg-transparent">
          {activePresetName && (
            <div className="flex-none pl-3 md:pl-4 py-1">
              <div className={`px-2.5 py-1.5 bg-brandBlue dark:bg-black text-white dark:text-brandYellow border-brandBlue/50 dark:border-brandYellow/50 text-[8px] md:text-[9px] font-black uppercase italic tracking-widest rounded-sm border flex items-center gap-1.5 whitespace-nowrap transition-all duration-500`}>
                <div className={`w-1.5 h-1.5 bg-white dark:bg-brandYellow rounded-full ${isProcessing ? 'animate-ping' : ''}`} />
                <span className="opacity-70">DNA:</span> {activePresetName}
              </div>
            </div>
          )}

          <div className="flex-1 flex min-w-0 relative h-full">
            {children || (
              <input
                ref={inputRef}
                type="text"
                value={prompt || ''}
                onChange={e => setPrompt && setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                disabled={isProcessing}
                className={`w-full px-3 py-3 md:px-5 md:py-4 bg-transparent text-brandCharcoal dark:text-brandYellow font-mono text-xs md:text-sm focus:outline-none placeholder-brandCharcoalMuted/40 dark:placeholder-white/30 min-w-0 caret-brandRed dark:caret-brandYellow`}
              />
            )}
            
            {refineButton && <div className="flex items-center px-1 md:px-2">{refineButton}</div>}
          </div>
        </div>

        <button
          type="button"
          onClick={handleExecute}
          disabled={isProcessing || isThrottled}
          className={`flex-none px-6 py-3 md:px-10 md:py-4 font-black uppercase text-[10px] md:text-[11px] italic tracking-[0.15em] md:tracking-[0.25em] transition-all flex items-center justify-center border-l border-brandCharcoal/10 dark:border-brandYellow/20
            ${(isProcessing || isThrottled)
              ? 'bg-black text-brandYellow cursor-wait' 
              : 'bg-brandBlue dark:bg-brandYellow text-white dark:text-black hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5'
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>LOCKED</span>
            </div>
          ) : (
            <span>{isThrottled ? 'COOLDOWN' : 'EXECUTE'}</span>
          )}
        </button>
      </div>
      
      <div className="max-w-screen-2xl mx-auto mt-1.5 flex justify-between items-center px-1 opacity-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-1 h-1 rounded-full ${isProcessing ? 'bg-brandYellow animate-pulse' : 'bg-brandYellow'}`} />
            <span className="text-[7px] font-black text-brandCharcoalMuted dark:text-white/40 uppercase tracking-widest">
              LATTICE_SYNC_OK
            </span>
          </div>
        </div>
        <span className={`text-[6px] font-mono text-brandRed dark:text-brandYellow font-black tracking-widest`}>{latticeId}</span>
      </div>
    </div>
  );
};
