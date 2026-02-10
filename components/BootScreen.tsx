import React, { useState, useEffect, useCallback } from 'react';
import { NIcon, BoxIcon, StarIcon } from './Icons.tsx';

interface BootScreenProps {
  onBootComplete: () => void;
  isDarkMode: boolean;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete, isDarkMode }) => {
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStatus, setBootStatus] = useState("INITIATING_CORE_BOOT");

  const addBootLog = useCallback((message: string) => {
    setBootLog(prev => [...prev, message].slice(-5));
  }, []);

  useEffect(() => {
    const bootSequence = async () => {
      addBootLog("INITIATING: OMEGA_KERNEL_BOOT");
      setBootProgress(20);
      await new Promise(res => setTimeout(res, 100)); // Fast path
      
      addBootLog("LATTICE_INTEGRITY_CHECK: 100%_OK");
      setBootProgress(50);
      await new Promise(res => setTimeout(res, 100));

      addBootLog("MASTER_RULES_LOADED: STATUS_OBEY");
      setBootProgress(80);
      await new Promise(res => setTimeout(res, 100));

      addBootLog("PROTOCOL: OMEGA_V7.6_FINAL_ACTIVE");
      setBootProgress(100);
      setBootStatus("SYSTEM_READY");
      await new Promise(res => setTimeout(res, 200));
      
      onBootComplete();
    };
    bootSequence();
  }, [addBootLog, onBootComplete]);

  return (
    <div className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center transition-colors duration-500
      ${isDarkMode ? 'bg-brandDeep text-white' : 'bg-brandNeutral text-brandCharcoal'}`}
    >
      <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-brandRed rounded-full animate-ping" />
          <span className="text-[7px] font-black uppercase text-brandRed tracking-widest">HYPERXGEN</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[7px] font-black uppercase text-brandCharcoalMuted dark:text-white/40 tracking-widest">5G</span>
          <div className="w-0.5 h-3 bg-brandCharcoal/20 dark:bg-white/20" />
          <span className="text-[7px] font-black uppercase text-brandYellow tracking-widest">100%</span>
          <div className="w-1.5 h-1.5 bg-brandYellow rounded-full" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 max-w-lg w-full px-4 text-center relative">
        <div className="absolute top-16 left-0 flex flex-col items-start leading-none">
          <span className="text-[7px] font-black text-brandRed tracking-[0.1em] opacity-80 uppercase">OMEGA_CORE_LOCKED</span>
          <span className="text-[9px] font-black uppercase text-brandCharcoalMuted dark:text-white/40 tracking-wider">Stability_Core</span>
        </div>

        <NIcon className="w-48 h-48 sm:w-64 sm:h-64 text-brandCharcoal dark:text-white mb-8 opacity-20 animate-pulse" style={{ animationDuration: '2s' }} />
        
        <div className="absolute bottom-16 right-0 text-right">
          <span className="text-[7px] font-bold text-brandCharcoal dark:text-white/50 uppercase tracking-widest">Engine_v7.6_Final</span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-brandCharcoal dark:text-white italic uppercase leading-none mt-1">HYPERXGEN</h1>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 flex items-center justify-between px-4 sm:px-6 border-t-2 border-brandCharcoal/20 dark:border-white/10">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center group cursor-default">
            <BoxIcon className="w-6 h-6 text-brandCharcoal dark:text-white/60 group-hover:text-brandRed transition-colors" />
            <span className="text-[7px] font-bold uppercase text-brandCharcoal dark:text-white/40">History</span>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <StarIcon className="w-6 h-6 text-brandCharcoal dark:text-white/60 group-hover:text-brandYellow transition-colors" />
            <span className="text-[7px] font-bold uppercase text-brandCharcoal dark:text-white/40">Vault</span>
          </div>
        </div>

        <button 
          className="px-4 sm:px-6 py-2 bg-brandRed text-white text-[9px] font-black uppercase italic tracking-widest shadow-[4px_4px_0px_0px_rgba(204,0,1,0.3)] opacity-70 cursor-default rounded-sm"
        >
          MAXIMUM_MODE
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-brandBlue/20 dark:bg-white/10">
        <div 
          className="h-full bg-brandRed transition-all duration-300 ease-out" 
          style={{ width: `${bootProgress}%` }} 
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 px-6 py-4 border border-brandRed/30 shadow-lg text-white font-mono text-[9px] uppercase tracking-wider backdrop-blur-md rounded-sm animate-in fade-in duration-300">
        {bootLog.map((log, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 ${log.includes('MASTER') ? 'bg-brandYellow' : 'bg-brandRed'} rounded-full animate-ping`} />
            <span className={log.includes('MASTER') ? 'text-brandYellow font-black' : 'text-brandRed'}>{log}</span>
          </div>
        ))}
        {bootStatus !== "SYSTEM_READY" && (
            <div className="flex items-center gap-2 mt-2 text-brandYellow animate-pulse">
                <div className="w-1.5 h-1.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>SYNCING_LATTICE... {bootProgress}%</span>
            </div>
        )}
      </div>
    </div>
  );
};