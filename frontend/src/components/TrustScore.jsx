export default function TrustScore({ score }) {
  const getColor = () => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getLabel = () => {
    if (score >= 70) return "Trusted";
    if (score >= 40) return "Suspicious";
    return "Dangerous";
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#1f2937"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={score >= 70 ? "#4ade80" : score >= 40 ? "#facc15" : "#f87171"}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getColor()}`}>{score}</span>
          <span className="text-gray-400 text-xs">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${getColor()}`}>{getLabel()}</span>
      <span className="text-gray-500 text-xs">Trust Score</span>
    </div>
  );
}