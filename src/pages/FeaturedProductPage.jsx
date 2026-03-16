import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { HiHeart } from "react-icons/hi";
import SEO from "../components/SEO";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export default function FeaturedProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { warning } = useToast();
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = card?._id ? isInWishlist(card._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let res = await fetch(`${API_URL}/products?type=featured&id=${id}`);
        let data = await res.json();

        if (!res.ok || !data) {
          res = await fetch(`${API_URL}/products?type=featured&id=${id}`);
          data = await res.json();
          if (res.ok && Array.isArray(data) && data.length > 0) {
            data = data[0];
          }
        }

        if (res.ok && data) {
          setCard(data);
        }
      } catch (err) {
        console.error("Error fetching featured product:", err);
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

  const productTitle = `${card.name} - Buy Gift Card on Card Vault`;
  const productDescription = `Buy ${card.name} gift card online on Card Vault. ${card.subheading || "Instant delivery via email."} ${card.description || "Get your digital gift card now!"}`;

  const handleBuy = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/featured-product/${card.id}` } });
      return;
    }

    const orderItem = {
      name: card.name,
      brand: card.brand,
      price: card.price,
      image: card.image,
      qty: quantity,
      featuredProduct: card._id,
    };

    sessionStorage.setItem(
      "pendingFeaturedOrder",
      JSON.stringify({
        orderItems: [orderItem],
        totalPrice: total,
        type: "featured",
      }),
    );

    navigate(`/payment?amount=${total}&type=featured`);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      warning("Login to add items to wishlist");
      return;
    }

    toggleWishlist(card._id, {
      id: card.id,
      name: card.name,
      brand: card.brand,
      price: card.price,
      image: card.image,
      category: card.category,
    });
  };

  return (
    <>
      <SEO title={productTitle} description={productDescription} />
      <div className="container-wide py-8 sm:py-12 mt-14 sm:mt-20">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative">
            <div className="glass-panel overflow-hidden rounded-2xl sm:rounded-3xl">
              <img
                src={card.image}
                alt={card.name}
                className="w-full aspect-video object-cover"
              />
              {card.popular && (
                <div className="absolute top-4 left-4 bg-[var(--color-accent)] text-white text-[12px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  Popular
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-[12px] font-semibold text-[var(--color-accent)] uppercase tracking-wider">
                {card.brand}
              </span>
            </div>
            <h1 className="apple-display text-[var(--color-text)] text-2xl sm:text-3xl mb-2">
              {card.name}
            </h1>
            {card.subheading && (
              <p className="text-[17px] text-[var(--color-text-muted)] mb-4">
                {card.subheading}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-[var(--color-accent)]">
                ₹{card.price}
              </span>
              {card.denomination && (
                <span className="text-[16px] text-[var(--color-text-muted)]">
                  {card.denomination}
                </span>
              )}
            </div>

            {/* Description */}
            {card.description && (
              <div className="mb-6">
                <p className="text-[15px] text-[var(--color-text-muted)] leading-relaxed">
                  {card.description}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-[13px] font-medium text-[var(--color-text-muted)] mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="glass-btn w-10 h-10 rounded-xl flex items-center justify-center text-[18px] font-bold"
                >
                  -
                </button>
                <span className="text-[18px] font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="glass-btn w-10 h-10 rounded-xl flex items-center justify-center text-[18px] font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-auto">
              <button
                onClick={handleBuy}
                disabled={!card.inStock || card.stock === 0}
                className="flex-1 glass-cta py-4 rounded-2xl text-[16px] font-bold text-white shadow-lg shadow-[var(--color-accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {card.inStock && card.stock > 0 ? "Buy Now" : "Out of Stock"}
              </button>
              <button
                onClick={handleToggleWishlist}
                className="glass-btn p-4 rounded-2xl"
                title={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <HiHeart
                  className={`h-6 w-6 ${
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-[var(--color-text)]"
                  }`}
                />
              </button>
            </div>

            {/* Stock Info */}
            {card.stock <= 5 && card.stock > 0 && (
              <p className="mt-4 text-[13px] text-red-400">
                Only {card.stock} left in stock!
              </p>
            )}
            {!card.inStock && (
              <p className="mt-4 text-[13px] text-red-400">
                This product is currently out of stock.
              </p>
            )}

            {/* Validity */}
            {card.validityEndDateTime && (
              <div className="mt-6 pt-6 border-t border-[var(--color-glass-border)]">
                <p className="text-[13px] text-[var(--color-text-muted)]">
                  Valid until:{" "}
                  <span className="font-medium text-[var(--color-text)]">
                    {new Date(card.validityEndDateTime).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
