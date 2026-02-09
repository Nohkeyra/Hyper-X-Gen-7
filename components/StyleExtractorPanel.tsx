import React, { useState, useCallback, useMemo } from 'react';
import { KernelConfig, ExtractionResult, PresetItem, PanelMode } from '../types.ts';
import { extractStyleFromImage } from '../services/geminiService.ts';
import { PresetCard } from './PresetCard.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';
import { TrashIcon, StarIcon } from './Icons.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { GenerationBar } from './GenerationBar.tsx';
import { ReconHUD } from './HUD.tsx';
import { useDevourer } from '../hooks/useDevourer.ts';

// Props interface remains the same
interface StyleExtractorPanelProps {
  initialData?: any;
  kernelConfig: KernelConfig;
  savedPresets: any[];
  onSaveToPresets: (preset: any) => void;
  onDeletePreset: (id: string) => void;
  onSaveFeedback?: () => void;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  onApiKeyError: () => void;
}

// Internal component for displaying the extracted DNA report
const ForensicReport: React.FC<{ dna: ExtractionResult; onSave: () => void; }> = ({ dna, onSave }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section>
        <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/30 tracking-widest mb-3 border-b border-brandCharcoal/10 dark:border-white/5 pb-2">Forensic Report</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Name</label>
            <span className="text-[9px] font-black text-brandRed italic">{dna.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Domain</label>
            <span className="text-[9px] font-mono text-brandCharcoal dark:text-white">{dna.domain}</span>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40">Confidence</label>
            <span className="text-[9px] font-mono text-brandCharcoal dark:text-white">{(dna.confidence * 100).toFixed(1)}%</span>
          </div>
          <div>
            <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40 block mb-1.5">Description</label>
            <p className="text-[9px] text-brandCharcoal dark:text-white/80 font-semibold">{dna.description}</p>
          </div>
          <div>
            <label className="text-[8px] font-black uppercase text-brandCharcoalMuted dark:text-white/40 block mb-2">Palette</label>
            <div className="flex gap-2 flex-wrap">
              {dna.palette.map((color, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-sm border border-brandCharcoal/10 dark:border-white/10" style={{ backgroundColor: color }} />
                  <span className="text-[8px] font-mono text-brandCharcoalMuted dark:text-white/60">{color}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <button 
        onClick={onSave}
        className="w-full py-3 bg-brandRed text-[9px] font-black uppercase tracking-widest text-white hover:bg-opacity-90 transition-all rounded-sm flex items-center justify-center gap-2"
      >
        <StarIcon className="w-3.5 h-3.5" />
        Commit DNA to Vault
      </button>
    </div>
  );
};

// Main Panel Component
export const StyleExtractorPanel: React.FC<StyleExtractorPanelProps> = ({
  initialData,
  kernelConfig,
  savedPresets,
  onSaveToPresets,
  onDeletePreset,
  onSaveFeedback,
  addLog,
  onApiKeyError,
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || null);
  const [extractedDna, setExtractedDna] = useState<ExtractionResult | null>(initialData?.dna || null);
  const { status, isProcessing, transition } = useDevourer(initialData?.imageUrl ? 'BUFFER_LOADED' : 'STARVING');

  const dnaVaultPresets = useMemo(() => {
    return savedPresets.filter(p => p && p.dna).sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
  }, [savedPresets]);

  const handleFileUpload = (file: File) => {
    if (isProcessing) return;
    const reader = new FileReader();
    reader.onload = e => {
      setUploadedImage(e.target?.result as string);
      setExtractedDna(null);
      transition('BUFFER_LOADED');
      addLog("IMAGE_BUFFER_LOADED", "info");
    };
    reader.readAsDataURL(file);
  };
  
  const handleClear = () => {
    if (isProcessing) return;
    setUploadedImage(null);
    setExtractedDna(null);
    transition('STARVING');
    addLog("BUFFER_PURGED: EXTRACTOR_RESET", 'warning');
  };

  const handleApiError = useCallback((e: any) => {
    const errorStr = (e?.message || '').toLowerCase();
    if (errorStr.includes('requested entity was not found')) {
      addLog('API Key error detected. Please select a valid key.', 'error');
      onApiKeyError();
      return true;
    }
    return false;
  }, [addLog, onApiKeyError]);

  const handleExtractStyle = useCallback(async () => {
    if (!uploadedImage || isProcessing) return;

    transition('AUDITING_BUFFER', true);
    addLog("STYLE_EXTRACTION: INITIATED", "info");

    const prompt = `Extract core geometric and visual DNA. Prioritize clean shapes, vector readiness, symmetry, and high contrast. Maintain minimal but precise style representation.`;

    try {
      const dna = await extractStyleFromImage(uploadedImage, kernelConfig, prompt);
      dna.description = `Vector-optimized, high-contrast geometry, minimal abstraction, precise form.`;
      setExtractedDna(dna);
      transition('DNA_HARVESTED');
      addLog(`STYLE_EXTRACTION: COMPLETED - ${dna.name}`, "success");
    } catch (e: any) {
      if (handleApiError(e)) return;
      console.error(e);
      transition('LATTICE_FAIL');
      addLog(`STYLE_EXTRACTION_FAILED: ${e.message}`, "error");
    }
  }, [uploadedImage, kernelConfig, addLog, isProcessing, transition, handleApiError]);
  
  const handleSaveDna = useCallback((dnaToSave: ExtractionResult) => {
    if (!dnaToSave) return;

    const newPreset = {
      id: `dna-${dnaToSave.name}-${Date.now()}`,
      name: dnaToSave.name,
      type: PanelMode.EXTRACTOR, // Always save as an extractor type for clarity
      description: `Forensic DNA [${dnaToSave.domain}]: ${dnaToSave.description}`,
      dna: dnaToSave,
      category: `${dnaToSave.domain} Blueprint`,
      timestamp: new Date().toLocaleTimeString()
    };
    
    if (savedPresets.some(p => p.name === newPreset.name && p.dna?.description === newPreset.dna?.description)) {
      addLog("DNA_VAULT: IDENTICAL_FRAGMENT_EXISTS", 'info');
      return;
    }

    onSaveToPresets(newPreset);
    onSaveFeedback?.();
  }, [onSaveToPresets, onSaveFeedback, addLog, savedPresets]);

  const SidebarContent = (
    <>
      <SidebarHeader 
        moduleNumber="Module_04" 
        title="Style_Extractor" 
        version="v5.2 Forensic DNA"
        colorClass="text-brandRed"
        borderColorClass="border-brandRed"
      />
      <div className="space-y-10">
        {extractedDna ? (
          <ForensicReport dna={extractedDna} onSave={() => handleSaveDna(extractedDna)} />
        ) : (
          <div className="space-y-4 text-[9px] font-bold text-brandCharcoalMuted dark:text-white/60 uppercase leading-relaxed animate-in fade-in duration-500">
            <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/30 tracking-widest mb-3 border-b border-brandCharcoal/10 dark:border-white/5 pb-2">[ANALYSIS_CONSOLE]</h4>
            <p>Awaiting source image buffer.</p>
            <p>Upload an image via the main canvas to initiate forensic style extraction and generate a reusable DNA fragment.</p>
          </div>
        )}
        
        {dnaVaultPresets.length > 0 && (
          <div className="animate-in fade-in duration-500 mt-8">
              <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-3 bg-brandCharcoal dark:bg-white/40 rounded-full" />
                  <h3 className="text-[9px] font-black uppercase text-brandCharcoal dark:text-white tracking-[0.25em]">DNA_VAULT</h3>
              </div>
              <div className="space-y-3">
                  {dnaVaultPresets.map(preset => (
                      <div key={preset.id} className="relative group/vaultitem">
                          <PresetCard
                              name={preset.name}
                              description={preset.dna?.description || 'Saved DNA Fragment'}
                              isActive={false}
                              onClick={() => {}} // Vault items are not clickable for activation in this panel
                              iconChar={preset.dna?.domain[0] || 'X'}
                          />
                          <button
                              onClick={() => {
                                  onDeletePreset(preset.id);
                                  addLog(`DNA_VAULT: FRAGMENT_DELETED - ${preset.name}`, 'warning');
                              }}
                              className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 bg-brandRed/80 text-white rounded-full opacity-0 group-hover/vaultitem:opacity-100 transition-opacity z-20"
                              title="Delete DNA"
                          >
                              <TrashIcon className="w-3 h-3" />
                          </button>
                      </div>
                  ))}
              </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <PanelLayout sidebar={SidebarContent}>
      <CanvasStage
        uploadedImage={uploadedImage}
        generatedOutput={null}
        isProcessing={isProcessing}
        hudContent={<ReconHUD reconStatus={status} authenticityScore={extractedDna?.confidence} />}
        onClear={handleClear}
        onFileUpload={handleFileUpload}
      />
      <GenerationBar
        onGenerate={handleExtractStyle}
        isProcessing={isProcessing}
      >
        <div className="flex-1 flex items-center justify-center text-[9px] font-black uppercase text-brandCharcoal/40 dark:text-white/30 tracking-widest">
            { status === 'STARVING' && 'Awaiting source buffer' }
            { status === 'BUFFER_LOADED' && 'Source buffer loaded. Ready to extract DNA.' }
            { isProcessing && 'Forensic analysis in progress...' }
            { status === 'DNA_HARVESTED' && 'DNA Extraction Complete.' }
            { status === 'LATTICE_FAIL' && 'Analysis Failed. Check Logs.' }
        </div>
      </GenerationBar>
    </PanelLayout>
  );
};