
// FINAL – LOCKED - REFINED V7.1.3
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, TypographyPreset, Preset, LatticeBuffer, TypographyDna, isTypographyPreset } from '../types.ts';
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
  const [generationNonce, setGenerationNonce] = useState(0); // Add generationNonce
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(initialData?.imageUrl || null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl && initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);
  const [activePreset, setActivePreset] = useState<PresetItem | null>(initialData || null);
  
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
      settings: (activePreset as TypographyPreset)?.parameters || {}
    });
  }, [prompt, generatedOutput, uploadedImage, dna, onStateUpdate, activePreset]);

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
    addLog(`TYPO_RECALL: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const setPromptAndResetNonce = useCallback((value: string) => {
    setPrompt(value);
    setGenerationNonce(0); // Reset nonce if prompt changes
  }, []);

  const handleGenerate = useCallback(async () => {
    if (processingRef.current) return;
    
    // FIX: Imported isTypographyPreset type guard to correctly validate the active preset.
    if (!activePreset || !isTypographyPreset(activePreset)) {
        addLog("TYPO_ERROR: No valid typography preset selected.", 'error');
        return;
    }
    
    const params = activePreset.parameters;
    const userText = prompt.trim() || 'HYPERX';
    const finalPrompt = `Synthesize the text "${userText}" using the following artistic direction: ${activePreset.prompt}`;
    
    processingRef.current = true;
    transition(dna || globalDna ? 'DNA_STYLIZE_ACTIVE' : 'DEVOURING_BUFFER', true);
    setGenerationNonce(prev => prev + 1); // Increment nonce for new generation attempt

    const extraDirectives = [
      `[TYPOGRAPHY_ART_SYNTAX_V3]`,
      `TEXT_CONTENT: "${userText}"`,
      `LETTERFORM_STYLE: ${params.letterform_style}`,
      `LAYOUT: ${params.layout}`,
      `SPACING: ${params.spacing}`,
      `EFFECTS: ${params.effects}`,
      `BACKGROUND: ${params.background}`,
      `COLOR_LOGIC: ${params.color_logic}`,
      `TEXTURE: ${params.texture}`,
      `ORNAMENTATION: ${params.ornamentation}`,
      activePreset?.styleDirective || ""
    ].join('\n');


    try {
      const result = await synthesizeTypoStyle(
        finalPrompt,
        uploadedImage || undefined,
        kernelConfig,
        dna || globalDna || undefined,
        extraDirectives,
        generationNonce // Pass generationNonce
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
        parameters: params,
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
  }, [prompt, uploadedImage, activePreset, kernelConfig, dna, globalDna, transition, addLog, onSaveToHistory, historyIndex, generationNonce]); // Add generationNonce as dependency

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
      setGenerationNonce(0); // Reset nonce on file upload
      addLog("SOURCE_BUFFER_LOADED: Ready for synthesis", "info");
    };
    r.readAsDataURL(f);
  }, [transition, addLog]);

  const handleRefine = async () => {
    if (!prompt.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const refined = await refineTextPrompt(prompt, PanelMode.TYPOGRAPHY, kernelConfig, dna || globalDna || undefined);
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
          <SidebarHeader moduleNumber="Module_02" title="Typography_Engine" version="Kinetic Word Art v7.1" colorClass="text-brandBlue" borderColorClass="border-brandBlue" />
          <div className="space-y-6 px-1">
            <div className="p-3 bg-brandBlue/5 dark:bg-brandYellow/5 border border-brandBlue/20 dark:border-brandYellow/20 rounded-sm mb-6">
                <span className="text-[8px] font-black text-brandBlue dark:text-brandYellow uppercase tracking-widest block mb-1">Instruction:</span>
                <p className="text-[9px] text-brandCharcoalMuted dark:text-white/60 leading-tight">Enter text. Select an authoritative style preset. Each preset is a complete, opinionated artistic direction, not a starting point. The engine handles all synthesis parameters.</p>
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
            setGenerationNonce(0); // Reset nonce on clear
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
            setPrompt={setPromptAndResetNonce} // Use new setter
            onGenerate={handleGenerate} 
            isProcessing={isProcessing} 
            activePresetName={activePreset?.name || dna?.name || globalDna?.name} 
            placeholder="Enter words (1-3 ideal)..." 
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