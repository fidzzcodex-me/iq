import { createSession, publicQuestion } from '../../../../lib/sessionStore';
import { LEVEL_CONFIG } from '../../../../lib/questionGenerators';

const rateLimitMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false; // 20 sesi baru per menit per IP
  entry.count++;
  return true;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'rate_limited', message: 'Terlalu banyak sesi dibuat. Coba lagi sebentar.' });
  }

  const { level, userId } = req.body || {};

  if (!LEVEL_CONFIG[level]) {
    return res.status(400).json({ error: 'invalid_level', message: 'level harus salah satu dari: easy, medium, hard.' });
  }
  if (typeof userId !== 'string' || userId.length === 0) {
    return res.status(400).json({ error: 'invalid_user_id', message: 'userId wajib diisi.' });
  }

  const session = createSession(level, userId);

  return res.status(201).json({
    sessionId: session.id,
    level: session.level,
    totalQuestions: session.questions.length,
    question: publicQuestion(session.questions[0], 0, session.questions.length),
  });
}
