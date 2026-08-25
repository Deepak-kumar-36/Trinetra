import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { supabase } from '../../core/lib/supabase';

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; 
  var dLat = (lat2-lat1) * (Math.PI/180);
  var dLon = (lon2-lon1) * (Math.PI/180); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export function VolunteerMapScreen({ route, navigation }: any) {
  const { mission, incident } = route.params || {};
  
  const [volunteerPosition, setVolunteerPosition] = useState<any>({ latitude: 28.6139, longitude: 77.2090 });
  const [incidentPosition, setIncidentPosition] = useState<any>({ latitude: 28.6160, longitude: 77.2120 });
  const [distance, setDistance] = useState<number>(0);
  const [eta, setEta] = useState<number>(0);

  useEffect(() => {
    if (incident?.location) {
       const match = incident.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
       if (match) setIncidentPosition({ longitude: parseFloat(match[1]), latitude: parseFloat(match[2]) });
    }
    startTracking();
  }, [incident]);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    
    let loc = await Location.getCurrentPositionAsync({});
    updatePosition(loc);

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 5 },
      (newLoc) => updatePosition(newLoc)
    );
  };

  const updatePosition = (loc: Location.LocationObject) => {
    const newPos = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    setVolunteerPosition(newPos);
    
    setIncidentPosition((incPos: any) => {
      if (incPos) {
        const dist = getDistanceFromLatLonInKm(newPos.latitude, newPos.longitude, incPos.latitude, incPos.longitude);
        setDistance(dist);
        setEta(Math.ceil(dist / 0.5)); // 1 min per 500m roughly
      }
      return incPos;
    });
  };

  const handleArrived = async () => {
    if (mission) {
      await supabase.from('missions').update({ status: 'arrived' }).eq('id', mission.id);
      await supabase.from('incidents').update({ status: 'resolved' }).eq('id', incident.id);
      await supabase.from('responders').update({ current_mission_id: null }).eq('id', mission.responder_id);
    }
    navigation.goBack();
  };

  const handleCancel = async () => {
    if (mission) {
      await supabase.from('missions').update({ status: 'cancelled' }).eq('id', mission.id);
      await supabase.from('incidents').update({ status: 'reported' }).eq('id', incident.id);
      await supabase.from('responders').update({ current_mission_id: null }).eq('id', mission.responder_id);
    }
    navigation.goBack();
  };

  const generateMapHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
              body { padding: 0; margin: 0; }
              html, body, #map { height: 100%; width: 100vw; }
          </style>
      </head>
      <body>
          <div id="map"></div>
          <script>
              var map = L.map('map');
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '© OpenStreetMap'
              }).addTo(map);
              
              var volIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#4CAF50;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 5px rgba(0,0,0,0.5);'></div>",
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              });

              var incIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#ef4444;width:20px;height:20px;border-radius:50%;border:3px solid #fecaca;box-shadow:0 0 5px rgba(0,0,0,0.5);'></div>",
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              });

              var volMarker = L.marker([${volunteerPosition.latitude}, ${volunteerPosition.longitude}], {icon: volIcon}).addTo(map).bindPopup("<b>You</b>");
              var incMarker = L.marker([${incidentPosition.latitude}, ${incidentPosition.longitude}], {icon: incIcon}).addTo(map).bindPopup("<b>Incident Location</b>");
              
              var group = new L.featureGroup([volMarker, incMarker]);
              map.fitBounds(group.getBounds(), {padding: [80, 80]});

              // Draw a line
              var latlngs = [
                  [${volunteerPosition.latitude}, ${volunteerPosition.longitude}],
                  [${incidentPosition.latitude}, ${incidentPosition.longitude}]
              ];
              var polyline = L.polyline(latlngs, {color: '#4CAF50', dashArray: '5, 5', weight: 4}).addTo(map);
          </script>
      </body>
      </html>
    `;
  };

  return (
    <View className="flex-1 bg-[#e4e8e1]">
      
      {/* Real Interactive Map */}
      <WebView
        originWhitelist={['*']}
        source={{ html: generateMapHTML() }}
        style={StyleSheet.absoluteFill}
        scrollEnabled={false}
      />

      {/* Top HUD */}
      <SafeAreaView className="absolute top-0 w-full z-20 px-6 pt-4 flex-row justify-between items-start" pointerEvents="box-none">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-12 h-12 bg-white/90 rounded-full shadow-md flex items-center justify-center"
        >
          <MaterialIcons name="arrow-back" size={24} color="#4CAF50" />
        </TouchableOpacity>
        
        <View className="bg-white/90 rounded-2xl px-6 py-3 shadow-md flex-col items-center border border-gray-200">
          <View className="flex-row items-baseline">
            <Text className="text-4xl font-bold text-[#4CAF50] leading-none">{eta}</Text>
            <Text className="text-base text-gray-500 font-bold">min</Text>
          </View>
          <Text className="text-xs text-gray-500 tracking-wider font-bold uppercase mt-1">{distance.toFixed(1)} km</Text>
        </View>
        
        <TouchableOpacity className="w-12 h-12 bg-white/90 rounded-full shadow-md flex items-center justify-center">
          <MaterialIcons name="layers" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom HUD */}
      <SafeAreaView className="absolute bottom-0 w-full z-20 px-6 pb-6" pointerEvents="box-none">
        <View className="w-full bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-[#4CAF50]">Head North</Text>
              <Text className="text-base text-gray-500 mt-1">on Riverside Ave</Text>
            </View>
            <View className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center">
              <MaterialIcons name="turn-right" size={32} color="#4CAF50" />
            </View>
          </View>
          
          <View className="flex-row gap-4">
            <TouchableOpacity 
              className="flex-1 h-14 bg-[#fee2e2] rounded-xl flex-row items-center justify-center gap-2"
              activeOpacity={0.7}
              onPress={handleCancel}
            >
              <MaterialIcons name="close" size={20} color="#ef4444" />
              <Text className="text-[#ef4444] font-bold text-xs uppercase tracking-wider">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 h-14 bg-[#4CAF50] rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
              activeOpacity={0.7}
              onPress={handleArrived}
            >
              <MaterialIcons name="check-circle" size={20} color="white" />
              <Text className="text-white font-bold text-xs uppercase tracking-wider">Arrived</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>

    </View>
  );
}
