// FINAL – LOCKED - REFINED V7.2.5
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, MonogramPreset, Preset, LatticeBuffer, MonogramDna, ImageEngine } from '../types.ts';
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
  const [generationNonce, setGenerationNonce] = useState(0); // Add generationNonce
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl && initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);
  const [activePreset, setActivePreset] = useState<PresetItem | null>(initialData || null);
  
  const [isRefining, setIsRefining] = useState(false);
  
  // History for Undo/Redo
  const [history, setHistory] = useState<string[]>(initialData?.imageUrl ? [initialData.imageUrl] : []);
  const [historyIndex, setHistoryIndex] = useState(initialData?.imageUrl ? 0 : -1);

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.MONOGRAM,
      prompt,
      dna,
      uploadedImage,
      generatedOutput,
      settings: (activePreset as MonogramPreset)?.parameters || {}
    });
  }, [onStateUpdate, prompt, dna, uploadedImage, generatedOutput, activePreset]);

  const handleSelectPreset = useCallback((id: string) => {
    if (isProcessing) return;

    if (activePresetId === id) {
      setActivePresetId(null);
      setActivePreset(null);
      setDna(null);
      onSetGlobalDna?.(null);
      setGenerationNonce(0); // Reset nonce if preset is deselected
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
    setGenerationNonce(0); // Reset nonce on new preset selection
    addLog(`REFINED_RECALL: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const setPromptAndResetNonce = useCallback((value: string) => {
    setPrompt(value);
    setGenerationNonce(0); // Reset nonce if prompt changes
  }, []);

  const handleGenerate = useCallback(async () => {
    if (isProcessing || !activePreset) {
      if(!activePreset) addLog("MONOGRAM_ERROR: No preset selected.", 'error');
      return;
    }

    if (uploadedImage && kernelConfig.imageEngine === ImageEngine.HF) {
      addLog(`ENGINE_ERROR: The ${kernelConfig.imageEngine.toUpperCase()} engine does not support image input. Please switch to Gemini or remove the image.`, 'error');
      transition('LATTICE_FAIL');
      return;
    }

    const userInitials = prompt.trim() || "HXG";
    const presetParams = (activePreset as MonogramPreset).parameters;
    
    const finalPrompt = `A monogram of the initials "${userInitials}". The style is "${(activePreset as MonogramPreset).name}". ${activePreset?.prompt || ""}`;
    
    transition(dna || globalDna ? "DNA_STYLIZE_ACTIVE" : "DEVOURING_BUFFER", true);
    setGenerationNonce(prev => prev + 1); // Increment nonce for new generation attempt

    const extraDirectives = [
      `[DIRECTIVE: REFINED_MONOGRAM_V8]`,
      `PERMITTED_ALPHANUMERIC: "${userInitials}" ONLY.`,
      `LETTER_RELATIONSHIP: ${presetParams.letter_relationship}`,
      `SYMMETRY: ${presetParams.symmetry}`,
      `CONTAINER: ${presetParams.container}`,
      `LEGIBILITY_TARGET: ${presetParams.legibility_target}`,
      `FORM_LANGUAGE: ${presetParams.form_language}`,
      `STROKE_CHARACTER: ${presetParams.stroke_character}`,
      `SPATIAL_DENSITY: ${presetParams.spatial_density}`,
      `ABSTRACTION_TOLERANCE: ${presetParams.abstraction_tolerance}`,
      `PERIOD_INFLUENCE: ${presetParams.period_influence}`,
      `FUSION_MANDATE: Letters must interlock, overlap, or connect.`,
      activePreset?.styleDirective || ""
    ].filter(Boolean).join('\n');

    try {
      const result = await synthesizeMonogramStyle(finalPrompt, uploadedImage || undefined, kernelConfig, dna || globalDna || undefined, extraDirectives, generationNonce); // Pass generationNonce
      setGeneratedOutput(result);
      
      setHistory(prev => {
        const nextHistory = prev.slice(0, historyIndex + 1);
        return [...nextHistory, result];
      });
      setHistoryIndex(prev => prev + 1);

      onSaveToHistory({ 
        id: `mono-${Date.now()}`, 
        name: userInitials, 
        type: PanelMode.MONOGRAM, 
        prompt: userInitials, 
        dna: dna || globalDna, 
        imageUrl: result,
        parameters: presetParams,
        category: 'Synthesis',
        description: 'User-generated monogram'
      } as any);
      addLog(`MONOGRAM_CREATED: "${userInitials}" with ${presetParams.period_influence} style`, 'success');
    } catch (e: any) { 
      transition("LATTICE_FAIL"); 
      addLog(`${e.message}`, 'error'); 
    } finally { 
      transition("LATTICE_ACTIVE"); 
    }
  }, [prompt, activePreset, dna, globalDna, kernelConfig, uploadedImage, transition, onSaveToHistory, addLog, historyIndex, generationNonce, isProcessing]); // Add isProcessing as dependency

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGeneratedOutput(history[newIndex] || null);
      addLog("MONO_UNDO: Reverting state", "info");
    }
  }, [historyIndex, history, addLog]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setGeneratedOutput(history[newIndex] || null);
      addLog("MONO_REDO: Advancing state", "info");
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
      setGenerationNonce(0); // Reset nonce on file upload
      addLog("MONO_SOURCE_LOADED", "info");
    }; 
    r.readAsDataURL(f); 
  }, [transition, addLog]);

  const handleRefine = async () => {
    if (!prompt.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const refined = await refineTextPrompt(prompt, PanelMode.MONOGRAM, kernelConfig, dna || globalDna || undefined);
      setPromptAndResetNonce(refined); // Use new setter
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
          <SidebarHeader moduleNumber="Module_03" title="Monogram_Engine" version="Identity Mark Synthesis v8.0" colorClass="text-brandRed" borderColorClass="border-brandRed" />
          <div className="space-y-6 px-1">
             <div className="p-3 bg-brandRed/5 dark:bg-brandYellow/5 border border-brandRed/20 dark:border-brandYellow/20 rounded-sm mb-6">
                <span className="text-[8px] font-black text-brandRed dark:text-brandYellow uppercase tracking-widest block mb-1">Instruction:</span>
                <p className="text-[9px] text-brandCharcoalMuted dark:text-white/60 leading-tight">Enter initials. Select an authoritative style preset. Each preset is a complete aesthetic system that dictates how letters fuse, align, and resolve into a finished identity mark. No manual adjustments are available.</p>
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
          onClear={() => { setGeneratedOutput(null); setUploadedImage(null); setDna(null); setHistory([]); setHistoryIndex(-1); transition('STARVING'); setGenerationNonce(0); }} // Reset nonce on clear
          onFileUpload={handleFileUpload}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          bridgeSource={initialData?.category === 'LATTICE_BRIDGE' ? latticeBuffer?.sourceMode : null}
        />
      }
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
          <GenerationBar 
            prompt={prompt} setPrompt={setPromptAndResetNonce} onGenerate={handleGenerate} isProcessing={isProcessing || !activePreset} 
            activePresetName={activePreset?.name || dna?.name || globalDna?.name} placeholder="Enter initials (e.g. HXG)..." 
            bridgedThumbnail={initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null}
            onClearBridge={() => { if (onClearLattice) onClearLattice(); setUploadedImage(null); setGenerationNonce(0); }}
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