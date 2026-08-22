import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../constants/Theme';

export default function ReportSuccessScreen() {
  const router = useRouter();

  const handleTrack = () => {
    // Navigate to the requests tab and close the modal flow
    router.replace('/(citizen)/requests');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✅</Text>
        </View>
        <Text style={styles.title}>Report Submitted</Text>
        <Text style={styles.subtitle}>
          TriNetra provides decision support and coordination. In life-threatening emergencies, users should contact authorized emergency services according to local procedures.
        </Text>
        
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Reference ID:</Text>
          <Text style={styles.cardValue}>R-101</Text>
          <Text style={styles.cardLabel}>Status:</Text>
          <Text style={styles.statusValue}>Prioritized (Critical)</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleTrack}>
          <Text style={styles.primaryButtonText}>Track This Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Layout.padding * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: Colors.surface,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Layout.padding * 2,
    borderRadius: Layout.radius,
    width: '100%',
    alignItems: 'center',
  },
  cardLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  cardValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'JetBrains Mono',
    marginBottom: 16,
  },
  statusValue: {
    color: Colors.urgent,
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    padding: Layout.padding * 2,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: Layout.radiusButton,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
