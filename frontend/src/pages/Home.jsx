import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/api";

export default function Home() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin]   = useState(true);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [form, setForm]         = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (isLogin) {
        // FastAPI OAuth2 expects form data not JSON for login
        const formData = new URLSearchParams();
        formData.append("username", form.email);
        formData.append("password", form.password);
        res = await loginUser(formData);
      } else {
        res = await registerUser({
          name:     form.name,
          email:    form.email,
          password: form.password,
        });
      }
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* Left — Hero */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 bg-gradient-to-br from-gray-900 to-gray-950 border-r border-gray-800">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-5xl">🛡️</span>
            <span className="text-white font-bold text-3xl">
              Internship<span className="text-blue-500">Guard</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Detect Fake Internships <span className="text-blue-500">Before They Detect You</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            AI-powered platform that analyzes internship postings for fraud signals,
            red flags, and scam patterns in seconds.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-col gap-3">
            {[
              { icon: "🤖", text: "ML model trained on 17,000+ real job postings" },
              { icon: "✨", text: "Gemini AI explains every verdict in plain English" },
              { icon: "🚩", text: "Detects 30+ red flag patterns instantly"          },
              { icon: "📊", text: "Trust score from 0–100 with detailed breakdown"   },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-4 py-3">
                <span className="text-xl">{f.icon}</span>
                <span className="text-gray-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Auth Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6">
        <div className="w-full max-w-md">

          {/* Toggle */}
          <div className="flex bg-gray-900 rounded-xl p-1 mb-8 border border-gray-800">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                ${isLogin ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                ${!isLogin ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              Register
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {isLogin
              ? "Login to access your internship analyzer"
              : "Sign up to start detecting fake internships"}
          </p>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3
                    text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3
                  text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3
                  text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900
                text-white font-semibold py-3 rounded-lg transition mt-2"
            >
              {loading
                ? (isLogin ? "Logging in..." : "Creating account...")
                : (isLogin ? "Login"         : "Create Account")}
            </button>
          </div>

          <p className="text-gray-600 text-xs text-center mt-6">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}