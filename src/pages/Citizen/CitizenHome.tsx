import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { TriageProtocolModal } from './TriageProtocolModal';
import { supabase } from '../../lib/supabase';

import { useAuth } from '../../contexts/AuthContext';
import { generateUUID } from '../../lib/utils';
import { calculateUrgencyScore } from '../../lib/dispatchEngine';
import { useVoiceDistress } from '../../hooks/useVoiceDistress';

export const CitizenHome: React.FC = () => {
  const [silentSosEnabled, setSilentSosEnabled] = useState(true);
  const { isListening, countdown, cancelCountdown } = useVoiceDistress(silentSosEnabled);
  const { user } = useAuth();
  const [sosActive, setSosActive] = useState(false);
  const [isSosTriggered, setIsSosTriggered] = useState(false);
  
  // Realtime subscription for Coordinator feedback
  const [dispatchAlert, setDispatchAlert] = useState<{message: string} | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const userId = generateUUID(user.uid);
    
    // Subscribe to notifications where user_id = my id
    const channel = supabase
      .channel('citizen-notifications')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}` 
        },
        (payload) => {
          setDispatchAlert({
            message: payload.new.message
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  const [sosTimer, setSosTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [activeNotification, setActiveNotification] = useState<{title: string, message: string} | null>(null);
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setActiveNotification({ title: 'Uploading Photo', message: 'Processing and transmitting image...' });

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6); // Compress to 60% quality jpeg

        submitPhotoReport(compressedBase64);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const submitPhotoReport = async (base64string: string) => {
    const uploadPhoto = async (lat: number, lon: number) => {
      if (user) {
        const reporter_id = generateUUID(user.uid);
        await supabase.from('users').upsert([{ id: reporter_id, role: 'citizen', full_name: user.displayName || user.email || 'Citizen' }], { onConflict: 'id' });

        const { score, reasoning } = calculateUrgencyScore({
          peopleCount: 1,
          isMedical: false,
          severity: 'High',
          vulnerabilities: [],
          hazards: [],
          requiredCapabilities: []
        });

        await supabase.from('incidents').insert([{
          reporter_id,
          status: 'reported',
          category: 'photo_report',
          raw_transcript: JSON.stringify({ type: 'photo_report', url: base64string }),
          people_affected: 1,
          hazards: [],
          urgency_score: score,
          urgency_band: score >= 80 ? 'critical' : score >= 50 ? 'high' : 'medium',
          urgency_breakdown: reasoning,
          location: `POINT(${lon} ${lat})`
        }]);
      }

      const newIncident = {
        id: Date.now(),
        pos: [lat, lon],
        title: 'Photo Report',
        severity: 'High',
        urgency_band: 70,
        raw_transcript: JSON.stringify({ type: 'photo_report', url: base64string })
      };
      const existing = JSON.parse(localStorage.getItem('trinetra_live_incidents') || '[]');
      localStorage.setItem('trinetra_live_incidents', JSON.stringify([...existing, newIncident]));
      window.dispatchEvent(new Event('storage'));
      
      setActiveNotification({ title: 'Photo Uploaded', message: 'Authorities have received your photo report. Help is on the way.' });
      setTimeout(() => setActiveNotification(null), 5000);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => uploadPhoto(position.coords.latitude, position.coords.longitude),
        (err) => {
          console.warn('GPS failed', err);
          uploadPhoto(28.6139, 77.2090); // Fallback static location
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      uploadPhoto(28.6139, 77.2090);
    }
  };

  const handleSosStart = () => {
    if (isSosTriggered) return;
    setSosActive(true);
    const timer = setTimeout(() => {
      setIsSosTriggered(true);
      setSosActive(false);
      navigate('/citizen/report');
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

  const handleSubOptionSelect = async (option: string, category: string) => {
    let authority = 'Emergency Services';
    if (category === 'Fire') authority = 'Local Fire Department';
    else if (category === 'Medical') authority = 'EMS & Nearest Hospital';
    else if (category === 'Security') authority = 'Police Department';
    else if (category === 'Flood') authority = 'Disaster Response Force';
    else if (category === 'Other') authority = 'General Emergency Services';

    // Broadcast GPS location to Coordinator Map via localStorage
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          if (user) {
            const reporter_id = generateUUID(user.uid);
            
            // Ensure user exists
            await supabase.from('users').upsert([{
              id: reporter_id,
              role: 'citizen',
              full_name: user.displayName || user.email || 'Citizen'
            }], { onConflict: 'id' });

            // Determine basic features for engine based on option
            const isMedical = category === 'Medical' || option.toLowerCase().includes('injury');
            const hazards = category === 'Fire' ? ['fire'] : category === 'Flood' ? ['flood'] : [];
            
            const { score, reasoning } = calculateUrgencyScore({
              peopleCount: 1,
              isMedical,
              severity: 'High',
              vulnerabilities: [],
              hazards,
              requiredCapabilities: []
            });

            // Insert rapid incident
            await supabase.from('incidents').insert([{
              reporter_id,
              status: 'reported',
              category: category.toLowerCase(),
              raw_transcript: `Rapid Report: ${option} (${category})`,
              people_affected: 1,
              hazards,
              urgency_score: score,
              urgency_band: score >= 80 ? 'critical' : score >= 50 ? 'high' : 'medium',
              urgency_breakdown: reasoning,
              location: `POINT(${lon} ${lat})`
            }]);
          }

          const newIncident = {
            id: Date.now(),
            pos: [lat, lon],
            title: option,
            severity: category === 'Fire' || category === 'Medical' ? 'Critical' : 'High'
          };
          const existing = JSON.parse(localStorage.getItem('trinetra_live_incidents') || '[]');
          localStorage.setItem('trinetra_live_incidents', JSON.stringify([...existing, newIncident]));
          window.dispatchEvent(new Event('storage'));
        },
        async (err) => {
          console.warn("GPS failed", err);
          // Fallback to static location if GPS fails
          if (user) {
            const reporter_id = generateUUID(user.uid);
            
            await supabase.from('users').upsert([{
              id: reporter_id,
              role: 'citizen',
              full_name: user.displayName || user.email || 'Citizen'
            }], { onConflict: 'id' });

            const isMedical = category === 'Medical' || option.toLowerCase().includes('injury');
            const hazards = category === 'Fire' ? ['fire'] : category === 'Flood' ? ['flood'] : [];
            
            const { score, reasoning } = calculateUrgencyScore({
              peopleCount: 1,
              isMedical,
              severity: 'High',
              vulnerabilities: [],
              hazards,
              requiredCapabilities: []
            });

            await supabase.from('incidents').insert([{
              reporter_id,
              status: 'reported',
              category: category.toLowerCase(),
              raw_transcript: `Rapid Report: ${option} (${category})`,
              people_affected: 1,
              hazards,
              urgency_score: score,
              urgency_band: score >= 80 ? 'critical' : score >= 50 ? 'high' : 'medium',
              urgency_breakdown: reasoning,
              location: `POINT(77.2090 28.6139)`
            }]);
          }
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    setActiveNotification({
      title: 'Authorities Notified',
      message: `${authority} has been informed about: ${option}. Live GPS tracked. Stay calm, help is on the way.`
    });
    setSelectedIncident(null);

    // Auto-dismiss notification after 5 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 5000);
  };

  const handleTileClick = (feature: string) => {
    if (feature === 'Triage Protocol') {
      setIsTriageOpen(true);
      return;
    }
    if (feature === 'Medical Profile') {
      navigate('/citizen/profile');
      return;
    }
    if (feature === 'Nearby Shelters') {
      navigate('/citizen/nearby');
      return;
    }
    if (feature === 'My Requests') {
      navigate('/citizen/requests');
      return;
    }
    setActiveNotification({
      title: 'Module Access',
      message: `Opening ${feature}...`
    });
    setTimeout(() => setActiveNotification(null), 3000);
  };

  const handleTriageComplete = (triageData: any) => {
    setIsTriageOpen(false);
    
    // Broadcast triage report to Coordinator Map via localStorage
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const newIncident = {
            id: Date.now(),
            pos: [lat, lon],
            title: `Triage: ${triageData.incidentType || 'General Emergency'}`,
            severity: triageData.severity,
            urgency_band: triageData.score,
            raw_transcript: JSON.stringify({ type: 'triage_report', detail: triageData })
          };
          const existing = JSON.parse(localStorage.getItem('trinetra_live_incidents') || '[]');
          localStorage.setItem('trinetra_live_incidents', JSON.stringify([...existing, newIncident]));
          window.dispatchEvent(new Event('storage'));
        },
        (err) => console.warn("GPS failed", err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    setActiveNotification({
      title: 'Command Center Notified',
      message: `Triage assessment submitted (Score: ${triageData.score}/100). Help is being dispatched immediately.`
    });

    setTimeout(() => {
      setActiveNotification(null);
    }, 6000);
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
      {/* Hidden file input for Photo Report */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef}
        onChange={handlePhotoCapture}
        className="hidden"
      />
      {/* Voice Distress Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-[200] bg-error/95 flex flex-col items-center justify-center p-6 text-white animate-fade-in backdrop-blur-md">
          <span className="material-symbols-outlined text-[80px] mb-4 animate-pulse">record_voice_over</span>
          <h2 className="font-display-lg text-4xl font-bold mb-2 text-center">Voice Distress Detected</h2>
          <p className="text-xl opacity-90 mb-8 text-center max-w-md">
            Dispatching authorities in...
          </p>
          <div className="text-[120px] font-extrabold leading-none mb-12 drop-shadow-lg">
            {countdown}
          </div>
          <button 
            onClick={cancelCountdown}
            className="bg-white/20 hover:bg-white/30 border-2 border-white/50 text-white rounded-full px-8 py-4 font-bold text-xl transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">close</span> Cancel SOS
          </button>
        </div>
      )}

      {/* Top Bar with Silent SOS Toggle */}
      <div className="flex justify-between items-center w-full mb-2">
        <h1 className="font-display-md text-primary opacity-0">Emergency</h1> {/* Spacer for layout balance */}
        <button 
          onClick={() => setSilentSosEnabled(!silentSosEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all shadow-sm ${silentSosEnabled ? 'bg-error/10 border-error/30 text-error' : 'bg-surface border-outline-variant text-on-surface-variant'}`}
        >
          <span className={`material-symbols-outlined text-[18px] ${silentSosEnabled && isListening ? 'animate-pulse' : ''}`}>
            {silentSosEnabled ? 'mic' : 'mic_off'}
          </span>
          {silentSosEnabled ? 'Silent SOS: Active' : 'Silent SOS: Off'}
        </button>
      </div>

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

        {/* Photo Report Tile */}
        <div onClick={() => fileInputRef.current?.click()} className="bg-stone-bg border border-outline-variant/30 rounded-xl p-8 flex flex-col justify-between min-h-[200px] hover:border-earth-accent/50 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-sage-primary text-4xl group-hover:scale-110 transition-transform font-light">photo_camera</span>
          </div>
          <div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal-text">Photo Report</h3>
            <p className="font-label-sm text-on-surface-variant uppercase mt-2">Send visual context</p>
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

      <TriageProtocolModal 
        isOpen={isTriageOpen} 
        onClose={() => setIsTriageOpen(false)} 
        onComplete={handleTriageComplete} 
      />
      {/* Dispatch Alert Modal (Coordinator Response) */}
      {dispatchAlert && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-surface border-t-8 border-t-primary rounded-3xl p-8 max-w-md w-full shadow-2xl animate-slide-in-up text-center">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[40px]">emergency_share</span>
            </div>
            <h2 className="font-display-lg text-3xl font-bold text-on-surface mb-4">Help is on the way!</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
              {dispatchAlert.message}
            </p>
            <button 
              onClick={() => setDispatchAlert(null)}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-md hover:bg-primary/90 transition-all active:scale-95 text-lg"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

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
