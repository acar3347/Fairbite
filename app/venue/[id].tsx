import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import type { MenuItemWithDiscrepancy, ReviewWithProfile } from '../../types/database';

// Mock – Supabase bağlandıktan sonra kaldırılacak
const MOCK_MENU: MenuItemWithDiscrepancy[] = [
  { id: 'm1', venue_id: '1', name: 'Levrek Izgara', menu_price: 280, currency: 'TRY', created_at: '', latest_receipt_price: 350, price_diff: 70 },
  { id: 'm2', venue_id: '1', name: 'Çipura Buğulama', menu_price: 260, currency: 'TRY', created_at: '', latest_receipt_price: 260, price_diff: 0 },
  { id: 'm3', venue_id: '1', name: 'Balık Çorbası', menu_price: 85, currency: 'TRY', created_at: '', latest_receipt_price: null, price_diff: null },
];

const MOCK_REVIEWS: ReviewWithProfile[] = [
  { id: 'r1', venue_id: '1', user_id: 'u1', rating: 4, text: 'Güzel balık ama fiyat farkı var dikkat!', receipt_id: 'rec1', created_at: '', profiles: { username: 'deniz_k' }, is_verified: true },
  { id: 'r2', venue_id: '1', user_id: 'u2', rating: 5, text: 'Harika balık, harika servis.', receipt_id: null, created_at: '', profiles: { username: 'ayse_m' }, is_verified: false },
];

function PriceRow({ item }: { item: MenuItemWithDiscrepancy }) {
  const hasDiff = item.price_diff !== null && item.price_diff > 0;
  return (
    <View style={[styles.priceRow, hasDiff && styles.priceRowAlert]}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.prices}>
        <Text style={styles.menuPrice}>{item.menu_price}₺</Text>
        {item.latest_receipt_price !== null && (
          <Text style={[styles.receiptPrice, hasDiff && styles.receiptPriceAlert]}>
            {item.latest_receipt_price}₺ {hasDiff ? '⚠' : '✓'}
          </Text>
        )}
      </View>
    </View>
  );
}

function ReviewCard({ review }: { review: ReviewWithProfile }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewer}>@{review.profiles.username}</Text>
        {review.is_verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Adisyonlu</Text>
          </View>
        )}
        <Text style={styles.reviewRating}>{'★'.repeat(review.rating)}</Text>
      </View>
      {review.text && <Text style={styles.reviewText}>{review.text}</Text>}
    </View>
  );
}

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.heroSection}>
          <Text style={styles.venueName}>Liman Balık</Text>
          <Text style={styles.category}>Balık Restaurant · Mersin</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>★ 4.2</Text>
            <Text style={styles.reviewCount}>38 yorum</Text>
            <View style={styles.discrepancyBadge}>
              <Text style={styles.discrepancyText}>⚠ Fiyat Farkı Var</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menü & Fiyat Karşılaştırma</Text>
          <View style={styles.legend}>
            <Text style={styles.legendItem}>Menü fiyatı → Adisyon fiyatı</Text>
          </View>
          {MOCK_MENU.map((item) => (
            <PriceRow key={item.id} item={item} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yorumlar</Text>
          {MOCK_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  heroSection: { backgroundColor: Colors.primary, padding: 20 },
  venueName: { fontSize: 22, fontWeight: '700', color: '#fff' },
  category: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  rating: { fontSize: 16, fontWeight: '700', color: Colors.accent },
  reviewCount: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  discrepancyBadge: { backgroundColor: Colors.warning, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  discrepancyText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  section: { margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  legend: { flexDirection: 'row' },
  legendItem: { fontSize: 12, color: Colors.textSecondary },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  priceRowAlert: { backgroundColor: '#FFF9C4', marginHorizontal: -16, paddingHorizontal: 16, borderRadius: 8 },
  itemName: { fontSize: 14, color: Colors.text, flex: 1 },
  prices: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  menuPrice: { fontSize: 14, color: Colors.textSecondary },
  receiptPrice: { fontSize: 14, fontWeight: '600', color: Colors.success },
  receiptPriceAlert: { color: Colors.error },
  reviewCard: { borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  reviewer: { fontSize: 13, fontWeight: '600', color: Colors.text },
  verifiedBadge: { backgroundColor: '#D1FAE5', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  verifiedText: { fontSize: 11, color: '#065F46', fontWeight: '600' },
  reviewRating: { marginLeft: 'auto', color: Colors.accent, fontSize: 13 },
  reviewText: { fontSize: 14, color: Colors.text, lineHeight: 20 },
});
