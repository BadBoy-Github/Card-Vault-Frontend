import { useLocation } from 'react-router-dom'
import { giftCards } from '../data'
import GiftCard from '../components/GiftCard'
import { useEffect, useState } from 'react'

export default function SearchPage() {
  const location = useLocation()
  const [results, setResults] = useState([])
  const query = new URLSearchParams(location.search).get('q') || ''

  useEffect(() => {
    if (query.trim()) {
      const q = query.toLowerCase()
      const filtered = giftCards.filter(card => 
        card.name.toLowerCase().includes(q) || 
        card.brand.toLowerCase().includes(q) ||
        card.description.toLowerCase().includes(q) ||
        card.category.toLowerCase().includes(q)
      )
      setResults(filtered)
    } else {
      setResults(giftCards)
    }
  }, [query])

  return (
    <div className="container-wide flex-1 py-20 sm:py-24 md:py-32">
      <div className="mb-10 sm:mb-16">
        <h1 className="apple-display text-[var(--color-text)]">
          {query ? `Search results for "${query}"` : 'All Gift Cards'}
        </h1>
        <p className="apple-body mt-3 text-[17px] sm:text-[19px]">
          {results.length} {results.length === 1 ? 'item' : 'items'} found.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-16 text-center">
          <div className="mb-6 text-6xl">🔍</div>
          <p className="apple-body text-[19px]">We couldn&apos;t find any matches for your search.</p>
          <p className="apple-body mt-2">Try different keywords or browse our top categories.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((card) => (
            <GiftCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  )
}
