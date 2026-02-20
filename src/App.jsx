import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import Layout from './components/Layout'
import Hero from './components/Hero'
import FeaturedSection from './components/FeaturedSection'
import GiftCardGrid from './components/GiftCardGrid'
import NewsletterSection from './components/NewsletterSection'
import ContactSection from './components/ContactSection'
import ProductPage from './pages/ProductPage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import SearchPage from './pages/SearchPage'
import PaymentTrafficPage from './pages/PaymentTrafficPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

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
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/payment-traffic" element={<PaymentTrafficPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
