import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/Theme';

// Mock data for MVP
const MOCK_REQUESTS = [
  {
    id: 'R-101',
    status: 'Dispatched',
    category: 'Water Rescue',
    time: '2 mins ago',
    active: true
  },
  {
    id: 'R-098',
    status: 'Resolved',
    category: 'Supply Delivery',
    time: '2 days ago',
    active: false
  }
];

export default function RequestsScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.card, item.active && styles.cardActive]}
      onPress={() => router.push(`/(citizen)/request/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.reqId}>{item.id}</Text>
        <Text style={styles.reqTime}>{item.time}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.reqCategory}>{item.category}</Text>
        <View style={styles.statusBadge}>
          <Text style={[
            styles.statusText, 
            item.active ? styles.statusActive : styles.statusResolved
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Requests</Text>
      </View>
      
      <FlatList
        data={MOCK_REQUESTS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  listContainer: {
    padding: Layout.padding,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius,
    padding: Layout.padding,
    marginBottom: Layout.padding,
  },
  cardActive: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reqId: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'JetBrains Mono',
  },
  reqTime: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reqCategory: {
    color: Colors.text,
    fontSize: 16,
  },
  statusBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusActive: {
    color: Colors.primary,
  },
  statusResolved: {
    color: Colors.success,
  }
});
