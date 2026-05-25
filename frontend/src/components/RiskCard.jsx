import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

export default function RiskCard({ riskLevel, isFake, recommendation }) {
  const config = {
    low: {
      border: "border-emerald-500/25",
      bg: "bg-emerald-500/5",
      text: "text-success",
      icon: ShieldCheck,
      label: "Low Risk",
    },
    medium: {
      border: "border-amber-500/25",
      bg: "bg-amber-500/5",
      text: "text-warning",
      icon: AlertTriangle,
      label: "Medium Risk",
    },
    high: {
      border: "border-red-500/25",
      bg: "bg-red-500/5",
      text: "text-danger",
      icon: ShieldAlert,
      label: "High Risk",
    },
  };

  const c = config[riskLevel] || config.medium;
  const Icon = c.icon;

  return (
    <div className={`rounded-card border ${c.border} ${c.bg} p-6 flex flex-col gap-4 h-full`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl border ${c.border} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${c.text}`} strokeWidth={2} />
          </div>
          <span className={`font-bold text-lg ${c.text}`}>{c.label}</span>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wide ${
            isFake
              ? "text-danger bg-red-500/10 border-red-500/25"
              : "text-success bg-emerald-500/10 border-emerald-500/25"
          }`}
        >
          {isFake ? "Fake" : "Legitimate"}
        </span>
      </div>

      <div className="border-t border-surface-border pt-4">
        <p className="text-slate-500 text-[11px] uppercase tracking-wider font-medium mb-2">
          Recommendation
        </p>
        <p className="text-slate-200 text-[15px] leading-relaxed">{recommendation}</p>
      </div>
    </div>
  );
}
