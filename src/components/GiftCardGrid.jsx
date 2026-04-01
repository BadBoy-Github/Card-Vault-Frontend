import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GiftCard from "./GiftCard";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export default function GiftCardGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products?page=${page}&limit=8`);
        const data = await res.json();
        if (res.ok) {
          // Handle both array response and object with products/pages
          let fetchedProducts = [];
          if (Array.isArray(data)) {
            fetchedProducts = data || [];
            setTotalPages(1);
          } else {
            fetchedProducts = data.products || data || [];
            setTotalPages(data.pages || 1);
          }

          // Sort products: expired products last
          const now = new Date();
          const sortedProducts = [...fetchedProducts].sort((a, b) => {
            const aExpiry = a.validityEndDateTime
              ? new Date(a.validityEndDateTime)
              : null;
            const bExpiry = b.validityEndDateTime
              ? new Date(b.validityEndDateTime)
              : null;
            const aExpired = aExpiry && aExpiry < now;
            const bExpired = bExpiry && bExpiry < now;

            // If both are expired or both are not expired, maintain original order
            if (aExpired === bExpired) return 0;
            // If a is expired and b is not, a comes after b
            if (aExpired && !bExpired) return 1;
            // If b is expired and a is not, a comes before b
            if (!aExpired && bExpired) return -1;
            return 0;
          });

          setProducts(sortedProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section id="gift-cards" className="flex flex-1 flex-col section-padding">
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

  if (products.length === 0) {
    return (
      <section
        id="gift-cards"
        className="flex flex-1 flex-col section-padding bg-gradient-to-b from-transparent to-[var(--color-glass)]"
      >
        <div className="container-wide">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="apple-display text-[var(--color-text)]">
              Gift Cards
            </h2>
            <p className="apple-body mt-2 px-2 text-[15px] sm:mt-3 sm:text-[17px] md:text-[19px]">
              Exclusive offers and special codes. Grab them before they're gone!
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="glass-panel rounded-full p-8 mb-6">
              <svg
                className="h-16 w-16 text-[var(--color-text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="apple-title text-[var(--color-text)] mb-2">
              No cards in the vault
            </h3>
            <p className="apple-body max-w-md">
              We couldn't find any gift cards at the moment. Check back soon for
              fresh additions!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Filter products for home page display
  // If more than 4 products, don't show expired ones
  // If 4 or fewer products, show all (expired ones last due to sorting)
  const now = new Date();
  const displayProducts =
    products.length > 4
      ? products
          .filter((p) => {
            const expiryDate = p.validityEndDateTime
              ? new Date(p.validityEndDateTime)
              : null;
            return !expiryDate || expiryDate >= now;
          })
          .slice(0, 4)
      : products;

  return (
    <section
      id="gift-cards"
      className="flex flex-1 flex-col section-padding bg-gradient-to-b from-transparent to-[var(--color-glass)]"
    >
      <div className="container-wide">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="apple-display text-[var(--color-text)]">Gift Cards</h2>
          <p className="apple-body mt-2 px-2 text-[15px] sm:mt-3 sm:text-[17px] md:text-[19px]">
            Exclusive offers and special codes. Grab them before they're gone!
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {displayProducts.map((card) => (
            <GiftCard key={card.id || card._id} card={card} />
          ))}
        </div>

        {/* View All Buttons */}
        {products.length > 4 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <Link
              to="/search?type=regular"
              className="apple-link inline-flex items-center gap-1.5 text-[15px] font-medium"
            >
              View All Gift Cards
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
            <Link
              to="/search"
              className="glass-cta inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[15px] font-medium text-white"
            >
              View All Products
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="glass-btn rounded-full px-4 py-2 text-[14px] disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-10 w-10 rounded-full text-[14px] ${
                      pageNum === page
                        ? "bg-[var(--color-accent)] text-white"
                        : "glass-btn text-[var(--color-text)]"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="glass-btn rounded-full px-4 py-2 text-[14px] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
