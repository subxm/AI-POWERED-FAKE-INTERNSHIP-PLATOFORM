import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BarChart3,
  AlertTriangle,
  ShieldCheck,
  Gauge,
  Plus,
  ChevronRight,
} from "lucide-react";
import { getMe, getReports } from "../api/api";
import LoadingScreen from "../components/LoadingScreen";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import EmptyAnalysisIllustration from "../components/illustrations/EmptyAnalysisIllustration";

const riskStyles = {
  low: "text-success bg-emerald-500/10 border-emerald-500/25",
  medium: "text-warning bg-amber-500/10 border-amber-500/25",
  high: "text-danger bg-red-500/10 border-red-500/25",
};

function scoreColor(score) {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-danger";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reportsRes] = await Promise.all([getMe(), getReports()]);
        setUser(userRes.data);
        setReports(reportsRes.data);
      } catch {
        localStorage.removeItem("token");
        navigate("/?auth=login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  const total = reports.length;
  const fakeCount = reports.filter((r) => r.is_fake).length;
  const safeCount = total - fakeCount;
  const avgScore = total
    ? Math.round(reports.reduce((sum, r) => sum + r.trust_score, 0) / total)
    : 0;

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title={
          <>
            Welcome back,{" "}
            <span className="text-accent">{user?.name || firstName}</span>
          </>
        }
        subtitle={user?.email}
        action={
          <Link to="/analyze" className="btn-primary">
            <Plus className="h-4 w-4" />
            New Analysis
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 lg:mb-10">
        <StatCard label="Total Analyzed" value={total} icon={BarChart3} accent="accent" />
        <StatCard label="Fake Detected" value={fakeCount} icon={AlertTriangle} accent="danger" />
        <StatCard label="Safe Postings" value={safeCount} icon={ShieldCheck} accent="success" />
        <StatCard label="Avg Trust Score" value={avgScore} icon={Gauge} accent="warning" />
      </div>

      <div className="card p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Analyses</h2>
            <p className="text-slate-500 text-[13px] mt-1">Your latest saved posting reviews</p>
          </div>
          {reports.length > 0 && (
            <Link
              to="/reports"
              className="inline-flex items-center gap-1 text-accent text-sm font-medium hover:text-accent-hover transition-colors"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-20 gap-5">
            <EmptyAnalysisIllustration className="w-48 h-auto opacity-90" />
            <div className="text-center max-w-sm">
              <p className="text-white font-medium text-[15px]">No analyses yet</p>
              <p className="text-slate-500 text-[14px] mt-2 leading-relaxed">
                Paste an internship posting or upload a file to get your first AI-powered verdict.
              </p>
            </div>
            <Link to="/analyze" className="btn-primary mt-2">
              <Plus className="h-4 w-4" />
              Analyze your first posting
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {reports.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-surface-border bg-navy-50/50 px-5 py-4 transition-colors hover:border-slate-600/50"
              >
                <div>
                  <p className="text-white text-[15px] font-medium">{r.posting_title}</p>
                  <p className="text-slate-500 text-[13px] mt-0.5">
                    {new Date(r.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-slate-600">Trust</p>
                    <p className={`font-semibold text-sm tabular-nums ${scoreColor(r.trust_score)}`}>
                      {r.trust_score}/100
                    </p>
                  </div>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
