import { useParams, useNavigate, Link } from 'react-router-dom'
import { getGiftCardById } from '../data'
import { useWishlist } from '../context/WishlistContext'
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const card = getGiftCardById(id)
  const { has, toggle } = useWishlist()
  const { addOrder } = useOrders()
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
    addOrder(
      [{ productId: card.id, name: card.name, denomination: card.denomination, quantity, value: card.value }],
      total
    )
    setBought(true)
  }

  return (
    <div className="mx-auto flex max-w-[980px] flex-1 flex-col px-4 py-20 sm:px-6 sm:py-24 md:px-8 md:py-32">
      <Link
        to="/"
        className="apple-link mb-6 inline-flex min-h-[44px] w-fit items-center gap-2 text-[15px] sm:mb-10 sm:text-[17px]"
      >
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to gift cards
      </Link>

      <div className="glass-card grid flex-1 gap-6 overflow-hidden rounded-2xl md:grid-cols-2 md:gap-8">
        <div className="relative aspect-[4/3] min-h-[200px] overflow-hidden bg-[var(--color-surface)] sm:min-h-0">
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

        <div className="flex flex-col p-5 sm:p-6 md:p-8">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] sm:text-xs">
            {card.brand}
          </p>
          <h1 className="apple-display mt-1 text-[var(--color-text)]">{card.name}</h1>
          <p className="apple-body mt-3 text-[15px] sm:mt-4 sm:text-[17px]">{card.description}</p>

          <div className="mt-5 flex items-center gap-3 sm:mt-6 sm:gap-4">
            <span className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">{card.denomination}</span>
            <span className="text-[var(--color-text-muted)]">each</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-4">
            <label className="text-[14px] font-medium text-[var(--color-text)]">Quantity</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="glass-input min-h-[44px] w-fit min-w-[80px] rounded-xl px-4 py-2.5 text-[16px] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:text-[17px]"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
            <button
              type="button"
              onClick={handleBuy}
              disabled={!card.inStock || bought}
              className="glass-cta min-h-[44px] w-full rounded-full px-8 py-3.5 text-[16px] font-medium text-white transition disabled:opacity-50 sm:w-auto sm:text-[17px]"
            >
              {bought ? 'Added to orders' : `Buy now — $${total.toFixed(2)}`}
            </button>
            <button
              type="button"
              onClick={() => toggle(card.id)}
              className={`glass-btn touch-target flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium transition sm:w-auto ${
                inWishlist
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text)]'
              }`}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {inWishlist ? (
                <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              {inWishlist ? 'Saved' : 'Wishlist'}
            </button>
          </div>

          {bought && (
            <p className="apple-body mt-4 text-[15px]">
              Order recorded. View it in <Link to="/orders" className="apple-link">Your orders</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
