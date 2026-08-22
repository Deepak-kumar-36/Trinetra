import React from 'react';
import { useNavigate } from 'react-router-dom';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-bg flex flex-col items-center justify-center p-margin-mobile relative overflow-hidden">
      {/* Abstract Background Shapes for TriNetra Aesthetics */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tri-saffron opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tri-green opacity-5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

      <div className="w-full max-w-md z-10 flex flex-col items-center animate-fade-in">
        
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-md overflow-hidden bg-surface p-1 pulse-border">
            <img src="/logo.png" alt="triNETRA Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h1 className="font-headline-lg text-on-surface mb-2 tracking-tight">Select Protocol</h1>
          <p className="font-body-md text-on-surface-variant">Identify your role to access the correct operational dashboard.</p>
        </div>

        {/* Options */}
        <div className="w-full space-y-4">
          <button 
            onClick={() => navigate('/citizen')}
            className="w-full flex items-center gap-5 p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm hover:shadow-md hover:border-primary transition-all active:scale-[0.98] group text-left fade-in-up stagger-1"
          >
            <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">person_alert</span>
            </div>
            <div className="flex-1">
              <h2 className="font-label-sm text-on-surface uppercase tracking-wider mb-1">Citizen</h2>
              <p className="text-sm text-on-surface-variant">Report emergencies, seek help, and view safe zones.</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
          </button>

          <button 
            onClick={() => navigate('/volunteer')}
            className="w-full flex items-center gap-5 p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm hover:shadow-md hover:border-primary transition-all active:scale-[0.98] group text-left fade-in-up stagger-2"
          >
            <div className="w-12 h-12 bg-primary-fixed text-on-primary-fixed-variant rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">handshake</span>
            </div>
            <div className="flex-1">
              <h2 className="font-label-sm text-on-surface uppercase tracking-wider mb-1">Volunteer</h2>
              <p className="text-sm text-on-surface-variant">Receive dispatch alerts and respond to local incidents.</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
          </button>

          <button 
            onClick={() => navigate('/coordinator')}
            className="w-full flex items-center gap-5 p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm hover:shadow-md hover:border-error transition-all active:scale-[0.98] group text-left fade-in-up stagger-3"
          >
            <div className="w-12 h-12 bg-error-container text-on-error-container rounded-xl flex items-center justify-center group-hover:bg-error group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <div className="flex-1">
              <h2 className="font-label-sm text-on-surface uppercase tracking-wider mb-1">Coordinator</h2>
              <p className="text-sm text-on-surface-variant">Command center for triaging and managing responders.</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-error transition-colors">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
