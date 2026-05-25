import { useState } from "react";
import {
  PenLine,
  Upload,
  Loader2,
  Sparkles,
  Flag,
  Cpu,
  Save,
  RotateCcw,
  ScanSearch,
} from "lucide-react";
import { analyzePosting, saveReport } from "../api/api";
import UploadForm from "../components/UploadForm";
import TrustScore from "../components/TrustScore";
import RiskCard from "../components/RiskCard";
import FlagList from "../components/FlagList";
import PageHeader from "../components/PageHeader";

const EMPTY_FORM = {
  title: "",
  company_profile: "",
  description: "",
  requirements: "",
  benefits: "",
  location: "",
  salary_range: "",
  employment_type: "",
  required_experience: "",
  required_education: "",
  industry: "",
  has_company_logo: 0,
  has_questions: 0,
  telecommuting: 0,
};

export default function Analyze() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
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
    if (!form.title.trim()) {
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
        posting_title: form.title,
        company_name: form.company_profile?.slice(0, 50) || "",
        trust_score: result.trust_score,
        risk_level: result.risk_level,
        is_fake: result.is_fake,
        gemini_analysis: result.gemini_analysis,
        red_flags: result.red_flags,
      });
      setSaved(true);
    } catch {
      setError("Failed to save report.");
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setResult(null);
    setError("");
    setSaved(false);
  };

  return (
    <div className="page-container max-w-5xl animate-fade-in">
      <PageHeader
        title="Analyze a Posting"
        subtitle="Paste internship details manually or upload a file for an instant AI-powered verdict."
      />

      <div className="flex bg-navy-50 border border-surface-border rounded-xl p-1 mb-8 w-fit gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
            activeTab === "manual" ? "tab-active" : "tab-inactive"
          }`}
        >
          <PenLine className="h-4 w-4" />
          Manual Entry
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
            activeTab === "upload" ? "tab-active" : "tab-inactive"
          }`}
        >
          <Upload className="h-4 w-4" />
          Upload File
        </button>
      </div>

      {activeTab === "upload" && (
        <div className="mb-8">
          <UploadForm onExtracted={handleExtracted} />
        </div>
      )}

      {activeTab === "manual" && (
        <div className="card p-6 lg:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="label-field">
                Job / Internship Title <span className="text-danger">*</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Marketing Intern — Acme Corp"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="location" className="label-field">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Remote, Hyderabad, etc."
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="industry" className="label-field">Industry</label>
              <input
                id="industry"
                type="text"
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="Information Technology"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="employment_type" className="label-field">Employment Type</label>
              <select
                id="employment_type"
                name="employment_type"
                value={form.employment_type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="salary_range" className="label-field">Salary Range</label>
              <input
                id="salary_range"
                type="text"
                name="salary_range"
                value={form.salary_range}
                onChange={handleChange}
                placeholder="₹10,000–20,000 or Unpaid"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="required_experience" className="label-field">Required Experience</label>
              <select
                id="required_experience"
                name="required_experience"
                value={form.required_experience}
                onChange={handleChange}
                className="input-field"
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

            <div>
              <label htmlFor="required_education" className="label-field">Required Education</label>
              <select
                id="required_education"
                name="required_education"
                value={form.required_education}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select education</option>
                <option value="High School or equivalent">High School or equivalent</option>
                <option value="Associate Degree">Associate Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Unspecified">Unspecified</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="company_profile" className="label-field">Company Profile</label>
              <textarea
                id="company_profile"
                name="company_profile"
                value={form.company_profile}
                onChange={handleChange}
                placeholder="Company name, website, size, and any profile details from the posting..."
                rows={3}
                className="input-field resize-y min-h-[88px]"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="label-field">Full Job Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Paste the complete job description, responsibilities, and role details..."
                rows={8}
                className="input-field resize-y min-h-[200px]"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="requirements" className="label-field">Requirements</label>
              <textarea
                id="requirements"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                placeholder="Skills, qualifications, and application requirements..."
                rows={3}
                className="input-field resize-y"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="benefits" className="label-field">Benefits</label>
              <textarea
                id="benefits"
                name="benefits"
                value={form.benefits}
                onChange={handleChange}
                placeholder="Stipend, perks, certificates, or other benefits mentioned..."
                rows={2}
                className="input-field resize-y"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
              {[
                { name: "has_company_logo", label: "Has company logo" },
                { name: "has_questions", label: "Has screening questions" },
                { name: "telecommuting", label: "Remote / telecommuting" },
              ].map((cb) => (
                <label key={cb.name} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    name={cb.name}
                    checked={form[cb.name] === 1}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-surface-border bg-navy-50 text-accent focus:ring-accent/30 focus:ring-offset-navy"
                  />
                  <span className="text-slate-400 text-[14px] group-hover:text-slate-300 transition-colors">
                    {cb.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!result && (
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="btn-primary w-full py-4 text-[16px] mb-10"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <ScanSearch className="h-5 w-5" />
              Analyze Posting
            </>
          )}
        </button>
      )}

      {result && (
        <div className="flex flex-col gap-6 animate-slide-up">
          <div className="border-t border-surface-border pt-8">
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Analysis Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card p-6 flex items-center justify-center">
                <TrustScore score={result.trust_score} />
              </div>
              <div className="md:col-span-2">
                <RiskCard
                  riskLevel={result.risk_level}
                  isFake={result.is_fake}
                  recommendation={result.recommendation}
                />
              </div>
            </div>

            <div className="card p-6 mb-6">
              <div className="flex items-center gap-2.5 mb-4">
                <Sparkles className="h-5 w-5 text-accent" strokeWidth={2} />
                <h3 className="text-white font-semibold">Gemini AI Analysis</h3>
              </div>
              <p className="text-slate-300 text-[15px] leading-relaxed">{result.gemini_analysis}</p>
            </div>

            <div className="card p-6 mb-6">
              <div className="flex items-center gap-2.5 mb-4">
                <Flag className="h-5 w-5 text-warning" strokeWidth={2} />
                <h3 className="text-white font-semibold">Red Flags</h3>
              </div>
              <FlagList flags={result.red_flags} />
            </div>

            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-5 w-5 text-slate-400" strokeWidth={2} />
                  <h3 className="text-white font-semibold">ML Model Score</h3>
                </div>
                <span className="text-slate-500 text-[14px]">
                  Fraud probability:{" "}
                  <span
                    className={`font-semibold tabular-nums ${
                      result.ml_score > 0.5 ? "text-danger" : "text-success"
                    }`}
                  >
                    {(result.ml_score * 100).toFixed(1)}%
                  </span>
                </span>
              </div>
              <div className="h-1.5 bg-navy-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    result.ml_score > 0.5 ? "bg-danger" : "bg-success"
                  }`}
                  style={{ width: `${result.ml_score * 100}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleSaveReport}
                disabled={saved}
                className="btn-primary flex-1 py-3 disabled:!bg-navy-100 disabled:!text-slate-600"
              >
                <Save className="h-4 w-4" />
                {saved ? "Report saved" : "Save report"}
              </button>
              <button type="button" onClick={handleReset} className="btn-secondary flex-1 py-3">
                <RotateCcw className="h-4 w-4" />
                Analyze another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
