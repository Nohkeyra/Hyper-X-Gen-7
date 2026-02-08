import React, { useState, useCallback, useMemo } from 'react';
import { KernelConfig, ExtractionResult, PresetItem, PresetCategory, PanelMode } from '../types.ts';
import { PRESET_REGISTRY } from '../presets/index.ts';
import { extractStyleFromImage } from '../services/geminiService.ts';
import { PresetCard } from './PresetCard.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';

interface StyleExtractorPanelProps {
  initialData?: any;
  kernelConfig: KernelConfig;
  savedPresets: any[];
  onSaveToPresets: (preset: any) => void;
  onDeletePreset: (id: string) => void;
  activeGlobalDna?: ExtractionResult | null;
  onSaveFeedback?: () => void;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
}

export const StyleExtractorPanel: React.FC<StyleExtractorPanelProps> = ({
  initialData,
  kernelConfig,
  savedPresets,
  onSaveToPresets,
  onDeletePreset,
  activeGlobalDna,
  onSaveFeedback,
  addLog
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || null);
  const [extractedDna, setExtractedDna] = useState<ExtractionResult | null>(initialData?.dna || activeGlobalDna || null);
  const [isExtracting, setIsExtracting] = useState(false);

  const PRESETS = useMemo(() => {
    // Note: StyleExtractor doesn't have its own specific presets in the registry currently.
    // This could be a placeholder for future functionality if needed.
    return [] as PresetCategory[];
  }, []);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleExtractStyle = useCallback(async () => {
    if (!uploadedImage || isExtracting) return;

    setIsExtracting(true);
    addLog("STYLE_EXTRACTION: INITIATED", "info");

    const prompt = `
      Extract core geometric and visual DNA.
      Prioritize clean shapes, vector readiness, symmetry, and high contrast.
      Maintain minimal but precise style representation.
    `;

    try {
      const dna = await extractStyleFromImage(uploadedImage, kernelConfig, prompt);
      // Minimal but strong description for prompting
      dna.description = `Vector-optimized, high-contrast geometry, minimal abstraction, precise form.`;
      setExtractedDna(dna);
      addLog(`STYLE_EXTRACTION: COMPLETED - ${dna.name}`, "success");
      onSaveFeedback?.();
    } catch (e: any) {
      console.error(e);
      addLog(`STYLE_EXTRACTION_FAILED: ${e.message}`, "error");
    } finally {
      setIsExtracting(false);
    }
  }, [uploadedImage, kernelConfig, addLog, isExtracting, onSaveFeedback]);

  const SidebarContent = (
    <>
      <SidebarHeader 
        moduleNumber="Module_04" 
        title="Style_Extractor" 
        version="v5.0 Minimal-Strong Prompting"
        colorClass="text-brandCharcoalMuted dark:text-white/60"
        borderColorClass="border-brandCharcoal dark:border-white/20"
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} 
            className="border-2 border-dashed border-brandCharcoal/20 dark:border-white/20 rounded-sm p-2 text-[8px] uppercase font-black file:mr-2 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-[7px] file:font-semibold file:bg-brandRed/10 file:text-brandRed hover:file:bg-brandRed/20"
          />
          <button 
            onClick={handleExtractStyle}
            disabled={!uploadedImage || isExtracting}
            className="w-full py-2 bg-brandRed/10 border-2 border-brandRed text-[8px] font-black uppercase tracking-widest text-brandRed hover:bg-brandRed hover:text-white transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExtracting ? 'EXTRACTING...' : 'EXTRACT_STYLE'}
          </button>
        </div>

        <div className="space-y-3">
          {extractedDna && (
            <div className="animate-in fade-in duration-500">
               <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-3 bg-brandCharcoal dark:bg-white/40 rounded-full" />
                <h3 className="text-[9px] font-black uppercase text-brandCharcoal dark:text-white tracking-[0.25em]">EXTRACTED_DNA</h3>
              </div>
              <PresetCard 
                key={extractedDna.name}
                name={extractedDna.name}
                description={extractedDna.description}
                isActive={activeGlobalDna?.name === extractedDna.name}
                onClick={() => {
                  onSaveToPresets({
                    id: `dna-${extractedDna.name}-${Date.now()}`,
                    name: extractedDna.name,
                    type: PanelMode.EXTRACTOR, // This can be refined to map to Vector, Typo, etc.
                    description: `Forensic DNA [${extractedDna.domain}]: ${extractedDna.description}`,
                    dna: extractedDna,
                    category: `${extractedDna.domain} Blueprint`,
                    timestamp: new Date().toLocaleTimeString()
                  });
                  onSaveFeedback?.();
                }}
                iconChar="X"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <PanelLayout sidebar={SidebarContent}>
      <div className="flex justify-center items-center h-full text-[9px] font-black text-brandCharcoal dark:text-white uppercase tracking-widest">
        {uploadedImage ? (
          <img src={uploadedImage} className="max-h-[80%] max-w-[80%] object-contain rounded-sm border border-brandCharcoal/10 dark:border-white/20" alt="Uploaded for style extraction" />
        ) : (
          "UPLOAD AN IMAGE TO EXTRACT STYLE"
        )}
      </div>
    </PanelLayout>
  );
};
