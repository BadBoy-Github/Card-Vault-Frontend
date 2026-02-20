import { useParams, useNavigate, Link } from 'react-router-dom'
import { getGiftCardById } from '../data'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const card = getGiftCardById(id)
  const { has, toggle } = useWishlist()
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [bought, setBought] = useState(false)

  if (!card) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:px-8">
        <div className="glass-panel max-w-md rounded-2xl p-10 text-center">
          <h1 className="apple-display text-[var(--color-text)]">Product not found</h1>
          <Link to="/" className="glass-cta mt-6 inline-block rounded-full px-6 py-3 text-[17px] font-medium text-white">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const inWishlist = has(card.id)
  const total = card.value * quantity

  const handleBuy = () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${card.id}` } })
      return
    }
    navigate('/payment-traffic')
  }

  return (
    <div className="container-wide flex h-[calc(100vh-theme(spacing.16))] flex-col py-6 sm:h-[calc(100vh-theme(spacing.20))] sm:py-10">
      <Link
        to="/"
        className="apple-link mb-4 inline-flex min-h-[44px] w-fit items-center gap-2 text-[15px] sm:mb-6 sm:text-[17px]"
      >
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to gift cards
      </Link>

      <div className="glass-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl md:flex-row">
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-[var(--color-surface)] sm:h-64 md:h-full md:w-1/2">
          <img
            src={card.image}
            alt={card.name}
            className="h-full w-full object-cover"
          />
          {card.popular && (
            <span className="glass-pill absolute right-4 top-4 rounded-full bg-[var(--color-accent)]/90 px-3 py-1 text-xs font-medium text-white">
              Popular
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="flex flex-1 flex-col">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] sm:text-xs">
              {card.brand}
            </p>
            <h1 className="apple-display mt-1 text-[var(--color-text)]">{card.name}</h1>
            <p className="apple-body mt-4 text-[15px] leading-relaxed sm:text-[17px]">{card.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-bold text-[var(--color-text)] sm:text-4xl">{card.denomination}</span>
              <span className="text-[var(--color-text-muted)]">digital delivery</span>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[var(--color-text-muted)]">Quantity</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="glass-input min-h-[44px] w-fit min-w-[100px] rounded-xl px-4 py-2 text-[17px] text-[var(--color-text)] focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[var(--color-text-muted)]">Total Amount</label>
                <span className="text-xl font-bold text-[var(--color-accent)]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={handleBuy}
              disabled={!card.inStock}
              className="glass-cta flex min-h-[48px] flex-1 items-center justify-center rounded-full px-8 text-[17px] font-semibold text-white transition disabled:opacity-50"
            >
              Complete Purchase
            </button>
            <button
              type="button"
              onClick={() => toggle(card.id)}
              className={`glass-btn flex min-h-[48px] items-center justify-center gap-2 rounded-full px-8 text-[16px] font-medium transition ${
                inWishlist
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text)]'
              }`}
            >
              <svg className={`h-5 w-5 ${inWishlist ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {inWishlist ? 'Saved' : 'Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
