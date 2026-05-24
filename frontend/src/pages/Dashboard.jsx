import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMe, getReports } from "../api/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reportsRes] = await Promise.all([getMe(), getReports()]);
        setUser(userRes.data);
        setReports(reportsRes.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-blue-400 text-lg animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  // --- Stats ---
  const total      = reports.length;
  const fakeCount  = reports.filter((r) => r.is_fake).length;
  const safeCount  = total - fakeCount;
  const avgScore   = total
    ? Math.round(reports.reduce((sum, r) => sum + r.trust_score, 0) / total)
    : 0;

  const stats = [
    { label: "Total Analyzed",  value: total,      icon: "📊", color: "text-blue-400"   },
    { label: "Fake Detected",   value: fakeCount,  icon: "🚨", color: "text-red-400"    },
    { label: "Safe Postings",   value: safeCount,  icon: "✅", color: "text-green-400"  },
    { label: "Avg Trust Score", value: avgScore,   icon: "🛡️", color: "text-yellow-400" },
  ];

  const riskColor = {
    low:    "text-green-400  bg-green-900/20  border-green-800",
    medium: "text-yellow-400 bg-yellow-900/20 border-yellow-800",
    high:   "text-red-400    bg-red-900/20    border-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-blue-500">{user?.name}</span> 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
          <Link
            to="/analyze"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5
              rounded-lg text-sm font-semibold transition"
          >
            + New Analysis
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-2"
            >
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-3xl font-bold ${s.color}`}>{s.value}</span>
              <span className="text-gray-500 text-sm">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg">Recent Analyses</h2>
            <Link to="/reports" className="text-blue-400 text-sm hover:underline">
              View all →
            </Link>
          </div>

          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <span className="text-5xl">🔍</span>
              <p className="text-gray-500">No analyses yet.</p>
              <Link
                to="/analyze"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2
                  rounded-lg text-sm font-semibold transition"
              >
                Analyze your first posting
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reports.slice(0, 5).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-800/50
                    border border-gray-700 rounded-lg px-5 py-4"
                >
                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <p className="text-white text-sm font-medium">{r.posting_title}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(r.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-4">
                    {/* Trust Score */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Trust Score</p>
                      <p className={`font-bold text-sm ${
                        r.trust_score >= 70
                          ? "text-green-400"
                          : r.trust_score >= 40
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}>
                        {r.trust_score}/100
                      </p>
                    </div>

                    {/* Risk Badge */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border
                      ${riskColor[r.risk_level] || riskColor["medium"]}`}>
                      {r.risk_level?.toUpperCase()}
                    </span>

                    {/* Fake/Legit Badge */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      r.is_fake
                        ? "text-red-400 bg-red-900/20 border-red-800"
                        : "text-green-400 bg-green-900/20 border-green-800"
                    }`}>
                      {r.is_fake ? "FAKE" : "LEGIT"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}