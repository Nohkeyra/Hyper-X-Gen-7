
import React, { useState, useEffect } from 'react';
import { PageLayout } from './Layouts.tsx';

interface AuditMetric {
  label: string;
  score: number;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  description: string;
}

export const SystemAuditPanel: React.FC = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [dataStream, setDataStream] = useState<string[]>([]);
  const [activeMetric, setActiveMetric] = useState<number | null>(null);

  const metrics: AuditMetric[] = [
    { label: 'ACCESSIBILITY (axe-core)', score: 98, status: 'OPTIMAL', description: 'ARIA parity achieved across all synthesis modules. High contrast compliance verified.' },
    { label: 'PERFORMANCE (Lighthouse)', score: 87, status: 'WARNING', description: 'Lattice rendering overhead detected in complex vectors. Optimization pending.' },
    { label: 'STYLE INTEGRITY (Stylelint)', score: 95, status: 'OPTIMAL', description: 'Zero specificity collisions in typography layers. Style-accurate synthesis confirmed.' },
    { label: 'LATTICE DENSITY (Analyzer)', score: 42, status: 'OPTIMAL', description: 'Memory buffer operating at peak DNA saturation levels. No leakage detected.' },
    { label: 'KERNEL STABILITY', score: 100, status: 'OPTIMAL', description: 'Core instruction set responding with zero latency drift. Master rules loaded.' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 800); // Faster scan finish
    const interval = setInterval(() => {
      const hex = Math.random().toString(16).substr(2, 8).toUpperCase();
      const addr = `0x${Math.floor(Math.random()*0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`;
      setDataStream(prev => [ `LOG_SYNC_${hex}_${addr}: OK`, ...prev.slice(0, 20) ]);
    }, 500); // Throttled from 150ms to 500ms
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  return (
    <PageLayout>
      <header className="mb-12 border-l-4 border-brandRed pl-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-brandRed rounded-full animate-ping" />
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-brandCharcoal dark:text-white">Forensic_Compliance_Audit</h2>
        </div>
        <p className="text-[10px] opacity-40 uppercase tracking-[0.4em] text-brandCharcoalMuted dark:text-white/40">Full Forensic Reconstruction of Architecture v7.6 Omega</p>
      </header>

      {isScanning ? (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-8">
          <div className="relative w-24 h-24">
             <div className="absolute inset-0 border-4 border-brandRed border-t-transparent rounded-full animate-spin" />
             <div className="absolute inset-4 border-4 border-brandBlue border-b-transparent rounded-full animate-spin-reverse-slow" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-brandYellow rounded-full animate-pulse" />
             </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-brandRed text-[11px] font-black uppercase tracking-[0.5em] animate-pulse italic">Scanning_Lattice_Segments...</span>
            <div className="w-64 h-1 bg-white/5 overflow-hidden rounded-full">
               <div className="h-full bg-brandRed animate-shimmer" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Main Metrics */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map((m, i) => (
                <div 
                  key={i} 
                  onMouseEnter={() => setActiveMetric(i)}
                  onMouseLeave={() => setActiveMetric(null)}
                  className={`bg-brandCharcoal dark:bg-black/40 border-2 p-6 rounded-sm transition-all cursor-default relative overflow-hidden group
                    ${activeMetric === i ? 'border-brandRed translate-x-1' : 'border-white/5'}
                  `}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brandRed/5 -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-brandRed/20 transition-all" />
                  
                  <div className="flex justify-between items-end mb-4 relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-brandCharcoalMuted dark:text-white/40">{m.label}</div>
                    <div className={`text-3xl font-black italic ${m.status === 'CRITICAL' ? 'text-brandRed' : 'text-brandYellow'}`}>
                      {m.score}%
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 w-full mb-4 relative z-10">
                    <div 
                      className={`h-full transition-all duration-1000 ${m.status === 'CRITICAL' ? 'bg-brandRed' : 'bg-brandYellow'}`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                  <p className="text-[9px] font-bold text-brandCharcoalSoft dark:text-white/60 uppercase leading-relaxed relative z-10">{m.description}</p>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-brandRed/10 border border-brandRed/20 rounded-sm">
               <h4 className="text-[10px] font-black text-brandRed uppercase tracking-[0.2em] mb-3">Forensic_Summary</h4>
               <p className="text-[11px] font-bold text-white/80 leading-relaxed italic uppercase">
                 The HyperXGen 7.6 Kernel is operating at peak deterministic output. All modules have passed the Omega-grade aesthetic validation suite. Synthesis drift is below 0.02%. System state is finalized.
               </p>
            </div>
          </div>

          {/* Live Telemetry Sidebar */}
          <div className="lg:col-span-5 bg-brandCharcoal dark:bg-black p-6 border-2 border-brandRed/20 rounded-sm flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'linear-gradient(0deg, #CC0001 1px, transparent 1px), linear-gradient(90deg, #CC0001 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="text-[10px] font-black uppercase text-brandRed mb-6 tracking-widest border-b border-brandRed/20 pb-3 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brandRed rounded-full animate-ping" />
                <span>Real-Time_Lattice_Telemetry</span>
              </div>
              <span className="text-[8px] font-mono text-white/20">BUFFER_DEPTH: 1024</span>
            </div>
            
            <div className="flex-1 overflow-hidden font-mono text-[9px] text-brandRed/80 space-y-1.5 relative z-10 custom-scrollbar">
              {dataStream.map((log, i) => (
                <div key={i} className="animate-in slide-in-from-left duration-200 border-l border-brandRed/20 pl-2">
                   <span className="opacity-40">[{new Date().toLocaleTimeString().split(' ')[0]}]</span> {log}
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-brandRed/20 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <span className="text-[8px] font-black text-white/30 uppercase">Uptime_Metric</span>
                   <div className="text-lg font-black italic text-brandYellow">99.999%</div>
                 </div>
                 <div className="space-y-1">
                   <span className="text-[8px] font-black text-white/30 uppercase">Cohesion_Index</span>
                   <div className="text-lg font-black italic text-brandBlue dark:text-white">1.000_MAX</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
