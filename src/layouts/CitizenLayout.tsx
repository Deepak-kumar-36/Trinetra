import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DistressDetectionProvider, useDistressDetection } from '../contexts/DistressDetectionContext';
import { useTTS } from '../contexts/TTSContext';

const CitizenLayoutInner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSafe, setIsSafe] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  
  const { enabled, setEnabled } = useDistressDetection();
  const { isTTSEnabled, toggleTTS } = useTTS();

  const isReport = location.pathname.includes('/report');

  return (
    <div className="bg-stone-bg text-charcoal-text font-body-md min-h-screen flex flex-col pt-20 pb-28 relative">
      
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-stone-bg/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop">
          <button 
            onClick={() => isReport ? navigate(-1) : setIsMenuOpen(true)}
            className="text-sage-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
              {isReport ? 'arrow_back' : 'menu'}
            </span>
          </button>
          
          <h1 className="font-display-lg text-display-lg tracking-tighter">
            <span style={{color: '#FF9933'}}>t</span>
            <span style={{color: '#1b1c1b'}}>r</span>
            <span style={{color: '#138808'}}>i</span>
            <span className="font-bold text-primary ml-0.5">NETRA</span>
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

            <button 
              onClick={() => setEnabled(!enabled)}
              className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                enabled 
                  ? 'bg-error/15 text-error animate-[pulse_2s_ease-in-out_infinite] ring-2 ring-error/30' 
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
              title={enabled ? 'Voice detection ON' : 'Enable passive voice detection'}
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: enabled ? "'FILL' 1" : "'FILL' 0" }}>
                {enabled ? 'mic' : 'mic_off'}
              </span>
            </button>
          </div>
          
          <NavLink 
            to="/citizen/profile"
            className="hover:bg-surface-container-high transition-transform active:scale-95 duration-200 rounded-full overflow-hidden w-12 h-12 flex items-center justify-center border-2 border-surface-variant hover:border-sage-primary bg-primary text-on-primary font-bold text-lg ml-1"
          >
            {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>

      {/* Bottom Navigation Bar */}
      {!isReport && (
        <nav className="fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant shadow-[0_-8px_32px_rgba(140,115,85,0.06)] flex justify-around items-center px-2 pb-5 pt-3">
          
          <NavLink to="/citizen" end className={({ isActive }) => `flex flex-col items-center justify-center w-16 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary-container' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-secondary-container text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>home</span>
                </div>
                <span className={`font-label-sm text-[10px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Home</span>
              </>
            )}
          </NavLink>

          <NavLink to="/citizen/photo" className={({ isActive }) => `flex flex-col items-center justify-center w-16 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary-container' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-secondary-container text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>photo_camera</span>
                </div>
                <span className={`font-label-sm text-[10px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Photo</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/citizen/report" className={({ isActive }) => `flex flex-col items-center justify-center w-16 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-error-container' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-error-container text-[26px]' : 'text-error text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>emergency</span>
                </div>
                <span className={`font-label-sm text-[10px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-error font-bold' : 'text-error'}`}>SOS</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/citizen/nearby" className={({ isActive }) => `flex flex-col items-center justify-center w-16 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-primary-fixed' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-primary-fixed text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>explore</span>
                </div>
                <span className={`font-label-sm text-[10px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Maps</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/citizen/profile" className={({ isActive }) => `flex flex-col items-center justify-center w-16 transition-all duration-300 active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary-container' : 'group-hover:bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'text-on-secondary-container text-[26px]' : 'text-[24px]'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>medical_information</span>
                </div>
                <span className={`font-label-sm text-[10px] uppercase mt-1 tracking-wider transition-colors duration-300 ${isActive ? 'text-on-surface font-bold' : ''}`}>Profile</span>
              </>
            )}
          </NavLink>
          
        </nav>
      )}

      {/* Side Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="relative w-[75%] max-w-[320px] bg-stone-bg h-full shadow-[24px_0_48px_rgba(0,0,0,0.3)] animate-slide-in-right flex flex-col">
            <div className="p-6 h-20 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h2 className="font-headline-sm text-on-surface tracking-tight">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant active:scale-95">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 m-0 list-none [&_a]:no-underline">
              <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-4 mb-4 shadow-inner">
                <h3 className="font-label-sm uppercase tracking-wider text-on-surface-variant mb-4">Safety Status</h3>
                
                {/* Mark as Safe Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined ${isSafe ? 'text-sage-primary' : 'text-on-surface-variant'}`}>
                      {isSafe ? 'verified_user' : 'gpp_maybe'}
                    </span>
                    <span className="font-label-md text-on-surface">Mark as Safe</span>
                  </div>
                  <button 
                    onClick={() => setIsSafe(!isSafe)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${isSafe ? 'bg-sage-primary' : 'bg-surface-variant'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${isSafe ? 'left-6.5 translate-x-[22px]' : 'left-0.5'}`}></div>
                  </button>
                </div>
                
                {/* Broadcast Location Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined ${isBroadcasting ? 'text-error animate-pulse' : 'text-on-surface-variant'}`}>
                      my_location
                    </span>
                    <span className="font-label-md text-on-surface">Live Location Sync</span>
                  </div>
                  <button 
                    onClick={() => setIsBroadcasting(!isBroadcasting)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${isBroadcasting ? 'bg-error' : 'bg-surface-variant'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${isBroadcasting ? 'left-6.5 translate-x-[22px]' : 'left-0.5'}`}></div>
                  </button>
                </div>
              </div>

              <Link to="/citizen/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95 no-underline">
                <span className="material-symbols-outlined text-sage-primary text-[24px]">settings</span>
                <span className="font-label-lg">Settings</span>
              </Link>
              <Link to="/citizen/contacts" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95 no-underline">
                <span className="material-symbols-outlined text-sage-primary text-[24px]">contacts</span>
                <span className="font-label-lg">Emergency Contacts</span>
              </Link>
              <Link to="/citizen/history" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95 no-underline">
                <span className="material-symbols-outlined text-sage-primary text-[24px]">history</span>
                <span className="font-label-lg">Incident History</span>
              </Link>
              
              <div className="my-4 border-t border-outline-variant/30"></div>
              
              <Link to="/role-selection" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface active:scale-95 no-underline">
                <span className="material-symbols-outlined text-primary text-[24px]">swap_horiz</span>
                <span className="font-label-lg">Switch Role</span>
              </Link>
              
              <div className="mt-auto pt-4">
                <button 
                  onClick={async () => {
                    await signOut();
                    setIsMenuOpen(false);
                    navigate('/login?role=citizen');
                  }} 
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-error-container/80 text-error transition-colors active:scale-95 no-underline"
                >
                  <span className="material-symbols-outlined text-[24px]">logout</span>
                  <span className="font-label-lg font-bold">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CitizenLayout: React.FC = () => (
  <DistressDetectionProvider userId="demo-citizen-id" initialEnabled={false}>
    <CitizenLayoutInner />
  </DistressDetectionProvider>
);
