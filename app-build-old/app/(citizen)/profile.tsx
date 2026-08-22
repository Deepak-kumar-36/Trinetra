import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '../../constants/Theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Account Type</Text>
          <Text style={styles.value}>Guest User</Text>
          <Text style={styles.hint}>Your requests are saved on this device.</Text>
          
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Register Phone Number</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    padding: Layout.padding,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Layout.padding,
    borderRadius: Layout.radius,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hint: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: Layout.padding * 2,
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: Layout.radiusButton,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  }
});
