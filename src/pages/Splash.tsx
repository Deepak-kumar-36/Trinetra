import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initialization and then redirect to role selection
    const timer = setTimeout(() => {
      navigate('/role-selection');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-full bg-stone-bg text-on-surface antialiased overflow-hidden flex flex-col items-center justify-center relative min-h-screen">
      {/* Background gradient overlay to simulate the Three.js effect since it's a bit heavy for MVP */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-multiply bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-tri-saffron via-surface to-tri-green"></div>

      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm px-margin-mobile animate-fade-in">
        {/* App Icon */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(140,115,85,0.15)] mb-8 pulse-border bg-surface p-1 relative">
          <div className="absolute inset-1 rounded-2xl bg-gradient-to-br from-tri-saffron via-white to-tri-green opacity-20"></div>
          <div className="w-full h-full bg-primary flex items-center justify-center rounded-2xl">
            <span className="material-symbols-outlined text-[80px] text-white">visibility</span>
          </div>
        </div>
        
        {/* Logo/Brand Text */}
        <h1 className="font-headline-lg-mobile md:font-headline-lg tracking-tight mb-2 flex items-center justify-center">
          <span className="text-[#FF9933]">t</span>
          <span className="text-[#FFFFFF] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">r</span>
          <span className="text-[#138808]">i</span>
          <span className="font-bold text-primary ml-0.5 uppercase">NETRA</span>
        </h1>
        <p className="font-body-md text-on-surface-variant text-center opacity-80 mb-16">
          Commanded Serenity
        </p>
        
        {/* Loading Indicator Area */}
        <div className="w-full mt-12 flex flex-col items-center fade-in-up stagger-3">
          {/* Custom Tricolor Progress Bar */}
          <div className="w-64 h-1.5 bg-surface-variant rounded-full overflow-hidden mb-6 relative">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-tri-saffron via-white to-tri-green w-full animate-[load-progress_3s_cubic-bezier(0.4,0,0.2,1)_forwards] origin-left"></div>
          </div>
          
          {/* Status Text */}
          <div className="flex items-center space-x-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
            <span className="font-label-sm uppercase tracking-widest">Initializing Mission Control...</span>
          </div>
        </div>
      </main>
      
      {/* Dynamic Keyframes for this component */}
      <style>{`
        @keyframes load-progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.6); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};
