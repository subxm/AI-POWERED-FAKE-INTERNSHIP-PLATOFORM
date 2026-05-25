import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function FlagList({ flags }) {
  if (!flags || flags.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
        <p className="text-success text-[14px]">No red flags detected in this posting.</p>
      </div>
    );
  }

  const severityConfig = {
    high: {
      color: "text-danger",
      bg: "bg-red-500/5",
      border: "border-red-500/20",
      icon: AlertCircle,
    },
    medium: {
      color: "text-warning",
      bg: "bg-amber-500/5",
      border: "border-amber-500/20",
      icon: AlertCircle,
    },
    low: {
      color: "text-slate-400",
      bg: "bg-navy-50",
      border: "border-surface-border",
      icon: Info,
    },
  };

  const sorted = [...flags].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-slate-500 text-[13px] mb-1">
        {flags.length} red flag{flags.length > 1 ? "s" : ""} detected
      </p>
      {sorted.map((flag, i) => {
        const c = severityConfig[flag.severity] || severityConfig.low;
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.border} ${c.bg}`}
          >
            <Icon className={`h-4 w-4 flex-shrink-0 ${c.color}`} strokeWidth={2} />
            <span className={`text-[14px] flex-1 ${c.color} capitalize`}>{flag.flag}</span>
            <span className={`text-[11px] uppercase font-semibold tracking-wide ${c.color}`}>
              {flag.severity}
            </span>
          </div>
        );
      })}
    </div>
  );
}
