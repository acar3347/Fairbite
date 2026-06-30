import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mekan Ara</Text>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Restoran, kafe, mekan..."
            placeholderTextColor={Colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
      </View>
      {query.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Mekan adı veya kategori yazın</Text>
        </View>
      ) : (
        <FlatList
          data={[]}
          renderItem={null}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>"{query}" için sonuç bulunamadı</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 12 },
  searchBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  input: { height: 44, fontSize: 15, color: Colors.text },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 80 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
});
