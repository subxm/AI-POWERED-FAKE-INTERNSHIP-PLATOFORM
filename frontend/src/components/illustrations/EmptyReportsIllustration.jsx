export default function EmptyReportsIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="52" y="20" width="96" height="120" rx="8" fill="#151D2E" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="68" y="40" width="64" height="5" rx="2.5" fill="#243044" />
      <rect x="68" y="56" width="48" height="4" rx="2" fill="#1A2438" />
      <rect x="68" y="68" width="56" height="4" rx="2" fill="#1A2438" />
      <rect x="68" y="80" width="40" height="4" rx="2" fill="#1A2438" />
      <rect x="36" y="44" width="72" height="96" rx="8" fill="#111827" stroke="#334155" strokeWidth="1.5" transform="rotate(-8 72 92)" />
      <rect x="48" y="64" width="40" height="4" rx="2" fill="#243044" transform="rotate(-8 68 66)" />
      <rect x="48" y="78" width="32" height="3" rx="1.5" fill="#1A2438" transform="rotate(-8 64 80)" />
      <circle cx="148" cy="120" r="22" fill="#0A0F1C" stroke="#475569" strokeWidth="1.5" />
      <path d="M140 120 L146 126 L158 114" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
