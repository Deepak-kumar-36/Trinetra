import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ReportEmergency: React.FC = () => {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState('medium');
  const [description, setDescription] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [isMedical, setIsMedical] = useState(false);

  return (
    <div className="flex-grow w-full max-w-[1040px] mx-auto px-margin-mobile md:px-margin-desktop py-section-gap pb-32">
      <div className="mb-section-gap fade-in-up stagger-1">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface mb-2">Citizen Report</h2>
        <p className="font-body-md text-on-surface-variant">Please provide details about the situation. Information helps dispatch the appropriate response team quickly.</p>
      </div>

      <form className="space-y-gutter bg-surface-container-lowest rounded-xl p-6 md:p-10 shadow-[0_4px_32px_rgba(140,115,85,0.06)] border border-surface-variant">
        {/* Severity Selector */}
        <div className="space-y-3 fade-in-up stagger-2">
          <label className="font-label-sm text-charcoal-text block">Severity Level</label>
          <div className="grid grid-cols-3 gap-3" role="radiogroup">
            <label className="cursor-pointer relative">
              <input 
                className="peer sr-only" 
                name="severity" 
                type="radio" 
                value="low"
                checked={severity === 'low'}
                onChange={(e) => setSeverity(e.target.value)}
              />
              <div className="h-touch-target rounded-lg border border-outline-variant bg-surface flex flex-col items-center justify-center transition-all peer-checked:bg-secondary-container peer-checked:border-secondary peer-checked:shadow-[0_2px_12px_rgba(113,90,62,0.15)] hover:bg-surface-container-high peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2">
                <span aria-hidden="true" className="material-symbols-outlined mb-1 text-on-surface-variant peer-checked:text-on-secondary-container">info</span>
                <span className="font-label-sm text-on-surface-variant peer-checked:text-on-secondary-container">Low</span>
              </div>
            </label>
            <label className="cursor-pointer relative">
              <input 
                className="peer sr-only" 
                name="severity" 
                type="radio" 
                value="medium"
                checked={severity === 'medium'}
                onChange={(e) => setSeverity(e.target.value)}
              />
              <div className="h-touch-target rounded-lg border border-outline-variant bg-surface flex flex-col items-center justify-center transition-all peer-checked:bg-primary-fixed peer-checked:border-primary peer-checked:shadow-[0_2px_12px_rgba(74,93,78,0.15)] hover:bg-surface-container-high peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2">
                <span aria-hidden="true" className="material-symbols-outlined mb-1 text-on-surface-variant peer-checked:text-on-primary-fixed-variant">warning</span>
                <span className="font-label-sm text-on-surface-variant peer-checked:text-on-primary-fixed-variant">Medium</span>
              </div>
            </label>
            <label className="cursor-pointer relative">
              <input 
                className="peer sr-only" 
                name="severity" 
                type="radio" 
                value="high"
                checked={severity === 'high'}
                onChange={(e) => setSeverity(e.target.value)}
              />
              <div className="h-touch-target rounded-lg border border-outline-variant bg-surface flex flex-col items-center justify-center transition-all peer-checked:bg-error-container peer-checked:border-error peer-checked:shadow-[0_2px_12px_rgba(186,26,26,0.15)] hover:bg-surface-container-high peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2">
                <span aria-hidden="true" className="material-symbols-outlined mb-1 text-on-surface-variant peer-checked:text-on-error-container">emergency</span>
                <span className="font-label-sm text-on-surface-variant peer-checked:text-on-error-container">High</span>
              </div>
            </label>
          </div>
        </div>

        {/* Emergency Description */}
        <div className="space-y-2 pt-4 fade-in-up stagger-3">
          <label className="font-label-sm text-charcoal-text block" htmlFor="description">Emergency description</label>
          <textarea 
            id="description" 
            className="w-full rounded-lg bg-stone-bg border-transparent focus:border-primary focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:ring-offset-1 text-on-surface font-body-md p-4 transition-colors resize-none placeholder:text-on-surface-variant outline-none" 
            placeholder="What is happening right now?" 
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Number of People */}
        <div className="space-y-2 pt-4 fade-in-up stagger-4">
          <label className="font-label-sm text-charcoal-text block" htmlFor="people_count">Number of people involved</label>
          <div className="relative">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant pointer-events-none material-symbols-outlined">group</span>
            <input 
              id="people_count" 
              className="w-full rounded-lg bg-stone-bg border-transparent focus:border-primary focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:ring-offset-1 text-on-surface font-body-md p-4 pl-12 transition-colors placeholder:text-on-surface-variant h-14 outline-none" 
              min="1" 
              placeholder="Approximate count" 
              type="number"
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
            />
          </div>
        </div>

        {/* Medical Emergency Toggle */}
        <div className="pt-4 pb-2 fade-in-up stagger-5">
          <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-lg border border-surface-variant">
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                <span className="material-symbols-outlined">medical_services</span>
              </div>
              <div>
                <span className="font-label-sm text-on-surface block" id="medical-toggle-label">Medical emergency?</span>
                <span className="text-sm text-on-surface-variant">Are there injuries requiring EMS?</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                className="sr-only peer" 
                type="checkbox" 
                checked={isMedical}
                onChange={(e) => setIsMedical(e.target.checked)}
              />
              <div aria-hidden="true" className="w-14 h-7 bg-surface-variant peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-error"></div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8 fade-in-up stagger-6">
          <button 
            className="w-full h-14 bg-sage-primary text-on-primary rounded-xl font-label-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-[0_8px_24px_rgba(74,93,78,0.2)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
            type="button"
            onClick={() => navigate('/citizen')}
          >
            <span aria-hidden="true" className="material-symbols-outlined">send</span>
            Submit Report
          </button>
        </div>
        <p className="text-center text-sm text-on-surface-variant mt-4 font-body-md fade-in-up stagger-6">By submitting this form, you acknowledge that false reporting is a punishable offense.</p>
      </form>
    </div>
  );
};
