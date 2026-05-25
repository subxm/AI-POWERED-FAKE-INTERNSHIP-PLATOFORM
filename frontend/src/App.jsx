import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import { AuthModalProvider } from "./context/AuthModalContext";

const isAuthenticated = () => !!localStorage.getItem("token");

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/?auth=login" replace />;
};

export default function App() {
  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-navy text-slate-300 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <Analyze />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthModalProvider>
  );
}
