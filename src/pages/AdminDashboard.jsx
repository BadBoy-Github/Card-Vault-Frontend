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
  HiCurrencyRupee,
  HiPaperAirplane,
  HiInformationCircle,
  HiCheck,
  HiChartBar,
} from "react-icons/hi";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";
const DEFAULT_ADMIN_EMAIL =
  import.meta.env.VITE_DEFAULT_ADMIN_EMAIL || "elayabarathiedison@gmail.com";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("analytics");
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueByDay: [],
    ordersByDay: [],
    topProducts: [],
    recentOrders: [],
    monthlyRevenue: [],
  });
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [featuredOrders, setFeaturedOrders] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
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
    subheading: "",
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
  const [showViewOrderModal, setShowViewOrderModal] = useState(false);
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [giftCardFormData, setGiftCardFormData] = useState({
    cardNumber: "",
    pin: "",
    expiryDate: "",
  });
  const [giftCardLoading, setGiftCardLoading] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    user: "",
    productId: "",
    productName: "",
    productPrice: 0,
    quantity: 1,
    status: "pending",
  });

  // Featured Order Management states
  const [showFeaturedOrderModal, setShowFeaturedOrderModal] = useState(false);
  const [showFeaturedOrderEditModal, setShowFeaturedOrderEditModal] =
    useState(false);
  const [showFeaturedOrderDeleteModal, setShowFeaturedOrderDeleteModal] =
    useState(false);
  const [showFeaturedViewOrderModal, setShowFeaturedViewOrderModal] =
    useState(false);
  const [showFeaturedGiftCardModal, setShowFeaturedGiftCardModal] =
    useState(false);
  const [showFeaturedInfoModal, setShowFeaturedInfoModal] = useState(false);
  const [selectedFeaturedOrder, setSelectedFeaturedOrder] = useState(null);
  const [featuredGiftCardFormData, setFeaturedGiftCardFormData] = useState({
    giftCardCode: "",
    expiryDate: "",
  });
  const [featuredGiftCardLoading, setFeaturedGiftCardLoading] = useState(false);
  const [featuredOrderFormData, setFeaturedOrderFormData] = useState({
    user: "",
    featuredProductId: "",
    productName: "",
    productPrice: 0,
    quantity: 1,
    status: "pending",
  });

  // User Edit states
  const [showUserEditModal, setShowUserUserEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

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
      // Determine which endpoints to fetch based on activeTab
      let endpoints = [];
      if (activeTab === "analytics") {
        // Analytics needs all data including featured
        endpoints = [
          "products",
          "products?type=featured",
          "users",
          "orders",
          "orders?type=featured",
          "newsletter",
        ];
      } else if (activeTab === "featured-products") {
        endpoints = [
          "products?type=featured",
          "users",
          "orders?type=featured",
          "newsletter",
        ];
      } else if (activeTab === "featured-orders") {
        endpoints = [
          "products?type=featured",
          "users",
          "orders?type=featured",
          "newsletter",
        ];
      } else {
        endpoints = ["products", "users", "orders", "newsletter"];
      }

      const results = await Promise.all(
        endpoints.map((e) =>
          fetch(`${API_URL}/${e}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }).then((res) => res.json()),
        ),
      );

      // Handle results based on tab
      if (activeTab === "analytics") {
        setProducts(Array.isArray(results[0]) ? results[0] : []);
        setFeaturedProducts(Array.isArray(results[1]) ? results[1] : []);
        setUsers(Array.isArray(results[2]) ? results[2] : []);
        setOrders(Array.isArray(results[3]) ? results[3] : []);
        setFeaturedOrders(Array.isArray(results[4]) ? results[4] : []);
        setNewsletterSubscribers(Array.isArray(results[5]) ? results[5] : []);
      } else {
        setProducts(Array.isArray(results[0]) ? results[0] : []);
        setUsers(Array.isArray(results[1]) ? results[1] : []);
        const allOrders = Array.isArray(results[2]) ? results[2] : [];
        setOrders(allOrders);
        const allSubscribers = Array.isArray(results[3]) ? results[3] : [];
        setNewsletterSubscribers(allSubscribers);

        // Handle featured products and orders
        if (
          activeTab === "featured-products" ||
          activeTab === "featured-orders"
        ) {
          setFeaturedProducts(Array.isArray(results[0]) ? results[0] : []);
          setFeaturedOrders(Array.isArray(results[2]) ? results[2] : []);
        }
      }
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
      const isFeatured = activeTab === "featured-products";
      const method = showEditModal ? "PUT" : "POST";
      const url = showEditModal
        ? `${API_URL}/products/${selectedProduct.id}?type=${isFeatured ? "featured" : "regular"}`
        : `${API_URL}/products?type=${isFeatured ? "featured" : "regular"}`;

      // Add type to body for featured products
      const bodyData = isFeatured
        ? { ...formData, type: "featured" }
        : formData;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(bodyData),
      });
      if (res.ok) {
        setMessage(
          showEditModal
            ? "Product updated!"
            : isFeatured
              ? "Featured Product added!"
              : "New card added to the vault!",
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
      const isFeatured = activeTab === "featured-products";
      const res = await fetch(
        `${API_URL}/products/${selectedProduct.id}?type=${isFeatured ? "featured" : "regular"}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      if (res.ok) {
        if (isFeatured) {
          setFeaturedProducts(
            featuredProducts.filter((p) => p.id !== selectedProduct.id),
          );
        } else {
          setProducts(products.filter((p) => p.id !== selectedProduct.id));
        }
        setMessage(
          isFeatured
            ? "Featured Product removed from the vault."
            : "Product vanished from the vault.",
        );
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
        setFormData((prev) => ({ ...prev, id: data.id }));
      }
    } catch (err) {
      console.error("Failed to generate product ID:", err);
    }
  };

  const openUserEdit = (u) => {
    setSelectedUser(u);
    setUserFormData({ name: u.name, email: u.email, role: u.role });
    setShowUserUserEditModal(true);
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

  const openViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewOrderModal(true);
  };

  const openGiftCardModal = (order) => {
    setSelectedOrder(order);
    // Get expiry date from product's validityEndDateTime if available
    const product = order.orderItems?.[0];
    let expiryDate = "";
    if (product?.product) {
      // Try to get validity date from product
      const foundProduct = products.find(
        (p) => p._id === product.product || p.id === product.product,
      );
      if (foundProduct?.validityEndDateTime) {
        expiryDate = foundProduct.validityEndDateTime.split("T")[0];
      }
    }
    setGiftCardFormData({
      cardNumber: "",
      pin: "",
      expiryDate: expiryDate,
    });
    setShowGiftCardModal(true);
  };

  const handleSendGiftCard = async (e) => {
    e.preventDefault();
    setGiftCardLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/orders/${selectedOrder._id}/send-giftcard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(giftCardFormData),
        },
      );
      if (res.ok) {
        setMessage("Gift card sent successfully!");
        fetchData();
        closeModals();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to send gift card");
      }
    } catch (err) {
      console.error("Failed to send gift card:", err);
      alert("Failed to send gift card");
    } finally {
      setGiftCardLoading(false);
    }
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
    setShowViewOrderModal(false);
    setShowGiftCardModal(false);
    setShowInfoModal(false);
    setShowFeaturedOrderModal(false);
    setShowFeaturedOrderEditModal(false);
    setShowFeaturedOrderDeleteModal(false);
    setShowFeaturedViewOrderModal(false);
    setShowFeaturedGiftCardModal(false);
    setShowFeaturedInfoModal(false);
    setSelectedProduct(null);
    setSelectedUser(null);
    setSelectedOrder(null);
    setSelectedFeaturedOrder(null);
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

  const handleUpdatePaymentStatus = async (id, paymentStatus) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/verify-payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          verified: paymentStatus === "verified",
          paymentStatus: paymentStatus,
        }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map((o) => (o._id === id ? updatedOrder : o)));
        setMessage(`Payment status updated to ${paymentStatus}.`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyPayment = async (id, verified) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/verify-payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ verified }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map((o) => (o._id === id ? updatedOrder : o)));
        setMessage(
          verified
            ? "Payment verified successfully!"
            : "Payment marked as failed.",
        );
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Featured Product handlers
  const openFeaturedProductAdd = async () => {
    setFormData({
      id: "",
      brand: "",
      name: "",
      subheading: "",
      category: "",
      image: "",
      description: "",
      price: 0,
      validityEndDateTime: "",
      stock: 1,
      popular: false,
    });
    setShowAddModal(true);

    try {
      const res = await fetch(
        `${API_URL}/products?type=featured?generateId=true`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, id: data.id }));
      }
    } catch (err) {
      console.error("Failed to generate featured product ID:", err);
    }
  };

  const openFeaturedProductEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      id: product.id,
      brand: product.brand,
      name: product.name,
      subheading: product.subheading || "",
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

  const handleFeaturedProductUpdateStock = async (id, newStock) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}?type=featured`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ stock: Number(newStock) }),
      });
      if (res.ok) {
        setFeaturedProducts(
          featuredProducts.map((p) =>
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

  const confirmFeaturedProductDelete = async () => {
    try {
      const res = await fetch(
        `${API_URL}/products/${selectedProduct.id}?type=featured`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      if (res.ok) {
        setFeaturedProducts(
          featuredProducts.filter((p) => p.id !== selectedProduct.id),
        );
        setMessage("Featured Product removed from the vault.");
        closeModals();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Featured Order handlers
  const openFeaturedOrderEdit = (order) => {
    setSelectedFeaturedOrder(order);
    const item = order.orderItems[0];
    setFeaturedOrderFormData({
      user: order.user?._id || "",
      featuredProductId: item.featuredProduct,
      productName: item.name,
      productPrice: item.price,
      quantity: item.qty || 1,
      status: order.status,
    });
    setShowFeaturedOrderEditModal(true);
  };

  const handleFeaturedOrderFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const method = showFeaturedOrderEditModal ? "PUT" : "POST";
      const url = showFeaturedOrderEditModal
        ? `${API_URL}/orders/${selectedFeaturedOrder._id}?type=featured`
        : `${API_URL}/orders?type=featured`;

      const product = featuredProducts.find(
        (p) =>
          p._id === featuredOrderFormData.featuredProductId ||
          p.id === featuredOrderFormData.featuredProductId,
      );

      const body = {
        user: featuredOrderFormData.user,
        orderItems: [
          {
            name: product?.name || featuredOrderFormData.productName,
            brand: product?.brand || "",
            price: featuredOrderFormData.productPrice,
            image: product?.image || "",
            qty: featuredOrderFormData.quantity,
            featuredProduct: featuredOrderFormData.featuredProductId,
          },
        ],
        totalPrice:
          featuredOrderFormData.productPrice * featuredOrderFormData.quantity,
        status: featuredOrderFormData.status,
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
          showFeaturedOrderEditModal
            ? "Featured Order updated!"
            : "Featured Order created!",
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

  const confirmFeaturedOrderDelete = async () => {
    try {
      const res = await fetch(
        `${API_URL}/orders/${selectedFeaturedOrder._id}?type=featured`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      if (res.ok) {
        setFeaturedOrders(
          featuredOrders.filter((o) => o._id !== selectedFeaturedOrder._id),
        );
        setMessage("Featured Order deleted.");
        closeModals();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFeaturedUpdatePaymentStatus = async (id, paymentStatus) => {
    try {
      const res = await fetch(
        `${API_URL}/orders/${id}/verify-payment?type=featured`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            verified: paymentStatus === "verified",
            paymentStatus: paymentStatus,
          }),
        },
      );
      if (res.ok) {
        const updatedOrder = await res.json();
        setFeaturedOrders(
          featuredOrders.map((o) => (o._id === id ? updatedOrder : o)),
        );
        setMessage(`Payment status updated to ${paymentStatus}.`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFeaturedUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status?type=featured`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setFeaturedOrders(
          featuredOrders.map((o) => (o._id === id ? updatedOrder : o)),
        );
        setMessage(`Order status updated to ${status}.`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openFeaturedGiftCardModal = (order) => {
    setSelectedFeaturedOrder(order);
    const product = order.orderItems?.[0];
    let expiryDate = "";
    if (product?.featuredProduct) {
      const foundProduct = featuredProducts.find(
        (p) =>
          p._id === product.featuredProduct || p.id === product.featuredProduct,
      );
      if (foundProduct?.validityEndDateTime) {
        expiryDate = foundProduct.validityEndDateTime.split("T")[0];
      }
    }
    setFeaturedGiftCardFormData({
      giftCardCode: "",
      expiryDate: expiryDate,
    });
    setShowFeaturedGiftCardModal(true);
  };

  const handleFeaturedSendGiftCard = async (e) => {
    e.preventDefault();
    setFeaturedGiftCardLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/orders/${selectedFeaturedOrder._id}/send-giftcard?type=featured`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(featuredGiftCardFormData),
        },
      );
      if (res.ok) {
        setMessage("Gift card code sent successfully!");
        fetchData();
        closeModals();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to send gift card");
      }
    } catch (err) {
      console.error("Failed to send gift card:", err);
      alert("Failed to send gift card");
    } finally {
      setFeaturedGiftCardLoading(false);
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
            {[
              "analytics",
              "users",
              "products",
              "featured-products",
              "orders",
              "featured-orders",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-[15px] font-medium cursor-pointer transition-all ${
                  activeTab === tab
                    ? "text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                } capitalize`}
              >
                {tab === "analytics" ? (
                  <span className="flex items-center gap-2">
                    <HiChartBar className="h-4 w-4" />
                    Analytics
                  </span>
                ) : (
                  tab
                )}
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
          {activeTab === "featured-products" && (
            <button
              onClick={openFeaturedProductAdd}
              className="glass-cta flex items-center gap-2 rounded-full px-5 py-2 text-[14px] font-semibold text-white shadow-lg shadow-[var(--color-accent)]/20"
            >
              <HiPlus className="h-4 w-4" />
              Add Featured Product
            </button>
          )}
          {activeTab === "orders" && <></>}
          {activeTab === "featured-orders" && <></>}
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
              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="p-6">
                  <h2 className="apple-title mb-6 text-[var(--color-text)]">
                    Sales Analytics
                  </h2>

                  {/* Stats Cards */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="glass-card rounded-xl p-5">
                      <p className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold text-[var(--color-accent)]">
                        ₹
                        {orders
                          .reduce((sum, o) => sum + (o.totalPrice || 0), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-3 glass-card p-5 rounded-xl">
                      <div className="flex flex-col max-w-[20%]">
                        <p className="text-gray-300  text-sm">Total Orders</p>
                        <p className="text-3xl  font-bold text-[var(--color-text)]">
                          {orders.length + featuredOrders.length}
                        </p>
                      </div>
                      <div
                        className="glass-card rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-transform flex-1 text-center"
                        onClick={() => setActiveTab("orders")}
                      >
                        <p className="text-2xl font-bold text-[var(--color-text)]">
                          {orders.length}
                        </p>
                        <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                          Orders
                        </p>
                      </div>
                      <div
                        className="glass-card rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-transform flex-1 text-center"
                        onClick={() => setActiveTab("featured-orders")}
                      >
                        <p className="text-2xl font-bold text-[var(--color-text)]">
                          {featuredOrders.length}
                        </p>
                        <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                          Featured
                        </p>
                      </div>
                    </div>
                    <div
                      className="glass-card rounded-xl p-5 cursor-pointer hover:scale-[1.02] transition-transform"
                      onClick={() => setActiveTab("users")}
                    >
                      <p className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-[var(--color-text)]">
                        {users.length}
                      </p>
                    </div>
                    <div className="flex gap-3 p-5 glass-card rounded-xl">
                      <div className="flex flex-col max-w-[20%]">
                        <p className="text-gray-300  text-sm">Total Products</p>
                        <p className="text-3xl font-bold text-[var(--color-text)]">
                          {products.length + featuredProducts.length}
                        </p>
                      </div>
                      <div
                        className="glass-card rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-transform flex-1 text-center"
                        onClick={() => setActiveTab("products")}
                      >
                        <p className="text-2xl font-bold text-[var(--color-text)]">
                          {products.length}
                        </p>
                        <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                          Products
                        </p>
                      </div>
                      <div
                        className="glass-card rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-transform flex-1 text-center"
                        onClick={() => setActiveTab("featured-products")}
                      >
                        <p className="text-2xl font-bold text-[var(--color-text)]">
                          {featuredProducts.length}
                        </p>
                        <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                          Featured
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="glass-card rounded-xl p-5 mb-6">
                    <h3 className="text-[16px] font-semibold text-[var(--color-text)] mb-4">
                      Recent Orders
                    </h3>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between py-2 border-b border-[var(--color-glass-border)] last:border-0"
                        >
                          <div>
                            <p className="text-[14px] font-medium text-[var(--color-text)]">
                              {order.orderItems?.[0]?.name || "Order"}
                            </p>
                            <p className="text-[12px] text-[var(--color-text-muted)]">
                              {order.user?.name ||
                                order.user?.email ||
                                "Unknown"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] font-semibold text-[var(--color-accent)]">
                              ₹{order.totalPrice?.toLocaleString()}
                            </p>
                            <p className="text-[12px] capitalize text-[var(--color-text-muted)]">
                              {order.status || "pending"}
                            </p>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <p className="text-[14px] text-[var(--color-text-muted)] text-center py-4">
                          No orders yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Orders by Status */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="glass-card rounded-xl p-5">
                      <h3 className="text-[16px] font-semibold text-[var(--color-text)] mb-4">
                        Orders by Status
                      </h3>
                      <div className="space-y-3">
                        {["pending", "completed", "cancelled"].map((status) => {
                          const count = orders.filter(
                            (o) => o.status === status,
                          ).length;
                          const percentage =
                            orders.length > 0
                              ? Math.round((count / orders.length) * 100)
                              : 0;
                          return (
                            <div key={status}>
                              <div className="flex justify-between text-[13px] mb-1">
                                <span className="capitalize text-[var(--color-text-muted)]">
                                  {status}
                                </span>
                                <span className="text-[var(--color-text)]">
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${status === "completed" ? "bg-green-500" : status === "cancelled" ? "bg-red-500" : "bg-yellow-500"}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="glass-card rounded-xl p-5">
                      <h3 className="text-[16px] font-semibold text-[var(--color-text)] mb-4">
                        Top Products
                      </h3>
                      <div className="space-y-3">
                        {products.slice(0, 5).map((product, index) => {
                          const orderCount = orders.filter((o) =>
                            o.orderItems?.some(
                              (item) =>
                                item.product === product._id ||
                                item.product === product.id,
                            ),
                          ).length;
                          return (
                            <div
                              key={product._id || product.id}
                              className="flex items-center gap-3"
                            >
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[11px] font-bold text-[var(--color-accent)]">
                                {index + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-[var(--color-text)] truncate">
                                  {product.name}
                                </p>
                                <p className="text-[11px] text-[var(--color-text-muted)]">
                                  {orderCount} orders
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        {products.length === 0 && (
                          <p className="text-[14px] text-[var(--color-text-muted)] text-center py-4">
                            No products yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                      <th className="px-6 py-4">User ID</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Newsletter</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-glass-border)]">
                    {users.map((u) => {
                      const isSubscribed = newsletterSubscribers.some(
                        (sub) =>
                          sub.email?.toLowerCase() === u.email?.toLowerCase() &&
                          sub.isActive,
                      );
                      return (
                        <tr key={u._id} className="hover:bg-white/5 transition">
                          <td className="px-6 py-4 font-mono text-xs">
                            {u._id}
                          </td>
                          <td className="px-6 py-4">{u.name}</td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4">
                            {isSubscribed ? (
                              <span className="inline-flex items-center gap-1 text-green-400">
                                <HiCheck className="h-4 w-4" />
                                <span className="text-xs">Subscribed</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-400">
                                <HiX className="h-4 w-4" />
                                <span className="text-xs">Not Subscribed</span>
                              </span>
                            )}
                          </td>
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
                      );
                    })}
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
                      <th className="px-6 py-4">Payment</th>
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
                            value={o.paymentStatus || "pending"}
                            onChange={(e) =>
                              handleUpdatePaymentStatus(o._id, e.target.value)
                            }
                            className={`bg-transparent border border-[var(--color-glass-border)] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] text-xs font-medium ${
                              o.paymentStatus === "verified"
                                ? "text-green-400"
                                : o.paymentStatus === "awaiting_verification"
                                  ? "text-yellow-400"
                                  : o.paymentStatus === "failed"
                                    ? "text-red-400"
                                    : "text-gray-400"
                            }`}
                          >
                            <option
                              value="pending"
                              className="bg-[var(--color-background)]"
                            >
                              No Payment
                            </option>
                            <option
                              value="awaiting_verification"
                              className="bg-[var(--color-background)]"
                            >
                              Pending Verify
                            </option>
                            <option
                              value="verified"
                              className="bg-[var(--color-background)]"
                            >
                              Verified
                            </option>
                            <option
                              value="failed"
                              className="bg-[var(--color-background)]"
                            >
                              Failed
                            </option>
                          </select>
                        </td>
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
                          {/* Send Gift Card Button - Only for verified payment + processing status */}
                          {o.paymentStatus === "verified" &&
                          o.status === "processing" ? (
                            <button
                              onClick={() => openGiftCardModal(o)}
                              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                              title="Send Gift Card"
                            >
                              <HiPaperAirplane className="h-4 w-4" />
                            </button>
                          ) : o.status === "delivered" ? (
                            /* Info Button - Only show after gift card has been sent (delivered status) */
                            <button
                              onClick={() => {
                                setSelectedOrder(o);
                                setShowInfoModal(true);
                              }}
                              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer transition"
                              title="View Gift Card Details"
                            >
                              <HiInformationCircle className="h-4 w-4" />
                            </button>
                          ) : null}
                          <button
                            onClick={() => openViewOrder(o)}
                            className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
                            title="View UTR Details"
                          >
                            <HiCurrencyRupee className="h-4 w-4" />
                          </button>
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
                    {orders.length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-12 text-center text-[var(--color-text-muted)]"
                        >
                          No orders yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === "featured-products" && (
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-white/5 text-[var(--color-text-muted)]">
                    <tr>
                      <th className="px-6 py-4">Product ID</th>
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4">Subheading</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-glass-border)]">
                    {featuredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition">
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
                        <td className="px-6 py-4 text-[var(--color-text-muted)]">
                          {p.subheading || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <select
                              value={p.stock}
                              onChange={(e) =>
                                handleFeaturedProductUpdateStock(
                                  p.id,
                                  e.target.value,
                                )
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
                            onClick={() => openFeaturedProductEdit(p)}
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
                    {featuredProducts.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-20 text-center text-[var(--color-text-muted)]"
                        >
                          No featured products yet. Add one!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === "featured-orders" && (
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-white/5 text-[var(--color-text-muted)]">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-glass-border)]">
                    {featuredOrders.map((o) => (
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
                            value={o.paymentStatus || "pending"}
                            onChange={(e) =>
                              handleFeaturedUpdatePaymentStatus(
                                o._id,
                                e.target.value,
                              )
                            }
                            className={`bg-transparent border border-[var(--color-glass-border)] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] text-xs font-medium ${
                              o.paymentStatus === "verified"
                                ? "text-green-400"
                                : o.paymentStatus === "awaiting_verification"
                                  ? "text-yellow-400"
                                  : o.paymentStatus === "failed"
                                    ? "text-red-400"
                                    : "text-gray-400"
                            }`}
                          >
                            <option
                              value="pending"
                              className="bg-[var(--color-background)]"
                            >
                              No Payment
                            </option>
                            <option
                              value="awaiting_verification"
                              className="bg-[var(--color-background)]"
                            >
                              Pending Verify
                            </option>
                            <option
                              value="verified"
                              className="bg-[var(--color-background)]"
                            >
                              Verified
                            </option>
                            <option
                              value="failed"
                              className="bg-[var(--color-background)]"
                            >
                              Failed
                            </option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleFeaturedUpdateOrderStatus(
                                o._id,
                                e.target.value,
                              )
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
                          {/* Send Gift Card Button - Only for verified payment + processing status */}
                          {o.paymentStatus === "verified" &&
                          o.status === "processing" ? (
                            <button
                              onClick={() => openFeaturedGiftCardModal(o)}
                              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                              title="Send Gift Card"
                            >
                              <HiPaperAirplane className="h-4 w-4" />
                            </button>
                          ) : o.status === "delivered" ? (
                            /* Info Button - Only show after gift card has been sent (delivered status) */
                            <button
                              onClick={() => {
                                setSelectedFeaturedOrder(o);
                                setShowFeaturedInfoModal(true);
                              }}
                              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer transition"
                              title="View Gift Card Details"
                            >
                              <HiInformationCircle className="h-4 w-4" />
                            </button>
                          ) : null}
                          <button
                            onClick={() => {
                              setSelectedFeaturedOrder(o);
                              setShowFeaturedViewOrderModal(true);
                            }}
                            className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
                            title="View UTR Details"
                          >
                            <HiCurrencyRupee className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openFeaturedOrderEdit(o)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                            title="Edit Order"
                          >
                            <HiPencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFeaturedOrder(o);
                              setShowFeaturedOrderDeleteModal(true);
                            }}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                            title="Delete Order"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {featuredOrders.length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-20 text-center text-[var(--color-text-muted)]"
                        >
                          No featured orders yet.
                        </td>
                      </tr>
                    )}
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
                {activeTab === "featured-products" && (
                  <div>
                    <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                      Subheading
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subheading}
                      onChange={(e) =>
                        setFormData({ ...formData, subheading: e.target.value })
                      }
                      className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                      placeholder="e.g., Get $10 bonus on recharge"
                    />
                  </div>
                )}
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
                            e.target.style.display = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, image: "" })
                          }
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
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, email: e.target.value })
                  }
                  disabled={selectedUser?.email === DEFAULT_ADMIN_EMAIL}
                  className={`glass-input w-full mt-1 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all ${selectedUser?.email === DEFAULT_ADMIN_EMAIL ? "opacity-50 cursor-not-allowed" : ""}`}
                />
                {selectedUser?.email === DEFAULT_ADMIN_EMAIL && (
                  <p className="mt-2 text-[11px] text-amber-500 flex items-center gap-1.5">
                    <HiExclamation className="h-3 w-3" />
                    Master Admin email is locked for security.
                  </p>
                )}
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
              {selectedUser?.email === DEFAULT_ADMIN_EMAIL
                ? "Cannot Remove Master Admin"
                : "Revoke Access?"}
            </h3>
            <p className="mt-4 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
              {selectedUser?.email === DEFAULT_ADMIN_EMAIL ? (
                <span className="text-amber-500">
                  The master admin account cannot be deleted for security
                  reasons.
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
                {selectedUser?.email === DEFAULT_ADMIN_EMAIL
                  ? "Close"
                  : "Keep Member"}
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

      {/* View Order UTR Details Modal */}
      {showViewOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-lg rounded-[32px] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-4 bg-white/5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Payment & Order Details
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-full hover:bg-red-500/50 cursor-pointer transition"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {/* User & Payment Details - Top Section */}
              <div className="bg-[var(--color-glass)] rounded-2xl p-4 mb-4">
                <h3 className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                  User & Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      User Name
                    </p>
                    <p className="font-medium text-[var(--color-text)]">
                      {selectedOrder.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      User Email
                    </p>
                    <p className="font-medium text-[var(--color-text)] break-all">
                      {selectedOrder.user?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Account ID
                    </p>
                    <p className="font-mono text-[var(--color-text)] text-xs">
                      {selectedOrder.user?._id ||
                        selectedOrder.user?.id ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Order ID
                    </p>
                    <p className="font-mono text-[var(--color-text)] text-xs">
                      {selectedOrder._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      UTR Number
                    </p>
                    <p className="font-mono font-bold text-[var(--color-accent)]">
                      {selectedOrder.utrNumber || "Not Submitted"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Payment Mode
                    </p>
                    <p className="font-medium text-[var(--color-text)]">
                      {selectedOrder.paymentMethod || "UPI"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Payment Amount
                    </p>
                    <p className="font-bold text-green-400">
                      ₹
                      {selectedOrder.paymentAmount ||
                        selectedOrder.totalPrice ||
                        0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Payment Status
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        selectedOrder.paymentStatus === "verified"
                          ? "bg-green-500/20 text-green-400"
                          : selectedOrder.paymentStatus ===
                              "awaiting_verification"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : selectedOrder.paymentStatus === "failed"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {selectedOrder.paymentStatus === "verified"
                        ? "Verified"
                        : selectedOrder.paymentStatus ===
                            "awaiting_verification"
                          ? "Awaiting Verification"
                          : selectedOrder.paymentStatus === "failed"
                            ? "Failed"
                            : "No Payment"}
                    </span>
                  </div>
                  {selectedOrder.paymentSubmittedAt && (
                    <div className="col-span-2">
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        Payment Submitted At
                      </p>
                      <p className="font-medium text-[var(--color-text)]">
                        {new Date(
                          selectedOrder.paymentSubmittedAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details - Below Section */}
              <div className="bg-[var(--color-glass)] rounded-2xl p-4">
                <h3 className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                  Product Details
                </h3>
                <div className="flex gap-4">
                  {selectedOrder.orderItems &&
                    selectedOrder.orderItems.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-[var(--color-text)]">
                            {item.name}
                          </p>
                          <p className="text-[12px] text-[var(--color-text-muted)]">
                            {item.brand}
                          </p>
                          <p className="text-[12px] text-[var(--color-text-muted)]">
                            Qty: {item.qty || 1}
                          </p>
                          <p className="text-sm font-bold text-[var(--color-accent)]">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeModals}
                  className="flex-1 glass-btn rounded-xl py-3 font-medium text-[var(--color-text)]"
                >
                  Close
                </button>
                {selectedOrder.paymentStatus === "awaiting_verification" && (
                  <button
                    onClick={() => {
                      handleUpdatePaymentStatus(selectedOrder._id, "verified");
                      closeModals();
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 font-bold transition-colors"
                  >
                    Verify Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Gift Card Modal */}
      {showGiftCardModal && selectedOrder && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-md rounded-[32px] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-4 bg-white/5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Send Gift Card
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-full hover:bg-red-500/50 cursor-pointer transition"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSendGiftCard} className="p-6">
              {/* Order Info */}
              <div className="bg-[var(--color-glass)] rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3 mb-3">
                  {selectedOrder.orderItems?.[0]?.image && (
                    <img
                      src={selectedOrder.orderItems[0].image}
                      alt={selectedOrder.orderItems[0].name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-[var(--color-text)]">
                      {selectedOrder.orderItems?.[0]?.name || "Gift Card"}
                    </p>
                    <p className="text-[12px] text-[var(--color-text-muted)]">
                      Order ID: {selectedOrder._id?.substring(0, 8)}...
                    </p>
                  </div>
                </div>
                <div className="text-[12px] text-[var(--color-text-muted)]">
                  Sending to:{" "}
                  <span className="text-[var(--color-text)]">
                    {selectedOrder.user?.email}
                  </span>
                </div>
              </div>

              {/* Card Number Input */}
              <div className="mb-4">
                <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  minLength={16}
                  value={giftCardFormData.cardNumber}
                  onChange={(e) =>
                    setGiftCardFormData({
                      ...giftCardFormData,
                      cardNumber: e.target.value.replace(/\s/g, ""),
                    })
                  }
                  placeholder="Enter 16-digit card number"
                  className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all font-mono"
                />
              </div>

              {/* PIN Input */}
              <div className="mb-4">
                <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                  PIN
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={giftCardFormData.pin}
                  onChange={(e) =>
                    setGiftCardFormData({
                      ...giftCardFormData,
                      pin: e.target.value,
                    })
                  }
                  placeholder="Enter PIN"
                  className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all font-mono"
                />
              </div>

              {/* Expiry Date Input (Read-only from order) */}
              <div className="mb-6">
                <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                  Expiry Date
                </label>
                <input
                  type="date"
                  required
                  value={giftCardFormData.expiryDate}
                  onChange={(e) =>
                    setGiftCardFormData({
                      ...giftCardFormData,
                      expiryDate: e.target.value,
                    })
                  }
                  className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 glass-btn rounded-xl py-3 font-medium text-[var(--color-text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    giftCardLoading ||
                    !giftCardFormData.cardNumber ||
                    !giftCardFormData.pin ||
                    !giftCardFormData.expiryDate
                  }
                  className="flex-1 glass-cta rounded-xl py-3 font-bold text-white shadow-lg shadow-[var(--color-accent)]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {giftCardLoading ? "Sending..." : "Send Gift Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gift Card Info Modal - For delivered orders */}
      {showInfoModal && selectedOrder && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-xl rounded-[32px] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-4 bg-white/5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Gift Card Details
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-full hover:bg-red-500/50 cursor-pointer transition"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Order Info */}
              <div className="bg-[var(--color-glass)] rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3 mb-3">
                  {selectedOrder.orderItems?.[0]?.image && (
                    <img
                      src={selectedOrder.orderItems[0].image}
                      alt={selectedOrder.orderItems[0].name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-[var(--color-text)]">
                      {selectedOrder.orderItems?.[0]?.name || "Gift Card"}
                    </p>
                    <p className="text-[12px] text-[var(--color-text-muted)]">
                      Order ID: {selectedOrder._id?.substring(0, 8)}...
                    </p>
                  </div>
                </div>
                <div className="text-[12px] text-[var(--color-text-muted)]">
                  Customer:{" "}
                  <span className="text-[var(--color-text)]">
                    {selectedOrder.user?.name}
                  </span>
                </div>
                <div className="text-[12px] text-[var(--color-text-muted)]">
                  Email:{" "}
                  <span className="text-[var(--color-text)]">
                    {selectedOrder.user?.email}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Card Number
                  </label>
                  <div className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 font-mono text-[var(--color-text)]">
                    {selectedOrder.giftCardNumber
                      ? selectedOrder.giftCardNumber.substring(0, 4) +
                        " " +
                        selectedOrder.giftCardNumber.substring(4, 8) +
                        " " +
                        selectedOrder.giftCardNumber.substring(8, 12) +
                        " " +
                        selectedOrder.giftCardNumber.substring(12, 16)
                      : "N/A"}
                  </div>
                </div>

                {/* PIN */}
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    PIN
                  </label>
                  <div className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 font-mono text-[var(--color-text)]">
                    {selectedOrder.giftCardPin || "N/A"}
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Expiry Date
                  </label>
                  <div className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 text-[var(--color-text)]">
                    {selectedOrder.giftCardExpiryDate || "N/A"}
                  </div>
                </div>

                {/* Sent At */}
                {selectedOrder.giftCardSentAt && (
                  <div>
                    <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                      Gift Card Sent At
                    </label>
                    <div className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 text-[var(--color-text)]">
                      {new Date(selectedOrder.giftCardSentAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Order Edit Modal */}
      {showFeaturedOrderEditModal && selectedFeaturedOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-lg rounded-[24px] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-4 bg-white/5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Edit Order Details
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={handleFeaturedOrderFormSubmit}
              className="p-6 space-y-4"
            >
              <div className="max-h-[60vh] overflow-y-auto px-1 space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Customer
                  </label>
                  <select
                    required
                    value={featuredOrderFormData.user}
                    onChange={(e) =>
                      setFeaturedOrderFormData({
                        ...featuredOrderFormData,
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
                    value={featuredOrderFormData.featuredProductId}
                    onChange={(e) => {
                      const p = featuredProducts.find(
                        (prod) =>
                          prod._id === e.target.value ||
                          prod.id === e.target.value,
                      );
                      setFeaturedOrderFormData({
                        ...featuredOrderFormData,
                        featuredProductId: e.target.value,
                        productName: p?.name || "",
                        productPrice: p?.price || 0,
                      });
                    }}
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  >
                    <option value="">Select a Product</option>
                    {featuredProducts.map((p) => (
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
                      value={featuredOrderFormData.featuredProductId}
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
                        value={featuredOrderFormData.quantity}
                        onChange={(e) =>
                          setFeaturedOrderFormData({
                            ...featuredOrderFormData,
                            quantity: Number(e.target.value),
                          })
                        }
                        className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                      >
                        {(() => {
                          const p = featuredProducts.find(
                            (prod) =>
                              prod._id ===
                                featuredOrderFormData.featuredProductId ||
                              prod.id ===
                                featuredOrderFormData.featuredProductId,
                          );
                          const currentQty = selectedFeaturedOrder
                            ? selectedFeaturedOrder.orderItems.find((i) => {
                                const itemProductId =
                                  typeof i.featuredProduct === "string"
                                    ? i.featuredProduct
                                    : i.featuredProduct?._id ||
                                      i.featuredProduct?.toString();
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
                        const p = featuredProducts.find(
                          (prod) =>
                            prod._id ===
                              featuredOrderFormData.featuredProductId ||
                            prod.id === featuredOrderFormData.featuredProductId,
                        );
                        if (!p) return null;
                        const currentQty = selectedFeaturedOrder
                          ? selectedFeaturedOrder.orderItems.find((i) => {
                              const itemProductId =
                                typeof i.featuredProduct === "string"
                                  ? i.featuredProduct
                                  : i.featuredProduct?._id ||
                                    i.featuredProduct?.toString();
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
                      ₹
                      {featuredOrderFormData.productPrice *
                        featuredOrderFormData.quantity}
                    </div>
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
                  {formLoading ? "Updating..." : "Update Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Featured Order Delete Confirmation Modal */}
      {showFeaturedOrderDeleteModal && selectedFeaturedOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-sm rounded-[32px] p-8 text-center animate-scale-in border-red-500/30">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <HiTrash className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)]">
              Erase this Featured Order?
            </h3>
            <p className="mt-4 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
              Deleting this order will remove it permanently. This action cannot
              be undone.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={confirmFeaturedOrderDelete}
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

      {/* Featured Order Info Modal - Gift Card Details */}
      {showFeaturedInfoModal && selectedFeaturedOrder && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-xl rounded-[32px] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-4 bg-white/5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Gift Card Details
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-full hover:bg-red-500/50 cursor-pointer transition"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Order Info */}
              <div className="bg-[var(--color-glass)] rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3 mb-3">
                  {selectedFeaturedOrder.orderItems?.[0]?.image && (
                    <img
                      src={selectedFeaturedOrder.orderItems[0].image}
                      alt={selectedFeaturedOrder.orderItems[0].name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-[var(--color-text)]">
                      {selectedFeaturedOrder.orderItems?.[0]?.name ||
                        "Gift Card"}
                    </p>
                    <p className="text-[12px] text-[var(--color-text-muted)]">
                      Order ID: {selectedFeaturedOrder._id?.substring(0, 8)}...
                    </p>
                  </div>
                </div>
                <div className="text-[12px] text-[var(--color-text-muted)]">
                  Customer:{" "}
                  <span className="text-[var(--color-text)]">
                    {selectedFeaturedOrder.user?.name}
                  </span>
                </div>
                <div className="text-[12px] text-[var(--color-text-muted)]">
                  Email:{" "}
                  <span className="text-[var(--color-text)]">
                    {selectedFeaturedOrder.user?.email}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                {/* Card Number / Redeem Code */}
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    {selectedFeaturedOrder.type === "featured"
                      ? "Redeem Code"
                      : "Card Number"}
                  </label>
                  <div className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 font-mono text-[var(--color-text)]">
                    {selectedFeaturedOrder.giftCardCode
                      ? selectedFeaturedOrder.giftCardCode
                      : "N/A"}
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Expiry Date
                  </label>
                  <div className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 text-[var(--color-text)]">
                    {selectedFeaturedOrder.giftCardExpiryDate || "N/A"}
                  </div>
                </div>

                {/* Sent At */}
                {selectedFeaturedOrder.giftCardSentAt && (
                  <div>
                    <label className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                      Gift Card Sent At
                    </label>
                    <div className="glass-input w-full mt-1 rounded-xl px-4 py-2.5 text-[var(--color-text)]">
                      {new Date(
                        selectedFeaturedOrder.giftCardSentAt,
                      ).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Gift Card Modal - Send Code */}
      {showFeaturedGiftCardModal && selectedFeaturedOrder && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-lg rounded-[32px] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-4 bg-white/5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Send Redeem Code
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-full hover:bg-red-500/50 cursor-pointer transition"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleFeaturedSendGiftCard} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Redeem Code
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={featuredGiftCardFormData.giftCardCode}
                    onChange={(e) =>
                      setFeaturedGiftCardFormData({
                        ...featuredGiftCardFormData,
                        giftCardCode: e.target.value,
                      })
                    }
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                    placeholder="Enter the redeem code"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={featuredGiftCardFormData.expiryDate}
                    onChange={(e) =>
                      setFeaturedGiftCardFormData({
                        ...featuredGiftCardFormData,
                        expiryDate: e.target.value,
                      })
                    }
                    className="glass-input w-full mt-1 rounded-xl px-4 py-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={featuredGiftCardLoading}
                  className="w-full glass-cta mt-4 py-3 rounded-xl font-bold text-white disabled:opacity-50"
                >
                  {featuredGiftCardLoading ? "Sending..." : "Send Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Featured View Order UTR Details Modal */}
      {showFeaturedViewOrderModal && selectedFeaturedOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-lg rounded-[32px] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] px-6 py-4 bg-white/5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Payment & Order Details
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-full hover:bg-red-500/50 cursor-pointer transition"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {/* User & Payment Details - Top Section */}
              <div className="bg-[var(--color-glass)] rounded-2xl p-4 mb-4">
                <h3 className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                  User & Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      User Name
                    </p>
                    <p className="font-medium text-[var(--color-text)]">
                      {selectedFeaturedOrder.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      User Email
                    </p>
                    <p className="font-medium text-[var(--color-text)] break-all">
                      {selectedFeaturedOrder.user?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Account ID
                    </p>
                    <p className="font-mono text-[var(--color-text)] text-xs">
                      {selectedFeaturedOrder.user?._id ||
                        selectedFeaturedOrder.user?.id ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Order ID
                    </p>
                    <p className="font-mono text-[var(--color-text)] text-xs">
                      {selectedFeaturedOrder._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      UTR Number
                    </p>
                    <p className="font-mono font-bold text-[var(--color-accent)]">
                      {selectedFeaturedOrder.utrNumber || "Not Submitted"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Payment Mode
                    </p>
                    <p className="font-medium text-[var(--color-text)]">
                      {selectedFeaturedOrder.paymentMethod || "UPI"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Payment Amount
                    </p>
                    <p className="font-bold text-green-400">
                      ₹
                      {selectedFeaturedOrder.paymentAmount ||
                        selectedFeaturedOrder.totalPrice ||
                        0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Payment Status
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        selectedFeaturedOrder.paymentStatus === "verified"
                          ? "bg-green-500/20 text-green-400"
                          : selectedFeaturedOrder.paymentStatus ===
                              "awaiting_verification"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : selectedFeaturedOrder.paymentStatus === "failed"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {selectedFeaturedOrder.paymentStatus === "verified"
                        ? "Verified"
                        : selectedFeaturedOrder.paymentStatus ===
                            "awaiting_verification"
                          ? "Awaiting Verification"
                          : selectedFeaturedOrder.paymentStatus === "failed"
                            ? "Failed"
                            : "No Payment"}
                    </span>
                  </div>
                  {selectedFeaturedOrder.paymentSubmittedAt && (
                    <div className="col-span-2">
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        Payment Submitted At
                      </p>
                      <p className="font-medium text-[var(--color-text)]">
                        {new Date(
                          selectedFeaturedOrder.paymentSubmittedAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details - Below Section */}
              <div className="bg-[var(--color-glass)] rounded-2xl p-4">
                <h3 className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                  Product Details
                </h3>
                <div className="flex gap-4">
                  {selectedFeaturedOrder.orderItems &&
                    selectedFeaturedOrder.orderItems.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-[var(--color-text)]">
                            {item.name}
                          </p>
                          <p className="text-[12px] text-[var(--color-text-muted)]">
                            {item.brand}
                          </p>
                          <p className="text-[12px] text-[var(--color-text-muted)]">
                            Qty: {item.qty || 1}
                          </p>
                          <p className="text-sm font-bold text-[var(--color-accent)]">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeModals}
                  className="flex-1 glass-btn rounded-xl py-3 font-medium text-[var(--color-text)]"
                >
                  Close
                </button>
                {selectedFeaturedOrder.paymentStatus ===
                  "awaiting_verification" && (
                  <button
                    onClick={() => {
                      handleFeaturedUpdatePaymentStatus(
                        selectedFeaturedOrder._id,
                        "verified",
                      );
                      closeModals();
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 font-bold transition-colors"
                  >
                    Verify Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
