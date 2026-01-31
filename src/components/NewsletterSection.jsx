import { useState } from 'react'

const STORAGE_KEY = 'cardvault-newsletter'

function getSubscribers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function addSubscriber(email) {
  const list = getSubscribers()
  if (list.includes(email.trim().toLowerCase())) return false
  list.push(email.trim().toLowerCase())
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return true
}

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus(null)
    const trimmed = email.trim()
    if (!trimmed) {
      setStatus('invalid')
      return
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(trimmed)) {
      setStatus('invalid')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const added = addSubscriber(trimmed)
      setStatus(added ? 'success' : 'duplicate')
      if (added) setEmail('')
      setLoading(false)
    }, 400)
  }

  return (
    <section id="newsletter" className="section-padding-lg px-4 sm:px-6 md:px-8" aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-[600px]">
        <div className="glass-panel rounded-2xl p-6 text-center sm:rounded-3xl sm:p-10 md:p-14">
          <h2 id="newsletter-heading" className="apple-display text-[var(--color-text)]">
            Get notified on new cards
          </h2>
          <p className="apple-body mt-3 text-[15px] sm:mt-4 sm:text-[17px]">
            Subscribe to our newsletter. We&apos;ll email you when we add new gift cards to the collection.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="glass-input min-h-[44px] w-full rounded-full px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:max-w-[280px] sm:px-5 sm:text-[17px]"
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={loading}
              className="glass-cta min-h-[44px] w-full rounded-full px-8 py-3.5 text-[16px] font-medium text-white transition disabled:opacity-60 sm:w-auto sm:text-[17px]"
            >
              {loading ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
          {status === 'success' && (
            <p className="mt-5 text-[15px] font-medium text-[var(--color-accent)]">
              Thanks! We&apos;ll notify you when new cards are added.
            </p>
          )}
          {status === 'duplicate' && (
            <p className="apple-body mt-5 text-[15px]">
              This email is already subscribed.
            </p>
          )}
          {status === 'invalid' && (
            <p className="mt-5 text-[15px] text-[var(--color-accent)]">
              Please enter a valid email address.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
