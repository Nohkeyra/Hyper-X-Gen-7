// FINAL – LOCKED - REFINED V7.2.9
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, MonogramPreset, Preset, LatticeBuffer, ImageEngine } from '../types.ts';
import { getMobileCategories } from '../presets/index.ts';
import { synthesizeMonogramStyle } from '../services/imageOrchestrator.ts';
import { refineTextPrompt } from '../services/geminiService.ts';
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

  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl && initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null);
  const { status, isProcessing, transition } = useDevourer(initialData?.dna || globalDna || uploadedImage ? 'DNA_LINKED' : 'STARVING');
  const [prompt, setPrompt] = useState(initialData?.prompt || 'HXG');
  const [generationNonce, setGenerationNonce] = useState(0); 
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || 'mono-velvet-interlock');
  const [activePreset, setActivePreset] = useState<PresetItem | null>(() => initialData || PRESETS.flatMap(c => c.items).find(i => i.id === 'mono-velvet-interlock') || null);
  
  const [isRefining, setIsRefining] = useState(false);
  
  // History for Undo/Redo
  const [history, setHistory] = useState<string[]>(initialData?.imageUrl ? [initialData.imageUrl] : []);
  const [historyIndex, setHistoryIndex] = useState(initialData?.imageUrl ? 0 : -1);

  // LATTICE BRIDGE INGESTION
  useEffect(() => {
    if (latticeBuffer?.imageUrl && uploadedImage !== latticeBuffer.imageUrl) {
      setUploadedImage(latticeBuffer.imageUrl);
      if (latticeBuffer.dna) setDna(latticeBuffer.dna);
      if (latticeBuffer.prompt && !prompt) setPrompt(latticeBuffer.prompt);
      
      setHistory([latticeBuffer.imageUrl]);
      setHistoryIndex(0);
      transition('BUFFER_LOADED');
      addLog(`LATTICE_IMPORT: Buffer acquired from ${latticeBuffer.sourceMode}`, 'info');
    }
  }, [latticeBuffer, transition, addLog, prompt, uploadedImage]);

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
    addLog(`REFINED_RECALL: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const setPromptAndResetNonce = useCallback((value: string) => {
    // Enforce 3 char limit
    const cleanValue = value.slice(0, 3).toUpperCase();
    setPrompt(cleanValue);
    setGenerationNonce(0); 
  }, []);

  const handleGenerate = useCallback(async () => {
    if (isProcessing || !activePreset) {
      if(!activePreset) addLog("MONOGRAM_ERROR: No preset selected.", 'error');
      return;
    }

    const userInitials = prompt.trim() || "HXG";
    if (userInitials.length > 3) {
      addLog("MONOGRAM_ERROR: Max 3 characters allowed.", 'error');
      return;
    }

    const presetParams = (activePreset as MonogramPreset).parameters;
    const metadata = activePreset.metadata || {};
    
    // Construct Prompt
    let finalPrompt = "";
    
    if (activePreset.prompt) {
        // V2 Logic: Use the rich AI prompt from the preset
        finalPrompt = `${activePreset.prompt}. Create this monogram for the initials: "${userInitials}". Ensure high legibility and correct letterforms.`;
    } else {
        // V1 Logic: Fallback to constructing from metadata
        const layout = metadata.layout || presetParams.letter_relationship;
        const style = metadata.style || presetParams.form_language;
        const theme = metadata.theme || presetParams.period_influence;
        const twist = metadata.twist || activePreset.description;
        finalPrompt = `Create a monogram with initials ${userInitials}, layout ${layout}, style ${style}, theme ${theme}, twist ${twist}, constraints: readable, max 3 letters, no extra letters, flat/studio background`;
    }
    
    // Engine Switching Logic
    const preferredEngine = metadata.preferredEngine;
    const effectiveConfig = {
      ...kernelConfig,
      imageEngine: preferredEngine || kernelConfig.imageEngine
    };

    transition(dna || globalDna || uploadedImage ? "DNA_STYLIZE_ACTIVE" : "DEVOURING_BUFFER", true);
    setGenerationNonce(prev => prev + 1); 

    try {
      const { imageUrl: result, fallbackTriggered } = await synthesizeMonogramStyle(
        finalPrompt, 
        uploadedImage || undefined, 
        effectiveConfig, 
        dna || globalDna || undefined, 
        "", 
        generationNonce
      ); 
      
      if (fallbackTriggered) {
        addLog('FLUX_FAIL: Primary engine connection failed. Switched to Gemini fallback.', 'warning');
      }

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
      addLog(`MONOGRAM_CREATED: "${userInitials}" with ${activePreset.name}`, 'success');
    } catch (error: any) { 
      transition("LATTICE_FAIL"); 
      addLog(`MONO_ERROR: ${error.message}`, 'error'); 
    } finally { 
      transition("LATTICE_ACTIVE"); 
    }
  }, [prompt, activePreset, dna, globalDna, kernelConfig, uploadedImage, transition, onSaveToHistory, addLog, historyIndex, generationNonce, isProcessing]);

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
      setGenerationNonce(0); 
      addLog("MONO_SOURCE_LOADED", "info");
    }; 
    r.readAsDataURL(f); 
  }, [transition, addLog]);

  const handleRefine = async () => {
    if (!prompt.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const refined = await refineTextPrompt(prompt, PanelMode.MONOGRAM, kernelConfig, dna || globalDna || undefined);
      setPromptAndResetNonce(refined); 
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
             <div className="p-3 bg-brandRed/5 border border-brandRed/20 rounded-sm mb-6">
                <span className="text-[8px] font-black text-brandRed uppercase tracking-widest block mb-1">Instruction:</span>
                <p className="text-[9px] text-brandCharcoalMuted dark:text-white/60 leading-tight">Enter initials (max 3). Select an authoritative style preset. Each preset dictates layout, style, and texture. Flux Engine creates texture; Gemini Engine creates vectors.</p>
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
          onClear={() => { setGeneratedOutput(null); setUploadedImage(null); setDna(null); setHistory([]); setHistoryIndex(-1); transition('STARVING'); setGenerationNonce(0); }} 
          onFileUpload={handleFileUpload}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          bridgeSource={initialData?.category === 'LATTICE_BRIDGE' ? latticeBuffer?.sourceMode : (latticeBuffer ? latticeBuffer.sourceMode : null)}
          activeEngine={kernelConfig.imageEngine}
        />
      }
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
          <GenerationBar 
            prompt={prompt} setPrompt={setPromptAndResetNonce} onGenerate={handleGenerate} isProcessing={isProcessing || !activePreset} 
            activePresetName={activePreset?.name || dna?.name || globalDna?.name} placeholder="Enter initials (1-3 chars)..." 
            bridgedThumbnail={latticeBuffer?.imageUrl || (initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null)}
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