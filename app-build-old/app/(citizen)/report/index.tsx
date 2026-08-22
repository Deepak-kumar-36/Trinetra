import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../constants/Theme';

export default function ReportEmergencyType() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Emergency</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.instruction}>How would you like to report?</Text>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/(citizen)/report/voice')}
        >
          <Text style={styles.cardTitle}>🎤 Speak</Text>
          <Text style={styles.cardDesc}>Record a voice message describing the emergency.</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/(citizen)/report/text')}
        >
          <Text style={styles.cardTitle}>⌨️ Type</Text>
          <Text style={styles.cardDesc}>Fill out a quick text form with the details.</Text>
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
  header: {
    padding: Layout.padding,
    paddingTop: 60,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.urgent,
  },
  content: {
    padding: Layout.padding,
    flex: 1,
    justifyContent: 'center',
  },
  instruction: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius,
    padding: Layout.padding * 2,
    marginBottom: Layout.padding,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
  }
});
