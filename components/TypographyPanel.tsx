
// FINAL – LOCKED
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory } from '../types.ts';
import { PRESET_REGISTRY } from '../presets/index.ts';
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
}

export const TypographyPanel: React.FC<TypographyPanelProps> = ({
  initialData,
  kernelConfig,
  onSaveToHistory,
  savedPresets = [],
  onStateUpdate,
  addLog,
  onSetGlobalDna,
  globalDna
}) => {

  const PRESETS = useMemo(() => {
    let presets: PresetCategory[] = [...PRESET_REGISTRY.TYPOGRAPHY.libraries];
    if (Array.isArray(savedPresets) && savedPresets.length) {
      presets = [
        {
          title: 'USER_VAULT',
          items: savedPresets
            .filter(p => p?.type === PanelMode.TYPOGRAPHY)
            .map(p => ({
              id: p.id,
              name: p.name,
              category: 'VAULT',
              description: p.description,
              prompt: p.prompt,
              type: PanelMode.TYPOGRAPHY,
              dna: p.dna,
              imageUrl: p.imageUrl
            }))
        },
        ...presets
      ];
    }
    return presets;
  }, [savedPresets]);

  const { status, isProcessing, transition } = useDevourer(initialData?.dna || globalDna ? 'DNA_LINKED' : 'STARVING');

  const [activePreset, setActivePreset] = useState<PresetItem | null>(null);
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || null);
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
        /* ==============================================================
           1️⃣ USER INPUT
        ============================================================== */
        const userText = prompt.trim() || 'HYPERX';

        /* ==============================================================
           2️⃣ PRESET STYLE MAPPING (STYLE-ACCURATE INSTRUCTIONS)
        ============================================================== */
        const getStyleInstructions = (presetName: string): string => {
            const styleMap: Record<string, string> = {
                'grunge': `"${userText}" in distressed grunge typography, paint splatters, rough eroded edges, urban street art style, vector graphic`,
                'distressed': `"${userText}" in distressed urban typography, textured edges, grit overlay, raw street art style`,
                'neon': `"${userText}" in glowing neon typography, dark background, light bloom effects, glass transparency`,
                'cyberpunk': `"${userText}" in cyberpunk neon typography, holographic glow, glitch effects, futuristic interface`,
                'art deco': `"${userText}" in Art Deco typography, geometric patterns, gold/black palette, vintage elegance, professional logo`,
                'retro': `"${userText}" in 80s retro typography, bright colors, geometric patterns, synthwave aesthetic`,
                'vintage': `"${userText}" in vintage typography, ornate details, classic engraving style`,
                'watercolor': `"${userText}" in watercolor typography, pigment bleeding, soft edges, handmade organic feel`,
                'handwritten': `"${userText}" in handwritten typography, natural stroke variation, personal ink signature style`,
                'chalkboard': `"${userText}" in chalkboard typography, dusty texture, hand-drawn white ink, dark slate background`,
                'geometric': `"${userText}" in geometric typography, clean lines, angular forms, Bauhaus aesthetic`,
                'minimalist': `"${userText}" in minimalist typography logo, neutral color palette, Swiss design precision`,
                'modern': `"${userText}" in modern clean typography, professional graphic design aesthetic`,
                'metal': `"${userText}" in metallic typography, chrome reflection, sharp edges, industrial steel texture`,
                'glass': `"${userText}" in glass typography, transparency, refraction hints`,
                '3d': `"${userText}" in 3D typography, isometric perspective, soft drop shadows`
            };

            const lowerPreset = presetName.toLowerCase();
            for (const [key, instruction] of Object.entries(styleMap)) {
                if (lowerPreset.includes(key)) return instruction;
            }
            return `"${userText}" as a typography logo, vector-style, clean edges`;
        };

        const presetName = activePreset?.name || 'modern';
        const finalPrompt = getStyleInstructions(presetName);

        console.log("FINAL PROMPT SENT TO AI:", finalPrompt);

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
            imageUrl: uploadedImage,
            timestamp: new Date().toLocaleTimeString(),
            styleUsed: presetName
        });

        addLog(`TYPO_SYNTHESIS: "${userText}" in ${presetName} style`, 'success');

    } catch (e: any) {
        addLog(`TYPO_SYNTHESIS_FAIL: ${e.message}`, 'error');
        transition('LATTICE_FAIL');
    } finally {
        processingRef.current = false;
    }
  };

  return (
    <PanelLayout
      sidebar={
        <>
          <SidebarHeader
            moduleNumber="Module_02"
            title="Typography_Design"
            version="Style-Accurate Presets"
            colorClass="text-brandBlue"
            borderColorClass="border-brandBlue"
          />

          <div className="space-y-6">
            {PRESETS.map(cat => (
              <div key={cat.title} className="space-y-3">
                <h3 className="text-[9px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic">{cat.title.replace('WORD_ART_', '')}</h3>
                {cat.items.map(p => (
                  <PresetCard
                    key={p.id}
                    name={p.name}
                    description={p.description}
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
          onFileUpload={(f) => {
            const r = new FileReader();
            r.onload = e => {
                setUploadedImage(e.target?.result as string);
                transition('BUFFER_LOADED');
            };
            r.readAsDataURL(f);
          }}
          downloadFilename={`hyperxgen_typo_${Date.now()}.png`}
        />
      }
      footer={
        <div className="space-y-4">
          <PresetCarousel
            categories={PRESETS}
            activeId={activePreset?.id || null}
            onSelect={handleSelectPreset}
          />

          <GenerationBar
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isProcessing={isProcessing}
            activePresetName={activePreset?.name || dna?.name || globalDna?.name}
            placeholder="Enter words (1-3 ideal)..."
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
