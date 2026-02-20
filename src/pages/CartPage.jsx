import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
    <div className="container-wide flex-1 flex flex-col py-16 sm:py-24">
      <div className="mb-10 text-center">
        <h1 className="apple-display text-[var(--color-text)]">Your Cart</h1>
        <p className="apple-body mt-3 text-[17px]">Manage your items and prepare for checkout.</p>
      </div>

      <div className="glass-panel flex flex-1 flex-col items-center justify-center rounded-2xl p-12 text-center">
        <div className="mb-6 text-5xl">🛒</div>
        <p className="apple-body text-[17px]">Your cart is currently empty.</p>
        <Link
          to="/"
          className="glass-cta mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[17px] font-medium text-white"
        >
          Explore Gift Cards
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
