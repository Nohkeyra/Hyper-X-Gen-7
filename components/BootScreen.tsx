
import React, { useState, useEffect, useCallback } from 'react';
import { MalaysiaSymbolIcon } from './Icons.tsx';
import { ENV } from '../constants.ts';

interface BootScreenProps {
  onBootComplete: () => void;
  isDarkMode: boolean;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete, isDarkMode }) => {
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [bootProgress, setBootProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const addBootLog = useCallback((message: string) => {
    setBootLog(prev => [...prev, `> ${message}`].slice(-8));
  }, []);

  useEffect(() => {
    const bootSequence = async () => {
      addBootLog("INITIATING: OMEGA_KERNEL");
      setBootProgress(10);
      await new Promise(res => setTimeout(res, 80)); 
      
      addBootLog("SYNCING: MASTER_RULE_HANDSHAKE");
      setBootProgress(30);
      await new Promise(res => setTimeout(res, 100));

      addBootLog("DECRYPTING: LATTICE_PROTOCOLS");
      setBootProgress(55);
      await new Promise(res => setTimeout(res, 120));

      addBootLog("TUNING: GEMINI_SYNTHESIS_ENGINE");
      setBootProgress(70);
      await new Promise(res => setTimeout(res, 100));

      // Removed check for ENV.HF_TOKEN as it's hardcoded to '' and user-managed.
      // The actual HF key validation occurs in App.tsx using localStorage.

      addBootLog("STATUS: MAXIMUM_MODE_ACTIVE");
      setBootProgress(100);
      await new Promise(res => setTimeout(res, 300));
      
      setIsFadingOut(true);
      setTimeout(onBootComplete, 500);
    };
    bootSequence();
  }, [addBootLog, onBootComplete]);

  return (
    <div className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center transition-all duration-500 backdrop-blur-md
      ${isDarkMode ? 'bg-black/90' : 'bg-brandNeutral'}
      ${isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}
    `}>
      {/* SCANNING LINES (Dark Mode Only) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 dark:block hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brandRed/20 to-transparent h-20 animate-scan" />
      </div>

      <div className="relative flex flex-col items-center gap-12 max-w-lg w-full px-12">
        {/* LOGO NODE - Adaptive Color */}
        <div className="relative">
          <div className={`absolute inset-0 rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-brandYellow/10' : 'bg-brandBlue/5'}`} />
          {/* Light Mode: Brand Blue | Dark Mode: Neon Yellow */}
          <MalaysiaSymbolIcon 
            className={`w-80 h-auto relative z-10 transition-colors duration-500
              ${isDarkMode ? 'text-brandYellow drop-shadow-neon-yellow animate-pulse' : 'text-brandBlue drop-shadow-md'}
            `} 
          />
        </div>

        {/* PROGRESS UNIT */}
        <div className="w-full space-y-4">
          <div className="flex justify-between items-end">
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-brandRed uppercase tracking-[0.4em]">Kernel_Boot</span>
               <span className="text-[8px] font-mono text-brandCharcoalMuted dark:text-white/40">V7.6_LOCKED</span>
             </div>
             <span className="text-[14px] font-black text-brandRed font-mono">{bootProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-brandCharcoal/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-brandRed transition-all duration-300 ease-out ${isDarkMode ? 'shadow-neon-red' : ''}`} 
              style={{ width: `${bootProgress}%` }} 
            />
          </div>
        </div>

        {/* DIAGNOSTIC LOG */}
        <div className={`w-full border p-4 rounded-sm font-mono text-[9px] uppercase leading-relaxed
          ${isDarkMode ? 'bg-black/40 border-white/5 text-brandRed/70' : 'bg-white border-brandCharcoal/10 text-brandCharcoalMuted'}
        `}>
          {bootLog.map((log, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">{log}</div>
          ))}
          <div className={`mt-2 flex items-center gap-2 ${isDarkMode ? 'text-brandYellow' : 'text-brandBlue'} animate-pulse`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-brandYellow' : 'bg-brandBlue'}`} />
            <span>Awaiting_Lattice_Sync...</span>
          </div>
        </div>
      </div>
      
      {/* VERSION FOOTER */}
      <div className="absolute bottom-12 text-center">
        <div className="text-[8px] font-black text-brandCharcoalMuted dark:text-white/20 uppercase tracking-[0.5em]">
          Architecture_Omega // Final_Release
        </div>
      </div>
    </div>
  );
};