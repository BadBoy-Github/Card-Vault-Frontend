import { Link } from 'react-router-dom'
export default function GiftCard({ card }) {
  const { name, brand, denomination, description, image, popular, inStock } = card

  return (
    <Link to={`/product/${card.id}`} className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]">
      <article className="glass-card group relative flex flex-col overflow-hidden rounded-2xl">
        {popular && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[11px] font-medium text-white sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[12px]">
            Popular
          </span>
        )}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface)]">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-accent)] sm:text-[11px]">
            {brand}
          </p>
          <h3 className="mt-1 text-[18px] font-semibold leading-tight text-[var(--color-text)] sm:text-[20px]">{name}</h3>
          <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-[var(--color-text-muted)] sm:text-[14px]">
            {description}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
            <span className="text-[20px] font-semibold text-[var(--color-text)] sm:text-[22px]">{denomination}</span>
            <div className="flex flex-col items-end">
              {card.stock > 0 && card.stock <= 2 ? (
                <span className="text-[12px] font-bold text-red-500 animate-pulse">
                  Only {card.stock} left
                </span>
              ) : null}
              <span className="text-[14px] font-medium text-[var(--color-accent)] sm:text-[15px]">
                {card.stock > 0 ? 'View Details' : 'Out of stock'}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
