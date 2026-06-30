import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

type Step = 'select_venue' | 'take_photo' | 'confirm';

export default function ReceiptScreen() {
  const [step, setStep] = useState<Step>('select_venue');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setStep('confirm');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adisyon Yükle</Text>
        <View style={styles.steps}>
          {(['select_venue', 'take_photo', 'confirm'] as Step[]).map((s, i) => (
            <View key={s} style={[styles.stepDot, step === s && styles.stepDotActive]} />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {step === 'select_venue' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Mekan Seç</Text>
            <Text style={styles.sectionDesc}>Adisyonu hangi mekanda aldınız?</Text>
            <Pressable style={styles.button} onPress={() => setStep('take_photo')}>
              <Text style={styles.buttonText}>Mekan Seç →</Text>
            </Pressable>
          </View>
        )}

        {step === 'take_photo' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Fotoğraf Çek</Text>
            <Text style={styles.sectionDesc}>Adisyonunuzun net bir fotoğrafını çekin.</Text>
            <Pressable style={styles.cameraButton} onPress={pickImage}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.cameraText}>Kamerayı Aç</Text>
            </Pressable>
          </View>
        )}

        {step === 'confirm' && imageUri && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Onayla & Paylaş</Text>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <Text style={styles.sectionDesc}>
              Fiyatlar AI ile okunacak ve menüyle karşılaştırılacak.
            </Text>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Gönder</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => setStep('take_photo')}>
              <Text style={styles.secondaryButtonText}>Tekrar Çek</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 12 },
  steps: { flexDirection: 'row', gap: 8 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  stepDotActive: { backgroundColor: Colors.accent, width: 24 },
  content: { flex: 1, padding: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  sectionDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  button: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: { borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, alignItems: 'center' },
  secondaryButtonText: { color: Colors.textSecondary, fontSize: 15 },
  cameraButton: { backgroundColor: Colors.surface, borderRadius: 16, padding: 40, alignItems: 'center', gap: 8, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed' },
  cameraIcon: { fontSize: 48 },
  cameraText: { fontSize: 16, color: Colors.primary, fontWeight: '600' },
  preview: { width: '100%', height: 240, borderRadius: 12, resizeMode: 'cover' },
});
