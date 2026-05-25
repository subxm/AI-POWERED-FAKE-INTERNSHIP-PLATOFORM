export default function StatCard({ label, value, icon: Icon, accent = "accent" }) {
  const accents = {
    accent: "text-accent bg-accent/10 border-accent/20",
    success: "text-success bg-emerald-500/10 border-emerald-500/20",
    warning: "text-warning bg-amber-500/10 border-amber-500/20",
    danger: "text-danger bg-red-500/10 border-red-500/20",
  };

  const valueColors = {
    accent: "text-white",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <div className="card p-6 flex flex-col gap-4 transition-all duration-200 hover:border-slate-600/50">
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${accents[accent]}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <p className={`text-3xl font-bold tabular-nums tracking-tight ${valueColors[accent]}`}>
          {value}
        </p>
        <p className="text-slate-500 text-[13px] font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}
