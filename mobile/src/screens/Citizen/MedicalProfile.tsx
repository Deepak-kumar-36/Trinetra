import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../core/lib/supabase';
import { useAuth } from '../../core/contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

export function MedicalProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  React.useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
        
      if (data) {
        setBloodType(data.blood_type || '');
        setAllergies(data.allergies || '');
        setConditions(data.medical_conditions || '');
        setEmergencyContact(data.emergency_contact || '');
      }
    } catch (e) {
      // Profile might not exist yet, that's fine
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to save your profile.');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('medical_profiles')
        .upsert({
          user_id: user.id,
          blood_type: bloodType,
          allergies: allergies,
          medical_conditions: conditions,
          emergency_contact: emergencyContact,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      Alert.alert('Success', 'Medical profile securely saved.');
      navigation.goBack();
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F3EF]">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-3xl font-bold text-gray-800 tracking-tight mb-2">Medical Profile</Text>
        <Text className="text-gray-500 mb-8">This information is only shared with emergency responders during an active incident.</Text>

        <View className="space-y-4 gap-4">
          
          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2">Blood Type</Text>
            <View className="w-full bg-white rounded-2xl flex-row items-center px-4 py-3 border border-gray-200">
              <MaterialIcons name="bloodtype" size={20} color="#EF4444" />
              <TextInput 
                className="flex-1 ml-3 text-base text-gray-800"
                placeholder="e.g. O Positive"
                value={bloodType}
                onChangeText={setBloodType}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2">Known Allergies</Text>
            <View className="w-full bg-white rounded-2xl flex-row px-4 py-3 border border-gray-200">
              <MaterialIcons name="warning" size={20} color="#F59E0B" />
              <TextInput 
                className="flex-1 ml-3 text-base text-gray-800 min-h-[60px]"
                placeholder="Penicillin, Peanuts, etc."
                multiline
                value={allergies}
                onChangeText={setAllergies}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2">Chronic Conditions / Medications</Text>
            <View className="w-full bg-white rounded-2xl flex-row px-4 py-3 border border-gray-200">
              <MaterialIcons name="medical-services" size={20} color="#3B82F6" />
              <TextInput 
                className="flex-1 ml-3 text-base text-gray-800 min-h-[60px]"
                placeholder="Asthma, Diabetes, etc."
                multiline
                value={conditions}
                onChangeText={setConditions}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2">Emergency Contact</Text>
            <View className="w-full bg-white rounded-2xl flex-row items-center px-4 py-3 border border-gray-200">
              <MaterialIcons name="contact-phone" size={20} color="#10B981" />
              <TextInput 
                className="flex-1 ml-3 text-base text-gray-800"
                placeholder="Name & Phone Number"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
              />
            </View>
          </View>

          <TouchableOpacity 
            className={`w-full bg-blue-600 py-4 rounded-2xl items-center mt-6 ${loading ? 'opacity-70' : ''}`}
            onPress={handleSave}
            disabled={loading}
          >
            <Text className="text-white font-bold text-base tracking-wide">
              {loading ? 'Saving...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
