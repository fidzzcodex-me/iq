import { generateQuestionSet, LEVEL_CONFIG } from './questionGenerators';
import { generateVisualQuestion } from './visualPuzzle';
import { computeFinalScore } from './scoring';

// Session store in-memory untuk state soal-per-soal selama tes berjalan.
// Hasil akhir (skor) BARU disimpan permanen ke Supabase setelah tes
// selesai (lihat pages/api/v1/session/[id]/answer.js) — sesi ini sendiri
// murni working-memory sementara.

const sessions = new Map();
const SESSION_TTL_MS = 30 * 60_000;

function generateSessionId() {
  return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
}

function cleanupExpired() {
  const now = Date.now();
  for (const [id, s] of sessions.entries()) {
    if (now - s.lastActivityAt > SESSION_TTL_MS) sessions.delete(id);
  }
}

/**
 * Interleave soal visual ke posisi acak (bukan selalu di akhir), supaya
 * peserta tidak bisa menebak "soal visual pasti di soal terakhir".
 */
function buildFullQuestionSet(level) {
  const { questions: textQuestions, visualCount, config } = generateQuestionSet(level);
  const visualQuestions = Array.from({ length: visualCount }, (_, i) => {
    const difficulty = Math.round((config.difficultyRange[0] + config.difficultyRange[1]) / 2);
    const vq = generateVisualQuestion(difficulty);
    return { ...vq, id: `${level}_visual_${i}_${Date.now()}_${Math.floor(Math.random() * 9999)}` };
  });

  const all = [...textQuestions, ...visualQuestions];
  // Fisher-Yates shuffle final urutan soal.
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

export function createSession(level, userId) {
  cleanupExpired();
  if (!LEVEL_CONFIG[level]) level = 'medium';

  const id = generateSessionId();
  const questions = buildFullQuestionSet(level);
  const session = {
    id,
    userId,
    level,
    questions,
    currentIndex: 0,
    answers: [],
    skippedCount: 0,
    status: 'in_progress',
    questionStartedAt: Date.now(),
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
  };
  sessions.set(id, session);
  return session;
}

export function getSession(id) {
  cleanupExpired();
  return sessions.get(id) || null;
}

export function publicQuestion(question, index, total) {
  const base = {
    index, total,
    id: question.id,
    category: question.category,
    difficulty: question.difficulty,
    question: question.question,
    timeLimitSeconds: 45,
    isVisual: !!question.visualType,
  };

  if (question.visualType === 'odd-shape-out') {
    return { ...base, visualType: question.visualType, shapes: question.shapes, options: question.options };
  }
  if (question.visualType === 'count-shapes') {
    return { ...base, visualType: question.visualType, shapes: question.shapes, options: question.options };
  }
  if (question.visualType === 'shape-sequence') {
    return { ...base, visualType: question.visualType, shapes: question.shapes, optionShapes: question.optionShapes, options: question.options };
  }
  return { ...base, options: question.options };
}

const SKIP_PENALTY_MARKER = '__SKIPPED__';

/**
 * Submit jawaban ATAU skip (selectedOption === null berarti skip).
 * Skip tetap dihitung sebagai jawaban salah (penalti), sesuai desain:
 * skip tidak boleh menguntungkan dibanding menjawab asal-asalan.
 */
export function submitAnswer(sessionId, selectedOption, isSkip = false) {
  const session = getSession(sessionId);
  if (!session) return { error: 'not_found' };
  if (session.status === 'completed') return { error: 'already_completed' };

  const currentQuestion = session.questions[session.currentIndex];
  const timeTakenSeconds = Math.min((Date.now() - session.questionStartedAt) / 1000, 45);

  if (isSkip) session.skippedCount++;

  session.answers.push({
    question: currentQuestion,
    selectedOption: isSkip ? SKIP_PENALTY_MARKER : selectedOption,
    timeTakenSeconds,
  });

  session.currentIndex++;
  session.lastActivityAt = Date.now();

  if (session.currentIndex >= session.questions.length) {
    session.status = 'completed';
    session.result = computeFinalScore(session.answers, session.questions.length);
    session.result.skippedCount = session.skippedCount;
    session.result.level = session.level;
    return { done: true, result: session.result, session };
  }

  session.questionStartedAt = Date.now();
  return {
    done: false,
    nextQuestion: publicQuestion(session.questions[session.currentIndex], session.currentIndex, session.questions.length),
  };
}

export function getResult(sessionId) {
  const session = getSession(sessionId);
  if (!session) return { error: 'not_found' };
  if (session.status !== 'completed') return { error: 'not_completed' };
  return { result: session.result };
}
