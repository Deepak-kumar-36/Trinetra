import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const CitizenHome: React.FC = () => {
  const [sosActive, setSosActive] = useState(false);
  const [isSosTriggered, setIsSosTriggered] = useState(false);
  const [sosTimer, setSosTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [activeNotification, setActiveNotification] = useState<{title: string, message: string} | null>(null);
  const navigate = useNavigate();

  const handleSosStart = () => {
    if (isSosTriggered) return;
    setSosActive(true);
    const timer = setTimeout(() => {
      setIsSosTriggered(true);
      setSosActive(false);
    }, 3000);
    setSosTimer(timer);
  };

  const handleSosEnd = () => {
    if (isSosTriggered) return;
    setSosActive(false);
    if (sosTimer) {
      clearTimeout(sosTimer);
      setSosTimer(null);
    }
  };

  const cancelSos = () => {
    setIsSosTriggered(false);
  };

  const handleIncidentSelect = (type: string) => {
    setSelectedIncident(type);
  };

  const handleSubOptionSelect = (option: string, category: string) => {
    let authority = 'Emergency Services';
    if (category === 'Fire') authority = 'Local Fire Department';
    else if (category === 'Medical') authority = 'EMS & Nearest Hospital';
    else if (category === 'Security') authority = 'Police Department';
    else if (category === 'Flood') authority = 'Disaster Response Force';
    else if (category === 'Other') authority = 'General Emergency Services';

    setActiveNotification({
      title: 'Authorities Notified',
      message: `${authority} has been informed about: ${option}. Stay calm, help is on the way.`
    });
    setSelectedIncident(null);

    // Auto-dismiss notification after 5 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 5000);
  };

  const handleTileClick = (feature: string) => {
    setActiveNotification({
      title: 'Module Access',
      message: `Opening ${feature}...`
    });
    setTimeout(() => setActiveNotification(null), 3000);
  };

  const renderIncidentOptions = () => {
    if (!selectedIncident) return null;

    const optionsMap: Record<string, string[]> = {
      'Fire': ['Report Building Fire', 'Report Wildfire', 'Report Vehicle Fire', 'Request Evacuation'],
      'Medical': ['Request Ambulance', 'Report Severe Injury', 'Cardiac Emergency', 'Require First Aid'],
      'Flood': ['Report Rising Water', 'Request Evacuation', 'Report Blocked Road', 'Property Damage'],
      'Security': ['Report Intruder', 'Request Police', 'Report Suspicious Activity', 'Active Threat'],
      'Other': ['Traffic Accident', 'Animal Emergency', 'Infrastructure Damage', 'Miscellaneous / Unknown']
    };

    const options = optionsMap[selectedIncident] || [];

    return (
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button 
            key={option}
            onClick={() => handleSubOptionSelect(option, selectedIncident)}
            className="w-full text-left px-4 py-4 rounded-xl border border-outline-variant/50 hover:bg-surface-container-highest transition-colors font-body-md text-on-surface"
          >
            {option}
          </button>
        ))}
        <Button variant="ghost" onClick={() => setSelectedIncident(null)} className="mt-4">
          Cancel
        </Button>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col p-margin-mobile gap-section-gap overflow-y-auto max-w-[1440px] mx-auto w-full relative animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
      {/* Massive SOS Button */}
      <section className="w-full flex-grow-0 flex items-center justify-center min-h-[353px] md:min-h-[442px] relative mb-8 mt-4">
        {isSosTriggered && (
          <div className="absolute top-0 w-full text-center fade-in-up">
            <div className="inline-block bg-error/10 text-error px-4 py-2 rounded-full font-label-sm uppercase tracking-widest border border-error/30">
              Emergency Broadcast Active
            </div>
          </div>
        )}
        <button 
          className={`
            w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full flex flex-col items-center justify-center 
            border relative overflow-hidden group transition-all duration-300 shadow-xl
            ${isSosTriggered 
              ? 'bg-error text-white border-error shadow-[0_0_60px_rgba(200,50,50,0.6)] animate-[pulse_2s_ease-in-out_infinite]' 
              : 'bg-stone-bg text-sage-primary border-outline-variant/50 hover:shadow-2xl active:scale-95'
            }
            ${sosActive && !isSosTriggered ? 'scale-95 bg-secondary-container text-on-secondary-container' : ''}
          `}
          onMouseDown={handleSosStart}
          onTouchStart={handleSosStart}
          onMouseUp={handleSosEnd}
          onMouseLeave={handleSosEnd}
          onTouchEnd={handleSosEnd}
          onClick={isSosTriggered ? cancelSos : undefined}
        >
          {/* Progress Ring during hold */}
          {sosActive && !isSosTriggered && (
            <div 
              className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-[spin_3s_linear_forwards]" 
            ></div>
          )}
          
          <div className="absolute inset-0 bg-primary-container/5 group-active:bg-primary-container/10 transition-colors z-10 pointer-events-none rounded-full"></div>
          
          <span className="font-display-lg text-[72px] md:text-[120px] font-extrabold leading-none tracking-tighter z-20">
            SOS
          </span>
          <span className={`font-label-sm text-label-sm uppercase mt-4 z-20 ${isSosTriggered ? 'opacity-100 font-bold' : 'opacity-80'}`}>
            {isSosTriggered ? 'Tap to Cancel' : 'Hold for 3s'}
          </span>
        </button>
      </section>

      {/* Select Incident Type */}
      <section className="w-full flex flex-col items-center mb-4 mt-2">
        <h2 className="font-label-sm text-on-surface-variant uppercase tracking-widest mb-6">Select Incident Type</h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
          <button onClick={() => handleIncidentSelect('Fire')} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-earth-accent/50 hover:shadow-md transition-all active:scale-95 text-charcoal-text">
            <span className="material-symbols-outlined text-4xl text-sage-primary font-light">local_fire_department</span>
            <span className="font-label-sm uppercase tracking-wide">Fire</span>
          </button>
          <button onClick={() => handleIncidentSelect('Medical')} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-earth-accent/50 hover:shadow-md transition-all active:scale-95 text-charcoal-text">
            <span className="material-symbols-outlined text-4xl text-sage-primary font-light">monitor_heart</span>
            <span className="font-label-sm uppercase tracking-wide">Medical</span>
          </button>
          <button onClick={() => handleIncidentSelect('Flood')} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-earth-accent/50 hover:shadow-md transition-all active:scale-95 text-charcoal-text">
            <span className="material-symbols-outlined text-4xl text-sage-primary font-light">water_drop</span>
            <span className="font-label-sm uppercase tracking-wide">Flood</span>
          </button>
          <button onClick={() => handleIncidentSelect('Security')} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-earth-accent/50 hover:shadow-md transition-all active:scale-95 text-charcoal-text">
            <span className="material-symbols-outlined text-4xl text-sage-primary font-light">shield</span>
            <span className="font-label-sm uppercase tracking-wide">Security</span>
          </button>
          <button onClick={() => handleIncidentSelect('Other')} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-earth-accent/50 hover:shadow-md transition-all active:scale-95 text-charcoal-text col-span-2">
            <span className="material-symbols-outlined text-4xl text-sage-primary font-light">more_horiz</span>
            <span className="font-label-sm uppercase tracking-wide">Other</span>
          </button>
        </div>
      </section>

      {/* Predictive Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {/* Triage Tile */}
        <div onClick={() => handleTileClick('Triage Protocol')} className="bg-stone-bg border border-outline-variant/30 rounded-xl p-8 flex flex-col justify-between min-h-[200px] hover:border-earth-accent/50 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-sage-primary text-4xl group-hover:scale-110 transition-transform font-light">file_download</span>
          </div>
          <div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal-text">Triage Protocol</h3>
            <p className="font-label-sm text-on-surface-variant uppercase mt-2">Initiate Assessment</p>
          </div>
        </div>

        {/* Medical ID Tile */}
        <div onClick={() => handleTileClick('Medical Profile')} className="bg-stone-bg border border-outline-variant/30 rounded-xl p-8 flex flex-col justify-between min-h-[200px] hover:border-earth-accent/50 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-sage-primary text-4xl group-hover:scale-110 transition-transform font-light">medical_services</span>
          </div>
          <div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal-text">Medical Profile</h3>
            <p className="font-label-sm text-on-surface-variant uppercase mt-2">Critical Data</p>
          </div>
        </div>

        {/* Show Map Tile */}
        <div 
          className="bg-stone-bg border border-outline-variant/30 rounded-xl p-8 flex flex-col justify-between min-h-[200px] hover:border-earth-accent/50 hover:shadow-md transition-all cursor-pointer group"
          onClick={() => navigate('/citizen/nearby')}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-sage-primary text-4xl group-hover:scale-110 transition-transform font-light">map</span>
          </div>
          <div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal-text">Show Map</h3>
            <p className="font-label-sm text-on-surface-variant uppercase mt-2">Shelters & Supplies</p>
          </div>
        </div>
      </section>

      <Modal 
        isOpen={selectedIncident !== null} 
        onClose={() => setSelectedIncident(null)} 
        title={`Report ${selectedIncident} Incident`}
      >
        {renderIncidentOptions()}
      </Modal>

      {/* Toast Notification for Authority Dispatch */}
      {activeNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-[slide-down_0.3s_ease-out_forwards] w-[90%] max-w-md">
          <div className="bg-surface-container-highest border-l-4 border-primary shadow-[0_12px_40px_rgba(0,0,0,0.2)] rounded-xl p-5 flex gap-4 items-start">
            <span className="material-symbols-outlined text-primary text-3xl shrink-0">verified_user</span>
            <div className="flex-1">
              <h4 className="font-label-sm uppercase tracking-wider text-on-surface font-bold">{activeNotification.title}</h4>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{activeNotification.message}</p>
            </div>
            <button onClick={() => setActiveNotification(null)} className="ml-auto text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
