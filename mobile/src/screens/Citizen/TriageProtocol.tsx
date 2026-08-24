import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../core/lib/supabase';
import { useAuth } from '../../core/contexts/AuthContext';
import * as Location from 'expo-location';

export function TriageProtocolScreen({ navigation }: any) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Triage Data
  const [category, setCategory] = useState<string>('other');
  const [peopleAffected, setPeopleAffected] = useState(1);
  const [hasInjuries, setHasInjuries] = useState(false);
  const [hasStructuralDamage, setHasStructuralDamage] = useState(false);

  const submitTriage = async () => {
    setLoading(true);
    try {
      let loc = await Location.getCurrentPositionAsync({});
      const pointStr = `POINT(${loc.coords.longitude} ${loc.coords.latitude})`;

      const hazards = [];
      if (hasStructuralDamage) hazards.push('structural_damage');

      const vulnerabilities = [];
      if (hasInjuries) vulnerabilities.push('medical_emergency');

      const { error } = await supabase.from('incidents').insert({
        reporter_id: user?.id,
        status: 'reported',
        category,
        people_affected: peopleAffected,
        hazards,
        vulnerabilities,
        trigger_source: 'manual',
        location: pointStr,
        raw_transcript: 'Manually entered Triage Protocol',
      });

      if (error) throw error;
      Alert.alert('Report Submitted', 'Responders have been notified.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Submission Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-2xl font-bold mb-6 text-gray-800">Triage Assessment</Text>
        
        {step === 1 && (
          <View className="space-y-4 gap-4">
            <Text className="text-lg font-bold text-gray-700">What is the primary emergency?</Text>
            {['fire', 'medical', 'flood', 'security', 'other'].map(cat => (
              <TouchableOpacity 
                key={cat}
                onPress={() => setCategory(cat)}
                className={`p-4 rounded-xl border ${category === cat ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
              >
                <Text className="capitalize text-base font-medium">{cat}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setStep(2)} className="bg-blue-600 p-4 rounded-xl mt-4">
              <Text className="text-white text-center font-bold">Next Step</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View className="space-y-4 gap-4">
            <Text className="text-lg font-bold text-gray-700">How many people are affected?</Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={() => setPeopleAffected(Math.max(1, peopleAffected - 1))} className="bg-gray-200 p-4 rounded-full">
                <MaterialIcons name="remove" size={24} />
              </TouchableOpacity>
              <Text className="text-2xl font-bold">{peopleAffected}</Text>
              <TouchableOpacity onPress={() => setPeopleAffected(peopleAffected + 1)} className="bg-gray-200 p-4 rounded-full">
                <MaterialIcons name="add" size={24} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => setHasInjuries(!hasInjuries)}
              className={`p-4 rounded-xl border mt-4 flex-row items-center justify-between ${hasInjuries ? 'bg-red-100 border-red-500' : 'bg-gray-50 border-gray-200'}`}
            >
              <Text className="font-medium text-base">Are there severe injuries?</Text>
              <MaterialIcons name={hasInjuries ? "check-box" : "check-box-outline-blank"} size={24} color={hasInjuries ? "red" : "gray"} />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setHasStructuralDamage(!hasStructuralDamage)}
              className={`p-4 rounded-xl border mt-2 flex-row items-center justify-between ${hasStructuralDamage ? 'bg-orange-100 border-orange-500' : 'bg-gray-50 border-gray-200'}`}
            >
              <Text className="font-medium text-base">Is there structural damage?</Text>
              <MaterialIcons name={hasStructuralDamage ? "check-box" : "check-box-outline-blank"} size={24} color={hasStructuralDamage ? "orange" : "gray"} />
            </TouchableOpacity>

            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity onPress={() => setStep(1)} className="flex-1 bg-gray-200 p-4 rounded-xl">
                <Text className="text-gray-700 text-center font-bold">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitTriage} disabled={loading} className="flex-1 bg-red-600 p-4 rounded-xl">
                <Text className="text-white text-center font-bold">{loading ? 'Sending...' : 'Submit SOS'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
