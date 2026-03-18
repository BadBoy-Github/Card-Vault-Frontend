import { Link } from "react-router-dom";
import { HiMail, HiGlobe, HiChatAlt2 } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto border-t border-[var(--color-glass-border)] bg-white/5 py-10">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left Column - Brand Info */}
          <div className="text-center lg:text-left">
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-center gap-2 text-[18px] font-bold text-[var(--color-text)] mb-2 justify-center lg:justify-start"
            >
              <img src="/logo.png" alt="" className="h-8 w-8" />
              <span>Card Vault</span>
            </Link>
            <p className="text-[13px] text-[var(--color-text-muted)] mb-3 max-w-sm">
              Your destination for digital gift cards. Buy gaming, shopping, and
              entertainment gift cards instantly.
            </p>
            <p className="text-[12px] text-[var(--color-text-muted)]">
              © {new Date().getFullYear()} Card Vault. All rights reserved.
            </p>
            <Link
              to="/terms"
              className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
            >
              Read our Terms & Conditions
            </Link>
          </div>

          {/* Right Column - Sitemap & Social */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sitemap */}
            <div className="lg:col-span-5">
              <h3 className="font-semibold text-[var(--color-text)] mb-4">
                Sitemap
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <nav className="flex flex-col gap-2 text-[14px]">
                  <Link
                    to="/"
                    onClick={scrollToTop}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                  >
                    Home
                  </Link>
                  <Link
                    to="/#about"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                  >
                    Why Us?
                  </Link>
                  <Link
                    to="/featured"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                  >
                    Featured
                  </Link>
                  <Link
                    to="/#gift-cards"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                  >
                    Gift Cards
                  </Link>
                </nav>
                <nav className="flex flex-col gap-2 text-[14px]">
                  <Link
                    to="/wishlist"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/cart"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                  >
                    Cart
                  </Link>
                  <Link
                    to="/orders"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/#contact"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </div>

            {/* Vertical divider on desktop */}
            <div className="hidden lg:block lg:col-span-1 h-full min-h-[120px]">
              <div className="border-l border-[var(--color-glass-border)] h-full" />
            </div>

            {/* Horizontal divider on mobile */}
            <div className="lg:hidden border-t border-[var(--color-glass-border)] my-6" />

            {/* Social Links */}
            <div className="lg:col-span-6">
              <h3 className="font-semibold text-[var(--color-text)] mb-4">
                Connect
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://elayabarathimv.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                >
                  <HiGlobe className="h-5 w-5" />
                  <span>Portfolio</span>
                </a>
                <a
                  href="mailto:elayabarathi123@gmail.com"
                  className="flex items-center gap-3 text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                >
                  <HiMail className="h-5 w-5" />
                  <span>Email</span>
                </a>
                <a
                  href="https://wa.me/919842852121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  <span>WhatsApp</span>
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
