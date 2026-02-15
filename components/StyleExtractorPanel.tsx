
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { KernelConfig, ExtractionResult, PanelMode, StyleCategory, Preset, VectorPreset, TypographyPreset, MonogramPreset, EmblemPreset, PresetCategory } from '../types.ts';
import { EnhancedStyleExtractor } from '../services/styleExtractor.ts';
import { StyleExtractionResult } from './StyleExtractionResult.tsx';
import { PresetCard } from './PresetCard.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';
import { TrashIcon } from './Icons.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { GenerationBar } from './GenerationBar.tsx';
import { ReconHUD } from './HUD.tsx';
import { useDevourer } from '../hooks/useDevourer.ts';

interface StyleExtractorPanelProps {
  initialData?: any; 
  kernelConfig: KernelConfig; 
  savedPresets: any[]; 
  onSaveToPresets: (preset: any) => void; 
  onDeletePreset: (id: string) => void; 
  onSaveFeedback?: () => void;
  onStateUpdate?: (state: any) => void;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void; 
  onApiKeyError: () => void;
  onModeSwitch?: (mode: PanelMode, data?: any) => void;
}

export const StyleExtractorPanel: React.FC<StyleExtractorPanelProps> = ({
  initialData, kernelConfig, savedPresets = [], onSaveToPresets, onDeletePreset, addLog, onModeSwitch, onStateUpdate
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || null);
  const [extractedDna, setExtractedDna] = useState<ExtractionResult | null>(initialData?.dna || null);
  const [customName, setCustomName] = useState<string>(initialData?.dna?.name || '');
  const [classification, setClassification] = useState<any>(null);
  const [reconStatusOverride, setReconStatusOverride] = useState<string | null>(null);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<PanelMode>(PanelMode.VECTOR);
  
  const { status, isProcessing, transition } = useDevourer(initialData?.imageUrl ? 'BUFFER_LOADED' : 'STARVING');

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.EXTRACTOR,
      name: customName || extractedDna?.name || 'Style Extraction',
      uploadedImage,
      generatedOutput: uploadedImage,
      dna: extractedDna,
      settings: {}
    });
  }, [onStateUpdate, uploadedImage, extractedDna, customName]);

  const dnaVault = useMemo(() => savedPresets.filter(p => p && p.dna), [savedPresets]);

  const handleExtractStyle = useCallback(async (imageUrl: string) => {
    if (!imageUrl || isProcessing) return;

    try {
      addLog("STYLE_EXTRACTION: INITIATED", "info");
      transition('AUDITING_BUFFER', true);
      setReconStatusOverride("ANALYZING_VISUAL_STYLE");
      
      const result = await EnhancedStyleExtractor.extractStyleWithCategory(
        imageUrl,
        kernelConfig
      );
      
      setExtractedDna(result.extraction);
      setCustomName(result.extraction.name || '');
      setClassification({
        category: result.category,
        confidence: result.confidence,
        recommendedPanel: result.recommendedPanel,
        matchingPresets: result.matchingPresets
      });
      
      setReconStatusOverride("STYLE_CAPTURED");
      transition('DNA_HARVESTED');
      addLog(`STYLE_DNA_HARVESTED: ${result.extraction.name}`, "success");
      
    } catch (err: any) {
      console.error(err);
      transition('LATTICE_FAIL');
      setReconStatusOverride("AUDIT_FAILED");
      addLog(`EXTRACTION_FAILED: ${err.message}`, "error");
    } finally {
      setTimeout(() => setReconStatusOverride(null), 1000);
    }
  }, [kernelConfig, addLog, isProcessing, transition]);

  const handleSavePreset = async () => {
    if (!extractedDna) return;
    
    const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const uniqueId = `user-${Date.now()}-${hex}`;
    
    const preset: any = {
      id: uniqueId,
      name: customName.trim() || extractedDna.name || `STYLE_DNA_${hex}`,
      type: selectedPanel,
      category: 'USER_VAULT',
      description: extractedDna.description,
      prompt: extractedDna.promptTemplate,
      dna: extractedDna,
      imageUrl: uploadedImage,
      timestamp: new Date().toISOString()
    };

    // Initialize module-specific parameters with intelligence from extracted DNA
    if (selectedPanel === PanelMode.VECTOR) {
      preset.parameters = {
        detail_fidelity: 'Moderate',
        edge_quality: 'Clean, refined',
        palette_strategy: `Extracted Palette (${extractedDna.palette.length} colors)`,
        color_direction: extractedDna.mood?.join(', ') || 'Communicative',
        background: 'Flat White (#FFFFFF)',
        form_language: extractedDna.formLanguage || 'Geometric, illustrative',
        stroke_preset: extractedDna.features?.strokeBased ? 'Uniform Thin' : 'None',
      } as VectorPreset['parameters'];
    } else if (selectedPanel === PanelMode.TYPOGRAPHY) {
      const params: Partial<TypographyPreset['parameters']> = {
        letterform_style: 'Modern Sans',
        layout: 'Horizontal, optically centered',
        spacing: 'Balanced, professional',
        effects: 'None',
        background: 'Flat Black (#000000)',
        color_logic: 'Extracted Palette',
        texture: 'None',
        ornamentation: 'None',
      };
      if (extractedDna.formLanguage?.toLowerCase().includes('geometric')) {
        params.letterform_style = 'Geometric Sans';
      } else if (extractedDna.formLanguage?.toLowerCase().includes('script') || extractedDna.formLanguage?.toLowerCase().includes('organic')) {
        params.letterform_style = 'Flowing Script';
      }
      preset.parameters = params;
    } else if (selectedPanel === PanelMode.MONOGRAM) {
      preset.parameters = {
        letter_relationship: 'Interlocked, geometric',
        symmetry: extractedDna.features?.hasSymmetry ? 'Perfect Radial' : 'Asymmetrical',
        container: 'None — freeform',
        legibility_target: 'Moderate',
        form_language: extractedDna.formLanguage || 'Geometric',
        stroke_character: 'Uniform weight',
        spatial_density: 'Balanced',
        abstraction_tolerance: 'Moderate',
        period_influence: extractedDna.category || 'Contemporary',
      } as MonogramPreset['parameters'];
    } else if (selectedPanel === PanelMode.EMBLEM_FORGE) {
      preset.parameters = {
        containment: 'Circle',
        border: 'Clean, minimal',
        illustration: 'Central Motif based on DNA',
        illustration_style: extractedDna.technique || 'Clean, geometric',
        typography_layout: 'Curved top/bottom',
        text_hierarchy: 'Primary dominant',
        background: 'Flat Black (#000000)',
        period_influence: extractedDna.category || 'Contemporary'
      } as EmblemPreset['parameters'];
    }
    
    onSaveToPresets(preset);
    setShowSaveOptions(false);
    addLog(`STYLE_COMMITTED: ${preset.name} stored in vault`, "success");
  };

  const handleJumpToSynthesis = (mode: PanelMode) => {
    if (!extractedDna || !onModeSwitch) return;
    onModeSwitch(mode, { 
      id: `dna-jump-${Date.now()}`,
      dna: extractedDna, 
      imageUrl: uploadedImage,
      prompt: '',
      name: customName || extractedDna.name,
      type: mode,
      category: 'BRIDGE',
      description: 'Extracted style bridge'
    } as any);
  };

  return (
    <PanelLayout 
      sidebar={
        <>
          <SidebarHeader moduleNumber="Module_04" title="Style_Extractor" version="Style DNA Capture v7.6" colorClass="text-brandRed" borderColorClass="border-brandRed" />
          <div className="space-y-6 px-1">
            <div className="p-3 bg-brandRed/5 border border-brandRed/20 rounded-sm mb-6">
                <span className="text-[8px] font-black text-brandRed uppercase tracking-widest block mb-1">Instruction:</span>
                <p className="text-[9px] text-brandCharcoalMuted dark:text-white/60 leading-tight">Identify pure design traits and map them directly to engine synthesis presets. Upload an image to begin forensic style decoding.</p>
            </div>
            
            {dnaVault.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic border-b border-white/5 pb-2">Extracted_DNA_Vault</h4>
                {dnaVault.map(p => (
                  <div key={p.id} className="relative group">
                    <PresetCard name={p.name} description={p.description} prompt={p.dna?.promptTemplate} isActive={false} onClick={() => {}} iconChar="S" />
                    <button onClick={(e) => { e.stopPropagation(); onDeletePreset(p.id); }} className="absolute top-2 right-2 p-1 bg-brandRed text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      }
      canvas={
        <div className="flex-1 flex flex-col gap-4">
          <CanvasStage
            uploadedImage={uploadedImage} generatedOutput={null} isProcessing={isProcessing}
            hudContent={<ReconHUD reconStatus={reconStatusOverride || status} authenticityScore={extractedDna?.styleAuthenticityScore} />}
            onClear={() => { setUploadedImage(null); setExtractedDna(null); setClassification(null); setShowSaveOptions(false); setCustomName(''); transition('STARVING'); }}
            onFileUpload={(f) => { const r = new FileReader(); r.onload = e => setUploadedImage(e.target?.result as string); r.readAsDataURL(f); transition('BUFFER_LOADED'); }}
          />
          
          {extractedDna && classification && (
            <StyleExtractionResult 
              extraction={extractedDna}
              category={classification.category}
              confidence={classification.confidence}
              recommendedPanel={classification.recommendedPanel}
              onApply={handleJumpToSynthesis}
              onSaveToVault={() => setShowSaveOptions(true)}
            />
          )}

          {showSaveOptions && (
            <div className="bg-brandCharcoal dark:bg-zinc-900 border-2 border-brandYellow p-6 rounded-sm shadow-neon-yellow flex flex-col gap-6 animate-in zoom-in duration-300">
              <div className="flex items-center gap-3">
                <span className="text-[14px] animate-bounce">💾</span>
                <p className="text-[10px] font-black text-brandYellow uppercase tracking-widest">Commit Style DNA to Vault?</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] font-black text-brandYellow/60 uppercase tracking-widest">Aesthetic_Identity_Name</label>
                  <input 
                    type="text" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter style name..."
                    className="bg-black/40 border border-brandYellow/30 text-brandYellow text-[10px] font-black p-3 outline-none uppercase placeholder:text-brandYellow/20"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] font-black text-brandYellow/60 uppercase tracking-widest">Target_Synthesis_Engine</label>
                  <select 
                    value={selectedPanel}
                    onChange={(e) => setSelectedPanel(e.target.value as PanelMode)}
                    className="bg-black/40 border border-brandYellow/30 text-white text-[10px] font-black p-3 outline-none uppercase"
                  >
                    <option value={PanelMode.VECTOR}>Vector Art Engine</option>
                    <option value={PanelMode.TYPOGRAPHY}>Typography Engine</option>
                    <option value={PanelMode.MONOGRAM}>Monogram Engine</option>
                    <option value={PanelMode.EMBLEM_FORGE}>Emblem Forge</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2 border-t border-brandYellow/10 pt-4">
                <button onClick={() => setShowSaveOptions(false)} className="px-6 py-2 bg-white/10 text-white text-[10px] font-black uppercase hover:bg-white/20 transition-colors">Cancel</button>
                <button onClick={handleSavePreset} className="px-8 py-2 bg-brandYellow text-black text-[10px] font-black uppercase hover:brightness-110 transition-all shadow-neon-yellow-soft">Commit_To_Vault</button>
              </div>
            </div>
          )}
        </div>
      }
      footer={
        <div className="space-y-4">
          <GenerationBar onGenerate={() => uploadedImage && handleExtractStyle(uploadedImage)} isProcessing={isProcessing}>
             <div className="flex-1 flex items-center justify-center text-[10px] font-black uppercase text-brandCharcoal dark:text-brandYellow/60 tracking-widest italic">
               { status === 'STARVING' ? 'Inject image buffer for forensic extraction' : (isProcessing ? 'Harvesting Preset DNA...' : 'Ready for Extraction') }
             </div>
          </GenerationBar>
        </div>
      }
    />
  );
};
