export default function TimerRing({ secondsLeft, totalSeconds }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(secondsLeft, 0) / totalSeconds;
  const offset = circumference * (1 - progress);
  const urgent = secondsLeft <= 5;

  return (
    <div className="timer-ring-wrap">
      <svg width="56" height="56">
        <circle className="timer-ring-bg" cx="28" cy="28" r={radius} strokeWidth="5" fill="none" />
        <circle
          className={`timer-ring-fg ${urgent ? 'urgent' : ''}`}
          cx="28"
          cy="28"
          r={radius}
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="timer-ring-text">{Math.max(secondsLeft, 0)}</div>
    </div>
  );
}
