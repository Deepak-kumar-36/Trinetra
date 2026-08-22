import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SOSMessage {
  id: string;
  name: string;
  type: string;
  message: string;
  time: string;
  distance: string;
  urgency: 'high' | 'critical' | 'medium';
}

const INITIAL_MESSAGES: SOSMessage[] = [
  { id: '1', name: 'Priya Sharma', type: 'Medical', message: 'Elderly person having severe asthma attack. Need oxygen immediately.', time: 'Just now', distance: '1.2 km away', urgency: 'critical' },
  { id: '2', name: 'Rahul Gupta', type: 'Flood', message: 'Water entering ground floor. 3 people trapped including a child.', time: '2 min ago', distance: '2.5 km away', urgency: 'high' },
];

export const VolunteerHome: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<SOSMessage[]>(INITIAL_MESSAGES);
  
  // Simulate incoming messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => [
        {
          id: Date.now().toString(),
          name: 'Anonymous',
          type: 'Security',
          message: 'Looting reported in sector 4 marketplace. Need immediate intervention.',
          time: 'Just now',
          distance: '0.8 km away',
          urgency: 'high'
        },
        ...prev
      ]);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-body-md antialiased min-h-screen flex flex-col mesh-bg relative pb-32">
      {/* Background Mesh styling */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(at_10%_20%,_hsla(28,100%,74%,0.1)_0px,_transparent_50%),radial-gradient(at_80%_90%,_hsla(116,36%,66%,0.1)_0px,_transparent_50%),radial-gradient(at_90%_10%,_hsla(140,24%,38%,0.05)_0px,_transparent_50%)] pointer-events-none"></div>

      <main className="flex-grow flex justify-center w-full z-10">
        <div className="w-full max-w-[1040px] px-margin-mobile md:px-0 py-section-gap flex flex-col gap-section-gap">
          {/* Page Title Area */}
          <div className="flex flex-col gap-4 fade-in-up stagger-1">
            <h2 className="font-display-lg text-display-lg text-primary drop-shadow-sm">Incoming Mission</h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            
            <div className="md:col-span-7 flex flex-col gap-gutter">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-variant h-full flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-surface-variant pb-4">
                  <h3 className="font-headline-lg text-headline-lg text-error flex items-center gap-2">
                    <span className="material-symbols-outlined animate-pulse">sensors</span>
                    Live SOS Feed
                  </h3>
                  <span className="bg-error/10 text-error px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">Live</span>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 flex flex-col">
                  {messages.map((msg, index) => (
                    <div key={msg.id} className={`p-4 rounded-xl border-l-4 bg-surface shadow-sm transition-all duration-500 animate-slide-in-left ${msg.urgency === 'critical' ? 'border-error' : msg.urgency === 'high' ? 'border-primary' : 'border-earth-accent'}`} style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">{msg.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-sm ${msg.urgency === 'critical' ? 'bg-error/10 text-error' : msg.urgency === 'high' ? 'bg-primary/10 text-primary' : 'bg-earth-accent/10 text-earth-accent'}`}>{msg.type}</span>
                        </div>
                        <span className="text-xs text-on-surface-variant font-medium">{msg.time}</span>
                      </div>
                      <p className="text-on-surface-variant text-sm mb-3">"{msg.message}"</p>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-surface-variant/50">
                        <span className="text-xs text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span> {msg.distance}
                        </span>
                        <button onClick={() => navigate('/volunteer/missions')} className="text-primary hover:text-primary-fixed text-sm font-bold flex items-center gap-1 active:scale-95 transition-transform">
                          Respond <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Responder Matching Panel (Volunteer View) */}
            <div className="md:col-span-5 flex flex-col gap-gutter">
              <div className="bg-surface-container/80 backdrop-blur-sm rounded-2xl p-8 shadow-inner border border-outline-variant/30 h-full relative overflow-hidden fade-in-up stagger-4">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-8">
                    <span className="material-symbols-outlined text-primary text-3xl">hub</span>
                    <h3 className="font-headline-lg text-headline-lg text-primary">Your Match</h3>
                  </div>

                  <div className="bg-surface-container-lowest shadow-[0_20px_50px_-12px_rgba(74,93,78,0.25)] border border-sage-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-sage-primary to-primary"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-5 mt-2">
                        <div className="pt-1 pr-4">
                          <h4 className="font-bold text-xl text-primary">Action Required</h4>
                          <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1 font-semibold">
                            <span className="material-symbols-outlined text-[16px] text-earth-accent">schedule</span> ETA to scene: 12 min
                          </p>
                        </div>
                        <div className="bg-sage-primary text-white px-3 py-1.5 rounded-full font-label-sm flex items-center gap-1 shrink-0 shadow-md">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span> Perfect Match
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-5">
                        <span className="bg-surface text-primary px-3 py-1.5 rounded-md text-sm border border-surface-variant flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[14px] text-sage-primary">directions_boat</span> You have a boat
                        </span>
                        <span className="bg-surface text-primary px-3 py-1.5 rounded-md text-sm border border-surface-variant flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[14px] text-error">medical_services</span> You are first-aid trained
                        </span>
                      </div>

                      <button 
                        onClick={() => navigate('/volunteer/map')}
                        className="mt-8 w-full h-[60px] bg-sage-primary text-white rounded-xl font-bold hover:bg-primary transition-all active:scale-95 shadow-[0_4px_0_0_#1d2f22,0_8px_20px_-4px_rgba(29,47,34,0.4)] flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">navigation</span> Accept & Navigate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
