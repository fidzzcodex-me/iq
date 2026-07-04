import { createClient } from '@supabase/supabase-js';

// SENGAJA hanya service_role, dipakai eksklusif dari API routes (server-side).
// Tidak ada client Supabase yang jalan di browser untuk project ini — semua
// baca/tulis user & skor lewat endpoint kita sendiri, yang menjalankan
// validasi (panjang username, kepemilikan user_id, dsb) sebelum menyentuh DB.
// RLS di database menolak SEMUA akses anon sebagai lapisan pertahanan kedua.

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
