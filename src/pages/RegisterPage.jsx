import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiEye, HiEyeOff, HiCheck } from "react-icons/hi";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { user, register, loading } = useAuth();
  const navigate = useNavigate();

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation checks
  const passwordChecks = {
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};:'"|,.<>/?]/.test(password),
    hasMinLength: password.length >= 8,
    noSpaces: !/\s/.test(password),
  };

  // Calculate password strength (0-6 based on fulfilled criteria)
  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;

  // Determine progress bar color based on strength
  const getProgressBarColor = () => {
    if (strengthScore <= 2) return "bg-gray-400";
    if (strengthScore <= 4) return "bg-gray-500";
    return "bg-blue-500";
  };

  // Progress bar width percentage
  const progressWidth = (strengthScore / 6) * 100;

  // Check if password is very strong (all conditions met)
  const isVeryStrong = strengthScore === 6;

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
      setEmailValid(false);
    } else {
      setEmailError("");
      setEmailValid(true);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!isVeryStrong) {
      setError("Please ensure your password meets all requirements");
      return;
    }

    const result = await register(name, email, password);
    if (result.ok) {
      navigate("/");
    } else {
      setError(
        result.error ??
          "Registration failed. Maybe yours is already in our vault?",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-section-bg)] px-4 py-12 sm:px-6 md:px-8">
      <div className="glass-panel w-full max-w-[400px] rounded-2xl p-6 sm:p-10 md:p-12">
        <h1 className="apple-display text-[var(--color-text)]">
          Join the Vault
        </h1>
        <p className="apple-body mt-3 text-[17px]">
          Create an account to start your journey into digital treasure
          hoarding.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <p className="rounded-xl border border-[var(--color-glass-border)] bg-red-500/10 px-4 py-3 text-[15px] text-[var(--color-accent)]">
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor="reg-name"
              className="block text-[14px] font-medium text-[var(--color-text)]"
            >
              Human Name
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="reg-email"
              className="block text-[14px] font-medium text-[var(--color-text)]"
            >
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              required
              className={`glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 sm:px-5 sm:text-[17px] ${
                emailError
                  ? "border border-red-400 focus:ring-red-400"
                  : emailValid
                    ? "border border-green-400 focus:ring-green-400"
                    : "focus:ring-[var(--color-accent)]"
              }`}
              placeholder="you@example.com"
            />
            {emailError && (
              <p className="mt-1.5 text-[13px] text-red-400">{emailError}</p>
            )}
            {emailValid && !emailError && email && (
              <p className="mt-1.5 text-[13px] text-green-400 flex items-center gap-1">
                <HiCheck className="h-4 w-4" /> Valid email format
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="reg-password"
              className="block text-[14px] font-medium text-[var(--color-text)]"
            >
              Master Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 pr-24 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
                placeholder="Strong_password_here"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 mt-1">
                {isVeryStrong && password && (
                  <HiCheck className="h-5 w-5 text-green-400" />
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5" />
                  ) : (
                    <HiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Progress Bar */}
            {password && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[12px] text-[var(--color-text-muted)]">
                    Password Strength
                  </span>
                  <span
                    className={`text-[12px] ${
                      strengthScore <= 2
                        ? "text-gray-400"
                        : strengthScore <= 4
                          ? "text-gray-500"
                          : "text-blue-500"
                    }`}
                  >
                    {strengthScore <= 2
                      ? "Weak"
                      : strengthScore <= 4
                        ? "Medium"
                        : isVeryStrong
                          ? "Very Strong"
                          : "Strong"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>
            )}

            {/* Password Requirements Warning */}
            {password && !isVeryStrong && (
              <div className="mt-3 space-y-1.5">
                <p className="text-[13px] text-[var(--color-text-muted)]">
                  Add the following to make your password stronger:
                </p>
                <ul className="space-y-1">
                  {!passwordChecks.hasLowercase && (
                    <li className="text-[12px] text-amber-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      At least 1 lowercase letter (a-z)
                    </li>
                  )}
                  {!passwordChecks.hasUppercase && (
                    <li className="text-[12px] text-amber-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      At least 1 uppercase letter (A-Z)
                    </li>
                  )}
                  {!passwordChecks.hasNumber && (
                    <li className="text-[12px] text-amber-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      At least 1 number (0-9)
                    </li>
                  )}
                  {!passwordChecks.hasSpecial && (
                    <li className="text-[12px] text-amber-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      At least 1 special character (!@#$%^&*...)
                    </li>
                  )}
                  {!passwordChecks.hasMinLength && (
                    <li className="text-[12px] text-amber-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      At least 8 characters long
                    </li>
                  )}
                  {!passwordChecks.noSpaces && (
                    <li className="text-[12px] text-amber-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      No spaces allowed
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* All requirements met */}
            {isVeryStrong && password && (
              <p className="mt-3 text-[13px] text-green-400 flex items-center gap-1">
                <HiCheck className="h-4 w-4" /> All requirements met! Your
                password is secure.
              </p>
            )}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="accept-terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-[var(--color-glass-border)] bg-[var(--color-section-bg)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] focus:ring-offset-0 cursor-pointer"
            />
            <label
              htmlFor="accept-terms"
              className="text-[14px] text-[var(--color-text-muted)] cursor-pointer"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="apple-link font-medium"
                target="_blank"
              >
                Terms & Conditions
              </Link>{" "}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !emailValid || !isVeryStrong || !acceptTerms}
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
                Joining...
              </span>
            ) : (
              "Claim My Spot"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-[var(--color-text-muted)]">
          Already one of us?{" "}
          <Link to="/login" className="apple-link font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
