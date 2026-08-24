import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { supabase } from '../../core/lib/supabase';
import { storage } from '../../core/lib/storage';

export function CoordinatorMapScreen({ navigation }: any) {
  // Command Center centered on New Delhi, India
  const centerPosition = { latitude: 28.6139, longitude: 77.2090 };
  
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isAddingShelter, setIsAddingShelter] = useState(false);
  const [pendingShelterPos, setPendingShelterPos] = useState<any>(null);
  const [shelters, setShelters] = useState<any[]>([]);
  const [newShelterName, setNewShelterName] = useState('');
  const [newShelterCapacity, setNewShelterCapacity] = useState('');

  const volunteers = [
    { id: 1, pos: { latitude: 28.6149, longitude: 77.2100 }, name: "Vol-A42", status: "In Transit" },
    { id: 2, pos: { latitude: 28.6120, longitude: 77.2070 }, name: "Vol-B19", status: "On Scene" },
    { id: 3, pos: { latitude: 28.6150, longitude: 77.2030 }, name: "Vol-C88", status: "Available" },
  ];

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (!error && data) {
      setIncidents(data);
    }
  };

  const handleMapPress = (e: any) => {
    if (isAddingShelter) {
      setPendingShelterPos(e.nativeEvent.coordinate);
      setIsAddingShelter(false);
    }
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
    <SafeAreaView className="flex-1 bg-surface-container" edges={['top', 'left', 'right']}>
      
      {/* Header */}
      <View className="px-6 py-4 bg-white z-20 shadow-sm border-b border-outline-variant/30 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-charcoal-text">Command Map</Text>
          <Text className="text-sm text-on-surface-variant">Live view of active incidents and responders</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center"
        >
          <MaterialIcons name="close" size={24} color="#434843" />
        </TouchableOpacity>
      </View>
      
      <View className="px-6 py-3 bg-white z-20 shadow-sm border-b border-outline-variant/30 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center bg-surface-container-lowest border border-outline-variant/50 rounded-full px-4 h-12 mr-3">
          <MaterialIcons name="search" size={20} color="#767876" />
          <TextInput 
            placeholder="Search to add shelter..."
            className="flex-1 ml-2 text-on-surface"
          />
        </View>
        <TouchableOpacity 
          onPress={() => setIsAddingShelter(!isAddingShelter)}
          className={`h-12 px-4 rounded-full flex-row items-center justify-center gap-2 border ${isAddingShelter ? 'bg-primary-container border-primary' : 'bg-surface-variant border-outline-variant/50'}`}
        >
          <MaterialIcons name={isAddingShelter ? "close" : "add-location"} size={20} color={isAddingShelter ? "#1d2f22" : "#434843"} />
          <Text className={`font-bold text-xs uppercase ${isAddingShelter ? 'text-on-primary-container' : 'text-on-surface'}`}>
            {isAddingShelter ? 'Cancel' : 'Pick'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map Container */}
      <View className="flex-1 relative">
        {isAddingShelter && (
          <View className="absolute top-4 left-4 right-4 bg-primary-container/90 border border-primary px-4 py-3 rounded-xl flex-row items-center gap-3 z-20">
            <MaterialIcons name="touch-app" size={20} color="#1d2f22" />
            <Text className="font-bold text-sm text-primary flex-1">Tap anywhere on the map to place a new emergency shelter.</Text>
          </View>
        )}

        <MapView 
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: centerPosition.latitude,
            longitude: centerPosition.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress}
        >
          {/* Incidents */}
          {incidents.map((inc, idx) => {
            // Need to parse POINT(lon lat) to get actual coordinates
            let coord = centerPosition; // fallback
            if (inc.location && inc.location.startsWith('POINT(')) {
              const match = inc.location.match(/POINT\(([^ ]+) ([^)]+)\)/);
              if (match) {
                coord = { latitude: parseFloat(match[2]), longitude: parseFloat(match[1]) };
              }
            } else if (inc.pos) { // For dummy data
              coord = { latitude: inc.pos[0], longitude: inc.pos[1] };
            }
            
            return (
              <Marker key={`inc-${inc.id || idx}`} coordinate={coord} title={inc.title || 'Emergency'} description={`Severity: ${inc.urgency_band || 'High'}`}>
                <View className="w-8 h-8 rounded-full bg-[#ef4444] border-2 border-[#fecaca] flex items-center justify-center">
                  <MaterialIcons name="emergency" size={16} color="white" />
                </View>
              </Marker>
            );
          })}

          {/* Volunteers */}
          {volunteers.map((vol) => (
            <Marker key={`vol-${vol.id}`} coordinate={vol.pos} title={vol.name} description={`Status: ${vol.status}`}>
              <View className="w-6 h-6 rounded-full bg-[#4CAF50] border-2 border-white flex items-center justify-center">
                <View className="w-2 h-2 bg-white rounded-full" />
              </View>
            </Marker>
          ))}

          {/* Shelters */}
          {shelters.map((shelter) => (
            <Marker key={`shelter-${shelter.id}`} coordinate={shelter.pos} title={shelter.name} description={`Capacity: ${shelter.capacity}`}>
              <View className="w-8 h-8 rounded-full bg-[#3b82f6] border-2 border-[#bfdbfe] flex items-center justify-center">
                <MaterialIcons name="home" size={16} color="white" />
              </View>
            </Marker>
          ))}
        </MapView>
        
        {/* Stats Overlay */}
        <View className="absolute bottom-6 left-4 bg-white/90 p-4 rounded-xl shadow-md border border-gray-100 flex-col gap-2 z-10">
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <Text className="text-sm font-bold text-gray-700">{incidents.length} Active Incidents</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 rounded-full bg-[#4CAF50]" />
            <Text className="text-sm font-bold text-gray-700">3 Field Volunteers</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 rounded-full bg-[#3b82f6]" />
            <Text className="text-sm font-bold text-gray-700">{shelters.length} Shelters</Text>
          </View>
        </View>
      </View>

      {/* Shelter Modal */}
      <Modal visible={!!pendingShelterPos} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-white rounded-3xl overflow-hidden shadow-xl">
            <View className="p-6 border-b border-outline-variant/30 flex-row justify-between items-center bg-surface-container">
              <View>
                <Text className="text-xl font-bold text-charcoal-text">Add Emergency Shelter</Text>
                <Text className="text-xs text-on-surface-variant mt-1">
                  Coords: {pendingShelterPos?.latitude.toFixed(4)}, {pendingShelterPos?.longitude.toFixed(4)}
                </Text>
              </View>
              <View className="w-12 h-12 bg-[#3b82f6]/10 rounded-full flex items-center justify-center">
                <MaterialIcons name="home" size={24} color="#3b82f6" />
              </View>
            </View>
            
            <View className="p-6 gap-4">
              <View>
                <Text className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Shelter Name</Text>
                <TextInput 
                  value={newShelterName}
                  onChangeText={setNewShelterName}
                  placeholder="e.g. NDMC Relief Camp"
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 h-12 text-on-surface"
                />
              </View>
              <View>
                <Text className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Capacity / Resources</Text>
                <TextInput 
                  value={newShelterCapacity}
                  onChangeText={setNewShelterCapacity}
                  placeholder="e.g. 500 beds, food available"
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 h-12 text-on-surface"
                />
              </View>
            </View>
            
            <View className="p-4 bg-surface-container-low flex-row justify-end gap-3 border-t border-outline-variant/30">
              <TouchableOpacity 
                onPress={() => setPendingShelterPos(null)}
                className="px-6 py-3 rounded-full"
              >
                <Text className="font-bold text-sm uppercase tracking-wider text-on-surface-variant">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={confirmAddShelter}
                disabled={!newShelterName}
                className={`px-6 py-3 rounded-full shadow-md ${!newShelterName ? 'bg-primary/50' : 'bg-primary'}`}
              >
                <Text className="font-bold text-sm uppercase tracking-wider text-white">Deploy Shelter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
