import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

const MOCK_PROFILE = {
  username: 'kullanici42',
  city: 'Mersin',
  points: 320,
  reviewCount: 14,
  receiptCount: 8,
};

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {MOCK_PROFILE.username[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>@{MOCK_PROFILE.username}</Text>
        <Text style={styles.city}>{MOCK_PROFILE.city}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBox label="Yorum" value={MOCK_PROFILE.reviewCount} />
        <StatBox label="Adisyon" value={MOCK_PROFILE.receiptCount} />
        <StatBox label="Puan" value={MOCK_PROFILE.points} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Katkıda Bulunduklarım</Text>
        <Text style={styles.empty}>Henüz katkı yok.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, alignItems: 'center', paddingVertical: 32, paddingHorizontal: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  username: { fontSize: 18, fontWeight: '700', color: '#fff' },
  city: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  statsRow: { flexDirection: 'row', margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, justifyContent: 'space-around', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  statBox: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 24, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: 12, color: Colors.textSecondary },
  section: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  empty: { fontSize: 14, color: Colors.textSecondary },
});
