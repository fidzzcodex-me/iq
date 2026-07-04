# CogniTest — Tes Kognitif Cepat

Tes gaya IQ dengan 25 soal campuran (numerik, logika, verbal, spasial),
skor dihitung dari kombinasi ketepatan dan kecepatan menjawab.

## Cara kerja skoring

- Tiap soal punya `difficulty` (1-5) dan `idealSeconds` (waktu wajar untuk
  menjawab). Lihat `lib/questions.js`.
- Jawaban benar dapat poin dasar dari `difficulty × 10`.
- Kecepatan relatif terhadap `idealSeconds` memberi bonus/penalti kecil
  (dibatasi ke rentang ±20%) — akurasi tetap komponen utama skor, kecepatan
  cuma pemanis. Lihat `lib/scoring.js`.
- Skor performa (0-1000) dan estimasi "IQ" (70-145) dihitung dari situ.

**Penting:** ini bukan instrumen psikometri tervalidasi. Disclaimer ini
ditampilkan di halaman utama dan halaman hasil, dan sebaiknya tidak dihapus.

## Alur halaman

```
pages/index.js   -> landing, intro, tombol mulai
pages/test.js    -> soal berjalan, timer 45 detik per soal, auto-lanjut
pages/result.js  -> skor akhir, breakdown kategori, disclaimer
```

Jawaban disimpan sementara di `sessionStorage` selama sesi tes berlangsung
(hilang saat tab ditutup) — tidak ada data yang dikirim ke server mana pun,
semua kalkulasi terjadi di browser.

## Menambah/mengubah soal

Edit `lib/questions.js`. Setiap soal butuh:
```js
{
  id: 'unik',
  category: 'numeric' | 'logic' | 'verbal' | 'spatial',
  difficulty: 1-5,
  idealSeconds: angka,
  question: 'teks soal',
  options: ['a', 'b', 'c', 'd'],
  answer: 'salah satu dari options',
}
```

`getTestSet(count)` otomatis mengambil soal terurut dari termudah ke
tersulit — tambahkan soal baru ke array `questions`, tidak perlu ubah
logika pemilihan.

## Setup & Deploy

```bash
npm install
npm run dev
```

Deploy ke Vercel:
```bash
vercel
```

Tidak butuh environment variable apa pun — semua logika berjalan di
client + Next.js biasa.
