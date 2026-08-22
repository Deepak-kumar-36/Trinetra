import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom icons
const createPulseIcon = (color: string, borderColor: string) => L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="width: 24px; height: 24px; background-color: ${color}; border-radius: 50%; border: 3px solid ${borderColor}; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center; position: relative;">
           <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const volunteerIcon = createPulseIcon('#4CAF50', '#FFFFFF');
const incidentIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="width: 32px; height: 32px; background-color: #ef4444; border-radius: 50%; border: 3px solid #fecaca; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center;">
           <span class="material-symbols-outlined" style="color: white; font-size: 16px;">emergency</span>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

export const CoordinatorMap: React.FC = () => {
  // Command Center centered on New Delhi, India
  const centerPosition: [number, number] = [28.6139, 77.2090];
  
  // Dummy data for the coordinator view
  const incidents = [
    { id: 1, pos: [28.6160, 77.2120] as [number, number], title: "Building Collapse", severity: "High" },
    { id: 2, pos: [28.6110, 77.2050] as [number, number], title: "Medical Emergency", severity: "Medium" },
    { id: 3, pos: [28.6180, 77.2010] as [number, number], title: "Fire", severity: "Critical" },
  ];
  
  const volunteers = [
    { id: 1, pos: [28.6149, 77.2100] as [number, number], name: "Vol-A42", status: "In Transit" },
    { id: 2, pos: [28.6120, 77.2070] as [number, number], name: "Vol-B19", status: "On Scene" },
    { id: 3, pos: [28.6150, 77.2030] as [number, number], name: "Vol-C88", status: "Available" },
  ];

  return (
    <div className="flex-1 flex flex-col p-margin-mobile gap-4 overflow-hidden relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-charcoal-text">Command Map</h2>
          <p className="font-body-md text-on-surface-variant">Live view of active incidents and responders in New Delhi sector.</p>
        </div>
      </div>
      
      <div className="flex-1 w-full bg-surface-container rounded-2xl border border-outline-variant/50 overflow-hidden relative shadow-sm min-h-[400px]">
        <div className="absolute inset-0 z-0">
          <MapContainer 
            center={centerPosition} 
            zoom={14} 
            zoomControl={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          
          {/* Render Incidents */}
          {incidents.map(inc => (
            <Marker key={`inc-${inc.id}`} position={inc.pos} icon={incidentIcon}>
              <Popup className="border-none rounded-xl overflow-hidden shadow-lg m-0">
                <div className="p-1">
                  <h3 className="font-label-sm uppercase text-error font-bold mb-1">{inc.title}</h3>
                  <p className="text-xs text-on-surface-variant">Severity: <span className="text-error">{inc.severity}</span></p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Volunteers */}
          {volunteers.map(vol => (
            <Marker key={`vol-${vol.id}`} position={vol.pos} icon={volunteerIcon}>
              <Popup className="border-none rounded-xl overflow-hidden shadow-lg m-0">
                <div className="p-1">
                  <h3 className="font-label-sm uppercase text-[#4CAF50] font-bold mb-1">{vol.name}</h3>
                  <p className="text-xs text-on-surface-variant">Status: {vol.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        </div>
        {/* Command Map Overlay HUD */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-gray-100 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
            <span className="text-sm font-medium text-gray-700">3 Active Incidents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
            <span className="text-sm font-medium text-gray-700">3 Field Volunteers</span>
          </div>
        </div>
