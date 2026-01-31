import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'cardvault-wishlist'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const arr = raw ? JSON.parse(raw) : []
      return Array.isArray(arr) ? arr : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids])

  const add = (id) => setIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  const remove = (id) => setIds((prev) => prev.filter((x) => x !== id))
  const toggle = (id) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const has = (id) => ids.includes(id)

  return (
    <WishlistContext.Provider value={{ ids, add, remove, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
