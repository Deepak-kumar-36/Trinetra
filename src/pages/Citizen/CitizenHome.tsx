import React, { useState } from 'react';

export const CitizenHome: React.FC = () => {
  const [sosActive, setSosActive] = useState(false);

  const handleSosStart = () => {
    setSosActive(true);
    // Real implementation would have a timer here
  };

  const handleSosEnd = () => {
    setSosActive(false);
  };

  return (
    <div className="flex-1 flex flex-col p-margin-mobile gap-section-gap overflow-y-auto max-w-[1440px] mx-auto w-full relative animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
      {/* Massive SOS Button */}
      <section className="w-full flex-grow-0 flex items-center justify-center min-h-[353px] md:min-h-[442px] relative mb-8">
        <button 
          className={`bg-stone-bg text-sage-primary w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full flex flex-col items-center justify-center border border-outline-variant/50 pulse-border active:scale-95 transition-all shadow-[0_8px_32px_rgba(140,115,85,0.15)] hover:shadow-[0_12px_48px_rgba(140,115,85,0.25)] relative overflow-hidden group ${sosActive ? 'bg-secondary-container scale-95' : ''}`}
          onMouseDown={handleSosStart}
          onTouchStart={handleSosStart}
          onMouseUp={handleSosEnd}
          onMouseLeave={handleSosEnd}
          onTouchEnd={handleSosEnd}
        >
          <div className="absolute inset-0 bg-primary-container/5 group-active:bg-primary-container/10 transition-colors z-10 pointer-events-none rounded-full"></div>
          <span className="font-display-lg text-[72px] md:text-[120px] font-extrabold leading-none tracking-tighter z-20 text-earth-accent">SOS</span>
          <span className="font-label-sm text-label-sm uppercase mt-4 z-20 text-on-surface-variant">Hold for 3s</span>
        </button>
      </section>

      {/* AI Edge Triage Status */}
      <div className="bg-surface-container-low border border-outline-variant/30 p-6 rounded-xl flex items-center gap-6 mb-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-3xl font-light">graphic_eq</span>
        </div>
        <div className="flex-1">
          <h3 className="font-label-sm text-label-sm text-earth-accent uppercase mb-1">AI Edge Triage</h3>
          <p className="text-on-surface-variant font-body-md">Monitoring Ambient Sounds...</p>
        </div>
        <span className="material-symbols-outlined text-soft-olive text-3xl font-light">check_circle</span>
      </div>

      {/* Predictive Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {/* Survival Mesh Status */}
        <div className="bg-stone-bg border border-outline-variant/30 rounded-xl p-8 flex flex-col justify-between min-h-[200px] hover:border-earth-accent/50 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-sage-primary text-4xl group-hover:scale-110 transition-transform font-light">hub</span>
            <div className="bg-primary-fixed text-on-primary-fixed px-3 py-1.5 rounded-full font-label-sm text-xs uppercase flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sage-primary animate-pulse"></div>
              Active
            </div>
          </div>
          <div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal-text">Survival Mesh</h3>
            <p className="font-label-sm text-earth-accent uppercase mt-2">12 Nearby Nodes</p>
          </div>
        </div>

        {/* Triage Tile */}
        <div className="bg-stone-bg border border-outline-variant/30 rounded-xl p-8 flex flex-col justify-between min-h-[200px] hover:border-earth-accent/50 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-sage-primary text-4xl group-hover:scale-110 transition-transform font-light">file_download</span>
          </div>
          <div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal-text">Triage Protocol</h3>
            <p className="font-label-sm text-on-surface-variant uppercase mt-2">Initiate Assessment</p>
          </div>
        </div>

        {/* Medical ID Tile */}
        <div className="bg-stone-bg border border-outline-variant/30 rounded-xl p-8 flex flex-col justify-between min-h-[200px] hover:border-earth-accent/50 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-sage-primary text-4xl group-hover:scale-110 transition-transform font-light">medical_services</span>
          </div>
          <div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal-text">Medical Profile</h3>
            <p className="font-label-sm text-on-surface-variant uppercase mt-2">Critical Data</p>
          </div>
        </div>
      </section>
    </div>
  );
};
