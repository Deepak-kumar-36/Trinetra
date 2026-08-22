import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { supabase } from '../../lib/supabase';
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

// Component to dynamically fly the map to search results
const MapFlyTo = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 15);
    }
  }, [center, map]);
  return null;
};

export const CoordinatorMap: React.FC = () => {
  // Command Center centered on New Delhi, India
  const centerPosition: [number, number] = [28.6139, 77.2090];
  
  // Initial dummy data for the coordinator view
  const initialIncidents = [
    { id: 1, pos: [28.6160, 77.2120] as [number, number], title: "Building Collapse", severity: "High" },
    { id: 2, pos: [28.6110, 77.2050] as [number, number], title: "Medical Emergency", severity: "Medium" },
    { id: 3, pos: [28.6180, 77.2010] as [number, number], title: "Fire", severity: "Critical" },
  ];
  
  const [incidents, setIncidents] = useState<any[]>(initialIncidents);

  React.useEffect(() => {
    const loadIncidents = () => {
      const stored = localStorage.getItem('trinetra_live_incidents');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setIncidents([...initialIncidents, ...parsed]);
        } catch(e) {}
      }
    };
    
    // Initial load
    loadIncidents();
    
    // 1. Supabase Realtime Subscription (Cross-device)
    const channel = supabase.channel('sos-alerts');
    channel.on('broadcast', { event: 'new-voice-sos' }, (payload) => {
      console.log('Coordinator Map received Supabase SOS:', payload.payload);
      setIncidents((prev) => {
        // Prevent duplicates
        if (prev.some(inc => inc.id === payload.payload.id)) return prev;
        return [...prev, payload.payload];
      });
    }).subscribe();

    // 2. LocalStorage Polling (Local tab fallback)
    window.addEventListener('storage', loadIncidents);
    const interval = setInterval(loadIncidents, 3000);
    
    return () => {
      window.removeEventListener('storage', loadIncidents);
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);
  
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

  // Geocoding Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [flyToPos, setFlyToPos] = useState<[number, number] | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data || []);
    } catch (e) {
      console.error("Geocoding error:", e);
    }
    setIsSearching(false);
  };

  const handleSelectSearchResult = (lat: string, lon: string, displayName: string) => {
    const pos: [number, number] = [parseFloat(lat), parseFloat(lon)];
    setFlyToPos(pos);
    setPendingShelterPos(pos); // Pre-fill the modal position
    setNewShelterName(displayName.split(',')[0]); // Suggest a name from the location
    setSearchResults([]);
    setSearchQuery('');
    setIsAddingShelter(false);
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 z-[2000]">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-charcoal-text">Command Map</h2>
          <p className="font-body-md text-on-surface-variant">Live view of active incidents and responders in New Delhi sector.</p>
        </div>
        
        <div className="flex flex-col items-end gap-2 relative w-full md:w-auto">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <div className="relative w-full sm:w-auto flex-1">
              <input 
                type="text" 
                placeholder="Search to add shelter..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-outline-variant/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white shadow-sm transition-all text-on-surface"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">search</span>
              {isSearching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              )}
            </div>
            <button 
              onClick={() => {
                setSearchResults([]);
                setIsAddingShelter(!isAddingShelter);
              }}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full font-label-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${
                isAddingShelter 
                  ? 'bg-primary-container text-on-primary-container border-2 border-primary animate-pulse' 
                  : 'bg-stone-bg border border-outline-variant/50 hover:bg-surface-variant text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isAddingShelter ? 'close' : 'add_location'}
              </span>
              {isAddingShelter ? 'Cancel' : 'Pick on Map'}
            </button>
          </div>

          {/* Dropdown for search results */}
          {searchResults.length > 0 && (
            <div className="absolute top-[110%] right-0 mt-2 w-full max-w-sm bg-white rounded-xl shadow-2xl border border-outline-variant/30 z-[5000] overflow-hidden max-h-60 overflow-y-auto animate-[slide-down_0.2s_ease-out]">
              <div className="p-2 bg-surface-container-lowest border-b border-outline-variant/10 flex justify-between items-center sticky top-0">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-2">Select Location</span>
                <button onClick={() => setSearchResults([])} className="text-on-surface-variant hover:text-error p-1">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              {searchResults.map((result: any, idx) => (
                <div 
                  key={idx} 
                  className="p-3 border-b border-outline-variant/10 hover:bg-primary-container/20 cursor-pointer flex flex-col transition-colors"
                  onClick={() => handleSelectSearchResult(result.lat, result.lon, result.display_name)}
                >
                  <span className="text-sm font-bold text-charcoal-text truncate flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">place</span>
                    {result.display_name.split(',')[0]}
                  </span>
                  <span className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5 ml-6">{result.display_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAddingShelter && (
        <div className="bg-primary-container/20 border border-primary text-primary px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in z-[1000] shadow-sm">
          <span className="material-symbols-outlined">touch_app</span>
          <span className="font-medium text-sm">Click anywhere on the map to manually place a new emergency shelter.</span>
        </div>
      )}
      
      <div className={`flex-1 w-full bg-surface-container rounded-2xl border border-outline-variant/50 overflow-hidden relative shadow-sm min-h-[400px] z-0 ${isAddingShelter ? 'cursor-crosshair ring-2 ring-primary' : ''}`}>
        <div className="absolute inset-0 z-0">
          <MapContainer 
            center={centerPosition} 
            zoom={14} 
            zoomControl={true}
            style={{ width: '100%', height: '100%', cursor: isAddingShelter ? 'crosshair' : 'grab' }}
          >
            <MapClickHandler isAdding={isAddingShelter} onLocationSelect={handleMapClick} />
            <MapFlyTo center={flyToPos} />
            
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          
            {/* Render Incidents */}
            {incidents.map(inc => (
              <Marker key={`inc-${inc.id}`} position={inc.pos} icon={incidentIcon}>
                <Popup className="border-none rounded-xl overflow-hidden shadow-lg m-0">
                  <div className="p-1">
                    <h3 className="font-label-sm uppercase text-error font-bold mb-1">
                      {inc.trigger_detail === 'shout_detected' ? 'Voice SOS — Shout Detected' : inc.title}
                    </h3>
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
            <span className="text-sm font-medium text-gray-700">{incidents.length} Active Incidents</span>
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
                  autoFocus
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
