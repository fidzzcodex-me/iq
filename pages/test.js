import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { Brain, Hash, MessageSquare, Puzzle, ChevronRight, SkipForward, Loader2 } from 'lucide-react';
import { getLocalUser } from '../lib/userClient';
import TimerRing from '../components/TimerRing';
import VisualPuzzle from '../components/VisualPuzzle';

const CATEGORY_META = {
  numeric: { label: 'Numerik', icon: Hash },
  logic: { label: 'Logika', icon: Brain },
  verbal: { label: 'Verbal', icon: MessageSquare },
  spatial: { label: 'Spasial', icon: Puzzle },
};

export default function TestPage() {
  const router = useRouter();
  const { level } = router.query;

  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const timerRef = useRef(null);

  // Mulai sesi begitu level sudah diketahui dari query string.
  useEffect(() => {
    if (!level) return;
    const user = getLocalUser();
    if (!user) {
      router.replace('/');
      return;
    }

    fetch('/api/v1/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, userId: user.userId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.message || 'Gagal memulai tes.');
        setSessionId(data.sessionId);
        setTotalQuestions(data.totalQuestions);
        setQuestion(data.question);
        setSecondsLeft(data.question.timeLimitSeconds);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [level, router]);

  const advance = useCallback(async (body) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/session/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan.');

      if (data.done) {
        sessionStorage.setItem('cognitest_result', JSON.stringify({ ...data.result, level }));
        router.push('/result');
      } else {
        setQuestion(data.question);
        setSelected(null);
        setSecondsLeft(data.question.timeLimitSeconds);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [sessionId, level, router]);

  useEffect(() => {
    if (!question || submitting) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          advance({ skip: true }); // waktu habis -> dihitung skip/salah
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id]);

  function handleSelect(option) {
    if (selected || submitting) return;
    setSelected(option);
    clearInterval(timerRef.current);
    setTimeout(() => advance({ selectedOption: option }), 300);
  }

  function handleSkip() {
    if (selected || submitting) return;
    clearInterval(timerRef.current);
    advance({ skip: true });
  }

  if (loading) {
    return (
      <div className="shell" style={{ paddingTop: 80, textAlign: 'center' }}>
        <Loader2 size={24} className="spin" style={{ color: 'var(--blue-500)' }} />
        <p style={{ color: 'var(--ink-faint)', marginTop: 12 }}>Menyiapkan soal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shell" style={{ paddingTop: 60, textAlign: 'center' }}>
        <p style={{ color: '#b91c1c', fontWeight: 600 }}>{error}</p>
        <button className="btn-secondary" style={{ marginTop: 16 }} onClick={() => router.push('/')}>
          Kembali ke beranda
        </button>
      </div>
    );
  }

  if (!question) return null;

  const meta = CATEGORY_META[question.category] || CATEGORY_META.numeric;
  const Icon = meta.icon;
  const progressPct = (question.index / question.total) * 100;

  return (
    <>
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="shell" style={{ paddingTop: 30 }}>
        <div className="progress-meta">
          <span>Soal {question.index + 1} dari {question.total}</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="nb-card" style={{ marginTop: 24 }} key={question.id} data-aos="fade-up">
          <div className="question-header">
            <span className="category-tag">
              <Icon size={12} />
              {meta.label}
            </span>
            <TimerRing secondsLeft={secondsLeft} totalSeconds={question.timeLimitSeconds} />
          </div>

          <div className="question-text">{question.question}</div>

          {question.isVisual ? (
            <div style={{ marginTop: 20 }}>
              <VisualPuzzle question={question} selected={selected} onSelect={handleSelect} disabled={!!selected || submitting} />
            </div>
          ) : (
            <div className="option-grid">
              {question.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const isSelected = selected === opt;
                return (
                  <button
                    key={opt}
                    className={`option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt)}
                    disabled={!!selected || submitting}
                  >
                    <span className="option-letter">{letter}</span>
                    {opt}
                    {isSelected && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                  </button>
                );
              })}
            </div>
          )}

          <button className="skip-btn" onClick={handleSkip} disabled={!!selected || submitting}>
            <SkipForward size={14} />
            Lewati soal ini
          </button>
        </div>
      </div>
    </>
  );
}
