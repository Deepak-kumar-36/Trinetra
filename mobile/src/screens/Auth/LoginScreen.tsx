import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../core/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Login Failed', error.message);
      }
      // AuthContext will automatically pick up the session and re-route
    } catch (e: any) {
      Alert.alert('Error', e.message);
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          
          <View className="items-center mb-10">
            <View className="bg-white p-3 rounded-3xl shadow-sm border border-gray-100 mb-6">
              <Image 
                source={require('../../../assets/icon.png')} 
                className="w-20 h-20 rounded-2xl"
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">TriNetra</Text>
            <Text className="text-gray-500 text-center">Unified Emergency Response System</Text>
          </View>

          <View className="w-full space-y-4 gap-4">
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
              className={`w-full bg-blue-600 py-4 rounded-2xl items-center mt-4 ${loading ? 'opacity-70' : ''}`}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-white font-bold text-base tracking-wide">
                {loading ? 'Authenticating...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">New to TriNetra? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-blue-600 font-bold">Create Account</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
