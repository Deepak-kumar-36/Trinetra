import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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

  return (
    <View className="flex-1 bg-[#e4e8e1]">
      
      {/* Real Interactive Map */}
      <MapView 
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: volunteerPosition.latitude,
          longitude: volunteerPosition.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* Volunteer Marker */}
        <Marker coordinate={volunteerPosition} title="Live Telemetry">
          <View className="w-8 h-8 rounded-full bg-[#4CAF50] border-4 border-white shadow-sm flex items-center justify-center">
            <View className="w-2 h-2 bg-white rounded-full" />
          </View>
        </Marker>

        {/* Incident Marker */}
        <Marker coordinate={incidentPosition}>
          <View className="w-10 h-10 rounded-full bg-[#ef4444] border-4 border-[#fecaca] shadow-sm flex items-center justify-center">
            <MaterialIcons name="emergency" size={20} color="white" />
          </View>
        </Marker>
      </MapView>

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
