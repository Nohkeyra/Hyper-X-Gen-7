import React from 'react';

const RECON_STATUS_MESSAGES: Record<string, string> = {
  "IDLE": "Ready for image upload",
  "BUFFER_LOADED": "Image loaded, ready to extract",
  "ANALYZING_VISUAL_STYLE": "Analyzing visual style components...",
  "EXTRACTING_COLOR_DNA": "ExtRACTing color palette and harmony...",
  "DECODING_FORM_LANGUAGE": "Decoding form and line style...",
  "CAPTURING_MOOD": "Capturing emotional tone...",
  "GENERATING_STYLE_TEMPLATE": "Creating style preset...",
  "STYLE_CAPTURED": "Style DNA captured!",
  "STYLE_AMBIGUOUS": "Style is mixed or unclear",
  "AUTHENTICITY_LOW": "Style authenticity is low",
  "AUDIT_FAILED": "Style extraction failed"
};

export const DevourerHUD: React.FC<{ devourerStatus: string }> = ({ devourerStatus }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden select-none z-0">
    {/* Background Rings */}
    <div className="relative w-[150%] h-[150%] flex items-center justify-center opacity-[0.08] dark:opacity-[0.15]">
      <div className="absolute inset-0 border-[1px] border-brandRed rounded-full animate-pulse" />
      <div className="w-[85%] h-[85%] border-[1px] border-brandYellow rounded-full border-dashed animate-spin-slow" />
      <div className="w-[65%] h-[65%] border-[1px] border-brandBlue rounded-full animate-spin-reverse-slow" />
    </div>

    {/* Precision Grid Overlay */}
    <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" 
         style={{ backgroundImage: `radial-gradient(circle, #CC0001 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px' }} />

    {/* SVG HUD Elements */}
    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 1000">
      <circle cx="500" cy="500" r="450" fill="none" stroke="#CC0001" strokeWidth="0.5" strokeDasharray="10 20" />
      <path d="M500 50 L500 100 M500 900 L500 950 M50 500 L100 500 M900 500 L950 500" stroke="#CC0001" strokeWidth="2" />
      <rect x="480" y="480" width="40" height="40" fill="none" stroke="#FFCC00" strokeWidth="1" className="animate-pulse" />
    </svg>

    <div className="absolute top-12 right-12 flex flex-col items-end gap-1">
      <div className="text-[7px] font-black text-brandRed bg-black/60 px-3 py-1 border border-brandRed/20 tracking-[0.3em] animate-pulse backdrop-blur-sm">
        OMEGA_CORE_LOCKED
      </div>
      <div className="text-[6px] font-mono text-white/30">LAT_SYNC: {Math.random().toString(16).substring(2,8).toUpperCase()}</div>
    </div>

    <div className="absolute top-12 left-12 flex flex-col gap-1.5">
      <div className="h-1.5 w-32 bg-brandRed/10 relative overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-brandRed animate-shimmer" />
      </div>
      <div className="text-[6px] font-black text-brandRed/60 uppercase tracking-widest italic">SYNTHESIS_STABILITY_100%</div>
    </div>
    
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 px-10 py-3 bg-brandCharcoal/90 rounded-sm backdrop-blur-xl border border-brandRed/30 shadow-2xl transition-all">
      <div className="text-[11px] font-black uppercase text-brandRed tracking-[0.6em] animate-pulse drop-shadow-[0_0_12px_rgba(204,0,1,0.8)]">
        {devourerStatus}
      </div>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 bg-brandRed/40 rounded-full animate-bounce" style={{ animationDelay: `${i*100}ms` }} />)}
      </div>
    </div>
  </div>
);

export const ReconHUD: React.FC<{ reconStatus: string; authenticityScore?: number }> = ({ reconStatus, authenticityScore }) => {
  const displayStatus = RECON_STATUS_MESSAGES[reconStatus] || reconStatus;
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
      <div className={`relative w-80 h-80 border-[0.5px] border-brandRed/30 rounded-full flex items-center justify-center animate-pulse transition-opacity duration-1000 ${reconStatus === 'IDLE' ? 'opacity-0' : 'opacity-80'}`}>
        <div className="absolute inset-4 border-2 border-brandYellow/10 rounded-full animate-spin-slow" />
        <div className="absolute inset-10 border-[1px] border-brandBlue/20 rounded-full border-dotted animate-spin-reverse-slow" />
        
        {/* Target Crosshair */}
        <div className="absolute h-full w-[0.5px] bg-brandRed/40" />
        <div className="absolute w-full h-[0.5px] bg-brandRed/40" />
        
        {/* Corner Brackets inside the ring */}
        <div className="absolute top-12 left-12 w-6 h-6 border-t border-l border-brandRed/60" />
        <div className="absolute top-12 right-12 w-6 h-6 border-t border-r border-brandRed/60" />
        <div className="absolute bottom-12 left-12 w-6 h-6 border-b border-l border-brandRed/60" />
        <div className="absolute bottom-12 right-12 w-6 h-6 border-b border-r border-brandRed/60" />

        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
           <span className="text-[8px] font-black text-brandYellow tracking-widest whitespace-nowrap bg-brandBlue px-3 py-1 rounded-sm border border-brandYellow/20">
             LATTICE_DECODER_OMEGA
           </span>
           <div className="w-1 h-4 bg-brandYellow/40" />
        </div>
        
        {/* Dynamic Status */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 px-10 py-3 bg-brandCharcoal/95 rounded-sm backdrop-blur-xl border border-brandRed/40 shadow-2xl">
          <div className="text-[11px] font-black uppercase text-brandRed tracking-[0.5em] animate-pulse drop-shadow-[0_0_10px_rgba(204,0,1,0.9)]">
            {displayStatus}
          </div>
          {typeof authenticityScore === 'number' && reconStatus !== 'IDLE' && (
            <div className="flex items-center gap-2">
               <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brandYellow" style={{ width: `${authenticityScore}%` }} />
               </div>
               <div className="text-[7px] font-mono text-brandYellow font-black">{authenticityScore.toFixed(1)}% AUTH</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const FilterHUD: React.FC<{ filterStatus: string }> = ({ filterStatus }) => (
  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 px-10 py-3 bg-brandBlue/90 rounded-sm backdrop-blur-xl border border-white/20 shadow-2xl z-0 pointer-events-none">
    <div className="text-[11px] font-black uppercase text-white tracking-[0.6em] animate-pulse drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
      {filterStatus}
    </div>
    <div className="h-[1px] w-full bg-white/20" />
    <div className="text-[6px] font-black text-white/40 uppercase tracking-widest italic">SPECTRAL_ENGINE_ENGAGED</div>
  </div>
);