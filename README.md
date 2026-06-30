# Fairbite

Mekan keşfi ve fiyat şeffaflığı odaklı mobil uygulama.

**Temel özellik — Adisyon Doğrulama:** Kullanıcılar aldıkları fişin fotoğrafını yükler; sistem menüdeki fiyatlarla karşılaştırır ve fark varsa mekanı işaretler.

## Stack

- React Native + Expo + expo-router
- TypeScript
- Supabase (PostgreSQL + PostGIS + Auth + Storage)
- React Query
- Google Places API (sadece ilk keşif; veri kalıcı saklanmaz)

## Kurulum

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını Supabase ve Google Places bilgilerinizle doldurun

# 3. Supabase migration'ı çalıştır
# Supabase Dashboard > SQL Editor > supabase/migrations/20240001_initial_schema.sql

# 4. Uygulamayı başlat
npm start
```

## Klasör Yapısı

```
app/
  (tabs)/         → Alt navigasyon ekranları
  venue/[id].tsx  → Mekan detay
components/       → Tekrar kullanılabilir UI
lib/
  supabase.ts     → Supabase client
  places.ts       → Google Places sarmalayıcı
stores/           → Zustand store'ları
types/            → TypeScript tip tanımları
constants/        → Renkler ve sabitler
supabase/
  migrations/     → SQL şema dosyaları
```

## Önemli Notlar

- Google Places lisansı gereği `place_id` dışındaki veriler DB'ye yazılmaz
- Tüm mimari coğrafyadan bağımsız — "Mersin" hiçbir yere sabit kodlanmamıştır
- PostGIS + `ST_DWithin` ile "yakınımdaki mekanlar" sorguları yapılır
