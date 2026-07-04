import { supabase } from '../../../lib/supabase';

function isValidUsername(name) {
  return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 20;
}

const rateLimitMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  if (req.method === 'POST') {
    // Registrasi user baru (dipanggil sekali di awal, sebelum ada userId di localStorage).
    const { username } = req.body || {};
    if (!isValidUsername(username)) {
      return res.status(400).json({ error: 'invalid_username', message: 'Username 2-20 karakter.' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert({ username: username.trim() })
      .select('id, username')
      .single();

    if (error) {
      return res.status(500).json({ error: 'db_error', message: error.message });
    }

    return res.status(201).json({ userId: data.id, username: data.username });
  }

  if (req.method === 'PATCH') {
    // Ganti nama — userId harus sudah ada (dikirim client dari localStorage).
    const { userId, username } = req.body || {};
    if (typeof userId !== 'string') {
      return res.status(400).json({ error: 'invalid_user_id' });
    }
    if (!isValidUsername(username)) {
      return res.status(400).json({ error: 'invalid_username', message: 'Username 2-20 karakter.' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ username: username.trim(), updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('id, username')
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'user_not_found' });
    }

    return res.status(200).json({ userId: data.id, username: data.username });
  }

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (typeof userId !== 'string') {
      return res.status(400).json({ error: 'invalid_user_id' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'user_not_found' });
    }

    return res.status(200).json({ userId: data.id, username: data.username });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
  return res.status(405).json({ error: 'method_not_allowed' });
}
