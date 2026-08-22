import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Theme';

export default function CitizenLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.urgent, // Citizen uses Urgent Red for active tab
        tabBarInactiveTintColor: Colors.textMuted,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'My Requests',
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Nearby Help',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
