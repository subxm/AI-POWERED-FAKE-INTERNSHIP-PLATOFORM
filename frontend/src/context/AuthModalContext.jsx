import { createContext, useContext, useState, useCallback } from "react";
import AuthModal from "../components/AuthModal";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login");

  const openAuth = useCallback((authMode = "login") => {
    setMode(authMode);
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => setOpen(false), []);

  return (
    <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthModal isOpen={open} onClose={closeAuth} initialMode={mode} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
