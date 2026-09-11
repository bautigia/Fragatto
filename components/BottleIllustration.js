export default function BottleIllustration({ color = "#476498", className = "" }) {
  return (
    <svg
      viewBox="0 0 100 200"
      className={className}
      role="img"
      aria-label="Ilustración de atomizador de decant"
    >
      <ellipse cx="50" cy="188" rx="26" ry="6" fill={color} opacity="0.15" />

      {/* tapa */}
      <rect x="34" y="10" width="32" height="34" rx="6" fill="#111318" stroke="rgba(242,244,247,0.25)" strokeWidth="1.5" />
      <circle cx="50" cy="20" r="3" fill="rgba(242,244,247,0.5)" />
      <rect x="46" y="38" width="8" height="10" fill="#0a0b0d" />

      {/* cuerpo de vidrio */}
      <rect
        x="30"
        y="48"
        width="40"
        height="132"
        rx="14"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(242,244,247,0.35)"
        strokeWidth="1.5"
      />

      {/* líquido */}
      <rect x="33" y="90" width="34" height="87" rx="11" fill={color} opacity="0.9" />
      <rect x="33" y="88" width="34" height="6" fill={color} opacity="0.6" />

      {/* brillo lateral */}
      <line x1="40" y1="58" x2="40" y2="172" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" />

      {/* wordmark vertical */}
      <text
        x="53"
        y="140"
        fontSize="7"
        letterSpacing="2"
        fill="rgba(255,255,255,0.55)"
        transform="rotate(90 53 140)"
        fontFamily="var(--font-nunito), sans-serif"
      >
        FRAGATTO
      </text>
    </svg>
  );
}
