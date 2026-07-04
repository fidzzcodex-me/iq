import { useEffect, useState } from 'react';

export default function ScoreRing({ value, max = 145, min = 70, label }) {
  const [animated, setAnimated] = useState(min);
  const radius = 78;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(value), 150);
    return () => clearTimeout(timeout);
  }, [value]);

  const progress = (animated - min) / (max - min);
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <div className="score-ring-wrap">
      <svg width="180" height="180">
        <circle cx="90" cy="90" r={radius} strokeWidth="12" fill="none" stroke="var(--blue-100)" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          strokeWidth="12"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="score-ring-text">
        <div className="score-ring-number">{animated}</div>
        <div className="score-ring-label">{label}</div>
      </div>
    </div>
  );
}
