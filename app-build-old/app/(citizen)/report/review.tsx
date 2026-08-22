import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Layout } from '../../../constants/Theme';

export default function ReviewReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const transcript = params.transcript || '';

  const handleSubmit = () => {
    // In real app, this submits to Supabase and gets the ID
    router.replace('/(citizen)/report/success');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Review Request</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>Please verify the information below. TriNetra has extracted these details from your report.</Text>
        </View>

        <Text style={styles.label}>Your Report:</Text>
        <Text style={styles.transcript}>"{transcript}"</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>People Affected:</Text>
            <Text style={styles.fieldValue}>3</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Vulnerabilities:</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badge}>Child</Text>
              <Text style={styles.badge}>Asthma (Medical)</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Hazards:</Text>
            <View style={styles.badgeContainer}>
              <Text style={[styles.badge, styles.badgeUrgent]}>Rising Water</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Needs Verification:</Text>
            <Text style={styles.needsVerification}>Yes (Exact location on roof)</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Submit Emergency Report</Text>
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
    flex: 1,
    padding: Layout.padding,
  },
  alertBox: {
    backgroundColor: Colors.surface,
    padding: Layout.padding,
    borderRadius: Layout.radius,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    marginBottom: Layout.padding * 2,
  },
  alertText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  transcript: {
    color: Colors.text,
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: Layout.padding * 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius,
    padding: Layout.padding,
  },
  row: {
    marginBottom: Layout.padding,
  },
  fieldLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  fieldValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.border,
    color: Colors.text,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 'bold',
  },
  badgeUrgent: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    color: Colors.urgent,
    borderWidth: 1,
    borderColor: Colors.urgent,
  },
  needsVerification: {
    color: Colors.warning,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: Layout.padding,
    backgroundColor: Colors.background,
  },
  primaryButton: {
    backgroundColor: Colors.urgent,
    padding: 20,
    borderRadius: Layout.radiusButton,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
