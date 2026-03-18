import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  HiCreditCard,
  HiCollection,
  HiUserCircle,
  HiUser,
  HiChevronDown,
  HiLogout,
  HiPhone,
  HiHeart,
  HiLockClosed,
  HiCog,
  HiShoppingCart,
} from "react-icons/hi";

export default function Header() {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlistItemCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dpModalOpen, setDpModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
        setDpModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Clear search query when leaving search page
  useEffect(() => {
    if (!location.pathname.includes("/search")) {
      setSearchQuery("");
    }
  }, [location]);

  const navLinks = (
    <>
      <Link
        to="/#contact"
        className={`flex items-center gap-1.5 text-[14px] transition ${
          location.pathname === "/" && location.hash === "#contact"
            ? "text-[var(--color-accent)] font-semibold"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        }`}
        onClick={closeMobileMenu}
      >
        <span>Contact</span>
        <HiPhone className="h-4 w-4 shrink-0" />
      </Link>
      {user?.isAdmin && (
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-1.5 text-[14px] text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
          onClick={closeMobileMenu}
        >
          <span>Dashboard</span>
          <HiLockClosed className="h-5 w-5 shrink-0" />
        </Link>
      )}
    </>
  );

  return (
    <header className="glass-strong fixed left-0 right-0 top-0 z-50 border-b border-[var(--color-glass-border)]/80">
      <div className="container-wide flex h-14 items-center justify-between gap-4 sm:h-16 lg:h-18">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-[19px] font-bold tracking-tight text-[var(--color-accent)] sm:text-[21px]"
          onClick={closeMobileMenu}
        >
          <img src="/logo.png" alt="Card Vault Logo" className="h-10 w-10" />
          <span className="truncate text-[var(--color-text)]">Card Vault</span>
        </Link>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden flex-1 max-w-md mx-4 md:flex items-center gap-2"
        >
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Search gift cards..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="glass-input w-full rounded-full py-2 pl-10 pr-4 text-[14px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
            />
            <svg
              className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white hover:opacity-90 transition"
            aria-label="Search"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full p-1 transition cursor-pointer hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-[14px] font-bold text-white shadow-sm ring-2 ring-[var(--color-glass-border)]">
                  {user.name?.charAt(0).toUpperCase() ||
                    user.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
                <HiChevronDown
                  className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {userDropdownOpen && (
                <div className="glass-strong absolute right-0 mt-5 w-56 origin-top-right rounded-2xl border border-[var(--color-glass-border)] p-2 shadow-xl animate-scale-in">
                  <Link
                    to="/profile"
                    className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-glass-border)] mb-2 hover:bg-white/5 rounded-xl transition"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div>
                      <p className="text-[14px] font-semibold truncate text-[var(--color-text)]">
                        {user.name}
                      </p>
                      <p className="text-[12px] text-[var(--color-text-muted)] truncate">
                        {user.email}
                      </p>
                    </div>
                    <HiCog className="h-5 w-5 text-[var(--color-text-muted)] hover:text-[var(--color-text)]" />
                  </Link>
                  {user?.isAdmin ? (
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-[var(--color-text-muted)] transition hover:bg-white/5 hover:text-[var(--color-text)]"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <HiHeart className="h-4 w-4" />
                      <span>My Wishlist</span>
                      {wishlistItemCount > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                          {wishlistItemCount > 9 ? "9+" : wishlistItemCount}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-[var(--color-text-muted)] transition hover:bg-white/5 hover:text-[var(--color-text)]"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <HiHeart className="h-4 w-4" />
                        <span>My Wishlist</span>
                        {wishlistItemCount > 0 && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {wishlistItemCount > 9 ? "9+" : wishlistItemCount}
                          </span>
                        )}
                      </Link>
                    </>
                  )}
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-[var(--color-text-muted)] transition hover:bg-white/5 hover:text-[var(--color-text)]"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <HiShoppingCart className="h-4 w-4" />
                    <span>My Cart</span>
                    {cartItemCount > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                        {cartItemCount > 9 ? "9+" : cartItemCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-[var(--color-text-muted)] transition hover:bg-white/5 hover:text-[var(--color-text)]"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <HiCollection className="h-4 w-4" />
                    <span>Orders History</span>
                  </Link>
                  <div className="my-2 border-t border-[var(--color-glass-border)]" />
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-red-400 transition hover:bg-red-500/10"
                  >
                    <HiLogout className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDpModalOpen(true)}
                  className="flex items-center gap-2 rounded-full p-1 transition cursor-pointer hover:bg-white/10"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-[14px] font-bold text-white shadow-sm ring-2 ring-[var(--color-glass-border)]">
                    A
                  </div>
                </button>

                {dpModalOpen && (
                  <div className="glass-strong absolute right-0 mt-5 w-72 origin-top-right rounded-2xl border border-[var(--color-glass-border)] p-4 shadow-xl animate-scale-in">
                    <p className="text-[14px] text-[var(--color-text-muted)] mb-3">
                      Please login to use all features
                    </p>
                    <Link
                      to="/login"
                      className="glass-cta flex items-center justify-center rounded-xl px-4 py-2.5 text-[14px] font-medium text-white transition"
                      onClick={() => setDpModalOpen(false)}
                    >
                      Login
                    </Link>
                    <p className="text-center text-[12px] text-[var(--color-text-muted)] mt-3">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-[var(--color-accent)] hover:underline"
                        onClick={() => setDpModalOpen(false)}
                      >
                        Register
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <ThemeToggle />
          {/* Cart Icon */}
        </nav>

        {/* Mobile: right side icons + hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--color-text)] transition hover:bg-white/10"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
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
            <form
              onSubmit={handleSearchSubmit}
              className="mb-4 px-4 flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search gift cards..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="glass-input w-full rounded-full py-2.5 pl-10 pr-4 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
                />
                <svg
                  className="absolute left-3.5 top-3 h-5 w-5 text-[var(--color-text-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                type="submit"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-white hover:opacity-90 transition"
                aria-label="Search"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
            <nav className="flex flex-col gap-1">
              <Link
                to="/#contact"
                className="flex min-h-[44px] items-center justify-between rounded-xl px-4 text-[17px] text-[var(--color-text)]"
                onClick={closeMobileMenu}
              >
                <span>Contact</span>
                <HiPhone className="h-6 w-6 text-[var(--color-text-muted)]" />
              </Link>
              {user && (
                <Link
                  to="/wishlist"
                  className="flex min-h-[44px] items-center justify-between rounded-xl px-4 text-[17px] text-[var(--color-text)]"
                  onClick={closeMobileMenu}
                >
                  <span>Wishlist</span>
                  <HiHeart className="h-6 w-6 text-[var(--color-text-muted)]" />
                </Link>
              )}
              <Link
                to="/cart"
                className="flex min-h-[44px] items-center justify-between rounded-xl px-4 text-[17px] text-[var(--color-text)]"
                onClick={closeMobileMenu}
              >
                <span>Cart</span>
                <HiShoppingCart className="h-6 w-6 text-[var(--color-text-muted)]" />
              </Link>
              <Link
                to="/orders"
                className="flex min-h-[44px] items-center justify-between rounded-xl px-4 text-[17px] text-[var(--color-text)]"
                onClick={closeMobileMenu}
              >
                <span>Orders</span>
                <HiCollection className="h-6 w-6 text-[var(--color-text-muted)]" />
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex min-h-[44px] items-center justify-between rounded-xl px-4 text-[17px] text-[var(--color-text)]"
                  onClick={closeMobileMenu}
                >
                  <span>Dashboard</span>
                  <HiLockClosed className="h-6 w-6 text-[var(--color-text-muted)]" />
                </Link>
              )}
              <div className="my-2 border-t border-[var(--color-glass-border)]" />
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl transition"
                    onClick={closeMobileMenu}
                  >
                    <div>
                      <p className="text-[15px] font-semibold truncate text-[var(--color-text)]">
                        {user.name}
                      </p>
                      <p className="text-[13px] text-[var(--color-text-muted)] truncate">
                        {user.email}
                      </p>
                    </div>
                    <HiCog className="h-6 w-6 text-[var(--color-text-muted)] hover:text-[var(--color-text)]" />
                  </Link>
                  <div className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                        navigate("/");
                      }}
                      className="glass-btn flex min-h-[44px] w-full items-center justify-center rounded-xl text-[17px] font-medium text-[var(--color-accent)]"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 py-2">
                  <Link
                    to="/login"
                    className="glass-btn flex min-h-[44px] items-center justify-center rounded-xl text-[17px] font-medium text-[var(--color-text)]"
                    onClick={closeMobileMenu}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="glass-cta flex min-h-[44px] items-center justify-center rounded-full text-[17px] font-medium text-white shadow-lg"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
