import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./components/Layout";
import ToastContainer from "./components/ToastContainer";
import Hero from "./components/Hero";
import FeaturedSection from "./components/FeaturedSection";
import GiftCardGrid from "./components/GiftCardGrid";
import NewsletterSection from "./components/NewsletterSection";
import FAQSection from "./components/FAQSection";
import ProductPage from "./pages/ProductPage";
import SearchPage from "./pages/SearchPage";
import PaymentPage from "./pages/PaymentPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import ConstructionPage from "./pages/ConstructionPage";
import AdminDashboard from "./pages/AdminDashboard";
import OrdersPage from "./pages/OrdersPage";
import ScrollToTop from "./components/ScrollToTop";
import { Navigate, useLocation } from "react-router-dom";
import WishlistPage from "./pages/WishlistPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import TermsPage from "./pages/TermsPage";

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
      <FeaturedSection />
      <GiftCardGrid />
      <FAQSection />
      {/* <NewsletterSection /> */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
              <ToastContainer />
              <Routes>
                {isConstruction ? (
                  <Route path="*" element={<ConstructionPage />} />
                ) : (
                  <>
                    {/* Public Auth Routes (No Header/Footer) */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/terms" element={<TermsPage />} />

                    {/* Protected App Routes (With Header/Footer) */}
                    <Route
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/" element={<Home />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/payment" element={<PaymentPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                      />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </>
                )}
              </Routes>
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
