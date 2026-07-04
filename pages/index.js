import { useRouter } from 'next/router';
import { Brain, Zap, Target, Clock, ArrowRight, ListChecks } from 'lucide-react';
import { getTestSet } from '../lib/questions';

export default function Home() {
  const router = useRouter();
  const totalQuestions = getTestSet(25).length;

  return (
    <>
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="topbar">
        <div className="brand">
          <span className="brand-icon">
            <Brain size={19} />
          </span>
          CogniTest
        </div>
      </div>

      <div className="shell">
        <div className="hero">
          <span className="hero-badge" data-aos="zoom-in">
            <Zap size={13} />
            Diukur dari ketepatan dan kecepatan
          </span>
          <h1 data-aos="fade-up" data-aos-delay="80">
            Seberapa tajam<br /><span className="accent">cara berpikirmu?</span>
          </h1>
          <p data-aos="fade-up" data-aos-delay="150">
            Uji kemampuan logika, angka, verbal, dan pola spasial dalam satu tes cepat.
            Skor akhir memperhitungkan seberapa tepat dan seberapa cepat kamu menjawab.
          </p>

          <div className="stat-row" data-aos="fade-up" data-aos-delay="220">
            <div className="stat-chip">
              <span className="stat-value">{totalQuestions}</span>
              <span className="stat-label">Soal</span>
            </div>
            <div className="stat-chip">
              <span className="stat-value">~10</span>
              <span className="stat-label">Menit</span>
            </div>
            <div className="stat-chip">
              <span className="stat-value">4</span>
              <span className="stat-label">Kategori</span>
            </div>
          </div>
        </div>

        <div className="nb-card" data-aos="fade-up" data-aos-delay="100">
          <h3 style={{ fontSize: 16, margin: '0 0 16px' }}>Yang akan diuji</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { icon: Target, title: 'Logika', desc: 'Penalaran deduktif dan silogisme' },
              { icon: ListChecks, title: 'Numerik', desc: 'Pola deret angka dan aritmatika' },
              { icon: Brain, title: 'Verbal', desc: 'Analogi kata dan kosakata' },
              { icon: Clock, title: 'Spasial', desc: 'Pola bentuk dan urutan simbol' },
            ].map((item) => (
              <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <span style={{
                  display: 'grid', placeItems: 'center', width: 38, height: 38, minWidth: 38,
                  borderRadius: 10, background: 'var(--blue-100)', color: 'var(--blue-700)',
                }}>
                  <item.icon size={18} />
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{item.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: 24 }}
            onClick={() => router.push('/test')}
          >
            Mulai Tes
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="disclaimer-box" data-aos="fade-up">
          <Target size={15} />
          <span>
            Tes ini dibuat untuk hiburan dan gambaran kasar pola pikirmu — bukan instrumen
            psikometri tervalidasi dan tidak menggantikan tes IQ klinis resmi.
          </span>
        </div>
      </div>
    </>
  );
}
