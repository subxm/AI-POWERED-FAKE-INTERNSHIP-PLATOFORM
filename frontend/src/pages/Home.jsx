import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Brain,
  Sparkles,
  Flag,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  ScanSearch,
  FileCheck2,
} from "lucide-react";
import HeroIllustration from "../components/illustrations/HeroIllustration";
import { useAuthModal } from "../context/AuthModalContext";

const features = [
  {
    icon: Brain,
    title: "ML-trained detection",
    text: "Model trained on 17,000+ real job postings for accurate fraud signals.",
  },
  {
    icon: Sparkles,
    title: "Gemini explanations",
    text: "Every verdict explained in plain English — no black-box scores.",
  },
  {
    icon: Flag,
    title: "30+ red flag patterns",
    text: "Instant detection of suspicious language, fees, and scam patterns.",
  },
  {
    icon: BarChart3,
    title: "Trust score breakdown",
    text: "0–100 trust score with detailed risk level and recommendations.",
  },
];

const steps = [
  { icon: ScanSearch, step: "01", title: "Paste or upload", desc: "Enter posting details manually or upload PDF, DOCX, or TXT." },
  { icon: ShieldCheck, step: "02", title: "AI analyzes", desc: "ML model and Gemini evaluate fraud signals in seconds." },
  { icon: FileCheck2, step: "03", title: "Get your verdict", desc: "Trust score, red flags, and a clear recommendation to apply or avoid." },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
      return;
    }
    const auth = searchParams.get("auth");
    if (auth === "login" || auth === "register") {
      openAuth(auth);
      setSearchParams({}, { replace: true });
    }
  }, [navigate, searchParams, setSearchParams, openAuth]);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)]" />
        <div className="page-container relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 lg:py-20">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-navy-50 px-3 py-1.5 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[13px] font-medium text-slate-400">
                  AI-powered internship fraud detection
                </span>
              </div>

              <h1 className="text-display-md lg:text-[2.75rem] lg:leading-[1.15] font-bold text-white tracking-tight">
                Detect Fake Internships{" "}
                <span className="text-accent">Before They Detect You</span>
              </h1>

              <p className="text-slate-400 text-[16px] leading-relaxed mt-6">
                InternshipGuard analyzes postings for fraud signals, red flags, and scam
                patterns — giving students and job seekers a clear, trustworthy verdict in seconds.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="btn-primary py-3 px-6"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="btn-secondary py-3 px-6"
                >
                  Login
                </button>
              </div>

              <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-surface-border">
                {[
                  { value: "17k+", label: "Postings trained" },
                  { value: "30+", label: "Red flag patterns" },
                  { value: "<5s", label: "Avg. analysis time" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-white tabular-nums">{s.value}</p>
                    <p className="text-slate-500 text-[13px] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <HeroIllustration className="w-full max-w-[480px] h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-surface-border bg-navy-50/50">
        <div className="page-container py-16 lg:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Built for trust and clarity
            </h2>
            <p className="text-slate-500 text-[15px] mt-3">
              Enterprise-grade analysis tools designed for students, career centers, and recruiters.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card-interactive p-6">
                <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-accent" strokeWidth={2} />
                </div>
                <h3 className="text-white font-semibold text-[15px] mb-2">{title}</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-surface-border">
        <div className="page-container py-16 lg:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              How it works
            </h2>
            <p className="text-slate-500 text-[15px] mt-3">
              Three steps from suspicious posting to actionable insight.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="card p-8 relative">
                <span className="text-[13px] font-mono font-semibold text-accent/60">{step}</span>
                <div className="h-11 w-11 rounded-xl bg-navy-100 border border-surface-border flex items-center justify-center mt-4 mb-5">
                  <Icon className="h-5 w-5 text-slate-300" strokeWidth={2} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button type="button" onClick={() => openAuth("register")} className="btn-primary py-3 px-8">
              Start analyzing for free
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-slate-600">
          <p>© {new Date().getFullYear()} InternshipGuard. All rights reserved.</p>
          <p>Protecting students from fraudulent internship postings.</p>
        </div>
      </footer>
    </div>
  );
}
