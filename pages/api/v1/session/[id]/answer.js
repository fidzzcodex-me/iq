import { submitAnswer, getSession } from '../../../../../lib/sessionStore';
import { supabase } from '../../../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { id } = req.query;
  const { selectedOption, skip } = req.body || {};

  if (!skip && typeof selectedOption !== 'string') {
    return res.status(400).json({
      error: 'invalid_body',
      message: 'selectedOption harus berupa string, atau kirim { "skip": true } untuk melewati soal.',
    });
  }

  const session = getSession(id);
  if (!session) {
    return res.status(404).json({ error: 'session_not_found', message: 'Sesi tidak ditemukan atau sudah expired.' });
  }

  const result = submitAnswer(id, selectedOption, !!skip);

  if (result.error === 'already_completed') {
    return res.status(409).json({ error: 'already_completed', message: 'Sesi ini sudah selesai.' });
  }

  if (result.done) {
    // Simpan hasil akhir ke Supabase untuk leaderboard. Dilakukan
    // fire-and-forget-safe (di-await tapi tidak menggagalkan response ke
    // user kalau gagal — user tetap dapat hasilnya, cuma tidak masuk
    // leaderboard kalau insert gagal).
    try {
      await supabase.from('test_results').insert({
        user_id: session.userId,
        level: session.level,
        performance_score: result.result.performanceScore,
        estimated_iq: result.result.estimatedIQ,
        accuracy: result.result.accuracy,
        correct_count: result.result.correctCount,
        total_questions: result.result.totalQuestions,
        skipped_count: result.result.skippedCount,
        total_time_seconds: result.result.totalTimeSeconds,
      });
    } catch (err) {
      console.error('Gagal menyimpan hasil ke leaderboard:', err.message);
    }

    return res.status(200).json({ done: true, result: result.result });
  }

  return res.status(200).json({ done: false, question: result.nextQuestion });
}
