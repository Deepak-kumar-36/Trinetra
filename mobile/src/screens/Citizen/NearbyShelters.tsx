import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../core/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

export function NearbySheltersScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [shelters, setShelters] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location is required to find nearby shelters.');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      fetchShelters();
    })();
  }, []);

  const fetchShelters = async () => {
    try {
      // In a real app, use PostGIS ST_DWithin to find nearby.
      // For MVP, just fetch all open shelters and render them.
      const { data, error } = await supabase
        .from('shelters')
        .select('*')
        .eq('status', 'open');
      
      if (error) throw error;
      setShelters(data || []);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateMapHTML = () => {
    const lat = location?.coords.latitude || 28.6139;
    const lng = location?.coords.longitude || 77.2090;
    
    // Generate JS for markers
    let markersJS = '';
    shelters.forEach((s) => {
      const match = s.location?.match(/POINT\(([^ ]+) ([^ ]+)\)/);
      if (match) {
        const sLng = parseFloat(match[1]);
        const sLat = parseFloat(match[2]);
        markersJS += `
          L.marker([${sLat}, ${sLng}]).addTo(map)
            .bindPopup("<b>${s.name}</b><br>Capacity: ${s.available_capacity}/${s.total_capacity}");
        `;
      }
    });

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
              var map = L.map('map').setView([${lat}, ${lng}], 12);
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '© OpenStreetMap'
              }).addTo(map);
              
              // Add User Location Marker
              var userIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#4A5D4E;width:15px;height:15px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.5);'></div>",
                iconSize: [15, 15],
                iconAnchor: [7, 7]
              });
              L.marker([${lat}, ${lng}], {icon: userIcon}).addTo(map).bindPopup("<b>You are here</b>");
              
              ${markersJS}
          </script>
      </body>
      </html>
    `;
  };

  return (
    <View className="flex-1 bg-white">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text>Locating Nearby Shelters...</Text>
        </View>
      ) : (
        <>
          <View style={{ width: '100%', height: Dimensions.get('window').height * 0.5 }}>
            <WebView
              originWhitelist={['*']}
              source={{ html: generateMapHTML() }}
              style={{ flex: 1 }}
              scrollEnabled={false}
            />
          </View>
          
          <ScrollView className="flex-1 bg-gray-50 rounded-t-3xl -mt-6 p-6 z-10">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Relief Camps</Text>
            {shelters.length === 0 ? (
              <Text className="text-gray-500">No shelters found nearby.</Text>
            ) : (
              shelters.map((s, idx) => (
                <View key={s.id || idx} className="bg-white p-4 rounded-2xl mb-4 border border-gray-200 shadow-sm">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="text-lg font-bold text-gray-800">{s.name}</Text>
                      <Text className="text-sm text-gray-500 mt-1">Status: <Text className="text-green-600 font-bold uppercase">{s.status}</Text></Text>
                    </View>
                    <View className="bg-blue-100 p-2 rounded-lg">
                      <MaterialIcons name="directions" size={24} color="#2563EB" />
                    </View>
                  </View>
                  
                  <View className="flex-row mt-4 gap-4">
                    <View className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <Text className="text-xs text-gray-500 font-medium">Available Beds</Text>
                      <Text className="text-xl font-bold text-gray-800">{s.available_capacity}</Text>
                    </View>
                    <View className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <Text className="text-xs text-gray-500 font-medium">Total Capacity</Text>
                      <Text className="text-xl font-bold text-gray-800">{s.total_capacity}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
            <View className="h-10" />
          </ScrollView>
        </>
      )}
    </View>
  );
}
