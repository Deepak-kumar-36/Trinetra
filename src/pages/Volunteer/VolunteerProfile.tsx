import React, { useState } from 'react';

export const VolunteerProfile: React.FC = () => {
  const [hasBoat, setHasBoat] = useState(true);
  const [hasMedical, setHasMedical] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate network save for the demo
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="flex-grow w-full max-w-[1040px] mx-auto px-margin-mobile md:px-margin-desktop py-section-gap pb-32">
      <div className="mb-section-gap fade-in-up stagger-1">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-charcoal-text mb-2">Responder Profile</h2>
        <p className="font-body-md text-on-surface-variant">Manage your capabilities and availability status. This information is used by the Dispatch Engine.</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Availability Toggle */}
        <section className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-surface-variant fade-in-up stagger-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAvailable ? 'bg-sage-primary/20 text-sage-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-2xl">{isAvailable ? 'check_circle' : 'do_not_disturb_on'}</span>
              </div>
              <div>
                <h3 className="font-body-lg text-charcoal-text font-bold">Duty Status</h3>
                <p className="text-sm text-on-surface-variant">{isAvailable ? 'Active and ready for dispatch' : 'Currently off duty'}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
              <div className="w-14 h-7 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-sage-primary"></div>
            </label>
          </div>
        </section>

        {/* Capabilities */}
        <section className="bg-surface-container-lowest rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-surface-variant fade-in-up stagger-3">
          <h3 className="font-headline-lg-mobile text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">verified</span> Capabilities & Assets
          </h3>
          
          <div className="space-y-4">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-surface-variant">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined">directions_boat</span>
                </div>
                <div>
                  <span className="font-label-sm text-on-surface block">Watercraft (Boat/Raft)</span>
                  <span className="text-sm text-on-surface-variant">Can perform water rescues</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={hasBoat} onChange={(e) => setHasBoat(e.target.checked)} />
                <div className="w-14 h-7 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-surface-variant">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined">medical_services</span>
                </div>
                <div>
                  <span className="font-label-sm text-on-surface block">First-Aid Certified</span>
                  <span className="text-sm text-on-surface-variant">Can treat injuries on-scene</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={hasMedical} onChange={(e) => setHasMedical(e.target.checked)} />
                <div className="w-14 h-7 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="fade-in-up stagger-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full h-14 text-white rounded-xl font-label-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
              saveSuccess 
                ? 'bg-primary' 
                : isSaving
                ? 'bg-sage-primary/70 cursor-not-allowed'
                : 'bg-sage-primary hover:bg-primary active:scale-[0.98]'
            }`}
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Saved Successfully
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
