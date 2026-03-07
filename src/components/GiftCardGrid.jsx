import { useState, useEffect } from "react";
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
          if (Array.isArray(data)) {
            setProducts(data || []);
            setTotalPages(1);
          } else {
            setProducts(data.products || data || []);
            setTotalPages(data.pages || 1);
          }
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
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
      </div>
    );
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
          {products.map((card) => (
            <GiftCard key={card.id || card._id} card={card} />
          ))}
        </div>

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
