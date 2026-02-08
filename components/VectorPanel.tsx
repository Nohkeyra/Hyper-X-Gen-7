import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, LogEntry } from '../types.ts';
import { PRESET_REGISTRY } from '../presets/index.ts';
import { synthesizeVectorStyle, refineTextPrompt, refineVectorComposition } from '../services/geminiService.ts';
import { useDevourer } from '../hooks/useDevourer.ts';
import { PresetCard } from './PresetCard.tsx';
import { GenerationBar } from './GenerationBar.tsx';
import { PresetCarousel } from './PresetCarousel.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { DevourerHUD } from './HUD.tsx';
import { SparkleIcon } from './Icons.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';

interface VectorPanelProps {
  initialData?: any;
  kernelConfig: KernelConfig;
  integrity: number;
  refinementLevel?: number;
  uiRefined?: boolean;
  onSaveToHistory: (work: any) => void;
  onModeSwitch: (mode: PanelMode, data?: any) => void;
  savedPresets: any[];
  onStateUpdate?: (state: any) => void;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
}

type GeometryEngine = 'primitives' | 'parametric' | 'organic' | 'hybrid';
type PrimitiveLock = 'circle' | 'square' | 'triangle' | 'all';
type AlignmentGrid = 'none' | 'square' | 'isometric' | 'golden';

export const VectorPanel: React.FC<VectorPanelProps> = ({
  initialData,
  kernelConfig,
  integrity,
  refinementLevel = 0,
  uiRefined,
  onSaveToHistory,
  onModeSwitch,
  savedPresets = [],
  onStateUpdate,
  addLog
}) => {
  const PRESETS = useMemo(() => {
    let presetsToRender: PresetCategory[] = [...PRESET_REGISTRY.VECTOR.libraries];
    if (Array.isArray(savedPresets)) {
      const userPresets = savedPresets.filter(p => p && (p.type === PanelMode.VECTOR || p.mode === PanelMode.VECTOR));
      if (userPresets.length > 0) {
        const grouped: Record<string, PresetItem[]> = {};
        userPresets.forEach(p => {
          const catName = p.category || p.dna?.category || "VAULT_ARCHIVES";
          if (!grouped[catName]) grouped[catName] = [];
          grouped[catName].push({
            id: p.id || Math.random().toString(),
            name: p.name || p.dna?.name || "UNNAMED_DNA",
            type: p.type as any || PanelMode.VECTOR,
            description: p.description || p.dna?.description || "Extracted Style DNA",
            dna: p.dna,
            prompt: p.prompt
          });
        });
        const userCategories = Object.entries(grouped).map(([title, items]) => ({ title: `USER_${title.toUpperCase()}`, items }));
        presetsToRender = [...userCategories, ...presetsToRender];
      }
    }
    return presetsToRender;
  }, [savedPresets]);

  const { status, isProcessing, transition } = useDevourer(initialData?.dna ? 'DNA_LINKED' : 'STARVING');

  // --- Architecture States ---
  const [engine, setEngine] = useState<GeometryEngine>('primitives');
  const [primLock, setPrimLock] = useState<PrimitiveLock>('all');
  const [nodeComplexity, setNodeComplexity] = useState<number>(5);
  const [strokeParity, setStrokeParity] = useState<boolean>(true);
  const [cornerRadius, setCornerRadius] = useState<number>(0);
  const [grid, setGrid] = useState<AlignmentGrid>('none');
  const [negativeSpace, setNegativeSpace] = useState<number>(20);

  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);
  const [activePreset, setActivePreset] = useState<PresetItem | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || initialData?.uploadedImage || null);
  const [prompt, setPrompt] = useState(''); 
  const [isRefining, setIsRefining] = useState(false);
  const [isRefiningComposition, setIsRefiningComposition] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(initialData?.generatedOutput || null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || null);
  const [isValidationError, setIsValidationError] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.VECTOR,
      prompt,
      generatedOutput,
      uploadedImage,
      dna,
      name: prompt || "Vector Synthesis",
      settings: { engine, primLock, nodeComplexity, strokeParity, cornerRadius, grid, negativeSpace }
    });
  }, [onStateUpdate, prompt, generatedOutput, uploadedImage, dna, engine, primLock, nodeComplexity, strokeParity, cornerRadius, grid, negativeSpace]);

  const handleSelectPreset = useCallback((id: string) => {
    if (isProcessing) return;

    if (activePresetId === id) {
      setActivePresetId(null);
      setActivePreset(null);
      setPrompt('');
      setDna(null);
      return;
    }

    setActivePresetId(id);
    const item = PRESETS.flatMap(c => c.items).find(i => i.id === id);
    if (!item) return;

    setActivePreset(item);

    // Inject DNA
    if (item.dna) {
      setDna(item.dna);
      transition("DNA_LINKED");
    }

    // Inject preset description into prompt
    if (item.description) {
      const personalityPrompt = `${item.description}. Generate clean geometric vectors, emphasizing symmetry, precision, and industrial aesthetic.`;
      setPrompt(personalityPrompt);
    }

    if ((item as any).imageUrl) setUploadedImage((item as any).imageUrl);
  }, [PRESETS, isProcessing, transition, activePresetId]);

  const handleRefine = async () => {
    if (!prompt.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const refined = await refineTextPrompt(prompt, PanelMode.VECTOR, kernelConfig, dna || undefined);
      setPrompt(refined);
    } catch (e) {
      console.error("Refinement failed");
      addLog("PROMPT_REFINE_FAILED", 'error');
    } finally {
      setIsRefining(false);
    }
  };

  const handleRefineComposition = async () => {
    if (!generatedOutput || isProcessing || isRefiningComposition) return;
    setIsRefiningComposition(true);
    transition("REFINING_LATTICE" as any, true);
    try {
      const result = await refineVectorComposition(generatedOutput, kernelConfig);
      setGeneratedOutput(result);
      transition("LATTICE_ACTIVE");
      onSaveToHistory({
        id: `vec-refine-${Date.now()}`,
        name: `Refined: ${prompt.slice(0,15) || 'Composition'}`,
        description: 'AI Composition Refinement',
        type: PanelMode.VECTOR,
        prompt: prompt,
        dna: dna || undefined,
        imageUrl: uploadedImage,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch(e: any) {
      console.error("Composition refinement failed:", e);
      addLog(`COMPOSITION_REFINE_ERROR: ${e.message}`, 'error');
      transition("LATTICE_FAIL");
    } finally {
      setIsRefiningComposition(false);
    }
  };

  const handleGenerate = async () => {
    if (processingRef.current) return;
    const effectivePrompt = prompt.trim() || (uploadedImage ? "Refine silhouette into geometric paths." : "Abstract geometric synthesis.");
    const combinedPrompt = [activePreset?.prompt, effectivePrompt].filter(Boolean).join('. ');

    const extraDirectives = `GEOMETRY_ENGINE: ${engine.toUpperCase()} PRIMITIVE_LOCK: ${primLock.toUpperCase()} NODE_COMPLEXITY: ${nodeComplexity} STROKE_PARITY: ${strokeParity ? 'MONOWEIGHT' : 'VARYING'} CORNER_RADIUS: ${cornerRadius}% ALIGNMENT_GRID: ${grid.toUpperCase()} NEGATIVE_SPACE: ${negativeSpace}%`.trim();

    processingRef.current = true;
    transition(dna ? "DNA_STYLIZE_ACTIVE" as any : "DEVOURING_BUFFER", true);
    setIsValidationError(false);

    try {
      const result = await synthesizeVectorStyle(combinedPrompt, uploadedImage || undefined, kernelConfig, dna || undefined, extraDirectives);
      setGeneratedOutput(result);
      transition("LATTICE_ACTIVE");
      onSaveToHistory({
        id: `vec-${Date.now()}`,
        name: effectivePrompt.slice(0, 15),
        description: uploadedImage ? `Vectorized image using ${engine} engine` : `Vector synthesis using ${engine} engine`,
        type: PanelMode.VECTOR,
        prompt: combinedPrompt,
        settings: { engine, primLock, nodeComplexity, strokeParity, cornerRadius, grid, negativeSpace },
        dna: dna || undefined,
        imageUrl: uploadedImage,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (e: any) {
      console.error(e);
      addLog(`SYNTHESIS_ERROR: ${e?.message || 'Unknown error'}`, 'error');
      transition("LATTICE_FAIL");
      setIsValidationError(true);
    } finally { 
      processingRef.current = false;
    }
  };

  // Fix: Implemented the missing sidebar UI, including controls and presets.
  const SidebarContent = (
    <>
      <SidebarHeader 
        moduleNumber="Module_01" 
        title="Vector Architect" 
        version="v5.2"
        colorClass="text-brandRed"
        borderColorClass="border-brandRed"
      />
      
      <div className="space-y-10 mb-12">
        <section>
          <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/30 tracking-widest mb-4 border-b border-brandCharcoal/10 dark:border-white/5 pb-2">Primary Logic</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40 mb-1.5 block">Geometry Engine</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['primitives', 'parametric', 'organic', 'hybrid'] as GeometryEngine[]).map(m => (
                  <button key={m} onClick={() => setEngine(m)} className={`py-2 text-[8px] font-black uppercase tracking-widest border-2 transition-all rounded-sm ${engine === m ? 'bg-brandCharcoal text-white border-brandCharcoal dark:bg-brandRed dark:border-brandRed' : 'border-brandCharcoal/10 text-brandCharcoal/40 dark:border-white/5 dark:text-white/40 hover:border-brandCharcoal dark:hover:border-white/20'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40 mb-1.5 block">Primitive Lock</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['circle', 'square', 'triangle', 'all'] as PrimitiveLock[]).map(m => (
                  <button key={m} onClick={() => setPrimLock(m)} className={`py-2 text-[8px] font-black uppercase tracking-widest border-2 transition-all rounded-sm ${primLock === m ? 'bg-brandCharcoal text-white border-brandCharcoal dark:bg-brandRed dark:border-brandRed' : 'border-brandCharcoal/10 text-brandCharcoal/40 dark:border-white/5 dark:text-white/40 hover:border-brandCharcoal dark:hover:border-white/20'}`}>{m}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/30 tracking-widest mb-4 border-b border-brandCharcoal/10 dark:border-white/5 pb-2">Complexity & Form</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Node Complexity</label>
                <span className="text-[8px] font-black text-brandRed">{nodeComplexity}/10</span>
              </div>
              <input type="range" min="1" max="10" value={nodeComplexity} onChange={e => setNodeComplexity(parseInt(e.target.value))} className="w-full h-1.5 bg-brandCharcoal/5 dark:bg-white/5 appearance-none rounded-full accent-brandRed" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Corner Radius</label>
                <span className="text-[8px] font-black text-brandRed">{cornerRadius}%</span>
              </div>
              <input type="range" min="0" max="50" value={cornerRadius} onChange={e => setCornerRadius(parseInt(e.target.value))} className="w-full h-1.5 bg-brandCharcoal/5 dark:bg-white/5 appearance-none rounded-full accent-brandRed" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Negative Space</label>
                <span className="text-[8px] font-black text-brandRed">{negativeSpace}%</span>
              </div>
              <input type="range" min="5" max="50" value={negativeSpace} onChange={e => setNegativeSpace(parseInt(e.target.value))} className="w-full h-1.5 bg-brandCharcoal/5 dark:bg-white/5 appearance-none rounded-full accent-brandRed" />
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/30 tracking-widest mb-4 border-b border-brandCharcoal/10 dark:border-white/5 pb-2">Alignment & Parity</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40 mb-1.5 block">Alignment Grid</label>
              <select value={grid} onChange={e => setGrid(e.target.value as any)} className="w-full bg-transparent border-2 border-brandCharcoal/10 dark:border-white/5 text-[8px] font-black uppercase px-2 py-1.5 rounded-sm outline-none focus:border-brandRed">
                <option value="none">None</option>
                <option value="square">Square</option>
                <option value="isometric">Isometric</option>
                <option value="golden">Golden Ratio</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Stroke Parity (Monoweight)</label>
              <button onClick={() => setStrokeParity(!strokeParity)} className={`w-10 h-5 rounded-full p-1 transition-colors ${strokeParity ? 'bg-brandRed' : 'bg-brandCharcoal/20 dark:bg-white/10'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${strokeParity ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-8">
        {PRESETS.map((cat, i) => (
          <div key={i} className="animate-in fade-in slide-in-left duration-500" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-3 bg-brandCharcoal dark:bg-white/40 rounded-full" />
              <h3 className="text-[9px] font-black uppercase text-brandCharcoal dark:text-white tracking-[0.25em]">{cat.title}</h3>
            </div>
            <div className="space-y-3">
              {cat.items.map(item => (
                <PresetCard 
                  key={item.id} 
                  name={item.name} 
                  description={item.description} 
                  isActive={activePresetId === item.id} 
                  onClick={() => handleSelectPreset(item.id)} 
                  iconChar="V" 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <PanelLayout sidebar={SidebarContent}>
      <CanvasStage
        uploadedImage={uploadedImage}
        generatedOutput={generatedOutput}
        isProcessing={isProcessing || isRefiningComposition}
        hudContent={<DevourerHUD devourerStatus={dna?.name ? `DNA_LINKED: ${dna.name.toUpperCase()}` : status} />}
        isValidationError={isValidationError}
        uiRefined={uiRefined}
        refinementLevel={refinementLevel}
        onClear={() => { setUploadedImage(null); setGeneratedOutput(null); setDna(null); setActivePresetId(null); setActivePreset(null); setPrompt(''); transition("STARVING"); }}
        onGenerate={handleGenerate}
        onFileUpload={(file) => {
          const reader = new FileReader();
          reader.onload = e => { setUploadedImage(e.target?.result as string); transition("BUFFER_LOADED"); };
          reader.readAsDataURL(file);
        }}
        downloadFilename={`hyperxgen_vector_${Date.now()}.png`}
      />
      <div className="flex flex-col gap-6">
        <GenerationBar 
          prompt={prompt} 
          setPrompt={setPrompt} 
          onGenerate={handleGenerate} 
          isProcessing={isProcessing || isRefiningComposition} 
          activePresetName={activePreset?.name || dna?.name} 
          refineButton={
            <button 
              onClick={handleRefine}
              disabled={isProcessing || isRefining || !prompt.trim()}
              className={`p-3 bg-black/40 border border-white/10 text-brandYellow hover:text-white transition-all rounded-sm group ${isRefining ? 'animate-pulse' : ''}`}
              title="AI Prompt Refinement"
            >
              <SparkleIcon className={`w-4 h-4 ${isRefining ? 'animate-spin' : 'group-hover:scale-110'}`} />
            </button>
          } 
        />
        <PresetCarousel presets={PRESETS as any} activeId={activePresetId} onSelect={handleSelectPreset} />
      </div>
    </PanelLayout>
  );
};