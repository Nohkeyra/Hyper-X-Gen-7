// FINAL – LOCKED - REFINED V8.0.2
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, EmblemPreset, Preset, LatticeBuffer, isEmblemPreset } from '../types.ts';
import { getMobileCategories } from '../presets/index.ts';
import { synthesizeEmblemStyle } from '../services/imageOrchestrator.ts';
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

  const findPresetById = useCallback((id: string) => {
    return PRESETS.flatMap(c => c.items).find(i => i.id === id) || null;
  }, [PRESETS]);

  const { status, isProcessing, transition } = useDevourer(initialData?.dna || globalDna ? 'DNA_LINKED' : 'STARVING');

  const [primaryText, setPrimaryText] = useState(initialData?.prompt || 'CYBERPUNK EAGLE');
  const [subText, setSubText] = useState('EST. 2024');
  const [generationNonce, setGenerationNonce] = useState(0); 
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(initialData?.imageUrl || null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || 'emblem-esports');
  const [activePreset, setActivePreset] = useState<PresetItem | null>(() => initialData || findPresetById('emblem-esports'));
  
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
      setGenerationNonce(0); 
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
    setGenerationNonce(0); 
    addLog(`EMBLEM_RECALL: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const setPrimaryTextAndResetNonce = useCallback((value: string) => {
    setPrimaryText(value);
    setGenerationNonce(0); 
  }, []);

  const setSubTextAndResetNonce = useCallback((value: string) => {
    setSubText(value);
    setGenerationNonce(0); 
  }, []);


  const handleGenerate = useCallback(async () => {
    if (isProcessing || !activePreset || !isEmblemPreset(activePreset)) {
      addLog("EMBLEM_ERROR: No valid preset selected.", 'error');
      return;
    }

    const userPrimaryText = primaryText.trim() || 'HYPERXGEN';
    const userSubText = subText.trim();
    
    const finalPrompt = `Primary Text: "${userPrimaryText}". ${userSubText ? `Subtext: "${userSubText}".` : ''} The style is a ${activePreset.name}. ${activePreset.prompt || ''}`;
    
    transition(dna || globalDna ? 'DNA_STYLIZE_ACTIVE' : 'DEVOURING_BUFFER', true);
    setGenerationNonce(prev => prev + 1); 
    
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
      const { imageUrl: result, fallbackTriggered } = await synthesizeEmblemStyle(finalPrompt, undefined, kernelConfig, dna || globalDna || undefined, extraDirectives, generationNonce); 
      
      if (fallbackTriggered) {
        addLog('FLUX_FAIL: Primary engine connection failed. Switched to Gemini fallback.', 'warning');
      }

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
    } catch (error: any) {
      transition('LATTICE_FAIL');
      addLog(`EMBLEM_ERROR: ${error.message}`, 'error');
    } finally {
      transition('LATTICE_ACTIVE');
    }
  }, [primaryText, subText, activePreset, kernelConfig, dna, globalDna, transition, addLog, onSaveToHistory, generationNonce, isProcessing]);
  
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
            setGenerationNonce(0); 
          }} 
          onFileUpload={() => {}}
          activeEngine={kernelConfig.imageEngine}
        />
      }
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
          {/* Custom Footer standardized to match GenerationBar architecture */}
          <div className="w-full glass-panel border-t-2 border-brandRed dark:border-brandYellow p-3 md:p-6 z-50 rounded-sm shadow-2xl">
            <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-stretch gap-0 border-2 border-brandBlue/30 dark:border-white/10 bg-white/50 dark:bg-black/60 overflow-hidden shadow-xl">
                {/* Active Preset Indicator (Visual Match) */}
                {activePresetId && (
                  <div className="flex-none bg-brandBlue/5 dark:bg-white/5 border-b md:border-b-0 md:border-r border-brandBlue/20 dark:border-white/10 px-4 flex items-center justify-center py-3 md:py-0">
                     <div className="w-8 h-8 flex items-center justify-center bg-brandYellow text-black font-black text-[10px] rounded-sm">
                        E
                     </div>
                  </div>
                )}

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-brandBlue/10 dark:divide-white/10">
                    <input
                        type="text"
                        value={primaryText}
                        onChange={e => setPrimaryTextAndResetNonce(e.target.value)} 
                        placeholder="Primary Text (e.g. HYPERXGEN)"
                        disabled={isProcessing}
                        className="w-full px-6 py-5 bg-transparent text-brandBlue dark:text-white font-mono text-sm md:text-base focus:outline-none placeholder-brandBlue/30 dark:placeholder-white/20 min-w-0 caret-brandRed"
                    />
                    <input
                        type="text"
                        value={subText}
                        onChange={e => setSubTextAndResetNonce(e.target.value)} 
                        placeholder="Subtext (e.g. EST. 2024)"
                        disabled={isProcessing}
                        className="w-full px-6 py-5 bg-transparent text-brandBlue dark:text-white font-mono text-sm md:text-base focus:outline-none placeholder-brandBlue/30 dark:placeholder-white/20 min-w-0 caret-brandRed"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className={`flex-none px-8 md:px-16 py-5 font-black uppercase text-xs md:text-sm italic tracking-[0.3em] transition-all flex items-center justify-center gap-3 border-l border-brandBlue/20 dark:border-white/10 btn-tactile
                    ${isProcessing 
                      ? 'bg-black text-brandYellow cursor-wait shadow-inner' 
                      : 'bg-brandBlue dark:bg-brandYellow text-white dark:text-black hover:brightness-110 active:bg-brandRed'}
                    `}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-3 border-current border-t-transparent rounded-full animate-spin" />
                      <span>FORGING</span>
                    </>
                  ) : (
                    <span>EXECUTE</span>
                  )}
                </button>
            </div>
            {/* HUD Telemetry Match */}
            <div className="max-w-screen-2xl mx-auto mt-3 flex justify-between items-center px-2 opacity-60">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-brandRed animate-pulse shadow-neon-red' : 'bg-brandBlue dark:bg-brandYellow opacity-40'}`} />
                  <span className="text-[8px] font-black text-brandBlue dark:text-white/40 uppercase tracking-[0.2em]">
                    {isProcessing ? 'Forge_Active' : 'Emblem_Lattice_Idle'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};