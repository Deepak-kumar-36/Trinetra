import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../core/lib/supabase';
import { storage } from '../../core/lib/storage';
import * as Location from 'expo-location';

export function VolunteerHomeScreen({ navigation }: any) {
  const [mission, setMission] = useState<any>(null);
  const [incident, setIncident] = useState<any>(null);
  const [activeIncidents, setActiveIncidents] = useState<any[]>([]);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isSelfAssigning, setIsSelfAssigning] = useState(false);
  const [responderId, setResponderId] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveIncidents();
    startLocationTracking();
  }, []);

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission denied for Volunteer');
      return;
    }

    // Attempt to get device ID or responder ID
    let rId = await storage.getItem('trinetra_device_id');
    if (rId) setResponderId(rId);

    // Watch position
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 10,
      },
      async (loc) => {
        if (rId) {
          // Send location update to backend silently
          await supabase
            .from('responders')
            .update({ 
              location: `POINT(${loc.coords.longitude} ${loc.coords.latitude})` 
            })
            .eq('user_id', rId)
            .select();
        }
      }
    );
  };

  const fetchActiveIncidents = async () => {
    let localIncidents: any[] = [];
    try {
      const stored = await storage.getItem('trinetra_live_incidents');
      if (stored) localIncidents = JSON.parse(stored);
    } catch(e) {}

    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('status', 'reported')
      .order('created_at', { ascending: false })
      .limit(10);
      
    let merged = [...localIncidents];
    if (!error && data) {
      data.forEach(inc => {
        if (!merged.find(m => m.id === inc.id)) merged.push(inc);
      });
    }
    
    merged.sort((a, b) => (b.urgency_score || b.urgency_band || 0) - (a.urgency_score || a.urgency_band || 0));
    setActiveIncidents(merged);
  };

  const handleSelfAssign = async (inc: any) => {
    setIsSelfAssigning(true);
    setTimeout(() => {
      setIsSelfAssigning(false);
      setMission({ id: 1, ...inc });
      setIncident(inc);
    }, 1000);
  };

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      navigation.navigate('VolunteerMap');
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F2ED]" edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} className="flex-1">
        
        {/* Page Title Area */}
        <View className="mb-6">
          <Text className="text-4xl font-bold text-primary">
            {mission ? 'Incoming Mission' : 'Standby Mode'}
          </Text>
        </View>

        {!mission ? (
          <View className="flex-col gap-6">
            {activeIncidents.length === 0 ? (
              <View className="flex-col items-center justify-center p-12 bg-white/50 rounded-2xl border border-surface-variant">
                <MaterialIcons name="radar" size={64} color="#4A5D4E" style={{ opacity: 0.5, marginBottom: 16 }} />
                <Text className="text-xl font-bold text-on-surface mb-2">Waiting for Assignment</Text>
                <Text className="text-on-surface-variant text-center">
                  You are currently on standby. Any reported incidents nearby will appear here instantly.
                </Text>
              </View>
            ) : (
              <View className="flex-col gap-4">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="sensors" size={24} color="#ba1a1a" />
                  <Text className="text-lg font-bold text-primary">Live Incidents Nearby</Text>
                </View>
                
                {activeIncidents.map((inc, idx) => (
                  <View key={idx} className="bg-white border border-outline-variant/50 rounded-2xl p-6 shadow-sm mb-4">
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-1 mr-4">
                        <View className={`self-start px-2 py-1 rounded-md mb-2 ${inc.category === 'voice_distress' ? 'bg-error' : 'bg-primary/10'}`}>
                          <Text className={`text-[10px] font-bold uppercase tracking-wider ${inc.category === 'voice_distress' ? 'text-white' : 'text-primary'}`}>
                            {inc.category || 'Emergency'}
                          </Text>
                        </View>
                        <Text className="font-bold text-lg text-on-surface">{inc.raw_transcript || inc.title || 'Emergency Reported'}</Text>
                      </View>
                      <View className="items-end">
                        <Text className={`text-3xl font-bold leading-none ${inc.urgency_score >= 80 ? 'text-error' : 'text-earth-accent'}`}>
                          {inc.urgency_score || inc.urgency_band || 'N/A'}
                        </Text>
                        <Text className="text-[10px] uppercase font-bold text-on-surface-variant">Score</Text>
                      </View>
                    </View>
                    
                    <View className="flex-row flex-wrap gap-2 mb-4">
                      <View className="bg-secondary-container px-2 py-1 rounded-sm border border-secondary/20 flex-row items-center gap-1">
                        <MaterialIcons name="group" size={12} color="#765f42" />
                        <Text className="text-[10px] uppercase text-on-secondary-container font-bold">{inc.people_affected || 1} Person(s) in Need</Text>
                      </View>
                    </View>
                    
                    <View className="mt-2 flex-row justify-end pt-4 border-t border-outline-variant/30">
                      <TouchableOpacity 
                        onPress={() => handleSelfAssign(inc)}
                        disabled={isSelfAssigning}
                        className="bg-sage-primary px-4 py-2 rounded-xl flex-row items-center gap-2"
                      >
                        <MaterialIcons name="add-task" size={18} color="#fff" />
                        <Text className="text-white font-bold text-sm tracking-wide">Self-Assign</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View className="flex-col gap-6">
            
            {/* Incident Context Card */}
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-surface-variant relative overflow-hidden">
              <Text className="text-2xl font-bold text-primary mb-4">Situation Context</Text>
              <View className="border-l-4 border-earth-accent pl-4 mb-6">
                <Text className="text-lg italic text-charcoal-text">
                  {incident?.raw_transcript || incident?.description || incident?.title}
                </Text>
              </View>
            </View>

            {/* Urgency Score */}
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-surface-variant">
              <View className="flex-row items-center justify-between border-b border-surface-variant pb-4 mb-4">
                <Text className="text-2xl font-bold text-primary">Urgency Score</Text>
                <View className="flex-row items-end gap-1">
                  <Text className={`text-4xl font-bold leading-none ${incident?.urgency_score >= 80 ? 'text-error' : 'text-earth-accent'}`}>
                    {incident?.urgency_score || incident?.urgency_band}
                  </Text>
                  <Text className="text-lg text-on-surface-variant pb-1">/100</Text>
                </View>
              </View>
            </View>

            {/* Match Panel */}
            <View className="bg-white/80 rounded-2xl p-8 shadow-inner border border-outline-variant/30">
              <View className="flex-row items-center gap-2 mb-8">
                <MaterialIcons name="hub" size={32} color="#1d2f22" />
                <Text className="text-2xl font-bold text-primary">Your Match</Text>
              </View>

              <View className="bg-white shadow-lg border border-sage-primary/20 rounded-2xl p-6 relative">
                
                <View className="absolute top-4 right-4 bg-sage-primary px-3 py-1.5 rounded-full flex-row items-center gap-1 z-20">
                  <MaterialIcons name="priority-high" size={16} color="#fff" />
                  <Text className="text-white text-xs font-bold">Dispatched</Text>
                </View>

                <View className="mb-5 mt-2">
                  <Text className="font-bold text-xl text-primary">Action Required</Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <MaterialIcons name="schedule" size={16} color="#8C7355" />
                    <Text className="text-sm text-on-surface-variant font-semibold">ETA to scene: 12 min</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={handleAccept}
                  disabled={isAccepting}
                  className={`mt-8 w-full h-[60px] rounded-xl flex-row items-center justify-center gap-2 ${isAccepting ? 'bg-surface-variant' : 'bg-sage-primary'}`}
                >
                  <MaterialIcons name="navigation" size={24} color={isAccepting ? '#434843' : '#fff'} />
                  <Text className={`font-bold text-lg ${isAccepting ? 'text-on-surface-variant' : 'text-white'}`}>
                    {isAccepting ? 'Accepting...' : 'Accept & Navigate'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
