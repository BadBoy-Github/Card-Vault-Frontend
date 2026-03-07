import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { HiHeart } from "react-icons/hi";
import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export default function GiftCard({ card, onWishlistChange }) {
  const { name, brand, denomination, description, image, popular } = card;
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [notification, setNotification] = useState(null);

  const productId = card._id || card.id;
  const productUrlId = card.id || card._id;
  const wishlisted = isInWishlist(productId);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setNotification("Please login to add to wishlist");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const wasInWishlist = wishlisted;

    try {
      await toggleWishlist(productId);
      setNotification(
        wasInWishlist
          ? "Removed from your wishlist – we'll miss it!"
          : "Added to your wishlist! ✨",
      );
      if (onWishlistChange) {
        onWishlistChange(productId, !wasInWishlist);
      }
    } catch (err) {
      console.error(err);
      setNotification("Failed to update wishlist. Please try again.");
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Link to={`/product/${productUrlId}`} className="block rounded-2xl">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-scale-in overflow-hidden">
          <div
            className={`glass-panel rounded-xl px-4 py-2 border transition-all duration-300 ${wishlisted ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}
          >
            <p
              className={`text-[14px] font-medium transition-all duration-300 ${wishlisted ? "text-green-500" : "text-red-500"}`}
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
          onClick={handleToggleWishlist}
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
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--color-accent)] sm:text-[10px]">
            {brand}
          </p>
          <h3 className="mt-0.5 text-[16px] font-semibold leading-tight text-[var(--color-text)] sm:text-[18px]">
            {name}
          </h3>
          <p className="mt-1 line-clamp-2 flex-1 text-[12px] leading-relaxed text-[var(--color-text-muted)] sm:text-[13px]">
            {description}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2 sm:mt-3">
            <span className="text-[18px] font-semibold text-[var(--color-text)] sm:text-[20px]">
              {denomination || `₹${card.price}`}
            </span>
            <div className="flex flex-col items-end">
              {card.stock > 0 && card.stock <= 2 ? (
                <span className="text-[11px] font-bold text-red-500 animate-pulse">
                  Only {card.stock} left
                </span>
              ) : null}
              <span className="text-[13px] font-medium text-[var(--color-accent)] sm:text-[14px]">
                {card.stock > 0 ? "View Details" : "Out of stock"}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
