import { useState } from "react";
import { Link } from "react-router-dom";
import { HiUser, HiMail, HiChatAlt2, HiPaperAirplane } from "react-icons/hi";

const CATEGORIES = [
  { value: "", label: "Select a category" },
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Related" },
  { value: "payment", label: "Payment Issue" },
  { value: "product", label: "Product Inquiry" },
  { value: "feedback", label: "Feedback" },
  { value: "bug", label: "Report a Bug" },
  { value: "other", label: "Other" },
];

export default function TermsContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    topic: "",
    description: "",
  });

  // Custom validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [notification, setNotification] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Validate individual fields
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        return "";
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return "";
      case "category":
        if (!value) return "Please select a category";
        return "";
      case "topic":
        if (!value.trim()) return "Topic is required";
        if (value.trim().length < 3)
          return "Topic must be at least 3 characters";
        return "";
      case "description":
        if (!value.trim()) return "Description is required";
        if (value.trim().length < 10)
          return "Description must be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      category: validateField("category", formData.category),
      topic: validateField("topic", formData.topic),
      description: validateField("description", formData.description),
    };
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      category: true,
      topic: true,
      description: true,
    });
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

  const showNotification = (message, isSuccess = true) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Send data to backend
    try {
      setIsSending(true);
      const API_URL =
        import.meta.env.VITE_API_URL ||
        "https://card-vault-backend.vercel.app/api";

      const response = await fetch(`${API_URL}/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "contact",
          data: {
            name: formData.name,
            email: formData.email,
            category: formData.category,
            subject: formData.topic,
            message: formData.description,
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification("Thank you! We'll get back to you soon.", true);
        setFormData({
          name: "",
          email: "",
          category: "",
          topic: "",
          description: "",
        });
        setTouched({});
        setErrors({});
      } else {
        showNotification(result.message || "Failed to send message", false);
      }
    } catch {
      showNotification("Failed to send message. Please try again.", false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-section-bg)] px-4 py-12 sm:px-6 md:px-8">
      <div className="glass-panel w-full max-w-[500px] rounded-2xl p-6 sm:p-10 md:p-12">
        <h1 className="apple-display text-[var(--color-text)]">Contact Us</h1>
        <p className="apple-body mt-3 text-[17px]">
          Have questions? We'd love to hear from you.
        </p>

        {/* Notification */}
        {notification && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-[15px] ${
              notification.isSuccess
                ? "bg-green-500/10 text-green-500 border border-green-500/30"
                : "bg-red-500/10 text-red-500 border border-red-500/30"
            }`}
          >
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Name Field */}
          <div>
            <label
              htmlFor="contact-name"
              className="block text-[14px] font-medium text-[var(--color-text)]"
            >
              Name
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <HiUser className="h-5 w-5 text-[var(--color-text-muted)]" />
              </div>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="glass-input mt-0 min-h-[44px] w-full rounded-xl pl-12 py-3 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:pl-14 sm:text-[17px]"
                placeholder="Your name"
              />
            </div>
            {touched.name && errors.name && (
              <p className="mt-1.5 text-[13px] text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="contact-email"
              className="block text-[14px] font-medium text-[var(--color-text)]"
            >
              Email Address
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <HiMail className="h-5 w-5 text-[var(--color-text-muted)]" />
              </div>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="glass-input mt-0 min-h-[44px] w-full rounded-xl pl-12 py-3 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:pl-14 sm:text-[17px]"
                placeholder="you@example.com"
              />
            </div>
            {touched.email && errors.email && (
              <p className="mt-1.5 text-[13px] text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label
              htmlFor="contact-category"
              className="block text-[14px] font-medium text-[var(--color-text)]"
            >
              Category
            </label>
            <div className="relative mt-2">
              <select
                id="contact-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                className="glass-input mt-0 min-h-[44px] w-full rounded-xl px-4 py-3 text-[16px] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:text-[17px] appearance-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <svg
                  className="h-5 w-5 text-[var(--color-text-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {touched.category && errors.category && (
              <p className="mt-1.5 text-[13px] text-red-500">
                {errors.category}
              </p>
            )}
          </div>

          {/* Topic Field */}
          <div>
            <label
              htmlFor="contact-topic"
              className="block text-[14px] font-medium text-[var(--color-text)]"
            >
              Topic
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <HiChatAlt2 className="h-5 w-5 text-[var(--color-text-muted)]" />
              </div>
              <input
                id="contact-topic"
                name="topic"
                type="text"
                value={formData.topic}
                onChange={handleChange}
                onBlur={handleBlur}
                className="glass-input mt-0 min-h-[44px] w-full rounded-xl pl-12 py-3 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:pl-14 sm:text-[17px]"
                placeholder="How can we help?"
              />
            </div>
            {touched.topic && errors.topic && (
              <p className="mt-1.5 text-[13px] text-red-500">{errors.topic}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="contact-description"
              className="block text-[14px] font-medium text-[var(--color-text)]"
            >
              Description
            </label>
            <textarea
              id="contact-description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className="glass-input mt-2 w-full rounded-xl px-4 py-3 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:px-5 sm:text-[17px] resize-none"
              placeholder="Tell us more about your inquiry..."
            />
            {touched.description && errors.description && (
              <p className="mt-1.5 text-[13px] text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="glass-cta min-h-[44px] w-full rounded-full py-3.5 text-[16px] font-medium text-white sm:text-[17px] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSending ? (
              <>
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
                Sending...
              </>
            ) : (
              <>
                <HiPaperAirplane className="h-5 w-5" />
                Send Message
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-[var(--color-text-muted)]">
          <Link to="/" className="apple-link font-medium">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
