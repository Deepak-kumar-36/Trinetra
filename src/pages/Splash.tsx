import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    const timer = setTimeout(() => {
      if (user) {
        const storedRole = localStorage.getItem('trinetra_role') || 'citizen';
        navigate(`/${storedRole}`);
      } else {
        navigate('/role-selection');
      }
    }, 2000); // reduced to 2s for better UX
    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="h-full bg-stone-bg text-on-surface antialiased overflow-hidden flex flex-col items-center justify-center relative min-h-screen">
      {/* Background gradient overlay to simulate the Three.js effect since it's a bit heavy for MVP */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-multiply bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-tri-saffron via-surface to-tri-green"></div>

      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm px-margin-mobile animate-fade-in">
        {/* App Icon */}
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(140,115,85,0.15)] mb-8 pulse-border bg-surface p-1 relative flex items-center justify-center">
          <img src="/logo.png" alt="trinetra Logo" className="w-full h-full object-contain rounded-2xl relative z-10" />
        </div>
        
        {/* Logo/Brand Text */}
        <h1 className="font-headline-lg-mobile md:font-headline-lg tracking-tight mb-2 flex items-center justify-center">
          <span className="text-[#FF9933]">t</span>
          <span className="text-[#FFFFFF] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">r</span>
          <span className="text-[#138808]">i</span>
          <span className="font-bold text-primary ml-0.5 lowercase">netra</span>
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
