
// FINAL – LOCKED - REFINED V7.1
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SparkleIcon } from './Icons.tsx';
import { DevourerHUD } from './HUD.tsx';
import { PanelMode, KernelConfig, ExtractionResult, PresetCategory, VectorPreset, Preset, LatticeBuffer } from '../types.ts';
import { PRESET_REGISTRY, getMobileCategories } from '../presets/index.ts';
import { synthesizeVectorStyle, refineTextPrompt } from '../services/geminiService.ts';
import { useDevourer } from '../hooks/useDevourer.ts';
import { PresetCarousel } from './PresetCarousel.tsx';
import { GenerationBar } from './GenerationBar.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';
import { PresetCard } from './PresetCard.tsx';

interface VectorPanelProps {
  initialData?: Preset | null;
  kernelConfig: KernelConfig;
  integrity: number;
  refinementLevel?: number;
  uiRefined?: boolean;
  onSaveToHistory: (work: Preset) => void;
  onModeSwitch: (mode: PanelMode, data?: Preset | null) => void;
  savedPresets: Preset[];
  globalDna?: ExtractionResult | null;
  onSetGlobalDna?: (dna: ExtractionResult | null) => void;
  onStateUpdate?: (state: any) => void;
  addLog: (msg: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  latticeBuffer?: LatticeBuffer | null;
  onClearLattice?: () => void;
}

export const VectorPanel: React.FC<VectorPanelProps> = ({
  initialData, 
  kernelConfig, 
  onSaveToHistory,
  savedPresets = [], 
  globalDna, 
  onSetGlobalDna, 
  onStateUpdate, 
  addLog,
  latticeBuffer,
  onClearLattice
}) => {
  const PRESETS: PresetCategory[] = useMemo(() => {
    return getMobileCategories(PanelMode.VECTOR, savedPresets);
  }, [savedPresets]);

  const { status, isProcessing, transition } = useDevourer(initialData?.dna || globalDna ? 'DNA_LINKED' : 'STARVING');
  
  const [complexity, setComplexity] = useState<'Standard' | 'Minimal' | 'Detailed'>('Standard');
  const [outline, setOutline] = useState<'None' | 'Medium-Bold' | 'Thin'>('None');
  const [mood, setMood] = useState('Cheerful');
  
  const [prompt, setPrompt] = useState(() => initialData?.prompt || '');

  const [generatedOutput, setGeneratedOutput] = useState<string | null>(initialData?.imageUrl || null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl && initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);
  const [activePreset, setActivePreset] = useState<Preset | null>(initialData || null);
  const [isRefining, setIsRefining] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.VECTOR,
      prompt,
      generatedOutput,
      uploadedImage,
      dna,
      name: prompt || 'Vector Synthesis',
      settings: { complexity, outline, mood },
    });
  }, [onStateUpdate, prompt, generatedOutput, uploadedImage, dna, complexity, outline, mood]);

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

    if (item.type === PanelMode.VECTOR) {
      const params = (item as VectorPreset).parameters;
      if (params.complexity) setComplexity(params.complexity);
      if (params.outline) setOutline(params.outline);
      if (params.mood) setMood(params.mood);
    }

    if (item.dna) {
      setDna(item.dna);
      transition("DNA_LINKED");
      onSetGlobalDna?.(item.dna);
    }

    addLog(`ILLUSTRATION_RECALL: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const handleGenerate = useCallback(async () => {
    if (processingRef.current) return;
    
    const userIntent = prompt.trim() || 'Modern subject';
    const finalPrompt = `"${userIntent}". Flat illustration style. ${activePreset?.prompt || ""}`;
    
    processingRef.current = true;
    transition(dna || globalDna ? 'DNA_STYLIZE_ACTIVE' : 'DEVOURING_BUFFER', true);
    
    const extraDirectives = [
      `ENGINE_MODE: ${complexity.toUpperCase()}`,
      `OUTLINE_STYLE: ${outline.toUpperCase()}`,
      `MOOD_SETTING: ${mood.toUpperCase()}`,
      activePreset?.styleDirective || ""
    ].join('\n');

    try {
      const result = await synthesizeVectorStyle(
        finalPrompt, 
        uploadedImage || undefined, 
        kernelConfig, 
        dna || globalDna || undefined, 
        extraDirectives
      );
      setGeneratedOutput(result);
      addLog(`VECTOR_ILLUSTRATION: Generated ${userIntent}`, 'success');
      onSaveToHistory({ 
        id: `vec-${Date.now()}`, 
        name: userIntent, 
        type: PanelMode.VECTOR, 
        prompt: userIntent, 
        dna: dna || globalDna || undefined, 
        imageUrl: result,
        parameters: { complexity, outline, mood, background: 'White', colorCount: 6, strokeWeight: 0, style: 'Flat Design' },
        category: 'Synthesis',
        description: 'User-generated vector'
      } as VectorPreset);
    } catch (e: any) { 
      transition('LATTICE_FAIL'); 
      addLog(`ERROR: ${e.message}`, 'error'); 
    } finally { 
      processingRef.current = false; 
      transition('LATTICE_ACTIVE'); 
    }
  }, [prompt, uploadedImage, activePreset, complexity, outline, mood, kernelConfig, dna, globalDna, transition, addLog, onSaveToHistory]);

  const handleFileUpload = useCallback((f: File) => {
    const r = new FileReader(); 
    r.onload = e => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);
      setGeneratedOutput(null);
      transition('BUFFER_LOADED');
      addLog("SOURCE_BUFFER_LOADED: Ready for synthesis", "info");
    }; 
    r.readAsDataURL(f); 
  }, [transition, addLog]);

  return (
    <PanelLayout 
      sidebar={
        <>
          <SidebarHeader moduleNumber="Module_01" title="Vector_Engine" version="Flat Illustration v7.1" colorClass="text-brandRed" borderColorClass="border-brandRed" />
          <div className="space-y-6 px-1">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic border-b border-white/5 pb-2">Art_Direction</h4>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-white/40">Complexity_Mode</label>
                    <div className="grid grid-cols-3 gap-1">
                      {['Minimal', 'Standard', 'Detailed'].map(mode => (
                        <button key={mode} onClick={() => setComplexity(mode as any)} className={`py-1.5 text-[8px] font-black uppercase border transition-all ${complexity === mode ? 'bg-brandRed text-white border-brandRed' : 'bg-black/20 text-white/40 border-white/10'}`}>
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-white/40">Outline_Weight</label>
                    <select value={outline} onChange={(e) => setOutline(e.target.value as any)} className="bg-brandCharcoal/40 dark:bg-black/40 border border-white/10 text-[10px] p-2 text-white outline-none">
                      <option>None</option>
                      <option>Thin</option>
                      <option>Medium-Bold</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-white/40">Visual_Mood</label>
                    <select value={mood} onChange={(e) => setMood(e.target.value)} className="bg-brandCharcoal/40 dark:bg-black/40 border border-white/10 text-[10px] p-2 text-white outline-none">
                      <option>Cheerful</option>
                      <option>Professional</option>
                      <option>Communicative</option>
                    </select>
                  </div>
                </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic border-b border-white/5 pb-2">Style_Library</h4>
                {PRESETS.map(cat => (
                  <div key={cat.title} className="space-y-3">
                    <h3 className="text-[9px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic">{cat.title.replace(/_/g, ' ')}</h3>
                    {cat.items.map(p => (
                      <PresetCard
                        key={p.id}
                        name={p.name}
                        description={p.description}
                        prompt={p.prompt}
                        isActive={activePresetId === p.id}
                        onClick={() => handleSelectPreset(p.id)}
                        iconChar="V"
                      />
                    ))}
                  </div>
                ))}
             </div>
          </div>
        </>
      }
      canvas={
        <CanvasStage 
          uploadedImage={uploadedImage} 
          generatedOutput={generatedOutput} 
          isProcessing={isProcessing} 
          hudContent={<DevourerHUD devourerStatus={status} />} 
          onClear={() => { setUploadedImage(null); setGeneratedOutput(null); setDna(null); transition('STARVING'); }} 
          onFileUpload={handleFileUpload} 
          bridgeSource={initialData?.category === 'LATTICE_BRIDGE' ? latticeBuffer?.sourceMode : null}
        />
      }
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
          <GenerationBar
            prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isProcessing={isProcessing}
            activePresetName={activePreset?.name || dna?.name || globalDna?.name} placeholder="Describe subject (e.g. A couple with a kitten)..."
            refineButton={<button onClick={async () => { setIsRefining(true); setPrompt(await refineTextPrompt(prompt, PanelMode.VECTOR, kernelConfig, dna || undefined)); setIsRefining(false); }} className={`p-3 bg-black/40 border border-white/10 text-brandYellow rounded-sm ${isRefining ? 'animate-pulse' : ''}`}><SparkleIcon className="w-4 h-4" /></button>}
            bridgedThumbnail={initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null}
            onClearBridge={() => { if (onClearLattice) onClearLattice(); setUploadedImage(null); }}
          />
        </div>
      }
    />
  );
};
