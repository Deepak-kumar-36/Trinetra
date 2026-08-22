import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const CoordinatorLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<{title: string, message: string} | null>(null);

  const isMap = location.pathname.includes('/map');

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
            
            <NavLink 
            to="/coordinator/resources"
            className="hover:bg-surface-container-high transition-transform active:scale-95 duration-200 rounded-full overflow-hidden w-12 h-12 flex items-center justify-center border-2 border-surface-variant hover:border-error bg-primary text-on-primary font-bold text-lg"
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
    </div>
  );
};
