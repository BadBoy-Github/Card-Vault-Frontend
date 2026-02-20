import { useState } from 'react'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setStatus(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error')
      return
    }
    setLoading(true)
    setStatus(null)
    setTimeout(() => {
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      setLoading(false)
    }, 600)
  }

  return (
    <section id="contact" className="section-padding-lg" aria-labelledby="contact-heading">
      <div className="container-wide">
        <div className="glass-panel rounded-2xl p-6 sm:rounded-3xl sm:p-10 md:p-14">
          <div className="text-center">
            <h2 id="contact-heading" className="apple-display text-[var(--color-text)]">
              Concierge Support
            </h2>
            <p className="apple-body mt-3 text-[15px] sm:mt-4 sm:text-[17px]">
              For specialized inquiries, bulk institutional orders, or technical assistance, our team is at your service.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
            <div>
              <label htmlFor="contact-name" className="block text-[14px] font-medium text-[var(--color-text)]">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-[14px] font-medium text-[var(--color-text)]">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-[14px] font-medium text-[var(--color-text)]">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="How can we help?"
                className="glass-input mt-2 min-h-[120px] w-full resize-y rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="glass-cta min-h-[44px] w-full rounded-full py-3.5 text-[16px] font-medium text-white transition disabled:opacity-60 sm:w-auto sm:px-10 sm:text-[17px]"
            >
              {loading ? 'Sending…' : 'Send message'}
            </button>
          </form>
          {status === 'success' && (
            <p className="mt-6 text-center text-[15px] font-medium text-[var(--color-accent)]">
              Message sent. We&apos;ll get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-6 text-center text-[15px] text-[var(--color-accent)]">
              Please fill in all fields.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
