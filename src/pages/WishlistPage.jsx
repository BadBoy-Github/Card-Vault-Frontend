import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { giftCards } from '../data'
import GiftCard from '../components/GiftCard'

export default function WishlistPage() {
  const { user } = useAuth()
  const { ids, remove } = useWishlist()
  const cards = giftCards.filter((c) => ids.includes(c.id))

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:px-8">
        <div className="glass-panel mx-auto max-w-md rounded-2xl p-10 text-center">
          <h1 className="apple-display text-[var(--color-text)]">Wishlist</h1>
          <p className="apple-body mt-4 text-[17px]">
            Please sign in to access your saved items.
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
      <div className="mb-10">
        <h1 className="apple-display text-[var(--color-text)]">Wishlist</h1>
        <p className="apple-body mt-3 text-[17px]">
          {cards.length === 0
            ? 'Save gift cards you like here.'
            : `${cards.length} item${cards.length === 1 ? '' : 's'} saved.`}
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="glass-panel flex flex-1 flex-col items-center justify-center rounded-3xl p-12 text-center">
          <p className="apple-body text-[17px]">Your wishlist is empty.</p>
          <Link
            to="/"
            className="glass-cta mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[17px] font-medium text-white"
          >
            Browse gift cards
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid flex-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.id} className="relative">
              <button
                type="button"
                onClick={() => remove(card.id)}
                className="glass-pill absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:scale-105"
                aria-label="Remove from wishlist"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <GiftCard card={card} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
