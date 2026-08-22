import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const CoordinatorMap: React.FC = () => {
  // Default coordinates (e.g., New Delhi)
  const position: [number, number] = [28.6139, 77.2090]; 

  return (
    <div className="p-margin-mobile pt-6 flex flex-col h-full min-h-[500px]">
      <h2 className="font-headline-lg text-on-surface mb-4">Command Map</h2>
      <div className="flex-1 rounded-2xl overflow-hidden border border-outline-variant/30 shadow-md relative z-0">
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[28.6139, 77.2090]}>
            <Popup>
              <strong>Command Center (HQ)</strong>
            </Popup>
          </Marker>
          <Marker position={[28.6239, 77.2190]}>
            <Popup>
              <strong className="text-error">Fire Reported</strong><br/>
              Sector 4
            </Popup>
          </Marker>
          <Marker position={[28.6039, 77.1990]}>
            <Popup>
              <strong className="text-primary">Medical Emergency</strong><br/>
              Route 42
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};
