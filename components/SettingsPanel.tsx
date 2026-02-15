
import React, { useState, useEffect } from 'react';
import { KernelConfig, ImageEngine } from '../types';
import { ENV } from '../constants.ts';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  kernelConfig: KernelConfig;
  onConfigChange: (newConfig: KernelConfig) => void;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, kernelConfig, onConfigChange, addLog }) => {
  const [manualKey, setManualKey] = useState(() => localStorage.getItem('HYPERXGEN_HF_KEY') || '');
  const [showKey, setShowKey] = useState(false);

  // Determine effective key (Manual Override > Env Variable)
  const envKey = ENV.HF_TOKEN;
  const effectiveKey = manualKey.trim() || envKey;
  
  const isHfValid = effectiveKey.startsWith('hf_') && effectiveKey.length > 10;
  const modelId = ENV.HF_MODEL || 'black-forest-labs/FLUX.1-schnell';
  const isFluxDev = modelId.toLowerCase().includes('dev');

  // Persist manual key changes
  useEffect(() => {
    if (manualKey) {
      localStorage.setItem('HYPERXGEN_HF_KEY', manualKey);
    } else {
      localStorage.removeItem('HYPERXGEN_HF_KEY');
    }
  }, [manualKey]);

  if (!isOpen) return null;

  const handleEngineChange = (engine: ImageEngine) => {
    onConfigChange({ ...kernelConfig, imageEngine: engine });
    
    if (engine === ImageEngine.HF) {
        if (isHfValid) {
            addLog(`OMEGA_PIVOT: Image Engine Set to FLUX [ARMED]`, 'success');
        } else {
            addLog('CONFIGURATION_ALERT: FLUX selected but NO VALID KEY detected.', 'error');
        }
    } else {
        addLog(`OMEGA_PIVOT: Image Engine Set to GEMINI [STANDARD]`, 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-brandCharcoal dark:bg-black border-2 border-brandBlue shadow-neon-blue-soft flex flex-col overflow-hidden rounded-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black text-brandYellow uppercase tracking-[0.4em]">Kernel_Configuration</h3>
            <span className="text-[7px] text-white/40 font-black uppercase mt-1">Version: OMEGA_V7.6_FINAL</span>
          </div>
          <button onClick={onClose} className="text-[10px] font-black text-white hover:text-brandRed transition-colors uppercase">Close_X</button>
        </div>
        
        <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          
          {/* Engine Selector */}
          <div>
            <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-3">Synthesis Routing Architecture</h4>
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 border border-white/10 rounded-sm">
              <button 
                onClick={() => handleEngineChange(ImageEngine.GEMINI)}
                className={`flex-1 p-3 text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors flex flex-col items-center gap-1
                  ${kernelConfig.imageEngine === ImageEngine.GEMINI ? 'bg-brandYellow text-brandBlue shadow-neon-yellow' : 'text-white/60 hover:bg-white/10'}`}
              >
                <span>GEMINI (STANDARD)</span>
                {kernelConfig.imageEngine === ImageEngine.GEMINI && <span className="text-[6px] opacity-70 font-mono">NATIVE_MULTIMODAL</span>}
              </button>
              
              <button 
                onClick={() => handleEngineChange(ImageEngine.HF)}
                className={`flex-1 p-3 text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors relative flex flex-col items-center gap-1
                  ${kernelConfig.imageEngine === ImageEngine.HF 
                    ? (isHfValid ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-brandRed text-white shadow-neon-red') 
                    : 'text-white/60 hover:bg-white/10'}
                `}
              >
                <span>HF (FLUX OMEGA)</span>
                {kernelConfig.imageEngine === ImageEngine.HF && (
                  <span className="text-[6px] opacity-70 font-mono bg-black/20 px-1 rounded">
                    {isHfValid ? (isFluxDev ? 'MODE: DEV (MAX_FIDELITY)' : 'MODE: SCHNELL (TURBO)') : 'KEY_MISSING'}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* FLUX CONFIGURATION & OVERRIDE */}
          <div className={`p-4 rounded-sm border transition-all duration-500 overflow-hidden relative
             ${isHfValid 
               ? 'bg-emerald-900/10 border-emerald-500/30' 
               : 'bg-brandRed/5 border-brandRed/20'}
          `}>
            {/* Status Bar */}
            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-2">
              <div className="flex flex-col">
                 <h5 className={`text-[9px] font-black uppercase tracking-widest ${isHfValid ? 'text-emerald-400' : 'text-brandRed'}`}>
                   Flux_Gateway_Status
                 </h5>
                 <span className="text-[7px] font-mono text-white/30 uppercase mt-0.5">Target: {modelId}</span>
              </div>
              <span className={`text-[8px] font-mono px-2 py-1 rounded-sm font-black tracking-wider flex items-center gap-2
                 ${isHfValid ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-brandRed text-white shadow-[0_0_10px_rgba(204,0,1,0.5)]'}
              `}>
                {isHfValid ? 'ARMED_&_READY' : 'MISSING_CREDENTIALS'}
                {isHfValid && <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />}
              </span>
            </div>

            {/* Credential Manager */}
            <div className="space-y-3">
               <div className="flex flex-col gap-1">
                 <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">
                   Hugging_Face_Token (Override)
                 </label>
                 <div className="relative group">
                   <input 
                     type={showKey ? "text" : "password"}
                     value={manualKey}
                     onChange={(e) => setManualKey(e.target.value)}
                     placeholder={envKey ? "Using Environment Variable..." : "Enter key manually (hf_...)"}
                     className={`w-full bg-black/50 border text-[10px] font-mono p-3 outline-none transition-all
                       ${isHfValid 
                         ? 'border-emerald-500/30 text-emerald-400 focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                         : 'border-brandRed/30 text-brandRed focus:border-brandRed focus:shadow-[0_0_15px_rgba(204,0,1,0.2)]'}
                       placeholder:text-white/10
                     `}
                   />
                   <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      {manualKey && (
                        <button 
                          onClick={() => setManualKey('')}
                          className="p-1.5 hover:bg-white/10 rounded text-[8px] text-white/40 font-black uppercase"
                        >
                          CLR
                        </button>
                      )}
                      <button 
                        onClick={() => setShowKey(!showKey)}
                        className="p-1.5 hover:bg-white/10 rounded text-[8px] text-white/40 font-black uppercase"
                      >
                        {showKey ? 'HIDE' : 'SHOW'}
                      </button>
                   </div>
                 </div>
               </div>

               {/* Diagnostics */}
               <div className="flex gap-2 text-[7px] font-mono uppercase">
                  <span className={`px-2 py-1 rounded bg-black/40 border border-white/5 ${envKey ? 'text-emerald-500' : 'text-white/20'}`}>
                    ENV_VAR: {envKey ? 'DETECTED' : 'EMPTY'}
                  </span>
                  <span className={`px-2 py-1 rounded bg-black/40 border border-white/5 ${manualKey ? 'text-emerald-500' : 'text-white/20'}`}>
                    MANUAL: {manualKey ? 'ACTIVE' : 'INACTIVE'}
                  </span>
               </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex justify-end">
            <button onClick={onClose} className="px-8 py-2 bg-white text-black hover:bg-brandYellow hover:text-black text-[10px] font-black uppercase italic tracking-widest shadow-lg transition-all active:scale-95">
              Confirm_Protocol
            </button>
        </div>
      </div>
    </div>
  );
};
