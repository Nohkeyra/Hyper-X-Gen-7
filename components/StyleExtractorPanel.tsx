
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { KernelConfig, ExtractionResult, PanelMode, StyleCategory, Preset } from '../types.ts';
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
  const [classification, setClassification] = useState<any>(null);
  const [reconStatusOverride, setReconStatusOverride] = useState<string | null>(null);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<PanelMode>(PanelMode.VECTOR);
  
  const { status, isProcessing, transition } = useDevourer(initialData?.imageUrl ? 'BUFFER_LOADED' : 'STARVING');

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.EXTRACTOR,
      name: extractedDna?.name || 'Style Extraction',
      uploadedImage,
      generatedOutput: uploadedImage,
      dna: extractedDna,
      settings: {}
    });
  }, [onStateUpdate, uploadedImage, extractedDna]);

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
      setReconStatusOverride("AUDIT_FAILED");
      transition('LATTICE_FAIL');
      addLog(`EXTRACTION_FAILED: ${err.message}`, "error");
    } finally {
      setTimeout(() => setReconStatusOverride(null), 1000);
    }
  }, [kernelConfig, addLog, isProcessing, transition]);

  const handleSavePreset = async () => {
    if (!extractedDna) return;
    
    const preset: any = {
      id: `user-${Date.now()}`,
      name: `Preset_${new Date().toLocaleDateString().replace(/\//g, '_')}`,
      type: selectedPanel,
      category: 'USER_VAULT',
      description: extractedDna.description,
      prompt: extractedDna.promptTemplate,
      dna: extractedDna,
      imageUrl: uploadedImage,
      timestamp: new Date().toISOString()
    };

    // Initialize module-specific parameters
    if (selectedPanel === PanelMode.VECTOR) {
      preset.parameters = { complexity: 'Standard', outline: 'None', mood: 'Professional', background: 'White', colorCount: 6, strokeWeight: 0, style: 'Flat Design' };
    } else if (selectedPanel === PanelMode.TYPOGRAPHY) {
      preset.parameters = { fontStyle: 'Modern', weight: 'Bold', spacing: 'Normal', effect: 'None' };
    } else if (selectedPanel === PanelMode.MONOGRAM) {
      preset.parameters = { layoutMode: 'interlocked', symmetry: 'Perfect Radial', container: 'Suggested', densityRatio: '1:1', legibility: 'High', structureCreativity: 50, densitySpace: 50, traditionalModern: 50, strokeEnds: 'Rounded' };
    }
    
    onSaveToPresets(preset);
    setShowSaveOptions(false);
    addLog(`STYLE_COMMITTED: DNA stored in ${selectedPanel.toUpperCase()} vault`, "success");
  };

  const handleJumpToSynthesis = (mode: PanelMode) => {
    if (!extractedDna || !onModeSwitch) return;
    onModeSwitch(mode, { 
      id: `dna-jump-${Date.now()}`,
      dna: extractedDna, 
      imageUrl: uploadedImage,
      prompt: '',
      name: extractedDna.name,
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
          <div className="md:block hidden">
            <p className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-brandYellow/40 tracking-widest italic mb-4">Preset Forensics Analysis</p>
            <div className="p-3 bg-brandRed/5 dark:bg-brandYellow/5 border border-brandRed/20 dark:border-brandYellow/20 rounded-sm mb-6">
              <span className="text-[8px] font-black text-brandRed dark:text-brandYellow uppercase tracking-widest block mb-1">Instruction:</span>
              <p className="text-[9px] text-brandCharcoalMuted dark:text-white/60 leading-tight">Identify pure design traits and map them directly to engine synthesis presets.</p>
            </div>
          </div>
        </>
      }
      canvas={
        <div className="flex-1 flex flex-col gap-4">
          <CanvasStage
            uploadedImage={uploadedImage} generatedOutput={null} isProcessing={isProcessing}
            hudContent={<ReconHUD reconStatus={reconStatusOverride || status} authenticityScore={extractedDna?.styleAuthenticityScore} />}
            onClear={() => { setUploadedImage(null); setExtractedDna(null); setClassification(null); setShowSaveOptions(false); transition('STARVING'); }}
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
            <div className="bg-brandCharcoal dark:bg-zinc-900 border-2 border-brandYellow p-6 rounded-sm shadow-neon-yellow flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in duration-300">
              <div className="flex items-center gap-3">
                <span className="text-[14px] animate-bounce">💾</span>
                <p className="text-[10px] font-black text-brandYellow uppercase tracking-widest">Commit Style DNA to Vault?</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select 
                  onChange={(e) => setSelectedPanel(e.target.value as PanelMode)}
                  className="bg-black/40 border border-brandYellow/30 text-white text-[10px] font-black p-2 outline-none flex-1 sm:flex-none uppercase"
                >
                  <option value={PanelMode.VECTOR}>Vector Art Engine</option>
                  <option value={PanelMode.TYPOGRAPHY}>Typography Engine</option>
                  <option value={PanelMode.MONOGRAM}>Monogram Engine</option>
                </select>
                <button onClick={handleSavePreset} className="px-6 py-2 bg-brandYellow text-black text-[10px] font-black uppercase hover:brightness-110">Save</button>
                <button onClick={() => setShowSaveOptions(false)} className="px-6 py-2 bg-white/10 text-white text-[10px] font-black uppercase hover:bg-white/20">Cancel</button>
              </div>
            </div>
          )}
        </div>
      }
      footer={
        <div className="space-y-4">
          {dnaVault.length > 0 && (
            <div className="bg-brandNeutral dark:bg-black/20 p-3 border border-brandBlue/10 dark:border-brandYellow/10 rounded-sm">
              <h5 className="text-[8px] font-black text-brandBlue dark:text-brandYellow/40 uppercase tracking-widest mb-3 italic">PRESET_COLLECTION</h5>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {dnaVault.map(p => (
                  <div key={p.id} className="relative group shrink-0 w-48">
                    <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-brandRed dark:bg-brandYellow text-white dark:text-black text-[6px] font-black uppercase rounded-sm">
                      {p.type.toUpperCase()}
                    </div>
                    <PresetCard name={p.name} description={p.dna?.domain || 'DNA'} prompt={p.dna?.promptTemplate} isActive={false} onClick={() => {}} iconChar="S" />
                    <button onClick={() => onDeletePreset(p.id)} className="absolute top-2 right-2 p-1 bg-brandRed text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
