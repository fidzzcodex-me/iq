// Generator teka-teki visual — SEMUA bentuk digambar sebagai data SVG
// murni (lingkaran, kotak, segitiga, garis) yang dirender langsung oleh
// browser. Tidak ada gambar/foto dari sumber eksternal yang dipakai sama
// sekali, sehingga tidak ada isu hak cipta dan variasinya bisa jadi
// tak terbatas karena posisi/warna/jumlah bentuk digenerate acak setiap
// kali dipanggil.
//
// Setiap generator mengembalikan objek soal dengan field tambahan:
// `visualType` dan `shapes` (data untuk dirender komponen VisualPuzzle).

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SHAPE_TYPES = ['circle', 'square', 'triangle', 'diamond', 'star'];
const COLORS = ['#3b82f6', '#38bdf8', '#8b5cf6', '#f97316', '#ec4899', '#16a34a'];

/**
 * Teka-teki: "Cari bentuk yang berbeda dari yang lain" — grid berisi N
 * bentuk identik + 1 bentuk berbeda (warna atau tipe berbeda).
 */
function genOddShapeOut(difficulty) {
  const gridSize = difficulty <= 2 ? 6 : difficulty <= 4 ? 9 : 12;
  const baseShape = SHAPE_TYPES[randInt(0, SHAPE_TYPES.length - 1)];
  const baseColor = COLORS[randInt(0, COLORS.length - 1)];
  const oddIndex = randInt(0, gridSize - 1);

  const differByColor = Math.random() > 0.5;
  let oddColor = baseColor, oddShape = baseShape;
  if (differByColor) {
    do { oddColor = COLORS[randInt(0, COLORS.length - 1)]; } while (oddColor === baseColor);
  } else {
    do { oddShape = SHAPE_TYPES[randInt(0, SHAPE_TYPES.length - 1)]; } while (oddShape === baseShape);
  }

  const shapes = Array.from({ length: gridSize }, (_, i) => ({
    id: i,
    shape: i === oddIndex ? oddShape : baseShape,
    color: i === oddIndex ? oddColor : baseColor,
  }));

  return {
    category: 'spatial', difficulty, idealSeconds: 20 + difficulty * 2,
    visualType: 'odd-shape-out',
    question: 'Temukan bentuk yang berbeda dari yang lainnya:',
    shapes,
    options: shapes.map((s) => String(s.id)),
    answer: String(oddIndex),
    optionLabels: shapes.map((s) => `Posisi ${s.id + 1}`),
  };
}

/**
 * Teka-teki: "Hitung berapa banyak bentuk X" dalam kumpulan bentuk campur.
 */
function genCountShapes(difficulty) {
  const totalShapes = difficulty <= 2 ? 10 : difficulty <= 4 ? 16 : 22;
  const targetShape = SHAPE_TYPES[randInt(0, SHAPE_TYPES.length - 1)];
  const targetColor = COLORS[randInt(0, COLORS.length - 1)];

  let targetCount = 0;
  const shapes = Array.from({ length: totalShapes }, (_, i) => {
    const isTarget = Math.random() > 0.6;
    if (isTarget) targetCount++;
    return {
      id: i,
      shape: isTarget ? targetShape : SHAPE_TYPES[randInt(0, SHAPE_TYPES.length - 1)],
      color: isTarget ? targetColor : COLORS[randInt(0, COLORS.length - 1)],
    };
  });

  if (targetCount === 0) return genCountShapes(difficulty); // retry kalau kebetulan 0

  const options = new Set([targetCount]);
  while (options.size < 4) {
    const delta = randInt(-3, 3);
    if (delta !== 0 && targetCount + delta > 0) options.add(targetCount + delta);
  }

  return {
    category: 'spatial', difficulty, idealSeconds: 25 + difficulty * 3,
    visualType: 'count-shapes',
    question: `Ada berapa banyak bentuk warna ${colorName(targetColor)} berbentuk ${shapeName(targetShape)} di bawah ini?`,
    shapes,
    targetShape,
    targetColor,
    options: shuffle([...options]).map(String),
    answer: String(targetCount),
  };
}

/**
 * Teka-teki: "Lanjutkan pola rotasi/urutan bentuk" — deret bentuk dengan
 * pola warna/rotasi, pilih bentuk berikutnya yang tepat.
 */
function genShapeSequence(difficulty) {
  const patternLength = difficulty <= 2 ? 4 : difficulty <= 4 ? 5 : 6;
  const shapePool = shuffle(SHAPE_TYPES).slice(0, 2);
  const colorPool = shuffle(COLORS).slice(0, 2);

  // Pola berulang: shape berganti tiap langkah, warna berganti tiap 2 langkah (makin sulit -> pola lebih rumit)
  const sequence = Array.from({ length: patternLength }, (_, i) => ({
    id: i,
    shape: shapePool[i % shapePool.length],
    color: colorPool[Math.floor(i / (difficulty <= 3 ? 1 : 2)) % colorPool.length],
  }));

  const nextIndex = patternLength;
  const correctNext = {
    shape: shapePool[nextIndex % shapePool.length],
    color: colorPool[Math.floor(nextIndex / (difficulty <= 3 ? 1 : 2)) % colorPool.length],
  };

  const optionShapes = [correctNext];
  while (optionShapes.length < 4) {
    const candidate = {
      shape: SHAPE_TYPES[randInt(0, SHAPE_TYPES.length - 1)],
      color: COLORS[randInt(0, COLORS.length - 1)],
    };
    if (!optionShapes.some((o) => o.shape === candidate.shape && o.color === candidate.color)) {
      optionShapes.push(candidate);
    }
  }

  const shuffledOptions = shuffle(optionShapes.map((o, i) => ({ ...o, id: i })));
  const correctId = shuffledOptions.findIndex(
    (o) => o.shape === correctNext.shape && o.color === correctNext.color
  );

  return {
    category: 'spatial', difficulty, idealSeconds: 25 + difficulty * 3,
    visualType: 'shape-sequence',
    question: 'Bentuk apa yang melanjutkan pola berikut?',
    shapes: sequence,
    optionShapes: shuffledOptions,
    options: shuffledOptions.map((o) => String(o.id)),
    answer: String(correctId),
  };
}

function shapeName(shape) {
  const map = { circle: 'lingkaran', square: 'kotak', triangle: 'segitiga', diamond: 'wajik', star: 'bintang' };
  return map[shape] || shape;
}

function colorName(hex) {
  const map = {
    '#3b82f6': 'biru', '#38bdf8': 'cyan', '#8b5cf6': 'ungu',
    '#f97316': 'oranye', '#ec4899': 'pink', '#16a34a': 'hijau',
  };
  return map[hex] || 'ini';
}

const VISUAL_GENS = [genOddShapeOut, genCountShapes, genShapeSequence];

export function generateVisualQuestion(difficulty) {
  const gen = VISUAL_GENS[randInt(0, VISUAL_GENS.length - 1)];
  return gen(difficulty);
}

export { SHAPE_TYPES, COLORS };
