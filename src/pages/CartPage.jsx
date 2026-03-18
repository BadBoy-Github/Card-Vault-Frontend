import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { HiShoppingCart, HiTrash, HiMinus, HiPlus } from "react-icons/hi";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, loading } = useCart();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      showNotification("Removed from cart");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }

    try {
      const result = await updateQuantity(productId, newQuantity);
      if (!result.success) {
        showNotification(result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Calculate totals
  const subtotal = cart.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

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
          <div className="glass-panel rounded-xl px-6 py-3 border border-green-500/30 bg-green-500/10">
            <p className="text-green-500 font-medium">{notification}</p>
          </div>
        </div>
      )}

      <div className="mb-6 shrink-0 md:mb-10 mt-10 text-center">
        <h1 className="apple-display text-[var(--color-text)]">Your Cart</h1>
        <p className="apple-body mt-4 text-[17px]">
          Review your selected gift cards
        </p>
      </div>

      {/* Alert - Cart doesn't reserve items */}
      {cart.length > 0 && (
        <div className="mb-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-4">
          <p className="text-[14px] text-yellow-600">
            <span className="font-semibold">Note:</span> Adding items to cart
            doesn't reserve them. Complete payment quickly to secure your
            purchase before others do!
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {cart.length === 0 ? (
          <div className="glass-panel flex flex-1 flex-col items-center justify-center rounded-[32px] p-10 text-center">
            <div className="mb-10 text-7xl text-[var(--color-accent)] animate-bounce-subtle flex items-center justify-center">
              <HiShoppingCart />
            </div>
            <p className="apple-body text-[19px] font-medium text-[var(--color-text)]">
              Your cart is empty
            </p>
            <p className="apple-body mt-4 text-[15px] text-[var(--color-text-muted)]">
              Add some gift cards to your cart to see them here.
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
          <div className="flex flex-col gap-6">
            {/* Cart Items */}
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {cart.map(
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
                              handleRemoveFromCart(item.product._id);
                            }}
                            className="absolute right-3 top-3 z-10 rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600"
                            title="Remove from cart"
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
                          </div>
                        </div>
                      </Link>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity - 1,
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[var(--color-text)] transition hover:bg-white/20"
                            disabled={item.quantity <= 1}
                          >
                            <HiMinus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-[16px] font-semibold text-[var(--color-text)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity + 1,
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[var(--color-text)] transition hover:bg-white/20"
                            disabled={
                              item.quantity >= (item.product.stock || 1)
                            }
                          >
                            <HiPlus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-[16px] font-bold text-[var(--color-accent)]">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ),
              )}
            </div>

            {/* Cart Summary */}
            <div className="glass-card mt-6 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Order Summary
              </h2>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-glass-border)] pt-4">
                <span className="text-lg text-[var(--color-text-muted)]">
                  Subtotal
                </span>
                <span className="text-2xl font-bold text-[var(--color-text)]">
                  ₹{subtotal}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {cart.length} {cart.length === 1 ? "item" : "items"} in cart
              </p>
              <Link
                to={`/payment?amount=${subtotal}`}
                className="glass-cta mt-6 inline-flex w-full items-center justify-center rounded-xl px-8 py-3.5 text-[17px] font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
                onClick={() => {
                  // Store cart items in sessionStorage for payment page to create order
                  const orderItems = cart.map((item) => ({
                    name: item.product?.name,
                    brand: item.product?.brand,
                    price: item.product?.price,
                    image: item.product?.image,
                    qty: item.quantity,
                    product: item.product?._id,
                  }));
                  sessionStorage.setItem(
                    "pendingOrder",
                    JSON.stringify({
                      orderItems,
                      totalPrice: subtotal,
                    }),
                  );
                }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
