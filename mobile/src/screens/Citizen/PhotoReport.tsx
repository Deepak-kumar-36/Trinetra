import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { supabase } from '../../core/lib/supabase';
import { storage } from '../../core/lib/storage';

export function PhotoReportScreen({ navigation }: any) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePhotoUpload = async (uri: string, base64Data: string) => {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get Location Natively
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;

      // Ensure base64 string is correctly formatted for a Data URL
      const base64DataUrl = `data:image/jpeg;base64,${base64Data}`;

      // 2. Fetch or Create UUID natively
      let uid = await storage.getItem('trinetra_device_id');
      if (!uid) {
        uid = Math.random().toString(36).substring(2, 15);
        await storage.setItem('trinetra_device_id', uid);
      }

      // 3. Create Incident with trigger_source = 'photo_report'
      const { data, error: insertError } = await supabase
        .from('incidents')
        .insert({
          reporter_id: uid,
          status: 'reported',
          category: 'general',
          urgency_score: 100,
          urgency_band: 'critical',
          raw_transcript: JSON.stringify({ type: 'photo_report', url: base64DataUrl }),
          location: `POINT(${lon} ${lat})`,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Successfully uploaded! Show success bubble and then navigate
      setIsSuccess(true);
      setTimeout(() => {
        navigation.goBack();
      }, 3000);

    } catch (err: any) {
      console.error('Photo upload failed:', err);
      setError(err.message || 'Failed to send photo alert. Please check permissions.');
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Camera permissions are required.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      handlePhotoUpload(result.assets[0].uri, result.assets[0].base64);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Gallery permissions are required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      handlePhotoUpload(result.assets[0].uri, result.assets[0].base64);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest relative" edges={['top', 'left', 'right']}>
      
      {/* Header */}
      <View className="pt-12 px-6 pb-2 z-10">
        <Text className="text-4xl font-bold text-on-surface mb-2 tracking-tight">Photo SOS</Text>
        <Text className="text-base text-on-surface-variant">
          Upload visual evidence of an emergency to instantly dispatch volunteers to your location.
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center p-6 gap-4 z-0">
        
        {isUploading ? (
          <View className="items-center justify-center p-10 bg-surface-container-lowest rounded-2xl w-full max-w-sm border border-surface-variant mt-4">
            <ActivityIndicator size="large" color="#4A5D4E" style={{ marginBottom: 16 }} />
            <Text className="text-xl font-bold text-on-surface">Uploading Alert</Text>
            <Text className="text-sm text-on-surface-variant mt-2 text-center">Securing location & transmitting photo...</Text>
          </View>
        ) : (
          <View className="w-full max-w-sm space-y-4 mt-4">
            
            {error && (
              <View className="w-full bg-error-container p-4 rounded-xl flex-row items-start gap-3 mb-4">
                <MaterialIcons name="error" size={24} color="#ba1a1a" />
                <Text className="text-on-error-container font-medium text-sm flex-1">{error}</Text>
              </View>
            )}
            
            <TouchableOpacity 
              onPress={takePhoto}
              className="w-full h-32 bg-white rounded-2xl border border-surface-variant flex-row items-center px-6 gap-5 mb-4 shadow-sm"
              activeOpacity={0.7}
            >
              <View className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <MaterialIcons name="photo-camera" size={28} color="#4A5D4E" />
              </View>
              <View className="flex-col flex-1">
                <Text className="text-xl font-bold text-on-surface tracking-tight">Capture Photo</Text>
                <Text className="text-sm text-on-surface-variant mt-1">Take a live photo</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#767876" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={pickImage}
              className="w-full h-32 bg-white rounded-2xl border border-surface-variant flex-row items-center px-6 gap-5 shadow-sm"
              activeOpacity={0.7}
            >
              <View className="w-14 h-14 rounded-full bg-surface-variant flex items-center justify-center">
                <MaterialIcons name="collections" size={28} color="#434843" />
              </View>
              <View className="flex-col flex-1">
                <Text className="text-xl font-bold text-on-surface tracking-tight">Select from Gallery</Text>
                <Text className="text-sm text-on-surface-variant mt-1">Upload existing image</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#767876" />
            </TouchableOpacity>

          </View>
        )}

      </View>

      {/* Success Overlay */}
      {isSuccess && (
        <View className="absolute inset-0 z-50 bg-black/80 flex-col items-center justify-center p-6">
          <View className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl flex-col items-center">
            <View className="w-20 h-20 rounded-full bg-sage-primary items-center justify-center mb-6">
              <MaterialIcons name="check-circle" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-on-surface mb-2">Photo Sent!</Text>
            <Text className="text-lg text-on-surface-variant text-center">
              Your photo and precise location have been successfully transmitted to the Coordinator. Help is on the way.
            </Text>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}
