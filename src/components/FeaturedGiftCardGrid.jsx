import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export default function FeaturedGiftCardGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`${API_URL}/products?type=featured`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data || []);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Show loading skeleton
  if (loading) {
    return (
      <section
        id="featured-gift-cards"
        className="flex flex-1 flex-col section-padding"
      >
        <div className="container-wide">
          <div className="mb-8 text-center sm:mb-10">
            <div className="animate-pulse h-10 w-64 bg-[var(--color-surface)] rounded-lg mx-auto" />
            <div className="animate-pulse h-5 w-96 bg-[var(--color-surface)] rounded mt-3 mx-auto" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <div className="animate-pulse aspect-video bg-[var(--color-surface)]" />
                <div className="p-5 space-y-3">
                  <div className="animate-pulse h-3 w-16 bg-[var(--color-surface)] rounded" />
                  <div className="animate-pulse h-5 w-3/4 bg-[var(--color-surface)] rounded" />
                  <div className="animate-pulse h-4 w-20 bg-[var(--color-surface)] rounded" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="animate-pulse h-6 w-24 bg-[var(--color-surface)] rounded" />
                    <div className="animate-pulse h-10 w-28 bg-[var(--color-surface)] rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show section only if there are products (or comment out to always show)
  if (products.length === 0) {
    return (
      <section
        id="featured-gift-cards"
        className="flex flex-1 flex-col section-padding bg-gradient-to-b from-transparent to-[var(--color-glass)]"
      >
        <div className="container-wide">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="apple-display text-[var(--color-text)]">
              Featured Gift Cards
            </h2>
            <p className="apple-body mt-2 px-2 text-[15px] sm:mt-3 sm:text-[17px] md:text-[19px]">
              Exclusive offers and special codes. Check back soon for amazing
              deals!
            </p>
          </div>

          {/* Coming Soon Placeholder */}
          <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent)]/10 mb-4">
              <svg
                className="w-8 h-8 text-[var(--color-accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
              Coming Soon!
            </h3>
            <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
              We're working on some exclusive offers and special codes for you.
              Stay tuned for amazing deals on redeem codes and gift cards!
            </p>
            <Link
              to="/search"
              className="glass-cta mt-6 inline-block rounded-full px-6 py-3 text-[15px] font-semibold text-white"
            >
              Browse Regular Gift Cards
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="featured-gift-cards"
      className="flex flex-1 flex-col section-padding"
    >
      <div className="container-wide">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="apple-display text-[var(--color-text)]">
            Featured Gift Cards
          </h2>
          <p className="apple-body mt-2 px-2 text-[15px] sm:mt-3 sm:text-[17px] md:text-[19px]">
            Exclusive offers and special codes. Grab them before they're gone!
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              to={`/featured-product/${product.id}`}
              className="glass-card group block rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {product.popular && (
                  <div className="absolute top-3 right-3 bg-[var(--color-accent)] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                    Popular
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[var(--color-accent)] uppercase tracking-wider">
                    {product.brand}
                  </span>
                </div>
                <h3 className="text-[17px] font-bold text-[var(--color-text)] mb-1 line-clamp-1">
                  {product.name}
                </h3>
                {product.subheading && (
                  <p className="text-[13px] text-[var(--color-text-muted)] mb-3 line-clamp-1">
                    {product.subheading}
                  </p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-glass-border)]">
                  <span className="text-[20px] font-bold text-[var(--color-accent)]">
                    ₹{product.price}
                  </span>
                  <span className="glass-cta px-4 py-2 rounded-full text-[13px] font-semibold text-white">
                    View Code
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {products.length > 4 && (
          <div className="mt-8 text-center">
            <Link
              to="/search?type=featured"
              className="apple-link inline-flex items-center gap-1.5 text-[15px] font-medium"
            >
              View All Featured Products
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
