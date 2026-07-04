import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code2, ArrowLeft, Copy, Check, ChevronRight,
  PlayCircle, MessageSquareCode, ListChecks, Trophy,
} from 'lucide-react';

function CodeBlock({ children, id, copied, onCopy }) {
  return (
    <div className="code-block">
      <button className="code-copy-btn" onClick={() => onCopy(id, children)}>
        {copied === id ? <Check size={13} /> : <Copy size={13} />}
      </button>
      <pre><code>{children}</code></pre>
    </div>
  );
}

export default function ApiDocs() {
  const [baseUrl, setBaseUrl] = useState('https://your-domain.vercel.app');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  function handleCopy(id, text) {
    navigator.clipboard.writeText(text.replace(/\{\{BASE_URL\}\}/g, baseUrl));
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  const endpoints = [
    {
      id: 'register-user',
      method: 'POST',
      path: '/api/v1/user',
      title: 'Daftarkan user baru',
      icon: PlayCircle,
      desc: 'Membuat identitas user baru. Panggil ini sekali di awal (misal saat bot pertama kali menerima pesan dari seseorang), simpan userId untuk semua request berikutnya.',
      body: `{
  "username": "budi123"
}`,
      bodyNote: 'Username 2-20 karakter.',
      response: `{
  "userId": "b3f1c2a4-...-uuid",
  "username": "budi123"
}`,
    },
    {
      id: 'rename-user',
      method: 'PATCH',
      path: '/api/v1/user',
      title: 'Ganti nama user',
      icon: MessageSquareCode,
      desc: 'Mengganti username tanpa mengubah identitas (userId tetap sama, riwayat & peringkat tetap terhubung).',
      body: `{
  "userId": "b3f1c2a4-...-uuid",
  "username": "budi_baru"
}`,
      response: `{
  "userId": "b3f1c2a4-...-uuid",
  "username": "budi_baru"
}`,
    },
    {
      id: 'create-session',
      method: 'POST',
      path: '/api/v1/session',
      title: 'Mulai sesi tes baru',
      icon: PlayCircle,
      desc: 'Membuat sesi baru dan mengembalikan soal pertama. Simpan sessionId untuk dipakai di request berikutnya.',
      body: `{
  "level": "medium",
  "userId": "uuid-user-anda"
}`,
      bodyNote: 'level wajib: "easy" | "medium" | "hard". userId didapat dari endpoint /api/v1/user.',
      response: `{
  "sessionId": "sess_m1a2b3_x9y8z7",
  "totalQuestions": 25,
  "question": {
    "index": 0,
    "total": 25,
    "id": "n1",
    "category": "numeric",
    "difficulty": 2,
    "question": "Lanjutkan deret: 2, 6, 12, 20, 30, ...?",
    "options": ["36", "40", "42", "44"],
    "timeLimitSeconds": 45
  }
}`,
    },
    {
      id: 'submit-answer',
      method: 'POST',
      path: '/api/v1/session/{sessionId}/answer',
      title: 'Submit jawaban',
      icon: MessageSquareCode,
      desc: 'Kirim jawaban untuk soal yang sedang aktif di sesi. Mengembalikan soal berikutnya, atau hasil akhir jika sudah soal terakhir.',
      body: `{
  "selectedOption": "42"
}`,
      bodyNote: 'Isi salah satu string dari "options" soal saat ini. Untuk melewati soal, kirim { "skip": true } — dihitung sebagai jawaban salah (bukan diabaikan), agar tetap adil dibanding menjawab asal.',
      response: `{
  "done": false,
  "question": {
    "index": 1,
    "total": 25,
    "id": "n2",
    "category": "numeric",
    "difficulty": 3,
    "question": "Lanjutkan deret: 1, 1, 2, 3, 5, 8, 13, ...?",
    "options": ["18", "20", "21", "24"],
    "timeLimitSeconds": 45
  }
}`,
      responseDone: `{
  "done": true,
  "result": {
    "performanceScore": 782,
    "estimatedIQ": 125,
    "correctCount": 21,
    "totalQuestions": 25,
    "accuracy": 84,
    "totalTimeSeconds": 412,
    "avgTimePerQuestion": 16,
    "categoryStats": {
      "numeric": { "correct": 6, "total": 8 },
      "logic": { "correct": 5, "total": 6 },
      "verbal": { "correct": 6, "total": 7 },
      "spatial": { "correct": 4, "total": 4 }
    }
  }
}`,
    },
    {
      id: 'get-result',
      method: 'GET',
      path: '/api/v1/session/{sessionId}/result',
      title: 'Ambil hasil akhir',
      icon: Trophy,
      desc: 'Ambil ulang hasil akhir sesi yang sudah selesai. Berguna kalau bot ingin menampilkan ulang hasil tanpa menyimpan response terakhir sendiri.',
      response: `{
  "result": {
    "performanceScore": 782,
    "estimatedIQ": 125,
    "correctCount": 21,
    "totalQuestions": 25,
    "accuracy": 84,
    "totalTimeSeconds": 412,
    "avgTimePerQuestion": 16,
    "categoryStats": { "...": "..." }
  }
}`,
    },
    {
      id: 'leaderboard',
      method: 'GET',
      path: '/api/v1/leaderboard?level=medium&limit=10',
      title: 'Ambil papan peringkat',
      icon: Trophy,
      desc: 'Mengambil peringkat skor terbaik per user untuk satu level tertentu. Tiap user hanya muncul sekali (skor terbaiknya).',
      response: `{
  "level": "medium",
  "leaderboard": [
    { "username": "budi123", "performanceScore": 891, "estimatedIQ": 132, "accuracy": 92, "achievedAt": "2026-07-01T10:00:00Z" }
  ]
}`,
    },
  ];

  return (
    <>
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="shell" style={{ paddingTop: 30 }}>
        <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', marginBottom: 20 }} data-aos="fade-right">
          <ArrowLeft size={15} />
          Kembali
        </Link>

        <div className="hero" style={{ padding: '10px 0 30px', textAlign: 'left' }} data-aos="fade-up">
          <span className="hero-badge">
            <Code2 size={13} />
            REST API
          </span>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)' }}>
            Dokumentasi API <span className="accent">CogniTest</span>
          </h1>
          <p style={{ margin: 0 }}>
            Jalankan tes kognitif secara programatis — cocok untuk diintegrasikan ke bot
            (WhatsApp, Discord, Telegram, dll). Semua soal dan penilaian jawaban diproses
            di server; jawaban benar tidak pernah dikirim ke client sebelum dijawab.
          </p>
        </div>

        <div className="nb-card" data-aos="fade-up" data-aos-delay="60">
          <h3 style={{ fontSize: 14, margin: '0 0 10px', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Base URL
          </h3>
          <CodeBlock id="base-url" copied={copied} onCopy={handleCopy}>{baseUrl}</CodeBlock>
        </div>

        <div className="nb-card" style={{ marginTop: 18 }} data-aos="fade-up" data-aos-delay="100">
          <h3 style={{ fontSize: 15, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ListChecks size={17} />
            Alur pemakaian
          </h3>
          <ol style={{ margin: 0, paddingLeft: 20, color: 'var(--ink-dim)', fontSize: 14, lineHeight: 1.9 }}>
            <li>Panggil <code className="mono">POST /api/v1/session</code> untuk mulai sesi &amp; dapat soal pertama.</li>
            <li>Simpan <code className="mono">sessionId</code> dari response.</li>
            <li>Untuk tiap jawaban, panggil <code className="mono">POST /api/v1/session/{'{sessionId}'}/answer</code> — dapat soal berikutnya.</li>
            <li>Saat <code className="mono">done: true</code>, response sudah berisi hasil akhir (skor, IQ estimasi, breakdown kategori).</li>
          </ol>
        </div>

        {endpoints.map((ep, i) => (
          <div className="nb-card" style={{ marginTop: 18 }} key={ep.id} data-aos="fade-up" data-aos-delay={i * 40}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <span style={{
                display: 'grid', placeItems: 'center', width: 38, height: 38, minWidth: 38,
                borderRadius: 10, background: 'var(--blue-100)', color: 'var(--blue-700)',
              }}>
                <ep.icon size={18} />
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15.5 }}>{ep.title}</div>
              </div>
            </div>

            <div className="endpoint-line">
              <span className={`method-badge ${ep.method.toLowerCase()}`}>{ep.method}</span>
              <code className="mono">{ep.path}</code>
            </div>

            <p style={{ color: 'var(--ink-dim)', fontSize: 14, margin: '12px 0' }}>{ep.desc}</p>

            {ep.body && (
              <>
                <div className="doc-label">Request Body</div>
                <CodeBlock id={`${ep.id}-body`} copied={copied} onCopy={handleCopy}>{ep.body}</CodeBlock>
                {ep.bodyNote && <div className="doc-note">{ep.bodyNote}</div>}
              </>
            )}

            <div className="doc-label" style={{ marginTop: 14 }}>Response (200)</div>
            <CodeBlock id={`${ep.id}-res`} copied={copied} onCopy={handleCopy}>{ep.response}</CodeBlock>

            {ep.responseDone && (
              <>
                <div className="doc-label" style={{ marginTop: 14 }}>Response saat soal terakhir dijawab</div>
                <CodeBlock id={`${ep.id}-res-done`} copied={copied} onCopy={handleCopy}>{ep.responseDone}</CodeBlock>
              </>
            )}
          </div>
        ))}

        <div className="nb-card" style={{ marginTop: 18 }} data-aos="fade-up">
          <h3 style={{ fontSize: 15, margin: '0 0 12px' }}>Error umum</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { code: '400', name: 'invalid_body', desc: 'Body request tidak sesuai format yang diharapkan.' },
              { code: '404', name: 'session_not_found', desc: 'sessionId tidak ditemukan atau sudah expired (sesi tidak aktif selama 30 menit akan dihapus).' },
              { code: '409', name: 'already_completed / not_completed', desc: 'Sesi sudah selesai (untuk /answer), atau sesi belum selesai (untuk /result).' },
              { code: '429', name: 'rate_limited', desc: 'Terlalu banyak sesi dibuat dari IP yang sama dalam waktu singkat.' },
            ].map((e) => (
              <div key={e.name} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span className="error-code-badge">{e.code}</span>
                <div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{e.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
