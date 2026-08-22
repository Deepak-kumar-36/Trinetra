import React, { useState } from 'react';

export const CitizenProfile: React.FC = () => {
  const [bloodType, setBloodType] = useState('O+');
  const [hasAsthma, setHasAsthma] = useState(true);
  const [hasMobilityIssues, setHasMobilityIssues] = useState(false);

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
      
      // Reset success state after a few seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="flex-grow w-full max-w-[1040px] mx-auto px-margin-mobile md:px-margin-desktop py-section-gap pb-32">
      <div className="mb-section-gap fade-in-up stagger-1">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-charcoal-text mb-2">Medical Profile</h2>
        <p className="font-body-md text-on-surface-variant">Your medical information is securely encrypted and only shared with verified responders during an active emergency.</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Basic Info */}
        <section className="bg-surface-container-lowest rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-surface-variant fade-in-up stagger-2">
          <h3 className="font-headline-lg-mobile text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">person</span> Personal Data
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label-sm text-charcoal-text block">Full Name</label>
              <input type="text" defaultValue="Jane Doe" className="w-full h-14 px-4 rounded-xl bg-surface-container border-transparent focus:border-sage-primary focus:bg-surface focus:ring-1 focus:ring-sage-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-charcoal-text block">Date of Birth</label>
              <input type="date" defaultValue="1985-06-15" className="w-full h-14 px-4 rounded-xl bg-surface-container border-transparent focus:border-sage-primary focus:bg-surface focus:ring-1 focus:ring-sage-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-charcoal-text block">Blood Type</label>
              <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="w-full h-14 px-4 rounded-xl bg-surface-container border-transparent focus:border-sage-primary focus:bg-surface focus:ring-1 focus:ring-sage-primary outline-none appearance-none">
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="B+">B Positive (B+)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Vulnerabilities & Conditions */}
        <section className="bg-surface-container-lowest rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-surface-variant fade-in-up stagger-3">
          <h3 className="font-headline-lg-mobile text-error mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">medical_information</span> Critical Conditions
          </h3>
          
          <div className="space-y-4">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-surface-variant">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined">air</span>
                </div>
                <div>
                  <span className="font-label-sm text-on-surface block">Asthma / Respiratory</span>
                  <span className="text-sm text-on-surface-variant">Requires inhaler or clean air</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={hasAsthma} onChange={(e) => setHasAsthma(e.target.checked)} />
                <div className="w-14 h-7 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-error"></div>
              </label>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-surface-variant">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined">accessible</span>
                </div>
                <div>
                  <span className="font-label-sm text-on-surface block">Mobility Impaired</span>
                  <span className="text-sm text-on-surface-variant">Requires evacuation assistance</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={hasMobilityIssues} onChange={(e) => setHasMobilityIssues(e.target.checked)} />
                <div className="w-14 h-7 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-error"></div>
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
