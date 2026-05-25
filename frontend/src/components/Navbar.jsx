import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Search,
  FileText,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import { useAuthModal } from "../context/AuthModalContext";

const navLinkClass = (active) =>
  `text-sm font-medium transition-colors duration-150 ${
    active ? "text-white" : "text-slate-400 hover:text-slate-200"
  }`;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openAuth } = useAuthModal();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const appLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/analyze", label: "Analyze", icon: Search },
    { to: "/reports", label: "Reports", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/80 bg-navy/95 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          {!token ? (
            <>
              <a href="#features" className={navLinkClass(false)}>
                Features
              </a>
              <a href="#how-it-works" className={navLinkClass(false)}>
                How it works
              </a>
            </>
          ) : (
            appLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={navLinkClass(isActive(to))}>
                {label}
              </Link>
            ))
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <button type="button" onClick={handleLogout} className="btn-secondary !py-2">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <>
              <button type="button" onClick={() => openAuth("login")} className="btn-ghost">
                Login
              </button>
              <button type="button" onClick={() => openAuth("register")} className="btn-primary">
                Get Started
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden btn-ghost !p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-border bg-navy-50 px-6 py-4 flex flex-col gap-1 animate-fade-in">
          {!token ? (
            <>
              <a href="#features" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>
                How it works
              </a>
              <button type="button" className="btn-ghost justify-start" onClick={() => { openAuth("login"); setMobileOpen(false); }}>
                Login
              </button>
              <button type="button" className="btn-primary w-full mt-2" onClick={() => { openAuth("register"); setMobileOpen(false); }}>
                Get Started
              </button>
            </>
          ) : (
            <>
              {appLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="btn-ghost justify-start gap-3"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <button type="button" className="btn-ghost justify-start text-danger mt-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
