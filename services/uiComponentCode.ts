
import { ExtractionResult } from '../types.ts';

/**
 * UI Component Code Generator
 * Translates Extraction DNA into usable CSS/React snippets.
 */
export class UIComponentSynthesizer {
  static generateTailwindTheme(dna: ExtractionResult): string {
    const palette = dna.palette || ['#000000', '#ffffff'];
    const mood = dna.mood?.[0] || 'Modern';
    
    return `
// Tailwind Configuration Snippet for: ${dna.name}
// Visual Language: ${mood} / ${dna.formLanguage}

module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${palette[0]}',
          secondary: '${palette[1]}',
          accent: '${palette[2] || palette[0]}',
        }
      },
      borderRadius: {
        'dna': '${dna.formLanguage.toLowerCase().includes('geometric') ? '0px' : '12px'}',
      }
    }
  }
};
    `.trim();
  }

  static generateReactComponent(dna: ExtractionResult): string {
    return `
import React from 'react';

// DNA-Synthesized Component: ${dna.name}
export const IdentityArtifact = () => {
  return (
    <div className="p-8 border-2 border-brand-primary rounded-dna shadow-xl">
      <h1 className="text-4xl font-black uppercase tracking-widest text-brand-primary">
        ${dna.name}
      </h1>
      <p className="mt-4 text-brand-secondary/80 font-medium leading-relaxed">
        ${dna.description}
      </p>
      <div className="mt-6 flex gap-2">
        ${(dna.palette || []).map(color => `<div className="w-8 h-8 rounded-full" style={{ backgroundColor: '${color}' }} />`).join('\n        ')}
      </div>
    </div>
  );
};
    `.trim();
  }
}
