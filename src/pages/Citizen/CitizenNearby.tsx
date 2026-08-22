import React from 'react';

export const CitizenNearby: React.FC = () => {
  return (
    <div className="flex-grow w-full max-w-[1040px] mx-auto px-margin-mobile md:px-margin-desktop py-gutter flex flex-col gap-section-gap pb-32">
      {/* Search Section */}
      <section className="flex flex-col gap-4 fade-in-up stagger-1">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-charcoal-text">Offline Maps Management</h2>
        <p className="font-body-md text-on-surface-variant">Download maps for critical regions to ensure navigation availability without connectivity.</p>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input className="w-full h-14 pl-12 pr-4 rounded-[1.5rem] bg-surface-container border border-surface-variant focus:bg-surface focus:border-sage-primary focus:ring-1 focus:ring-sage-primary font-body-md text-charcoal-text placeholder-on-surface-variant transition-colors outline-none" placeholder="Search for cities, regions, or coordinates..." type="text"/>
        </div>
      </section>
      
      {/* Downloaded Regions */}
      <section className="flex flex-col gap-6 fade-in-up stagger-2">
        <h3 className="font-body-lg text-charcoal-text font-bold">Downloaded Regions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Card 1 */}
          <div className="bg-surface rounded-[1.5rem] p-4 flex gap-4 items-center border border-surface-variant shadow-[0_8px_32px_rgba(140,115,85,0.08)] transition-transform hover:-translate-y-1 duration-300">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high relative">
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl opacity-50">map</span>
              </div>
            </div>
            <div className="flex-grow flex flex-col gap-1">
              <h4 className="font-body-md font-semibold text-charcoal-text">Downtown District</h4>
              <p className="font-label-sm text-on-surface-variant">120 MB • Updated 2 days ago</p>
              <div className="flex gap-2 mt-2">
                <button className="bg-sage-primary text-on-primary font-label-sm px-4 py-2 rounded-full shadow-sm active:scale-95 transition-transform flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">update</span> Update
                </button>
                <button className="border border-earth-accent text-earth-accent font-label-sm px-4 py-2 rounded-full active:scale-95 transition-transform flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-surface rounded-[1.5rem] p-4 flex gap-4 items-center border border-surface-variant shadow-[0_8px_32px_rgba(140,115,85,0.08)] transition-transform hover:-translate-y-1 duration-300">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high relative">
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl opacity-50">map</span>
              </div>
            </div>
            <div className="flex-grow flex flex-col gap-1">
              <h4 className="font-body-md font-semibold text-charcoal-text">Riverside Sector</h4>
              <p className="font-label-sm text-on-surface-variant">85 MB • Updated 1 week ago</p>
              <div className="flex gap-2 mt-2">
                <button className="bg-surface-variant text-on-surface-variant font-label-sm px-4 py-2 rounded-full active:scale-95 transition-transform flex items-center gap-1 opacity-50 cursor-not-allowed">
                  <span className="material-symbols-outlined text-[18px]">check</span> Up to date
                </button>
                <button className="border border-earth-accent text-earth-accent font-label-sm px-4 py-2 rounded-full active:scale-95 transition-transform flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Maps */}
      <section className="flex flex-col gap-6 fade-in-up stagger-3">
        <div className="mb-2">
          <h3 className="font-body-lg text-charcoal-text font-bold">Download New Map</h3>
          <p className="font-body-md text-on-surface-variant">Suggested regions based on your current location.</p>
        </div>
        
        <div className="bg-surface rounded-[1.5rem] p-4 flex gap-4 items-center border border-surface-variant shadow-sm">
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high relative">
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl opacity-50">terrain</span>
            </div>
          </div>
          <div className="flex-grow flex flex-col gap-1">
            <h4 className="font-body-md font-semibold text-charcoal-text">Highland County</h4>
            <p className="font-label-sm text-on-surface-variant">210 MB</p>
            <div className="flex gap-2 mt-2">
              <button className="bg-surface-container-high text-primary font-label-sm px-4 py-2 rounded-full active:scale-95 transition-transform flex items-center gap-1 hover:bg-primary hover:text-white">
                <span className="material-symbols-outlined text-[18px]">download</span> Download
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
