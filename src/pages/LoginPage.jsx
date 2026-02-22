import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(email, password)
    if (result.ok) {
      navigate(from, { replace: true })
    } else {
      setError(result.error ?? 'Login failed. Maybe try a password you actually remember?')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-section-bg)] px-4 py-12 sm:px-6 md:px-8">
      <div className="glass-panel w-full max-w-[400px] rounded-2xl p-6 sm:p-10 md:p-12">
        <h1 className="apple-display text-[var(--color-text)]">Welcome Back</h1>
        <p className="apple-body mt-3 text-[17px]">
          Ready to spend those vault credits? Or just here to window-shop again?
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <p className="rounded-xl border border-[var(--color-glass-border)] bg-red-500/10 px-4 py-3 text-[15px] text-[var(--color-accent)]">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="login-email" className="block text-[14px] font-medium text-[var(--color-text)]">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-[14px] font-medium text-[var(--color-text)]">
              Secret Code
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 pr-12 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mt-1"
              >
                {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="glass-cta min-h-[44px] w-full rounded-full py-3.5 text-[16px] font-medium text-white sm:text-[17px]"
          >
            Enter the Vault
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-[var(--color-text-muted)]">
          New around here?{' '}
          <Link to="/register" className="apple-link font-medium">
            Join the inner circle
          </Link>
        </p>
      </div>
    </div>
  )
}
