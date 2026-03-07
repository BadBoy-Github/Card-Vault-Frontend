import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useState, useEffect } from "react";
import { HiHeart, HiTrash } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      showNotification("Removed from your wishlist – we'll miss it!");
    } catch (err) {
      console.error(err);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container-wide flex flex-col py-6 sm:py-10">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-scale-in">
          <div className="glass-panel rounded-xl px-6 py-3 border border-red-500/30 bg-red-500/10">
            <p className="text-red-500 font-medium">{notification}</p>
          </div>
        </div>
      )}

      <div className="mb-6 shrink-0 md:mb-10 mt-10 text-center">
        <h1 className="apple-display text-[var(--color-text)]">
          Your Wishlist
        </h1>
        <p className="apple-body mt-4 text-[17px]">Your saved gift cards</p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {wishlist.length === 0 ? (
          <div className="glass-panel flex flex-1 flex-col items-center justify-center rounded-[32px] p-10 text-center">
            <div className="mb-10 text-7xl text-red-500 animate-bounce-subtle flex items-center justify-center">
              <HiHeart />
            </div>
            <p className="apple-body text-[19px] font-medium text-[var(--color-text)]">
              Your wishlist is empty
            </p>
            <p className="apple-body mt-4 text-[15px] text-[var(--color-text-muted)]">
              Add some gift cards to your wishlist to see them here.
            </p>
            <Link
              to="/"
              className="glass-cta mt-8 inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-[17px] font-semibold text-white transition-all hover:scale-105 active:scale-95"
            >
              Explore Vault
              <svg
                className="h-4 w-4"
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
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {wishlist.map(
              (item) =>
                item.product && (
                  <div
                    key={item.product._id}
                    className="glass-card group relative flex flex-col overflow-hidden rounded-2xl"
                  >
                    <Link
                      to={`/product/${item.product.id || item.product._id}`}
                      className="block"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface)]">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveFromWishlist(item.product._id);
                          }}
                          className="absolute right-3 top-3 z-10 rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600"
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex flex-1 flex-col p-4 sm:p-6">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-accent)] sm:text-[11px]">
                          {item.product.brand}
                        </p>
                        <h3 className="mt-1 text-[18px] font-semibold leading-tight text-[var(--color-text)] sm:text-[20px]">
                          {item.product.name}
                        </h3>
                        <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
                          <span className="text-[20px] font-semibold text-[var(--color-text)] sm:text-[22px]">
                            ₹{item.product.price}
                          </span>
                          <span className="text-[14px] font-medium text-[var(--color-accent)] sm:text-[15px]">
                            View Details
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
