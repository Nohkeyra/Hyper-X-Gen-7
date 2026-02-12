// FINAL – LOCKED - REFINED V8.0.0
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SparkleIcon } from './Icons.tsx';
import { DevourerHUD } from './HUD.tsx';
import { PanelMode, KernelConfig, ExtractionResult, PresetCategory, VectorPreset, Preset, LatticeBuffer, isVectorPreset, VectorDna } from '../types.ts';
import { getMobileCategories } from '../presets/index.ts';
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

  const [command, setCommand] = useState(() => initialData?.prompt || '');

  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);
  const [activePreset, setActivePreset] = useState<VectorPreset | null>(initialData as VectorPreset || null);
  const [isRefining, setIsRefining] = useState(false);
  const processingRef = useRef(false);

  const { status, isProcessing, transition } = useDevourer(uploadedImage ? 'BUFFER_LOADED' : 'STARVING');

  // History State for Undo/Redo
  const [history, setHistory] = useState<string[]>(initialData?.imageUrl ? [initialData.imageUrl] : []);
  const [historyIndex, setHistoryIndex] = useState(initialData?.imageUrl ? 0 : -1);

  useEffect(() => {
    if (initialData?.id && !activePreset) {
      const item = PRESETS.flatMap(c => c.items).find(i => i.id === initialData.id) as VectorPreset | undefined;
      if(item) {
        setActivePreset(item);
        if (item.dna) setDna(item.dna);
      }
    }
  }, [initialData, activePreset, PRESETS]);

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.VECTOR,
      prompt: command,
      generatedOutput,
      uploadedImage,
      dna,
      name: `Vectorization: ${activePreset?.name || 'Custom'}`,
      settings: activePreset?.parameters || {},
    });
  }, [onStateUpdate, command, generatedOutput, uploadedImage, dna, activePreset]);

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
    const item = PRESETS.flatMap(c => c.items).find(i => i.id === id) as VectorPreset | undefined;
    if (!item) return;

    setActivePreset(item);

    if (item.dna) {
      setDna(item.dna);
      transition("DNA_LINKED");
      onSetGlobalDna?.(item.dna);
    } else {
        setDna(null);
        onSetGlobalDna?.(null);
    }

    addLog(`STYLE_DNA_LOCKED: ${item.name}`, 'info');
  }, [PRESETS, isProcessing, transition, activePresetId, onSetGlobalDna, addLog]);

  const handleGenerate = useCallback(async () => {
    if (processingRef.current) return;

    if (!uploadedImage) {
      addLog("VECTORIZATION_FAIL: Source image buffer is empty.", 'error');
      return;
    }
    if (!activePreset || !isVectorPreset(activePreset)) {
      addLog("VECTORIZATION_FAIL: No style preset selected.", 'error');
      return;
    }
    
    processingRef.current = true;
    transition('DEVOURING_BUFFER', true);
    
    const userCommand = command.trim();
    const finalPrompt = `Vectorize the provided image using the aesthetic of "${activePreset.prompt}". ${userCommand ? `Execute the following command during vectorization: "${userCommand}".` : 'Perform a standard high-fidelity vectorization according to the style preset.'}`;

    const vectorParams = activePreset.parameters;
    
    const directives = [`[DIRECTIVE: COMMAND_DRIVEN_VECTORIZATION_V8]`];

    // Dynamically build directives from the preset's DNA
    for (const [key, value] of Object.entries(vectorParams)) {
        if (value) {
            // Convert camelCase/snake_case to UPPER_SNAKE_CASE for directives
            const directiveKey = key.replace(/([A-Z])/g, '_$1').toUpperCase();
            directives.push(`${directiveKey}: ${String(value).toUpperCase()}`);
        }
    }

    if (activePreset.styleDirective) {
        directives.push(activePreset.styleDirective);
    }
    
    const finalDirectives = directives.filter(Boolean).join('\n');

    try {
      const result = await synthesizeVectorStyle(
        finalPrompt, 
        uploadedImage, 
        kernelConfig, 
        dna || globalDna || undefined, 
        finalDirectives
      );
      
      if (!result) throw new Error("Synthesis returned a null buffer.");
      setGeneratedOutput(result);
      
      setHistory(prev => {
        const nextHistory = prev.slice(0, historyIndex + 1);
        return [...nextHistory, result];
      });
      setHistoryIndex(prev => prev + 1);

      addLog(`VECTORIZATION_COMPLETE: Command: ${userCommand || 'none'}`, 'success');
      onSaveToHistory({ 
        id: `vec-${Date.now()}`, 
        name: `Vectorized: ${activePreset.name}`, 
        type: PanelMode.VECTOR, 
        prompt: userCommand, 
        dna: dna || globalDna || undefined, 
        imageUrl: result,
        parameters: vectorParams,
        category: 'Synthesis',
        description: `Source vectorized with ${activePreset.name} style.`
      } as VectorPreset);
    } catch (e: any) { 
      transition('LATTICE_FAIL'); 
      addLog(`VECTORIZATION_ERROR: ${e.message}`, 'error'); 
    } finally { 
      processingRef.current = false; 
      transition('LATTICE_ACTIVE'); 
    }
  }, [command, uploadedImage, activePreset, kernelConfig, dna, globalDna, transition, addLog, onSaveToHistory, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGeneratedOutput(history[newIndex] || null);
      addLog("LATTICE_UNDO: Reverting state", "info");
    }
  }, [historyIndex, history, addLog]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setGeneratedOutput(history[newIndex] || null);
      addLog("LATTICE_REDO: Advancing state", "info");
    }
  }, [historyIndex, history, addLog]);

  const handleFileUpload = useCallback((f: File) => {
    const r = new FileReader(); 
    r.onload = e => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);
      setGeneratedOutput(base64); // Show the uploaded image initially
      setHistory([base64]);
      setHistoryIndex(0);
      transition('BUFFER_LOADED');
      addLog("SOURCE_BUFFER_LOADED: Ready for vectorization", "info");
    }; 
    r.readAsDataURL(f); 
  }, [transition, addLog]);

  const handleRefine = async () => {
    if (!command.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const refined = await refineTextPrompt(command, PanelMode.VECTOR, kernelConfig, dna || globalDna || undefined);
      setCommand(refined);
      addLog("COMMAND_REFINED: Architecture optimized", "success");
    } catch {
      addLog("COMMAND_REFINE_FAIL: Kernel drift detected", "error");
    } finally {
      setIsRefining(false);
    }
  };

  const canGenerate = !isProcessing && !!uploadedImage && !!activePresetId;

  return (
    <PanelLayout 
      sidebar={
        <>
          <SidebarHeader moduleNumber="Module_01" title="Vectorization_Engine" version="Command-Driven v8.0" colorClass="text-brandRed" borderColorClass="border-brandRed" />
          <div className="space-y-6 px-1">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic border-b border-white/5 pb-2">Style_Library</h4>
                
                <div className="p-3 bg-brandRed/5 dark:bg-brandYellow/5 border border-brandRed/20 dark:border-brandYellow/20 rounded-sm">
                  <span className="text-[8px] font-black text-brandRed dark:text-brandYellow uppercase tracking-widest block mb-1">Instruction:</span>
                  <p className="text-[9px] text-brandCharcoalMuted dark:text-white/60 leading-tight">1. Upload a source image.<br/>2. Select a style preset below to define the vectorization aesthetic.</p>
                </div>
                
                {PRESETS.map(cat => (
                  <div key={cat.title} className="space-y-3 pt-4 border-t border-white/5">
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
          onClear={() => { 
            setGeneratedOutput(null); 
            setUploadedImage(null); 
            setDna(null); 
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
          bridgeSource={initialData?.category === 'LATTICE_BRIDGE' ? latticeBuffer?.sourceMode : null}
        />
      }
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
          <GenerationBar 
            prompt={command} 
            setPrompt={setCommand} 
            onGenerate={handleGenerate} 
            isProcessing={!canGenerate}
            activePresetName={activePreset?.name || dna?.name || globalDna?.name} 
            placeholder="Enter optional command (e.g. remove background)..." 
            bridgedThumbnail={initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null}
            onClearBridge={() => { if (onClearLattice) onClearLattice(); setUploadedImage(null); }}
            refineButton={
              <button
                onClick={handleRefine}
                disabled={isProcessing || isRefining}
                className={`p-3 bg-black/40 border border-white/10 text-brandYellow rounded-sm ${isRefining ? 'animate-pulse' : ''}`}
                title="Refine Command"
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
