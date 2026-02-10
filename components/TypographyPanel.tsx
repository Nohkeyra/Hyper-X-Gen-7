
// FINAL – LOCKED - REFINED V7.1.3
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, TypographyPreset, Preset, LatticeBuffer, TypographyStyle } from '../types.ts';
import { getMobileCategories } from '../presets/index.ts';
import { synthesizeTypoStyle, refineTextPrompt } from '../services/geminiService.ts';
import { useDevourer } from '../hooks/useDevourer.ts';
import { PresetCard } from './PresetCard.tsx';
import { GenerationBar } from './GenerationBar.tsx';
import { PresetCarousel } from './PresetCarousel.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { DevourerHUD } from './HUD.tsx';
import { SparkleIcon } from './Icons.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';

interface TypographyPanelProps {
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
  onSetGlobalDna?: (dna: ExtractionResult | null) => void;
  globalDna?: ExtractionResult | null;
  latticeBuffer?: LatticeBuffer | null;
  onClearLattice?: () => void;
}

export const TypographyPanel: React.FC<TypographyPanelProps> = ({
  initialData,
  kernelConfig,
  onSaveToHistory,
  savedPresets = [],
  onStateUpdate,
  addLog,
  onSetGlobalDna,
  globalDna,
  latticeBuffer,
  onClearLattice
}) => {

  const PRESETS: PresetCategory[] = useMemo(() => {
    return getMobileCategories(PanelMode.TYPOGRAPHY, savedPresets);
  }, [savedPresets]);

  const { status, isProcessing, transition } = useDevourer(initialData?.dna || globalDna ? 'DNA_LINKED' : 'STARVING');

  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(initialData?.imageUrl || null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl && initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);
  const [activePreset, setActivePreset] = useState<PresetItem | null>(initialData || null);
  
  const [style, setStyle] = useState<TypographyStyle>('Modern');
  const [weight, setWeight] = useState<'Light' | 'Regular' | 'Bold' | 'Heavy'>('Bold');
  const [spacing, setSpacing] = useState<'Tight' | 'Normal' | 'Wide'>('Normal');
  const [effect, setEffect] = useState<'Shadow' | 'Glow' | 'Outline' | 'None'>('None');

  const [isRefining, setIsRefining] = useState(false);
  const processingRef = useRef(false);

  // History for Undo/Redo
  const [history, setHistory] = useState<string[]>(initialData?.imageUrl ? [initialData.imageUrl] : []);
  const [historyIndex, setHistoryIndex] = useState(initialData?.imageUrl ? 0 : -1);

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.TYPOGRAPHY,
      prompt,
      generatedOutput,
      uploadedImage,
      dna,
      name: prompt || 'Typography Synthesis',
      settings: { fontStyle: style, weight, spacing, effect }
    });
  }, [prompt, generatedOutput, uploadedImage, dna, onStateUpdate, style, weight, spacing, effect]);

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

    if (item.type === PanelMode.TYPOGRAPHY) {
      const params = (item as TypographyPreset).parameters;
      if (params.fontStyle) setStyle(params.fontStyle);
      if (params.weight) setWeight(params.weight);
      if (params.spacing) setSpacing(params.spacing);
      if (params.effect) setEffect(params.effect);
    }

    if (item.dna) {
      setDna(item.dna);
      transition("DNA_LINKED");
      onSetGlobalDna?.(item.dna);
    }

    addLog(`TYPO_RECALL: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const handleGenerate = useCallback(async () => {
    if (processingRef.current) return;
    
    const userText = prompt.trim() || 'HYPERX';
    const finalPrompt = `"${userText}" typography art. Design Style: ${style}. ${activePreset?.prompt || ""}`;
    
    processingRef.current = true;
    transition(dna || globalDna ? 'DNA_STYLIZE_ACTIVE' : 'DEVOURING_BUFFER', true);

    const extraDirectives = [
      `[WORD_AS_ART_PROTOCOL_V2]`,
      `TEXT_CONTENT: "${userText}"`,
      `DESIGN_STYLE: ${style.toUpperCase()}`,
      `FONT_WEIGHT: ${weight.toUpperCase()}`,
      `LETTER_SPACING: ${spacing.toUpperCase()}`,
      `VISUAL_EFFECT: ${effect.toUpperCase()}`,
      `COMPOSITION: Focused, centered typographic construct.`,
      activePreset?.styleDirective || ""
    ].join('\n');

    try {
      const result = await synthesizeTypoStyle(
        finalPrompt,
        uploadedImage || undefined,
        kernelConfig,
        dna || globalDna || undefined,
        extraDirectives
      );

      setGeneratedOutput(result);
      
      // Update History
      setHistory(prev => {
        const nextHistory = prev.slice(0, historyIndex + 1);
        return [...nextHistory, result];
      });
      setHistoryIndex(prev => prev + 1);

      addLog(`TYPO_SYNTHESIS: "${userText}" generated`, 'success');
      onSaveToHistory({
        id: `typo-${Date.now()}`,
        name: userText,
        type: PanelMode.TYPOGRAPHY,
        prompt: userText,
        dna: dna || globalDna,
        imageUrl: result,
        parameters: { fontStyle: style, weight, spacing, effect },
        category: 'Synthesis',
        description: 'User-generated typography'
      } as TypographyPreset);
    } catch (e: any) {
      addLog(`TYPO_ERROR: ${e.message}`, 'error');
      transition('LATTICE_FAIL');
    } finally {
      processingRef.current = false;
      transition('LATTICE_ACTIVE');
    }
  }, [prompt, uploadedImage, activePreset, style, weight, spacing, effect, kernelConfig, dna, globalDna, transition, addLog, onSaveToHistory, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGeneratedOutput(history[newIndex] || null);
      addLog("TYPO_UNDO: Reverting state", "info");
    }
  }, [historyIndex, history, addLog]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setGeneratedOutput(history[newIndex] || null);
      addLog("TYPO_REDO: Advancing state", "info");
    }
  }, [historyIndex, history, addLog]);

  const handleFileUpload = useCallback((f: File) => {
    const r = new FileReader();
    r.onload = e => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);
      setGeneratedOutput(null);
      setHistory([base64]);
      setHistoryIndex(0);
      transition('BUFFER_LOADED');
      addLog("SOURCE_BUFFER_LOADED: Ready for synthesis", "info");
    };
    r.readAsDataURL(f);
  }, [transition, addLog]);

  const handleRefine = async () => {
    if (!prompt.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const refined = await refineTextPrompt(prompt, PanelMode.TYPOGRAPHY, kernelConfig, dna || globalDna || undefined);
      setPrompt(refined);
      addLog("PROMPT_REFINED", "success");
    } catch {
      addLog("PROMPT_REFINE_FAIL", "error");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <PanelLayout
      sidebar={
        <>
          <SidebarHeader moduleNumber="Module_02" title="Typography_Engine" version="Kinetic Word Art v7.1" colorClass="text-brandBlue" borderColorClass="border-brandBlue" />
          <div className="space-y-6 px-1">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic border-b border-white/5 pb-2">Aesthetic_Controls</h4>
                
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-brandCharcoal/60 dark:text-white/40">Design_Style</label>
                    <select 
                      value={style} 
                      onChange={(e) => setStyle(e.target.value as TypographyStyle)} 
                      className="bg-brandCharcoal/40 dark:bg-black/40 border border-white/10 text-[10px] p-2 text-brandCharcoal dark:text-white outline-none focus:border-brandBlue transition-colors"
                    >
                      <option value="Modern">Modern</option>
                      <option value="Minimalist">Minimalist</option>
                      <option value="Geometric">Geometric</option>
                      <option value="Organic">Organic</option>
                      <option value="Grunge">Grunge</option>
                      <option value="Neon">Neon</option>
                      <option value="Cyberpunk">Cyberpunk</option>
                      <option value="Art Deco">Art Deco</option>
                      <option value="Retro">Retro</option>
                      <option value="Vintage">Vintage</option>
                      <option value="Watercolor">Watercolor</option>
                      <option value="Handwritten">Handwritten</option>
                      <option value="3D">3D</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-brandCharcoal/60 dark:text-white/40">Font_Weight</label>
                    <select 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value as any)} 
                      className="bg-brandCharcoal/40 dark:bg-black/40 border border-white/10 text-[10px] p-2 text-brandCharcoal dark:text-white outline-none focus:border-brandBlue transition-colors"
                    >
                      <option value="Light">Light</option>
                      <option value="Regular">Regular</option>
                      <option value="Bold">Bold</option>
                      <option value="Heavy">Heavy</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-brandCharcoal/60 dark:text-white/40">Letter_Spacing</label>
                    <select 
                      value={spacing} 
                      onChange={(e) => setSpacing(e.target.value as any)} 
                      className="bg-brandCharcoal/40 dark:bg-black/40 border border-white/10 text-[10px] p-2 text-brandCharcoal dark:text-white outline-none focus:border-brandBlue transition-colors"
                    >
                      <option value="Tight">Tight</option>
                      <option value="Normal">Normal</option>
                      <option value="Wide">Wide</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-brandCharcoal/60 dark:text-white/40">Visual_Effect</label>
                    <select 
                      value={effect} 
                      onChange={(e) => setEffect(e.target.value as any)} 
                      className="bg-brandCharcoal/40 dark:bg-black/40 border border-white/10 text-[10px] p-2 text-brandCharcoal dark:text-white outline-none focus:border-brandBlue transition-colors"
                    >
                      <option value="None">None</option>
                      <option value="Shadow">Shadow</option>
                      <option value="Glow">Glow</option>
                      <option value="Outline">Outline</option>
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
                        iconChar="T" 
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
          onClear={() => { 
            setGeneratedOutput(null); 
            setUploadedImage(null); 
            setDna(null); 
            setPrompt('');
            setHistory([]); 
            setHistoryIndex(-1); 
            transition('STARVING'); 
            onClearLattice?.();
          }} 
          onFileUpload={handleFileUpload}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          downloadFilename={`hyperxgen_typo_${Date.now()}.png`}
          bridgeSource={initialData?.category === 'LATTICE_BRIDGE' ? latticeBuffer?.sourceMode : null}
        />
      }
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
          <GenerationBar 
            prompt={prompt} 
            setPrompt={setPrompt} 
            onGenerate={handleGenerate} 
            isProcessing={isProcessing} 
            activePresetName={activePreset?.name || dna?.name || globalDna?.name} 
            placeholder="Enter words (1-3 ideal)..." 
            bridgedThumbnail={initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null}
            onClearBridge={() => { if (onClearLattice) onClearLattice(); setUploadedImage(null); }}
            refineButton={
              <button
                onClick={handleRefine}
                disabled={isProcessing || isRefining}
                className={`p-3 bg-black/40 border border-white/10 text-brandYellow rounded-sm ${isRefining ? 'animate-pulse' : ''}`}
                title="Refine Prompt"
              >
                <SparkleIcon className="w-4 h-4" />
              </button>
            }
          />
        </div>
      }
    />
  );
};
