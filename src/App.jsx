import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Hero from './components/Hero'
import FeaturedSection from './components/FeaturedSection'
import GiftCardGrid from './components/GiftCardGrid'
import NewsletterSection from './components/NewsletterSection'
import ContactSection from './components/ContactSection'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import SearchPage from './pages/SearchPage'
import PaymentTrafficPage from './pages/PaymentTrafficPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ConstructionPage from './pages/ConstructionPage'
import AdminDashboard from './pages/AdminDashboard'
import OrdersPage from './pages/OrdersPage'
import ScrollToTop from './components/ScrollToTop'
import { Navigate, useLocation } from 'react-router-dom'

const isConstruction = false 

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function Home() {
  return (
    <div className="full-viewport">
      <Hero />
      <FeaturedSection />
      <GiftCardGrid />
      <ContactSection />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {isConstruction ? (
              <Route path="*" element={<ConstructionPage />} />
            ) : (
              <>
                {/* Public Auth Routes (No Header/Footer) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

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
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/payment-traffic" element={<PaymentTrafficPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  </Route>
              </>
            )}
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
