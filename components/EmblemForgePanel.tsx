// FINAL – LOCKED - REFINED V8.0.0
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, EmblemPreset, Preset, LatticeBuffer, isEmblemPreset } from '../types.ts';
import { getMobileCategories } from '../presets/index.ts';
import { synthesizeEmblemStyle, refineTextPrompt } from '../services/geminiService.ts';
import { useDevourer } from '../hooks/useDevourer.ts';
import { PresetCard } from './PresetCard.tsx';
import { PresetCarousel } from './PresetCarousel.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { DevourerHUD } from './HUD.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';

interface EmblemForgePanelProps {
  initialData?: any;
  kernelConfig: KernelConfig;
  onSaveToHistory: (work: any) => void;
  savedPresets: any[];
  onStateUpdate?: (state: any) => void;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  onSetGlobalDna?: (dna: ExtractionResult | null) => void;
  globalDna?: ExtractionResult | null;
  latticeBuffer?: LatticeBuffer | null;
  onClearLattice?: () => void;
}

export const EmblemForgePanel: React.FC<EmblemForgePanelProps> = ({
  initialData, kernelConfig, onSaveToHistory, savedPresets = [], onStateUpdate, addLog, onSetGlobalDna, globalDna, latticeBuffer, onClearLattice
}) => {
  const PRESETS: PresetCategory[] = useMemo(() => {
    return getMobileCategories(PanelMode.EMBLEM_FORGE, savedPresets);
  }, [savedPresets]);

  const { status, isProcessing, transition } = useDevourer(initialData?.dna || globalDna ? 'DNA_LINKED' : 'STARVING');

  const [primaryText, setPrimaryText] = useState(initialData?.prompt || '');
  const [subText, setSubText] = useState('');
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(initialData?.imageUrl || null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);
  const [activePreset, setActivePreset] = useState<PresetItem | null>(initialData || null);
  
  const processingRef = useRef(false);

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.EMBLEM_FORGE,
      prompt: `${primaryText}${subText ? ` | ${subText}` : ''}`,
      generatedOutput,
      dna,
      name: primaryText || 'Emblem Synthesis',
      settings: (activePreset as EmblemPreset)?.parameters || {}
    });
  }, [primaryText, subText, generatedOutput, dna, onStateUpdate, activePreset]);

  const handleSelectPreset = useCallback((id: string) => {
    if (isProcessing) return;
    if (activePresetId === id) {
      setActivePresetId(null);
      setActivePreset(null);
      setDna(null);
      onSetGlobalDna?.(null);
      return;
    }
    setActivePresetId(id);
    const item = PRESETS.flatMap(c => c.items).find(i => i.id === id);
    if (!item) return;
    setActivePreset(item);
    if (item.dna) {
      setDna(item.dna);
      transition("DNA_LINKED");
      onSetGlobalDna?.(item.dna);
    }
    addLog(`EMBLEM_RECALL: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const handleGenerate = useCallback(async () => {
    if (processingRef.current || !activePreset || !isEmblemPreset(activePreset)) {
      addLog("EMBLEM_ERROR: No valid preset selected.", 'error');
      return;
    }

    const userPrimaryText = primaryText.trim() || 'HYPERXGEN';
    const userSubText = subText.trim();
    
    const finalPrompt = `Primary Text: "${userPrimaryText}". ${userSubText ? `Subtext: "${userSubText}".` : ''} The style is a ${activePreset.name}. ${activePreset.prompt || ''}`;
    
    processingRef.current = true;
    transition(dna || globalDna ? 'DNA_STYLIZE_ACTIVE' : 'DEVOURING_BUFFER', true);
    
    const emblemParams = activePreset.parameters;
    const directives = [`[DIRECTIVE: EMBLEM_FORGE_V1]`];
    for (const [key, value] of Object.entries(emblemParams)) {
        if (value) {
            const directiveKey = key.replace(/([A-Z])/g, '_$1').toUpperCase();
            directives.push(`${directiveKey}: ${String(value).toUpperCase()}`);
        }
    }
     if (activePreset.styleDirective) {
        directives.push(activePreset.styleDirective);
    }
    const extraDirectives = directives.join('\n');

    try {
      const result = await synthesizeEmblemStyle(finalPrompt, undefined, kernelConfig, dna || globalDna || undefined, extraDirectives);
      setGeneratedOutput(result);
      addLog(`EMBLEM_SYNTHESIS: "${userPrimaryText}" forged`, 'success');
      onSaveToHistory({
        id: `emblem-${Date.now()}`,
        name: userPrimaryText,
        type: PanelMode.EMBLEM_FORGE,
        prompt: finalPrompt,
        dna: dna || globalDna,
        imageUrl: result,
        parameters: (activePreset as EmblemPreset).parameters,
        category: 'Synthesis',
        description: 'User-generated emblem'
      } as EmblemPreset);
    } catch (e: any) {
      addLog(`EMBLEM_ERROR: ${e.message}`, 'error');
      transition('LATTICE_FAIL');
    } finally {
      processingRef.current = false;
      transition('LATTICE_ACTIVE');
    }
  }, [primaryText, subText, activePreset, kernelConfig, dna, globalDna, transition, addLog, onSaveToHistory]);
  
  const canGenerate = !isProcessing && !!activePresetId;

  return (
    <PanelLayout
      sidebar={
        <>
          <SidebarHeader moduleNumber="Module_06" title="Emblem_Forge" version="Heraldic Synthesis v2.0" colorClass="text-brandYellow" borderColorClass="border-brandYellow" />
          <div className="space-y-6 px-1">
            <div className="p-3 bg-brandYellow/5 border border-brandYellow/20 rounded-sm mb-6">
                <span className="text-[8px] font-black text-brandYellow uppercase tracking-widest block mb-1">Instruction:</span>
                <p className="text-[9px] text-brandCharcoalMuted dark:text-white/60 leading-tight">Enter primary and optional subtext. Select an authoritative preset. The engine handles all illustration, layout, and ornamentation.</p>
            </div>
             <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic border-b border-white/5 pb-2">Style_Library</h4>
                {PRESETS.map(cat => (
                  <div key={cat.title} className="space-y-3">
                    <h3 className="text-[9px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic">{cat.title.replace(/_/g, ' ')}</h3>
                    {cat.items.map(p => (
                      <PresetCard key={p.id} name={p.name} description={p.description} prompt={p.prompt} isActive={activePresetId === p.id} onClick={() => handleSelectPreset(p.id)} iconChar="E" />
                    ))}
                  </div>
                ))}
             </div>
          </div>
        </>
      }
      canvas={
        <CanvasStage 
          uploadedImage={null} 
          generatedOutput={generatedOutput} 
          isProcessing={isProcessing} 
          hudContent={<DevourerHUD devourerStatus={status} />} 
          onClear={() => { 
            setGeneratedOutput(null); 
            setDna(null); 
            setPrimaryText('');
            setSubText('');
            transition('STARVING'); 
          }} 
          onFileUpload={() => {}}
        />
      }
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
          {/* Custom Footer for Emblem Forge */}
          <div className={`w-full border-t-2 transition-colors duration-500 border-brandRed dark:border-brandYellow bg-brandNeutral dark:bg-brandDeep shadow-[0_-10px_30px_rgba(0,0,0,0.5)] dark:shadow-neon-yellow-soft z-50 rounded-sm py-2 px-3 md:py-4 md:px-6`}>
            <div className={`max-w-screen-2xl mx-auto flex flex-col md:flex-row items-stretch gap-0 border-2 transition-all duration-500 border-brandCharcoal dark:border-brandYellow/30 shadow-[2px_2px_0px_0px_#CC0001] dark:shadow-[4px_4px_0px_0px_#FFCC00] bg-white dark:bg-black/60 overflow-hidden`}>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                    <input
                        type="text"
                        value={primaryText}
                        onChange={e => setPrimaryText(e.target.value)}
                        placeholder="Primary Text (e.g. HYPERXGEN)"
                        disabled={isProcessing}
                        className="w-full px-3 py-3 md:px-5 md:py-4 bg-brandCharcoal/10 dark:bg-black/20 border-b md:border-b-0 md:border-r border-brandBlue/30 dark:border-brandYellow/30 text-brandYellow dark:text-brandYellow font-mono text-xs md:text-sm focus:outline-none placeholder-brandCharcoalMuted/40 dark:placeholder-white/30 min-w-0 caret-brandRed dark:caret-brandYellow"
                    />
                    <input
                        type="text"
                        value={subText}
                        onChange={e => setSubText(e.target.value)}
                        placeholder="Subtext (e.g. EST. 2024)"
                        disabled={isProcessing}
                        className="w-full px-3 py-3 md:px-5 md:py-4 bg-brandCharcoal/5 dark:bg-black/10 border-brandBlue/20 dark:border-brandYellow/20 text-brandYellow dark:text-brandYellow/80 font-mono text-xs md:text-sm focus:outline-none placeholder-brandCharcoalMuted/30 dark:placeholder-white/20 min-w-0 caret-brandRed dark:caret-brandYellow"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className={`flex-none px-6 py-3 md:px-10 md:py-4 font-black uppercase text-[10px] md:text-[11px] italic tracking-[0.15em] md:tracking-[0.25em] transition-all flex items-center justify-center border-l border-brandCharcoal/10 dark:border-brandYellow/20
                    ${isProcessing ? 'bg-black text-brandYellow animate-pulse cursor-wait' : 'bg-brandBlue dark:bg-brandYellow text-white dark:text-black hover:bg-brandYellow dark:hover:bg-black hover:text-black dark:hover:text-brandYellow active:translate-x-0.5 active:translate-y-0.5 dark:shadow-neon-yellow-soft disabled:bg-zinc-500 disabled:text-zinc-300 disabled:cursor-not-allowed'}
                    `}
                >
                  {isProcessing ? 'FORGING...' : 'FORGE EMBLEM'}
                </button>
            </div>
          </div>
        </div>
      }
    />
  );
};
