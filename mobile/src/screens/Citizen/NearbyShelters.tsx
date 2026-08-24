import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../core/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
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

  const initialRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  } : {
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View className="flex-1 bg-white">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text>Locating Nearby Shelters...</Text>
        </View>
      ) : (
        <>
          <MapView 
            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.5 }}
            initialRegion={initialRegion}
            showsUserLocation={true}
          >
            {shelters.map((s, idx) => {
              // Parse POINT(lng lat)
              const match = s.location?.match(/POINT\(([^ ]+) ([^ ]+)\)/);
              if (!match) return null;
              const lng = parseFloat(match[1]);
              const lat = parseFloat(match[2]);
              
              return (
                <Marker 
                  key={s.id || idx}
                  coordinate={{ latitude: lat, longitude: lng }}
                  title={s.name}
                  description={`Capacity: ${s.available_capacity}/${s.total_capacity}`}
                >
                  <View className="bg-green-600 p-2 rounded-full border-2 border-white shadow-md">
                    <MaterialIcons name="house" size={20} color="white" />
                  </View>
                </Marker>
              );
            })}
          </MapView>
          
          <ScrollView className="flex-1 bg-gray-50 rounded-t-3xl -mt-6 p-6">
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
