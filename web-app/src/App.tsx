import React from 'react';

function App() {
  return (
    <>
      {/* TopAppBar */}
      <header className="bg-surface/50 backdrop-blur-xl border-b border-outline-variant/20 flex justify-between items-center w-full px-margin-mobile h-touch-target fixed top-0 z-40 docked full-width top-0 flat no shadows">
        <button className="text-primary hover:bg-surface-container-low transition-colors opacity-70 w-[88px] h-[88px] flex items-center justify-center">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "32px" }}>menu</span>
        </button>
        <h1 className="font-display-lg text-headline-lg flex items-center tracking-tight">
          <span className="text-[#FF9933]">t</span>
          <span className="text-[#FFFFFF] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">r</span>
          <span className="text-[#138808]">i</span>
          <span className="font-bold text-primary uppercase ml-1">NETRA</span>
        </h1>
        <button className="text-primary hover:bg-surface-container-low transition-colors opacity-70 w-[88px] h-[88px] flex items-center justify-center">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "32px" }}>close</span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="w-full max-w-[600px] mt-touch-target mb-[120px] px-margin-mobile py-gutter flex flex-col gap-6 h-full z-10">
        {/* Threat Level / Disaster Rating Bar */}
        <div className="w-full bg-surface/80 backdrop-blur-md rounded-xl p-6 flex flex-col gap-4 shadow-sm border border-outline-variant/30 mt-2 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">Disaster Threat Level</span>
              <span className="font-display-lg text-error leading-none flex items-center gap-2">High <span className="w-3 h-3 rounded-full bg-error animate-pulse-slow"></span></span>
            </div>
            <div className="text-right">
              <span className="font-headline-lg text-on-surface leading-none block">85<span className="text-body-md text-on-surface-variant">/100</span></span>
            </div>
          </div>
          {/* Rating Bar */}
          <div className="w-full h-3 bg-surface-variant/50 rounded-full overflow-hidden flex">
            <div className="h-full bg-error w-[85%] rounded-full opacity-80 transition-all duration-1000 ease-out"></div>
          </div>
          {/* Urgency Engine Factors */}
          <div className="flex gap-2 flex-wrap mt-2">
            <span className="px-2 py-1 bg-error/10 text-error text-[12px] font-bold rounded-md border border-error/20 backdrop-blur-sm transition-all hover:bg-error/20">Threat to Life: 90</span>
            <span className="px-2 py-1 bg-sage-primary/10 text-sage-primary text-[12px] font-bold rounded-md border border-sage-primary/20 backdrop-blur-sm transition-all hover:bg-sage-primary/20">Medical: 80</span>
            <span className="px-2 py-1 bg-on-surface-variant/10 text-on-surface text-[12px] font-bold rounded-md border border-outline-variant/30 backdrop-blur-sm transition-all hover:bg-on-surface-variant/20">Property: 40</span>
            <span className="px-2 py-1 bg-tertiary/10 text-tertiary text-[12px] font-bold rounded-md border border-tertiary/20 backdrop-blur-sm transition-all hover:bg-tertiary/20">Security: 65</span>
          </div>
        </div>

        {/* Voice Stress Indicator */}
        <div className="w-full bg-surface/80 backdrop-blur-md rounded-xl p-6 flex flex-col items-center justify-center min-h-[88px] shadow-sm border border-outline-variant/30 transition-all duration-300 hover:shadow-md">
          <span className="font-label-sm text-label-sm text-on-surface-variant mb-3 uppercase tracking-wider">Voice Stress Analysis</span>
          <div className="w-full h-2 bg-surface-variant/50 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-earth-accent opacity-70 w-3/4 rounded-full transition-all duration-1000 ease-out"></div>
          </div>
          <span className="font-label-sm text-label-sm text-earth-accent mt-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-earth-accent animate-pulse-slow"></span> Elevated Arousal Detected</span>
        </div>

        {/* Binary Triage Questioning */}
        <section className="flex flex-col gap-5 mt-2 flex-1">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-center text-primary mb-1 drop-shadow-sm">Are you in immediate danger?</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="h-[140px] w-full bg-surface/50 backdrop-blur-lg border border-outline-variant/40 hover:bg-surface/70 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 rounded-xl shadow-sm hover:shadow-md">
              <span className="material-symbols-outlined text-sage-primary" style={{ fontVariationSettings: "'FILL' 1", fontSize: "48px" }}>check_circle</span>
              <span className="font-display-lg text-display-lg text-sage-primary">YES</span>
            </button>
            <button className="h-[140px] w-full bg-surface/50 backdrop-blur-lg border border-outline-variant/40 hover:bg-surface/70 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 rounded-xl shadow-sm hover:shadow-md">
              <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0", fontSize: "48px" }}>cancel</span>
              <span className="font-display-lg text-display-lg text-outline">NO</span>
            </button>
          </div>
        </section>

        {/* Incident Categories */}
        <section className="mt-4 flex-1">
          <h2 className="font-label-sm text-label-sm text-on-surface-variant text-center mb-5 uppercase tracking-wider">Select Incident Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="h-[140px] w-full bg-surface/50 backdrop-blur-lg border border-outline-variant/40 hover:bg-surface/70 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 rounded-xl shadow-sm hover:shadow-md">
              <span className="material-symbols-outlined text-sage-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200", fontSize: "48px" }}>mode_heat</span>
              <span className="font-label-sm text-sage-primary uppercase tracking-wider">Fire</span>
            </button>
            <button className="h-[140px] w-full bg-surface/50 backdrop-blur-lg border border-outline-variant/40 hover:bg-surface/70 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 rounded-xl shadow-sm hover:shadow-md">
              <span className="material-symbols-outlined text-sage-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200", fontSize: "48px" }}>ecg_heart</span>
              <span className="font-label-sm text-sage-primary uppercase tracking-wider">Medical</span>
            </button>
            <button className="h-[140px] w-full bg-surface/50 backdrop-blur-lg border border-outline-variant/40 hover:bg-surface/70 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 rounded-xl shadow-sm hover:shadow-md">
              <span className="material-symbols-outlined text-sage-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200", fontSize: "48px" }}>water_drop</span>
              <span className="font-label-sm text-sage-primary uppercase tracking-wider">Flood</span>
            </button>
            <button className="h-[140px] w-full bg-surface/50 backdrop-blur-lg border border-outline-variant/40 hover:bg-surface/70 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 rounded-xl shadow-sm hover:shadow-md">
              <span className="material-symbols-outlined text-sage-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200", fontSize: "48px" }}>shield</span>
              <span className="font-label-sm text-sage-primary uppercase tracking-wider">Security</span>
            </button>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="bg-surface/80 backdrop-blur-2xl border-t border-outline-variant/30 fixed bottom-0 w-full z-50 rounded-t-xl left-0 flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-8px_32px_rgba(140,115,85,0.06)] md:hidden">
        <button className="flex flex-col items-center justify-center text-outline p-2 hover:text-primary transition-all duration-200 active:scale-95 w-20">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0", fontSize: "24px" }}>home</span>
          <span className="font-label-sm text-label-sm">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center text-outline p-2 hover:text-primary transition-all duration-200 active:scale-95 w-20">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0", fontSize: "24px" }}>hub</span>
          <span className="font-label-sm text-label-sm">Mesh</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-secondary-container/80 backdrop-blur-md text-on-secondary-container rounded-full px-6 py-2 duration-200 active:scale-95 border border-secondary/20">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1", fontSize: "24px" }}>medical_services</span>
          <span className="font-label-sm text-label-sm">Triage</span>
        </button>
        <button className="flex flex-col items-center justify-center text-outline p-2 hover:text-primary transition-all duration-200 active:scale-95 w-20">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0", fontSize: "24px" }}>map</span>
          <span className="font-label-sm text-label-sm">Maps</span>
        </button>
      </nav>
    </>
  );
}

export default App;
