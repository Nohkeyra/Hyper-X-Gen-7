
import React, { useState } from 'react';
import { ExtractionResult, PanelMode, StyleCategory } from '../types.ts';
import { StarIcon } from './Icons.tsx';

interface StyleExtractionResultProps {
  extraction: ExtractionResult;
  category: StyleCategory;
  confidence: number;
  recommendedPanel: PanelMode;
  onApply: (panel: PanelMode) => void;
  onSaveToVault: (panel: PanelMode) => void;
}

export const StyleExtractionResult: React.FC<StyleExtractionResultProps> = ({
  extraction,
  category,
  confidence,
  recommendedPanel,
  onApply,
  onSaveToVault
}) => {
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [selectedSavePanel, setSelectedSavePanel] = useState<PanelMode>(recommendedPanel);

  const getPanelIcon = (panel: PanelMode) => {
    switch (panel) {
      case PanelMode.MONOGRAM: return '🔄';
      case PanelMode.TYPOGRAPHY: return '🔤';
      case PanelMode.VECTOR: return '🎨';
      case PanelMode.FILTERS: return '🎛️';
      default: return '❓';
    }
  };

  const handleSaveSubmit = () => {
    onSaveToVault(selectedSavePanel);
    setShowSaveOptions(false);
  };
  
  return (
    <div className="bg-brandNeutral dark:bg-black/60 border-2 border-brandRed dark:border-brandYellow p-4 rounded-sm shadow-neon-yellow-soft animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="text-[10px] font-black uppercase text-brandRed dark:text-brandYellow tracking-widest italic">Aesthetic_Forensics_Locked</h4>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-sm border ${
              category === StyleCategory.MONOGRAM ? 'bg-brandBlue/20 text-brandBlue border-brandBlue/30' :
              category === StyleCategory.TYPOGRAPHY ? 'bg-brandYellow/20 text-brandYellow border-brandYellow/30' :
              'bg-brandRed/20 text-brandRed border-brandRed/30'
            }`}>
              {category}
            </span>
            <span className="text-[8px] font-black text-brandCharcoalMuted dark:text-white/40 uppercase tracking-tighter">
              {confidence}% Confidence_Score
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowSaveOptions(!showSaveOptions)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brandCharcoal dark:bg-zinc-800 text-brandYellow text-[9px] font-black uppercase tracking-widest hover:brightness-110 border border-brandYellow/30 rounded-sm"
          >
            <StarIcon className="w-3.5 h-3.5" />
            {showSaveOptions ? 'CANCEL' : 'SAVE_TO_VAULT'}
          </button>
          
          <button
            onClick={() => onApply(recommendedPanel)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brandRed dark:bg-brandYellow text-white dark:text-black text-[9px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
          >
            <span>{getPanelIcon(recommendedPanel)}</span>
            Apply to {recommendedPanel.toUpperCase().replace('_', ' ')}
          </button>
        </div>
      </div>

      {showSaveOptions && (
        <div className="mb-4 p-4 bg-black/20 border border-brandYellow/20 rounded-sm animate-in zoom-in duration-300">
          <h5 className="text-[8px] font-black text-brandYellow uppercase tracking-widest mb-3">SELECT_TARGET_ENGINE:</h5>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select 
              value={selectedSavePanel} 
              onChange={(e) => setSelectedSavePanel(e.target.value as PanelMode)}
              className="w-full bg-brandCharcoal/80 dark:bg-black border border-brandYellow/30 text-white text-[10px] font-black uppercase p-2 focus:outline-none"
            >
              <option value={PanelMode.VECTOR}>Vector Illustration Engine</option>
              <option value={PanelMode.TYPOGRAPHY}>Typography Word-Art Engine</option>
              <option value={PanelMode.MONOGRAM}>Refined Monogram Engine</option>
            </select>
            <button 
              onClick={handleSaveSubmit}
              className="w-full sm:w-auto px-6 py-2 bg-brandYellow text-black text-[9px] font-black uppercase tracking-widest"
            >
              COMMIT_NOW
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-brandCharcoalSoft dark:text-white/80 leading-relaxed uppercase italic border-l-2 border-brandRed/30 pl-3">
          {extraction.description}
        </p>

        {extraction.palette && extraction.palette.length > 0 && (
          <div className="pt-2">
            <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Color_DNA_Cluster:</p>
            <div className="flex flex-wrap gap-2">
              {extraction.palette.map((color, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 group">
                  <div 
                    className="w-8 h-8 rounded-sm border border-white/10 shadow-sm transition-transform group-hover:scale-110" 
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                  <span className="text-[6px] font-mono text-white/40 group-hover:text-brandYellow transition-colors">{color.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {extraction.metadata?.matchingPresets && extraction.metadata.matchingPresets.length > 0 && (
          <div className="pt-2 border-t border-white/5 dark:border-brandYellow/10">
            <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Synthetic_Preset_Matches:</p>
            <div className="flex gap-2 flex-wrap">
              {extraction.metadata.matchingPresets.slice(0, 3).map((presetId: string) => (
                <span key={presetId} className="px-2 py-1 bg-brandCharcoal/10 dark:bg-white/5 text-[7px] font-mono text-brandRed dark:text-brandYellow border border-white/5 rounded-sm">
                  {presetId}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
