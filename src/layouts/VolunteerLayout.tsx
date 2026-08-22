import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const VolunteerLayout: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isMap = location.pathname.includes('/map');

  // Real-time Voice SOS Alert Listener
  const [voiceAlert, setVoiceAlert] = useState<any>(null);
  const lastSeenIdRef = useRef<number>(0);

  useEffect(() => {
    const checkForVoiceSOS = () => {
      const stored = localStorage.getItem('trinetra_live_incidents');
      if (stored) {
        try {
          const incidents = JSON.parse(stored);
          const voiceIncidents = incidents.filter(
            (inc: any) => inc.trigger_source === 'voice_keyword_auto' && inc.id > lastSeenIdRef.current
          );
          if (voiceIncidents.length > 0) {
            const latest = voiceIncidents[voiceIncidents.length - 1];
            lastSeenIdRef.current = latest.id;
            triggerVoiceAlert(latest);
          }
        } catch(e) {}
      }
    };

    // 1. Supabase Realtime Subscription (Cross-device for pitch)
    const channel = supabase.channel('sos-alerts');
    channel.on('broadcast', { event: 'new-voice-sos' }, (payload) => {
      console.log('Received Supabase Voice SOS:', payload.payload);
      const incident = payload.payload;
      if (incident.id > lastSeenIdRef.current) {
        lastSeenIdRef.current = incident.id;
        triggerVoiceAlert(incident);
      }
    }).subscribe();

    // 2. LocalStorage Polling (Local fallback)
    const interval = setInterval(checkForVoiceSOS, 2000);
    window.addEventListener('storage', checkForVoiceSOS);
    
    return () => { 
      clearInterval(interval); 
      window.removeEventListener('storage', checkForVoiceSOS); 
      supabase.removeChannel(channel);
    };
  }, []);

  const triggerVoiceAlert = (incident: any) => {
    setVoiceAlert(incident);
    // Vibrate if supported
    if ('vibrate' in navigator) navigator.vibrate([300, 100, 300, 100, 300]);
    // Play alert sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = 'sawtooth'; osc.frequency.value = 600;
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.start(); setTimeout(() => osc.stop(), 800);
    } catch(e) {}
  };

  return (
    <div className="bg-stone-bg text-charcoal-text font-body-md min-h-screen flex flex-col pt-20 pb-28 relative">
      
      {/* TopAppBar */}
      {!isMap && (
        <header className="fixed top-0 w-full z-50 bg-stone-bg/80 backdrop-blur-md shadow-sm">
          <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-sage-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                menu
              </span>
            </button>
            
            <h1 className="font-display-lg text-display-lg tracking-tighter">
              <span style={{color: '#FF9933'}}>t</span>
              <span style={{color: '#1b1c1b'}}>r</span>
              <span style={{color: '#138808'}}>i</span>
              <span className="font-bold text-primary ml-0.5">NETRA</span>
            </h1>
            
            <NavLink 
              to="/volunteer/profile"
              className="hover:bg-surface-container-high transition-transform active:scale-95 duration-200 rounded-full overflow-hidden w-12 h-12 flex items-center justify-center border-2 border-surface-variant hover:border-sage-primary"
            >
              <img 
                alt="Volunteer profile" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              />
            </NavLink>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>

      {/* Bottom Navigation Bar */}
      {!isMap && (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter pb-6 pt-4 bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant shadow-[0_-8px_32px_rgba(140,115,85,0.06)]">
          
          <NavLink to="/volunteer" end className={({ isActive }) => `flex flex-col items-center justify-center w-20 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-primary-fixed' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-primary-fixed text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>home</span>
                </div>
                <span className={`font-label-sm text-[12px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Home</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/volunteer/missions" className={({ isActive }) => `flex flex-col items-center justify-center w-20 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary-container' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-secondary-container text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>assignment</span>
                </div>
                <span className={`font-label-sm text-[12px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Missions</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/volunteer/map" className={({ isActive }) => `flex flex-col items-center justify-center w-20 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-primary-fixed' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-primary-fixed text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>map</span>
                </div>
                <span className={`font-label-sm text-[12px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Map</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/volunteer/profile" className={({ isActive }) => `flex flex-col items-center justify-center w-20 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary-container' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-secondary-container text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>badge</span>
                </div>
                <span className={`font-label-sm text-[12px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Profile</span>
              </>
            )}
          </NavLink>
          
        </nav>
      )}
      {/* Side Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in cursor-pointer" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-[75%] max-w-[320px] bg-stone-bg h-full shadow-[24px_0_48px_rgba(0,0,0,0.3)] animate-slide-in-right flex flex-col">
            <div className="p-6 h-20 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h2 className="font-headline-sm text-on-surface tracking-tight">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant active:scale-95">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 m-0 list-none [&_a]:no-underline">
              <Link to="/volunteer/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95 no-underline">
                <span className="material-symbols-outlined text-sage-primary text-[24px]">settings</span>
                <span className="font-label-lg">Settings</span>
              </Link>
              <Link to="/volunteer/history" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95 no-underline">
                <span className="material-symbols-outlined text-sage-primary text-[24px]">history</span>
                <span className="font-label-lg">Mission History</span>
              </Link>
              <div className="my-4 border-t border-outline-variant/30"></div>
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95 no-underline">
                <span className="material-symbols-outlined text-primary text-[24px]">swap_horiz</span>
                <span className="font-label-lg">Switch Role</span>
              </Link>
              <div className="mt-auto pt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-error-container/80 text-error transition-colors active:scale-95 no-underline">
                  <span className="material-symbols-outlined text-[24px]">logout</span>
                  <span className="font-label-lg font-bold">Sign Out to Login Page</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Voice SOS Incoming Alert */}
      {voiceAlert && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex flex-col items-center justify-center p-6 animate-fade-in backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center border-2 border-error/50">
            <div className="w-20 h-20 rounded-full bg-error/15 flex items-center justify-center mb-6 animate-[pulse_1.5s_ease-in-out_infinite]">
              <span className="material-symbols-outlined text-[48px] text-error">sos</span>
            </div>
            
            <h2 className="font-display-lg text-error mb-2 text-2xl font-bold">
              {voiceAlert.trigger_source === 'photo_report' ? 'Incoming Photo SOS' : 'Incoming Voice SOS'}
            </h2>
            <p className="font-body-lg text-on-surface-variant mb-6">
              {voiceAlert.trigger_source === 'photo_report'
                ? "A citizen has uploaded photo evidence of an emergency from their location."
                : voiceAlert.trigger_detail === 'shout_detected'
                  ? "A loud distress sound triggered an emergency alert."
                  : "A citizen's passive voice detection has triggered an emergency alert."}
            </p>
            
            <div className="bg-error/10 rounded-xl p-4 w-full mb-6 border border-error/20">
              {voiceAlert.trigger_source === 'photo_report' ? (
                <div className="mb-4">
                  <p className="font-label-sm text-error uppercase tracking-wider mb-2 font-bold">Photo Evidence</p>
                  <div className="w-full h-32 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-error/30">
                    {voiceAlert.trigger_detail && (voiceAlert.trigger_detail.startsWith('http') || voiceAlert.trigger_detail.startsWith('data:')) ? (
                      <img src={voiceAlert.trigger_detail} alt="SOS Evidence" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-error text-[32px]">broken_image</span>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-label-sm text-error uppercase tracking-wider mb-1 font-bold">
                    {voiceAlert.trigger_detail === 'shout_detected' ? 'Detected Shout' : 'Detected Keyword'}
                  </p>
                  <p className="font-headline-lg-mobile text-on-surface">
                    {voiceAlert.trigger_detail === 'shout_detected' ? 'Sustained Loud Noise' : voiceAlert.trigger_detail || voiceAlert.title}
                  </p>
                </>
              )}
              <p className="text-sm text-on-surface-variant mt-2 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {voiceAlert.pos ? `${voiceAlert.pos[0].toFixed(4)}, ${voiceAlert.pos[1].toFixed(4)}` : 'Location unavailable'}
              </p>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <span className={`inline-block w-3 h-3 ${voiceAlert.trigger_source === 'photo_report' ? 'bg-error' : 'bg-amber-500'} rounded-full animate-[pulse_1s_ease-in-out_infinite]`}></span>
              <span className={`font-label-sm ${voiceAlert.trigger_source === 'photo_report' ? 'text-error' : 'text-amber-600'} uppercase tracking-wider font-bold`}>
                {voiceAlert.trigger_source === 'photo_report' ? 'Citizen App — Confirmed' : 'Auto-detected — Unconfirmed'}
              </span>
            </div>
            
            <button 
              onClick={() => setVoiceAlert(null)}
              className="w-full h-14 bg-sage-primary text-white rounded-xl font-bold uppercase tracking-wider hover:bg-primary transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Acknowledge & Respond
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
