import { PresetCategory, PresetItem, TypographyPreset, MonogramPreset } from '../types';
import { 
  GLOBAL_VECTOR_LOCK, 
  GLOBAL_TYPO_LOCK, 
  GLOBAL_MONO_LOCK, 
  groupAllPromptsByCategory,
  typographyPresets,
  monogramPresets
} from './enginePrompts';

// Export global locks directly from enginePrompts
export { GLOBAL_VECTOR_LOCK, GLOBAL_TYPO_LOCK, GLOBAL_MONO_LOCK };

const mapTypoPresetToPresetItem = (preset: TypographyPreset): PresetItem => ({
  id: `typo-${preset.name.replace(/\s+/g, '-')}`,
  name: preset.name,
  description: preset.description,
  type: 'typography',
  prompt: preset.prompt,
  parameters: { ...preset },
});

const mapMonoPresetToPresetItem = (preset: MonogramPreset): PresetItem => ({
  id: `mono-${preset.name.replace(/\s+/g, '-')}`,
  name: preset.name,
  description: preset.description,
  type: 'monogram',
  prompt: preset.prompt,
  parameters: { ...preset },
});

/**
 * FULL PRESET LIBRARIES
 * Grouped for sidebar and carousel navigation.
 */
export const VECTOR_PRESETS: PresetCategory[] = groupAllPromptsByCategory('vector');
export const TYPOGRAPHY_PRESETS: PresetCategory[] = [
  {
    title: 'General Typography',
    items: typographyPresets.map(mapTypoPresetToPresetItem)
  }
];
export const MONOGRAM_PRESETS: PresetCategory[] = [
  {
    title: 'Monogram Core',
    items: monogramPresets.map(mapMonoPresetToPresetItem)
  }
];
export const FILTERS_PRESETS: PresetCategory[] = groupAllPromptsByCategory('filter');

export const PRESET_REGISTRY = {
  VECTOR: {
    libraries: VECTOR_PRESETS
  },
  TYPOGRAPHY: {
    libraries: TYPOGRAPHY_PRESETS
  },
  MONOGRAM: {
    libraries: MONOGRAM_PRESETS
  },
  FILTERS: {
    libraries: FILTERS_PRESETS
  }
};