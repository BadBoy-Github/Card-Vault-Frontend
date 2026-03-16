import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [revealedCodes, setRevealedCodes] = useState({});
  const [revealedPins, setRevealedPins] = useState({});

  // Toggle code visibility
  const toggleCodeVisibility = (orderId) => {
    setRevealedCodes((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Toggle PIN visibility
  const togglePinVisibility = (orderId) => {
    setRevealedPins((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Check if order is successful (not failed payment)
  const isOrderSuccessful = (order) => {
    return order.paymentStatus !== "failed";
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch both regular and featured orders in parallel
      const [regularRes, featuredRes] = await Promise.all([
        fetch(`${API_URL}/orders/myorders?type=regular`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }),
        fetch(`${API_URL}/orders/myorders?type=featured`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }),
      ]);

      const regularData = regularRes.ok ? await regularRes.json() : [];
      const featuredData = featuredRes.ok ? await featuredRes.json() : [];

      // Combine both types of orders
      const allOrders = [...regularData, ...featuredData];

      // Sort by creation date (newest first)
      allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(allOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing",
  );
  const previousOrders = orders.filter(
    (o) => o.status === "delivered" || o.status === "cancelled",
  );

  const displayOrders =
    activeTab === "current" ? currentOrders : previousOrders;

  return (
    <div className="container-wide py-24 sm:py-32">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="apple-display text-[var(--color-text)]">
            Your Loot History
          </h1>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/#contact")}
              className="glass-btn px-4 py-2 rounded-full text-[14px] text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition"
            >
              Raise Query
            </button>
            <button
              onClick={() => navigate("/")}
              className="glass-btn px-4 py-2 rounded-full text-[14px]"
            >
              ← Go Back to Vault
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-4 border-b border-[var(--color-glass-border)] pb-2">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-6 py-2 text-[15px] font-medium transition-all ${
              activeTab === "current"
                ? "text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Active Orders ({currentOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`px-6 py-2 text-[15px] font-medium transition-all ${
              activeTab === "previous"
                ? "text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Past Orders ({previousOrders.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center">
            <p className="text-[var(--color-text-muted)] text-lg">
              No orders yet.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="glass-cta mt-4 inline-block rounded-full px-6 py-2 text-[15px] font-medium text-white"
            >
              Browse Gift Cards
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayOrders.map((order) => (
              <div key={order._id} className="glass-card rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  {order.orderItems && order.orderItems[0]?.image && (
                    <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={order.orderItems[0].image}
                        alt={order.orderItems[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--color-text)]">
                            {order.orderItems?.[0]?.name || "Order"}
                          </h3>
                          {order.type === "featured" && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-medium">
                              Redeem Code
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          Order ID: {order._id.slice(-8)}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--color-accent)]">
                          ₹{order.totalPrice}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "delivered" ||
                            (order.status === "cancelled" &&
                              isOrderSuccessful(order))
                              ? "bg-green-500/20 text-green-400"
                              : order.status === "cancelled" &&
                                  !isOrderSuccessful(order)
                                ? "bg-red-500/20 text-red-400"
                                : order.paymentStatus === "verified"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {order.status === "pending"
                            ? "Pending"
                            : order.status === "processing"
                              ? order.paymentStatus === "verified"
                                ? "Processing"
                                : "Awaiting Verification"
                              : order.status === "delivered"
                                ? "Delivered"
                                : isOrderSuccessful(order)
                                  ? "Success"
                                  : "Failed"}
                        </span>
                      </div>
                    </div>

                    {/* Gift Card Details - Show for successful orders (delivered or cancelled but not failed payment) */}
                    {(order.status === "delivered" ||
                      (order.status === "cancelled" &&
                        isOrderSuccessful(order))) &&
                      (order.giftCardCode ||
                        order.giftCardNumber ||
                        order.giftCardPin) && (
                        <div className="mt-4 p-3 bg-[var(--color-surface)] rounded-lg">
                          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                            {order.type === "featured"
                              ? "Redeem Code & PIN"
                              : "Gift Card Code & PIN"}
                          </p>
                          <div className="space-y-2">
                            {/* Code Row - check both giftCardCode (featured) and giftCardNumber (normal) */}
                            {(order.giftCardCode || order.giftCardNumber) && (
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1">
                                  <p className="text-[10px] text-[var(--color-text-muted)]">
                                    {order.type === "featured"
                                      ? "Redeem Code"
                                      : "Gift Card Code"}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <p className="font-mono text-[var(--color-text)] font-medium">
                                      {revealedCodes[order._id]
                                        ? order.giftCardCode ||
                                          order.giftCardNumber
                                        : "•".repeat(
                                            (
                                              order.giftCardCode ||
                                              order.giftCardNumber
                                            )?.length || 16,
                                          )}
                                    </p>
                                    <button
                                      onClick={() =>
                                        toggleCodeVisibility(order._id)
                                      }
                                      className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                                      title={
                                        revealedCodes[order._id]
                                          ? "Hide Code"
                                          : "Reveal Code"
                                      }
                                    >
                                      {revealedCodes[order._id] ? (
                                        <HiEyeOff className="h-4 w-4" />
                                      ) : (
                                        <HiEye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* PIN Row */}
                            {order.giftCardPin && (
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1">
                                  <p className="text-[10px] text-[var(--color-text-muted)]">
                                    PIN
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <p className="font-mono text-[var(--color-text)] font-medium">
                                      {revealedPins[order._id]
                                        ? order.giftCardPin
                                        : "••••••"}
                                    </p>
                                    <button
                                      onClick={() =>
                                        togglePinVisibility(order._id)
                                      }
                                      className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                                      title={
                                        revealedPins[order._id]
                                          ? "Hide PIN"
                                          : "Reveal PIN"
                                      }
                                    >
                                      {revealedPins[order._id] ? (
                                        <HiEyeOff className="h-4 w-4" />
                                      ) : (
                                        <HiEye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {order.giftCardExpiryDate && (
                              <p className="text-xs text-[var(--color-text-muted)] pt-1 border-t border-[var(--color-glass-border)]">
                                Valid until:{" "}
                                {new Date(
                                  order.giftCardExpiryDate,
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Payment Info */}
                    <div className="mt-4 pt-4 border-t border-[var(--color-glass-border)]">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-[var(--color-text-muted)]">
                            Payment:{" "}
                          </span>
                          <span className="text-[var(--color-text)]">
                            {order.paymentMethod} (₹{order.paymentAmount})
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-muted)]">
                            UTR:{" "}
                          </span>
                          <span className="text-[var(--color-text)] font-mono">
                            {order.utrNumber || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
