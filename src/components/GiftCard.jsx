import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiHeart } from "react-icons/hi";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function GiftCard({
  card,
  isInWishlist = false,
  onWishlistChange,
}) {
  const { name, brand, denomination, description, image, popular, inStock } =
    card;
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(isInWishlist);
  const [notification, setNotification] = useState(null);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopPropagation();

    if (!user) {
      return;
    }

    try {
      if (wishlisted) {
        const res = await fetch(
          `${API_URL}/wishlist/remove/${card._id || card.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        if (res.ok) {
          setWishlisted(false);
          setNotification("Removed from wishlist");
          if (onWishlistChange) onWishlistChange(card._id || card.id, false);
        }
      } else {
        const res = await fetch(`${API_URL}/wishlist/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ productId: card._id || card.id }),
        });
        if (res.ok) {
          setWishlisted(true);
          setNotification("Added to wishlist");
          if (onWishlistChange) onWishlistChange(card._id || card.id, true);
        }
      }
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Link to={`/product/${card.id || card._id}`} className="block rounded-2xl">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-scale-in">
          <div
            className={`glass-panel rounded-xl px-4 py-2 border ${wishlisted ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}
          >
            <p
              className={`text-[14px] font-medium ${wishlisted ? "text-green-500" : "text-red-500"}`}
            >
              {notification}
            </p>
          </div>
        </div>
      )}

      <article className="glass-card group relative flex flex-col overflow-hidden rounded-2xl h-full">
        {popular && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[11px] font-medium text-white sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[12px]">
            Popular
          </span>
        )}

        {/* Heart Button */}
        <button
          onClick={toggleWishlist}
          className={`absolute left-3 top-3 z-10 rounded-full p-2 transition ${
            wishlisted
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/20 backdrop-blur-sm text-white/70 hover:text-red-500 hover:bg-white/30"
          } sm:left-4 sm:top-4`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HiHeart className="h-5 w-5" />
        </button>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface)]">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-accent)] sm:text-[11px]">
            {brand}
          </p>
          <h3 className="mt-1 text-[18px] font-semibold leading-tight text-[var(--color-text)] sm:text-[20px]">
            {name}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-[var(--color-text-muted)] sm:text-[14px]">
            {description}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
            <span className="text-[20px] font-semibold text-[var(--color-text)] sm:text-[22px]">
              {denomination || `₹${card.price}`}
            </span>
            <div className="flex flex-col items-end">
              {card.stock > 0 && card.stock <= 2 ? (
                <span className="text-[12px] font-bold text-red-500 animate-pulse">
                  Only {card.stock} left
                </span>
              ) : null}
              <span className="text-[14px] font-medium text-[var(--color-accent)] sm:text-[15px]">
                {card.stock > 0 ? "View Details" : "Out of stock"}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
