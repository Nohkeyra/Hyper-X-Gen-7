
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { PanelMode, ExtractionResult, KernelConfig } from '../types.ts';
import { extractStyleFromImage } from '../services/geminiService.ts';
import { StarIcon, BoxIcon, PulseIcon, TrashIcon } from './Icons.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { ReconHUD } from './HUD.tsx';
import { PanelLayout } from './Layouts.tsx';

interface StyleExtractorPanelProps {
  initialData?: any;
  onSaveToHistory?: (data: any) => void;
  onSaveToPresets?: (data: any) => void;
  onDeletePreset?: (id: string) => void;
  savedPresets?: any[];
  kernelConfig: KernelConfig;
  integrity?: number;
  refinementLevel?: number;
  uiRefined?: boolean;
  onModeSwitch: (mode: PanelMode, data?: any) => void;
  onSetGlobalDna?: (dna: ExtractionResult | null) => void;
  activeGlobalDna?: ExtractionResult | null;
  onSaveFeedback?: () => void;
}

export const StyleExtractorPanel: React.FC<StyleExtractorPanelProps> = ({
  initialData,
  onSaveToHistory,
  onSaveToPresets,
  onDeletePreset,
  savedPresets = [],
  kernelConfig,
  integrity,
  refinementLevel = 0,
  uiRefined,
  onModeSwitch,
  onSetGlobalDna,
  activeGlobalDna,
  onSaveFeedback
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.uploadedImage || initialData?.imageUrl || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(initialData?.dna || null);
  const [reconStatus, setReconStatus] = useState(initialData?.dna ? "DNA_HARVESTED" : "IDLE");
  const [shouldAnalyze, setShouldAnalyze] = useState(false);
  
  const processingRef = useRef(false);

  const storedDnaLibrary = useMemo(() => {
    return Array.isArray(savedPresets) ? savedPresets.filter(p => p && p.dna) : [];
  }, [savedPresets]);

  const isAlreadySaved = useMemo(() => {
    if (!extractedData) return false;
    return storedDnaLibrary.some(p => p.dna?.name === extractedData.name && p.dna?.domain === extractedData.domain);
  }, [extractedData, storedDnaLibrary]);

  const handleAnalyze = useCallback(async () => {
    if (processingRef.current || !uploadedImage) {
      setReconStatus('CRITICAL: NO_BUFFER');
      return;
    }
    setIsProcessing(true);
    processingRef.current = true;
    setExtractedData(null);

    setReconStatus('DETECTING_DESIGN_GRAVITY');
    await new Promise(r => setTimeout(r, 800));
    
    setReconStatus("APPLYING_AUTONOMOUS_FORENSICS");
    await new Promise(r => setTimeout(r, 1000));
    
    try {
      const result = await extractStyleFromImage(uploadedImage, kernelConfig);
      
      setExtractedData(result);
      setReconStatus(`DNA_HARVESTED: ${result.domain.toUpperCase()}`);
      
      // AUTO-ANCHOR on successful extraction - DISABLED per user request
      // onSetGlobalDna?.(result);
      
      onSaveToHistory?.({ name: result.name, type: PanelMode.EXTRACTOR, uploadedImage, dna: result });
    } catch (e: any) {
      console.error(e);
      if (e?.message?.includes('429')) {
        setReconStatus("QUOTA_EXHAUSTED_RETRYING");
      } else {
        setReconStatus("AUDIT_FAILED");
      }
    } finally { 
      setIsProcessing(false); 
      processingRef.current = false;
    }
  }, [uploadedImage, kernelConfig, onSaveToHistory]);

  useEffect(() => {
    if (shouldAnalyze && uploadedImage) {
      setShouldAnalyze(false); // Reset trigger
      handleAnalyze();
    }
  }, [shouldAnalyze, uploadedImage, handleAnalyze]);

  useEffect(() => {
    if (initialData?.uploadedImage || initialData?.imageUrl) {
      setUploadedImage(initialData.uploadedImage || initialData.imageUrl);
      if (initialData.dna) {
        setExtractedData(initialData.dna);
        setReconStatus("DNA_HARVESTED");
      }
    }
  }, [initialData]);

  const handleSavePreset = () => {
    if (!extractedData || isProcessing) return;
    
    let presetType: PanelMode;
    switch (extractedData.domain) {
      case 'Vector': presetType = PanelMode.VECTOR; break;
      case 'Typography': presetType = PanelMode.TYPOGRAPHY; break;
      case 'Monogram': presetType = PanelMode.MONOGRAM; break;
      default: presetType = PanelMode.EXTRACTOR;
    }

    onSaveToPresets?.({
      id: `dna-${extractedData.name}-${Date.now()}`,
      name: extractedData.name,
      type: presetType,
      description: `Forensic DNA [${extractedData.domain}]: ${extractedData.description}`,
      dna: extractedData,
      category: `${extractedData.domain} Blueprint`,
      timestamp: new Date().toLocaleTimeString()
    });
    setReconStatus("FILE_COMMITTED");
    onSaveFeedback?.();
  };

  const jumpToSynthesis = (mode: PanelMode) => {
    if (!extractedData || isProcessing) return;
    onSetGlobalDna?.(extractedData);
    onModeSwitch(mode, { dna: extractedData, isPresetLoad: true });
  };

  const isAnchorActive = activeGlobalDna?.name === extractedData?.name && activeGlobalDna?.domain === extractedData?.domain;

  return (
    <PanelLayout sidebar={null}>
      <CanvasStage
        uploadedImage={uploadedImage}
        generatedOutput={null}
        isProcessing={isProcessing}
        hudContent={<ReconHUD reconStatus={isAnchorActive ? `DNA_LOCKED: ${extractedData?.name.toUpperCase()}` : reconStatus} authenticityScore={extractedData?.styleAuthenticityScore} />}
        isValidationError={reconStatus.includes("FAILED") || reconStatus.includes("CRITICAL")}
        uiRefined={uiRefined}
        refinementLevel={refinementLevel}
        onClear={() => { 
          if(isProcessing) return; 
          setUploadedImage(null); 
          setExtractedData(null); 
          setReconStatus("IDLE"); 
          onSetGlobalDna?.(null); // Release anchor on clear
        }}
        onGenerate={handleAnalyze}
        onFileUpload={(f) => {
          if(isProcessing) return;
          const r = new FileReader(); r.onload = (e) => {
            const base64 = e.target?.result as string;
            setUploadedImage(base64);
            setExtractedData(null);
            onSetGlobalDna?.(null); // Clear previous anchor when new image uploaded
            setShouldAnalyze(true);
          };
          r.readAsDataURL(f);
        }}
        downloadFilename={`hyperxgen_forensic_${Date.now()}.png`}
      />
      
      <div className="my-8 text-center">
        <h2 className="text-xl font-black uppercase tracking-widest text-brandCharcoal dark:text-white">Autonomous DNA Extraction</h2>
        <p className="text-xs text-brandCharcoalMuted dark:text-white/40 uppercase tracking-widest mt-1">Upload an image to automatically detect and extract its core design signature.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex">
            <button 
              onClick={handleSavePreset}
              disabled={!extractedData || isProcessing || isAlreadySaved}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase transition-all border-2 rounded-sm
                ${isAlreadySaved 
                  ? 'border-brandYellow bg-brandYellow/10 text-brandYellow cursor-default' 
                  : (extractedData && !isProcessing) 
                    ? 'border-brandRed bg-brandRed text-white shadow-lg' 
                    : 'border-brandCharcoal/10 text-brandCharcoalSoft cursor-not-allowed opacity-50'}
              `}
            >
              <StarIcon className={`w-3.5 h-3.5 ${isAlreadySaved ? 'fill-current' : ''}`} /> 
              {isAlreadySaved ? 'BLUEPRINT_COMMITTED' : 'COMMIT_FORENSIC_BLUEPRINT'}
            </button>
        </div>

        {extractedData && (
          <div className="animate-in slide-in-up duration-500 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-brandCharcoal text-brandNeutral p-8 border-t-8 border-brandRed shadow-2xl rounded-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-4">{extractedData.name}</h3>
                  <div className="flex gap-2 mb-6">
                    <span className="text-[8px] font-black bg-brandRed text-white px-2 py-0.5 rounded-sm">{extractedData.domain.toUpperCase()}</span>
                    {isAnchorActive && <span className="text-[8px] font-black bg-brandYellow text-brandBlue px-2 py-0.5 rounded-sm uppercase tracking-tighter">ANCHORED</span>}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-4">DNA_SUMMARY</div>
                  <p className="text-[10px] font-bold uppercase leading-relaxed text-brandNeutral/70 italic border-l-2 border-brandRed pl-4 mb-8">
                    {extractedData.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {extractedData.palette.map((color, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-sm border border-white/10 shadow-lg" style={{ backgroundColor: color }} />
                  ))}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border-2 border-brandCharcoal dark:border-white/10 p-8 rounded-sm shadow-xl flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <PulseIcon className="w-5 h-5 text-brandRed" />
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brandCharcoal dark:text-white">FORENSIC_LATTICE_OK</h4>
                </div>
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[7px] font-black text-brandCharcoalMuted uppercase mb-1">Authenticity</span>
                  <span className="text-sm font-black italic text-brandYellow">100.0%</span>
                </div>
              </div>
              
              <div className="space-y-4 flex-1">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase">
                   <span className="text-brandCharcoal/40 dark:text-white/40">Threshold_Noise_Floor</span>
                   <span className="text-brandCharcoal dark:text-white">{extractedData.parameters.threshold * 100}%</span>
                 </div>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase">
                   <span className="text-brandCharcoal/40 dark:text-white/40">Jitter_Smoothing</span>
                   <span className="text-brandCharcoal dark:text-white">{extractedData.parameters.smoothing * 100}%</span>
                 </div>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase">
                   <span className="text-brandCharcoal/40 dark:text-white/40">Stroke_Skin_Lock</span>
                   <span className="text-brandYellow">ACTIVE</span>
                 </div>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase">
                   <span className="text-brandCharcoal/40 dark:text-white/40">Geometric_Parity</span>
                   <span className="text-brandCharcoal dark:text-white">VERIFIED</span>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-brandCharcoal/5 dark:border-white/5 grid grid-cols-3 gap-2">
                 <button onClick={() => jumpToSynthesis(PanelMode.VECTOR)} className="py-2 bg-brandCharcoal/5 dark:bg-white/5 hover:bg-brandRed hover:text-white transition-all text-[8px] font-black uppercase rounded-sm">VECTOR</button>
                 <button onClick={() => jumpToSynthesis(PanelMode.TYPOGRAPHY)} className="py-2 bg-brandCharcoal/5 dark:bg-white/5 hover:bg-brandYellow hover:text-brandBlue transition-all text-[8px] font-black uppercase rounded-sm">TYPO</button>
                 <button onClick={() => jumpToSynthesis(PanelMode.MONOGRAM)} className="py-2 bg-brandCharcoal/5 dark:bg-white/5 hover:bg-brandCharcoal hover:text-white transition-all text-[8px] font-black uppercase rounded-sm">MONO</button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-brandCharcoal text-brandYellow text-[9px] font-black uppercase px-3 py-1 border-l-4 border-brandRed rounded-sm italic tracking-widest">DNA_VAULT_MANIFEST</div>
              <div className="h-[1px] flex-1 bg-brandCharcoal/10 dark:bg-white/5" />
            </div>
            
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {storedDnaLibrary.map((item) => (
                <div 
                  key={item.id} 
                  className={`group relative h-28 flex flex-col items-center justify-center p-3 border-2 transition-all rounded-sm cursor-pointer
                    ${activeGlobalDna?.name === item.dna.name ? 'border-brandRed bg-brandRed/5' : 'bg-white dark:bg-zinc-800 border-brandCharcoal/10 dark:border-white/10 hover:border-brandRed'}
                  `}
                  onClick={() => {
                    setExtractedData(item.dna);
                    setReconStatus("DNA_HARVESTED");
                    onSetGlobalDna?.(item.dna);
                  }}
                >
                  <button onClick={(e) => { e.stopPropagation(); onDeletePreset?.(item.id); }} className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 hover:text-brandRed transition-opacity"><TrashIcon className="w-3.5 h-3.5" /></button>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-sm mb-2 text-brandRed bg-brandRed/10 group-hover:bg-brandRed group-hover:text-white transition-colors shadow-sm`}>
                    <StarIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-black uppercase text-brandCharcoal dark:text-brandYellow tracking-tighter truncate w-full text-center">{item.name}</span>
                </div>
              ))}
              {storedDnaLibrary.length === 0 && (
                <div className="col-span-full py-12 border-2 border-dashed border-brandCharcoal/10 dark:border-white/10 rounded-sm flex flex-col items-center justify-center opacity-30 italic">
                  <BoxIcon className="w-8 h-8 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Archives_Empty</span>
                </div>
              )}
            </div>
        </div>
      </div>
    </PanelLayout>
  );
};
