import { useLocation } from "react-router-dom";
import GiftCard from "../components/GiftCard";
import { useEffect, useState } from "react";
import SEO from "../components/SEO";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export default function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  // Dynamic SEO based on search query - Optimized for card vault keywords
  const seoTitle = query
    ? `Search: ${query} - Gift Cards | Card Vault`
    : "Gift Cards Collection - Find Your Perfect Gift Card | Card Vault";

  const seoDescription = query
    ? `Search results for "${query}" on Card Vault (card-vault). Buy ${query} gift cards online with instant delivery. Browse our collection of gaming, entertainment & shopping gift cards at Card Vault.`
    : "Browse our collection of digital gift cards for gaming, entertainment & shopping at Card Vault. Find the perfect gift card for yourself or your loved ones. Instant email delivery. Shop now at Card Vault!";

  const seoKeywords = query
    ? `card vault, card-vault, ${query} gift card, buy ${query} gift card online, digital gift cards`
    : "card vault, card-vault, gift cards, digital gift cards, gaming gift cards, shopping gift cards, buy gift cards online";

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
          // Handle both array response and object with products/pages
          if (Array.isArray(data)) {
            setResults(data || []);
            setTotalPages(1);
          } else {
            setResults(data.products || data || []);
            setTotalPages(data.pages || 1);
          }
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, page]);

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
      />
      <div className="container-wide py-6 sm:py-8" id="gift-cards">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="apple-display mb-2 text-[var(--color-text)] sm:mb-3">
            {query ? `Search: "${query}"` : "Gift Cards"}
          </h1>
          <p className="apple-body text-[var(--color-text-secondary)]">
            {query
              ? `Found ${results.length} results for "${query}"`
              : "Browse our collection of premium digital gift cards"}
          </p>
        </div>

        {/* Gift Card Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
            {results.map((card) => (
              <GiftCard key={card._id || card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="apple-body text-lg text-[var(--color-text-secondary)]">
              No gift cards found. Try a different search term.
            </p>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              Browse all gift cards at{" "}
              <span className="font-semibold text-[var(--color-accent)]">
                Card Vault
              </span>
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 transition-colors hover:bg-[var(--color-hover)] disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-4 text-[var(--color-text-secondary)]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 transition-colors hover:bg-[var(--color-hover)] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
