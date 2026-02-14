
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
 * - Strict Breakpoint: 768px (md)
 * - Mobile: Sidebar is available via a toggle, content stacks.
 * - Desktop: Fixed width sidebar, fluid content.
 */
export const PanelLayout: React.FC<PanelLayoutProps> = ({ sidebar, canvas, footer }) => {
  const [mobileView, setMobileView] = useState<'canvas' | 'library'>('canvas');
  const hasSidebar = !!sidebar;

  return (
    <div className="flex h-full w-full overflow-hidden bg-brandNeutral">
      {/* Desktop Sidebar */}
      {sidebar && (
        <aside 
          className="hidden md:flex w-[var(--sidebar-w)] flex-col border-r border-brandBlue/10 dark:border-white/5 bg-brandDeep overflow-hidden z-10 shrink-0"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-24">
            {sidebar}
          </div>
        </aside>
      )}
      
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-brandNeutral">
        {/* Scrollable Container for the main content area */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${hasSidebar ? 'pb-14 md:pb-0' : ''}`}> 
          
          {/* Mobile Library View */}
          <div className={`w-full p-6 md:hidden ${mobileView === 'library' && hasSidebar ? 'block' : 'hidden'}`}>
            {sidebar}
          </div>

          {/* Canvas View (Mobile + Desktop) */}
          <div className={`w-full max-w-[1400px] mx-auto flex-col gap-3 md:gap-6 p-2 md:p-6 ${mobileView === 'canvas' ? 'flex' : 'hidden md:flex'}`}>
            {canvas}
            {footer}
          </div>
        </div>
      </main>

      {/* Mobile View Toggler */}
      {hasSidebar && (
        <div 
          className="md:hidden fixed bottom-[var(--app-controls-bar-h)] left-0 right-0 h-14 bg-brandDeep border-t border-brandBlue/10 dark:border-white/5 flex items-stretch z-20"
        >
          <button onClick={() => setMobileView('canvas')} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === 'canvas' ? 'text-brandRed bg-brandRed/5' : 'text-brandCharcoalMuted dark:text-white/40'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m5 5l-1.5-1.5"></path><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
            <span className="text-[9px] font-black uppercase tracking-widest">Canvas</span>
          </button>
          <div className="w-px bg-brandCharcoal/10 dark:bg-white/10"></div>
          <button onClick={() => setMobileView('library')} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === 'library' ? 'text-brandRed bg-brandRed/5' : 'text-brandCharcoalMuted dark:text-white/40'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7"></path></svg>
            <span className="text-[9px] font-black uppercase tracking-widest">Library</span>
          </button>
        </div>
      )}
    </div>
  );
};
