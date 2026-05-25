import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, Plus } from "lucide-react";
import { getReports, deleteReport } from "../api/api";
import LoadingScreen from "../components/LoadingScreen";
import PageHeader from "../components/PageHeader";
import EmptyReportsIllustration from "../components/illustrations/EmptyReportsIllustration";

const riskStyles = {
  low: "text-success bg-emerald-500/10 border-emerald-500/25",
  medium: "text-warning bg-amber-500/10 border-amber-500/25",
  high: "text-danger bg-red-500/10 border-red-500/25",
};

function scoreColor(score) {
  if (score >= 70) return "bg-success";
  if (score >= 40) return "bg-warning";
  return "bg-danger";
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getReports();
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    setDeleting(reportId);
    try {
      await deleteReport(reportId);
      setReports(reports.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error("Failed to delete report:", err);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = reports.filter((r) => {
    const matchSearch = r.posting_title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true : filter === "fake" ? r.is_fake : !r.is_fake;
    return matchSearch && matchFilter;
  });

  const filterLabels = { all: "All", fake: "Fake", safe: "Safe" };

  if (loading) {
    return <LoadingScreen message="Loading your reports..." />;
  }

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Reports"
        subtitle="All your saved internship analyses in one searchable place."
        action={
          <Link to="/analyze" className="btn-primary">
            <Plus className="h-4 w-4" />
            New Analysis
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field !pl-11"
          />
        </div>
        <div className="flex bg-navy-50 border border-surface-border rounded-xl p-1 gap-1">
          {["all", "fake", "safe"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-all duration-150 ${
                filter === f ? "tab-active" : "tab-inactive"
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 lg:py-24 gap-5">
          <EmptyReportsIllustration className="w-48 h-auto opacity-90" />
          <div className="text-center max-w-sm">
            <p className="text-white font-medium text-[15px]">
              {search || filter !== "all"
                ? "No reports match your filters"
                : "No reports saved yet"}
            </p>
            <p className="text-slate-500 text-[14px] mt-2 leading-relaxed">
              {search || filter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Run an analysis and save the report to see it here."}
            </p>
          </div>
          {!search && filter === "all" && (
            <Link to="/analyze" className="btn-primary mt-2">
              <Plus className="h-4 w-4" />
              Start your first analysis
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((r) => (
            <article key={r.id} className="card-interactive p-6 lg:p-7">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-white font-semibold text-lg tracking-tight">
                    {r.posting_title}
                  </h3>
                  {r.company_name && (
                    <p className="text-slate-500 text-[14px] mt-1">{r.company_name}</p>
                  )}
                  <p className="text-slate-600 text-[13px] mt-2">
                    {new Date(r.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wide ${
                      riskStyles[r.risk_level] || riskStyles.medium
                    }`}
                  >
                    {r.risk_level}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wide ${
                      r.is_fake
                        ? "text-danger bg-red-500/10 border-red-500/25"
                        : "text-success bg-emerald-500/10 border-emerald-500/25"
                    }`}
                  >
                    {r.is_fake ? "Fake" : "Safe"}
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-slate-500">Trust score</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      r.trust_score >= 70
                        ? "text-success"
                        : r.trust_score >= 40
                        ? "text-warning"
                        : "text-danger"
                    }`}
                  >
                    {r.trust_score}/100
                  </span>
                </div>
                <div className="h-1.5 bg-navy-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${scoreColor(r.trust_score)}`}
                    style={{ width: `${r.trust_score}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  disabled={deleting === r.id}
                  className="inline-flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-danger transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deleting === r.id ? "Deleting..." : "Delete report"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
