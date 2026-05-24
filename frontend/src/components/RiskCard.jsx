export default function RiskCard({ riskLevel, isFake, recommendation }) {
  const config = {
    low:    { bg: "bg-green-900/30",  border: "border-green-700", text: "text-green-400",  icon: "✅", label: "Low Risk"    },
    medium: { bg: "bg-yellow-900/30", border: "border-yellow-700",text: "text-yellow-400", icon: "⚠️", label: "Medium Risk"  },
    high:   { bg: "bg-red-900/30",    border: "border-red-700",   text: "text-red-400",    icon: "🚨", label: "High Risk"    },
  };

  const c = config[riskLevel] || config["medium"];

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5 flex flex-col gap-3`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{c.icon}</span>
          <span className={`font-bold text-lg ${c.text}`}>{c.label}</span>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${c.border} ${c.text}`}>
          {isFake ? "FAKE" : "LEGITIMATE"}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700" />

      {/* Recommendation */}
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Recommendation</p>
        <p className="text-gray-200 text-sm">{recommendation}</p>
      </div>
    </div>
  );
}