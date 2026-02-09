import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory, TypographyPreset } from '../types.ts';
import { PRESET_REGISTRY, injectPresetTokens } from '../presets/enginePrompts.ts';
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
  onApiKeyError: () => void;
}

type TerminalLogic = 'clipped' | 'flare' | 'rounded' | 'spike';
type LigatureLogic = 'manual' | 'auto' | 'aggressive';
type FontWeight = 'light' | 'regular' | 'bold' | 'ultra';

export const TypographyPanel: React.FC<TypographyPanelProps> = ({
  initialData,
  kernelConfig,
  integrity,
  refinementLevel = 0,
  uiRefined,
  onSaveToHistory,
  onModeSwitch,
  savedPresets = [],
  onStateUpdate,
  addLog,
  onApiKeyError,
}) => {
  const PRESETS = useMemo(() => {
    let presetsToRender: PresetCategory[] = [...PRESET_REGISTRY.TYPOGRAPHY.libraries];

    if (Array.isArray(savedPresets)) {
      const userPresets = savedPresets.filter(p => p && (p.type === PanelMode.TYPOGRAPHY || p.mode === PanelMode.TYPOGRAPHY));
      if (userPresets.length > 0) {
        const grouped: Record<string, PresetItem[]> = {};
        userPresets.forEach(p => {
          const catName = p.category || p.dna?.category || "VAULT_ARCHIVES";
          if (!grouped[catName]) grouped[catName] = [];
// @FIX: Added missing 'category' property to conform to PresetItem type.
          grouped[catName].push({
            id: p.id || Math.random().toString(),
            name: p.name || p.dna?.name || "UNNAMED_DNA",
            type: p.type as any || PanelMode.TYPOGRAPHY,
            category: catName,
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
  const [capHeight, setCapHeight] = useState<number>(100);
  const [strokeContrast, setStrokeContrast] = useState<number>(50);
  const [terminalLogic, setTerminalLogic] = useState<TerminalLogic>('clipped');
  const [fontWeight, setFontWeight] = useState<FontWeight>('regular');
  const [splicingIntensity, setSplicingIntensity] = useState<number>(20);
  const [interlockGutter, setInterlockGutter] = useState<number>(10);
  const [xHeightBias, setXHeightBias] = useState<number>(100);
  const [ligatureLogic, setLigatureLogic] = useState<LigatureLogic>('auto');

  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);
  const [activePreset, setActivePreset] = useState<PresetItem | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || initialData?.uploadedImage || null);
  const [prompt, setPrompt] = useState(''); 
  const [isRefining, setIsRefining] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(initialData?.generatedOutput || null);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || null);
  const [isValidationError, setIsValidationError] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.TYPOGRAPHY,
      prompt,
      generatedOutput,
      uploadedImage,
      dna,
      name: prompt || "Typography Synthesis",
      settings: { capHeight, strokeContrast, terminalLogic, fontWeight, splicingIntensity, interlockGutter, xHeightBias, ligatureLogic }
    });
  }, [onStateUpdate, prompt, generatedOutput, uploadedImage, dna, capHeight, strokeContrast, terminalLogic, fontWeight, splicingIntensity, interlockGutter, xHeightBias, ligatureLogic]);

  const handleApiError = useCallback((e: any) => {
    const errorStr = (e?.message || '').toLowerCase();
    if (errorStr.includes('requested entity was not found')) {
      addLog('API Key error detected. Please select a valid key.', 'error');
      onApiKeyError();
      return true;
    }
    return false;
  }, [addLog, onApiKeyError]);

  const handleSelectPreset = useCallback((id: string) => {
    if (isProcessing) return;

    if (activePresetId === id) {
      setActivePresetId(null);
      setActivePreset(null);
      setPrompt(''); // Clear prompt
      setDna(null);
      return;
    }

    setActivePresetId(id);
    const item = PRESETS.flatMap(c => c.items).find(i => i.id === id);
    if (!item) return;

    setActivePreset(item);
    setPrompt('');

    // Apply preset parameters
    if (item.parameters) {
      const presetParams = item.parameters as TypographyPreset['parameters'];
      setFontWeight(presetParams.weight);
      setTerminalLogic(presetParams.terminals);
      setCapHeight(presetParams.capHeight);
      setStrokeContrast(presetParams.strokeContrast);
      setSplicingIntensity(presetParams.splicingIntensity);
      setInterlockGutter(presetParams.interlockGutter);
      setXHeightBias(presetParams.xHeightBias);
      setLigatureLogic(presetParams.ligatureThreshold);
    }

    // Inject DNA if exists
    if (item.dna) {
      setDna(item.dna);
      transition("DNA_LINKED");
    }

    if ((item as any).imageUrl) setUploadedImage((item as any).imageUrl);
  }, [PRESETS, isProcessing, transition, activePresetId]);

  const handleRefine = async () => {
    if (!prompt.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const refined = await refineTextPrompt(prompt, PanelMode.TYPOGRAPHY, kernelConfig, dna || undefined);
      setPrompt(refined);
    } catch (e: any) {
      if (handleApiError(e)) return;
      addLog("PROMPT_REFINE_FAILED", 'error');
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerate = async () => {
    if (processingRef.current) return;
    const effectivePrompt = prompt.trim() || "HYPER";
    
    const basePrompt = [activePreset?.prompt, effectivePrompt].filter(Boolean).join('. ');
    const finalPrompt = injectPresetTokens(basePrompt, PanelMode.TYPOGRAPHY);

    const extraDirectives = `
CAP_HEIGHT: ${capHeight}%
STROKE_CONTRAST: ${strokeContrast}%
TERMINAL_LOGIC: ${terminalLogic.toUpperCase()}
FONT_WEIGHT: ${fontWeight.toUpperCase()}
SPLICING_INTENSITY: ${splicingIntensity}%
INTERLOCK_GUTTER: ${interlockGutter}px
X_HEIGHT_BIAS: ${xHeightBias}%
LIGATURE_LOGIC: ${ligatureLogic.toUpperCase()}
`.trim();

    processingRef.current = true;
    transition(dna ? "DNA_STYLIZE_ACTIVE" as any : "DEVOURING_BUFFER", true);
    setIsValidationError(false);

    try {
      const result = await synthesizeTypoStyle(finalPrompt, uploadedImage || undefined, kernelConfig, dna || undefined, extraDirectives);
      setGeneratedOutput(result);
      transition("LATTICE_ACTIVE");
      onSaveToHistory({ 
        id: `typo-${Date.now()}`, 
        name: effectivePrompt.slice(0,15), 
        description: 'Typography synthesis', 
        type: PanelMode.TYPOGRAPHY, 
        prompt: finalPrompt, 
        settings: { capHeight, strokeContrast, terminalLogic, fontWeight, splicingIntensity, interlockGutter, xHeightBias, ligatureLogic }, 
        dna, 
        imageUrl: uploadedImage, 
        timestamp: new Date().toLocaleTimeString() 
      });
    } catch (e: any) {
      if (handleApiError(e)) {
        transition("LATTICE_FAIL");
        return;
      }
      addLog("SYNTHESIS_ERROR: Generation failed", 'error');
      transition("LATTICE_FAIL");
      setIsValidationError(true);
    } finally { 
      processingRef.current = false; 
    }
  };

  // Fix: Implemented a full sidebar with controls and preset list.
  const SidebarContent = (
    <>
      <SidebarHeader moduleNumber="Module_02" title="Typographic Architect" version="v5.2" colorClass="text-brandRed" borderColorClass="border-brandRed" />
      <div className="space-y-10 mb-12">
        <section>
          <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/30 tracking-widest mb-4 border-b border-brandCharcoal/10 dark:border-white/5 pb-2">Primary Form</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40 mb-1.5 block">Font Weight</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['light', 'regular', 'bold', 'ultra'] as FontWeight[]).map(m => (
                  <button key={m} onClick={() => setFontWeight(m)} className={`py-2 text-[8px] font-black uppercase tracking-widest border-2 transition-all rounded-sm ${fontWeight === m ? 'bg-brandCharcoal text-white border-brandCharcoal dark:bg-brandRed dark:border-brandRed' : 'border-brandCharcoal/10 text-brandCharcoal/40 dark:border-white/5 dark:text-white/40 hover:border-brandCharcoal dark:hover:border-white/20'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40 mb-1.5 block">Terminal Logic</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['clipped', 'flare', 'rounded', 'spike'] as TerminalLogic[]).map(m => (
                  <button key={m} onClick={() => setTerminalLogic(m)} className={`py-2 text-[8px] font-black uppercase tracking-widest border-2 transition-all rounded-sm ${terminalLogic === m ? 'bg-brandCharcoal text-white border-brandCharcoal dark:bg-brandRed dark:border-brandRed' : 'border-brandCharcoal/10 text-brandCharcoal/40 dark:border-white/5 dark:text-white/40 hover:border-brandCharcoal dark:hover:border-white/20'}`}>{m}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/30 tracking-widest mb-4 border-b border-brandCharcoal/10 dark:border-white/5 pb-2">Glyph Metrics</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Cap Height</label>
                <span className="text-[8px] font-black text-brandRed">{capHeight}%</span>
              </div>
              <input type="range" min="80" max="120" value={capHeight} onChange={e => setCapHeight(parseInt(e.target.value))} className="w-full h-1.5 bg-brandCharcoal/5 dark:bg-white/5 appearance-none rounded-full accent-brandRed" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Stroke Contrast</label>
                <span className="text-[8px] font-black text-brandRed">{strokeContrast}%</span>
              </div>
              <input type="range" min="0" max="100" value={strokeContrast} onChange={e => setStrokeContrast(parseInt(e.target.value))} className="w-full h-1.5 bg-brandCharcoal/5 dark:bg-white/5 appearance-none rounded-full accent-brandRed" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">X-Height Bias</label>
                <span className="text-[8px] font-black text-brandRed">{xHeightBias}%</span>
              </div>
              <input type="range" min="80" max="120" value={xHeightBias} onChange={e => setXHeightBias(parseInt(e.target.value))} className="w-full h-1.5 bg-brandCharcoal/5 dark:bg-white/5 appearance-none rounded-full accent-brandRed" />
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/30 tracking-widest mb-4 border-b border-brandCharcoal/10 dark:border-white/5 pb-2">Interaction & Effects</h4>
          <div className="space-y-4">
             <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Splicing Intensity</label>
                <span className="text-[8px] font-black text-brandRed">{splicingIntensity}%</span>
              </div>
              <input type="range" min="0" max="100" value={splicingIntensity} onChange={e => setSplicingIntensity(parseInt(e.target.value))} className="w-full h-1.5 bg-brandCharcoal/5 dark:bg-white/5 appearance-none rounded-full accent-brandRed" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Interlock Gutter</label>
                <span className="text-[8px] font-black text-brandRed">{interlockGutter}px</span>
              </div>
              <input type="range" min="0" max="20" value={interlockGutter} onChange={e => setInterlockGutter(parseInt(e.target.value))} className="w-full h-1.5 bg-brandCharcoal/5 dark:bg-white/5 appearance-none rounded-full accent-brandRed" />
            </div>
            <div>
              <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40 mb-1.5 block">Ligature Logic</label>
              <select value={ligatureLogic} onChange={e => setLigatureLogic(e.target.value as any)} className="w-full bg-transparent border-2 border-brandCharcoal/10 dark:border-white/5 text-[8px] font-black uppercase px-2 py-1.5 rounded-sm outline-none focus:border-brandRed">
                <option value="manual">Manual</option>
                <option value="auto">Auto</option>
                <option value="aggressive">Aggressive</option>
              </select>
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
                  iconChar="T" 
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
      <CanvasStage uploadedImage={uploadedImage} generatedOutput={generatedOutput} isProcessing={isProcessing} hudContent={<DevourerHUD devourerStatus={dna?.name || status} />} isValidationError={isValidationError} uiRefined={uiRefined} refinementLevel={refinementLevel} onClear={() => { setUploadedImage(null); setGeneratedOutput(null); setDna(null); setActivePresetId(null); setActivePreset(null); setPrompt(''); transition("STARVING"); }} onGenerate={handleGenerate} onFileUpload={(file) => { const reader = new FileReader(); reader.onload = e => setUploadedImage(e.target?.result as string); reader.readAsDataURL(file); }} downloadFilename={`hyperxgen_typo_${Date.now()}.png`} />
      <div className="flex flex-col gap-6">
        <GenerationBar 
          prompt={prompt} 
          setPrompt={setPrompt} 
          onGenerate={handleGenerate} 
          isProcessing={isProcessing} 
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
