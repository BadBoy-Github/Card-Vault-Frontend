import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className="theme-transition flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-[var(--color-glass-border)] bg-[var(--color-section-bg)] px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div className="mx-auto max-w-[980px]">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-8">
            <Link to="/" className="min-h-[44px] py-2 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] sm:min-h-0 sm:py-0">
              Gift Cards
            </Link>
            <Link to="/wishlist" className="min-h-[44px] py-2 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] sm:min-h-0 sm:py-0">
              Wishlist
            </Link>
            <Link to="/orders" className="min-h-[44px] py-2 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] sm:min-h-0 sm:py-0">
              Orders
            </Link>
            <a href="#newsletter" className="min-h-[44px] py-2 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] sm:min-h-0 sm:py-0">
              Newsletter
            </a>
            <a href="#contact" className="min-h-[44px] py-2 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] sm:min-h-0 sm:py-0">
              Contact
            </a>
          </div>
          <p className="mt-4 text-center text-[11px] text-[var(--color-text-muted)] sm:mt-6 sm:text-[12px]">
            © {new Date().getFullYear()} Card Vault. Gift cards for digital delivery.
          </p>
        </div>
      </footer>
    </div>
  )
}
