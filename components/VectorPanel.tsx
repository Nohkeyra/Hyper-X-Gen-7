
// FINAL – LOCKED - REFINED V7.1
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SparkleIcon } from './Icons.tsx';
import { DevourerHUD } from './HUD.tsx';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, VectorPreset } from '../types.ts';
import { PRESET_REGISTRY } from '../presets/index.ts';
import { injectPresetTokens } from '../presets/enginePrompts.ts';
import { synthesizeVectorStyle, refineTextPrompt } from '../services/geminiService.ts';
import { useDevourer } from '../hooks/useDevourer.ts';
import { PresetCarousel } from './PresetCarousel.tsx';
import { GenerationBar } from './GenerationBar.tsx';
import { CanvasStage } from './CanvasStage.tsx';
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
  globalDna?: ExtractionResult | null;
  onSetGlobalDna?: (dna: ExtractionResult | null) => void;
  onStateUpdate?: (state: any) => void;
  addLog: (msg: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
}

export const VectorPanel: React.FC<VectorPanelProps> = ({
  initialData, 
  kernelConfig, 
  integrity,
  refinementLevel,
  uiRefined,
  onSaveToHistory,
  onModeSwitch,
  savedPresets = [], 
  globalDna, 
  onSetGlobalDna, 
  onStateUpdate, 
  addLog
}) => {
  const PRESETS: PresetCategory[] = useMemo(() => {
    let base = [...PRESET_REGISTRY.VECTOR.libraries];
    if (Array.isArray(savedPresets)) {
      const user = savedPresets.filter(p => p && (p.type === PanelMode.VECTOR || p.mode === PanelMode.VECTOR));
      if (user.length > 0) {
        const items = user.map(p => ({
          id: p.id || Math.random().toString(),
          name: p.name || "USER_DNA",
          type: PanelMode.VECTOR,
          category: "VAULT",
          description: p.description || "Stored fragment",
          dna: p.dna,
          prompt: p.prompt,
          imageUrl: p.imageUrl,
          parameters: p.parameters
        }));
        base = [{ title: "USER_VAULT", items }, ...base];
      }
    }
    return base;
  }, [savedPresets]);

  const { status, isProcessing, transition } = useDevourer(initialData?.dna || globalDna ? 'DNA_LINKED' : 'STARVING');
  
  const [complexity, setComplexity] = useState<'Standard' | 'Minimal' | 'Detailed'>('Standard');
  const [outline, setOutline] = useState<'None' | 'Medium-Bold'>('None');
  const [mood, setMood] = useState('Cheerful');
  
  const [prompt, setPrompt] = useState(() => {
    if (initialData?.source === 'EXTRACTION_BRIDGE') return '';
    return initialData?.prompt || '';
  });

  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<PresetItem | null>(null);
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

    if (item.parameters) {
      const params = item.parameters as unknown as VectorPreset['parameters'];
      if (params.complexity) setComplexity(params.complexity);
      if (params.outline) setOutline(params.outline);
      if (params.mood) setMood(params.mood);
    }

    if (item.dna) {
      setDna(item.dna);
      transition("DNA_LINKED");
      onSetGlobalDna?.(item.dna);
    }

    if ((item as any).imageUrl) setUploadedImage((item as any).imageUrl);
    addLog(`ILLUSTRATION_RECALL: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const handleGenerate = useCallback(async () => {
    if (processingRef.current) return;
    
    const userIntent = prompt.trim() || 'Modern subject';
    
    // GET STYLE TOKENS BASED ON PRESET
    const getStyleTokens = (presetName?: string): string => {
        const baseTokens = "modern flat illustration style, clean graphic design aesthetic";
        if (!presetName) return baseTokens;

        const presetStyleMap: Record<string, string> = {
            'grunge': 'distressed urban illustration, textured edges, grit overlay, raw street art aesthetic, bold lines',
            'elegant': 'luxury brand illustration, sophisticated design, premium gold accents, clean forms',
            'tech': 'futuristic tech illustration, clean lines, digital interface elements, cyan glow',
            'organic': 'natural flowing forms, soft edges, botanical motifs, earth tone palette',
            'retro': '80s/90s retro illustration, bright colors, geometric patterns, synthwave aesthetic',
            'minimal': 'minimalist flat design, simple shapes, high contrast negative space',
            'detailed': 'detailed vector illustration, intricate forms, textured line details, premium storytelling',
            'playful': 'playful cheerful illustration, rounded forms, vibrant pop color palette',
            'corporate': 'professional corporate illustration, clean geometric construction, balanced hierarchy'
        };

        const lowerPreset = presetName.toLowerCase();
        for (const [key, style] of Object.entries(presetStyleMap)) {
            if (lowerPreset.includes(key)) return `${baseTokens}, ${style}`;
        }
        return baseTokens;
    };

    const styleTokens = getStyleTokens(activePreset?.name);
    const finalPrompt = `"${userIntent}". ${styleTokens}. ${activePreset?.prompt || ""}`;
    
    console.log("FINAL PROMPT SENT TO AI:", finalPrompt);

    processingRef.current = true;
    transition(dna || globalDna ? 'DNA_STYLIZE_ACTIVE' : 'DEVOURING_BUFFER', true);
    
    // ENHANCED DIRECTIVES WITH COMPLEXITY CONTROL
    const extraDirectives = [
      `ENGINE_MODE: ${complexity.toUpperCase()}`,
      `OUTLINE_STYLE: ${outline.toUpperCase()}`,
      `MOOD_SETTING: ${mood.toUpperCase()}`,
      `COLOR_PALETTE: 4-8 bold solid colors`,
      `SIMPLIFICATION: ${complexity === 'Minimal' ? 'High' : 'Medium'}`,
      `OUTPUT_QUALITIES: Crisp Edges, Balanced Composition, Isolated Subject`
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
      addLog(`VECTOR_ILLUSTRATION: ${userIntent} in ${activePreset?.name || 'custom'} style`, 'success');
      onSaveToHistory({ 
        id: `vec-${Date.now()}`, 
        name: userIntent, 
        type: PanelMode.VECTOR, 
        prompt: userIntent, 
        dna: dna || globalDna, 
        imageUrl: uploadedImage,
        parameters: { complexity, outline, mood },
        styleUsed: activePreset?.name || 'custom'
      });
    } catch (e: any) { 
      transition('LATTICE_FAIL'); 
      addLog(`ERROR: ${e.message}`, 'error'); 
    } finally { 
      processingRef.current = false; 
      transition('LATTICE_ACTIVE'); 
    }
  }, [prompt, uploadedImage, activePreset, complexity, outline, mood, kernelConfig, dna, globalDna, transition, addLog, onSaveToHistory]);

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
                        <button 
                          key={mode}
                          onClick={() => setComplexity(mode as any)}
                          className={`py-1.5 text-[8px] font-black uppercase border transition-all ${complexity === mode ? 'bg-brandRed text-white border-brandRed' : 'bg-black/20 text-white/40 border-white/10 hover:border-brandRed/30'}`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-white/40">Outline_Weight</label>
                    <select value={outline} onChange={(e) => setOutline(e.target.value as any)} className="bg-black/40 border border-white/10 text-[10px] p-2 text-white outline-none">
                      <option>None</option>
                      <option>Medium-Bold</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-white/40">Visual_Mood</label>
                    <select value={mood} onChange={(e) => setMood(e.target.value)} className="bg-black/40 border border-white/10 text-[10px] p-2 text-white outline-none">
                      <option>Cheerful</option>
                      <option>Professional</option>
                      <option>Communicative</option>
                      <option>Avant-Garde</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-[7px] text-white/30 uppercase leading-tight font-bold italic">
                    Note: Engine prioritizes recognizable elegance over geometric perfection. 4-8 bold colors enforced.
                  </p>
                </div>
             </div>
          </div>
        </>
      }
      canvas={<CanvasStage uploadedImage={uploadedImage} generatedOutput={generatedOutput} isProcessing={isProcessing} hudContent={<DevourerHUD devourerStatus={status} />} onClear={() => { setUploadedImage(null); setGeneratedOutput(null); setDna(null); }} onFileUpload={(f) => { const r = new FileReader(); r.onload = e => setUploadedImage(e.target?.result as string); r.readAsDataURL(f); }} />}
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
          <GenerationBar
            prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isProcessing={isProcessing}
            activePresetName={activePreset?.name || dna?.name || globalDna?.name} placeholder="Describe subject (e.g. A couple with a kitten)..."
            refineButton={<button onClick={async () => { setIsRefining(true); setPrompt(await refineTextPrompt(prompt, PanelMode.VECTOR, kernelConfig, dna || undefined)); setIsRefining(false); }} className={`p-3 bg-black/40 border border-white/10 text-brandYellow rounded-sm ${isRefining ? 'animate-pulse' : ''}`}><SparkleIcon className="w-4 h-4" /></button>}
          />
        </div>
      }
    />
  );
};
