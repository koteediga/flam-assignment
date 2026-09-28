export default function HeroArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 480 480"
      role="img"
      aria-label="Illustration of flashcards floating among glowing connected nodes"
    >
      <defs>
        <radialGradient id="ha-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ha-card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#173820" />
          <stop offset="100%" stopColor="#09150d" />
        </linearGradient>
        <linearGradient id="ha-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0.2" />
        </linearGradient>
        <filter id="ha-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <circle cx="240" cy="240" r="225" fill="url(#ha-glow)" />
      <circle cx="240" cy="240" r="205" fill="none" stroke="#4ade80" strokeOpacity="0.2" strokeDasharray="2 9" />
      <circle cx="240" cy="240" r="150" fill="none" stroke="#4ade80" strokeOpacity="0.12" />

      <g stroke="#4ade80" strokeOpacity="0.35">
        <line x1="72" y1="118" x2="170" y2="192" />
        <line x1="418" y1="112" x2="330" y2="182" />
        <line x1="404" y1="384" x2="322" y2="322" />
        <line x1="78" y1="372" x2="160" y2="312" />
      </g>
      {[[72, 118], [418, 112], [404, 384], [78, 372]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="10" fill="#4ade80" opacity="0.5" filter="url(#ha-soft)" />
          <circle cx={x} cy={y} r="4.5" fill="#4ade80" />
        </g>
      ))}

      <g className="float-a">
        <g transform="translate(232 246) rotate(-16)">
          <rect x="-95" y="-125" width="190" height="250" rx="22" fill="url(#ha-card)" stroke="#fff" strokeOpacity="0.1" />
          <rect x="-60" y="-70" width="120" height="8" rx="4" fill="#fff" opacity="0.1" />
          <rect x="-60" y="-50" width="80" height="8" rx="4" fill="#fff" opacity="0.08" />
        </g>
      </g>

      <g className="float-b">
        <g transform="translate(244 242) rotate(-5)">
          <rect x="-95" y="-125" width="190" height="250" rx="22" fill="url(#ha-card)" stroke="#fff" strokeOpacity="0.14" />
          <circle cx="0" cy="-20" r="32" fill="none" stroke="#4ade80" strokeWidth="3" />
          <path d="M-14 -20 l10 11 l19 -22" fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="-56" y="38" width="112" height="8" rx="4" fill="#fff" opacity="0.14" />
          <rect x="-36" y="58" width="72" height="8" rx="4" fill="#fff" opacity="0.1" />
        </g>
      </g>

      <g className="float-c">
        <g transform="translate(258 232) rotate(9)">
          <rect x="-95" y="-125" width="190" height="250" rx="22" fill="url(#ha-card)" stroke="url(#ha-edge)" strokeWidth="1.5" />
          <text x="-70" y="-64" fill="#4ade80" fontSize="14" fontWeight="500">Question</text>
          <text x="-70" y="10" fill="#f4f7f5" fontSize="64" fontWeight="300">?</text>
          <rect x="-70" y="44" width="130" height="9" rx="4.5" fill="#fff" opacity="0.2" />
          <rect x="-70" y="64" width="96" height="9" rx="4.5" fill="#fff" opacity="0.14" />
          <rect x="-70" y="92" width="76" height="22" rx="11" fill="#4ade80" opacity="0.18" stroke="#4ade80" strokeOpacity="0.5" />
          <text x="-58" y="107" fill="#4ade80" fontSize="11" fontWeight="500">Tap to flip</text>
        </g>
      </g>

      <g className="float-b">
        <rect x="338" y="62" width="96" height="32" rx="16" fill="#0d2114" stroke="#4ade80" strokeOpacity="0.5" />
        <text x="358" y="83" fill="#4ade80" fontSize="13" fontWeight="500">✓ Got it</text>
      </g>
      <g className="float-a">
        <rect x="34" y="236" width="104" height="32" rx="16" fill="#0d2114" stroke="#ff7b7b" strokeOpacity="0.5" />
        <text x="52" y="257" fill="#ff7b7b" fontSize="13" fontWeight="500">↻ Retest</text>
      </g>
    </svg>
  );
}