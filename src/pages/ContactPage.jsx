import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import emailjs from "@emailjs/browser";
import { HiMail, HiUser, HiPaperAirplane, HiChatAlt2 } from "react-icons/hi";

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

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });
  const [notification, setNotification] = useState(null);
  const [isSending, setIsSending] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showNotification = (message, isSuccess = true) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      showNotification("Please select a category", false);
      return;
    }
    if (!formData.subject.trim()) {
      showNotification("Please enter a subject", false);
      return;
    }
    if (!formData.message.trim()) {
      showNotification("Please enter your message", false);
      return;
    }

    setIsSending(true);

    try {
      // EmailJS template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        category:
          CATEGORIES.find((c) => c.value === formData.category)?.label ||
          formData.category,
        subject: formData.subject,
        message: formData.message,
      };
      // Replace these with your actual EmailJS service ID, template ID, and public key
      await emailjs.send(
        "service_30qcbki", // Your EmailJS service ID
        "template_vsyw61l", // Your EmailJS template ID
        templateParams,
        "BNexrqP2jcx7Zej11", // Your EmailJS public key
      );

      showNotification(
        "Message sent successfully! We'll get back to you soon.",
        true,
      );

      // Reset form (keep name and email as they are read-only)
      setFormData((prev) => ({
        ...prev,
        category: "",
        subject: "",
        message: "",
      }));
    } catch (error) {
      console.error("Error sending email:", error);
      showNotification(
        "Failed to send message. Please try again or contact us via WhatsApp.",
        false,
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container-wide py-6 sm:py-8 mt-20">
      {/* Notification Popup */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-scale-in overflow-hidden">
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
              className="w-full rounded-xl border border-blue-500/50 bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
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
              className="w-full rounded-xl border border-blue-500/50 bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Brief description of your inquiry"
              required
            />
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
              rows={5}
              className="w-full rounded-xl border border-blue-500/50 bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              placeholder="Tell us more about your inquiry..."
              required
            />
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
    </div>
  );
}
