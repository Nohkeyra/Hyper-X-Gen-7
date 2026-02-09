
// FINAL – LOCKED
import React, { useState, useCallback, useMemo } from 'react';
import { KernelConfig, ExtractionResult, PanelMode } from '../types.ts';
import { extractStyleFromImage } from '../services/geminiService.ts';
import { PresetCard } from './PresetCard.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';
import { TrashIcon, StarIcon, VectorIcon, TypographyIcon, MonogramIcon } from './Icons.tsx';
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
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void; 
  onApiKeyError: () => void;
  onModeSwitch?: (mode: PanelMode, data?: any) => void;
}

const StyleDNAReport: React.FC<{ dna: ExtractionResult; onSave: () => void; onJump: (mode: PanelMode) => void; }> = ({ dna, onSave, onJump }) => {
  const isAuthenticityHigh = dna.styleAuthenticityScore > 80;
  
  return (
    <div className="bg-brandNeutral dark:bg-brandDeep border-2 border-brandRed p-4 space-y-4 animate-in slide-in-from-bottom-4 duration-500 rounded-sm">
      <div className="flex justify-between items-center border-b border-white/10 pb-2">
        <h4 className="text-[10px] font-black uppercase text-brandRed tracking-widest italic">DNA_FOUND: {dna.name}</h4>
        <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest">Type: {dna.domain}</span>
      </div>

      <div className="space-y-1 text-[9px] font-bold uppercase">
        <p>Style: <span className="text-brandRed">{dna.domain}</span></p>
        <p>Mood: <span className="text-brandYellow">{dna.mood.join(', ')}</span></p>
        <p>Name: <span className="text-white">{dna.name}</span></p>
        <p>Style Score: <span className={isAuthenticityHigh ? 'text-brandYellow' : 'text-brandRed'}>{dna.styleAuthenticityScore}%</span></p>
        <div className="flex gap-1.5 mt-2 mb-2">
          {dna.palette.map((color, i) => (
            <div key={i} className="w-6 h-6 rounded-sm border border-white/10 shrink-0 shadow-sm" style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
        {dna.formLanguage && (
          <p>Forms: <span className="text-white/80">{dna.formLanguage}</span></p>
        )}
      </div>

      <p className="text-[9px] text-white/70 uppercase leading-tight font-bold italic border-t border-white/5 pt-3">{dna.description}</p>
      
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button onClick={onSave} className="col-span-2 py-2.5 bg-brandRed text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(204,0,1,0.3)] hover:brightness-110 transition-all">
          <StarIcon className="w-3.5 h-3.5" /> COMMIT_TO_VAULT
        </button>
        
        <button onClick={() => onJump(PanelMode.VECTOR)} className="py-2 border border-white/10 text-white/60 hover:text-brandRed hover:border-brandRed transition-all text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm">
          <VectorIcon className="w-3 h-3" /> JUMP_VECTOR
        </button>
        
        <button onClick={() => onJump(PanelMode.TYPOGRAPHY)} className="py-2 border border-white/10 text-white/60 hover:text-brandRed hover:border-brandRed transition-all text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm">
          <TypographyIcon className="w-3 h-3" /> JUMP_TYPO
        </button>
      </div>
    </div>
  );
};

export const StyleExtractorPanel: React.FC<StyleExtractorPanelProps> = ({
  initialData, kernelConfig, savedPresets = [], onSaveToPresets, onDeletePreset, addLog, onModeSwitch
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || null);
  const [extractedDna, setExtractedDna] = useState<ExtractionResult | null>(initialData?.dna || null);
  const [reconStatusOverride, setReconStatusOverride] = useState<string | null>(null);
  
  const { status, isProcessing, transition } = useDevourer(initialData?.imageUrl ? 'BUFFER_LOADED' : 'STARVING');

  const dnaVault = useMemo(() => savedPresets.filter(p => p && p.dna), [savedPresets]);

  const handleExtractStyle = useCallback(async (imageBase64: string) => {
    if (!imageBase64 || isProcessing) return;

    try {
      addLog("STYLE_EXTRACTION: INITIATED", "info");
      transition('AUDITING_BUFFER', true);
      
      // Granular Status Sequence
      setReconStatusOverride("ANALYZING_VISUAL_STYLE");
      await new Promise(r => setTimeout(r, 800));
      setReconStatusOverride("EXTRACTING_COLOR_DNA");
      await new Promise(r => setTimeout(r, 1000));
      setReconStatusOverride("DECODING_FORM_LANGUAGE");
      await new Promise(r => setTimeout(r, 900));
      setReconStatusOverride("CAPTURING_MOOD");
      await new Promise(r => setTimeout(r, 700));

      const prompt = `
        Capture the ARTISTIC ESSENCE of this image.
        1. DECODE THE VISUAL LANGUAGE.
        2. EXTRACT Colors, Mood, Form Language, and Style Family.
        3. Create a repeatable STYLE PRESET DNA.
      `;

      const extracted = await extractStyleFromImage(imageBase64, kernelConfig, prompt);
      
      setExtractedDna(extracted);
      setReconStatusOverride("STYLE_CAPTURED");
      transition('DNA_HARVESTED');
      addLog(`STYLE_DNA_HARVESTED: ${extracted.name}`, "success");
      
    } catch (err: any) {
      console.error(err);
      setReconStatusOverride("AUDIT_FAILED");
      transition('LATTICE_FAIL');
      addLog(`EXTRACTION_FAILED: ${err.message}`, "error");
    } finally {
      setTimeout(() => setReconStatusOverride(null), 2000);
    }
  }, [kernelConfig, addLog, isProcessing, transition]);

  const handleTriggerExtract = () => {
    if (uploadedImage) {
      handleExtractStyle(uploadedImage);
    }
  };

  const handleJumpToSynthesis = (mode: PanelMode) => {
    if (!extractedDna || !onModeSwitch) return;
    onModeSwitch(mode, { 
      dna: extractedDna, 
      imageUrl: uploadedImage,
      source: 'EXTRACTION_BRIDGE'
    });
  };

  return (
    <PanelLayout 
      sidebar={
        <>
          <SidebarHeader moduleNumber="Module_04" title="Style_Extractor" version="Visual Style DNA Capture v2.0" colorClass="text-brandRed" borderColorClass="border-brandRed" />
          <div className="md:block hidden">
            <p className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic mb-4">Visual Style DNA Capture v2.0</p>
          </div>
        </>
      }
      canvas={
        <div className="flex-1 flex flex-col gap-4">
          <CanvasStage
            uploadedImage={uploadedImage} generatedOutput={null} isProcessing={isProcessing}
            hudContent={<ReconHUD reconStatus={reconStatusOverride || status} authenticityScore={extractedDna?.styleAuthenticityScore} />}
            onClear={() => { setUploadedImage(null); setExtractedDna(null); transition('STARVING'); }}
            onFileUpload={(f) => { const r = new FileReader(); r.onload = e => setUploadedImage(e.target?.result as string); r.readAsDataURL(f); transition('BUFFER_LOADED'); }}
          />
          {extractedDna && (
            <StyleDNAReport 
              dna={extractedDna} 
              onJump={handleJumpToSynthesis}
              onSave={() => { onSaveToPresets({ id: `dna-${Date.now()}`, name: extractedDna.name, type: PanelMode.EXTRACTOR, dna: extractedDna, timestamp: new Date().toLocaleTimeString(), imageUrl: uploadedImage }); addLog("STYLE_COMMITTED_TO_VAULT", "success"); }} 
            />
          )}
        </div>
      }
      footer={
        <div className="space-y-4">
          {dnaVault.length > 0 && (
            <div className="bg-black/20 p-3 border border-white/5 rounded-sm">
              <h5 className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-3 italic">STYLE_LIBRARY</h5>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {dnaVault.map(p => (
                  <div key={p.id} className="relative group shrink-0 w-44">
                    <PresetCard name={p.name} description={p.dna?.domain || 'DNA'} isActive={false} onClick={() => {}} iconChar="S" />
                    <button onClick={() => { onDeletePreset(p.id); addLog("STYLE_PURGED_FROM_VAULT", "warning"); }} className="absolute top-1 right-1 p-1 bg-brandRed text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-2.5 h-2.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <GenerationBar onGenerate={handleTriggerExtract} isProcessing={isProcessing}>
             <div className="flex-1 flex items-center justify-center text-[10px] font-black uppercase text-brandCharcoal dark:text-white/60 tracking-widest italic">
               { status === 'STARVING' ? 'Handshake required: upload source image' : (isProcessing ? 'Analyzing Artistic DNA...' : 'Ready for Aesthetic Extraction') }
             </div>
          </GenerationBar>
        </div>
      }
    />
  );
};
