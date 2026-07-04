// Logika skoring test. Ini BUKAN instrumen psikometri tervalidasi —
// disclaimer ini penting dan harus selalu ditampilkan ke pengguna (lihat
// halaman hasil). Skor dihitung dari dua komponen:
//
// 1. Accuracy score  : proporsi jawaban benar, dibobot dengan tingkat
//                       kesulitan soal (soal sulit yang benar bernilai
//                       lebih tinggi daripada soal mudah yang benar).
// 2. Speed multiplier : dibandingkan dengan `idealSeconds` tiap soal.
//                       Menjawab jauh lebih cepat dari ideal DAN benar
//                       akan sedikit menaikkan skor; terlalu lambat akan
//                       sedikit menurunkannya. Ini dibatasi (clamped)
//                       supaya tidak mendominasi skor akhir — akurasi
//                       tetap komponen utama.

export function scoreAnswer(question, selectedOption, timeTakenSeconds) {
  // Catatan keadilan: soal yang di-skip masuk sebagai selectedOption
  // dengan marker khusus (lihat sessionStore.js) yang tidak akan pernah
  // cocok dengan `question.answer` mana pun -> otomatis dihitung salah,
  // skip tidak memberi keuntungan dibanding menjawab asal.
  const isCorrect = selectedOption === question.answer;
  if (!isCorrect) {
    return { isCorrect: false, points: 0, speedFactor: 1 };
  }

  const basePoints = question.difficulty * 10; // soal makin sulit, makin besar bobot

  const ratio = timeTakenSeconds / question.idealSeconds;
  // ratio < 1 berarti lebih cepat dari ideal, ratio > 1 berarti lebih lambat.
  // Clamp speedFactor ke rentang [0.85, 1.2] supaya kecepatan jadi bonus/penalti
  // kecil, bukan penentu utama — akurasi tetap yang paling berbobot.
  let speedFactor = 1.2 - Math.min(Math.max(ratio, 0.4), 2) * 0.175;
  speedFactor = Math.min(Math.max(speedFactor, 0.85), 1.2);

  return {
    isCorrect: true,
    points: Math.round(basePoints * speedFactor),
    speedFactor,
  };
}

/**
 * Hitung skor akhir dari seluruh jawaban.
 * @param {Array<{question, selectedOption, timeTakenSeconds}>} answers
 */
export function computeFinalScore(answers, totalQuestions) {
  let totalPoints = 0;
  let maxPoints = 0;
  let correctCount = 0;
  let totalTime = 0;
  const categoryStats = {};

  for (const a of answers) {
    const result = scoreAnswer(a.question, a.selectedOption, a.timeTakenSeconds);
    totalPoints += result.points;
    maxPoints += a.question.difficulty * 10 * 1.2; // skor maksimum teoretis per soal
    if (result.isCorrect) correctCount++;
    totalTime += a.timeTakenSeconds;

    const cat = a.question.category;
    if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
    categoryStats[cat].total++;
    if (result.isCorrect) categoryStats[cat].correct++;
  }

  const performanceScore = Math.round((totalPoints / maxPoints) * 1000);

  // Estimasi "IQ" dari performanceScore, dipetakan ke distribusi normal
  // kasar berpusat di 100 dengan deviasi standar ~15 (pola umum skala IQ),
  // TAPI ini murni untuk gamifikasi hasil, bukan pengukuran klinis apa pun.
  const estimatedIQ = Math.round(70 + (performanceScore / 1000) * 70);

  return {
    performanceScore,
    estimatedIQ: Math.min(Math.max(estimatedIQ, 70), 145),
    correctCount,
    totalQuestions,
    accuracy: Math.round((correctCount / totalQuestions) * 100),
    totalTimeSeconds: Math.round(totalTime),
    avgTimePerQuestion: Math.round(totalTime / totalQuestions),
    categoryStats,
  };
}

export function getPercentileLabel(estimatedIQ) {
  if (estimatedIQ >= 135) return { label: 'Sangat Superior', percentile: 'Top 1%' };
  if (estimatedIQ >= 120) return { label: 'Superior', percentile: 'Top 9%' };
  if (estimatedIQ >= 110) return { label: 'Di Atas Rata-rata', percentile: 'Top 25%' };
  if (estimatedIQ >= 90) return { label: 'Rata-rata', percentile: '25%–75%' };
  if (estimatedIQ >= 80) return { label: 'Di Bawah Rata-rata', percentile: 'Bottom 25%' };
  return { label: 'Rendah', percentile: 'Bottom 9%' };
}
