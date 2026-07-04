import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Brain, Hash, MessageSquare, Shapes, RotateCcw, TrendingUp,
  CheckCircle2, Clock, Zap, AlertTriangle, Trophy,
} from 'lucide-react';
import { questions as allQuestions } from '../lib/questions';
import { computeFinalScore, getPercentileLabel } from '../lib/scoring';
import ScoreRing from '../components/ScoreRing';

const CATEGORY_META = {
  numeric: { label: 'Numerik', icon: Hash },
  logic: { label: 'Logika', icon: Brain },
  verbal: { label: 'Verbal', icon: MessageSquare },
  spatial: { label: 'Spasial', icon: Shapes },
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('iq_test_answers');
    if (!raw) {
      router.replace('/');
      return;
    }
    const stored = JSON.parse(raw);
    const answers = stored.map((s) => ({
      question: allQuestions.find((q) => q.id === s.questionId),
      selectedOption: s.selectedOption,
      timeTakenSeconds: s.timeTakenSeconds,
    })).filter((a) => a.question);

    setResult(computeFinalScore(answers, stored.length));
  }, [router]);

  if (!result) {
    return (
      <div className="shell" style={{ paddingTop: 60, textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-faint)' }}>Memuat hasil...</p>
      </div>
    );
  }

  const percentile = getPercentileLabel(result.estimatedIQ);

  return (
    <>
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="shell" style={{ paddingTop: 30 }}>
        <div className="result-hero" data-aos="zoom-in">
          <span className="hero-badge">
            <Trophy size={13} />
            Tes selesai
          </span>
        </div>

        <div className="nb-card" data-aos="fade-up" data-aos-delay="80">
          <div style={{ textAlign: 'center' }}>
            <ScoreRing value={result.estimatedIQ} label="Estimasi IQ" />
            <div className="percentile-badge">
              <TrendingUp size={14} />
              {percentile.label} · {percentile.percentile}
            </div>
          </div>

          <div className="metric-grid">
            <div className="metric-box">
              <div className="metric-value">{result.performanceScore}</div>
              <div className="metric-label">Skor Performa</div>
            </div>
            <div className="metric-box">
              <div className="metric-value">{result.accuracy}%</div>
              <div className="metric-label">Ketepatan</div>
            </div>
            <div className="metric-box">
              <div className="metric-value">{result.avgTimePerQuestion}s</div>
              <div className="metric-label">Rata-rata / Soal</div>
            </div>
          </div>

          <div className="category-breakdown">
            {Object.entries(result.categoryStats).map(([cat, stat]) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.icon;
              const pct = Math.round((stat.correct / stat.total) * 100);
              return (
                <div key={cat} className="category-row" data-aos="fade-right">
                  <span className="category-row-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={13} />
                    {meta.label}
                  </span>
                  <div className="category-row-track">
                    <div className="category-row-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="category-row-value">{pct}%</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 26 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => router.push('/')}>
              <RotateCcw size={15} />
              Ulangi Tes
            </button>
          </div>
        </div>

        <div className="nb-card" style={{ marginTop: 18 }} data-aos="fade-up" data-aos-delay="120">
          <h3 style={{ fontSize: 15, margin: '0 0 14px' }}>Ringkasan</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <SummaryRow icon={CheckCircle2} label="Jawaban benar" value={`${result.correctCount} dari ${result.totalQuestions}`} />
            <SummaryRow icon={Clock} label="Total waktu" value={`${Math.floor(result.totalTimeSeconds / 60)}m ${result.totalTimeSeconds % 60}s`} />
            <SummaryRow icon={Zap} label="Skor performa" value={`${result.performanceScore} / 1000`} />
          </div>
        </div>

        <div className="disclaimer-box" data-aos="fade-up">
          <AlertTriangle size={15} />
          <span>
            Estimasi IQ ini dihasilkan dari algoritma internal sederhana untuk tujuan hiburan
            dan bukan hasil tes psikometri tervalidasi. Untuk pengukuran kognitif yang akurat,
            konsultasikan dengan psikolog profesional.
          </span>
        </div>
      </div>
    </>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        display: 'grid', placeItems: 'center', width: 34, height: 34, minWidth: 34,
        borderRadius: 9, background: 'var(--blue-100)', color: 'var(--blue-700)',
      }}>
        <Icon size={16} />
      </span>
      <span style={{ flex: 1, fontSize: 13.5, color: 'var(--ink-dim)' }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: 14 }}>{value}</span>
    </div>
  );
}
