import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "cardvault-user";

const AuthContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email, password) => {
    if (!email?.trim() || !password)
      return { ok: false, error: "Email and password required" };

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Admin status is determined by the database role field
        setUser({
          ...data,
          isAdmin: data.role === "admin",
        });
        return { ok: true };
      } else {
        return { ok: false, error: data.message || "Login failed" };
      }
    } catch (_err) {
      return { ok: false, error: "Connection to server failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    if (!name?.trim() || !email?.trim() || !password) {
      return { ok: false, error: "Name, email and password required" };
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        return { ok: true };
      } else {
        return { ok: false, error: data.message || "Registration failed" };
      }
    } catch (_err) {
      return { ok: false, error: "Connection to server failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
