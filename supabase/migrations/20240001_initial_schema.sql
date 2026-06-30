-- Enable PostGIS
create extension if not exists postgis;

-- Kullanıcı profilleri (Supabase auth.users'a bağlı)
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  city          text,
  points        integer not null default 0,
  created_at    timestamptz not null default now()
);

-- Profil otomatik oluşturma trigger'ı
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Mekanlar (kaynaktan bağımsız)
create table venues (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  category        text,
  address         text,
  location        geography(point, 4326),
  source          text not null default 'user' check (source in ('google', 'user', 'owner')),
  google_place_id text,
  verified        boolean not null default false,
  created_by      uuid references profiles(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index venues_location_idx on venues using gist (location);
create index venues_category_idx on venues (category);
create index venues_source_idx on venues (source);
create index venues_google_place_id_idx on venues (google_place_id) where google_place_id is not null;

-- Menü öğeleri + fiyatları
create table menu_items (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references venues(id) on delete cascade,
  name        text not null,
  menu_price  numeric(10, 2),
  currency    text not null default 'TRY',
  created_at  timestamptz not null default now()
);

create index menu_items_venue_id_idx on menu_items (venue_id);

-- Adisyon yüklemeleri
create table receipts (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references venues(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  image_url   text,
  parsed_data jsonb,
  created_at  timestamptz not null default now()
);

create index receipts_venue_id_idx on receipts (venue_id);
create index receipts_user_id_idx on receipts (user_id);

-- Adisyondan okunan tek tek fiyatlar
create table receipt_items (
  id                   uuid primary key default gen_random_uuid(),
  receipt_id           uuid not null references receipts(id) on delete cascade,
  item_name            text,
  receipt_price        numeric(10, 2),
  matched_menu_item_id uuid references menu_items(id) on delete set null
);

create index receipt_items_receipt_id_idx on receipt_items (receipt_id);

-- Yorumlar + puanlar
create table reviews (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references venues(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  text        text,
  receipt_id  uuid references receipts(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index reviews_venue_id_idx on reviews (venue_id);
create index reviews_user_id_idx on reviews (user_id);

-- Row Level Security
alter table profiles enable row level security;
alter table venues enable row level security;
alter table menu_items enable row level security;
alter table receipts enable row level security;
alter table receipt_items enable row level security;
alter table reviews enable row level security;

-- Profiles: herkes okuyabilir, sadece kendisi yazabilir
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- Venues: herkes okuyabilir, giriş yapmış kullanıcılar ekleyebilir
create policy "venues_select" on venues for select using (true);
create policy "venues_insert" on venues for insert with check (auth.uid() = created_by);
create policy "venues_update" on venues for update using (auth.uid() = created_by);

-- Menu items: herkes okuyabilir
create policy "menu_items_select" on menu_items for select using (true);
create policy "menu_items_insert" on menu_items for insert with check (
  exists (select 1 from venues where id = venue_id and created_by = auth.uid())
);

-- Receipts: sadece kendisi görebilir ve ekleyebilir
create policy "receipts_select" on receipts for select using (auth.uid() = user_id);
create policy "receipts_insert" on receipts for insert with check (auth.uid() = user_id);

-- Receipt items: receipt sahibi görebilir
create policy "receipt_items_select" on receipt_items for select using (
  exists (select 1 from receipts where id = receipt_id and user_id = auth.uid())
);
create policy "receipt_items_insert" on receipt_items for insert with check (
  exists (select 1 from receipts where id = receipt_id and user_id = auth.uid())
);

-- Reviews: herkes okuyabilir, sahibi yazabilir
create policy "reviews_select" on reviews for select using (true);
create policy "reviews_insert" on reviews for insert with check (auth.uid() = user_id);
create policy "reviews_update" on reviews for update using (auth.uid() = user_id);
create policy "reviews_delete" on reviews for delete using (auth.uid() = user_id);
