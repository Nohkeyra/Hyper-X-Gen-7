import React, { useMemo } from 'react';
import { PanelMode } from '../types';
import { VectorIcon, TypographyIcon, MonogramIcon, ExtractorIcon, FilterIcon, EmblemIcon } from './Icons'; 
import { PageLayout } from './Layouts.tsx';

interface StartScreenProps {
  onSelectMode: (mode: PanelMode) => void;
  recentCount: number;
}

const MODULE_DEFINITIONS = [
  { id: PanelMode.VECTOR, title: "Vector Synth", Icon: VectorIcon, stat: "Omega_V7", desc: "Geometric core synthesis" },
  { id: PanelMode.TYPOGRAPHY, title: "Typography", Icon: TypographyIcon, stat: "Kinetic_V3", desc: "Semantic visual art" },
  { id: PanelMode.MONOGRAM, title: "Monogram", Icon: MonogramIcon, stat: "Fused_Mark", desc: "Identity logic engine" },
  { id: PanelMode.EMBLEM_FORGE, title: "Emblem Forge", Icon: EmblemIcon, stat: "Heraldic", desc: "Identity mark forge" },
  { id: PanelMode.EXTRACTOR, title: "DNA Extract", Icon: ExtractorIcon, stat: "Forensic", desc: "Style architectural capture" },
  { id: PanelMode.FILTERS, title: "Spectral", Icon: FilterIcon, stat: "Post_Proc", desc: "Visual shift protocols" },
];

const PALETTE_CONFIG = [
  // 1: Jalur Gemilang Blue (Canton)
  { 
    bg: 'dark:bg-brandBlue bg-brandBlue', 
    border: 'border-brandBlue',
    text: 'text-white dark:text-white', 
    descColor: 'text-white/80 dark:text-white/80',
    shadow: 'dark:box-glow-intense-blue',
    iconColor: 'text-brandYellow dark:text-brandYellow', 
    subText: 'text-brandYellow dark:text-white'
  },
  // 2: Jalur Gemilang Red (Stripes)
  { 
    bg: 'dark:bg-brandRed bg-brandRed', 
    border: 'border-brandRed',
    text: 'text-white dark:text-white', 
    descColor: 'text-white/80 dark:text-white/80',
    shadow: 'dark:box-glow-intense-red',
    iconColor: 'text-white dark:text-white', 
    subText: 'text-white dark:text-white'
  },
  // 3: Jalur Gemilang Yellow (Crescent/Star)
  { 
    bg: 'dark:bg-brandYellow bg-brandYellow', 
    border: 'border-brandYellow',
    text: 'text-brandBlue dark:text-brandBlue', 
    descColor: 'text-brandBlue/80 dark:text-brandBlue/80',
    shadow: 'dark:box-glow-intense-yellow',
    iconColor: 'text-brandRed dark:text-brandRed', 
    subText: 'text-brandRed dark:text-brandBlue'
  }
];

export const StartScreen: React.FC<StartScreenProps> = ({ onSelectMode, recentCount }) => {
  const randomizedModules = useMemo(() => {
    return MODULE_DEFINITIONS.map((mod, index) => ({
      ...mod,
      scheme: PALETTE_CONFIG[index % PALETTE_CONFIG.length]
    }));
  }, []);

  return (
    <PageLayout centered>
      <div className="flex flex-col items-center w-full max-w-6xl py-8 md:py-16 animate-in fade-in zoom-in duration-1000 relative z-10 px-4">
        
        {/* IDENTITY ANCHOR */}
        <div className="text-center mb-10 md:mb-20 space-y-2 md:space-y-4 relative w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-brandBlue/10 blur-[60px] md:blur-[100px] rounded-full pointer-events-none animate-pulse" />
          
          <div className="inline-flex items-center gap-2 bg-white dark:bg-black/80 text-brandRed text-[8px] md:text-[10px] font-black uppercase px-4 md:px-6 py-1.5 md:py-2 tracking-[0.2em] md:tracking-[0.4em] italic mb-4 md:mb-6 border border-brandRed shadow-sm dark:shadow-neon-red rounded-full relative z-20 backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-brandRed rounded-full animate-ping" />
            <span className="dark:text-neon-red">System_Architecture_Omega_v7.6</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-brandBlue to-brandCharcoal dark:from-white dark:to-brandCharcoal leading-[0.9] select-none drop-shadow-sm dark:drop-shadow-[0_0_25px_rgba(0,50,160,0.6)] relative z-20 dark:animate-flicker">
            HYPER<span className="text-brandRed dark:text-neon-red">X</span>GEN
          </h1>
          
          <div className="flex items-center justify-center gap-4 md:gap-8 opacity-80 mt-6 md:mt-8 relative z-20">
            <div className="h-px w-10 md:w-24 bg-gradient-to-r from-transparent to-brandYellow" />
            <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-brandYellow dark:text-neon-yellow bg-brandCharcoal/80 px-2 rounded-sm dark:bg-transparent">Kuala_Lumpur_Synthesis_Node</p>
            <div className="h-px w-10 md:w-24 bg-gradient-to-l from-transparent to-brandYellow" />
          </div>
        </div>

        {/* MODULE MATRIX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 w-full perspective-1000">
          {randomizedModules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => onSelectMode(module.id)}
              className={`group relative ${module.scheme?.bg} p-6 md:p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] rounded-sm overflow-hidden border-2 ${module.scheme?.border} active:scale-95 backdrop-blur-md hover:z-20 shadow-xl hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in`}
              style={{ animationDelay: `${100 + index * 60}ms`, animationFillMode: 'both' }}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 to-transparent ${module.scheme?.shadow}`} />
              <div className="hidden dark:block absolute inset-0 opacity-5 bg-[linear-gradient(transparent_2px,rgba(255,255,255,0.05)_2px)] bg-[length:100%_4px] pointer-events-none" />

              <div className={`absolute -bottom-6 -right-6 opacity-[0.1] group-hover:opacity-[0.25] group-hover:rotate-0 transition-all duration-500 rotate-12 ${module.scheme?.text}`}>
                <module.Icon className="w-32 md:w-40 h-32 md:h-40" />
              </div>

              <div className="relative z-10 flex flex-col h-full gap-4 md:gap-6">
                <div className="flex justify-between items-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-sm border-2 ${module.scheme?.border} ${module.scheme?.iconColor} bg-white/20 dark:bg-black/50 dark:group-hover:shadow-[0_0_20px_currentColor] transition-all duration-300 group-hover:rotate-6`}>
                    <module.Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[6px] md:text-[7px] font-black opacity-60 tracking-widest ${module.scheme?.subText}`}>SIGNAL_LOCK</span>
                    <div className={`w-3 h-1.5 md:w-4 md:h-1.5 ${module.scheme?.iconColor.replace('text', 'bg')} rounded-sm mt-1 dark:shadow-[0_0_10px_currentColor] animate-pulse`} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className={`text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none ${module.scheme?.text} drop-shadow-sm transition-all duration-300 group-hover:tracking-normal`}>
                    {module.title}
                  </h3>
                  <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-tight ${module.scheme?.descColor}`}>
                    {module.desc}
                  </p>
                </div>

                <div className="mt-auto pt-4 md:pt-6 border-t border-white/20 dark:border-white/10 flex justify-between items-center">
                  <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest ${module.scheme?.subText} group-hover:animate-pulse`}>
                    {module.stat}
                  </span>
                  <div className="flex gap-1 group-hover:gap-1.5 transition-all">
                    <div className={`w-1 h-1 ${module.scheme?.iconColor.replace('text','bg')} rounded-full opacity-40`} />
                    <div className={`w-1 h-1 ${module.scheme?.iconColor.replace('text','bg')} rounded-full opacity-70`} />
                    <div className={`w-1 h-1 ${module.scheme?.iconColor.replace('text','bg')} rounded-full animate-ping`} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* FOOTER TELEMETRY */}
        <div className="mt-12 md:mt-20 flex flex-wrap justify-center items-center gap-6 md:gap-12 text-brandCharcoalMuted dark:text-white/40 px-6">
          <div className="flex flex-col items-center gap-1 group">
             <span className="text-2xl md:text-3xl font-black text-brandRed dark:text-neon-red leading-none group-hover:scale-110 transition-transform">{recentCount}</span>
             <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60">Cached_Blueprints</span>
          </div>
          <div className="h-8 md:h-12 w-px bg-gradient-to-b from-transparent via-brandBlue to-transparent hidden sm:block opacity-50" />
          <div className="flex flex-col items-center gap-1 group">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-brandYellow rounded-full animate-ping dark:shadow-neon-yellow" />
               <span className="text-2xl md:text-3xl font-black text-brandBlue dark:text-brandYellow dark:text-neon-yellow leading-none uppercase">Online</span>
             </div>
             <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60">Flag_Kernel_Stable</span>
          </div>
          <div className="h-8 md:h-12 w-px bg-gradient-to-b from-transparent via-brandBlue to-transparent hidden sm:block opacity-50" />
          <div className="flex flex-col items-center gap-1 group">
             <span className="text-2xl md:text-3xl font-black text-brandBlue dark:text-white dark:text-neon-blue leading-none">v7.6.2</span>
             <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60">Current_Release</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
