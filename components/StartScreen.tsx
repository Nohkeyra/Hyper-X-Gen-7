
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
  // Light: Blue BG, White Text | Dark: Blue BG, White/Yellow Text
  { 
    bg: 'dark:bg-brandBlue bg-brandBlue', 
    border: 'border-brandBlue',
    text: 'text-white dark:text-white', 
    descColor: 'text-white/80 dark:text-white/80',
    shadow: 'dark:box-glow-intense-blue',
    iconColor: 'text-brandYellow dark:text-brandYellow', // Yellow Star on Blue
    subText: 'text-brandYellow dark:text-white'
  },
  // 2: Jalur Gemilang Red (Stripes)
  // Light: Red BG, White Text | Dark: Red BG, White Text
  { 
    bg: 'dark:bg-brandRed bg-brandRed', 
    border: 'border-brandRed',
    text: 'text-white dark:text-white', 
    descColor: 'text-white/80 dark:text-white/80',
    shadow: 'dark:box-glow-intense-red',
    iconColor: 'text-white dark:text-white', // White on Red
    subText: 'text-white dark:text-white'
  },
  // 3: Jalur Gemilang Yellow (Crescent/Star)
  // Light: Yellow BG, Blue Text | Dark: Yellow BG, Blue/Red Text
  { 
    bg: 'dark:bg-brandYellow bg-brandYellow', 
    border: 'border-brandYellow',
    text: 'text-brandBlue dark:text-brandBlue', 
    descColor: 'text-brandBlue/80 dark:text-brandBlue/80',
    shadow: 'dark:box-glow-intense-yellow',
    iconColor: 'text-brandRed dark:text-brandRed', // Red on Yellow
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
      <div className="flex flex-col items-center w-full max-w-6xl py-12 md:py-20 animate-in fade-in zoom-in duration-1000 relative z-10">
        
        {/* IDENTITY ANCHOR */}
        <div className="text-center mb-16 md:mb-24 space-y-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-brandBlue/10 blur-[100px] rounded-full pointer-events-none animate-pulse" />
          
          <div className="inline-flex items-center gap-2 bg-white dark:bg-black/80 text-brandRed text-[10px] font-black uppercase px-6 py-2 tracking-[0.4em] italic mb-6 border border-brandRed shadow-sm dark:shadow-neon-red rounded-full relative z-20 backdrop-blur-md">
            <div className="w-2 h-2 bg-brandRed rounded-full animate-ping" />
            <span className="dark:text-neon-red">System_Architecture_Omega_v7.6</span>
          </div>
          
          <h1 className="text-7xl md:text-[10rem] font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-brandBlue to-brandCharcoal dark:from-white dark:to-brandCharcoal leading-[0.8] select-none drop-shadow-sm dark:drop-shadow-[0_0_35px_rgba(0,50,160,0.8)] relative z-20 dark:animate-flicker">
            HYPER<span className="text-brandRed dark:text-neon-red">X</span>GEN
          </h1>
          
          <div className="flex items-center justify-center gap-8 opacity-80 mt-8 relative z-20">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-brandYellow" />
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-brandYellow dark:text-neon-yellow bg-brandCharcoal px-2 rounded-sm dark:bg-transparent">Kuala_Lumpur_Synthesis_Node</p>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-brandYellow" />
          </div>
        </div>

        {/* MODULE MATRIX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full px-6 perspective-1000">
          {randomizedModules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => onSelectMode(module.id)}
              className={`group relative ${module.scheme?.bg} p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] rounded-sm overflow-hidden border-2 ${module.scheme?.border} active:scale-95 backdrop-blur-md hover:z-20 shadow-xl hover:shadow-2xl animate-in fade-in zoom-in`}
              style={{ animationDelay: `${100 + index * 80}ms`, animationFillMode: 'both' }}
            >
              {/* Internal Glow Field (Dark Only) */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent ${module.scheme?.shadow}`} />
              
              {/* Scanline Effect on Card (Dark Only) */}
              <div className="hidden dark:block absolute inset-0 opacity-10 bg-[linear-gradient(transparent_2px,rgba(255,255,255,0.1)_2px)] bg-[length:100%_4px] pointer-events-none" />

              {/* Background HUD Decal */}
              <div className={`absolute -bottom-8 -right-8 opacity-[0.1] group-hover:opacity-[0.2] transition-opacity rotate-12 ${module.scheme?.text}`}>
                <module.Icon className="w-40 h-40" />
              </div>

              <div className="relative z-10 flex flex-col h-full gap-6">
                <div className="flex justify-between items-center">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-sm border-2 ${module.scheme?.border} ${module.scheme?.iconColor} bg-white/20 dark:bg-black/50 dark:group-hover:shadow-[0_0_20px_currentColor] transition-all`}>
                    <module.Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[7px] font-black opacity-60 tracking-widest ${module.scheme?.subText}`}>SIGNAL_LOCK</span>
                    <div className={`w-4 h-1.5 ${module.scheme?.iconColor.replace('text', 'bg')} rounded-sm mt-1 dark:shadow-[0_0_10px_currentColor] animate-pulse`} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className={`text-2xl font-black uppercase italic tracking-tighter leading-none ${module.scheme?.text} drop-shadow-sm`}>
                    {module.title}
                  </h3>
                  <p className={`text-[9px] font-black uppercase tracking-widest leading-tight ${module.scheme?.descColor}`}>
                    {module.desc}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-white/20 dark:border-white/10 flex justify-between items-center">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${module.scheme?.subText} group-hover:animate-pulse`}>
                    {module.stat}
                  </span>
                  <div className="flex gap-1">
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
        <div className="mt-20 flex flex-wrap justify-center items-center gap-12 text-brandCharcoalMuted dark:text-white/40">
          <div className="flex flex-col items-center gap-1 group">
             <span className="text-3xl font-black text-brandRed dark:text-neon-red leading-none group-hover:scale-110 transition-transform">{recentCount}</span>
             <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60">Cached_Blueprints</span>
          </div>
          <div className="h-12 w-px bg-gradient-to-b from-transparent via-brandBlue to-transparent hidden md:block opacity-50" />
          <div className="flex flex-col items-center gap-1 group">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-brandYellow rounded-full animate-ping dark:shadow-neon-yellow" />
               <span className="text-3xl font-black text-brandBlue dark:text-brandYellow dark:text-neon-yellow leading-none uppercase">Online</span>
             </div>
             <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60">Flag_Kernel_Stable</span>
          </div>
          <div className="h-12 w-px bg-gradient-to-b from-transparent via-brandBlue to-transparent hidden md:block opacity-50" />
          <div className="flex flex-col items-center gap-1 group">
             <span className="text-3xl font-black text-brandBlue dark:text-white dark:text-neon-blue leading-none">v7.6.1</span>
             <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60">Current_Release</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};