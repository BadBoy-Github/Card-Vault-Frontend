import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { user, register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const result = register(name, email, password)
    if (result.ok) {
      navigate('/')
    } else {
      setError(result.error ?? 'Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-section-bg)] px-4 py-12 sm:px-6 md:px-8">
      <div className="glass-panel w-full max-w-[400px] rounded-2xl p-6 sm:p-10 md:p-12">
        <h1 className="apple-display text-[var(--color-text)]">Create account</h1>
        <p className="apple-body mt-3 text-[17px]">
          Sign up to place orders and manage your wishlist.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <p className="rounded-xl border border-[var(--color-glass-border)] bg-red-500/10 px-4 py-3 text-[15px] text-[var(--color-accent)]">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="reg-name" className="block text-[14px] font-medium text-[var(--color-text)]">
              Name
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-[14px] font-medium text-[var(--color-text)]">
              Email
            </label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password" className="block text-[14px] font-medium text-[var(--color-text)]">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            className="glass-cta min-h-[44px] w-full rounded-full py-3.5 text-[16px] font-medium text-white sm:text-[17px]"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="apple-link font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
