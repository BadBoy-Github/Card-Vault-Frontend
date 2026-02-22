import { useLocation } from 'react-router-dom'
import GiftCard from '../components/GiftCard'
import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function SearchPage() {
  const location = useLocation()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const query = new URLSearchParams(location.search).get('q') || ''

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/products`)
        const data = await res.json()
        if (res.ok) {
          const q = query.trim().toLowerCase()
          if (q) {
            const filtered = data.filter(card => 
              card.name.toLowerCase().includes(q) || 
              card.brand.toLowerCase().includes(q) ||
              card.description.toLowerCase().includes(q) ||
              card.category?.toLowerCase().includes(q)
            )
            setResults(filtered)
          } else {
            setResults(data)
          }
        }
      } catch (err) {
        console.error('Error searching products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  if (loading) {
    return (
      <div className="flex flex-1 justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container-wide flex-1 py-6 sm:py-8 overflow-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="apple-display text-[var(--color-text)] text-2xl sm:text-3xl">
          {query ? `Search results for "${query}"` : 'All Gift Cards'}
        </h1>
        <p className="apple-body mt-1 text-[14px] sm:text-[15px]">
          {results.length} {results.length === 1 ? 'item' : 'items'} found.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-xl p-8 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <p className="apple-body text-[15px]">We couldn&apos;t find any matches for your search.</p>
          <p className="apple-body mt-1 text-[13px]">Try different keywords or browse our top categories.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((card) => (
            <GiftCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  )
}
