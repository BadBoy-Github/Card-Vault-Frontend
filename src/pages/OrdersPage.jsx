import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const res = await fetch(`${API_URL}/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentOrders = orders.filter(
    (o) =>
      o.paymentStatus &&
      o.paymentStatus !== "pending" &&
      (["pending", "processing"].includes(o.status) ||
        o.paymentStatus === "awaiting_verification"),
  );
  const previousOrders = orders.filter(
    (o) =>
      o.paymentStatus &&
      o.paymentStatus !== "pending" &&
      (["delivered", "cancelled"].includes(o.status) ||
        o.paymentStatus === "verified" ||
        o.paymentStatus === "failed"),
  );

  const displayOrders =
    activeTab === "current" ? currentOrders : previousOrders;

  return (
    <div className="container-wide py-24 sm:py-32">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="apple-display text-[var(--color-text)]">
            Your Loot History
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/queries")}
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

        <div className="flex gap-4 border-b border-[var(--color-glass-border)] pb-2">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-6 py-2 text-[15px] font-medium transition-all ${
              activeTab === "current"
                ? "text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            In Transit
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`px-6 py-2 text-[15px] font-medium transition-all ${
              activeTab === "previous"
                ? "text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Past Treasures
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayOrders.length > 0 ? (
              displayOrders.map((order) => (
                <div
                  key={order._id}
                  className="glass-panel p-6 rounded-2xl flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start border-b border-[var(--color-glass-border)] pb-4">
                    <div>
                      <p className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider">
                        Order ID
                      </p>
                      <p className="font-mono text-[14px] text-[var(--color-text)]">
                        #{order._id.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider">
                        Order Status
                      </p>
                      <p
                        className={`text-[14px] font-medium capitalize ${
                          order.status === "delivered"
                            ? "text-green-400"
                            : order.status === "cancelled"
                              ? "text-red-400"
                              : "text-blue-400"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  {order.paymentStatus && order.paymentStatus !== "pending" && (
                    <div className="bg-[var(--color-glass)] rounded-xl p-3 flex justify-between items-center">
                      <div>
                        <p className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider">
                          Payment Status
                        </p>
                        <p
                          className={`text-[14px] font-medium capitalize ${
                            order.paymentStatus === "verified"
                              ? "text-green-400"
                              : order.paymentStatus === "awaiting_verification"
                                ? "text-yellow-400"
                                : order.paymentStatus === "failed"
                                  ? "text-red-400"
                                  : "text-gray-400"
                          }`}
                        >
                          {order.paymentStatus === "awaiting_verification"
                            ? "Awaiting Verification"
                            : order.paymentStatus}
                        </p>
                      </div>
                      {order.utrNumber && (
                        <div className="text-right">
                          <p className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider">
                            UTR
                          </p>
                          <p className="font-mono text-[12px] text-[var(--color-text)]">
                            {order.utrNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-[15px] font-medium text-[var(--color-text)]">
                            {item.brand} - {item.name}
                          </p>
                          <p className="text-[13px] text-[var(--color-text-muted)]">
                            ₹{item.price} x {item.qty || 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[var(--color-glass-border)] pt-4 flex justify-between items-center">
                    <p className="text-[14px] text-[var(--color-text-muted)]">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <div className="text-right">
                      <p className="text-[12px] text-[var(--color-text-muted)] mb-1">
                        Quantity:{" "}
                        {order.orderItems.reduce(
                          (acc, item) => acc + (item.qty || 1),
                          0,
                        )}
                      </p>
                      <p className="text-[18px] font-bold text-[var(--color-text)]">
                        Total: ₹{order.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 glass-panel rounded-2xl">
                <p className="text-[var(--color-text-muted)]">
                  Nothing here yet. Go treasure hunting in the homepage!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
