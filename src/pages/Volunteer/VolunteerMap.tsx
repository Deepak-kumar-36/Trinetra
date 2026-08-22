import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom icons matching the app's premium UI
const createPulseIcon = (color: string, borderColor: string) => L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="width: 32px; height: 32px; background-color: ${color}; border-radius: 50%; border: 4px solid ${borderColor}; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center; position: relative;">
           <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20]
});

// We use raw hex colors to avoid CSS variable parsing issues in Leaflet's HTML context
const volunteerIcon = createPulseIcon('#4CAF50', '#FFFFFF');
const incidentIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="width: 40px; height: 40px; background-color: #ef4444; border-radius: 50%; border: 4px solid #fecaca; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center;">
           <span class="material-symbols-outlined" style="color: white; font-size: 20px;">emergency</span>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

export const VolunteerMap: React.FC = () => {
  const navigate = useNavigate();
  const [showLocationDetails, setShowLocationDetails] = useState(false);

  // Using coordinates for New Delhi, India
  const volunteerPosition: [number, number] = [28.6139, 77.2090]; // Connaught Place area
  const incidentPosition: [number, number] = [28.6160, 77.2120];

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-[#e4e8e1]">
      
      {/* Real Interactive Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={volunteerPosition} 
          zoom={15} 
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Voyager basemap provides a clean, premium, light aesthetic */}
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
          
          <Marker position={volunteerPosition} icon={volunteerIcon}>
            <Popup className="custom-popup border-none rounded-xl overflow-hidden shadow-xl m-0">
              <div className="w-56 p-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-label-sm uppercase text-[#8B7355] font-bold tracking-wider m-0">Live Telemetry</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 uppercase font-bold text-[10px] tracking-wide">Latitude</span>
                    <span className="font-mono mt-0.5">{volunteerPosition[0]}° N</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 uppercase font-bold text-[10px] tracking-wide">Longitude</span>
                    <span className="font-mono mt-0.5">{Math.abs(volunteerPosition[1])}° W</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 uppercase font-bold text-[10px] tracking-wide">Accuracy</span>
                    <span className="font-mono text-[#4CAF50] font-bold mt-0.5">± 4.2m (GPS)</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 uppercase font-bold text-[10px] tracking-wide">Altitude</span>
                    <span className="font-mono mt-0.5">112m</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>

          <Marker position={incidentPosition} icon={incidentIcon} />
        </MapContainer>
      </div>

      {/* Top HUD */}
      <div className="absolute top-0 w-full z-20 p-margin-mobile flex justify-between items-start fade-in-up stagger-1 pointer-events-none">
        <button 
          onClick={() => navigate('/volunteer')}
          className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-[#4CAF50] active:scale-95 transition-transform pointer-events-auto"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-md flex flex-col items-center border border-gray-200">
          <span className="font-display-lg text-[#4CAF50] leading-none mb-1">12<span className="text-body-md text-gray-500">min</span></span>
          <span className="text-label-sm text-gray-500 tracking-wider">3.2 km</span>
        </div>
        
        <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-[#4CAF50] active:scale-95 transition-transform pointer-events-auto">
          <span className="material-symbols-outlined">layers</span>
        </button>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-0 w-full z-20 p-margin-mobile fade-in-up stagger-2 pointer-events-none">
        <div className="w-full max-w-[500px] mx-auto bg-white rounded-[2rem] p-6 shadow-[0_-8px_32px_rgba(140,115,85,0.15)] border border-gray-100 pointer-events-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-headline-lg-mobile text-[#4CAF50]">Head North</h2>
              <p className="font-body-md text-gray-500">on Riverside Ave</p>
            </div>
            <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#4CAF50] text-3xl">turn_right</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 h-14 bg-[#fee2e2] text-[#ef4444] rounded-xl font-label-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined">close</span> Cancel
            </button>
            <button className="flex-1 h-14 bg-[#4CAF50] text-white rounded-xl font-label-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md">
              <span className="material-symbols-outlined">check_circle</span> Arrived
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
