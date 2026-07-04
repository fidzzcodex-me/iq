import { getResult } from '../../../../../lib/sessionStore';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { id } = req.query;
  const outcome = getResult(id);

  if (outcome.error === 'not_found') {
    return res.status(404).json({ error: 'session_not_found', message: 'Sesi tidak ditemukan atau sudah expired.' });
  }
  if (outcome.error === 'not_completed') {
    return res.status(409).json({ error: 'not_completed', message: 'Sesi ini belum selesai dikerjakan.' });
  }

  return res.status(200).json({ result: outcome.result });
}
