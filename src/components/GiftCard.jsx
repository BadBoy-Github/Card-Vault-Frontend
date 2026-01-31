import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'

export default function GiftCard({ card }) {
  const { name, brand, denomination, description, image, popular, inStock } = card
  const { has, toggle } = useWishlist()
  const inWishlist = has(card.id)

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(card.id)
  }

  return (
    <Link to={`/product/${card.id}`} className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]">
      <article className="glass-card group relative flex flex-col overflow-hidden rounded-2xl">
        {popular && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[11px] font-medium text-white sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[12px]">
            Popular
          </span>
        )}
        <button
          type="button"
          onClick={handleWishlist}
          className="glass-pill touch-target absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:scale-105 active:scale-95 sm:left-4 sm:top-4 sm:h-9 sm:w-9"
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
        </button>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface)]">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] sm:text-[12px]">
            {brand}
          </p>
          <h3 className="mt-1 text-[17px] font-semibold leading-snug text-[var(--color-text)] sm:text-[19px]">{name}</h3>
          <p className="mt-2 line-clamp-2 flex-1 text-[14px] leading-normal text-[var(--color-text-muted)] sm:text-[15px]">
            {description}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
            <span className="text-[20px] font-semibold text-[var(--color-text)] sm:text-[22px]">{denomination}</span>
            <span className="text-[14px] font-medium text-[var(--color-accent)] sm:text-[15px]">
              {inStock ? 'View' : 'Out of stock'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
