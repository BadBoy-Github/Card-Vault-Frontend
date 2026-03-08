import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiEye, HiEyeOff, HiCheck, HiArrowLeft } from "react-icons/hi";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate 8-character alphanumeric OTP (uppercase + lowercase + numbers)
const generateOTP = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let otp = "";
  for (let i = 0; i < 8; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
};

// Password validation checks (same as RegisterPage)
const passwordChecks = {
  hasLowercase: (pwd) => /[a-z]/.test(pwd),
  hasUppercase: (pwd) => /[A-Z]/.test(pwd),
  hasNumber: (pwd) => /[0-9]/.test(pwd),
  hasSpecial: (pwd) => /[!@#$%^&*()_+\-=[\]{};:'"|,.<>/?]/.test(pwd),
  hasMinLength: (pwd) => pwd.length >= 8,
  noSpaces: (pwd) => !/\s/.test(pwd),
};

// Check if password is very strong (all conditions met)
const isVeryStrong = (pwd) => {
  return Object.values(passwordChecks).every((check) => check(pwd));
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  // Timer for OTP countdown
  useEffect(() => {
    let timer;
    if (otpSent && !otpVerified && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setOtpError("OTP expired. Please request a new OTP.");
      setOtp("");
    }
    return () => clearInterval(timer);
  }, [otpSent, otpVerified, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
      setEmailValid(false);
    } else {
      setEmailError("");
      setEmailValid(value ? true : false);
    }
  };

  // Show notification
  const showNotification = (message, isSuccess = true) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 4000);
  };

  // Send OTP handler
  const handleSendOTP = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setEmailError("");

    try {
      // Check if email exists in database
      const checkResponse = await fetch(`${API_URL}/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkResponse.json();

      if (!checkData.exists) {
        setIsLoading(false);
        setEmailError(
          "There is no account attached to this email. Consider creating a new account with this email.",
        );
        return;
      }

      // Generate OTP
      const newOTP = generateOTP();

      // Send OTP via backend API using nodemailer
      const response = await fetch(`${API_URL}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "otp",
          data: {
            toEmail: email,
            otp: newOTP,
            expiryTime: new Date(Date.now() + 3 * 60 * 1000).toLocaleString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "short",
                year: "numeric",
              },
            ),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      // Store OTP temporarily (in real app, store in database with expiry)
      localStorage.setItem("forgot_password_otp", newOTP);
      localStorage.setItem("forgot_password_email", email);
      localStorage.setItem("forgot_password_otp_expiry", Date.now() + 180000); // 3 minutes

      setOtpSent(true);
      setTimeLeft(180);
      showNotification("OTP sent successfully to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      showNotification("Failed to send OTP. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (timeLeft === 0) {
      setOtpError("OTP expired. Please request a new OTP.");
      return;
    }

    const storedOTP = localStorage.getItem("forgot_password_otp");
    const storedEmail = localStorage.getItem("forgot_password_email");

    if (otp === storedOTP && email === storedEmail) {
      setOtpVerified(true);
      setOtpError("");
      showNotification("OTP verified successfully!");
    } else {
      setOtpError("Wrong OTP. Please enter correct OTP.");
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // Validate password strength
    if (!isVeryStrong(newPassword)) {
      showNotification(
        "Please ensure your password meets all requirements",
        false,
      );
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      showNotification("Passwords do not match", false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordUpdated(true);
        // Clear local storage
        localStorage.removeItem("forgot_password_otp");
        localStorage.removeItem("forgot_password_email");
        localStorage.removeItem("forgot_password_otp_expiry");
      } else {
        showNotification(data.message || "Failed to update password", false);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      showNotification("Failed to update password. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOTP = async () => {
    setOtp("");
    setOtpError("");
    setOtpVerified(false);
    setIsResending(true);
    try {
      await handleSendOTP({ preventDefault: () => {} });
    } finally {
      setIsResending(false);
    }
  };

  if (passwordUpdated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-section-bg)] px-4 py-12 sm:px-6 md:px-8">
        <div className="glass-panel w-full max-w-[400px] rounded-2xl p-6 sm:p-10 md:p-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-4">
              <HiCheck className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h1 className="apple-display text-[var(--color-text)]">
            Password Updated!
          </h1>
          <p className="apple-body mt-3 text-[17px] text-[var(--color-text-secondary)]">
            Your password has been successfully updated. You can now login with
            your new password.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block glass-cta min-h-[44px] rounded-full px-8 py-3.5 text-[16px] font-medium text-white sm:text-[17px]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-section-bg)] px-4 py-12 sm:px-6 md:px-8">
      <div className="glass-panel w-full max-w-[400px] rounded-2xl p-6 sm:p-10 md:p-12">
        {/* Back to Login Link */}
        <Link
          to="/login"
          className="mb-4 inline-flex items-center gap-2 text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <h1 className="apple-display text-[var(--color-text)]">
          Reset Password
        </h1>
        <p className="apple-body mt-3 text-[17px]">
          {otpVerified
            ? "Enter your new password below."
            : "Enter your email to receive an OTP for verification."}
        </p>

        {/* Notification Popup */}
        {notification && (
          <div className="fixed top-16 right-4 z-50 animate-scale-in overflow-hidden">
            <div
              className={`glass-panel rounded-xl px-4 py-2 border transition-all duration-300 ${
                notification.isSuccess
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-red-500/30 bg-red-500/10"
              }`}
            >
              <p
                className={`text-[14px] font-medium transition-all duration-300 ${
                  notification.isSuccess ? "text-green-500" : "text-red-500"
                }`}
              >
                {notification.message}
              </p>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6">
          {/* Email Input */}
          {!otpVerified && (
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-[14px] font-medium text-[var(--color-text)]"
              >
                Email Address
              </label>
              <div className="mt-2 flex gap-2">
                <div className="flex-1">
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={otpSent}
                    required
                    className={`glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 sm:px-5 sm:text-[17px] ${
                      emailError
                        ? "border border-red-400 focus:ring-red-400"
                        : emailValid
                          ? "border border-green-400 focus:ring-green-400"
                          : "focus:ring-[var(--color-accent)]"
                    } ${otpSent ? "opacity-60" : ""}`}
                    placeholder="you@example.com"
                  />
                </div>
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isLoading || !emailValid}
                    className="glass-cta mt-2 min-h-[44px] rounded-xl px-4 py-2 text-[14px] font-medium text-white disabled:opacity-70 whitespace-nowrap"
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </button>
                )}
              </div>
              {emailError && (
                <p className="mt-1.5 text-[13px] text-red-400">{emailError}</p>
              )}
              {emailValid && !emailError && email && (
                <p className="mt-1.5 text-[13px] text-green-400 flex items-center gap-1">
                  <HiCheck className="h-4 w-4" /> Valid email
                </p>
              )}
            </div>
          )}

          {/* OTP Input - Always visible, disabled until OTP sent */}
          <div>
            <label
              htmlFor="otp"
              className={`block text-[14px] font-medium text-[var(--color-text)] ${
                !otpSent ? "opacity-50" : ""
              }`}
            >
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                if (otpSent) {
                  setOtp(e.target.value);
                  setOtpError("");
                }
              }}
              required
              disabled={!otpSent}
              className={`glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 sm:px-5 sm:text-[17px] ${
                otpError
                  ? "border border-red-400 focus:ring-red-400"
                  : "focus:ring-[var(--color-accent)]"
              } ${!otpSent ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Enter 8-character OTP"
              maxLength={8}
            />
            {otpError && (
              <p className="mt-1.5 text-[13px] text-red-400">{otpError}</p>
            )}

            {/* Timer - Only show when OTP sent */}
            {otpSent && (
              <div className="mt-3 flex items-center justify-between">
                <p
                  className={`text-[14px] ${
                    timeLeft <= 30
                      ? "text-red-400"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  Time remaining: {formatTime(timeLeft)}
                </p>
                {timeLeft === 0 && (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-[14px] text-[var(--color-accent)] hover:underline disabled:opacity-70"
                  >
                    {isResending ? "Resending..." : "Resend OTP"}
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={!otpSent || otp.length !== 8 || isLoading}
              className={`glass-cta mt-4 min-h-[44px] w-full rounded-full py-3.5 text-[16px] font-medium text-white sm:text-[17px] disabled:opacity-70 ${!otpSent ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Verify OTP
            </button>
          </div>

          {/* New Password Input */}
          {otpVerified && (
            <>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-[14px] font-medium text-[var(--color-text)]"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 pr-12 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mt-1"
                  >
                    {showNewPassword ? (
                      <HiEyeOff className="h-5 w-5" />
                    ) : (
                      <HiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="mt-3 space-y-1.5">
                  <p className="text-[12px] text-[var(--color-text-muted)]">
                    Password must meet all of the following:
                  </p>
                  <ul className="space-y-1 text-[12px]">
                    <li
                      className={`flex items-center gap-1 ${
                        passwordChecks.hasLowercase(newPassword)
                          ? "text-green-400"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      <HiCheck className="h-3 w-3" /> At least one lowercase
                      letter
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        passwordChecks.hasUppercase(newPassword)
                          ? "text-green-400"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      <HiCheck className="h-3 w-3" /> At least one uppercase
                      letter
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        passwordChecks.hasNumber(newPassword)
                          ? "text-green-400"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      <HiCheck className="h-3 w-3" /> At least one number
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        passwordChecks.hasSpecial(newPassword)
                          ? "text-green-400"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      <HiCheck className="h-3 w-3" /> At least one special
                      character
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        passwordChecks.hasMinLength(newPassword)
                          ? "text-green-400"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      <HiCheck className="h-3 w-3" /> At least 8 characters
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        passwordChecks.noSpaces(newPassword)
                          ? "text-green-400"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      <HiCheck className="h-3 w-3" /> No spaces
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-[14px] font-medium text-[var(--color-text)]"
                >
                  Repeat New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="glass-input mt-2 min-h-[44px] w-full rounded-xl px-4 py-3.5 pr-12 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px]"
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mt-1"
                  >
                    {showConfirmPassword ? (
                      <HiEyeOff className="h-5 w-5" />
                    ) : (
                      <HiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="mt-1.5 text-[13px] text-green-400 flex items-center gap-1">
                    <HiCheck className="h-4 w-4" /> Passwords match
                  </p>
                )}
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1.5 text-[13px] text-red-400">
                    Passwords do not match
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={
                  isLoading ||
                  !isVeryStrong(newPassword) ||
                  newPassword !== confirmPassword
                }
                className="glass-cta min-h-[44px] w-full rounded-full py-3.5 text-[16px] font-medium text-white sm:text-[17px] disabled:opacity-70"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
