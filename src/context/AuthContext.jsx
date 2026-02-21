import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'cardvault-user'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = async (email, password) => {
    if (!email?.trim() || !password) return { ok: false, error: 'Email and password required' }
    
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Check if this is the admin from .env (as requested)
        const isAdmin = email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
        
        setUser({
          ...data,
          isAdmin: isAdmin || data.role === 'admin'
        });
        return { ok: true };
      } else {
        return { ok: false, error: data.message || 'Login failed' };
      }
    } catch (err) {
      return { ok: false, error: 'Connection to server failed' };
    }
  }

  const register = async (name, email, password) => {
    if (!name?.trim() || !email?.trim() || !password) {
      return { ok: false, error: 'Name, email and password required' }
    }
    
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        return { ok: true };
      } else {
        return { ok: false, error: data.message || 'Registration failed' };
      }
    } catch (err) {
      return { ok: false, error: 'Connection to server failed' };
    }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
