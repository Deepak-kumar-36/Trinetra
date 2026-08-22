import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useTTS } from '../contexts/TTSContext';

export const CoordinatorLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<{title: string, message: string} | null>(null);
  const { isTTSEnabled, toggleTTS, speak } = useTTS();

  // Real-time Voice SOS Alert Listener for Command Center
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
      console.log('Received Supabase Voice SOS (Coordinator):', payload.payload);
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
    if ('vibrate' in navigator) navigator.vibrate([400, 200, 400, 200, 800]);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = 'square'; 
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1108.73, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start(); setTimeout(() => osc.stop(), 1000);
    } catch(e) {}

    let parsedTranscript: any = {};
    try {
      parsedTranscript = JSON.parse(incident.raw_transcript || '{}');
    } catch (e) {}
    const isPhotoReport = parsedTranscript.type === 'photo_report';
    if (isPhotoReport) {
      speak("Incoming Photo SOS. A citizen has uploaded photo evidence of an emergency.");
    } else {
      speak("Incoming Voice SOS. A citizen's voice detection has triggered an emergency alert.");
    }
  };

  return (
    <div className="bg-stone-bg text-charcoal-text font-body-md min-h-screen flex flex-col pt-20 pb-28 relative">
      
      {/* TopAppBar */}
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
              <span className="text-sm font-label-sm text-error ml-2 uppercase tracking-widest hidden md:inline-block">Command</span>
            </h1>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={toggleTTS}
                className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isTTSEnabled 
                    ? 'text-primary bg-primary-container' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                title={isTTSEnabled ? 'Text-to-Speech ON' : 'Enable Text-to-Speech'}
              >
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isTTSEnabled ? "'FILL' 1" : "'FILL' 0" }}>
                  {isTTSEnabled ? 'volume_up' : 'volume_off'}
                </span>
              </button>

              <NavLink 
                to="/coordinator/resources"
                className="hover:bg-surface-container-high transition-transform active:scale-95 duration-200 rounded-full overflow-hidden w-12 h-12 flex items-center justify-center border-2 border-surface-variant hover:border-error bg-primary text-on-primary font-bold text-lg ml-1"
              >
                {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
              </NavLink>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>

      {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter pb-6 pt-4 bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant shadow-[0_-8px_32px_rgba(140,115,85,0.06)]">
          
          <NavLink to="/coordinator" end className={({ isActive }) => `flex flex-col items-center justify-center w-20 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary-container' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-secondary-container text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
                </div>
                <span className={`font-label-sm text-[12px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Ops</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/coordinator/incidents" className={({ isActive }) => `flex flex-col items-center justify-center w-20 transition-all duration-300 active:scale-95 group ${isActive ? 'text-error' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-error-container' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-error-container text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>warning</span>
                </div>
                <span className={`font-label-sm text-[12px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-error font-bold' : ''}`}>Incidents</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/coordinator/map" className={({ isActive }) => `flex flex-col items-center justify-center w-20 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-primary-fixed' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-primary-fixed text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>explore</span>
                </div>
                <span className={`font-label-sm text-[12px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Map</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/coordinator/resources" className={({ isActive }) => `flex flex-col items-center justify-center w-20 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary-container' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-secondary-container text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>inventory_2</span>
                </div>
                <span className={`font-label-sm text-[12px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Assets</span>
              </>
            )}
          </NavLink>
          
        </nav>

      {/* Side Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="relative w-[80%] max-w-[360px] bg-stone-bg border-r border-outline-variant h-full shadow-[32px_0_64px_rgba(0,0,0,0.5)] animate-slide-in-left flex flex-col">
            <div className="p-6 pb-4 border-b border-outline-variant/30 bg-surface-container-lowest">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-sm text-on-surface tracking-tight uppercase tracking-widest text-error">Command Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant active:scale-95">
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>
              
              {/* Profile Snippet */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-primary text-on-primary font-bold text-lg">
                  {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-label-lg text-on-surface">{user?.displayName || 'Coordinator'}</h3>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest">ID: {user?.uid || 'CMD-0932'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              <h4 className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-4 mb-2 px-4 text-xs">Operations</h4>
              
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveNotification({ title: 'Global Broadcast Sent', message: 'All units have been alerted to standby for severe weather incoming.' });
                  setTimeout(() => setActiveNotification(null), 5000);
                }}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-error-container/20 border border-transparent hover:border-error/30 transition-colors text-on-surface active:scale-95 group text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-error text-[24px] group-hover:animate-pulse">cell_tower</span>
                  <span className="font-label-lg">Global Broadcast</span>
                </div>
              </button>
              
              <NavLink to="/coordinator/incidents" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95">
                <span className="material-symbols-outlined text-sage-primary text-[24px]">list_alt</span>
                <span className="font-label-lg">Dispatch Logs</span>
              </NavLink>

              <NavLink to="/coordinator" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95">
                <span className="material-symbols-outlined text-sage-primary text-[24px]">settings_system_daydream</span>
                <span className="font-label-lg">System Diagnostics</span>
              </NavLink>

              <h4 className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-6 mb-2 px-4 text-xs">Account</h4>
              
              <NavLink to="/role-selection" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95">
                <span className="material-symbols-outlined text-primary text-[24px]">swap_horiz</span>
                <span className="font-label-lg">Switch Protocol</span>
              </NavLink>
              
              <div className="mt-auto pt-4">
                <button 
                  onClick={async () => {
                    await signOut();
                    setIsMenuOpen(false);
                    navigate('/login?role=coordinator');
                  }} 
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-error-container/80 text-error transition-colors active:scale-95"
                >
                  <span className="material-symbols-outlined text-[24px]">logout</span>
                  <span className="font-label-lg font-bold">Terminate Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification for Global Broadcast */}
      {activeNotification && (
        <div className="fixed top-24 right-4 md:right-8 z-[110] animate-[slide-in-right_0.3s_ease-out_forwards] w-80">
          <div className="bg-surface-container-highest border-l-4 border-error shadow-[0_12px_40px_rgba(0,0,0,0.3)] rounded-xl p-4 flex gap-4 items-start relative overflow-hidden">
            <div className="absolute inset-0 bg-error/5 pointer-events-none"></div>
            <span className="material-symbols-outlined text-error text-2xl shrink-0">campaign</span>
            <div className="flex-1">
              <h4 className="font-label-sm uppercase tracking-wider text-error font-bold">{activeNotification.title}</h4>
              <p className="text-sm text-on-surface mt-1 leading-relaxed">{activeNotification.message}</p>
            </div>
            <button onClick={() => setActiveNotification(null)} className="ml-auto text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
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
              <Link to="/coordinator/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95 no-underline">
                <span className="material-symbols-outlined text-sage-primary text-[24px]">settings</span>
                <span className="font-label-lg">Settings</span>
              </Link>
              <Link to="/coordinator/history" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95 no-underline">
                <span className="material-symbols-outlined text-sage-primary text-[24px]">history</span>
                <span className="font-label-lg">Command History</span>
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
      {/* Voice SOS Command Center Alert */}
      {voiceAlert && (() => {
        let parsedTranscript: any = {};
        try {
          parsedTranscript = JSON.parse(voiceAlert.raw_transcript || '{}');
        } catch (e) {}
        
        const isPhotoReport = parsedTranscript.type === 'photo_report';
        const triggerDetail = parsedTranscript.url || parsedTranscript.detail || '';

        return (
          <div className="fixed inset-0 z-[9999] bg-black/85 flex flex-col items-center justify-center p-6 animate-fade-in backdrop-blur-md">
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center border-2 border-error">
            <div className="w-24 h-24 rounded-full bg-error flex items-center justify-center mb-6 animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_40px_rgba(200,50,50,0.5)]">
              <span className="material-symbols-outlined text-[56px] text-white">warning</span>
            </div>
            
              <div className="bg-error text-white px-4 py-1.5 rounded-full font-label-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-white rounded-full animate-[pulse_0.5s_ease-in-out_infinite]"></span>
                {isPhotoReport ? 'Priority Alert — Photo Evidence' : 'Priority Alert — Voice Auto-Detection'}
              </div>
              
              <h2 className="font-display-lg text-on-surface mb-2 text-2xl font-bold">
                {isPhotoReport ? 'Photo SOS Received' : 'Passive Distress Detected'}
              </h2>
              <p className="font-body-lg text-on-surface-variant mb-6">
                {isPhotoReport
                  ? "A citizen has uploaded photo evidence of an emergency from their location."
                  : triggerDetail === 'shout_detected'
                    ? "A citizen's device detected a sustained loud noise (shout). No manual confirmation was received — treat as potential emergency."
                    : "A citizen's device detected a distress keyword. No manual confirmation was received — treat as potential emergency."}
              </p>
            
            <div className="bg-surface-container rounded-xl p-5 w-full mb-6 border border-surface-variant">
              <div className="grid grid-cols-2 gap-4 text-left">
                  {isPhotoReport ? (
                    <div className="col-span-2 mb-2">
                      <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2 font-bold">Photo Evidence</p>
                      <div className="w-full h-48 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-outline-variant">
                        {triggerDetail && (triggerDetail.startsWith('http') || triggerDetail.startsWith('data:')) ? (
                          <img src={triggerDetail} alt="SOS Evidence" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-surface-variant text-[48px]">broken_image</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1 font-bold">
                        {triggerDetail === 'shout_detected' ? 'Detection (Shout)' : 'Detection (Keyword)'}
                      </p>
                      <p className="font-headline-lg-mobile text-error">
                        {triggerDetail === 'shout_detected' ? 'Sustained Loud Noise' : triggerDetail || voiceAlert.title || voiceAlert.description}
                      </p>
                    </div>
                  )}
                <div>
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Coordinates</p>
                  <p className="font-body-md text-on-surface font-mono">{voiceAlert.pos ? `${voiceAlert.pos[0].toFixed(4)}, ${voiceAlert.pos[1].toFixed(4)}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Severity</p>
                  <p className="font-body-md text-error font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">priority_high</span>{voiceAlert.urgency_band || voiceAlert.severity || 'Critical'}</p>
                </div>
                  <div>
                    <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Source</p>
                    <p className="font-body-md text-amber-600 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        {isPhotoReport ? 'photo_camera' : 'memory'}
                      </span>
                      {isPhotoReport ? 'Citizen App' : 'Unconfirmed Auto'}
                    </p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setVoiceAlert(null)}
                className="w-full h-14 bg-error text-white rounded-xl font-bold uppercase tracking-wider hover:bg-error/90 transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined">verified</span>
                Acknowledge & Deploy Response
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
