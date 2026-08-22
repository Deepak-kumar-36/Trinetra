import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/Theme';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const selectRole = (role: string) => {
    // Navigate to the respective role's shell
    router.replace(`/${role}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>How are you using TriNetra?</Text>
      
      <TouchableOpacity 
        style={[styles.card, { borderLeftColor: Colors.urgent, borderLeftWidth: 6 }]}
        onPress={() => selectRole('(citizen)')}
      >
        <Text style={styles.cardTitle}>I need help</Text>
        <Text style={styles.cardDesc}>Report an emergency or request assistance for yourself or others.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.card, { borderLeftColor: Colors.success, borderLeftWidth: 6 }]}
        onPress={() => selectRole('(volunteer)')}
      >
        <Text style={styles.cardTitle}>I want to volunteer</Text>
        <Text style={styles.cardDesc}>Offer your skills, vehicle, or equipment to respond to nearby incidents.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.card, { borderLeftColor: Colors.primary, borderLeftWidth: 6 }]}
        onPress={() => selectRole('(coordinator)')}
      >
        <Text style={styles.cardTitle}>I'm a coordinator</Text>
        <Text style={styles.cardDesc}>Manage incoming reports, dispatch responders, and oversee operations.</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Layout.padding * 2,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 40,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius,
    padding: Layout.padding * 1.5,
    marginBottom: Layout.padding,
    minHeight: Layout.touchTarget,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  }
});
