import { supabase } from '../../../lib/supabase';

const VALID_LEVELS = ['easy', 'medium', 'hard'];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { level = 'medium', limit = '20' } = req.query;
  if (!VALID_LEVELS.includes(level)) {
    return res.status(400).json({ error: 'invalid_level' });
  }

  const capped = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  // Ambil semua hasil di level ini, urut skor tertinggi, lalu dedup per
  // user (skor terbaik saja) di sisi aplikasi — Supabase free tier tidak
  // selalu punya DISTINCT ON yang gampang lewat client library, jadi
  // dedup dilakukan di sini.
  const { data, error } = await supabase
    .from('test_results')
    .select('user_id, performance_score, estimated_iq, accuracy, created_at, users(username)')
    .eq('level', level)
    .order('performance_score', { ascending: false })
    .limit(500); // ambil cukup banyak untuk memastikan dedup tetap akurat

  if (error) {
    return res.status(500).json({ error: 'db_error', message: error.message });
  }

  const seen = new Set();
  const leaderboard = [];
  for (const row of data) {
    if (seen.has(row.user_id)) continue;
    seen.add(row.user_id);
    leaderboard.push({
      username: row.users?.username || 'Anonim',
      performanceScore: row.performance_score,
      estimatedIQ: row.estimated_iq,
      accuracy: row.accuracy,
      achievedAt: row.created_at,
    });
    if (leaderboard.length >= capped) break;
  }

  return res.status(200).json({ level, leaderboard });
}
