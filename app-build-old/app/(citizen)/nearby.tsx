import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../constants/Theme';

export default function NearbyHelpScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Help</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>📍 Map View</Text>
          <Text style={styles.mapSubtext}>Showing shelters and supply hubs</Text>
        </View>

        <View style={styles.list}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Community Hall Shelter</Text>
            <Text style={styles.cardDesc}>1.2 km away • 15 beds available</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Medical Support</Text>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>School Ground Shelter</Text>
            <Text style={styles.cardDesc}>2.5 km away • 60 beds available</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Pet Friendly</Text>
            </View>
          </View>
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
    flex: 1,
  },
  mapPlaceholder: {
    height: 250,
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
    color: Colors.textMuted,
    marginTop: 8,
  },
  list: {
    padding: Layout.padding,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Layout.padding,
    borderRadius: Layout.radius,
    marginBottom: Layout.padding,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: 'bold',
  }
});
