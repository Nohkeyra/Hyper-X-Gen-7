import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PanelMode, KernelConfig, FilterPreset, LatticeBuffer, PresetCategory, FilterType } from '../types.ts';
import { getMobileCategories } from '../presets/index.ts';
import { GenerationBar } from './GenerationBar.tsx';
import { PresetCarousel } from './PresetCarousel.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { FilterHUD } from './HUD.tsx';
import { PanelLayout, SidebarHeader } from './Layouts.tsx';
import { PresetCard } from './PresetCard.tsx';
import { useDevourer } from '../hooks/useDevourer.ts';

interface ImageFilterPanelProps {
  initialData?: any;
  onSaveToHistory?: (data: any) => void;
  kernelConfig: KernelConfig;
  integrity?: number;
  refinementLevel?: number;
  uiRefined?: boolean;
  onModeSwitch: (mode: PanelMode, data?: any) => void;
  onStateUpdate?: (state: any) => void;
  addLog: (msg: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  latticeBuffer?: LatticeBuffer | null;
  savedPresets?: any[];
}

const buildFilterString = (b: number, c: number, s: number, presetParams?: FilterPreset['parameters']): string => {
  let filterParts: string[] = [];
  if (b !== 100) filterParts.push(`brightness(${b}%)`);
  if (c !== 100) filterParts.push(`contrast(${c}%)`);
  if (s !== 100) filterParts.push(`saturate(${s}%)`);
  if (presetParams) {
    if (presetParams.filterType === 'Monochrome') filterParts.push(`grayscale(${presetParams.intensity}%)`);
    if (presetParams.filterType === 'Vintage') { filterParts.push(`sepia(${presetParams.intensity}%)`); if(presetParams.hue) filterParts.push(`hue-rotate(${presetParams.hue}deg)`); }
    if (presetParams.filterType === 'Cyberpunk' && presetParams.hue) filterParts.push(`hue-rotate(${presetParams.hue}deg)`);
  }
  return filterParts.join(' ');
};

const applyFiltersToImage = (imageUrl: string, filterCss: string): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      if (ctx) { ctx.filter = filterCss; ctx.drawImage(img, 0, 0); resolve(canvas.toDataURL('image/png')); } else resolve(imageUrl);
    };
    img.src = imageUrl;
  });
};

export const ImageFilterPanel: React.FC<ImageFilterPanelProps> = ({ 
  initialData, onSaveToHistory, uiRefined, onStateUpdate, addLog, latticeBuffer, savedPresets = []
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || null);
  const [filteredImage, setFilteredImage] = useState<string | null>(initialData?.imageUrl || null);
  const { status, isProcessing, transition } = useDevourer(initialData?.imageUrl ? 'BUFFER_LOADED' : 'STARVING');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(initialData?.id || null);
  
  const PRESETS: PresetCategory[] = useMemo(() => {
    return getMobileCategories(PanelMode.FILTERS, savedPresets);
  }, [savedPresets]);
  
  const activeFilter = useMemo(() => 
    PRESETS.flatMap(c => c.items).find(f => f.id === activeFilterId) as FilterPreset | undefined
  , [PRESETS, activeFilterId]);

  useEffect(() => {
    onStateUpdate?.({
      type: PanelMode.FILTERS,
      name: `Filter: ${activeFilter?.name || 'Custom'}`,
      uploadedImage,
      generatedOutput: filteredImage,
      settings: { brightness, contrast, saturation, activeFilterId }
    });
  }, [onStateUpdate, uploadedImage, filteredImage, brightness, contrast, saturation, activeFilterId, activeFilter]);

  const handleApplyFilter = useCallback(async () => {
    if (isProcessing || !uploadedImage) return;
    transition("REFINING_LATTICE", true);
    try {
      const filterCss = buildFilterString(brightness, contrast, saturation, activeFilter?.parameters);
      const result = await applyFiltersToImage(uploadedImage, filterCss);
      setFilteredImage(result);

      onSaveToHistory?.({
        id: `filter-${Date.now()}`,
        name: `Filtered: ${activeFilter?.name || 'Custom'}`,
        type: PanelMode.FILTERS,
        prompt: '',
        imageUrl: result,
        parameters: {
          intensity: activeFilter?.parameters.intensity || 100,
          brightness,
          contrast,
          saturation,
          hue: activeFilter?.parameters.hue || 0,
          filterType: activeFilter?.parameters.filterType || 'Custom',
        },
        category: 'Synthesis',
        description: 'Image processed with spectral filters.'
      } as FilterPreset);

      transition("LATTICE_ACTIVE");
      addLog(`SPECTRAL_TRANSFORM: Applied ${activeFilter?.name || 'custom'} filters`, 'success');
    } catch (e) {
      console.error(e);
      transition("LATTICE_FAIL");
      addLog(`FILTER_ERROR: Failed to process image lattice`, 'error');
    }
  }, [uploadedImage, brightness, contrast, saturation, activeFilter, addLog, isProcessing, transition, onSaveToHistory]);

  const handleClear = useCallback(() => {
    if(isProcessing) return;
    setUploadedImage(null); setFilteredImage(null); setActiveFilterId(null);
    transition("STARVING");
    addLog("BUFFER_PURGED", "warning");
  }, [isProcessing, addLog, transition]);

  const handleFileUpload = useCallback((f: File) => {
    if(isProcessing) return;
    const r = new FileReader(); r.onload = (e) => {
        const base64 = e.target?.result as string; setUploadedImage(base64); setFilteredImage(base64);
        transition("BUFFER_LOADED");
        addLog("ASSET_INJECTED: Raw buffer loaded", "info");
    }; 
    r.readAsDataURL(f);
  }, [isProcessing, addLog, transition]);

  return (
    <PanelLayout
      sidebar={
        <>
          <SidebarHeader moduleNumber="Module_05" title="Image_Filters" version="Spectral Transformation v3.0" colorClass="text-brandBlue" borderColorClass="border-brandBlue" />
          <div className="space-y-6 px-1">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic border-b border-white/5 pb-2">Filter_Library</h4>
                {PRESETS.map(cat => (
                  <div key={cat.title} className="space-y-3">
                    <h3 className="text-[9px] font-black uppercase text-brandCharcoal/40 dark:text-white/40 tracking-widest italic">{cat.title.replace(/_/g, ' ')}</h3>
                    {cat.items.map(p => (
                      <PresetCard key={p.id} name={p.name} description={p.description} prompt={p.prompt} isActive={activeFilterId === p.id} onClick={() => !isProcessing && setActiveFilterId(p.id)} iconChar="F" />
                    ))}
                  </div>
                ))}
             </div>
          </div>
        </>
      }
      canvas={
        <CanvasStage
          uploadedImage={uploadedImage} generatedOutput={filteredImage} isProcessing={isProcessing}
          hudContent={<FilterHUD filterStatus={status} />} isValidationError={false} uiRefined={uiRefined}
          onClear={handleClear} onGenerate={handleApplyFilter} onFileUpload={handleFileUpload} downloadFilename={`hyperxgen_filter_${Date.now()}.png`}
          bridgeSource={initialData?.category === 'LATTICE_BRIDGE' ? latticeBuffer?.sourceMode : null}
        />
      }
      footer={
        <div className="flex flex-col gap-6">
          <GenerationBar
            onGenerate={handleApplyFilter} isProcessing={isProcessing} bridgedThumbnail={initialData?.category === 'LATTICE_BRIDGE' ? initialData.imageUrl : null}
            additionalControls={
              <div className="flex-1 flex items-center gap-6 py-2 min-w-0">
                {[{ label: 'B', val: brightness, set: setBrightness }, { label: 'C', val: contrast, set: setContrast }, { label: 'S', val: saturation, set: setSaturation }].map(s => (
                  <div key={s.label} className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black text-brandCharcoal dark:text-white tracking-widest">{s.label}</span>
                      <span className="text-[10px] font-mono font-black text-brandRed drop-shadow-sm">{s.val}%</span>
                    </div>
                    <input type="range" min="0" max="200" value={s.val} disabled={isProcessing} onChange={e => s.set(parseInt(e.target.value))} className="w-full h-2 bg-brandCharcoalMuted/30 border border-white/10 rounded-full appearance-none accent-brandRed cursor-pointer disabled:opacity-50 transition-colors hover:bg-white/20" />
                  </div>
                ))}
              </div>
            }
          />
          <PresetCarousel categories={PRESETS} activeId={activeFilterId} onSelect={(id:string) => !isProcessing && setActiveFilterId(id)} />
        </div>
      }
    />
  );
};