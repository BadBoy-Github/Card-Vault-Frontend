import { useLocation } from "react-router-dom";
import GiftCard from "../components/GiftCard";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the search query (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedQuery) {
          params.append("search", debouncedQuery);
        }
        params.append("page", page);
        params.append("limit", 20);

        const res = await fetch(`${API_URL}/products?${params.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setResults(data.products || []);
          setTotalPages(data.pages || 1);
        }
      } catch (err) {
        console.error("Error searching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container-wide flex-1 py-6 sm:py-8 overflow-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="apple-display text-[var(--color-text)] text-2xl sm:text-3xl">
          {debouncedQuery
            ? `Search results for "${debouncedQuery}"`
            : "All Gift Cards"}
        </h1>
        <p className="apple-body mt-1 text-[14px] sm:text-[15px]">
          {results.length} {results.length === 1 ? "item" : "items"} found.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-xl p-8 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <p className="apple-body text-[15px]">
            We couldn't find any matches for your search.
          </p>
          <p className="apple-body mt-1 text-[13px]">
            Try different keywords or browse our top categories.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((card) => (
              <GiftCard key={card.id} card={card} />
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
        </>
      )}
    </div>
  );
}
