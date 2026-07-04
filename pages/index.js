import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Brain, Zap, Target, Clock, ArrowRight, ListChecks,
  User, Pencil, Trophy, Check, X, Loader2, Sparkles, Puzzle,
} from 'lucide-react';
import { getLocalUser, registerUser, renameUser } from '../lib/userClient';

const LEVELS = [
  { key: 'easy', label: 'Easy', desc: '15 soal · pemanasan santai', color: '#16a34a' },
  { key: 'medium', label: 'Medium', desc: '20 soal · standar, seimbang', color: '#2563eb' },
  { key: 'hard', label: 'Hard', desc: '25 soal · benar-benar menantang', color: '#dc2626' },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);

  const [editingName, setEditingName] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [renaming, setRenaming] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState('medium');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(false);

  useEffect(() => {
    const local = getLocalUser();
    setUser(local);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoadingBoard(true);
    fetch(`/api/v1/leaderboard?level=${selectedLevel}&limit=10`)
      .then((r) => r.json())
      .then((d) => setLeaderboard(d.leaderboard || []))
      .catch(() => setLeaderboard([]))
      .finally(() => setLoadingBoard(false));
  }, [user, selectedLevel]);

  async function handleRegister(e) {
    e.preventDefault();
    if (usernameInput.trim().length < 2) {
      setError('Username minimal 2 karakter.');
      return;
    }
    setRegistering(true);
    setError(null);
    try {
      const data = await registerUser(usernameInput.trim());
      setUser({ userId: data.userId, username: data.username });
    } catch (err) {
      setError(err.message);
    } finally {
      setRegistering(false);
    }
  }

  async function handleRename(e) {
    e.preventDefault();
    if (renameInput.trim().length < 2) {
      setError('Username minimal 2 karakter.');
      return;
    }
    setRenaming(true);
    setError(null);
    try {
      const data = await renameUser(user.userId, renameInput.trim());
      setUser({ userId: data.userId, username: data.username });
      setEditingName(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setRenaming(false);
    }
  }

  function startTest() {
    router.push(`/test?level=${selectedLevel}`);
  }

  if (checking) {
    return (
      <div className="shell" style={{ paddingTop: 80, textAlign: 'center' }}>
        <Loader2 size={24} className="spin" style={{ color: 'var(--blue-500)' }} />
      </div>
    );
  }

  // --- Belum punya username: onboarding wajib ---
  if (!user) {
    return (
      <>
        <div className="floating-orb orb-1" />
        <div className="floating-orb orb-2" />
        <div className="shell" style={{ paddingTop: 60 }}>
          <div className="hero">
            <span className="hero-badge" data-aos="zoom-in">
              <Brain size={13} />
              CogniTest
            </span>
            <h1 data-aos="fade-up" data-aos-delay="80">
              Sebelum mulai,<br /><span className="accent">siapa namamu?</span>
            </h1>
            <p data-aos="fade-up" data-aos-delay="150">
              Nama ini akan muncul di papan peringkat. Kamu bisa menggantinya nanti kapan saja.
            </p>
          </div>

          <div className="nb-card" data-aos="fade-up" data-aos-delay="100" style={{ maxWidth: 420, margin: '0 auto' }}>
            <form onSubmit={handleRegister}>
              <div className="input-with-icon">
                <User size={17} />
                <input
                  type="text"
                  placeholder="Masukkan username..."
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  maxLength={20}
                  autoFocus
                />
              </div>
              {error && <div className="inline-error">{error}</div>}
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 14 }} disabled={registering}>
                {registering ? <Loader2 size={16} className="spin" /> : <ArrowRight size={16} />}
                {registering ? 'Mendaftar...' : 'Mulai'}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // --- Sudah punya username: home lengkap ---
  return (
    <>
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="topbar">
        <div className="brand">
          <span className="brand-icon"><Brain size={19} /></span>
          CogniTest
        </div>
        <div className="user-chip" style={{ marginLeft: 'auto' }}>
          <User size={14} />
          {user.username}
          <button className="icon-btn-sm" onClick={() => { setEditingName(true); setRenameInput(user.username); }}>
            <Pencil size={12} />
          </button>
        </div>
      </div>

      <div className="shell">
        {editingName && (
          <div className="nb-card" data-aos="fade-down" style={{ marginBottom: 18 }}>
            <form onSubmit={handleRename} style={{ display: 'flex', gap: 8 }}>
              <div className="input-with-icon" style={{ flex: 1 }}>
                <User size={16} />
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  maxLength={20}
                  autoFocus
                />
              </div>
              <button type="submit" className="icon-btn" disabled={renaming}>
                {renaming ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
              </button>
              <button type="button" className="icon-btn" onClick={() => setEditingName(false)}>
                <X size={16} />
              </button>
            </form>
            {error && <div className="inline-error">{error}</div>}
          </div>
        )}

        <div className="hero">
          <span className="hero-badge" data-aos="zoom-in">
            <Zap size={13} />
            Pilih tingkat kesulitan
          </span>
          <h1 data-aos="fade-up" data-aos-delay="80">
            Uji seberapa tajam<br /><span className="accent">cara berpikirmu.</span>
          </h1>
        </div>

        <div className="level-grid" data-aos="fade-up" data-aos-delay="100">
          {LEVELS.map((lv) => (
            <button
              key={lv.key}
              className={`level-card ${selectedLevel === lv.key ? 'active' : ''}`}
              onClick={() => setSelectedLevel(lv.key)}
              style={{ '--level-color': lv.color }}
            >
              <span className="level-card-label">{lv.label}</span>
              <span className="level-card-desc">{lv.desc}</span>
            </button>
          ))}
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: 18 }} onClick={startTest} data-aos="fade-up" data-aos-delay="150">
          Mulai Tes {LEVELS.find((l) => l.key === selectedLevel).label}
          <ArrowRight size={17} />
        </button>

        <div className="nb-card" style={{ marginTop: 26 }} data-aos="fade-up" data-aos-delay="180">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Trophy size={18} style={{ color: 'var(--blue-600)' }} />
            <h3 style={{ fontSize: 15.5, margin: 0 }}>
              Peringkat {LEVELS.find((l) => l.key === selectedLevel).label}
            </h3>
          </div>

          {loadingBoard ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <Loader2 size={20} className="spin" style={{ color: 'var(--ink-faint)' }} />
            </div>
          ) : leaderboard.length === 0 ? (
            <p style={{ color: 'var(--ink-faint)', fontSize: 13.5, textAlign: 'center', padding: '10px 0' }}>
              Belum ada yang menyelesaikan level ini. Jadilah yang pertama.
            </p>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((entry, i) => (
                <div key={i} className={`leaderboard-row ${entry.username === user.username ? 'me' : ''}`}>
                  <span className={`rank-badge rank-${i + 1 <= 3 ? i + 1 : 'default'}`}>{i + 1}</span>
                  <span className="leaderboard-name">{entry.username}</span>
                  <span className="leaderboard-score">{entry.performanceScore}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nb-card" style={{ marginTop: 18 }} data-aos="fade-up" data-aos-delay="200">
          <h3 style={{ fontSize: 15, margin: '0 0 16px' }}>Yang akan diuji</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { icon: Target, title: 'Logika', desc: 'Penalaran deduktif dan silogisme' },
              { icon: ListChecks, title: 'Numerik', desc: 'Pola deret angka dan aritmatika' },
              { icon: Brain, title: 'Verbal', desc: 'Analogi kata dan kosakata' },
              { icon: Puzzle, title: 'Visual', desc: 'Pola bentuk, hitung objek, cari yang beda' },
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
        </div>

        <div className="disclaimer-box" data-aos="fade-up">
          <Target size={15} />
          <span>
            Tes ini dibuat untuk hiburan dan gambaran kasar pola pikirmu — bukan instrumen
            psikometri tervalidasi dan tidak menggantikan tes IQ klinis resmi. Soal dan urutannya
            diacak setiap kali kamu memulai tes.
          </span>
        </div>
      </div>
    </>
  );
}
