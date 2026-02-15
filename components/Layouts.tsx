import React, { useState } from 'react';

// --- Shared Components ---

interface SidebarHeaderProps {
  moduleNumber: string;
  title: string;
  version: string;
  colorClass: string; // e.g. "text-brandRed"
  borderColorClass: string; // e.g. "border-brandRed"
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  moduleNumber,
  title,
  version,
  colorClass,
  borderColorClass
}) => (
  <div className={`mb-6 md:mb-8 border-b-2 ${borderColorClass} pb-4 md:pb-6`}>
    <div className={`text-[10px] font-black uppercase tracking-widest italic mb-2 ${colorClass}`}>
      {moduleNumber}
    </div>
    <h2 className="text-xl md:text-2xl font-black text-brandCharcoal dark:text-white uppercase italic tracking-tighter leading-none mb-1">
      {title}
    </h2>
    <p className="text-[8px] font-bold text-brandCharcoalMuted uppercase tracking-widest">
      {version}
    </p>
  </div>
);

// --- Layouts ---

interface PageLayoutProps {
  children: React.ReactNode;
  centered?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, centered }) => (
  <div className={`h-full w-full overflow-y-auto custom-scrollbar ${centered ? 'flex flex-col items-center justify-start md:justify-center p-4 md:p-8' : ''}`}>
    <div className={`w-full max-w-[1400px] mx-auto ${centered ? 'flex flex-col items-center' : ''}`}>
      {children}
    </div>
  </div>
);

interface PanelLayoutProps {
  sidebar?: React.ReactNode;
  canvas: React.ReactNode; // Main visual output area
  footer: React.ReactNode; // Main input/generation bar area
}

/**
 * Standard Panel Layout
 * - Optimized for mobile stability.
 * - Library view is handled via an integrated floating toggle to avoid overlapping navigation.
 */
export const PanelLayout: React.FC<PanelLayoutProps> = ({ sidebar, canvas, footer }) => {
  const [mobileView, setMobileView] = useState<'canvas' | 'library'>('canvas');
  const hasSidebar = !!sidebar;
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="flex h-full w-full overflow-hidden bg-brandNeutral relative">
      {/* Desktop Sidebar */}
      {sidebar && (
        <aside 
          className={`hidden md:flex w-[var(--sidebar-w)] flex-col border-r bg-brandDeep overflow-hidden z-10 shrink-0
            ${isDarkMode ? 'border-brandBlue/20 shadow-[4px_0_24px_-4px_rgba(0,50,160,0.4)]' : 'border-brandBlue/10'}
          `}
          style={{ contentVisibility: 'auto' }}
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-24">
            {sidebar}
          </div>
        </aside>
      )}
      
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-brandNeutral">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative"> 
          
          {/* Mobile Library View */}
          <div className={`w-full p-4 md:hidden animate-in fade-in slide-in-from-left-4 duration-500 pb-20 ${mobileView === 'library' && hasSidebar ? 'block' : 'hidden'}`}>
            {sidebar}
          </div>

          {/* Canvas View (Mobile + Desktop) */}
          <div className={`w-full max-w-[1400px] mx-auto flex flex-col gap-4 p-2 sm:p-4 md:p-6 animate-in fade-in zoom-in duration-500 ${mobileView === 'canvas' ? 'flex' : 'hidden md:flex'}`}>
            <div className="w-full">
              {canvas}
            </div>
            <div className="w-full">
              {footer}
            </div>
          </div>

          {/* Integrated Mobile Toggle (Pill) */}
          {hasSidebar && (
            <div className="md:hidden fixed bottom-[calc(var(--app-controls-bar-h)+1rem)] left-1/2 -translate-x-1/2 z-[150] pointer-events-none">
              <div className="flex items-center gap-1 p-1 bg-black/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl pointer-events-auto">
                <button 
                  onClick={() => setMobileView('canvas')} 
                  className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${mobileView === 'canvas' ? 'bg-brandRed text-white shadow-neon-red-soft' : 'text-white/40 hover:text-white/60'}`}
                >
                  Canvas
                </button>
                <button 
                  onClick={() => setMobileView('library')} 
                  className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${mobileView === 'library' ? 'bg-brandRed text-white shadow-neon-red-soft' : 'text-white/40 hover:text-white/60'}`}
                >
                  Library
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};