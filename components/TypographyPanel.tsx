
// FINAL – LOCKED
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, Preset, LatticeBuffer } from '../types.ts';
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

  const [activePreset, setActivePreset] = useState<PresetItem | null>(null);
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl && initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [isRefining, setIsRefining] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.TYPOGRAPHY,
      prompt,
      generatedOutput,
      uploadedImage,
      dna,
      name: prompt || 'Typography Synthesis'
    });
  }, [prompt, generatedOutput, uploadedImage, dna, onStateUpdate]);

  const handleSelectPreset = useCallback((id: string) => {
    if (isProcessing) return;
    const preset = PRESETS.flatMap(c => c.items).find(p => p.id === id) || null;
    setActivePreset(preset);

    if (preset?.dna) {
        setDna(preset.dna);
        onSetGlobalDna?.(preset.dna);
        transition('DNA_LINKED');
    }
    
    if ((preset as any)?.imageUrl) {
        setUploadedImage((preset as any).imageUrl);
        setGeneratedOutput(null);
        transition('BUFFER_LOADED');
    }
  }, [PRESETS, isProcessing, onSetGlobalDna, transition]);

  const handleRefine = async () => {
    if (!prompt.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const refined = await refineTextPrompt(prompt, PanelMode.TYPOGRAPHY, kernelConfig, dna || undefined);
      setPrompt(refined);
    } catch {
      addLog('PROMPT_REFINE_FAILED', 'error');
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerate = async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    transition(dna || globalDna ? 'DNA_STYLIZE_ACTIVE' : 'DEVOURING_BUFFER', true);

    try {
        const userText = prompt.trim() || 'HYPERX';
        const styleDir = activePreset?.styleDirective || "";
        const finalPrompt = `"${userText}" typography logo. Style: ${activePreset?.prompt || "Modern"}. Directives: ${styleDir}`;

        const result = await synthesizeTypoStyle(
            finalPrompt,
            uploadedImage || undefined,
            kernelConfig,
            dna || globalDna || undefined
        );

        setGeneratedOutput(result);
        transition('LATTICE_ACTIVE');

        onSaveToHistory({
            id: `typo-${Date.now()}`,
            type: PanelMode.TYPOGRAPHY,
            name: userText,
            prompt: userText,
            dna: dna || globalDna,
            imageUrl: result,
            timestamp: new Date().toLocaleTimeString(),
            styleUsed: activePreset?.name || 'custom'
        });

        addLog(`TYPO_SYNTHESIS: "${userText}" in ${activePreset?.name || 'custom'} style`, 'success');

    } catch (e: any) {
        addLog(`TYPO_SYNTHESIS_FAIL: ${e.message}`, 'error');
        transition('LATTICE_FAIL');
    } finally {
        processingRef.current = false;
    }
  };

  const handleFileUpload = useCallback((f: File) => {
    const r = new FileReader();
    r.onload = e => {
        setUploadedImage(e.target?.result as string);
        setGeneratedOutput(null);
        transition('BUFFER_LOADED');
        addLog("TYPO_SOURCE_LOADED", "info");
    };
    r.readAsDataURL(f);
  }, [transition, addLog]);

  return (
    <PanelLayout
      sidebar={
        <>
          <SidebarHeader moduleNumber="Module_02" title="Typography_Design" version="Style-Accurate Presets" colorClass="text-brandBlue" borderColorClass="border-brandBlue" />
          <div className="space-y-6">
            {PRESETS.map(cat => (
              <div key={cat.title} className="space-y-3">
                <h3 className="text-[9px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic">{cat.title.replace('WORD_ART_', '')}</h3>
                {cat.items.map(p => (
                  <PresetCard
                    key={p.id}
                    name={p.name}
                    description={p.description}
                    prompt={p.prompt}
                    isActive={activePreset?.id === p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    iconChar="T"
                  />
                ))}
              </div>
            ))}
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
            setActivePreset(null);
            onSetGlobalDna?.(null);
            transition('STARVING');
          }}
          onFileUpload={handleFileUpload}
          downloadFilename={`hyperxgen_typo_${Date.now()}.png`}
          bridgeSource={initialData?.category === 'LATTICE_BRIDGE' ? latticeBuffer?.sourceMode : null}
        />
      }
      footer={
        <div className="space-y-4">
          <PresetCarousel categories={PRESETS} activeId={activePreset?.id || null} onSelect={handleSelectPreset} />
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
