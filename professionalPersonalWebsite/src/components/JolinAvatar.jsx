// Cartoon girl with a black ponytail
const JolinAvatar = ({ size = 40, sway = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className="rounded-full" aria-hidden="true">
    <circle cx="32" cy="32" r="32" fill="#2a1630" />
    {/* ponytail */}
    <g className={sway ? 'ponytail-sway' : undefined} style={{ transformOrigin: '46px 20px' }}>
      <path d="M44 16 C58 14 60 30 54 40 C51 45 47 44 49 38 C52 30 50 24 44 22 Z" fill="#111" />
      <circle cx="45" cy="18" r="3.2" fill="#ec4899" />
    </g>
    {/* neck + shirt */}
    <rect x="28" y="44" width="8" height="8" fill="#f6d2b8" />
    <path d="M14 64 C16 52 24 49 32 49 C40 49 48 52 50 64 Z" fill="#ec4899" />
    {/* face */}
    <ellipse cx="32" cy="32" rx="14" ry="15" fill="#fde2cf" />
    {/* hair: top + bangs */}
    <path d="M17 32 C15 18 24 11 33 11 C42 11 49 17 47 30 C44 23 40 20 36 19 C33 23 25 25 19 26 C18 28 17 30 17 32 Z" fill="#111" />
    {/* eyes */}
    <ellipse cx="26" cy="33" rx="2" ry="2.6" fill="#1f1f1f" />
    <ellipse cx="38" cy="33" rx="2" ry="2.6" fill="#1f1f1f" />
    <circle cx="26.7" cy="32.1" r="0.7" fill="#fff" />
    <circle cx="38.7" cy="32.1" r="0.7" fill="#fff" />
    {/* blush + smile */}
    <ellipse cx="22.5" cy="38" rx="2.6" ry="1.5" fill="#f9a8d4" opacity="0.8" />
    <ellipse cx="41.5" cy="38" rx="2.6" ry="1.5" fill="#f9a8d4" opacity="0.8" />
    <path d="M28.5 39.5 Q32 43 35.5 39.5" stroke="#b4235f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

export default JolinAvatar;
