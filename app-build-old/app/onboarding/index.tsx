import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Layout } from '../../constants/Theme';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TriNetra</Text>
        <Text style={styles.subtitle}>Disaster Response Coordination</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/onboarding/role-selection')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    padding: Layout.padding * 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    paddingBottom: Layout.padding * 2,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: Layout.radiusButton,
    alignItems: 'center',
    minHeight: Layout.touchTarget,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
