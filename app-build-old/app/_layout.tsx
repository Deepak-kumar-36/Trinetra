import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Onboarding and auth flow */}
      <Stack.Screen name="onboarding" />
      
      {/* Role-based shells */}
      <Stack.Screen name="(citizen)" />
      <Stack.Screen name="(volunteer)" />
      <Stack.Screen name="(coordinator)" />
    </Stack>
  );
}
