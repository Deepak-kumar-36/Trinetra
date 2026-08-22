import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Authenticating Mission Control..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-bg text-on-surface antialiased overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-multiply bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-tri-saffron via-surface to-tri-green"></div>
      
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm px-margin-mobile animate-fade-in">
        {/* App Icon / Logo animation */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(140,115,85,0.15)] mb-8 pulse-border bg-surface p-1 relative">
          <div className="absolute inset-1 rounded-2xl bg-gradient-to-br from-tri-saffron via-white to-tri-green opacity-20"></div>
          <div className="w-full h-full bg-primary flex items-center justify-center rounded-2xl">
            <span className="material-symbols-outlined text-[60px] text-white animate-pulse">visibility</span>
          </div>
        </div>
        
        {/* Tricolor Progress Bar */}
        <div className="w-64 h-1.5 bg-surface-variant rounded-full overflow-hidden mb-6 relative">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-tri-saffron via-white to-tri-green w-full animate-[load-progress_2s_ease-in-out_infinite_alternate] origin-left"></div>
        </div>
        
        {/* Status Text */}
        <div className="flex items-center space-x-2 text-on-surface-variant fade-in-up">
          <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
          <span className="font-label-sm uppercase tracking-widest">{message}</span>
        </div>
      </main>

      {/* Dynamic Keyframes for the infinite alternating loading bar */}
      <style>{`
        @keyframes load-progress {
          0% { transform: scaleX(0.1); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};
