import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { Brain, Hash, MessageSquare, Shapes, ChevronRight } from 'lucide-react';
import { getTestSet } from '../lib/questions';
import TimerRing from '../components/TimerRing';

const CATEGORY_META = {
  numeric: { label: 'Numerik', icon: Hash },
  logic: { label: 'Logika', icon: Brain },
  verbal: { label: 'Verbal', icon: MessageSquare },
  spatial: { label: 'Spasial', icon: Shapes },
};

const MAX_SECONDS_PER_QUESTION = 45;

export default function TestPage() {
  const router = useRouter();
  const [questions] = useState(() => getTestSet(25));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(MAX_SECONDS_PER_QUESTION);
  const questionStartRef = useRef(Date.now());
  const timerRef = useRef(null);

  const current = questions[currentIndex];
  const meta = CATEGORY_META[current.category];
  const Icon = meta.icon;

  const goNext = useCallback((chosenOption) => {
    const timeTakenSeconds = (Date.now() - questionStartRef.current) / 1000;
    const newAnswers = [...answers, {
      question: current,
      selectedOption: chosenOption,
      timeTakenSeconds: Math.min(timeTakenSeconds, MAX_SECONDS_PER_QUESTION),
    }];
    setAnswers(newAnswers);

    if (currentIndex + 1 >= questions.length) {
      sessionStorage.setItem('iq_test_answers', JSON.stringify(
        newAnswers.map((a) => ({
          questionId: a.question.id,
          selectedOption: a.selectedOption,
          timeTakenSeconds: a.timeTakenSeconds,
        }))
      ));
      router.push('/result');
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setSecondsLeft(MAX_SECONDS_PER_QUESTION);
      questionStartRef.current = Date.now();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, current, currentIndex, questions.length, router]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          goNext(null); // waktu habis, dihitung sebagai tidak dijawab
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex, goNext]);

  function handleSelect(option) {
    if (selected) return; // cegah klik ganda
    setSelected(option);
    clearInterval(timerRef.current);
    setTimeout(() => goNext(option), 350); // jeda singkat untuk feedback visual
  }

  const progressPct = ((currentIndex) / questions.length) * 100;

  return (
    <>
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="shell" style={{ paddingTop: 30 }}>
        <div className="progress-meta">
          <span>Soal {currentIndex + 1} dari {questions.length}</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="nb-card" style={{ marginTop: 24 }} key={current.id} data-aos="fade-up">
          <div className="question-header">
            <span className="category-tag">
              <Icon size={12} />
              {meta.label}
            </span>
            <TimerRing secondsLeft={secondsLeft} totalSeconds={MAX_SECONDS_PER_QUESTION} />
          </div>

          <div className="question-text">{current.question}</div>

          <div className="option-grid">
            {current.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected = selected === opt;
              return (
                <button
                  key={opt}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                  disabled={!!selected}
                >
                  <span className="option-letter">{letter}</span>
                  {opt}
                  {isSelected && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
