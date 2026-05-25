export default function HeroIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="40" y="60" width="200" height="260" rx="12" fill="#111827" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="56" y="88" width="80" height="8" rx="4" fill="#243044" />
      <rect x="56" y="108" width="168" height="6" rx="3" fill="#1A2438" />
      <rect x="56" y="124" width="140" height="6" rx="3" fill="#1A2438" />
      <rect x="56" y="140" width="160" height="6" rx="3" fill="#1A2438" />
      <rect x="56" y="168" width="168" height="6" rx="3" fill="#1A2438" />
      <rect x="56" y="184" width="120" height="6" rx="3" fill="#1A2438" />
      <rect x="56" y="212" width="100" height="28" rx="6" fill="#1D4ED8" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="64" y="220" width="60" height="6" rx="3" fill="#3B82F6" fillOpacity="0.6" />
      <rect x="64" y="232" width="40" height="4" rx="2" fill="#3B82F6" fillOpacity="0.3" />
      <circle cx="200" cy="100" r="28" fill="#0A0F1C" stroke="#3B82F6" strokeWidth="2" />
      <path
        d="M200 82 L208 96 L224 98 L212 110 L214 126 L200 118 L186 126 L188 110 L176 98 L192 96 Z"
        fill="#3B82F6"
        fillOpacity="0.2"
        stroke="#3B82F6"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M196 104 L200 110 L208 98" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="280" y="100" width="160" height="200" rx="12" fill="#151D2E" stroke="#334155" strokeWidth="1.5" />
      <rect x="296" y="124" width="60" height="6" rx="3" fill="#475569" />
      <rect x="296" y="148" width="128" height="4" rx="2" fill="#334155" />
      <rect x="296" y="160" width="100" height="4" rx="2" fill="#334155" />
      <rect x="296" y="180" width="80" height="32" rx="6" fill="#10B981" fillOpacity="0.12" stroke="#10B981" strokeWidth="1" strokeOpacity="0.35" />
      <text x="308" y="200" fill="#10B981" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">87 Trust</text>
      <rect x="296" y="228" width="128" height="4" rx="2" fill="#334155" />
      <rect x="296" y="240" width="90" height="4" rx="2" fill="#334155" />
      <rect x="296" y="260" width="70" height="24" rx="6" fill="#EF4444" fillOpacity="0.1" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="320" cy="272" r="3" fill="#EF4444" />
      <rect x="330" y="268" width="50" height="4" rx="2" fill="#EF4444" fillOpacity="0.5" />
      <line x1="240" y1="200" x2="280" y2="180" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      <circle cx="260" cy="190" r="4" fill="#3B82F6" fillOpacity="0.6" />
    </svg>
  );
}
