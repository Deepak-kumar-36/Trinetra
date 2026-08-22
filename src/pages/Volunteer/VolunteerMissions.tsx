import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type MissionStatus = 'dispatched' | 'en_route' | 'on_scene' | 'resolved';

export const VolunteerMissions: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<MissionStatus>('dispatched');

  const advanceStatus = () => {
    if (status === 'dispatched') setStatus('en_route');
    else if (status === 'en_route') setStatus('on_scene');
    else if (status === 'on_scene') setStatus('resolved');
  };

  const statusMap = {
    dispatched: { label: 'Dispatched', icon: 'assignment_late', color: 'text-error', bg: 'bg-error', desc: 'Awaiting departure' },
    en_route: { label: 'En Route', icon: 'directions_car', color: 'text-primary', bg: 'bg-primary', desc: 'Heading to location' },
    on_scene: { label: 'On Scene', icon: 'front_hand', color: 'text-earth-accent', bg: 'bg-earth-accent', desc: 'Providing assistance' },
    resolved: { label: 'Resolved', icon: 'check_circle', color: 'text-sage-primary', bg: 'bg-sage-primary', desc: 'Mission complete' },
  };

  const current = statusMap[status];

  return (
    <div className="font-body-md antialiased min-h-screen flex flex-col p-margin-mobile pt-6 gap-6 relative pb-32">
      <div className="flex justify-between items-center">
        <h2 className="font-display-lg text-3xl text-on-surface drop-shadow-sm">Active Tracker</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white ${current.bg} shadow-md flex items-center gap-1`}>
          <span className="material-symbols-outlined text-[14px]">{current.icon}</span> {current.label}
        </span>
      </div>

      {/* Current Mission Details */}
      <div className="bg-surface-container-lowest border-2 border-primary/20 rounded-2xl p-6 shadow-sm">
        <h3 className="font-headline-sm text-primary mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined">emergency</span> Flood Rescue: Rahul Gupta
        </h3>
        <p className="text-on-surface-variant mb-4 font-medium italic border-l-4 border-earth-accent pl-3">
          "Water entering ground floor. 3 people trapped including a child."
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex flex-col bg-surface p-3 rounded-xl border border-surface-variant">
            <span className="text-on-surface-variant text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> Location</span>
            <span className="font-bold text-on-surface">Sector 4, Plot 12 (2.5km)</span>
          </div>
          <div className="flex flex-col bg-surface p-3 rounded-xl border border-surface-variant">
            <span className="text-on-surface-variant text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> ETA</span>
            <span className="font-bold text-error">~12 minutes</span>
          </div>
        </div>

        {/* Dynamic Progress Timeline */}
        <div className="relative pt-2 pb-6 px-4">
          <div className="absolute top-4 left-6 right-6 h-1 bg-surface-variant rounded-full"></div>
          <div className={`absolute top-4 left-6 h-1 rounded-full transition-all duration-700 ${current.bg}`} style={{ width: status === 'dispatched' ? '0%' : status === 'en_route' ? '33%' : status === 'on_scene' ? '66%' : '100%' }}></div>
          
          <div className="flex justify-between relative z-10">
            <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center bg-stone-bg transition-colors ${status === 'dispatched' ? 'border-error' : 'border-sage-primary bg-sage-primary text-white'}`}></div>
            <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center bg-stone-bg transition-colors ${status === 'dispatched' ? 'border-surface-variant' : status === 'en_route' ? 'border-primary' : 'border-sage-primary bg-sage-primary text-white'}`}></div>
            <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center bg-stone-bg transition-colors ${status === 'on_scene' ? 'border-earth-accent' : status === 'resolved' ? 'border-sage-primary bg-sage-primary text-white' : 'border-surface-variant'}`}></div>
            <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center bg-stone-bg transition-colors ${status === 'resolved' ? 'border-sage-primary bg-sage-primary' : 'border-surface-variant'}`}>
               {status === 'resolved' && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1">
            <span className={status === 'dispatched' ? 'text-error' : 'text-sage-primary'}>Alert</span>
            <span className={status === 'en_route' ? 'text-primary' : status === 'dispatched' ? '' : 'text-sage-primary'}>En Route</span>
            <span className={status === 'on_scene' ? 'text-earth-accent' : status === 'resolved' ? 'text-sage-primary' : ''}>On Scene</span>
            <span className={status === 'resolved' ? 'text-sage-primary' : ''}>Done</span>
          </div>
        </div>

        {/* Action Button */}
        {status !== 'resolved' ? (
          <button 
            onClick={advanceStatus}
            className={`w-full py-4 rounded-xl text-white font-bold tracking-wide uppercase transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 ${status === 'dispatched' ? 'bg-primary hover:bg-primary-fixed' : status === 'en_route' ? 'bg-earth-accent hover:bg-earth-accent/80' : 'bg-sage-primary hover:bg-primary'}`}
          >
            <span className="material-symbols-outlined">update</span>
            {status === 'dispatched' ? 'Confirm En Route' : status === 'en_route' ? 'Report On Scene' : 'Mark as Resolved'}
          </button>
        ) : (
          <button 
            onClick={() => navigate('/volunteer')}
            className="w-full py-4 rounded-xl bg-surface-container-highest text-on-surface font-bold tracking-wide uppercase hover:bg-surface-variant transition-colors active:scale-95"
          >
            Return to Dashboard
          </button>
        )}
      </div>
      
      {/* Comms Panel */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-variant">
        <h3 className="font-headline-sm text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">forum</span> Direct Comms
        </h3>
        <div className="bg-surface p-4 rounded-xl text-center text-on-surface-variant text-sm border border-outline-variant/30 italic">
          No active communication. You can reach out to the citizen once En Route.
        </div>
      </div>
    </div>
  );
};
