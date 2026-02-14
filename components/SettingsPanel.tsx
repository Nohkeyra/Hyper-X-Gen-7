import React from 'react';
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
  if (!isOpen) return null;

  const isHfKeyConfigured = ENV.HUGGING_FACE_API_KEY && ENV.HUGGING_FACE_API_KEY !== 'PLACEHOLDER_HF_KEY';

  const handleEngineChange = (engine: ImageEngine) => {
    if (engine === ImageEngine.HF && !isHfKeyConfigured) {
      addLog('HF_ENGINE_DISABLED: API key not configured in .env.local', 'warning');
      return;
    }
    onConfigChange({ ...kernelConfig, imageEngine: engine });
    addLog(`IMAGE_ENGINE_SWITCH: Set to ${engine.toUpperCase()}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-brandCharcoal dark:bg-black border-2 border-brandBlue shadow-[20px_20px_0px_0px_rgba(0,50,160,0.3)] dark:shadow-[20px_20px_0px_0px_rgba(255,204,0,0.3)] flex flex-col overflow-hidden rounded-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <h3 className="text-[10px] font-black text-brandYellow uppercase tracking-[0.4em]">Kernel_Configuration</h3>
          <button onClick={onClose} className="text-[10px] font-black text-white hover:text-brandRed transition-colors uppercase">Close_X</button>
        </div>
        
        <div className="p-6 space-y-8">
          <div>
            <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-3">Image Generation Engine</h4>
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 border border-white/10 rounded-sm">
              <button 
                onClick={() => handleEngineChange(ImageEngine.GEMINI)}
                className={`flex-1 p-3 text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors ${kernelConfig.imageEngine === ImageEngine.GEMINI ? 'bg-brandYellow text-brandBlue' : 'text-white/60 hover:bg-white/10'}`}
              >
                Gemini
              </button>
              <button 
                onClick={() => handleEngineChange(ImageEngine.HF)}
                disabled={!isHfKeyConfigured}
                className={`flex-1 p-3 text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors relative
                  ${kernelConfig.imageEngine === ImageEngine.HF ? 'bg-brandYellow text-brandBlue' : 'text-white/60'}
                  ${isHfKeyConfigured ? 'hover:bg-white/10' : 'opacity-40 cursor-not-allowed'}
                `}
                title={!isHfKeyConfigured ? "Requires environment configuration" : "Switch to Hugging Face Engine"}
              >
                HF Engine
                {!isHfKeyConfigured && <div className="absolute top-1 right-1 text-[6px] font-bold text-black bg-brandRed px-1 rounded-full">LOCKED</div>}
              </button>
            </div>
            <p className="text-[8px] text-white/40 mt-2 px-1">
              Select the core synthesis model. Gemini is fast and supports all features. The HF engine is an experimental alternative (text-to-image only).
            </p>
          </div>

          {!isHfKeyConfigured && (
             <div className="animate-in fade-in duration-300 p-3 bg-brandRed/10 border border-brandRed/20 rounded-sm">
              <h5 className="text-[9px] font-black text-brandRed uppercase tracking-widest mb-1">HF Engine Not Configured</h5>
              <p className="text-[9px] text-white/60 leading-tight">
                To enable the HF Engine, add your Hugging Face API key to the `.env.local` file in the project directory and restart the application. For security, keys cannot be entered directly in the app.
              </p>
            </div>
          )}

          {kernelConfig.imageEngine === ImageEngine.HF && isHfKeyConfigured && (
            <div className="animate-in fade-in duration-300 p-3 bg-brandBlue/10 border border-brandBlue/20 rounded-sm">
              <p className="text-[9px] text-white/60 leading-tight">
                The HF engine is active and using the pre-configured Hugging Face API key from your environment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};