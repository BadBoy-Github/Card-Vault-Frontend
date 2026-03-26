import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./components/Layout";
import ToastContainer from "./components/ToastContainer";
import CustomCursor from "./components/CustomCursor";
import Hero from "./components/Hero";
import Carousel from "./components/Carousel";
import FeaturedSection from "./components/FeaturedSection";
import GiftCardGrid from "./components/GiftCardGrid";
import FeaturedGiftCardGrid from "./components/FeaturedGiftCardGrid";
import NewsletterSection from "./components/NewsletterSection";
import FAQSection from "./components/FAQSection";
import NewsletterSignup from "./components/NewsletterSignup";
import ContactFormSection from "./components/ContactFormSection";
import ProductPage from "./pages/ProductPage";
import FeaturedProductPage from "./pages/FeaturedProductPage";
import SearchPage from "./pages/SearchPage";
import PaymentPage from "./pages/PaymentPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ConstructionPage from "./pages/ConstructionPage";
import AdminDashboard from "./pages/AdminDashboard";
import OrdersPage from "./pages/OrdersPage";
import ScrollToTop from "./components/ScrollToTop";
import { Navigate, useLocation } from "react-router-dom";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import TermsPage from "./pages/TermsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const isConstruction = false;

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function Home() {
  return (
    <div className="full-viewport">
      <Hero />
      <Carousel />
      <FeaturedSection />
      <FeaturedGiftCardGrid />
      <GiftCardGrid />
      <FAQSection />
      <NewsletterSignup />
      <ContactFormSection />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <ToastContainer />
                <Routes>
                  {isConstruction ? (
                    <Route path="*" element={<ConstructionPage />} />
                  ) : (
                    <>
                      {/* Public Auth Routes (No Header/Footer) */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                      />
                      <Route path="/terms" element={<TermsPage />} />

                      {/* Public Routes (With Header/Footer) - Accessible without login */}
                      <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route
                          path="/featured-product/:id"
                          element={<FeaturedProductPage />}
                        />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Route>

                      {/* Protected App Routes (With Header/Footer) - Require Login */}
                      <Route
                        element={
                          <ProtectedRoute>
                            <Layout />
                          </ProtectedRoute>
                        }
                      >
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/payment" element={<PaymentPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route
                          path="/admin/dashboard"
                          element={<AdminDashboard />}
                        />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/cart" element={<CartPage />} />
                      </Route>
                    </>
                  )}
                </Routes>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
