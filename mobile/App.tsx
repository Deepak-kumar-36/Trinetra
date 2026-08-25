import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as QuickActions from 'expo-quick-actions';

// Placeholder screens for now
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

import { AuthProvider, useAuth } from './src/core/contexts/AuthContext';
import { LoginScreen } from './src/screens/Auth/LoginScreen';
import { SignupScreen } from './src/screens/Auth/SignupScreen';

import { CitizenHomeScreen } from './src/screens/Citizen/CitizenHome';
import { PhotoReportScreen } from './src/screens/Citizen/PhotoReport';
import { TriageProtocolScreen } from './src/screens/Citizen/TriageProtocol';
import { MedicalProfileScreen } from './src/screens/Citizen/MedicalProfile';
import { CitizenProfileScreen } from './src/screens/Citizen/CitizenProfile';
import { NearbySheltersScreen } from './src/screens/Citizen/NearbyShelters';
import { VolunteerHomeScreen } from './src/screens/Volunteer/VolunteerHome';
import { VolunteerMapScreen } from './src/screens/Volunteer/VolunteerMap';
import { CoordinatorHomeScreen } from './src/screens/Coordinator/CoordinatorHome';
import { CoordinatorMapScreen } from './src/screens/Coordinator/CoordinatorMap';
import { registerForPushNotificationsAsync } from './src/core/lib/notifications';

function RootNavigator() {
  const { session, role, isLoading } = useAuth();
  const [isOffline, setIsOffline] = useState(false);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    // 1. Register Quick Action
    QuickActions.setItems([
      {
        id: 'report_emergency',
        title: 'Report Emergency',
        icon: 'compose',
        params: { href: '/CitizenHome' }
      }
    ]);

    // 2. Handle Warm Starts
    const actionSub = QuickActions.addListener((action) => {
      if (action.id === 'report_emergency' && session) {
        if (navigationRef.isReady()) {
          navigationRef.navigate('CitizenHome' as never);
        }
      }
    });

    // 3. Handle Cold Starts
    const initialAction = QuickActions.initial;
    if (initialAction?.id === 'report_emergency' && session) {
      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigationRef.navigate('CitizenHome' as never);
        }
      }, 100);
    }
    
    // Initial connection check
    NetInfo.fetch().then(state => {
      setIsOffline(!state.isConnected);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    // Register for Push Notifications
    if (session) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          console.log('Push token successfully registered in App.tsx');
        }
      });
    }

    return () => {
      unsubscribe();
      actionSub.remove();
    };
  }, [navigationRef, session]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#F4F3EF] items-center justify-center">
        <Text>Loading TriNetra...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          // App Stack (Dynamically routes based on role)
          <>
            {role === 'citizen' && (
              <>
                <Stack.Screen name="CitizenHome" component={CitizenHomeScreen} options={{ headerShown: true, title: 'Citizen Dashboard', headerStyle: { backgroundColor: '#2563eb' }, headerTintColor: '#fff' }} />
                <Stack.Screen name="PhotoReport" component={PhotoReportScreen} options={{ headerShown: true, title: 'Photo Report', headerStyle: { backgroundColor: '#2563eb' }, headerTintColor: '#fff' }} />
                <Stack.Screen name="TriageProtocol" component={TriageProtocolScreen} options={{ headerShown: true, title: 'Triage Protocol', headerStyle: { backgroundColor: '#2563eb' }, headerTintColor: '#fff' }} />
                <Stack.Screen name="MedicalProfile" component={MedicalProfileScreen} options={{ headerShown: true, title: 'Medical Profile', headerStyle: { backgroundColor: '#2563eb' }, headerTintColor: '#fff' }} />
                <Stack.Screen name="CitizenProfile" component={CitizenProfileScreen} options={{ headerShown: true, title: 'My Profile', headerStyle: { backgroundColor: '#2563eb' }, headerTintColor: '#fff' }} />
                <Stack.Screen name="NearbyShelters" component={NearbySheltersScreen} options={{ headerShown: true, title: 'Nearby Shelters', headerStyle: { backgroundColor: '#2563eb' }, headerTintColor: '#fff' }} />
              </>
            )}
            {role === 'volunteer' && (
              <>
                <Stack.Screen name="VolunteerHome" component={VolunteerHomeScreen} options={{ headerShown: true, title: 'Volunteer Dashboard', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
                <Stack.Screen name="VolunteerMap" component={VolunteerMapScreen} options={{ headerShown: true, title: 'Live Operations Map', headerStyle: { backgroundColor: '#16a34a' }, headerTintColor: '#fff' }} />
              </>
            )}
            {role === 'coordinator' && (
              <>
                <Stack.Screen name="CoordinatorHome" component={CoordinatorHomeScreen} options={{ headerShown: true, title: 'Command Center', headerStyle: { backgroundColor: '#9333ea' }, headerTintColor: '#fff' }} />
                <Stack.Screen name="CoordinatorMap" component={CoordinatorMapScreen} />
              </>
            )}
            {/* Fallback if role is null/loading */}
            {!role && (
              <Stack.Screen name="PendingRole" component={() => (
                <View className="flex-1 items-center justify-center"><Text>Verifying Account Profile...</Text></View>
              )} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
