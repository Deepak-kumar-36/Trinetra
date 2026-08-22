import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Layout } from '../../../constants/Theme';

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Request {id}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Current Status</Text>
          <Text style={styles.statusValue}>En Route</Text>
        </View>

        <Text style={styles.sectionTitle}>Timeline</Text>
        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Responder En Route</Text>
              <Text style={styles.timelineTime}>10:45 AM</Text>
              <Text style={styles.timelineDesc}>River Rescue Team is 12 mins away.</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Responder Assigned</Text>
              <Text style={styles.timelineTime}>10:42 AM</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Request Prioritized</Text>
              <Text style={styles.timelineTime}>10:40 AM</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Request Submitted</Text>
              <Text style={styles.timelineTime}>10:39 AM</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: Layout.padding,
  },
  statusCard: {
    backgroundColor: Colors.surface,
    padding: Layout.padding * 2,
    borderRadius: Layout.radius,
    marginBottom: Layout.padding * 2,
    alignItems: 'center',
    borderTopWidth: 4,
    borderTopColor: Colors.primary,
  },
  statusLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  statusValue: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.padding,
  },
  timeline: {
    marginLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.border,
    marginRight: 16,
    marginTop: 4,
  },
  timelineDotActive: {
    backgroundColor: Colors.success,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  timelineTime: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  timelineDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  }
});
