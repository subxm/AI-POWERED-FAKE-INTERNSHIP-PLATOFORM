import { useState } from "react";
import { analyzePosting, saveReport } from "../api/api";
import UploadForm from "../components/UploadForm";
import TrustScore from "../components/TrustScore";
import RiskCard from "../components/RiskCard";
import FlagList from "../components/FlagList";

const EMPTY_FORM = {
  title:               "",
  company_profile:     "",
  description:         "",
  requirements:        "",
  benefits:            "",
  location:            "",
  salary_range:        "",
  employment_type:     "",
  required_experience: "",
  required_education:  "",
  industry:            "",
  has_company_logo:    0,
  has_questions:       0,
  telecommuting:       0,
};

export default function Analyze() {
  const [form, setForm]         = useState(EMPTY_FORM);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [saved, setSaved]       = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleExtracted = (extracted) => {
    setForm({ ...EMPTY_FORM, ...extracted });
    setActiveTab("manual");
  };

  const handleAnalyze = async () => {
    if (!form.title) {
      setError("Please provide at least a job title.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setSaved(false);
    try {
      const res = await analyzePosting(form);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!result) return;
    try {
      await saveReport({
        posting_title:   form.title,
        company_name:    form.company_profile?.slice(0, 50) || "",
        trust_score:     result.trust_score,
        risk_level:      result.risk_level,
        is_fake:         result.is_fake,
        gemini_analysis: result.gemini_analysis,
        red_flags:       result.red_flags,
      });
      setSaved(true);
    } catch (err) {
      setError("Failed to save report.");
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setResult(null);
    setError("");
    setSaved(false);
  };

  const inputClass = `w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3
    text-white placeholder-gray-600 focus:outline-none focus:border-blue-500
    transition text-sm`;

  const labelClass = "text-gray-400 text-xs uppercase tracking-wider mb-1 block";

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Analyze a Posting 🔍
          </h1>
          <p className="text-gray-500 text-sm">
            Paste the internship details manually or upload a file to get an instant AI verdict.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 mb-8 w-fit gap-1">
          {["manual", "upload"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition
                ${activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"}`}
            >
              {tab === "manual" ? "✏️ Manual Entry" : "📄 Upload File"}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="mb-8">
            <UploadForm onExtracted={handleExtracted} />
          </div>
        )}

        {/* Manual Form */}
        {activeTab === "manual" && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Title */}
              <div className="md:col-span-2">
                <label className={labelClass}>Job / Internship Title *</label>
                <input
                  type="text" name="title"
                  value={form.title} onChange={handleChange}
                  placeholder="e.g. Marketing Intern"
                  className={inputClass}
                />
              </div>

              {/* Location */}
              <div>
                <label className={labelClass}>Location</label>
                <input
                  type="text" name="location"
                  value={form.location} onChange={handleChange}
                  placeholder="e.g. Remote / Hyderabad"
                  className={inputClass}
                />
              </div>

              {/* Industry */}
              <div>
                <label className={labelClass}>Industry</label>
                <input
                  type="text" name="industry"
                  value={form.industry} onChange={handleChange}
                  placeholder="e.g. Information Technology"
                  className={inputClass}
                />
              </div>

              {/* Employment Type */}
              <div>
                <label className={labelClass}>Employment Type</label>
                <select
                  name="employment_type"
                  value={form.employment_type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Salary Range */}
              <div>
                <label className={labelClass}>Salary Range</label>
                <input
                  type="text" name="salary_range"
                  value={form.salary_range} onChange={handleChange}
                  placeholder="e.g. 10000-20000 or Unpaid"
                  className={inputClass}
                />
              </div>

              {/* Required Experience */}
              <div>
                <label className={labelClass}>Required Experience</label>
                <select
                  name="required_experience"
                  value={form.required_experience}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select experience</option>
                  <option value="Internship">Internship</option>
                  <option value="Entry level">Entry level</option>
                  <option value="Associate">Associate</option>
                  <option value="Mid-Senior level">Mid-Senior level</option>
                  <option value="Director">Director</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>

              {/* Required Education */}
              <div>
                <label className={labelClass}>Required Education</label>
                <select
                  name="required_education"
                  value={form.required_education}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select education</option>
                  <option value="High School or equivalent">High School or equivalent</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Unspecified">Unspecified</option>
                </select>
              </div>

              {/* Company Profile */}
              <div className="md:col-span-2">
                <label className={labelClass}>Company Profile</label>
                <textarea
                  name="company_profile"
                  value={form.company_profile} onChange={handleChange}
                  placeholder="Describe the company..."
                  rows={3} className={inputClass}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className={labelClass}>Job Description</label>
                <textarea
                  name="description"
                  value={form.description} onChange={handleChange}
                  placeholder="Paste the full job description..."
                  rows={4} className={inputClass}
                />
              </div>

              {/* Requirements */}
              <div className="md:col-span-2">
                <label className={labelClass}>Requirements</label>
                <textarea
                  name="requirements"
                  value={form.requirements} onChange={handleChange}
                  placeholder="List the requirements..."
                  rows={3} className={inputClass}
                />
              </div>

              {/* Benefits */}
              <div className="md:col-span-2">
                <label className={labelClass}>Benefits</label>
                <textarea
                  name="benefits"
                  value={form.benefits} onChange={handleChange}
                  placeholder="List the benefits offered..."
                  rows={2} className={inputClass}
                />
              </div>

              {/* Checkboxes */}
              <div className="md:col-span-2 flex flex-wrap gap-6">
                {[
                  { name: "has_company_logo", label: "Has Company Logo"      },
                  { name: "has_questions",    label: "Has Screening Questions"},
                  { name: "telecommuting",    label: "Remote / Telecommuting" },
                ].map((cb) => (
                  <label key={cb.name} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name={cb.name}
                      checked={form[cb.name] === 1}
                      onChange={handleChange}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-gray-300 text-sm">{cb.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Analyze Button */}
        {!result && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900
              text-white font-semibold py-4 rounded-xl transition text-lg mb-10"
          >
            {loading ? "🔍 Analyzing with AI..." : "🚀 Analyze Posting"}
          </button>
        )}

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-6">
            <div className="border-t border-gray-800 pt-8">
              <h2 className="text-xl font-bold text-white mb-6">Analysis Results</h2>

              {/* Top Row — Trust Score + Risk Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6
                  flex items-center justify-center">
                  <TrustScore score={result.trust_score} />
                </div>
                <div className="md:col-span-2">
                  <RiskCard
                    riskLevel      = {result.risk_level}
                    isFake         = {result.is_fake}
                    recommendation = {result.recommendation}
                  />
                </div>
              </div>

              {/* Gemini Analysis */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">✨</span>
                  <h3 className="text-white font-semibold">Gemini AI Analysis</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {result.gemini_analysis}
                </p>
              </div>

              {/* Red Flags */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🚩</span>
                  <h3 className="text-white font-semibold">Red Flags</h3>
                </div>
                <FlagList flags={result.red_flags} />
              </div>

              {/* ML Score */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <h3 className="text-white font-semibold">ML Model Score</h3>
                  </div>
                  <span className="text-gray-400 text-sm">
                    Fraud Probability:{" "}
                    <span className={`font-bold ${
                      result.ml_score > 0.5 ? "text-red-400" : "text-green-400"
                    }`}>
                      {(result.ml_score * 100).toFixed(1)}%
                    </span>
                  </span>
                </div>
                <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.ml_score > 0.5 ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${result.ml_score * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSaveReport}
                  disabled={saved}
                  className="flex-1 bg-green-700 hover:bg-green-600 disabled:bg-gray-800
                    disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition"
                >
                  {saved ? "✅ Report Saved" : "💾 Save Report"}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white
                    font-semibold py-3 rounded-xl transition"
                >
                  🔄 Analyze Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}