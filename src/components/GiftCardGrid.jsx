import { useState, useEffect } from 'react'
import GiftCard from './GiftCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const DISPLAY_COUNT = 4

export default function GiftCardGrid() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`)
        const data = await res.json()
        if (res.ok) {
          setProducts(data)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const displayedCards = products.slice(0, DISPLAY_COUNT)

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <section id="gift-cards" className="flex flex-1 flex-col section-padding">
      <div className="container-wide">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="apple-display text-[var(--color-text)]">
            Choose a gift card
          </h2>
          <p className="apple-body mt-2 px-2 text-[15px] sm:mt-3 sm:text-[17px] md:text-[19px]">
            All cards are delivered digitally. Pick one and go.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {displayedCards.map((card) => (
            <GiftCard key={card.id || card._id} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
