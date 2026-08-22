import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Layout } from '../../../constants/Theme';

export default function LocationConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const transcript = params.transcript;

  const handleConfirm = () => {
    router.push({
      pathname: '/(citizen)/report/review',
      params: { transcript }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Confirm Location</Text>
      </View>
      
      <View style={styles.mapPlaceholder}>
        {/* We will replace this with MapView later */}
        <Text style={styles.mapText}>📍 Map View</Text>
        <Text style={styles.mapSubtext}>GPS Accuracy: High (5m)</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.instruction}>Are you at this location?</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm}>
          <Text style={styles.primaryButtonText}>Yes, Confirm Location</Text>
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
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: 'bold',
  },
  mapSubtext: {
    fontSize: 14,
    color: Colors.success,
    marginTop: 8,
  },
  footer: {
    padding: Layout.padding * 2,
    backgroundColor: Colors.surface,
  },
  instruction: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: Layout.padding,
    textAlign: 'center',
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
