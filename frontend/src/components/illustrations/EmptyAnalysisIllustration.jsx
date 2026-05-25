export default function EmptyAnalysisIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="40" y="24" width="120" height="112" rx="10" fill="#151D2E" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="56" y="44" width="48" height="6" rx="3" fill="#243044" />
      <rect x="56" y="60" width="88" height="4" rx="2" fill="#1A2438" />
      <rect x="56" y="72" width="72" height="4" rx="2" fill="#1A2438" />
      <rect x="56" y="84" width="80" height="4" rx="2" fill="#1A2438" />
      <circle cx="100" cy="118" r="20" fill="#0A0F1C" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <path
        d="M92 118 L98 124 L110 110"
        stroke="#475569"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="148" cy="48" r="16" fill="#1D4ED8" fillOpacity="0.12" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M142 48 L146 52 L154 44" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
