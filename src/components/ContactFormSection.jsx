import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  HiMail,
  HiUser,
  HiPaperAirplane,
  HiChatAlt2,
  HiCheck,
} from "react-icons/hi";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

const CATEGORIES = [
  { value: "", label: "Select a category" },
  { value: "order", label: "Order Related" },
  { value: "payment", label: "Payment Issue" },
  { value: "product", label: "Product Inquiry" },
  { value: "giftcard", label: "Gift Card" },
  { value: "feedback", label: "Feedback" },
  { value: "bug", label: "Report a Bug" },
  { value: "other", label: "Other" },
];

export default function ContactFormSection() {
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });

  // Custom validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSending, setIsSending] = useState(false);

  // Validate individual fields
  const validateField = (name, value) => {
    switch (name) {
      case "category":
        return value ? "" : "Please select a category";
      case "subject":
        if (!value.trim()) return "Please enter a subject";
        if (value.trim().length < 5)
          return "Subject must be at least 5 characters";
        return "";
      case "message":
        if (!value.trim()) return "Please enter your message";
        if (value.trim().length < 20)
          return "Message must be at least 20 characters";
        return "";
      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {
      category: validateField("category", formData.category),
      subject: validateField("subject", formData.subject),
      message: validateField("message", formData.message),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      category: true,
      subject: true,
      message: true,
    });

    // Validate form
    if (!validateForm()) {
      showError("Please fix the errors before submitting");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`${API_URL}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          data: {
            name: formData.name,
            email: formData.email,
            category:
              CATEGORIES.find((c) => c.value === formData.category)?.label ||
              formData.category,
            subject: formData.subject,
            message: formData.message,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      showSuccess("Message sent successfully! We'll get back to you soon.");

      // Reset form (keep name and email as they are read-only)
      setFormData((prev) => ({
        ...prev,
        category: "",
        subject: "",
        message: "",
      }));
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error("Error sending email:", error);
      showError(
        "Failed to send message. Please try again or contact us via WhatsApp.",
      );
    } finally {
      setIsSending(false);
    }
  };

  // Prepopulate user data from auth context
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  return (
    <section
      id="contact"
      className="section-padding-lg px-4 sm:px-6 md:px-8"
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <HiChatAlt2 className="text-5xl sm:text-6xl text-[var(--color-accent)]" />
            </div>
          </div>
          <h1 className="apple-display mb-3 text-[var(--color-text)]">
            Contact Us
          </h1>
          <p className="apple-body text-[var(--color-text-secondary)]">
            Have a question? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-[40px] p-6 sm:p-8"
        >
          {/* Name Field (Read-only) */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
              <HiUser className="mr-2 inline-block" />
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              disabled
              className="w-full rounded-xl border border-gray-400/50 bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] opacity-60 cursor-not-allowed"
              placeholder="Your name from registration"
            />
          </div>

          {/* Email Field (Read-only) */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
              <HiMail className="mr-2 inline-block" />
              Your Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              disabled
              className="w-full rounded-xl border border-gray-400/50 bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] opacity-60 cursor-not-allowed"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Category Dropdown */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSending}
              className={`w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                touched.category && errors.category
                  ? "border-red-500 focus:border-red-500"
                  : "border-blue-500/50 focus:border-blue-500"
              }`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {touched.category && errors.category && (
              <p className="mt-1.5 text-[13px] text-red-400 flex items-center gap-1">
                {errors.category}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSending}
              className={`w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                touched.subject && errors.subject
                  ? "border-red-500 focus:border-red-500"
                  : "border-blue-500/50 focus:border-blue-500"
              }`}
              placeholder="Brief description of your inquiry"
            />
            {touched.subject && errors.subject && (
              <p className="mt-1.5 text-[13px] text-red-400 flex items-center gap-1">
                {errors.subject}
              </p>
            )}
            {touched.subject && !errors.subject && formData.subject && (
              <p className="mt-1.5 text-[13px] text-green-400 flex items-center gap-1">
                <HiCheck className="h-4 w-4" /> Valid
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSending}
              rows={5}
              className={`w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none ${
                touched.message && errors.message
                  ? "border-red-500 focus:border-red-500"
                  : "border-blue-500/50 focus:border-blue-500"
              }`}
              placeholder="Tell us more about your inquiry..."
            />
            {touched.message && errors.message && (
              <p className="mt-1.5 text-[13px] text-red-400 flex items-center gap-1">
                {errors.message}
              </p>
            )}
            {touched.message && !errors.message && formData.message && (
              <p className="mt-1.5 text-[13px] text-green-400 flex items-center gap-1">
                <HiCheck className="h-4 w-4" /> Valid
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full rounded-xl bg-[var(--color-accent)] py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <HiPaperAirplane className="h-5 w-5" />
                Send Message
              </>
            )}
          </button>

          {/* Login prompt for non-authenticated users */}
          {!user && (
            <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
              Please{" "}
              <a
                href="/login"
                className="text-[var(--color-accent)] hover:underline"
              >
                login
              </a>{" "}
              to contact us with your registered email.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
