export default function TrustScore({ score }) {
  const getColor = () => {
    if (score >= 70) return { stroke: "#10B981", text: "text-success" };
    if (score >= 40) return { stroke: "#F59E0B", text: "text-warning" };
    return { stroke: "#EF4444", text: "text-danger" };
  };

  const getLabel = () => {
    if (score >= 70) return "Trusted";
    if (score >= 40) return "Suspicious";
    return "High risk";
  };

  const { stroke, text } = getColor();
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1A2438" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold tabular-nums ${text}`}>{score}</span>
          <span className="text-slate-500 text-xs">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${text}`}>{getLabel()}</span>
      <span className="text-slate-600 text-[12px] uppercase tracking-wider">Trust Score</span>
    </div>
  );
}
