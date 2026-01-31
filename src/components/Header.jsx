import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { ids } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const navLinks = (
    <>
      <Link to="/" className="text-[14px] text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]" onClick={closeMobileMenu}>
        Gift Cards
      </Link>
      <Link to="/wishlist" className="relative flex items-center gap-1.5 text-[14px] text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]" onClick={closeMobileMenu}>
        <span>Wishlist</span>
        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {ids.length > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-semibold text-white">
            {ids.length}
          </span>
        )}
      </Link>
      <Link to="/orders" className="text-[14px] text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]" onClick={closeMobileMenu}>
        Orders
      </Link>
    </>
  )

  return (
    <header className="glass-strong fixed left-0 right-0 top-0 z-50 border-b border-[var(--color-glass-border)]/80">
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between gap-4 px-4 sm:h-14 sm:px-6 md:px-8 lg:h-14">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-[17px] font-semibold tracking-tight text-[var(--color-text)] sm:text-[17px]"
          onClick={closeMobileMenu}
        >
          <span className="text-xl">💳</span>
          <span className="truncate">Card Vault</span>
        </Link>

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
          <nav className="mx-auto flex max-w-[980px] flex-col gap-1 px-4 py-4 sm:px-6">
            <Link
              to="/"
              className="flex min-h-[44px] items-center rounded-xl px-4 text-[17px] text-[var(--color-text)]"
              onClick={closeMobileMenu}
            >
              Gift Cards
            </Link>
            <Link
              to="/wishlist"
              className="flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-[17px] text-[var(--color-text)]"
              onClick={closeMobileMenu}
            >
              Wishlist
              {ids.length > 0 && (
                <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-xs font-semibold text-white">
                  {ids.length}
                </span>
              )}
            </Link>
            <Link
              to="/orders"
              className="flex min-h-[44px] items-center rounded-xl px-4 text-[17px] text-[var(--color-text)]"
              onClick={closeMobileMenu}
            >
              Orders
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
      )}
    </header>
  )
}
