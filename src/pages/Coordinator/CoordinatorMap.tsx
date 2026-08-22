import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
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

interface Shelter {
  id: number;
  pos: [number, number];
  name: string;
  capacity: string;
}

// Component to handle map clicks for adding shelters
const MapClickHandler = ({ isAdding, onLocationSelect }: { isAdding: boolean, onLocationSelect: (latlng: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      if (isAdding) {
        onLocationSelect([e.latlng.lat, e.latlng.lng]);
      }
    }
  });
  return null;
};

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

  // Shelter State
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [isAddingShelter, setIsAddingShelter] = useState(false);
  const [pendingShelterPos, setPendingShelterPos] = useState<[number, number] | null>(null);
  const [newShelterName, setNewShelterName] = useState('');
  const [newShelterCapacity, setNewShelterCapacity] = useState('');

  const handleMapClick = (latlng: [number, number]) => {
    setPendingShelterPos(latlng);
    setIsAddingShelter(false); // Turn off adding mode after picking location
  };

  const confirmAddShelter = () => {
    if (pendingShelterPos && newShelterName) {
      setShelters([...shelters, {
        id: Date.now(),
        pos: pendingShelterPos,
        name: newShelterName,
        capacity: newShelterCapacity || "TBD"
      }]);
      setPendingShelterPos(null);
      setNewShelterName('');
      setNewShelterCapacity('');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-margin-mobile gap-4 overflow-hidden relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-charcoal-text">Command Map</h2>
          <p className="font-body-md text-on-surface-variant">Live view of active incidents and responders in New Delhi sector.</p>
        </div>
        <button 
          onClick={() => setIsAddingShelter(!isAddingShelter)}
          className={`px-4 py-2 rounded-full font-label-sm uppercase tracking-wider flex items-center gap-2 transition-all ${
            isAddingShelter 
              ? 'bg-primary-container text-on-primary-container border-2 border-primary animate-pulse' 
              : 'bg-stone-bg border border-outline-variant/50 hover:bg-surface-variant text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isAddingShelter ? 'close' : 'add_location'}
          </span>
          {isAddingShelter ? 'Cancel' : 'Add Shelter'}
        </button>
      </div>

      {isAddingShelter && (
        <div className="bg-primary-container/20 border border-primary text-primary px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined">touch_app</span>
          <span className="font-medium text-sm">Click anywhere on the map to place a new emergency shelter.</span>
        </div>
      )}
      
      <div className={`flex-1 w-full bg-surface-container rounded-2xl border border-outline-variant/50 overflow-hidden relative shadow-sm min-h-[400px] ${isAddingShelter ? 'cursor-crosshair' : ''}`}>
        <div className="absolute inset-0 z-0">
          <MapContainer 
            center={centerPosition} 
            zoom={14} 
            zoomControl={true}
            style={{ width: '100%', height: '100%', cursor: isAddingShelter ? 'crosshair' : 'grab' }}
          >
            <MapClickHandler isAdding={isAddingShelter} onLocationSelect={handleMapClick} />
            
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

            {/* Render Shelters */}
            {shelters.map(shelter => (
              <Marker key={`shelter-${shelter.id}`} position={shelter.pos} icon={shelterIcon}>
                <Popup className="border-none rounded-xl overflow-hidden shadow-lg m-0">
                  <div className="p-1">
                    <h3 className="font-label-sm uppercase text-[#3b82f6] font-bold mb-1">{shelter.name}</h3>
                    <p className="text-xs text-on-surface-variant">Capacity: {shelter.capacity}</p>
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
            <span className="text-sm font-medium text-gray-700">{shelters.length} Shelters</span>
          </div>
        </div>
      </div>

      {/* Shelter Details Modal */}
      {pendingShelterPos && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-[slide-up_0.3s_ease-out]">
            <div className="bg-surface-container p-6 border-b border-outline-variant/30 flex justify-between items-center">
              <div>
                <h3 className="font-headline-sm text-charcoal-text m-0">Add Emergency Shelter</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Coords: {pendingShelterPos[0].toFixed(4)}, {pendingShelterPos[1].toFixed(4)}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#3b82f6]/10 rounded-full flex items-center justify-center text-[#3b82f6]">
                <span className="material-symbols-outlined text-[24px]">home</span>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Shelter Name</label>
                <input 
                  type="text" 
                  value={newShelterName}
                  onChange={e => setNewShelterName(e.target.value)}
                  placeholder="e.g. NDMC Relief Camp"
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Capacity / Resources</label>
                <input 
                  type="text" 
                  value={newShelterCapacity}
                  onChange={e => setNewShelterCapacity(e.target.value)}
                  placeholder="e.g. 500 beds, food available"
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
                />
              </div>
            </div>
            <div className="p-4 bg-surface-container-low flex justify-end gap-3 border-t border-outline-variant/30">
              <button 
                onClick={() => setPendingShelterPos(null)}
                className="px-6 py-2.5 rounded-full font-label-sm uppercase tracking-wider text-on-surface-variant hover:bg-surface-variant transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAddShelter}
                disabled={!newShelterName}
                className="px-6 py-2.5 rounded-full font-label-sm uppercase tracking-wider bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Deploy Shelter
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
