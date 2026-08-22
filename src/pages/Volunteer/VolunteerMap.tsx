import React from 'react';
import { useNavigate } from 'react-router-dom';

export const VolunteerMap: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-[#e4e8e1]">
      {/* Map Background Simulation */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[#e4e8e1] opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDB2NDAiIHN0cm9rZT0iI2QzZDhkMiIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIuNSIvPjwvc3ZnPg==')]"></div>
        {/* Route Line Simulation */}
        <div className="absolute top-1/2 left-1/4 w-1/2 h-1/2 border-l-4 border-t-4 border-sage-primary rounded-tl-3xl opacity-80 z-10"></div>
        {/* Volunteer Marker */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center z-20">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
        </div>
        {/* Incident Marker */}
        <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-error rounded-full border-4 border-error-container shadow-lg flex items-center justify-center z-20">
          <span className="material-symbols-outlined text-white text-sm">emergency</span>
        </div>
      </div>

      {/* Top HUD */}
      <div className="absolute top-0 w-full z-20 p-margin-mobile flex justify-between items-start fade-in-up stagger-1">
        <button 
          onClick={() => navigate('/volunteer')}
          className="w-12 h-12 bg-surface/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-primary active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <div className="bg-surface/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-md flex flex-col items-center border border-outline-variant/20">
          <span className="font-display-lg text-primary leading-none mb-1">12<span className="text-body-md text-on-surface-variant">min</span></span>
          <span className="text-label-sm text-on-surface-variant tracking-wider">3.2 km</span>
        </div>
        
        <button className="w-12 h-12 bg-surface/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-primary active:scale-95 transition-transform">
          <span className="material-symbols-outlined">layers</span>
        </button>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-0 w-full z-20 p-margin-mobile fade-in-up stagger-2">
        <div className="w-full max-w-[500px] mx-auto bg-surface-container-lowest rounded-[2rem] p-6 shadow-[0_-8px_32px_rgba(140,115,85,0.15)] border border-surface-variant">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-headline-lg-mobile text-primary">Head North</h2>
              <p className="font-body-md text-on-surface-variant">on Riverside Ave</p>
            </div>
            <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">turn_right</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 h-14 bg-error-container text-on-error-container rounded-xl font-label-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined">close</span> Cancel
            </button>
            <button className="flex-1 h-14 bg-sage-primary text-white rounded-xl font-label-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md">
              <span className="material-symbols-outlined">check_circle</span> Arrived
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
