import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { HiCheck, HiX, HiMail } from "react-icons/hi";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

// Categories ordered: first available occasions, then general categories
const CATEGORIES = [
  // Available occasions first
  "Birthday",
  "Anniversary",
  "Wedding",
  "Festival",
  "Corporate",
  // General categories
  "Gaming",
  "Kids",
  "Shopping",
  "Food",
  "Travel",
];

export default function NewsletterSignup() {
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    likedCategories: [],
  });

  // Custom validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Validate individual fields
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 3)
          error = "Name must be at least 3 characters";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) error = "Please enter a valid email";
        }
        break;
      case "age":
        if (!value) error = "Age is required";
        else {
          const ageNum = parseInt(value);
          if (isNaN(ageNum)) error = "Please enter a valid age";
          else if (ageNum < 19) error = "You must be at least 19 years old";
        }
        break;
      case "phone":
        if (!value.trim()) error = "Phone number is required";
        else if (value.trim().length < 10)
          error = "Phone must be at least 10 digits";
        else {
          // Check for valid phone format - allows digits, spaces, dashes, parentheses, plus sign
          const phoneRegex = /^[\d\s\-() +]+$/;
          if (!phoneRegex.test(value.trim()))
            error = "Please enter a valid phone number";
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      age: validateField("age", formData.age),
      phone: validateField("phone", formData.phone),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Handle field blur (when user leaves a field)
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

  const handleCategoryChange = (category) => {
    setFormData((prev) => {
      const categories = prev.likedCategories.includes(category)
        ? prev.likedCategories.filter((c) => c !== category)
        : [...prev.likedCategories, category];
      return { ...prev, likedCategories: categories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      age: true,
      phone: true,
    });

    // Validate form
    if (!validateForm()) {
      showError("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          age: parseInt(formData.age),
          phone: formData.phone,
          likedCategories: formData.likedCategories,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess("Successfully subscribed to newsletter!");
      } else if (data.message?.includes("already subscribed")) {
        showSuccess("You're already subscribed!");
      } else {
        showError(data.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter error:", error);
      showError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="section-padding-lg px-4 sm:px-6 md:px-8"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto max-w-[700px]">
        <div className="glass-panel rounded-2xl p-6 text-center sm:rounded-3xl sm:p-10 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-[var(--color-accent)]/10">
              <HiMail className="h-8 w-8 text-[var(--color-accent)]" />
            </div>
          </div>

          <h2
            id="newsletter-heading"
            className="apple-display text-[var(--color-text)] text-2xl sm:text-3xl"
          >
            Stay Updated!
          </h2>
          <p className="apple-body mt-3 text-[15px] sm:mt-4 sm:text-[17px] text-[var(--color-text-muted)]">
            Get notified about all newly updated gift cards. We promise not to
            spam!
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-left">
                <label
                  htmlFor="newsletter-name"
                  className="block text-sm font-medium text-[var(--color-text-muted)] mb-1"
                >
                  Name *
                </label>
                <div className="relative">
                  <input
                    id="newsletter-name"
                    name="name"
                    type="text"
                    placeholder="Your name (min 3 characters)"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading || !!user}
                    readOnly={!!user}
                    className={`glass-input w-full rounded-xl px-4 py-3 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-60 ${
                      touched.name && errors.name
                        ? "border-red-500 focus:border-red-500"
                        : touched.name && !errors.name && formData.name
                          ? "border-green-500 focus:border-green-500"
                          : ""
                    }`}
                  />
                  {touched.name && !errors.name && formData.name && (
                    <HiCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                  )}
                  {touched.name && errors.name && (
                    <HiX className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
                  )}
                </div>
                {touched.name && errors.name && (
                  <p className="mt-1.5 text-[13px] text-red-400 flex items-center gap-1">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="text-left">
                <label
                  htmlFor="newsletter-email"
                  className="block text-sm font-medium text-[var(--color-text-muted)] mb-1"
                >
                  Email *
                </label>
                <div className="relative">
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading || !!user}
                    readOnly={!!user}
                    className={`glass-input w-full rounded-xl px-4 py-3 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-60 ${
                      touched.email && errors.email
                        ? "border-red-500 focus:border-red-500"
                        : touched.email && !errors.email && formData.email
                          ? "border-green-500 focus:border-green-500"
                          : ""
                    }`}
                  />
                  {touched.email && !errors.email && formData.email && (
                    <HiCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                  )}
                  {touched.email && errors.email && (
                    <HiX className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
                  )}
                </div>
                {touched.email && errors.email && (
                  <p className="mt-1.5 text-[13px] text-red-400 flex items-center gap-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Age and Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-left">
                <label
                  htmlFor="newsletter-age"
                  className="block text-sm font-medium text-[var(--color-text-muted)] mb-1"
                >
                  Age *
                </label>
                <div className="relative">
                  <input
                    id="newsletter-age"
                    name="age"
                    type="number"
                    min="19"
                    max="150"
                    placeholder="Your age (must be 19+)"
                    value={formData.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    className={`glass-input w-full rounded-xl px-4 py-3 pr-10 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
                      touched.age && errors.age
                        ? "border-red-500 focus:border-red-500"
                        : touched.age && !errors.age && formData.age
                          ? "border-green-500 focus:border-green-500"
                          : ""
                    }`}
                  />
                  {touched.age && !errors.age && formData.age && (
                    <HiCheck className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                  )}
                  {touched.age && errors.age && (
                    <HiX className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
                  )}
                </div>
                {touched.age && errors.age && (
                  <p className="mt-1.5 text-[13px] text-red-400 flex items-center gap-1">
                    {errors.age}
                  </p>
                )}
              </div>
              <div className="text-left">
                <label
                  htmlFor="newsletter-phone"
                  className="block text-sm font-medium text-[var(--color-text-muted)] mb-1"
                >
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    id="newsletter-phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    className={`glass-input w-full rounded-xl px-4 py-3 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
                      touched.phone && errors.phone
                        ? "border-red-500 focus:border-red-500"
                        : touched.phone && !errors.phone && formData.phone
                          ? "border-green-500 focus:border-green-500"
                          : ""
                    }`}
                  />
                  {touched.phone && !errors.phone && formData.phone && (
                    <HiCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                  )}
                  {touched.phone && errors.phone && (
                    <HiX className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
                  )}
                </div>
                {touched.phone && errors.phone && (
                  <p className="mt-1.5 text-[13px] text-red-400 flex items-center gap-1">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="text-left mt-2">
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                Liked Categories (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <label
                    key={category}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.likedCategories.includes(category)
                        ? "bg-[var(--color-accent)] text-white"
                        : "bg-[var(--color-glass-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-accent)]/20"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.likedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      disabled={loading}
                      className="sr-only"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              All the newly updated giftcards will reach you with no time.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="glass-cta mt-4 min-h-[48px] rounded-full px-8 py-3 text-[16px] font-medium text-white transition disabled:opacity-60"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
