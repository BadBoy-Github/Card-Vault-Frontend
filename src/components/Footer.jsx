import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-glass-border)] bg-white/5 py-10">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-[18px] font-bold text-[var(--color-text)] mb-1">Card Vault</h3>
            <p className="text-[13px] text-[var(--color-text-muted)]">© {new Date().getFullYear()} All rights reserved. Built for treasure hunters.</p>
          </div>
          
          <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-[14px]">
            <Link to="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition">Home</Link>
            <Link to="/search" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition">Explore</Link>
            <Link to="/orders" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition">Orders</Link>
            <Link to="/contact" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition">Support</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
