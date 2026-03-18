import { Link } from "react-router-dom";
import { HiMail, HiGlobe, HiChatAlt2 } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

// Sitemap links data - easy to edit
const sitemapLinks = [
  { name: "Home", href: "/" },
  { name: "Why Us?", href: "/#about" },
  { name: "Featured", href: "/featured" },
  { name: "Gift Cards", href: "/#gift-cards" },
  { name: "Wishlist", href: "/wishlist" },
  { name: "Cart", href: "/cart" },
  { name: "Orders", href: "/orders" },
  { name: "Contact", href: "/#contact" },
];

// Social links data - easy to edit
const socialLinks = [
  {
    name: "Portfolio",
    href: "https://elayabarathimv.vercel.app",
    icon: HiGlobe,
    external: true,
  },
  {
    name: "Email",
    href: "mailto:elayabarathi123@gmail.com",
    icon: HiMail,
    external: false,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/919344875728",
    icon: FaWhatsapp,
    external: true,
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Split sitemap into two columns
  const sitemapLeft = sitemapLinks.slice(0, 4);
  const sitemapRight = sitemapLinks.slice(4);

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
              <img src="/logo.png" alt="Card Vault Logo" className="h-8 w-8" />
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
              className="text-[12px] text-yellow-500/60 hover:text-yellow-500 transition"
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
                {/* Left column */}
                <nav className="flex flex-col gap-2 text-[14px]">
                  {sitemapLeft.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={link.href === "/" ? scrollToTop : undefined}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition w-fit"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                {/* Right column */}
                <nav className="flex flex-col gap-2 text-[14px]">
                  {sitemapRight.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition w-fit"
                    >
                      {link.name}
                    </Link>
                  ))}
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
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return link.external ? (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.name}</span>
                    </a>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-3 text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
