import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { warning } = useToast();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart when user changes
  useEffect(() => {
    if (user && user.token) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data) {
        setCart(data.products || []);
        // Check if any products were removed due to being out of stock
        if (data.removedOutOfStock && data.removedOutOfStock.length > 0) {
          data.removedOutOfStock.forEach((item) => {
            warning(
              `${item.name} is now out of stock and has been removed from your cart`,
            );
          });
        }
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const isInCart = (productId) => {
    return cart.some((item) => {
      const storedProductId = item.product._id || item.product;
      return String(storedProductId) === String(productId);
    });
  };

  const getCartItemQuantity = (productId) => {
    const item = cart.find((item) => {
      const storedProductId = item.product._id || item.product;
      return String(storedProductId) === String(productId);
    });
    return item ? item.quantity : 0;
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user?.token) {
      return { success: false, message: "Please login to add to cart" };
    }

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (res.ok && data) {
        setCart(data.products || []);
        return { success: true, message: "Added to cart" };
      } else {
        return {
          success: false,
          message: data.message || "Failed to add to cart",
        };
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      return { success: false, message: "Error adding to cart" };
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?.token) return;

    try {
      const res = await fetch(`${API_URL}/cart/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data) {
        setCart(data.products || []);
        return { success: true, message: "Removed from cart" };
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await fetch(`${API_URL}/cart/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data.products || []);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data.products || []);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const toggleCart = async (productId) => {
    if (isInCart(productId)) {
      await removeFromCart(productId);
    } else {
      await addToCart(productId);
    }
  };

  // Get total items count in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Get total price
  const cartTotal = cart.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartItemCount,
        cartTotal,
        isInCart,
        getCartItemQuantity,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
