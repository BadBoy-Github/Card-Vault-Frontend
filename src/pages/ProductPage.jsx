import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { HiHeart } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setCard(data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_URL}/wishlist/check/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setIsWishlisted(data.isInWishlist);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkWishlist();
  }, [user, id]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:px-8">
        <div className="glass-panel max-w-md rounded-2xl p-10 text-center">
          <h1 className="apple-display text-[var(--color-text)]">
            Product not found
          </h1>
          <Link
            to="/"
            className="glass-cta mt-6 inline-block rounded-full px-6 py-3 text-[17px] font-medium text-white"
          >
            Go to Vault
          </Link>
        </div>
      </div>
    );
  }

  const total = card.value * quantity;

  const handleBuy = () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${card.id}` } });
      return;
    }
    navigate("/payment-traffic");
  };

  const toggleWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (isWishlisted) {
        const res = await fetch(`${API_URL}/wishlist/remove/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (res.ok) {
          setIsWishlisted(false);
          setNotification("Removed from wishlist");
        }
      } else {
        const res = await fetch(`${API_URL}/wishlist/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ productId: id }),
        });
        if (res.ok) {
          setIsWishlisted(true);
          setNotification("Added to wishlist");
        }
      }
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="container-wide py-6 sm:py-10">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-scale-in">
          <div
            className={`glass-panel rounded-xl px-4 py-2 border ${isWishlisted ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}
          >
            <p
              className={`text-[14px] font-medium ${isWishlisted ? "text-green-500" : "text-red-500"}`}
            >
              {notification}
            </p>
          </div>
        </div>
      )}

      <Link
        to="/"
        className="apple-link mb-6 inline-flex min-h-[44px] w-fit items-center gap-2 text-[14px]"
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Vault
      </Link>

      <div className="glass-card mx-auto max-w-4xl overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Image Section - 16:9 Aspect Ratio */}
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface)] md:w-2/5">
            <img
              src={card.image}
              alt={card.name}
              className="h-full w-full object-cover"
            />
            {card.popular && (
              <span className="glass-pill absolute right-3 top-3 rounded-full bg-[var(--color-accent)]/90 px-2.5 py-1 text-[11px] font-medium text-white">
                Popular
              </span>
            )}
            {/* Heart Button */}
            <button
              onClick={toggleWishlist}
              className={`absolute left-3 top-3 rounded-full p-2 transition ${
                isWishlisted
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/20 backdrop-blur-sm text-white/70 hover:text-red-500 hover:bg-white/30"
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <HiHeart className="h-6 w-6" />
            </button>
          </div>

          {/* Details Section - Right to the Image */}
          <div className="flex flex-1 flex-col">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                {card.brand}
              </p>
              <h1 className="apple-title mt-1 text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                {card.name}
              </h1>
              <p className="apple-body mt-3 text-[14px] leading-relaxed text-[var(--color-text-muted)]">
                {card.description}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-baseline gap-4">
                <span className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
                  ₹{card.price}
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-tight text-[var(--color-text-muted)]">
                    Digital Delivery
                  </span>
                  {card.stock > 0 ? (
                    <span
                      className={`text-[11px] font-semibold ${card.stock <= 2 ? "text-red-500 animate-pulse" : "text-green-500"}`}
                    >
                      {card.stock <= 2
                        ? `Only ${card.stock} left!`
                        : "In Stock"}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-red-500">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="glass-pill flex items-center gap-2 rounded-full px-3 py-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Category:
                  </span>
                  <span className="text-[12px] font-medium text-[var(--color-text)] capitalize">
                    {card.category}
                  </span>
                </div>
                {card.validityEndDateTime && (
                  <div className="glass-pill flex items-center gap-2 rounded-full px-3 py-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Valid Until:
                    </span>
                    <span className="text-[12px] font-medium text-[var(--color-text)]">
                      {new Date(card.validityEndDateTime).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--color-glass-border)] pt-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                  Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={card.stock === 0}
                  className="glass-input h-10 w-fit min-w-[80px] rounded-lg px-3 py-1.5 text-[15px] text-[var(--color-text)] focus:outline-none disabled:opacity-50"
                >
                  {Array.from(
                    { length: Math.min(card.stock, 5) },
                    (_, i) => i + 1,
                  ).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                  {card.stock === 0 && <option value="0">0</option>}
                </select>
              </div>

              <div className="flex flex-col gap-0.5 text-right">
                <label className="text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-tight">
                  Total Amount
                </label>
                <span className="text-2xl font-bold text-[var(--color-accent)]">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-auto pt-8">
              <button
                type="button"
                onClick={handleBuy}
                disabled={card.stock === 0}
                className="glass-cta flex min-h-[48px] w-full items-center justify-center rounded-xl px-8 text-[16px] font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {card.stock > 0 ? "Buy Now" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
