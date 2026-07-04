// Generator soal PARAMETRIK. Alih-alih daftar soal statis (yang gampang
// dihafal/dibocorkan), tiap "jenis" soal di bawah adalah TEMPLATE yang
// menghasilkan soal baru dengan angka/kata acak setiap dipanggil. Ini yang
// membuat setiap attempt tes punya soal berbeda meski jenisnya sama.
//
// Setiap generator mengembalikan:
// { category, difficulty, idealSeconds, question, options, answer }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildOptions(correct, distractorFn, count = 4) {
  const options = new Set([correct]);
  let guard = 0;
  while (options.size < count && guard < 50) {
    options.add(distractorFn());
    guard++;
  }
  return shuffle([...options]);
}

// ---------- NUMERIC generators ----------

function genArithmeticSequence(difficulty) {
  const start = randInt(1, 10);
  const step = randInt(2, difficulty + 3);
  const seq = Array.from({ length: 5 }, (_, i) => start + step * i);
  const answer = start + step * 5;
  return {
    category: 'numeric', difficulty, idealSeconds: 18 + difficulty * 3,
    question: `Lanjutkan deret: ${seq.join(', ')}, ...?`,
    options: buildOptions(String(answer), () => String(answer + randInt(-step, step) * randInt(1, 2) || answer + 1)),
    answer: String(answer),
  };
}

function genGeometricSequence(difficulty) {
  const start = randInt(2, 5);
  const ratio = randInt(2, difficulty < 4 ? 3 : 4);
  const seq = Array.from({ length: 4 }, (_, i) => start * Math.pow(ratio, i));
  const answer = start * Math.pow(ratio, 4);
  return {
    category: 'numeric', difficulty, idealSeconds: 22 + difficulty * 3,
    question: `Lanjutkan deret: ${seq.join(', ')}, ...?`,
    options: buildOptions(String(answer), () => String(answer + randInt(-answer / 3, answer / 3 | 0) || answer + ratio)),
    answer: String(answer),
  };
}

function genFibonacciLike(difficulty) {
  const a = randInt(1, 3);
  const b = randInt(1, 4);
  const seq = [a, b];
  for (let i = 0; i < 5; i++) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  const answer = seq[seq.length - 1];
  const shown = seq.slice(0, 6);
  return {
    category: 'numeric', difficulty, idealSeconds: 25 + difficulty * 3,
    question: `Lanjutkan deret: ${shown.join(', ')}, ...?`,
    options: buildOptions(String(answer), () => String(answer + randInt(-5, 5) || answer + 1)),
    answer: String(answer),
  };
}

function genWorkRate(difficulty) {
  const workers1 = randInt(2, 6);
  const days1 = randInt(4, 20);
  const workers2 = workers1 * randInt(2, 3);
  const totalWork = workers1 * days1;
  const answer = totalWork / workers2;
  if (!Number.isInteger(answer)) return genWorkRate(difficulty); // retry kalau ganjil
  return {
    category: 'numeric', difficulty, idealSeconds: 25 + difficulty * 3,
    question: `Jika ${workers1} pekerja menyelesaikan pekerjaan dalam ${days1} hari, berapa hari untuk ${workers2} pekerja (laju sama)?`,
    options: buildOptions(`${answer} hari`, () => `${answer + randInt(1, 4)} hari`),
    answer: `${answer} hari`,
  };
}

function genDecreasingSequence(difficulty) {
  const start = randInt(80, 150);
  const decrements = Array.from({ length: 5 }, (_, i) => randInt(2, difficulty + 3) + i * randInt(1, 3));
  const seq = [start];
  for (const d of decrements) seq.push(seq[seq.length - 1] - d);
  const nextDecrement = decrements[decrements.length - 1] + randInt(1, 3);
  const answer = seq[seq.length - 1] - nextDecrement;
  return {
    category: 'numeric', difficulty, idealSeconds: 28 + difficulty * 3,
    question: `Lanjutkan deret: ${seq.join(', ')}, ...?`,
    options: buildOptions(String(answer), () => String(answer + randInt(-6, 6) || answer + 2)),
    answer: String(answer),
  };
}

// ---------- LOGIC generators ----------

const NAMES = ['Andi', 'Budi', 'Citra', 'Dedi', 'Eka', 'Fina', 'Gita', 'Hana'];

function genHeightOrder(difficulty) {
  const [a, b, c] = shuffle(NAMES).slice(0, 3);
  return {
    category: 'logic', difficulty, idealSeconds: 25 + difficulty * 3,
    question: `${a} lebih tinggi dari ${b}. ${b} lebih tinggi dari ${c}. Siapa yang paling pendek?`,
    options: buildOptions(c, () => shuffle([a, b, c])[0]),
    answer: c,
  };
}

function genSyllogism(difficulty) {
  const templates = [
    {
      premise: (x, y, z) => `Semua ${x} adalah ${y}. Semua ${y} adalah ${z}. Maka...`,
      correct: (x, z) => `Semua ${x} adalah ${z}`,
      wrongs: (x, y, z) => [`Semua ${z} adalah ${x}`, `Sebagian ${x} bukan ${z}`, `Tidak ada ${x} yang ${z}`],
    },
    {
      premise: (x, y, z) => `Semua ${x} adalah ${y}. Tidak ada ${y} yang merupakan ${z}. Maka...`,
      correct: (x, z) => `Tidak ada ${x} yang merupakan ${z}`,
      wrongs: (x, y, z) => [`Semua ${x} adalah ${z}`, `Sebagian ${x} adalah ${z}`, `Semua ${z} adalah ${y}`],
    },
  ];
  const CATS = [
    ['kucing', 'mamalia', 'hewan berdarah panas'],
    ['mawar', 'bunga', 'tumbuhan berbunga'],
    ['dokter', 'profesional medis', 'orang berpendidikan tinggi'],
    ['segitiga', 'bangun datar', 'bentuk geometris'],
  ];
  const [x, y, z] = CATS[randInt(0, CATS.length - 1)];
  const t = templates[randInt(0, templates.length - 1)];
  const correct = t.correct(x, z);
  return {
    category: 'logic', difficulty, idealSeconds: 28 + difficulty * 3,
    question: t.premise(x, y, z),
    options: shuffle([correct, ...t.wrongs(x, y, z)]),
    answer: correct,
  };
}

function genSeatingLogic(difficulty) {
  const [a, b, c, d] = shuffle(NAMES).slice(0, 4);
  return {
    category: 'logic', difficulty, idealSeconds: 32 + difficulty * 3,
    question: `${a} duduk di sebelah kiri ${b}. ${c} duduk di sebelah kanan ${b}. Siapa yang duduk di antara ${a} dan ${c}?`,
    options: buildOptions(b, () => shuffle([a, b, c, d])[0]),
    answer: b,
  };
}

function genConditionalLogic(difficulty) {
  const conditions = [
    { p: 'hari ini hujan', q: 'jalanan basah', negP: 'hari ini tidak hujan', negQ: 'jalanan tidak basah' },
    { p: 'lampu menyala', q: 'ada listrik', negP: 'lampu tidak menyala', negQ: 'tidak ada listrik' },
    { p: 'dia lulus ujian', q: 'dia belajar keras', negP: 'dia tidak lulus ujian', negQ: 'dia tidak belajar keras' },
  ];
  const c = conditions[randInt(0, conditions.length - 1)];
  return {
    category: 'logic', difficulty, idealSeconds: 30 + difficulty * 3,
    question: `Jika ${c.p}, maka ${c.q}. Diketahui ${c.negQ}. Maka...`,
    options: shuffle([c.negP, `${c.p}`, 'Tidak dapat disimpulkan', `${c.q}`]),
    answer: c.negP,
  };
}

// ---------- VERBAL generators ----------

const ANALOGIES = [
  ['Buku', 'Membaca', 'Garpu', 'Makan'],
  ['Dokter', 'Pasien', 'Guru', 'Murid'],
  ['Kunci', 'Membuka', 'Gunting', 'Memotong'],
  ['Mata', 'Melihat', 'Telinga', 'Mendengar'],
  ['Pena', 'Menulis', 'Kuas', 'Melukis'],
  ['Ikan', 'Berenang', 'Burung', 'Terbang'],
];

function genAnalogy(difficulty) {
  const [a, b, c, d] = ANALOGIES[randInt(0, ANALOGIES.length - 1)];
  const distractors = shuffle(ANALOGIES.filter((x) => x[3] !== d).map((x) => x[3])).slice(0, 3);
  return {
    category: 'verbal', difficulty, idealSeconds: 14 + difficulty * 2,
    question: `${a} berhubungan dengan ${b}, seperti ${c} berhubungan dengan...?`,
    options: shuffle([d, ...distractors]),
    answer: d,
  };
}

const SYNONYM_SETS = [
  { word: 'EFEMER', correct: 'Sementara', wrongs: ['Abadi', 'Kekal', 'Stabil'] },
  { word: 'AMBIGU', correct: 'Mendua arti', wrongs: ['Jelas', 'Tegas', 'Pasti'] },
  { word: 'GERSANG', correct: 'Tandus', wrongs: ['Subur', 'Basah', 'Hijau'], antonym: true },
  { word: 'MERINGANKAN', correct: 'Memudahkan', wrongs: ['Mempersulit', 'Memberatkan', 'Menghambat'] },
  { word: 'KONTRADIKTIF', correct: 'Bertentangan', wrongs: ['Selaras', 'Sejalan', 'Sepadan'] },
];

function genSynonym(difficulty) {
  const s = SYNONYM_SETS[randInt(0, SYNONYM_SETS.length - 1)];
  return {
    category: 'verbal', difficulty, idealSeconds: 16 + difficulty * 2,
    question: `${s.antonym ? 'Antonim' : 'Sinonim'} dari kata "${s.word}" adalah...?`,
    options: shuffle([s.correct, ...s.wrongs]),
    answer: s.correct,
  };
}

const CATEGORY_SETS = [
  ['Elang', 'Merpati', 'Gagak', 'Kelelawar'], // kelelawar bukan burung
  ['Piano', 'Gitar', 'Biola', 'Terompet'], // terompet bukan alat musik senar
  ['Apel', 'Jeruk', 'Mangga', 'Wortel'], // wortel bukan buah
  ['Sedan', 'Truk', 'Motor', 'Kapal'], // kapal bukan kendaraan darat
];

function genOddOneOut(difficulty) {
  const set = CATEGORY_SETS[randInt(0, CATEGORY_SETS.length - 1)];
  const odd = set[set.length - 1];
  return {
    category: 'verbal', difficulty, idealSeconds: 15 + difficulty * 2,
    question: 'Pilih kata yang paling berbeda dari yang lain:',
    options: shuffle(set),
    answer: odd,
  };
}

// ---------- Generator pools per level ----------

const NUMERIC_GENS = [genArithmeticSequence, genGeometricSequence, genFibonacciLike, genWorkRate, genDecreasingSequence];
const LOGIC_GENS = [genHeightOrder, genSyllogism, genSeatingLogic, genConditionalLogic];
const VERBAL_GENS = [genAnalogy, genSynonym, genOddOneOut];

const LEVEL_CONFIG = {
  easy: { difficultyRange: [1, 2], questionCount: 15 },
  medium: { difficultyRange: [2, 4], questionCount: 20 },
  hard: { difficultyRange: [4, 6], questionCount: 25 },
};

function pickDifficulty(range) {
  return randInt(range[0], range[1]);
}

/**
 * Generate satu set soal untuk level tertentu. Dipanggil setiap kali sesi
 * baru dibuat -> setiap attempt punya kombinasi soal berbeda meski
 * jenisnya sama, karena tiap generator memakai angka/kata acak.
 */
export function generateQuestionSet(level = 'medium', visualRatio = 0.2) {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.medium;
  const allTextGens = [...NUMERIC_GENS, ...LOGIC_GENS, ...VERBAL_GENS];
  const visualCount = Math.round(config.questionCount * visualRatio);
  const textCount = config.questionCount - visualCount;

  const questions = [];
  for (let i = 0; i < textCount; i++) {
    const gen = allTextGens[randInt(0, allTextGens.length - 1)];
    const difficulty = pickDifficulty(config.difficultyRange);
    const q = gen(difficulty);
    questions.push({ ...q, id: `${level}_${i}_${Date.now()}_${randInt(1000, 9999)}` });
  }

  // Soal visual di-generate lewat modul terpisah (lihat visualPuzzle.js)
  // supaya lib ini tetap fokus pada soal teks.
  return { questions, visualCount, level, config };
}

export { LEVEL_CONFIG };
