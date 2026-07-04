# CogniTest — Tes Kognitif Cepat

Tes gaya IQ dengan 3 tingkat kesulitan (easy/medium/hard), soal digenerate
acak setiap attempt (tidak ada 2 sesi yang identik), skor dari kombinasi
ketepatan + kecepatan, sistem username tanpa password, dan papan peringkat
per level via Supabase.

## Fitur utama

- **Soal parametrik, bukan daftar statis** — tiap "jenis" soal (deret
  angka, silogisme, analogi kata, dll) adalah generator yang menghasilkan
  angka/kata berbeda setiap dipanggil. Lihat `lib/questionGenerators.js`.
- **Teka-teki visual berbasis SVG** — bentuk (lingkaran, kotak, segitiga,
  dst) digambar langsung sebagai SVG oleh `components/ShapeIcon.js`, bukan
  gambar/foto dari sumber luar. Tiga jenis: cari yang beda, hitung bentuk,
  lanjutkan pola. Lihat `lib/visualPuzzle.js`.
- **3 tingkat kesulitan** — easy (15 soal), medium (20 soal), hard (25
  soal), masing-masing dengan leaderboard terpisah.
- **Skip dengan penalti** — melewati soal dihitung sebagai jawaban salah
  (bukan diabaikan), supaya skip tidak jadi celah untuk menghindari soal
  sulit tanpa konsekuensi.
- **Username tanpa password** — identitas berbasis device (`localStorage`),
  tidak ada tombol logout (sesuai desain produk), tapi bisa ganti nama
  kapan saja tanpa kehilangan riwayat/peringkat.
- **Leaderboard live** via Supabase, skor terbaik per user per level.

## Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan seluruh isi `db-setup.sql`.
3. Ambil dari **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

   ⚠️ **Project ini SENGAJA tidak memakai `anon` key sama sekali.** Semua
   akses ke tabel `users` dan `test_results` hanya lewat API routes kita
   sendiri (server-side, pakai service_role), dan RLS di database menolak
   semua akses `anon` sebagai lapisan pertahanan kedua — tidak ada jalur
   langsung dari browser ke database.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Setup lokal

```bash
npm install
npm run dev
```

## Deploy ke Vercel

```bash
vercel
```

Isi 2 environment variable di atas lewat dashboard Vercel sebelum deploy.

## Alur halaman

```
pages/index.js   -> onboarding username (wajib) -> pilih level -> leaderboard
pages/test.js     -> soal berjalan via API session, timer 45s, skip tersedia
pages/result.js   -> skor akhir, posisi peringkat, breakdown kategori
pages/docs.js      -> dokumentasi REST API (base URL otomatis ikut domain)
```

## Struktur API

```
POST   /api/v1/user                    -> daftar user baru
PATCH  /api/v1/user                    -> ganti nama (userId tetap sama)
GET    /api/v1/user?userId=            -> ambil profil user
POST   /api/v1/session                 -> mulai sesi tes { level, userId }
POST   /api/v1/session/{id}/answer     -> submit jawaban / skip
GET    /api/v1/session/{id}/result     -> ambil ulang hasil akhir
GET    /api/v1/leaderboard?level=      -> papan peringkat per level
```

Dokumentasi interaktif lengkap dengan contoh request/response ada di
halaman `/docs` setelah di-deploy — base URL di sana otomatis mengikuti
domain tempat web di-deploy.

## Keamanan & keadilan skor

- **Tidak ada jalur langsung browser → Supabase.** Semua lewat API routes
  kita sendiri yang menjalankan validasi (panjang username, kepemilikan
  data) sebelum menyentuh database. RLS Supabase menolak semua akses
  `anon` sebagai lapisan kedua.
- **Jawaban benar tidak pernah dikirim ke client sebelum dijawab** — soal
  disimpan di session store server-side (`lib/sessionStore.js`), client
  hanya menerima teks soal dan pilihan jawaban.
- **Soal diacak per attempt** — kombinasi generator + parameter acak +
  shuffle urutan akhir membuat kecil kemungkinan dua sesi punya soal
  identik dalam urutan yang sama.
- **Skip dihitung salah**, bukan dilewati dari perhitungan — mencegah
  strategi "skip semua soal sulit" untuk menghindari penalti akurasi.
- **Rate limit** per-IP di endpoint pembuatan user & sesi untuk mencegah
  spam otomatis.

## Catatan jujur soal batasan

- Karena tidak ada password, mengganti device/browser = identitas baru.
  Ini trade-off desain yang disengaja untuk kesederhanaan (sesuai
  permintaan: tanpa sistem login/logout penuh).
- Estimasi "IQ" adalah hasil algoritma internal untuk gamifikasi, bukan
  instrumen psikometri tervalidasi — disclaimer ini ditampilkan di UI dan
  sebaiknya tidak dihapus.
