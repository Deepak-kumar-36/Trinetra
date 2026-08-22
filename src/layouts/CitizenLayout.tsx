import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';

export const CitizenLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isReport = location.pathname.includes('/report');

  return (
    <div className="bg-background text-on-background font-body-lg min-h-screen flex flex-col md:flex-row pb-[100px] md:pb-0 relative">
      
      {/* TopAppBar */}
      {isReport ? (
        <header className="bg-background border-b-2 border-outline-variant docked full-width top-0 z-40 sticky">
          <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-[72px]">
            <button 
              onClick={() => navigate(-1)}
              aria-label="Go back" 
              className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-primary active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tighter">
              <span className="font-bold text-[#FF9933]">t</span>
              <span className="font-bold text-[#FFFFFF] drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">r</span>
              <span className="font-bold text-[#138808]">i</span>
              <span className="font-bold">NETRA</span>
            </h1>
            <div className="w-12"></div>
          </div>
        </header>
      ) : (
        <header className="bg-surface/80 backdrop-blur-md docked full-width top-0 z-40 flex justify-between items-center w-full px-margin-mobile h-touch-target md:hidden">
          <button className="text-primary hover:bg-surface-container-low transition-colors active:opacity-70 flex items-center justify-center p-2 rounded-lg">
            <span className="material-symbols-outlined text-4xl font-light">menu</span>
          </button>
          <h1 className="font-display-lg text-headline-lg-mobile tracking-tight flex items-center">
            <span style={{color: '#FF9933'}}>t</span>
            <span className="logo-shadow" style={{color: '#FFFFFF'}}>r</span>
            <span style={{color: '#128807'}}>i</span>
            <span className="font-bold text-primary ml-0.5">NETRA</span>
          </h1>
          <button className="text-primary hover:bg-surface-container-low transition-colors active:opacity-70 flex items-center justify-center p-2 rounded-lg">
            <span className="material-symbols-outlined text-4xl font-light">close</span>
          </button>
        </header>
      )}

      {/* NavigationDrawer (Tablet/Desktop) */}
      {!isReport && (
        <aside className="hidden md:flex flex-col h-full w-80 rounded-r-none border-r border-outline-variant/30 bg-surface p-gutter shrink-0 z-40 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <header className="flex justify-between items-center mb-8 h-touch-target w-full">
            <h1 className="font-display-lg text-headline-lg tracking-tight flex items-center">
              <span style={{color: '#FF9933'}}>t</span>
              <span className="logo-shadow" style={{color: '#FFFFFF'}}>r</span>
              <span style={{color: '#128807'}}>i</span>
              <span className="font-bold text-primary ml-0.5">NETRA</span>
            </h1>
          </header>
          
          <nav className="flex flex-col gap-2 flex-grow">
            <a className="flex items-center gap-4 p-4 rounded-lg text-on-surface-variant hover:bg-surface-container-high active:translate-x-1 transition-transform font-label-sm text-label-sm" href="#">
              <span className="material-symbols-outlined text-3xl font-light">account_circle</span>
              Personal ID
            </a>
            <a className="flex items-center gap-4 p-4 rounded-lg text-on-surface-variant hover:bg-surface-container-high active:translate-x-1 transition-transform font-label-sm text-label-sm" href="#">
              <span className="material-symbols-outlined text-3xl font-light">medical_services</span>
              Medical Profile
            </a>
            <a className="flex items-center gap-4 p-4 rounded-lg text-on-surface-variant hover:bg-surface-container-high active:translate-x-1 transition-transform font-label-sm text-label-sm" href="#">
              <span className="material-symbols-outlined text-3xl font-light">settings_input_antenna</span>
              Nearby Relays
            </a>
            <a className="flex items-center gap-4 p-4 rounded-lg text-on-surface-variant hover:bg-surface-container-high active:translate-x-1 transition-transform font-label-sm text-label-sm" href="#">
              <span className="material-symbols-outlined text-3xl font-light">map</span>
              Offline Maps
            </a>
            <div className="mt-auto">
              <a className="flex items-center gap-4 p-4 rounded-lg bg-error-container/50 text-on-error-container hover:bg-error hover:text-on-error active:translate-x-1 transition-transform font-label-sm text-label-sm border border-error/50" href="#">
                <span className="material-symbols-outlined text-3xl font-light">power_settings_new</span>
                System Override
              </a>
            </div>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <Outlet />

      {/* Bottom Navigation Bar */}
      {isReport ? (
        <nav className="fixed bottom-0 w-full bg-surface border-t border-outline-variant z-50 pb-safe">
          <div className="flex justify-around items-center h-[80px] max-w-[1040px] mx-auto px-margin-mobile">
            <NavLink to="/citizen" end className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              <span className="material-symbols-outlined text-[28px] mb-1">home</span>
              <span className="text-[12px] font-medium tracking-wide">Home</span>
            </NavLink>
            
            <NavLink to="/citizen/report" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg relative ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute -top-3 bg-primary-container text-on-primary-container rounded-full w-14 h-8 flex items-center justify-center -z-10 shadow-sm"></div>}
                  <span className="material-symbols-outlined text-[28px] mb-1">add_circle</span>
                  <span className="text-[12px] font-medium tracking-wide">Report</span>
                </>
              )}
            </NavLink>
            
            <NavLink to="/citizen/profile" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              <span className="material-symbols-outlined text-[28px] mb-1">person</span>
              <span className="text-[12px] font-medium tracking-wide">Profile</span>
            </NavLink>
          </div>
        </nav>
      ) : (
        <nav className="md:hidden bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 rounded-t-xl shadow-[0_-8px_32px_rgba(140,115,85,0.06)] animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <NavLink to="/citizen" end className={({ isActive }) => isActive ? "flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-6 py-2 active:scale-95 duration-200 transition-all hover:text-primary" : "flex flex-col items-center justify-center text-outline p-2 active:scale-95 duration-200 transition-all hover:text-primary"}>
            <span className="material-symbols-outlined text-3xl font-light">home</span>
            <span className="font-label-sm text-[12px] uppercase mt-1">Home</span>
          </NavLink>
          
          <NavLink to="/citizen/report" className="flex flex-col items-center justify-center text-outline p-2 active:scale-95 duration-200 transition-all hover:text-primary">
            <span className="material-symbols-outlined text-3xl font-light">add_circle</span>
            <span className="font-label-sm text-[12px] uppercase mt-1">Report</span>
          </NavLink>
          
          <a className="flex flex-col items-center justify-center text-outline p-2 active:scale-95 duration-200 transition-all hover:text-primary" href="#">
            <span className="material-symbols-outlined text-3xl font-light">medical_services</span>
            <span className="font-label-sm text-[12px] uppercase mt-1">Triage</span>
          </a>
          
          <a className="flex flex-col items-center justify-center text-outline p-2 active:scale-95 duration-200 transition-all hover:text-primary" href="#">
            <span className="material-symbols-outlined text-3xl font-light">map</span>
            <span className="font-label-sm text-[12px] uppercase mt-1">Maps</span>
          </a>
        </nav>
      )}

    </div>
  );
};
