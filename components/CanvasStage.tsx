import React, { useEffect, useRef, useState } from "react"
import { CanvasFloatingControls } from './PanelShared.tsx';
import { UploadIcon, UndoIcon, RedoIcon } from './Icons.tsx';
import { ImageEngine } from '../types.ts';

export interface CanvasStageProps {
  imageUrl?: string; 
  uploadedImage?: string | null;
  generatedOutput?: string | null;
  isProcessing?: boolean;
  hudContent?: React.ReactNode;
  onClear?: () => void;
  onFileUpload?: (file: File) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onGenerate?: () => void;
  downloadFilename?: string;
  bridgeSource?: string | null;
  isValidationError?: boolean;
  uiRefined?: boolean;
  activeEngine?: ImageEngine; 
}

export const CanvasStage: React.FC<CanvasStageProps> = ({ 
  imageUrl, uploadedImage, generatedOutput, isProcessing, hudContent,
  onClear, onFileUpload, onUndo, onRedo, canUndo, canRedo, downloadFilename,
  bridgeSource, isValidationError, activeEngine = 'gemini'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const displayImage = generatedOutput || uploadedImage || imageUrl;
  const isFlux = activeEngine === 'hf';

  const theme = isFlux ? {
    border: 'border-emerald-500',
    text: 'text-emerald-500',
    bg: 'bg-emerald-500',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    gradient: 'from-emerald-500/10 to-transparent'
  } : {
    border: 'border-brandBlue',
    text: 'text-brandBlue',
    bg: 'bg-brandBlue',
    glow: 'shadow-[0_0_20px_rgba(0,50,160,0.15)]',
    gradient: 'from-brandBlue/10 to-transparent'
  };

  useEffect(() => {
    if (!displayImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = displayImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      ctx.drawImage(img, 0, 0);
    };
  }, [displayImage]);

  return (
    <div className="w-full max-w-2xl mx-auto relative group perspective-1000 my-2">
       <div className={`absolute -inset-[1px] rounded-xl blur-xl transition-all duration-1000 opacity-20 ${theme.bg} ${isProcessing ? 'animate-pulse opacity-50 scale-[1.01]' : ''}`} />

       <div className={`relative bg-[#09090b] dark:bg-[#050505] rounded-xl overflow-hidden transition-all duration-500 ${isValidationError ? 'ring-2 ring-brandRed shadow-[0_0_30px_rgba(204,0,1,0.3)]' : 'ring-1 ring-white/10'} ${theme.glow} shadow-2xl flex flex-col`}>
          
          <div className="h-9 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 shrink-0 relative overflow-hidden">
             <div className={`absolute top-0 left-0 bottom-0 w-1/3 bg-gradient-to-r ${theme.gradient} skew-x-12 opacity-20 animate-[shimmer_3s_infinite] pointer-events-none`} />
             
             <div className="flex items-center gap-3 relative z-10">
                <div className="flex items-center gap-1.5">
                   <div className={`w-1.5 h-1.5 rounded-sm ${theme.bg} ${isProcessing ? 'animate-ping' : ''}`} />
                   <div className={`w-1.5 h-1.5 rounded-sm ${theme.bg} opacity-50`} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] font-mono ${theme.text}`}>
                   {isFlux ? 'FLUX_OMEGA_KERNEL' : 'GEMINI_NEURAL_LINK'}
                </span>
             </div>

             <div className="flex items-center gap-4 relative z-10">
                <span className="hidden sm:block text-[7px] font-mono text-white/30 uppercase tracking-widest">
                   {isProcessing ? '>>> SYNCING_LATTICE' : '/// SYSTEM_READY'}
                </span>
                <div className="flex gap-0.5">
                   {[1,2,3,4].map(i => <div key={i} className={`w-0.5 h-2 rounded-full ${i===4 ? theme.bg : 'bg-white/10'}`} />)}
                </div>
             </div>
          </div>

          <div className="relative p-1 md:p-1 flex-1 bg-black/50">
             <div className="absolute inset-0 pointer-events-none z-20 p-4">
                <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${theme.border} rounded-tl-md transition-colors duration-500`} />
                <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${theme.border} rounded-tr-md transition-colors duration-500`} />
                <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${theme.border} rounded-bl-md transition-colors duration-500`} />
                <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${theme.border} rounded-br-md transition-colors duration-500`} />
             </div>

             <div className="relative w-full h-full bg-[#020202] rounded-lg overflow-hidden border border-white/5 shadow-inner">
                <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                <div className={`absolute inset-0 pointer-events-none z-30 bg-radial-gradient from-transparent to-black/40 opacity-60`} />

                <div className={`relative w-full overflow-hidden flex items-center justify-center transition-all duration-700 ${displayImage ? 'aspect-square' : 'aspect-[16/10]'}`}>
                   <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:32px_32px]" />

                   <div className="absolute inset-0 z-10 opacity-50 pointer-events-none mix-blend-screen">
                     {hudContent}
                   </div>

                   {/* PROCESSING LASER SCAN EFFECT */}
                   {isProcessing && (
                     <div className="absolute inset-0 z-40 pointer-events-none">
                        <div className={`absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent animate-[scan_2s_infinite_linear] ${theme.text}`} style={{ boxShadow: '0 0 15px currentColor' }} />
                        <div className="absolute inset-0 bg-white/[0.02] animate-pulse" />
                     </div>
                   )}

                   {displayImage ? (
                     <canvas 
                       ref={canvasRef} 
                       className={`relative z-20 block mx-auto transition-all duration-1000 max-h-[500px] object-contain ${isProcessing ? 'opacity-40 blur-[2px] grayscale-[0.5] scale-95' : 'opacity-100 scale-100'}`}
                     />
                   ) : !isProcessing && (
                     <div className="relative z-20 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700 group/upload">
                        <label className="cursor-pointer">
                           <div className={`w-14 h-14 md:w-16 md:h-16 bg-white/5 border border-white/10 border-dashed rounded-full flex items-center justify-center transition-all duration-500 relative overflow-hidden backdrop-blur-md group-hover/upload:border-opacity-100
                              ${isFlux 
                                ? 'dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover/upload:bg-emerald-500/10 group-hover/upload:border-emerald-500 dark:group-hover/upload:shadow-[0_0_35px_rgba(16,185,129,0.5)]' 
                                : 'dark:shadow-[0_0_20px_rgba(0,50,160,0.2)] group-hover/upload:bg-brandBlue/10 group-hover/upload:border-brandBlue dark:group-hover/upload:shadow-[0_0_30px_rgba(0,50,160,0.5)]'
                              }
                           `}>
                             <div className={`absolute inset-0 opacity-0 group-hover/upload:opacity-100 transition-opacity bg-gradient-to-t ${theme.gradient}`} />
                             <UploadIcon className={`w-6 h-6 text-white/60 transition-all duration-300 group-hover/upload:scale-110 group-hover/upload:text-white 
                                ${isFlux ? 'dark:group-hover/upload:text-emerald-400' : 'dark:group-hover/upload:text-brandYellow'} relative z-10`} />
                           </div>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f && onFileUpload) onFileUpload(f); }} />
                        </label>
                        <div className="text-center space-y-0.5">
                          <span className={`text-[8px] font-black uppercase tracking-[0.3em] block transition-colors ${theme.text} dark:drop-shadow-sm`}>Inject_Buffer</span>
                          {bridgeSource && (
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full animate-pulse mt-1`}>
                               <div className={`w-1 h-1 rounded-full ${theme.bg}`} />
                               <p className="text-[6px] font-mono text-white/60 uppercase">SRC: {bridgeSource}</p>
                            </div>
                          )}
                        </div>
                     </div>
                   )}

                   {isProcessing && (
                     <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70] animate-in fade-in duration-300">
                        <div className="flex flex-col items-center gap-6">
                           <div className="relative w-16 h-16">
                             <div className={`absolute inset-0 border-2 rounded-full border-white/10`} />
                             <div className={`absolute inset-0 border-t-2 rounded-full animate-spin ${theme.border}`} style={{ animationDuration: '0.8s' }} />
                             <div className={`absolute inset-[35%] rounded-full animate-pulse ${theme.bg}`} />
                           </div>
                           <div className={`flex flex-col items-center gap-1`}>
                             <span className={`text-[9px] font-black uppercase tracking-[0.3em] animate-pulse ${theme.text}`}>
                               {isFlux ? 'FLUX_DIFFUSION' : 'GEMINI_SYNTHESIS'}
                             </span>
                           </div>
                        </div>
                     </div>
                   )}

                   {displayImage && onClear && (
                     <CanvasFloatingControls onClear={onClear} onDownload={() => {
                        if (!displayImage) return;
                        const link = document.createElement('a');
                        link.download = downloadFilename || `hyperxgen_artifact_${Date.now()}.png`;
                        link.href = displayImage;
                        link.click();
                     }} />
                   )}

                   {(onUndo || onRedo) && displayImage && !isProcessing && (
                     <div className="absolute bottom-6 left-6 z-50 flex gap-2">
                        <button 
                          onClick={onUndo} 
                          disabled={!canUndo} 
                          className="btn-tactile w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-md text-white rounded-full border border-white/10 hover:border-white/30 disabled:opacity-20 transition-all shadow-lg"
                        >
                          <UndoIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={onRedo} 
                          disabled={!canRedo} 
                          className="btn-tactile w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-md text-white rounded-full border border-white/10 hover:border-white/30 disabled:opacity-20 transition-all shadow-lg"
                        >
                          <RedoIcon className="w-4 h-4" />
                        </button>
                     </div>
                   )}
                </div>
             </div>
          </div>

          <div className="h-6 bg-[#020202] border-t border-white/5 flex items-center justify-between px-4 shrink-0">
             <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">RES: 1024x1024 // MODE: {isFlux ? 'LATENT_DIFFUSION' : 'MULTIMODAL_V3'}</span>
             <span className={`text-[7px] font-black uppercase tracking-wider ${theme.text} ${isProcessing ? 'animate-pulse' : 'opacity-60'}`}>
               {isProcessing ? 'PROCESSING...' : 'IDLE'}
             </span>
          </div>
       </div>
    </div>
  );
};

export default CanvasStage;
