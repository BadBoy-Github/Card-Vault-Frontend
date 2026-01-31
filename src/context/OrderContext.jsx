import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'cardvault-orders'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const arr = raw ? JSON.parse(raw) : []
      return Array.isArray(arr) ? arr : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const addOrder = (items, total) => {
    const order = {
      id: `ord-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      total,
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  const getOrderById = (id) => orders.find((o) => o.id === id) ?? null

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}
