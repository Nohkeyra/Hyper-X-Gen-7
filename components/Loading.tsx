import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "LOADING MODULE..." }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500 bg-brandNeutral dark:bg-brandNeutral">
    <div className="relative w-16 h-16 mb-6">
      <div className="absolute inset-0 border-2 border-brandRed/20 rounded-full" />
      <div className="absolute inset-0 border-t-2 border-brandRed rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
    </div>
    <span className="text-brandRed text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
      {message}
    </span>
  </div>
);
