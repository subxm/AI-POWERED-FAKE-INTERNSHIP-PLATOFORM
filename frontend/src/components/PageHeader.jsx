export default function PageHeader({ title, subtitle, action }) {
  const TitleTag = typeof title === "string" ? "h1" : "div";
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-10">
      <div>
        <TitleTag className="text-display-sm lg:text-display-md font-bold text-white tracking-tight">
          {title}
        </TitleTag>
        {subtitle && (
          <p className="text-slate-500 text-[15px] mt-2 max-w-xl">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
