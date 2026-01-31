import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const result = login(email, password)
    if (result.ok) {
      navigate(from, { replace: true })
    } else {
      setError(result.error ?? 'Login failed')
    }
  }

  return (
    <div className="mx-auto flex flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:px-8">
      <div className="glass-panel w-full max-w-[400px] rounded-2xl p-6 sm:p-10 md:p-12">
        <h1 className="apple-display text-[var(--color-text)]">Sign in</h1>
        <p className="apple-body mt-3 text-[17px]">
          Use your email to sign in. Demo: any email + any password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <p className="rounded-xl border border-[var(--color-glass-border)] bg-red-500/10 px-4 py-3 text-[15px] text-[var(--color-accent)]">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="login-email" className="block text-[14px] font-medium text-[var(--color-text)]">
              Email
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
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="glass-cta min-h-[44px] w-full rounded-full py-3.5 text-[16px] font-medium text-white sm:text-[17px]"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-[var(--color-text-muted)]">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="apple-link font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
