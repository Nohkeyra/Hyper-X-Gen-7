
// FINAL – LOCKED - REFINED V7.2
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, MonogramPreset, Preset, LatticeBuffer } from '../types.ts';
import { getMobileCategories } from '../presets/index.ts';
import { synthesizeMonogramStyle, refineTextPrompt } from '../services/geminiService.ts';
import { useDevourer } from '../hooks/useDevourer.ts';
import { GenerationBar } from './GenerationBar.tsx';
import { PresetCarousel } from './PresetCarousel.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { DevourerHUD } from './HUD.tsx';
import { SparkleIcon } from './Icons.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';
import { PresetCard } from './PresetCard.tsx';

interface MonogramPanelProps {
  initialData?: any; 
  kernelConfig: KernelConfig; 
  savedPresets: any[]; 
  onSaveToHistory: (work: any) => void;
  onStateUpdate?: (state: any) => void; 
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  onSetGlobalDna?: (dna: ExtractionResult | null) => void; 
  globalDna?: ExtractionResult | null;
  latticeBuffer?: LatticeBuffer | null;
  onClearLattice?: () => void;
}

export const MonogramPanel: React.FC<MonogramPanelProps> = ({
  initialData, kernelConfig, savedPresets = [], onSaveToHistory, addLog, onSetGlobalDna, globalDna, onStateUpdate, latticeBuffer, onClearLattice
}) => {
  const PRESETS: PresetCategory[] = useMemo(() => {
    return getMobileCategories(PanelMode.MONOGRAM, savedPresets);
  }, [savedPresets]);

  const { status, isProcessing, transition } = useDevourer(initialData?.dna || globalDna ? 'DNA_LINKED' : 'STARVING');
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl && initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);
  const [activePreset, setActivePreset] = useState<PresetItem | null>(initialData || null);
  
  const [structureCreativity, setStructureCreativity] = useState(50);
  const [densitySpace, setDensitySpace] = useState(50);
  const [traditionalModern, setTraditionalModern] = useState(50);

  const [symmetryType, setSymmetryType] = useState('Perfect Radial');
  const [containmentType, setContainmentType] = useState('Suggested');
  const [strokeEnds, setStrokeEnds] = useState('Rounded');

  const processingRef = useRef(false);

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.MONOGRAM,
      prompt,
      dna,
      uploadedImage,
      generatedOutput,
      settings: { 
        structureCreativity,
        densitySpace,
        traditionalModern,
        symmetryType,
        containmentType,
        strokeEnds
      }
    });
  }, [onStateUpdate, prompt, dna, uploadedImage, generatedOutput, structureCreativity, densitySpace, traditionalModern, symmetryType, containmentType, strokeEnds]);

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

    if (item.type === PanelMode.MONOGRAM) {
      const params = (item as MonogramPreset).parameters;
      if (params.structureCreativity !== undefined) setStructureCreativity(params.structureCreativity);
      if (params.densitySpace !== undefined) setDensitySpace(params.densitySpace);
      if (params.traditionalModern !== undefined) setTraditionalModern(params.traditionalModern);
      if (params.symmetry) setSymmetryType(params.symmetry);
      if (params.container) setContainmentType(params.container);
      if (params.strokeEnds) setStrokeEnds(params.strokeEnds);
    }

    if (item.dna) {
      setDna(item.dna);
      transition("DNA_LINKED");
      onSetGlobalDna?.(item.dna);
    }

    addLog(`REFINED_RECALL: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const handleGenerate = useCallback(async () => {
    if (processingRef.current) return;
    const userInitials = prompt.trim() || "HXG";
    const styleDir = activePreset?.styleDirective || "";
    
    const finalPrompt = `Initials "${userInitials}". Monogram logo design. Style: ${activePreset?.prompt || "Corporate"}. Directives: ${styleDir}`;
    
    processingRef.current = true;
    transition(dna || globalDna ? "DNA_STYLIZE_ACTIVE" : "DEVOURING_BUFFER", true);

    const extraParams = [
      `[CRITICAL_TEXT_LOCK_ACTIVE]`,
      `1. PERMITTED_ALPHANUMERIC: "${userInitials}" ONLY.`,
      `2. SYMMETRY_ENGINE: ${symmetryType}`,
      `3. CONTAINER_TYPE: ${containmentType}`,
      `4. CREATIVITY_INDEX: ${structureCreativity}%`,
      `5. DENSITY_RATIO: ${densitySpace}%`,
      `6. AESTHETIC_BIAS: ${traditionalModern}%`,
      `7. GEOMETRY_END: ${strokeEnds.toUpperCase()}`,
      `8. COMPOSITION_RULE: Do not generate any words or sentences. ONLY render the visual symbol formed by "${userInitials}".`,
      activePreset?.styleDirective || ""
    ].join('\n');

    try {
      const result = await synthesizeMonogramStyle(finalPrompt, uploadedImage || undefined, kernelConfig, dna || globalDna || undefined, extraParams);
      setGeneratedOutput(result);
      onSaveToHistory({ 
        id: `mono-${Date.now()}`, 
        name: userInitials, 
        type: PanelMode.MONOGRAM, 
        prompt: userInitials, 
        dna: dna || globalDna, 
        imageUrl: result,
        parameters: { structureCreativity, densitySpace, traditionalModern, symmetryType, containmentType, strokeEnds },
        category: 'Synthesis',
        description: 'User-generated monogram'
      } as any);
      addLog(`MONOGRAM_CREATED: "${userInitials}" with ${activePreset?.name || 'custom'} style`, 'success');
    } catch (e: any) { 
      transition("LATTICE_FAIL"); 
      addLog(`MONOGRAM_ERROR: ${e.message}`, 'error'); 
    } finally { 
      processingRef.current = false; 
      transition("LATTICE_ACTIVE"); 
    }
  }, [prompt, activePreset, dna, globalDna, kernelConfig, uploadedImage, structureCreativity, densitySpace, traditionalModern, symmetryType, containmentType, strokeEnds, transition, onSaveToHistory, addLog]);

  const handleFileUpload = useCallback((f: File) => {
    const r = new FileReader(); 
    r.onload = e => {
      setUploadedImage(e.target?.result as string);
      setGeneratedOutput(null);
      transition('BUFFER_LOADED');
      addLog("MONO_SOURCE_LOADED", "info");
    }; 
    r.readAsDataURL(f); 
  }, [transition, addLog]);

  return (
    <PanelLayout 
      sidebar={
        <>
          <SidebarHeader moduleNumber="Module_03" title="Monogram_Engine" version="Refined Elegance v7.2" colorClass="text-brandRed" borderColorClass="border-brandRed" />
          <div className="space-y-6 px-1">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic border-b border-white/5 pb-2">User_Controls</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Structure Creativity', val: structureCreativity, set: setStructureCreativity },
                    { label: 'Density Space', val: densitySpace, set: setDensitySpace },
                    { label: 'Traditional Modern', val: traditionalModern, set: setTraditionalModern }
                  ].map(s => (
                    <div key={s.label} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase">
                        <span className="text-white/40">{s.label.split(' ')[0]}</span>
                        <span className="text-brandRed">{s.label.split(' ')[1]}</span>
                      </div>
                      <input type="range" min="0" max="100" value={s.val} onChange={(e) => s.set(parseInt(e.target.value))} className="w-full accent-brandRed" />
                    </div>
                  ))}
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-white/40">Symmetry_Type</label>
                    <select value={symmetryType} onChange={(e) => setSymmetryType(e.target.value)} className="bg-brandCharcoal/40 dark:bg-black/40 border border-white/10 text-[10px] p-2 text-white outline-none">
                      <option>Perfect Radial</option><option>Vertical Mirror</option><option>Asymmetrical</option><option>Dynamic</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-white/40">Container_Mode</label>
                    <select value={containmentType} onChange={(e) => setContainmentType(e.target.value)} className="bg-brandCharcoal/40 dark:bg-black/40 border border-white/10 text-[10px] p-2 text-white outline-none">
                      <option>Strict</option><option>Suggested</option><option>Weak</option><option>None</option>
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
                      <PresetCard key={p.id} name={p.name} description={p.description} prompt={p.prompt} isActive={activePresetId === p.id} onClick={() => handleSelectPreset(p.id)} iconChar="M" />
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
          onClear={() => { setGeneratedOutput(null); setUploadedImage(null); setDna(null); transition('STARVING'); }} 
          onFileUpload={handleFileUpload} 
          bridgeSource={initialData?.category === 'LATTICE_BRIDGE' ? latticeBuffer?.sourceMode : null}
        />
      }
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
          <GenerationBar 
            prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isProcessing={isProcessing} 
            activePresetName={activePreset?.name || dna?.name || globalDna?.name} placeholder="Enter initials (e.g. HXG)..." 
            bridgedThumbnail={initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null}
            onClearBridge={() => { if (onClearLattice) onClearLattice(); setUploadedImage(null); }}
          />
        </div>
      }
    />
  );
};
