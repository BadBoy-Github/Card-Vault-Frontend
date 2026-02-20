import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { HiCreditCard, HiHeart, HiShoppingCart, HiCollection } from 'react-icons/hi'

export default function Header() {
  const { user, logout } = useAuth()
  const { ids } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`)
    } else {
      navigate('/')
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
  }

  const navLinks = (
    <>
      <Link to="/" className="flex items-center gap-1.5 text-[14px] text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]" onClick={closeMobileMenu}>
        <span>Gift Cards</span>
        <HiCollection className="h-5 w-5 shrink-0" />
      </Link>
      <Link to="/wishlist" className="relative flex items-center gap-1.5 text-[14px] text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]" onClick={closeMobileMenu}>
        <span>Wishlist</span>
        <HiHeart className="h-5 w-5 shrink-0" />
        {ids.length > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-semibold text-white">
            {ids.length}
          </span>
        )}
      </Link>
      <Link to="/cart" className="flex items-center gap-1.5 text-[14px] text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]" onClick={closeMobileMenu}>
        <span>Cart</span>
        <HiShoppingCart className="h-5 w-5 shrink-0" />
      </Link>
    </>
  )

  return (
    <header className="glass-strong fixed left-0 right-0 top-0 z-50 border-b border-[var(--color-glass-border)]/80">
      <div className="container-wide flex h-14 items-center justify-between gap-4 sm:h-16 lg:h-18">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-[19px] font-bold tracking-tight text-[var(--color-text)] sm:text-[21px]"
          onClick={closeMobileMenu}
        >
          <HiCreditCard className="text-2xl text-[var(--color-accent)]" />
          <span className="truncate">Card Vault</span>
        </Link>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden flex-1 max-w-md mx-4 md:block">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search gift cards..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="glass-input w-full rounded-full py-2 pl-10 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
            />
            <svg className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="max-w-[100px] truncate text-[14px] text-[var(--color-text-muted)]">
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-[14px] text-[var(--color-accent)] transition hover:underline"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-[14px] text-[var(--color-accent)] transition hover:underline">
                Sign in
              </Link>
              <Link to="/register" className="glass-cta rounded-full px-5 py-2 text-[14px] font-medium text-white">
                Register
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile: right side icons + hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 md:hidden">
          <Link
            to="/wishlist"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition hover:bg-white/10 hover:text-[var(--color-text)]"
            aria-label={`Wishlist${ids.length > 0 ? ` (${ids.length} items)` : ''}`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {ids.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-semibold text-white">
                {ids.length}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-white/10"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div
          className="glass-strong border-t border-[var(--color-glass-border)] md:hidden"
          role="dialog"
          aria-label="Navigation menu"
        >
          <div className="container-wide py-4 sm:py-6">
            <form onSubmit={handleSearchSubmit} className="mb-4 px-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search gift cards..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="glass-input w-full rounded-full py-2.5 pl-10 pr-4 text-[16px] focus:outline-none"
                />
                <svg className="absolute left-3.5 top-3 h-5 w-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                className="flex min-h-[44px] items-center justify-between rounded-xl px-4 text-[17px] text-[var(--color-text)]"
                onClick={closeMobileMenu}
              >
                <span>Gift Cards</span>
                <HiCollection className="h-6 w-6 text-[var(--color-text-muted)]" />
              </Link>
              <Link
                to="/wishlist"
                className="flex min-h-[44px] items-center justify-between rounded-xl px-4 text-[17px] text-[var(--color-text)]"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-2">
                  <span>Wishlist</span>
                  {ids.length > 0 && (
                    <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-xs font-semibold text-white">
                      {ids.length}
                    </span>
                  )}
                </div>
                <HiHeart className="h-6 w-6 text-[var(--color-text-muted)]" />
              </Link>
              <Link
                to="/cart"
                className="flex min-h-[44px] items-center justify-between rounded-xl px-4 text-[17px] text-[var(--color-text)]"
                onClick={closeMobileMenu}
              >
                <span>Cart</span>
                <HiShoppingCart className="h-6 w-6 text-[var(--color-text-muted)]" />
              </Link>
              <div className="my-2 border-t border-[var(--color-glass-border)]" />
              {user ? (
                <>
                  <div className="flex min-h-[44px] items-center px-4 text-[15px] text-[var(--color-text-muted)]">
                    {user.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => { logout(); closeMobileMenu(); }}
                    className="flex min-h-[44px] items-center rounded-xl px-4 text-left text-[17px] text-[var(--color-accent)]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex min-h-[44px] items-center rounded-xl px-4 text-[17px] text-[var(--color-accent)]"
                    onClick={closeMobileMenu}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="glass-cta mt-2 flex min-h-[44px] items-center justify-center rounded-full px-5 text-[17px] font-medium text-white"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
