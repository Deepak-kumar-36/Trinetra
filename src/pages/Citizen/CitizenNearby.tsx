import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to dynamically update the map center when position changes
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Create custom icons matching the app's premium UI
const createPulseIcon = (color: string, borderColor: string) => L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="width: 24px; height: 24px; background-color: ${color}; border-radius: 50%; border: 3px solid ${borderColor}; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center; position: relative;">
           <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

// Citizen location (pulsing green)
const citizenIcon = createPulseIcon('#4CAF50', '#FFFFFF');

// Shelter Icon (blue)
const shelterIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="width: 32px; height: 32px; background-color: #3b82f6; border-radius: 50%; border: 3px solid #bfdbfe; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center;">
           <span class="material-symbols-outlined" style="color: white; font-size: 16px;">home</span>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Supplies Icon (orange)
const suppliesIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="width: 32px; height: 32px; background-color: #f59e0b; border-radius: 50%; border: 3px solid #fde68a; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center;">
           <span class="material-symbols-outlined" style="color: white; font-size: 16px;">local_shipping</span>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

export const CitizenNearby: React.FC = () => {
  // Default to New Delhi if GPS is not available/granted
  const [citizenPosition, setCitizenPosition] = useState<[number, number]>([28.6139, 77.2090]);
  const [isLocating, setIsLocating] = useState(true);
  const [gpsError, setGpsError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCitizenPosition([position.coords.latitude, position.coords.longitude]);
          setIsLocating(false);
        },
        (error) => {
          console.warn("GPS Error:", error.message);
          setGpsError(error.message);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsError("Geolocation not supported by this browser.");
      setIsLocating(false);
    }
  }, []);
  
  // Dummy data for shelters and supplies (hardcoded near default New Delhi area for demo purposes)
  const shelters = [
    { id: 1, pos: [28.6180, 77.2030] as [number, number], name: "NDMC Relief Camp", capacity: "350 / 500", status: "Open" },
    { id: 2, pos: [28.6080, 77.2150] as [number, number], name: "Govt School Shelter", capacity: "120 / 200", status: "Filling Fast" },
  ];
  
  const supplies = [
    { id: 1, pos: [28.6150, 77.2150] as [number, number], name: "Red Cross Drop Point", items: "Food, Water, Meds" },
    { id: 2, pos: [28.6100, 77.2000] as [number, number], name: "Community Kitchen", items: "Hot Meals" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      
      {/* HUD Header Overlay */}
      <div className="absolute top-0 w-full z-[1000] p-margin-mobile fade-in-up stagger-1 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-md border border-gray-100 flex flex-col gap-1 pointer-events-auto">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-headline-lg-mobile text-charcoal-text m-0">Nearby Resources</h2>
              <p className="text-xs text-gray-500 m-0">Locate safe shelters and emergency supplies.</p>
            </div>
            
            {/* GPS Status Indicator */}
            {isLocating ? (
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Locating...</span>
              </div>
            ) : gpsError ? (
              <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full border border-orange-100">
                <span className="material-symbols-outlined text-[14px]">location_disabled</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">GPS Off</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-100">
                <span className="material-symbols-outlined text-[14px]">my_location</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
              <span className="text-xs font-medium text-gray-600">Shelters</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
              <span className="text-xs font-medium text-gray-600">Supplies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full bg-surface-container relative z-0">
        <div className="absolute inset-0 z-0">
          <MapContainer 
            center={citizenPosition} 
            zoom={14} 
            zoomControl={false}
            style={{ width: '100%', height: '100%' }}
          >
            <MapUpdater center={citizenPosition} />
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
            
            {/* Citizen Marker */}
            <Marker position={citizenPosition} icon={citizenIcon}>
              <Popup className="border-none rounded-xl overflow-hidden shadow-lg m-0">
                <div className="p-2">
                  <h3 className="font-label-sm uppercase text-[#4CAF50] font-bold mb-1">Your Location</h3>
                  <p className="text-xs text-gray-500 m-0">Live GPS Coordinates</p>
                </div>
              </Popup>
            </Marker>

            {/* Shelter Markers */}
            {shelters.map(shelter => (
              <Marker key={`shelter-${shelter.id}`} position={shelter.pos} icon={shelterIcon}>
                <Popup className="border-none rounded-xl overflow-hidden shadow-lg m-0">
                  <div className="p-2">
                    <h3 className="font-label-sm uppercase text-[#3b82f6] font-bold mb-1">{shelter.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">Capacity: <span className="font-medium text-gray-900">{shelter.capacity}</span></p>
                    <p className="text-xs text-gray-500 m-0">Status: <span className={shelter.status === 'Open' ? 'text-green-600' : 'text-orange-500'}>{shelter.status}</span></p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Supply Markers */}
            {supplies.map(supply => (
              <Marker key={`supply-${supply.id}`} position={supply.pos} icon={suppliesIcon}>
                <Popup className="border-none rounded-xl overflow-hidden shadow-lg m-0">
                  <div className="p-2">
                    <h3 className="font-label-sm uppercase text-[#f59e0b] font-bold mb-1">{supply.name}</h3>
                    <p className="text-xs text-gray-600 m-0">Items: <span className="font-medium text-gray-900">{supply.items}</span></p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      
    </div>
  );
};
