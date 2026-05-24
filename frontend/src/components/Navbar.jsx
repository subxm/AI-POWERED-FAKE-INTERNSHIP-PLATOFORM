import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="text-white font-bold text-lg">
            Internship<span className="text-blue-500">Guard</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/"          className="text-gray-400 hover:text-white transition">Home</Link>
          {token && (
            <>
              <Link to="/analyze"   className="text-gray-400 hover:text-white transition">Analyze</Link>
              <Link to="/reports"   className="text-gray-400 hover:text-white transition">Reports</Link>
              <Link to="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Login
              </Link>
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-4 px-2">
          <Link to="/"          className="text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Home</Link>
          {token && (
            <>
              <Link to="/analyze"   className="text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Analyze</Link>
              <Link to="/reports"   className="text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Reports</Link>
              <Link to="/dashboard" className="text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Dashboard</Link>
            </>
          )}
          {token ? (
            <button onClick={handleLogout} className="text-red-400 text-left">Logout</button>
          ) : (
            <Link to="/" className="text-blue-400" onClick={() => setOpen(false)}>Login / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
}