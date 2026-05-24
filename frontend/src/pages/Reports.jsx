import { useState, useEffect } from "react";
import { getReports, deleteReport } from "../api/api";

export default function Reports() {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");

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
    const matchSearch = r.posting_title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter =
      filter === "all"
        ? true
        : filter === "fake"
        ? r.is_fake
        : !r.is_fake;
    return matchSearch && matchFilter;
  });

  const riskColor = {
    low:    "text-green-400  bg-green-900/20  border-green-800",
    medium: "text-yellow-400 bg-yellow-900/20 border-yellow-800",
    high:   "text-red-400    bg-red-900/20    border-red-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-blue-400 text-lg animate-pulse">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Reports 📋</h1>
          <p className="text-gray-500 text-sm">
            All your saved internship analyses in one place.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3
              text-white placeholder-gray-600 focus:outline-none focus:border-blue-500
              transition text-sm"
          />
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1 gap-1">
            {["all", "fake", "safe"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition
                  ${filter === f
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl">📭</span>
            <p className="text-gray-500">
              {search || filter !== "all"
                ? "No reports match your search."
                : "No reports saved yet."}
            </p>
          </div>
        )}

        {/* Reports List */}
        <div className="flex flex-col gap-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6
                hover:border-gray-600 transition"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">{r.posting_title}</h3>
                  {r.company_name && (
                    <p className="text-gray-500 text-sm mt-0.5">{r.company_name}</p>
                  )}
                  <p className="text-gray-600 text-xs mt-1">
                    {new Date(r.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border
                    ${riskColor[r.risk_level] || riskColor["medium"]}`}>
                    {r.risk_level?.toUpperCase()}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    r.is_fake
                      ? "text-red-400 bg-red-900/20 border-red-800"
                      : "text-green-400 bg-green-900/20 border-green-800"
                  }`}>
                    {r.is_fake ? "FAKE" : "LEGIT"}
                  </span>
                </div>
              </div>

              {/* Trust Score Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Trust Score</span>
                  <span className={`font-semibold ${
                    r.trust_score >= 70
                      ? "text-green-400"
                      : r.trust_score >= 40
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}>
                    {r.trust_score}/100
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      r.trust_score >= 70
                        ? "bg-green-500"
                        : r.trust_score >= 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${r.trust_score}%` }}
                  />
                </div>
              </div>

              {/* Delete Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deleting === r.id}
                  className="text-xs text-gray-600 hover:text-red-400 transition
                    disabled:opacity-50 flex items-center gap-1"
                >
                  {deleting === r.id ? "Deleting..." : "🗑️ Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}