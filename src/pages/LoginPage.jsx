import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { HiEye, HiEyeOff, HiInformationCircle } from "react-icons/hi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { warning } = useToast();
  const toastShown = useRef(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    // Show toast only once if user was redirected from a protected route
    if (location.state?.from && !toastShown.current) {
      toastShown.current = true;
      warning("Please login to continue");
    }
  }, [location.state, warning]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(
        result.error ??
          "Login failed. Maybe try a password you actually remember?",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-section-bg)] px-4 py-12 sm:px-6 md:px-8">
      <div className="glass-panel w-full max-w-[400px] rounded-2xl p-6 sm:p-10 md:p-12">
        <h1 className="apple-display text-[var(--color-text)]">Welcome Back</h1>
        <p className="apple-body mt-3 text-[17px]">
          Ready to spend those vault credits? Or just here to window-shop again?
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <p className="rounded-xl border border-[var(--color-glass-border)] bg-red-500/10 px-4 py-3 text-[15px] text-[var(--color-accent)]">
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor="login-email"
              className="block text-[14px] font-medium text-[var(--color-text)]"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-[14px] font-medium text-[var(--color-text)]"
            >
              Secret Code
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 pr-12 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mt-1"
              >
                {showPassword ? (
                  <HiEyeOff className="h-5 w-5" />
                ) : (
                  <HiEye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <a
                href="/forgot-password"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="glass-cta min-h-[44px] w-full rounded-full py-3.5 text-[16px] font-medium text-white sm:text-[17px] disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Entering...
              </span>
            ) : (
              "Enter the Vault"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-[var(--color-text-muted)]">
          New around here?{" "}
          <Link to="/register" className="apple-link font-medium">
            Join the inner circle
          </Link>
        </p>

        <div className="mt-10 flex items-center justify-center gap-2">
          <Link
            to="/"
            className="text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Continue as a guest
          </Link>
          <div className="group relative inline-block">
            <HiInformationCircle className="h-4 w-4 text-[var(--color-text-muted)] cursor-help" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--color-panel)] border border-[var(--color-glass-border)] rounded-lg text-[12px] text-[var(--color-text)] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-lg">
              For any action, an account is required
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--color-glass-border)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
