import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { HiHeart, HiShoppingCart, HiCheck, HiClock } from "react-icons/hi";
import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export default function GiftCard({
  card,
  onWishlistChange,
  basePath = "/product",
}) {
  const {
    name,
    brand,
    denomination,
    description,
    image,
    popular,
    price,
    stock,
    validityEndDateTime,
  } = card;
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCart, addToCart, removeFromCart } = useCart();
  const [notification, setNotification] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const productId = card._id || card.id;
  const productUrlId = card.id || card._id;
  const wishlisted = isInWishlist(productId);
  const inCart = isInCart(productId);

  // Check if product is expired or expiring soon
  const now = new Date();
  const expiryDate = validityEndDateTime ? new Date(validityEndDateTime) : null;
  const isExpired = expiryDate && expiryDate < now;
  const daysUntilExpiry = expiryDate
    ? Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiringSoon =
    daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  // Set stock to 0 if expired
  const effectiveStock = isExpired ? 0 : stock;
  const isAvailable = effectiveStock > 0;

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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setNotification("Please login to add to cart");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (!isAvailable) return;

    setIsAddingToCart(true);

    try {
      if (inCart) {
        await removeFromCart(productId);
        setNotification("Removed from cart");
      } else {
        const result = await addToCart(productId, 1);
        if (result.success) {
          setNotification("Added to cart! 🛒");
        } else {
          setNotification(result.message);
        }
      }
    } catch (err) {
      console.error(err);
      setNotification("Failed to update cart. Please try again.");
    }

    setIsAddingToCart(false);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Link
      to={`${basePath}/${productUrlId}`}
      className="block rounded-2xl transition-all duration-300"
    >
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-scale-in overflow-hidden transition-all duration-300">
          <div
            className={`glass-panel rounded-xl px-4 py-2 border transition-all duration-300 ${
              inCart
                ? "border-green-500/30 bg-green-500/10"
                : wishlisted
                  ? "border-red-500/30 bg-red-500/10"
                  : "border-blue-500/30 bg-blue-500/10"
            }`}
          >
            <p
              className={`text-[14px] font-medium transition-all duration-300 ${
                inCart
                  ? "text-green-500"
                  : wishlisted
                    ? "text-red-500"
                    : "text-blue-500"
              }`}
            >
              {notification}
            </p>
          </div>
        </div>
      )}

      <article
        className={`glass-card group relative flex flex-col overflow-hidden rounded-2xl h-full transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-accent)]/10 ${popular ? "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-background)]" : ""} ${isExpired ? "grayscale opacity-60" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Heart Button - Always visible */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute left-3 top-3 z-10 rounded-full p-2 transition-all duration-300 ${
            wishlisted
              ? "bg-red-500 text-white hover:bg-red-600 scale-100"
              : "bg-black/40 backdrop-blur-sm text-white/80 hover:text-red-500 hover:bg-black/20"
          } sm:left-4 sm:top-4 opacity-100`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HiHeart className="h-5 w-5" />
        </button>

        {/* Cart Button - Small icon for available products */}
        {isAvailable && (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`absolute right-3 top-3 z-10 rounded-full p-2 transition-all duration-300 sm:right-4 sm:top-4 ${
              inCart
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-black/40 backdrop-blur-sm text-white/70 hover:text-green-500 hover:bg-black/20"
            } ${isHovered || inCart ? "opacity-100" : "opacity-0 sm:opacity-100"}`}
            title={inCart ? "In cart" : "Add to cart"}
          >
            <HiShoppingCart className="h-5 w-5" />
          </button>
        )}

        <div className="relative w-full pt-[62.5%] overflow-hidden bg-[var(--color-surface)]">
          {popular && (
            <span className="absolute right-2 bottom-2 z-10 rounded-full bg-[var(--color-accent)] px-2 py-1 text-[10px] font-medium text-white sm:right-3 sm:bottom-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
              Popular
            </span>
          )}
          <img
            src={image}
            alt={`${name} gift card - Buy ${brand} gift card on Card Vault - ${denomination || "₹" + price}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex flex-col p-3 sm:p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--color-accent)] sm:text-[10px]">
            {brand}
          </p>
          <h3 className="mt-0.5 text-[16px] font-semibold leading-tight text-[var(--color-text)] sm:text-[18px]">
            {name}
          </h3>
          <p
            className="mt-1 text-[12px] leading-relaxed text-[var(--color-text-muted)] sm:text-[13px] overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2 sm:mt-3">
            <span className="text-[18px] font-semibold text-[var(--color-text)] sm:text-[20px]">
              {denomination || `₹${card.price}`}
            </span>
            <div className="flex flex-col items-end">
              {effectiveStock > 0 && effectiveStock <= 2 ? (
                <span className="text-[11px] font-bold text-red-500 animate-pulse">
                  Only {effectiveStock} left
                </span>
              ) : null}
              {isExpiringSoon && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <HiClock className="h-3 w-3" />
                  <span className="text-[10px] font-medium">
                    Expires in {daysUntilExpiry} days
                  </span>
                </div>
              )}
              <span className="text-[13px] font-medium text-[var(--color-accent)] sm:text-[14px]">
                {isAvailable ? "View Details" : "Out of stock"}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
