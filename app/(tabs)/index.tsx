import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import type { VenueWithStats } from '../../types/database';

// Mock data – Supabase bağlandıktan sonra kaldırılacak
const MOCK_VENUES: VenueWithStats[] = [
  {
    id: '1',
    name: 'Liman Balık',
    category: 'Balık Restaurant',
    address: 'Mersin, Türkiye',
    location: null,
    source: 'user',
    google_place_id: null,
    verified: true,
    created_by: null,
    created_at: new Date().toISOString(),
    avg_rating: 4.2,
    review_count: 38,
    has_price_discrepancy: true,
  },
  {
    id: '2',
    name: 'Tarihi Çarşı Kahvesi',
    category: 'Kafe',
    address: 'Mersin, Türkiye',
    location: null,
    source: 'user',
    google_place_id: null,
    verified: false,
    created_by: null,
    created_at: new Date().toISOString(),
    avg_rating: 3.8,
    review_count: 12,
    has_price_discrepancy: false,
  },
];

function VenueCard({ venue }: { venue: VenueWithStats }) {
  const router = useRouter();
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/venue/${venue.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.venueName}>{venue.name}</Text>
        {venue.has_price_discrepancy && (
          <View style={styles.discrepancyBadge}>
            <Text style={styles.discrepancyText}>⚠ Fiyat Farkı</Text>
          </View>
        )}
      </View>
      <Text style={styles.category}>{venue.category}</Text>
      <Text style={styles.address}>{venue.address}</Text>
      <View style={styles.stats}>
        <Text style={styles.rating}>★ {venue.avg_rating?.toFixed(1) ?? '-'}</Text>
        <Text style={styles.reviewCount}>{venue.review_count} yorum</Text>
      </View>
    </Pressable>
  );
}

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fairbite</Text>
        <Text style={styles.headerSubtitle}>Fiyat şeffaflığı</Text>
      </View>
      <FlatList
        data={MOCK_VENUES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VenueCard venue={item} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.primary },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  venueName: { fontSize: 16, fontWeight: '600', color: Colors.text, flex: 1 },
  discrepancyBadge: { backgroundColor: '#FFF3CD', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  discrepancyText: { fontSize: 11, color: '#856404', fontWeight: '600' },
  category: { fontSize: 13, color: Colors.textSecondary, marginBottom: 2 },
  address: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  stats: { flexDirection: 'row', gap: 12 },
  rating: { fontSize: 14, fontWeight: '600', color: Colors.accent },
  reviewCount: { fontSize: 13, color: Colors.textSecondary },
});
