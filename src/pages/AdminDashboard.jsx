import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  HiShieldCheck,
  HiPencil,
  HiTrash,
  HiPlus,
  HiX,
  HiExclamation,
  HiUserCircle,
} from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DEFAULT_ADMIN_EMAIL = import.meta.env.VITE_DEFAULT_ADMIN_EMAIL || "elayabarathiedison@gmail.com";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    brand: "",
    name: "",
    category: "",
    image: "",
    description: "",
    price: 0,
    validityEndDateTime: "",
    stock: 1,
    popular: false,
  });

  // Order Management states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOrderEditModal, setShowOrderEditModal] = useState(false);
  const [showOrderDeleteModal, setShowOrderDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFormData, setOrderFormData] = useState({
    user: "",
    productId: "",
    productName: "",
    productPrice: 0,
    quantity: 1,
    status: "pending",
  });

  // User Edit states
  const [showUserEditModal, setShowUserUserEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userFormData, setUserFormData] = useState({ name: "", role: "" });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
    } else {
      fetchData();
    }
  }, [user, navigate, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ensure we have products and users for order forms
      const endpoints = ["products", "users", "orders"];
      const results = await Promise.all(
        endpoints.map((e) =>
          fetch(`${API_URL}/${e}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }).then((res) => res.json()),
        ),
      );

      setProducts(Array.isArray(results[0]) ? results[0] : []);
      setUsers(Array.isArray(results[1]) ? results[1] : []);
      setOrders(Array.isArray(results[2]) ? results[2] : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ stock: Number(newStock) }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) =>
            p.id === id ? { ...p, stock: Number(newStock) } : p,
          ),
        );
        setMessage("Stock updated successfully.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const method = showEditModal ? "PUT" : "POST";
      const url = showEditModal
        ? `${API_URL}/products/${selectedProduct.id}`
        : `${API_URL}/products`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage(
          showEditModal ? "Product updated!" : "New card added to the vault!",
        );
        fetchData();
        closeModals();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        alert(error.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(userFormData),
      });
      if (res.ok) {
        setMessage("User updated successfully!");
        fetchData();
        closeModals();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update user");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/products/${selectedProduct.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        setMessage("Product vanished from the vault.");
        closeModals();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmUserDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${selectedUser._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== selectedUser._id));
        setMessage("Member removed from the vault.");
        closeModals();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to remove member");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      id: product.id,
      brand: product.brand,
      name: product.name,
      category: product.category,
      image: product.image,
      description: product.description,
      price: product.price,
      validityEndDateTime: product.validityEndDateTime?.split("T")[0] || "",
      stock: product.stock,
      popular: product.popular,
    });
    setShowEditModal(true);
  };

  const openAdd = async () => {
    setFormData({
      id: "",
      brand: "",
      name: "",
      category: "",
      image: "",
      description: "",
      price: 0,
      validityEndDateTime: "",
      stock: 1,
      popular: false,
    });
    setShowAddModal(true);
    
    // Fetch auto-generated product ID from backend
    try {
      const res = await fetch(`${API_URL}/products?generateId=true`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, id: data.id }));
      }
    } catch (err) {
      console.error("Failed to generate product ID:", err);
    }
  };

  const openUserEdit = (u) => {
    setSelectedUser(u);
    setUserFormData({ name: u.name, role: u.role });
    setShowUserUserEditModal(true);
  };

  const openOrderAdd = () => {
    setOrderFormData({
      user: "",
      productId: "",
      productName: "",
      productPrice: 0,
      quantity: 1,
      status: "pending",
    });
    setShowOrderModal(true);
  };

  const openOrderEdit = (order) => {
    setSelectedOrder(order);
    const item = order.orderItems[0];
    setOrderFormData({
      user: order.user?._id || "",
      productId: item.product,
      productName: item.name,
      productPrice: item.price,
      quantity: item.qty || 1,
      status: order.status,
    });
    setShowOrderEditModal(true);
  };

  const handleOrderFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const method = showOrderEditModal ? "PUT" : "POST";
      const url = showOrderEditModal
        ? `${API_URL}/orders/${selectedOrder._id}`
        : `${API_URL}/orders`;

      const product = products.find(
        (p) =>
          p._id === orderFormData.productId || p.id === orderFormData.productId,
      );

      const body = {
        user: orderFormData.user,
        orderItems: [
          {
            name: orderFormData.productName,
            brand: product?.brand || "CardVault",
            price: orderFormData.productPrice,
            image: product?.image || "",
            qty: orderFormData.quantity,
            product: product?._id || orderFormData.productId,
          },
        ],
        totalPrice: orderFormData.productPrice * orderFormData.quantity,
        status: orderFormData.status,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage(
          showOrderEditModal ? "Order updated!" : "Order placed successfully!",
        );
        fetchData();
        closeModals();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        alert(error.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmOrderDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/${selectedOrder._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setOrders(orders.filter((o) => o._id !== selectedOrder._id));
        setMessage("Order removed from history.");
        closeModals();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to remove order");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowUserUserEditModal(false);
    setShowUserDeleteModal(false);
    setShowOrderModal(false);
    setShowOrderEditModal(false);
    setShowOrderDeleteModal(false);
    setSelectedProduct(null);
    setSelectedUser(null);
    setSelectedOrder(null);
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
        setMessage(`Order is now ${status}.`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-wide py-24 sm:py-32">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HiUserCircle className="text-[var(--color-accent)] h-8 w-8" />
            <h1 className="apple-display text-[var(--color-text)]">
              Vault Command Center
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="glass-btn px-4 py-2 rounded-full text-[14px]"
          >
            ← Back to Giftcards
          </button>
        </div>

        {/* Tabs and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-2">
          <div className="flex gap-4 overflow-x-auto">
            {["products", "users", "orders"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-[15px] font-medium cursor-pointer transition-all ${
                  activeTab === tab
                    ? "text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                } capitalize`}
              >
                {tab}
              </button>
            ))}
          </div>
          {activeTab === "products" && (
            <button
              onClick={openAdd}
              className="glass-cta flex items-center gap-2 rounded-full px-5 py-2 text-[14px] font-semibold text-white shadow-lg shadow-[var(--color-accent)]/20"
            >
              <HiPlus className="h-4 w-4" />
              Add Card to Vault
            </button>
          )}
          {activeTab === "orders" && (
            <button
              onClick={openOrderAdd}
              className="glass-cta flex items-center gap-2 rounded-full px-5 py-2 text-[14px] font-semibold text-white shadow-lg shadow-[var(--color-accent)]/20"
            >
              <HiPlus className="h-4 w-4" />
              Add New Order
            </button>
          )}
        </div>

        {message && (
          <div className="bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-4 py-3 rounded-xl border border-[var(--color-accent)]/20 text-[14px] animate-fade-in">
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
          </div>
        ) : (
          <div className="glass-panel overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              {activeTab === "products" && (
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-white/5 text-[var(--color-text-muted)]">
                    <tr>
                      <th className="px-6 py-4">Product ID</th>
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-glass-border)]">
                    {products.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-white/5 transition group"
                      >
                        <td className="px-6 py-4 font-mono text-[var(--color-text-muted)]">
                          {p.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              className="h-8 w-8 rounded-md object-cover"
                              alt=""
                            />
                            <span className="font-semibold">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <select
                              value={p.stock}
                              onChange={(e) =>
                                handleUpdateStock(p.id, e.target.value)
                              }
                              className="bg-white/5 cursor-pointer border border-[var(--color-glass-border)] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                            >
                              {[0, 1, 2, 3, 4, 5].map((n) => (
                                <option
                                  key={n}
                                  value={n}
                                  className="bg-[var(--color-background)]"
                                >
                                  {n === 0 ? "Out of Stock (0)" : n}
                                </option>
                              ))}
                            </select>
                            {p.stock <= 2 && p.stock > 0 && (
                              <span className="text-[11px] font-bold text-red-500 animate-pulse">
                                LOW
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 cursor-pointer hover:bg-blue-500/20 transition"
                            title="Edit"
                          >
                            <HiPencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(p);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 cursor-pointer hover:bg-red-500/20 transition"
                            title="Delete"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-20 text-center text-[var(--color-text-muted)]"
                        >
                          The vault is lonely. Add some cards!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === "users" && (
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-white/5 text-[var(--color-text-muted)]">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-glass-border)]">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[12px] ${u.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-green-500/20 text-green-400"}`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button
                            onClick={() => openUserEdit(u)}
                            className="p-2 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] cursor-pointer hover:bg-[var(--color-accent)]/20 transition"
                            title="Edit User"
                          >
                            <HiPencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setShowUserDeleteModal(true);
                            }}
                            disabled={u.email === "admin@cardvault.com"}
                            className={`p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer transition ${u.email === "admin@cardvault.com" ? "opacity-30 cursor-not-allowed" : ""}`}
                            title={
                              u.email === "admin@cardvault.com"
                                ? "Master Admin Locked"
                                : "Delete User"
                            }
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "orders" && (
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-white/5 text-[var(--color-text-muted)]">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-glass-border)]">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4 font-mono">
                          {o._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-[var(--color-text-muted)] font-medium underline">
                          {o.user?.name || "Guest"}
                        </td>
                        <td className="px-6 py-4">
                          {o.orderItems.reduce(
                            (acc, item) => acc + (item.qty || 1),
                            0,
                          )}{" "}
                          items
                        </td>
                        <td className="px-6 py-4 font-bold">₹{o.totalPrice}</td>
                        <td className="px-6 py-4">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(o._id, e.target.value)
                            }
                            className="bg-transparent border border-[var(--color-glass-border)] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                          >
                            <option
                              value="pending"
                              className="bg-[var(--color-background)]"
                            >
                              Pending
                            </option>
                            <option
                              value="processing"
                              className="bg-[var(--color-background)]"
                            >
                              Processing
                            </option>
                            <option
                              value="delivered"
                              className="bg-[var(--color-background)]"
                            >
                              Delivered
                            </option>
                            <option
                              value="cancelled"
                              className="bg-[var(--color-background)]"
                            >
                              Cancelled
                            </option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button
                            onClick={() => openOrderEdit(o)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                            title="Edit Order"
                          >
                            <HiPencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setShowOrderDeleteModal(true);
                            }}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                            title="Delete Order"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-strong w-full max-w-2xl rounded-[24px] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-4 bg-white/5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                {showEditModal ? "Update Treasure" : "Add New Treasure"}
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-full hover:bg-red-500/50 cursor-pointer transition"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[60vh] overflow-y-auto px-1">
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Product ID (Auto-generated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    disabled
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2 bg-white/5 cursor-not-allowed opacity-70"
                    placeholder="Generating..."
                  />
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                    This ID is auto-generated and cannot be changed
                  </p>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Full Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Product Image URL
                  </label>
                  <div className="mt-2 space-y-3">
                    {/* Image Preview */}
                    {formData.image && (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-[var(--color-glass)]">
                        <img
                          src={formData.image}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: "" })}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-red-500/80 cursor-pointer transition-colors"
                        >
                          <HiX className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <input
                      type="url"
                      required
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="glass-input w-full rounded-xl px-4 py-2"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Description
                  </label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Selling Price (Number)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Validity Date (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    value={formData.validityEndDateTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validityEndDateTime: e.target.value,
                      })
                    }
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  />
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={formData.popular}
                    onChange={(e) =>
                      setFormData({ ...formData, popular: e.target.checked })
                    }
                    className="h-5 w-5 accent-[var(--color-accent)]"
                  />
                  <label htmlFor="popular" className="text-[14px]">
                    Mark as Popular?
                  </label>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 glass-btn rounded-xl py-3 font-medium text-[var(--color-text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-3 glass-cta flex-1 rounded-xl py-3 font-bold text-white shadow-lg shadow-[var(--color-accent)]/20"
                >
                  {formLoading
                    ? "Working Magic..."
                    : showEditModal
                      ? "Update Product"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {showUserEditModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-strong w-full max-w-md rounded-[24px] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-4 bg-white/5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Edit Vault Member
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUserFormSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                  Member Name
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, name: e.target.value })
                  }
                  className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                  Assigned Role
                </label>
                <select
                  value={userFormData.role}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, role: e.target.value })
                  }
                  disabled={selectedUser?.email === DEFAULT_ADMIN_EMAIL}
                  className={`glass-input w-full mt-1 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all ${selectedUser?.email === DEFAULT_ADMIN_EMAIL ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="user" className="bg-[var(--color-background)]">
                    User
                  </option>
                  <option
                    value="admin"
                    className="bg-[var(--color-background)]"
                  >
                    Admin
                  </option>
                </select>
                {selectedUser?.email === DEFAULT_ADMIN_EMAIL && (
                  <p className="mt-2 text-[11px] text-amber-500 flex items-center gap-1.5">
                    <HiExclamation className="h-3 w-3" />
                    Master Admin role is locked for security.
                  </p>
                )}
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 glass-btn rounded-xl py-3 font-medium text-[var(--color-text)] transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 glass-cta rounded-xl py-3 font-bold text-white shadow-lg shadow-[var(--color-accent)]/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {formLoading ? "Applying Changes..." : "Update Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Delete Confirmation Modal */}
      {showUserDeleteModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-sm rounded-[32px] p-8 text-center animate-scale-in border-red-500/30">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <HiExclamation className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)]">
              {selectedUser?.email === DEFAULT_ADMIN_EMAIL ? "Cannot Remove Master Admin" : "Revoke Access?"}
            </h3>
            <p className="mt-4 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
              {selectedUser?.email === DEFAULT_ADMIN_EMAIL ? (
                <span className="text-amber-500">
                  The master admin account cannot be deleted for security reasons.
                </span>
              ) : (
                <>
                  You are about to remove{" "}
                  <span className="font-bold text-[var(--color-text)]">
                    "{selectedUser?.name}"
                  </span>{" "}
                  from the vault. They will lose all access immediately.
                </>
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {selectedUser?.email !== DEFAULT_ADMIN_EMAIL && (
                <button
                  onClick={confirmUserDelete}
                  className="w-full rounded-2xl bg-red-500 py-3.5 text-[16px] font-bold text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Confirm Removal
                </button>
              )}
              <button
                onClick={closeModals}
                className="w-full rounded-2xl bg-white/5 py-3.5 text-[16px] font-medium text-[var(--color-text)] hover:bg-white/10 transition-colors"
              >
                {selectedUser?.email === DEFAULT_ADMIN_EMAIL ? "Close" : "Keep Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-sm rounded-[32px] p-8 text-center animate-scale-in border-red-500/30">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <HiExclamation className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)]">
              Burn the Bridge?
            </h3>
            <p className="mt-4 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
              You are about to delete{" "}
              <span className="font-bold text-[var(--color-text)]">
                "{selectedProduct?.name}"
              </span>
              . This action is final and can&apos;t be undone. Are you sure you
              want to proceed?
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full rounded-2xl bg-red-500 py-3.5 text-[16px] font-bold text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Yes, Remove Forever
              </button>
              <button
                onClick={closeModals}
                className="w-full rounded-2xl bg-white/5 py-3.5 text-[16px] font-medium text-[var(--color-text)] hover:bg-white/10 transition-colors"
              >
                No, Keep It
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Order Add/Edit Modal */}
      {(showOrderModal || showOrderEditModal) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-strong w-full max-w-lg rounded-[24px] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-4 bg-white/5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                {showOrderEditModal ? "Edit Order Details" : "Forge New Order"}
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleOrderFormSubmit} className="p-6 space-y-4">
              <div className="max-h-[60vh] overflow-y-auto px-1 space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Customer
                  </label>
                  <select
                    required
                    value={orderFormData.user}
                    onChange={(e) =>
                      setOrderFormData({
                        ...orderFormData,
                        user: e.target.value,
                      })
                    }
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  >
                    <option value="">Select a Customer</option>
                    {users.map((u) => (
                      <option
                        key={u._id}
                        value={u._id}
                        className="bg-[var(--color-background)]"
                      >
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Select Product
                  </label>
                  <select
                    required
                    value={orderFormData.productId}
                    onChange={(e) => {
                      const p = products.find(
                        (prod) =>
                          prod._id === e.target.value ||
                          prod.id === e.target.value,
                      );
                      setOrderFormData({
                        ...orderFormData,
                        productId: e.target.value,
                        productName: p?.name || "",
                        productPrice: p?.price || 0,
                      });
                    }}
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  >
                    <option value="">Select a Product</option>
                    {products.map((p) => (
                      <option
                        key={p._id}
                        value={p._id}
                        className="bg-[var(--color-background)]"
                      >
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                      Product ID
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={orderFormData.productId}
                      className="glass-input w-full mt-1 rounded-xl px-4 py-2 opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                      Quantity
                    </label>
                    <div className="flex flex-col gap-1">
                      <select
                        required
                        value={orderFormData.quantity}
                        onChange={(e) =>
                          setOrderFormData({
                            ...orderFormData,
                            quantity: Number(e.target.value),
                          })
                        }
                        className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                      >
                        {(() => {
                          const p = products.find(
                            (prod) =>
                              prod._id === orderFormData.productId ||
                              prod.id === orderFormData.productId,
                          );
                          const currentQty = selectedOrder
                            ? selectedOrder.orderItems.find((i) => {
                                const itemProductId =
                                  typeof i.product === "string"
                                    ? i.product
                                    : i.product?._id || i.product?.toString();
                                const prodId = p?._id || p?.id;
                                return itemProductId === prodId;
                              })?.qty || 0
                            : 0;
                          const max = p ? Math.min(5, p.stock + currentQty) : 1;
                          return Array.from(
                            { length: max },
                            (_, i) => i + 1,
                          ).map((n) => (
                            <option
                              key={n}
                              value={n}
                              className="bg-[var(--color-background)]"
                            >
                              {n}
                            </option>
                          ));
                        })()}
                      </select>
                      {(() => {
                        const p = products.find(
                          (prod) =>
                            prod._id === orderFormData.productId ||
                            prod.id === orderFormData.productId,
                        );
                        if (!p) return null;
                        const currentQty = selectedOrder
                          ? selectedOrder.orderItems.find((i) => {
                              const itemProductId =
                                typeof i.product === "string"
                                  ? i.product
                                  : i.product?._id || i.product?.toString();
                              const prodId = p?._id || p?.id;
                              return itemProductId === prodId;
                            })?.qty || 0
                          : 0;
                        const available = p.stock + currentQty;
                        if (available === 0)
                          return (
                            <span className="text-[11px] text-red-500 font-bold">
                              Out of Stock
                            </span>
                          );
                        if (available <= 2)
                          return (
                            <span className="text-[11px] text-orange-500 font-bold">
                              Low Stock ({available})
                            </span>
                          );
                        return (
                          <span className="text-[11px] text-green-500 font-medium">
                            Available: {available}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                      Total Order Price
                    </label>
                    <div className="glass-input w-full mt-1 rounded-xl px-4 py-2 font-bold text-[var(--color-accent)]">
                      ₹{orderFormData.productPrice * orderFormData.quantity}
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                      Order Status
                    </label>
                    <select
                      value={orderFormData.status}
                      onChange={(e) =>
                        setOrderFormData({
                          ...orderFormData,
                          status: e.target.value,
                        })
                      }
                      className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                    >
                      <option
                        value="pending"
                        className="bg-[var(--color-background)]"
                      >
                        Pending
                      </option>
                      <option
                        value="processing"
                        className="bg-[var(--color-background)]"
                      >
                        Processing
                      </option>
                      <option
                        value="delivered"
                        className="bg-[var(--color-background)]"
                      >
                        Delivered
                      </option>
                      <option
                        value="cancelled"
                        className="bg-[var(--color-background)]"
                      >
                        Cancelled
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 glass-btn rounded-xl py-3 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 glass-cta rounded-xl py-3 font-bold text-white shadow-lg shadow-[var(--color-accent)]/20"
                >
                  {formLoading
                    ? "Working..."
                    : showOrderEditModal
                      ? "Update Order"
                      : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Delete Confirmation Modal */}
      {showOrderDeleteModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-sm rounded-[32px] p-8 text-center animate-scale-in border-red-500/30">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <HiTrash className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)]">
              Erase this Order?
            </h3>
            <p className="mt-4 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
              Deleting this order will return its products to the vault. This
              action cannot be undone.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={confirmOrderDelete}
                className="w-full rounded-2xl bg-red-500 py-3.5 text-[16px] font-bold text-white hover:bg-red-600 transition-colors"
              >
                Yes, Delete it
              </button>
              <button
                onClick={closeModals}
                className="w-full rounded-2xl bg-white/5 py-3.5 text-[16px] font-medium text-[var(--color-text)]"
              >
                No, Keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
