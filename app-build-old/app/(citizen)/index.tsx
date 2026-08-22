import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/Theme';

export default function CitizenHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>1. Stay calm and assess your surroundings.</Text>
          <Text style={styles.cardText}>2. Do not walk or drive through flood waters.</Text>
          <Text style={styles.cardText}>3. Keep emergency supplies nearby.</Text>
        </View>
      </View>

      {/* Floating Action Button for reporting emergencies */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/(citizen)/report')}
      >
        <Text style={styles.fabText}>REPORT EMERGENCY</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    padding: Layout.padding,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.padding,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Layout.padding,
    borderRadius: Layout.radius,
  },
  cardText: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: Layout.padding * 2,
    alignSelf: 'center',
    backgroundColor: Colors.urgent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  }
});
