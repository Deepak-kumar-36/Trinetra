import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../core/lib/supabase';

export function CoordinatorHomeScreen({ navigation }: any) {
  const [incidents, setIncidents] = useState<any[]>([]);

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

  const maxScore = incidents.length > 0 ? Math.max(...incidents.map(i => i.urgency_score || i.urgencyScore || 0)) : 0;
  
  let threatLevel = 'Normal';
  let threatColorText = 'text-sage-primary';
  let threatColorBg = 'bg-sage-primary';

  if (maxScore >= 80) {
    threatLevel = 'Critical';
    threatColorText = 'text-error';
    threatColorBg = 'bg-error';
  } else if (maxScore >= 50) {
    threatLevel = 'High';
    threatColorText = 'text-orange-500';
    threatColorBg = 'bg-orange-500';
  } else if (maxScore >= 20) {
    threatLevel = 'Elevated';
    threatColorText = 'text-yellow-500';
    threatColorBg = 'bg-yellow-500';
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      
      {/* Header */}
      <View className="bg-surface/50 border-b border-outline-variant/20 flex-row justify-between items-center w-full px-6 h-20">
        <TouchableOpacity className="w-10 h-10 items-center justify-center opacity-70">
          <MaterialIcons name="menu" size={32} color="#1d2f22" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-3xl font-bold tracking-tight text-[#FF9933]">t</Text>
          <Text className="text-3xl font-bold tracking-tight text-[#000000]">r</Text>
          <Text className="text-3xl font-bold tracking-tight text-[#138808]">i</Text>
          <Text className="text-3xl font-bold tracking-tight text-primary uppercase ml-1">NETRA</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center opacity-70">
          <MaterialIcons name="notifications" size={32} color="#1d2f22" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} className="flex-1">
        
        {/* Threat Level Bar */}
        <View className="w-full bg-white rounded-xl p-6 shadow-sm border border-outline-variant/30 mt-2">
          <View className="flex-row justify-between items-end mb-2">
            <View>
              <Text className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Disaster Threat Level</Text>
              <View className="flex-row items-center gap-2">
                <Text className={`text-4xl font-bold ${threatColorText} leading-none`}>{threatLevel}</Text>
                <View className={`w-3 h-3 rounded-full ${threatColorBg}`} />
              </View>
            </View>
            <View className="items-end">
              <View className="flex-row items-baseline">
                <Text className="text-3xl font-bold text-on-surface leading-none">{maxScore}</Text>
                <Text className="text-sm text-on-surface-variant">/100</Text>
              </View>
            </View>
          </View>
          
          <View className="w-full h-3 bg-surface-variant/50 rounded-full overflow-hidden flex-row mt-2">
            <View style={{ width: `${Math.max(5, maxScore)}%` }} className={`h-full ${threatColorBg} rounded-full opacity-80`} />
          </View>
          
          <View className="flex-row flex-wrap gap-2 mt-4">
            <View className="px-2 py-1 bg-error/10 rounded-md border border-error/20">
              <Text className="text-error text-xs font-bold">Threat to Life: 90</Text>
            </View>
            <View className="px-2 py-1 bg-sage-primary/10 rounded-md border border-sage-primary/20">
              <Text className="text-sage-primary text-xs font-bold">Medical: 80</Text>
            </View>
            <View className="px-2 py-1 bg-on-surface-variant/10 rounded-md border border-outline-variant/30">
              <Text className="text-on-surface text-xs font-bold">Property: 40</Text>
            </View>
          </View>
        </View>
        
        {/* Command Map Button */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('CoordinatorMap')}
          className="w-full bg-primary mt-6 rounded-xl p-4 shadow-sm flex-row items-center justify-between"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MaterialIcons name="map" size={24} color="#ffffff" />
            </View>
            <View>
              <Text className="text-white font-bold text-lg">Command Map</Text>
              <Text className="text-white/80 text-sm">View live incidents, volunteers, & shelters</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#ffffff" />
        </TouchableOpacity>

        {/* Live Incidents Feed */}
        <View className="flex-col gap-4 mt-6">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Live Incidents Queue</Text>
            <View className="bg-error-container px-2 py-0.5 rounded-full">
              <Text className="text-on-error-container text-xs font-bold">{incidents.length} Active</Text>
            </View>
          </View>
          
          {incidents.length === 0 ? (
            <View className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 items-center">
              <Text className="text-on-surface-variant text-center">No active incidents in the database.</Text>
            </View>
          ) : (
            incidents.map((incident, idx) => (
              <View key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-outline-variant/30 flex-col gap-3 mb-4">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-row items-center gap-2">
                    <View className={`px-3 py-1 rounded-full ${incident.category === 'voice_distress' ? 'bg-error' : 'bg-primary/10'}`}>
                      <Text className={`text-xs font-bold uppercase tracking-wider ${incident.category === 'voice_distress' ? 'text-white' : 'text-primary'}`}>
                        {incident.category || 'Emergency'}
                      </Text>
                    </View>
                    {(incident.urgency_score || incident.urgencyScore) && (
                      <View className="flex-row items-center gap-1">
                        <View className={`w-3 h-3 rounded-full ${(incident.urgency_score || incident.urgencyScore) >= 80 ? 'bg-error' : 'bg-earth-accent'}`} />
                        <Text className="font-bold text-on-surface text-sm">Score: {incident.urgency_score || incident.urgencyScore}</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="schedule" size={16} color="#434843" />
                    <Text className="text-on-surface-variant text-xs">Just now</Text>
                  </View>
                </View>
                
                {incident.trigger_source === 'voice_keyword_auto' && incident.trigger_confirmed !== true && (
                  <View className="bg-orange-100 border border-orange-300 px-3 py-1.5 rounded-md flex-row items-center gap-2 mb-2 self-start">
                    <MaterialIcons name="warning" size={16} color="#c2410c" />
                    <Text className="text-orange-800 text-xs font-bold uppercase tracking-wider">Auto-detected — unconfirmed</Text>
                  </View>
                )}
                
                <Text className="font-bold text-lg text-on-surface mb-2">
                  {incident.reporter_id ? 'Citizen Report' : 'Anonymous Report'}
                </Text>
                
                <View className="mb-2">
                  <Text className="text-on-surface text-base">
                    {incident.raw_transcript?.includes('incident_audio') 
                      ? 'Manual SOS triggered. Awaiting coordinator review.' 
                      : (incident.raw_transcript || incident.description || incident.title)}
                  </Text>
                </View>

                {incident.raw_transcript?.includes('incident_audio') && (
                  <TouchableOpacity className="flex-row items-center gap-2 bg-primary/10 px-4 py-3 rounded-xl mb-2 self-start border border-primary/20">
                    <MaterialIcons name="play-circle-fill" size={24} color="#1d2f22" />
                    <Text className="text-primary font-bold">Play Voice Context</Text>
                  </TouchableOpacity>
                )}

                <View className="flex-row items-center gap-1 mt-1">
                  <MaterialIcons name="location-on" size={14} color="#434843" />
                  <Text className="text-on-surface-variant text-xs font-bold">Citizen Location: Lat 28.6139, Lng 77.2090</Text>
                </View>
                
                <View className="flex-row flex-wrap gap-2 mt-2">
                  {incident.hazards?.map((h: string, i: number) => (
                    <View key={`h-${i}`} className="bg-error/10 px-2 py-0.5 rounded-sm border border-error/20">
                      <Text className="text-[10px] uppercase text-error font-bold">{h}</Text>
                    </View>
                  ))}
                </View>
                
                <View className="mt-4 pt-3 border-t border-outline-variant/20 flex-row justify-end">
                  <TouchableOpacity className="flex-row items-center gap-1 bg-primary/10 px-4 py-2 rounded-lg">
                    <MaterialIcons name="send" size={18} color="#1d2f22" />
                    <Text className="text-primary text-xs font-bold uppercase tracking-wider">Dispatch Team</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
