
// FINAL – LOCKED - REFINED V7.1
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, MonogramPreset } from '../types.ts';
import { PRESET_REGISTRY } from '../presets/index.ts';
import { injectPresetTokens } from '../presets/enginePrompts.ts';
import { synthesizeMonogramStyle, refineTextPrompt } from '../services/geminiService.ts';
import { useDevourer } from '../hooks/useDevourer.ts';
import { GenerationBar } from './GenerationBar.tsx';
import { PresetCarousel } from './PresetCarousel.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { DevourerHUD } from './HUD.tsx';
import { SparkleIcon } from './Icons.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';

interface MonogramPanelProps {
  initialData?: any; 
  kernelConfig: KernelConfig; 
  savedPresets: any[]; 
  onSaveToHistory: (work: any) => void;
  onStateUpdate?: (state: any) => void; 
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  onSetGlobalDna?: (dna: ExtractionResult | null) => void; 
  globalDna?: ExtractionResult | null;
}

export const MonogramPanel: React.FC<MonogramPanelProps> = ({
  initialData, kernelConfig, savedPresets = [], onSaveToHistory, addLog, onSetGlobalDna, globalDna, onStateUpdate
}) => {
  const PRESETS = useMemo(() => {
    let base = [...PRESET_REGISTRY.MONOGRAM.libraries];
    if (Array.isArray(savedPresets)) {
      const user = savedPresets.filter(p => p && (p.type === PanelMode.MONOGRAM || p.mode === PanelMode.MONOGRAM));
      if (user.length > 0) {
        const items = user.map(p => ({ 
          id: p.id, 
          name: p.name || "USER_DNA", 
          type: PanelMode.MONOGRAM, 
          category: "VAULT", 
          description: p.description, 
          dna: p.dna, 
          prompt: p.prompt, 
          parameters: p.parameters,
          imageUrl: p.imageUrl 
        }));
        base = [{ title: "USER_VAULT", items }, ...base];
      }
    }
    return base;
  }, [savedPresets]);

  const { status, isProcessing, transition } = useDevourer(initialData?.dna || globalDna ? 'DNA_LINKED' : 'STARVING');
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<PresetItem | null>(null);
  
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
      settings: { 
        structureCreativity,
        densitySpace,
        traditionalModern,
        symmetryType,
        containmentType,
        strokeEnds
      }
    });
  }, [onStateUpdate, prompt, dna, uploadedImage, structureCreativity, densitySpace, traditionalModern, symmetryType, containmentType, strokeEnds]);

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
      const params = item.parameters as unknown as MonogramPreset['parameters'];
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

    if ((item as any).imageUrl) setUploadedImage((item as any).imageUrl);
    addLog(`REFINED_RECALL: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const handleGenerate = useCallback(async () => {
    if (processingRef.current) return;
    const userInitials = prompt.trim() || "HXG";
    
    // PRESET-AWARE STYLE INJECTION
    const getPresetStyle = (presetName?: string): string => {
        if (!presetName) return 'geometric monogram style, clean lines';
        const presetMap: Record<string, string> = {
            'corporate': 'corporate seal monogram, clean lines, geometric symmetry, official document style',
            'luxury': 'luxury brand monogram, elegant curves, gold/silver palette, high fashion aesthetic',
            'personal': 'personal script monogram, flowing curves, handwritten feel, unique character ink',
            'modern': 'modern abstract monogram, geometric interpretation, bold minimalist blocks',
            'art deco': 'Art Deco monogram, geometric patterns, sunburst motifs, metallic gradients',
            'vintage': 'vintage monogram, ornate details, classic engraving style, Victorian embellishment'
        };

        const lowerPreset = presetName.toLowerCase();
        for (const [key, style] of Object.entries(presetMap)) {
            if (lowerPreset.includes(key)) return style;
        }
        return 'monogram design, clean vector style';
    };

    const presetStyle = getPresetStyle(activePreset?.name);
    const finalPrompt = `"${userInitials}" monogram. ${presetStyle}. ${activePreset?.prompt || ""}`;
    
    console.log("FINAL PROMPT SENT TO AI:", finalPrompt);

    processingRef.current = true;
    transition(dna || globalDna ? "DNA_STYLIZE_ACTIVE" : "DEVOURING_BUFFER", true);

    const extraParams = [
      `[PROTOCOL: REFINED_MONOGRAM_PROTOCOL]`,
      `1. INITIALS: "${userInitials}" must be discernible`,
      `2. SYMMETRY: ${symmetryType}`,
      `3. CONTAINER: ${containmentType}`,
      `4. CREATIVITY_LEVEL: ${structureCreativity}%`,
      `5. DENSITY: ${densitySpace}%`,
      `6. MODERNITY: ${traditionalModern}%`,
      `7. STROKE_ENDS: ${strokeEnds.toUpperCase()}`,
      `STYLE_GUIDE: ${presetStyle}`
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
        imageUrl: uploadedImage,
        parameters: { structureCreativity, densitySpace, traditionalModern, symmetryType, containmentType, strokeEnds },
        styleUsed: activePreset?.name || 'custom'
      });
      addLog(`MONOGRAM_CREATED: "${userInitials}" with ${activePreset?.name || 'custom'} style`, 'success');
    } catch (e: any) { 
      transition("LATTICE_FAIL"); 
      addLog(`MONOGRAM_ERROR: ${e.message}`, 'error'); 
    } finally { 
      processingRef.current = false; 
      transition("LATTICE_ACTIVE"); 
    }
  }, [prompt, activePreset, dna, globalDna, kernelConfig, uploadedImage, structureCreativity, densitySpace, traditionalModern, symmetryType, containmentType, strokeEnds, transition, onSaveToHistory, addLog]);

  return (
    <PanelLayout 
      sidebar={
        <>
          <SidebarHeader moduleNumber="Module_03" title="Monogram_Engine" version="Refined Elegance v7.1" colorClass="text-brandRed" borderColorClass="border-brandRed" />
          
          <div className="space-y-6 px-1">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic border-b border-white/5 pb-2">User_Controls</h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="text-white/40">Structure</span>
                      <span className="text-brandRed">Creativity</span>
                    </div>
                    <input type="range" min="0" max="100" value={structureCreativity} onChange={(e) => setStructureCreativity(parseInt(e.target.value))} className="w-full accent-brandRed" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="text-white/40">Density</span>
                      <span className="text-brandRed">Space</span>
                    </div>
                    <input type="range" min="0" max="100" value={densitySpace} onChange={(e) => setDensitySpace(parseInt(e.target.value))} className="w-full accent-brandRed" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="text-white/40">Traditional</span>
                      <span className="text-brandRed">Modern</span>
                    </div>
                    <input type="range" min="0" max="100" value={traditionalModern} onChange={(e) => setTraditionalModern(parseInt(e.target.value))} className="w-full accent-brandRed" />
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-white/40">Symmetry_Type</label>
                    <select value={symmetryType} onChange={(e) => setSymmetryType(e.target.value)} className="bg-black/40 border border-white/10 text-[10px] p-2 text-white outline-none">
                      <option>Perfect Radial</option>
                      <option>Vertical Mirror</option>
                      <option>Asymmetrical</option>
                      <option>Dynamic</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-white/40">Container_Mode</label>
                    <select value={containmentType} onChange={(e) => setContainmentType(e.target.value)} className="bg-black/40 border border-white/10 text-[10px] p-2 text-white outline-none">
                      <option>Strict</option>
                      <option>Suggested</option>
                      <option>Weak</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>
             </div>
          </div>
        </>
      }
      canvas={<CanvasStage uploadedImage={uploadedImage} generatedOutput={generatedOutput} isProcessing={isProcessing} hudContent={<DevourerHUD devourerStatus={status} />} onClear={() => { setGeneratedOutput(null); setUploadedImage(null); setDna(null); }} onFileUpload={(f) => { const r = new FileReader(); r.onload = e => setUploadedImage(e.target?.result as string); r.readAsDataURL(f); }} />}
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
          <GenerationBar prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isProcessing={isProcessing} activePresetName={activePreset?.name || dna?.name || globalDna?.name} placeholder="Enter initials (e.g. HXG)..." />
        </div>
      }
    />
  );
};
