export default function ShapeIcon({ shape, color, size = 44 }) {
  const s = size;
  const half = s / 2;

  switch (shape) {
    case 'circle':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={half} cy={half} r={half - 4} fill={color} />
        </svg>
      );
    case 'square':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x="5" y="5" width={s - 10} height={s - 10} rx="4" fill={color} />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={`${half},5 ${s - 5},${s - 5} 5,${s - 5}`} fill={color} />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={`${half},4 ${s - 4},${half} ${half},${s - 4} 4,${half}`} fill={color} />
        </svg>
      );
    case 'star': {
      const points = [];
      const outerR = half - 4;
      const innerR = outerR * 0.45;
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        points.push(`${half + r * Math.cos(angle)},${half + r * Math.sin(angle)}`);
      }
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={points.join(' ')} fill={color} />
        </svg>
      );
    }
    default:
      return null;
  }
}
