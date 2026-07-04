// Bank soal test IQ. Setiap soal punya kategori, tingkat kesulitan (1-5),
// dan bobot waktu ideal (dipakai untuk menghitung skor kecepatan relatif,
// bukan patokan mutlak "benar/salah waktu").
//
// Kategori:
// - numeric   : deret angka, aritmatika pola
// - logic     : silogisme, penalaran deduktif singkat
// - verbal    : analogi kata, sinonim/antonim, klasifikasi
// - spatial   : deret bentuk/pola (direpresentasikan sebagai teks/simbol
//                karena ini soal berbasis teks, bukan gambar)

export const questions = [
  // ---------- Numeric ----------
  {
    id: 'n1', category: 'numeric', difficulty: 2, idealSeconds: 20,
    question: 'Lanjutkan deret: 2, 6, 12, 20, 30, ...?',
    options: ['36', '40', '42', '44'],
    answer: '42',
  },
  {
    id: 'n2', category: 'numeric', difficulty: 3, idealSeconds: 25,
    question: 'Lanjutkan deret: 1, 1, 2, 3, 5, 8, 13, ...?',
    options: ['18', '20', '21', '24'],
    answer: '21',
  },
  {
    id: 'n3', category: 'numeric', difficulty: 3, idealSeconds: 25,
    question: 'Lanjutkan deret: 3, 9, 27, 81, ...?',
    options: ['162', '216', '243', '324'],
    answer: '243',
  },
  {
    id: 'n4', category: 'numeric', difficulty: 4, idealSeconds: 30,
    question: 'Lanjutkan deret: 4, 9, 19, 39, 79, ...?',
    options: ['119', '149', '159', '169'],
    answer: '159',
  },
  {
    id: 'n5', category: 'numeric', difficulty: 4, idealSeconds: 30,
    question: 'Lanjutkan deret: 100, 97, 91, 82, 70, ...?',
    options: ['55', '58', '60', '52'],
    answer: '55',
  },
  {
    id: 'n6', category: 'numeric', difficulty: 5, idealSeconds: 35,
    question: 'Lanjutkan deret: 2, 3, 5, 9, 17, 33, ...?',
    options: ['49', '57', '65', '61'],
    answer: '65',
  },
  {
    id: 'n7', category: 'numeric', difficulty: 2, idealSeconds: 20,
    question: 'Jika 5 pekerja menyelesaikan pekerjaan dalam 12 hari, berapa hari untuk 10 pekerja (laju sama)?',
    options: ['4 hari', '6 hari', '8 hari', '10 hari'],
    answer: '6 hari',
  },
  {
    id: 'n8', category: 'numeric', difficulty: 3, idealSeconds: 25,
    question: 'Lanjutkan deret: 1, 4, 9, 16, 25, ...?',
    options: ['30', '32', '36', '38'],
    answer: '36',
  },

  // ---------- Logic ----------
  {
    id: 'l1', category: 'logic', difficulty: 2, idealSeconds: 25,
    question: 'Semua kucing adalah mamalia. Semua mamalia bernapas dengan paru-paru. Maka...',
    options: [
      'Semua kucing bernapas dengan paru-paru',
      'Semua mamalia adalah kucing',
      'Sebagian kucing bukan mamalia',
      'Tidak dapat disimpulkan',
    ],
    answer: 'Semua kucing bernapas dengan paru-paru',
  },
  {
    id: 'l2', category: 'logic', difficulty: 3, idealSeconds: 30,
    question: 'Jika hari ini bukan Senin, maka besok bukan Selasa. Hari ini bukan Senin. Maka...',
    options: ['Besok Selasa', 'Besok bukan Selasa', 'Hari ini Minggu', 'Tidak dapat disimpulkan'],
    answer: 'Besok bukan Selasa',
  },
  {
    id: 'l3', category: 'logic', difficulty: 4, idealSeconds: 35,
    question: 'Andi lebih tinggi dari Budi. Budi lebih tinggi dari Citra. Dedi lebih pendek dari Citra. Siapa yang paling tinggi?',
    options: ['Andi', 'Budi', 'Citra', 'Dedi'],
    answer: 'Andi',
  },
  {
    id: 'l4', category: 'logic', difficulty: 4, idealSeconds: 35,
    question: 'Sebagian ilmuwan adalah musisi. Semua musisi menyukai seni. Maka...',
    options: [
      'Semua ilmuwan menyukai seni',
      'Sebagian ilmuwan menyukai seni',
      'Tidak ada ilmuwan yang menyukai seni',
      'Semua yang menyukai seni adalah ilmuwan',
    ],
    answer: 'Sebagian ilmuwan menyukai seni',
  },
  {
    id: 'l5', category: 'logic', difficulty: 5, idealSeconds: 40,
    question: 'Dari 5 orang (P,Q,R,S,T) duduk melingkar: P di sebelah kiri Q, R di sebelah kanan Q, S tidak bersebelahan dengan P. Siapa yang mungkin duduk di sebelah T?',
    options: ['P dan S', 'Q dan R', 'S dan R', 'Tidak dapat ditentukan tanpa info lain'],
    answer: 'Tidak dapat ditentukan tanpa info lain',
  },
  {
    id: 'l6', category: 'logic', difficulty: 3, idealSeconds: 30,
    question: 'Semua A adalah B. Tidak ada B yang merupakan C. Maka...',
    options: ['Semua A adalah C', 'Tidak ada A yang merupakan C', 'Sebagian C adalah A', 'Semua C adalah B'],
    answer: 'Tidak ada A yang merupakan C',
  },

  // ---------- Verbal ----------
  {
    id: 'v1', category: 'verbal', difficulty: 2, idealSeconds: 15,
    question: 'BUKU berhubungan dengan MEMBACA, seperti GARPU berhubungan dengan...?',
    options: ['Dapur', 'Makan', 'Piring', 'Sendok'],
    answer: 'Makan',
  },
  {
    id: 'v2', category: 'verbal', difficulty: 2, idealSeconds: 15,
    question: 'Pilih kata yang paling berbeda dari yang lain:',
    options: ['Elang', 'Merpati', 'Kelelawar', 'Gagak'],
    answer: 'Kelelawar',
  },
  {
    id: 'v3', category: 'verbal', difficulty: 3, idealSeconds: 20,
    question: 'Sinonim dari kata "EFEMER" adalah...?',
    options: ['Abadi', 'Sementara', 'Kekal', 'Stabil'],
    answer: 'Sementara',
  },
  {
    id: 'v4', category: 'verbal', difficulty: 3, idealSeconds: 20,
    question: 'Antonim dari kata "GERSANG" adalah...?',
    options: ['Kering', 'Tandus', 'Subur', 'Panas'],
    answer: 'Subur',
  },
  {
    id: 'v5', category: 'verbal', difficulty: 4, idealSeconds: 25,
    question: 'DOKTER berhubungan dengan PASIEN, seperti GURU berhubungan dengan...?',
    options: ['Sekolah', 'Murid', 'Papan tulis', 'Kelas'],
    answer: 'Murid',
  },
  {
    id: 'v6', category: 'verbal', difficulty: 4, idealSeconds: 25,
    question: 'Manakah kata yang TIDAK termasuk dalam kategori yang sama?',
    options: ['Piano', 'Gitar', 'Biola', 'Terompet'],
    answer: 'Terompet',
  },
  {
    id: 'v7', category: 'verbal', difficulty: 5, idealSeconds: 30,
    question: 'Sinonim dari kata "AMBIGU" adalah...?',
    options: ['Jelas', 'Tegas', 'Mendua arti', 'Pasti'],
    answer: 'Mendua arti',
  },

  // ---------- Spatial (berbasis simbol/teks) ----------
  {
    id: 's1', category: 'spatial', difficulty: 2, idealSeconds: 20,
    question: 'Pola: ▲△▲△▲△?  Simbol berikutnya adalah...?',
    options: ['▲', '△', '■', '●'],
    answer: '△',
  },
  {
    id: 's2', category: 'spatial', difficulty: 3, idealSeconds: 25,
    question: 'Pola: ●●○●●●○●●●●○?  Kelompok berikutnya diawali dengan berapa banyak ●?',
    options: ['3', '4', '5', '6'],
    answer: '5',
  },
  {
    id: 's3', category: 'spatial', difficulty: 3, idealSeconds: 25,
    question: 'Pola: A1 B2 C3 D4 ?  Item berikutnya adalah...?',
    options: ['E5', 'D5', 'E4', 'F5'],
    answer: 'E5',
  },
  {
    id: 's4', category: 'spatial', difficulty: 4, idealSeconds: 30,
    question: 'Pola rotasi: ↑ → ↓ ← ↑ → ?  Simbol berikutnya adalah...?',
    options: ['↑', '→', '↓', '←'],
    answer: '↓',
  },
  {
    id: 's5', category: 'spatial', difficulty: 5, idealSeconds: 35,
    question: 'Pola: 2A 4C 8E 16G ?  Item berikutnya adalah...?',
    options: ['32H', '32I', '24I', '32G'],
    answer: '32I',
  },
  {
    id: 's6', category: 'spatial', difficulty: 4, idealSeconds: 30,
    question: 'Pola: ■□■■□□■■■□□□ ?  Kelompok berikutnya diawali simbol apa dan berapa banyak?',
    options: ['4 buah ■', '3 buah □', '4 buah □', '5 buah ■'],
    answer: '4 buah ■',
  },
  {
    id: 's7', category: 'spatial', difficulty: 5, idealSeconds: 35,
    question: 'Jika bentuk kubus dibuka menjadi jaring-jaring 6 sisi, berapa total sisi yang akan bersentuhan langsung dengan sisi "atas" saat kubus dilipat kembali (tidak termasuk sisi berlawanan)?',
    options: ['2', '3', '4', '5'],
    answer: '4',
  },
];

export function getTestSet(count = 25) {
  // Ambil soal dengan distribusi merata antar kategori, urut dari
  // kesulitan rendah ke tinggi supaya warm-up dulu sebelum soal berat.
  const sorted = [...questions].sort((a, b) => a.difficulty - b.difficulty);
  return sorted.slice(0, Math.min(count, sorted.length));
}
