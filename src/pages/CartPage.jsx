import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HiShoppingCart } from 'react-icons/hi'

export default function CartPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:px-8">
        <div className="glass-panel mx-auto max-w-md rounded-2xl p-10 text-center">
          <h1 className="apple-display text-[var(--color-text)]">Your Cart</h1>
          <p className="apple-body mt-4 text-[17px]">
            Please sign in to access your cart and continue.
          </p>
          <Link
            to="/login"
            className="glass-cta mt-6 inline-block rounded-full px-6 py-3 text-[17px] font-medium text-white"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-wide flex  flex-col py-6 sm:py-10 mt-20">
      <div className="mb-6 shrink-0 md:mb-10 mt-10 text-center">
        <h1 className="apple-display text-[var(--color-text)]">Your Cart</h1>
        <p className="apple-body mt-4 text-[17px]">Manage your items and prepare for checkout.</p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="glass-panel flex flex-1 flex-col items-center justify-center rounded-[32px] p-10 text-center">
          <div className="mb-10 text-7xl text-[var(--color-accent)] animate-bounce-subtle flex items-center justify-center">
            <HiShoppingCart />
          </div>
          <p className="apple-body text-[19px] font-medium text-[var(--color-text)]">Your cart is currently empty.</p>
          <p className="apple-body mt-4 text-[15px] text-[var(--color-text-muted)]">Add some gift cards to get started.</p>
          <Link
            to="/"
            className="glass-cta mt-8 inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-[17px] font-semibold text-white transition-all hover:scale-105 active:scale-95"
          >
            Explore Gift Cards
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
