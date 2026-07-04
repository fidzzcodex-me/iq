-- ====================================================================
-- Jalankan di Supabase Dashboard -> SQL Editor, sekali saja.
-- ====================================================================

-- Users: identitas berbasis device (localStorage), tanpa password.
-- user_id digenerate di client (uuid) saat pertama kali buka web, lalu
-- disimpan permanen di localStorage. Karena tidak ada password, ganti
-- device = identitas baru (ini batas wajar dari desain tanpa-auth).
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Batasi panjang & keunikan dasar di level DB (validasi utama tetap di API).
alter table users add constraint username_length check (char_length(username) between 2 and 20);

-- Hasil tes tersimpan permanen, dipakai untuk leaderboard. Satu user bisa
-- attempt berkali-kali; leaderboard menampilkan skor TERBAIK per user per level.
create table if not exists test_results (
  id bigserial primary key,
  user_id uuid references users(id) on delete cascade,
  level text not null check (level in ('easy', 'medium', 'hard')),
  performance_score int not null,
  estimated_iq int not null,
  accuracy int not null,
  correct_count int not null,
  total_questions int not null,
  skipped_count int not null default 0,
  total_time_seconds int not null,
  created_at timestamptz default now()
);

create index if not exists idx_test_results_leaderboard
  on test_results (level, performance_score desc);

create index if not exists idx_test_results_user
  on test_results (user_id, level);

-- ====================================================================
-- Row Level Security
-- ====================================================================
alter table users enable row level security;
alter table test_results enable row level security;

-- Users: anon boleh insert (daftar) dan select+update HANYA baris miliknya
-- sendiri (dicocokkan lewat id yang dikirim client, divalidasi juga di API).
-- Karena tidak ada auth session Supabase asli, RLS ini adalah lapisan
-- kedua — validasi utama forcefully dilakukan di API routes (server-side)
-- yang memakai service_role, BUKAN mengandalkan client langsung akses
-- Supabase. anon key sengaja TIDAK dipakai langsung dari browser di
-- project ini untuk tabel-tabel ini.
create policy "no public access users"
  on users for all
  to anon
  using (false);

create policy "no public access results"
  on test_results for all
  to anon
  using (false);

-- Catatan: karena kedua policy di atas menolak SEMUA akses anon, seluruh
-- baca/tulis ke tabel ini HARUS lewat API routes yang menggunakan
-- SUPABASE_SERVICE_ROLE_KEY (server-side only, lihat lib/supabase.js).
-- Ini sengaja dibuat ketat: tidak ada jalur langsung dari browser ke
-- database sama sekali untuk data identitas/skor.
