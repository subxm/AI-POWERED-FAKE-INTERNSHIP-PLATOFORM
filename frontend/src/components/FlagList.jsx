export default function FlagList({ flags }) {
  if (!flags || flags.length === 0) {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-xl p-4 text-green-400 text-sm">
        ✅ No red flags detected.
      </div>
    );
  }

  const severityConfig = {
    high:   { color: "text-red-400",    bg: "bg-red-900/20",    border: "border-red-800",    icon: "🔴" },
    medium: { color: "text-yellow-400", bg: "bg-yellow-900/20", border: "border-yellow-800", icon: "🟡" },
    low:    { color: "text-gray-400",   bg: "bg-gray-800/40",   border: "border-gray-700",   icon: "🔵" },
  };

  const sorted = [...flags].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
        {flags.length} Red Flag{flags.length > 1 ? "s" : ""} Detected
      </p>
      {sorted.map((flag, i) => {
        const c = severityConfig[flag.severity] || severityConfig["low"];
        return (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${c.border} ${c.bg}`}
          >
            <span>{c.icon}</span>
            <span className={`text-sm ${c.color} capitalize`}>{flag.flag}</span>
            <span className={`ml-auto text-xs uppercase font-semibold ${c.color}`}>
              {flag.severity}
            </span>
          </div>
        );
      })}
    </div>
  );
}