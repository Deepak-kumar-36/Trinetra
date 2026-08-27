import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../core/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

export function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'citizen' | 'volunteer'>('citizen');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !fullName || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Insert into public.users
        const { error: dbError } = await supabase.from('users').insert({
          id: authData.user.id,
          full_name: fullName,
          phone_number: phoneNumber,
          role: role,
        });

        if (dbError) {
          console.error('Failed to create user profile:', dbError);
          // Don't fail the whole signup for MVP, but log it
        }
      }

      // 3. For MVP, auto-login usually happens, AuthContext will catch it
    } catch (e: any) {
      Alert.alert('Signup Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F3EF]">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
            <MaterialIcons name="arrow-back" size={28} color="#374151" />
          </TouchableOpacity>

          <View className="items-center mb-8 mt-2">
            <Image 
              source={require('../../../assets/logo.png')} 
              className="w-48 h-24 mb-6"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-gray-800 tracking-tight text-center">Create Account</Text>
            <Text className="text-gray-500 mt-2 text-center">Join the emergency network</Text>
          </View>

          <View className="w-full space-y-4 gap-4">
            
            {/* Role Selection */}
            <View className="flex-row gap-4 mb-2">
              <TouchableOpacity 
                className={`flex-1 py-3 rounded-xl border items-center ${role === 'citizen' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                onPress={() => setRole('citizen')}
              >
                <Text className={`font-bold ${role === 'citizen' ? 'text-white' : 'text-gray-600'}`}>Citizen</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className={`flex-1 py-3 rounded-xl border items-center ${role === 'volunteer' ? 'bg-green-600 border-green-600' : 'bg-white border-gray-200'}`}
                onPress={() => setRole('volunteer')}
              >
                <Text className={`font-bold ${role === 'volunteer' ? 'text-white' : 'text-gray-600'}`}>Volunteer</Text>
              </TouchableOpacity>
            </View>

            <View className="w-full bg-white rounded-2xl flex-row items-center px-4 py-3 border border-gray-200">
              <MaterialIcons name="person" size={20} color="#9CA3AF" />
              <TextInput 
                className="flex-1 ml-3 text-base text-gray-800"
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View className="w-full bg-white rounded-2xl flex-row items-center px-4 py-3 border border-gray-200">
              <MaterialIcons name="phone" size={20} color="#9CA3AF" />
              <TextInput 
                className="flex-1 ml-3 text-base text-gray-800"
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View className="w-full bg-white rounded-2xl flex-row items-center px-4 py-3 border border-gray-200">
              <MaterialIcons name="email" size={20} color="#9CA3AF" />
              <TextInput 
                className="flex-1 ml-3 text-base text-gray-800"
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="w-full bg-white rounded-2xl flex-row items-center px-4 py-3 border border-gray-200">
              <MaterialIcons name="lock" size={20} color="#9CA3AF" />
              <TextInput 
                className="flex-1 ml-3 text-base text-gray-800"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              className={`w-full py-4 rounded-2xl items-center mt-6 ${role === 'volunteer' ? 'bg-green-600' : 'bg-blue-600'} ${loading ? 'opacity-70' : ''}`}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text className="text-white font-bold text-base tracking-wide">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
