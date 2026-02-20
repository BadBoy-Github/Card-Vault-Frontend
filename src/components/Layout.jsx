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
        <div className="mx-auto">
          <p className="text-center text-[11px] text-[var(--color-text-muted)] sm:text-[12px]">
            © {new Date().getFullYear()} Card Vault. Gift cards for digital delivery.
          </p>
        </div>
      </footer>
    </div>
  )
}
