import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'
import { getGiftCardById } from '../data'

export default function OrderPage() {
  const { user } = useAuth()
  const { orders } = useOrders()

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:px-8">
        <div className="glass-panel mx-auto max-w-md rounded-2xl p-10 text-center">
          <h1 className="apple-display text-[var(--color-text)]">Your Orders</h1>
          <p className="apple-body mt-4 text-[17px]">
            Please sign in to view your order history.
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
        <h1 className="apple-display text-[var(--color-text)]">Your orders</h1>
        <p className="apple-body mt-3 text-[17px]">Order history and details.</p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel flex flex-1 flex-col items-center justify-center rounded-3xl p-12 text-center">
          <p className="apple-body text-[19px]">You haven&apos;t placed any orders yet.</p>
          <Link
            to="/"
            className="glass-cta mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[17px] font-medium text-white"
          >
            Browse gift cards
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ) : (
        <ul className="mt-6 flex-1 space-y-8">
          {orders.map((order) => {
            if (!order || !order.items) return null;
            return (
              <li key={order.id} className="glass-card overflow-hidden rounded-3xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-glass-border)] p-6">
                <div>
                  <span className="font-mono text-sm text-[var(--color-text-muted)]">{order.id}</span>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {new Date(order.date).toLocaleDateString(undefined, {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <span className="text-xl font-bold text-[var(--color-text)]">
                  ${(order.total || 0).toFixed(2)}
                </span>
              </div>
              <ul className="divide-y divide-[var(--color-glass-border)] p-6">
                {order.items.map((item, i) => {
                  const product = getGiftCardById(item.productId)
                  return (
                    <li key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        {product && (
                          <img
                            src={product.image}
                            alt=""
                            className="glass-pill h-14 w-20 rounded-xl object-cover ring-1 ring-[var(--color-glass-border)]"
                          />
                        )}
                        <div>
                          <p className="font-medium text-[var(--color-text)]">
                            {item.name}
                          </p>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            {item.denomination} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-[var(--color-text)]">
                        ${(item.value * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
