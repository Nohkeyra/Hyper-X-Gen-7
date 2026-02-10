/**
 * @deprecated Functionality merged into utils/antiCensor.ts
 * This file is kept for backward compatibility and will be removed in v8.0
 */

import { injectAntiCensor } from '../utils/antiCensor.ts';
import { PanelMode } from '../types.ts';

export const VECTOR_FIDELITY_TOKENS: string[] = [];

/**
 * @deprecated Use injectAntiCensor from utils/antiCensor.ts instead
 */
export function injectPresetTokens(prompt: string, mode: PanelMode): string {
  console.warn("injectPresetTokens is deprecated. Switching to injectAntiCensor.");
  return injectAntiCensor(prompt, mode);
}
