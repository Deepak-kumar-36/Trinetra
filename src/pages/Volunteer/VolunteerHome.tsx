import React from 'react';
import { useNavigate } from 'react-router-dom';

export const VolunteerHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="font-body-md antialiased min-h-screen flex flex-col mesh-bg relative pb-32">
      {/* Background Mesh styling */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(at_10%_20%,_hsla(28,100%,74%,0.1)_0px,_transparent_50%),radial-gradient(at_80%_90%,_hsla(116,36%,66%,0.1)_0px,_transparent_50%),radial-gradient(at_90%_10%,_hsla(140,24%,38%,0.05)_0px,_transparent_50%)] pointer-events-none"></div>

      <main className="flex-grow flex justify-center w-full z-10">
        <div className="w-full max-w-[1040px] px-margin-mobile md:px-0 py-section-gap flex flex-col gap-section-gap">
          {/* Page Title Area */}
          <div className="flex flex-col gap-4 fade-in-up stagger-1">
            <h2 className="font-display-lg text-display-lg text-primary drop-shadow-sm">Incoming Mission</h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            
            {/* Main Incident & Calculation Panel */}
            <div className="md:col-span-7 flex flex-col gap-gutter">
              {/* Incident Context Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-variant transition-all duration-300 relative overflow-hidden fade-in-up stagger-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
                <div className="relative z-10">
                  <h3 className="font-headline-lg text-headline-lg text-primary mb-4">Situation Context</h3>
                  <p className="font-body-lg text-body-lg text-charcoal-text italic border-l-4 border-earth-accent pl-4 mb-6">
                    "Three people are trapped on a roof, water is rising, and a child has asthma."
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-label-sm text-label-sm border border-primary/20">Flood rescue</span>
                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-label-sm text-label-sm border border-primary/20">3 people</span>
                    <span className="bg-earth-accent/10 text-earth-accent px-4 py-2 rounded-full font-label-sm text-label-sm border border-earth-accent/20">Child present</span>
                    <span className="bg-error/10 text-error px-4 py-2 rounded-full font-label-sm text-label-sm border border-error/20">Medical concern</span>
                  </div>
                </div>
              </div>

              {/* Urgency Score Calculation */}
              <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-variant transition-all duration-300 relative overflow-hidden fade-in-up stagger-3">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6 border-b border-surface-variant pb-4">
                    <h3 className="font-headline-lg text-headline-lg text-primary">Urgency Score</h3>
                    <div className="flex items-end gap-1 text-error">
                      <span className="font-display-lg text-display-lg leading-none">92</span>
                      <span className="font-body-md text-body-md text-on-surface-variant pb-1">/100</span>
                    </div>
                  </div>
                  <div className="space-y-4 font-body-md text-body-md">
                    <div className="flex justify-between items-center bg-surface p-4 rounded-lg shadow-sm border border-surface-variant/50">
                      <span className="flex items-center gap-2"><span className="material-symbols-outlined text-earth-accent">water_drop</span> Rising water</span>
                      <span className="font-bold text-error">+25</span>
                    </div>
                    <div className="flex justify-between items-center bg-surface p-4 rounded-lg shadow-sm border border-surface-variant/50">
                      <span className="flex items-center gap-2"><span className="material-symbols-outlined text-earth-accent">house</span> People trapped</span>
                      <span className="font-bold text-earth-accent">+25</span>
                    </div>
                    <div className="flex justify-between items-center bg-surface p-4 rounded-lg shadow-sm border border-surface-variant/50">
                      <span className="flex items-center gap-2"><span className="material-symbols-outlined text-earth-accent">child_care</span> Child involved</span>
                      <span className="font-bold text-earth-accent">+20</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Responder Matching Panel (Volunteer View) */}
            <div className="md:col-span-5 flex flex-col gap-gutter">
              <div className="bg-surface-container/80 backdrop-blur-sm rounded-2xl p-8 shadow-inner border border-outline-variant/30 h-full relative overflow-hidden fade-in-up stagger-4">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-8">
                    <span className="material-symbols-outlined text-primary text-3xl">hub</span>
                    <h3 className="font-headline-lg text-headline-lg text-primary">Your Match</h3>
                  </div>

                  <div className="bg-surface-container-lowest shadow-[0_20px_50px_-12px_rgba(74,93,78,0.25)] border border-sage-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-sage-primary to-primary"></div>
                    <div className="relative z-10">
                      <div className="absolute top-4 right-4 bg-sage-primary/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full font-label-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span> Perfect Match
                      </div>

                      <div className="flex items-start gap-5 mb-5 mt-2">
                        <div className="pt-1">
                          <h4 className="font-bold text-xl text-primary">Action Required</h4>
                          <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1 font-semibold">
                            <span className="material-symbols-outlined text-[16px] text-earth-accent">schedule</span> ETA to scene: 12 min
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-5">
                        <span className="bg-surface text-primary px-3 py-1.5 rounded-md text-sm border border-surface-variant flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[14px] text-sage-primary">directions_boat</span> You have a boat
                        </span>
                        <span className="bg-surface text-primary px-3 py-1.5 rounded-md text-sm border border-surface-variant flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[14px] text-error">medical_services</span> You are first-aid trained
                        </span>
                      </div>

                      <button 
                        onClick={() => navigate('/volunteer/map')}
                        className="mt-8 w-full h-[60px] bg-sage-primary text-white rounded-xl font-bold hover:bg-primary transition-all active:scale-95 shadow-[0_4px_0_0_#1d2f22,0_8px_20px_-4px_rgba(29,47,34,0.4)] flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">navigation</span> Accept & Navigate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
