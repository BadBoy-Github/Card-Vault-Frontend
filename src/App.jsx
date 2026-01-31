import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import { OrderProvider } from './context/OrderContext'
import Layout from './components/Layout'
import Hero from './components/Hero'
import FeaturedSection from './components/FeaturedSection'
import GiftCardGrid from './components/GiftCardGrid'
import NewsletterSection from './components/NewsletterSection'
import ContactSection from './components/ContactSection'
import ProductPage from './pages/ProductPage'
import OrderPage from './pages/OrderPage'
import WishlistPage from './pages/WishlistPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function Home() {
  return (
    <>
      <Hero />
      <FeaturedSection />
      <GiftCardGrid />
      <NewsletterSection />
      <ContactSection />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <OrderProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/orders" element={<OrderPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
              </Routes>
            </OrderProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
