import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'cardvault-user'

const AuthContext = createContext(null)

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

  const login = (email, password) => {
    // Demo: accept any email + non-empty password
    if (!email?.trim() || !password) return { ok: false, error: 'Email and password required' }
    setUser({
      id: `user-${Date.now()}`,
      email: email.trim(),
      name: email.trim().split('@')[0],
    })
    return { ok: true }
  }

  const register = (name, email, password) => {
    if (!name?.trim() || !email?.trim() || !password) {
      return { ok: false, error: 'Name, email and password required' }
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters' }
    }
    setUser({
      id: `user-${Date.now()}`,
      email: email.trim(),
      name: name.trim(),
    })
    return { ok: true }
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
