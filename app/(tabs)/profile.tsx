import { useQuery } from '@tanstack/react-query';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import type { Profile } from '../../types/database';

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  const { data: reviewCount } = useQuery({
    queryKey: ['review_count', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: receiptCount } = useQuery({
    queryKey: ['receipt_count', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('receipts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const displayName = profile?.username || user?.email?.split('@')[0] || 'kullanıcı';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{displayName[0]?.toUpperCase()}</Text>
        </View>
        <Text style={styles.username}>@{displayName}</Text>
        {profile?.city && <Text style={styles.city}>{profile.city}</Text>}
      </View>

      <View style={styles.statsRow}>
        <StatBox label="Yorum" value={reviewCount ?? 0} />
        <StatBox label="Adisyon" value={receiptCount ?? 0} />
        <StatBox label="Puan" value={profile?.points ?? 0} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Katkıda Bulunduklarım</Text>
        <Text style={styles.empty}>Henüz katkı yok.</Text>
      </View>

      <Pressable style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Çıkış Yap</Text>
      </Pressable>
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
  signOutButton: { margin: 16, marginTop: 32, borderWidth: 1, borderColor: Colors.error, borderRadius: 12, padding: 14, alignItems: 'center' },
  signOutText: { color: Colors.error, fontSize: 15, fontWeight: '600' },
});
