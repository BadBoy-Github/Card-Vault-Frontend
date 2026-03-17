import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { HiHeart, HiShoppingCart, HiCheck } from "react-icons/hi";
import SEO, {
  generateProductSchema,
  generateBreadcrumbSchema,
} from "../components/SEO";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { wishlist, isInWishlist, toggleWishlist } = useWishlist();
  const { isInCart, addToCart, removeFromCart } = useCart();
  const { warning } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);

  // Get the latest wishlist state to re-evaluate isWishlisted
  // Use card._id which is the MongoDB ObjectId that matches what's stored in wishlist
  const isWishlisted = card?._id ? isInWishlist(card._id) : false;
  const inCart = card?._id ? isInCart(card._id) : false;

  // Generate SEO and schema when card is loaded
  const productSchema = card ? generateProductSchema(card) : null;
  const breadcrumbSchema = card
    ? generateBreadcrumbSchema([
        { name: "Home", url: "https://card-vaults.vercel.app/" },
        { name: "Gift Cards", url: "https://card-vaults.vercel.app/search" },
        {
          name: card.name,
          url: `https://card-vaults.vercel.app/product/${id}`,
        },
      ])
    : null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try fetching by the 9-char id first (e.g., yx6glrhQG)
        let res = await fetch(`${API_URL}/products/${id}`);
        let data = await res.json();

        // If not found by id, try by _id (MongoDB ObjectId)
        if (!res.ok || !data) {
          res = await fetch(`${API_URL}/products?id=${id}`);
          data = await res.json();
          // If it's an array, get the first match
          if (res.ok && Array.isArray(data) && data.length > 0) {
            data = data[0];
          }
        }

        if (res.ok && data) {
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

  if (loading) {
    return (
      <>
        <SEO title="Loading..." noIndex={true} />
        <div className="flex flex-1 flex-col items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
        </div>
      </>
    );
  }

  if (!card) {
    return (
      <>
        <SEO
          title="Product Not Found"
          description="The gift card you're looking for doesn't exist"
        />
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
      </>
    );
  }

  const total = card.price * quantity;

  // SEO - Product Page
  const productTitle = `${card.name} - Buy Gift Card on Card Vault`;
  const productDescription = `Buy ${card.name} gift card online on Card Vault. Instant delivery via email. ${card.description || "Get your digital gift card now!"}`;

  const handleBuy = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${card.id}` } });
      return;
    }

    // Instead of creating order, redirect directly to payment page with product info
    // Order will be created after UTR is submitted
    const orderItem = {
      name: card.name,
      brand: card.brand,
      price: card.price,
      image: card.image,
      qty: quantity,
      product: card._id,
    };

    // Store order item in sessionStorage to create order after payment
    sessionStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        orderItems: [orderItem],
        totalPrice: total,
      }),
    );

    // Redirect to payment page - order will be created there after UTR submission
    navigate(`/payment?amount=${total}`);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      warning("Login to add items to wishlist");
      return;
    }

    if (!card || !card._id) return;

    const currentWishlistState = isWishlisted;

    try {
      await toggleWishlist(card._id);
      setNotification(
        currentWishlistState
          ? "Removed from your wishlist – we'll miss it!"
          : "Added to your wishlist! ✨",
      );
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!user) {
      warning("Login to add items to cart");
      return;
    }

    if (!card || !card._id) return;

    try {
      if (inCart) {
        await removeFromCart(card._id);
        setNotification("Removed from cart");
      } else {
        const result = await addToCart(card._id, quantity);
        if (result.success) {
          setNotification("Added to cart! 🛒");
        } else {
          setNotification(result.message);
        }
      }
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <>
      <SEO
        title={productTitle}
        description={productDescription}
        keywords={`${card.name} gift card, buy ${card.name} gift card, digital gift card, ${card.category || "gift card"}, card vault`}
        image={card.image}
        type="product"
        schema="Product"
        schemaData={productSchema}
      />
      <div className="container-wide py-4 sm:py-6 h-full overflow-hidden">
        {/* Notification */}
        {notification && (
          <div className="fixed top-20 right-4 z-50 animate-scale-in overflow-hidden">
            <div
              className={`glass-panel rounded-xl px-4 py-2 border transition-all duration-300 ${isWishlisted ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}
            >
              <p
                className={`text-[14px] font-medium transition-all duration-300 ${isWishlisted ? "text-green-500" : "text-red-500"}`}
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

        <div className="glass-card mx-auto max-w-4xl overflow-hidden rounded-2xl p-6">
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
                onClick={(e) => handleToggleWishlist(e)}
                className={`absolute left-3 top-3 rounded-full p-2 transition-all duration-300 cursor-pointer ${
                  isWishlisted
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-black/40 backdrop-blur-sm text-white/70 hover:text-red-500 hover:bg-black/20"
                }`}
                title={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
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
                <p className="text-sm text-[var(--color-accent)]">
                  {card.category}
                </p>
                <p className="apple-body mt-3 text-[14px] leading-relaxed text-[var(--color-text-muted)]">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
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
                  <div className="flex flex-wrap gap-3 justify-end">
                    {card.validityEndDateTime && (
                      <div className="glass-pill flex items-center gap-2 rounded-full px-3 py-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                          Valid Until:
                        </span>
                        <span className="text-[12px] font-medium text-[var(--color-text)]">
                          {new Date(
                            card.validityEndDateTime,
                          ).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>
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
                <div className="flex gap-3">
                  {/* Add to Cart Button */}
                  {card.stock > 0 && (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex min-h-[48px] flex-1 items-center justify-center rounded-xl px-6 text-[16px] font-bold transition-all hover:scale-[1.01] active:scale-[0.99] ${
                        inCart
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-white/10 border border-[var(--color-glass-border)] text-[var(--color-text)] hover:bg-white/20"
                      }`}
                    >
                      <HiShoppingCart
                        className={`mr-2 h-5 w-5 ${inCart ? "text-white" : ""}`}
                      />
                      {inCart ? "In Cart" : "Add to Cart"}
                    </button>
                  )}
                  {/* Buy Now Button */}
                  <button
                    type="button"
                    onClick={handleBuy}
                    disabled={card.stock === 0}
                    className="glass-cta flex min-h-[48px] flex-1 items-center justify-center rounded-xl px-8 text-[16px] font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {card.stock > 0 ? "Buy Now" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Redemption Info Card */}
        <div className="mx-auto mt-6 max-w-4xl rounded-xl bg-yellow-500/30 border border-yellow-500/50 p-4">
          <p className="text-sm text-yellow-600">
            For specific and more detailed redemption steps, please visit the
            official {card.brand} website. Steps may vary depending on the
            brand.
          </p>
        </div>
      </div>
    </>
  );
}
