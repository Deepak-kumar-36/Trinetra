import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../core/contexts/AuthContext';
import { supabase } from '../../core/lib/supabase';

export function CitizenProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<{ full_name?: string; phone_number?: string }>({});

  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, phone_number')
        .eq('id', user?.id)
        .single();
      
      if (data) {
        setProfileData(data);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => await signOut() }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest" edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        
        {/* Header */}
        <View className="mb-8 items-center pt-4">
          <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-4">
            <MaterialIcons name="person" size={48} color="#4A5D4E" />
          </View>
          <Text className="text-3xl font-bold text-charcoal-text">{profileData.full_name || 'Citizen'}</Text>
          <Text className="text-on-surface-variant text-base mt-1">{profileData.phone_number || user?.email || 'No Contact Info'}</Text>
        </View>

        {/* Profile Options */}
        <View className="space-y-4 gap-4">
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('MedicalProfile')}
            className="w-full bg-white rounded-2xl p-4 border border-outline-variant/30 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-full bg-error/10 items-center justify-center">
                <MaterialIcons name="medical-services" size={24} color="#ba1a1a" />
              </View>
              <View>
                <Text className="text-lg font-bold text-charcoal-text">Medical Profile</Text>
                <Text className="text-sm text-on-surface-variant">Blood type, allergies, conditions</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#767876" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-full bg-white rounded-2xl p-4 border border-outline-variant/30 flex-row items-center justify-between shadow-sm"
            onPress={() => Alert.alert('Coming Soon', 'Account settings will be available in a future update.')}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                <MaterialIcons name="settings" size={24} color="#4A5D4E" />
              </View>
              <View>
                <Text className="text-lg font-bold text-charcoal-text">Account Settings</Text>
                <Text className="text-sm text-on-surface-variant">Update password, preferences</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#767876" />
          </TouchableOpacity>

        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          className="w-full bg-error/10 py-4 rounded-2xl flex-row justify-center items-center mt-12 border border-error/20"
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color="#ba1a1a" className="mr-2" />
          <Text className="text-error font-bold text-lg">Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
