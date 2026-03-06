import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  HiUserCircle,
  HiPencil,
  HiMail,
  HiLockClosed,
  HiCheck,
  HiX,
} from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Form states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFormData({
      ...formData,
      name: user.name || "",
      email: user.email || "",
    });
    setLoading(false);
  }, [user, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters with at least one uppercase, one lowercase, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    if (isEditingName) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
    }

    if (isEditingEmail) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (isChangingPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (!validatePassword(formData.newPassword)) {
        newErrors.newPassword =
          "Password must be at least 8 characters with uppercase, lowercase, and number";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveName = async () => {
    if (!formData.name.trim()) {
      setErrors({ ...errors, name: "Name is required" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: formData.name.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser({ ...user, name: data.name });
        setMessage({ type: "success", text: "Name updated successfully!" });
        setIsEditingName(false);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update name",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSaveEmail = async () => {
    if (!formData.email.trim()) {
      setErrors({ ...errors, email: "Email is required" });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ email: formData.email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser({ ...user, email: data.email });
        setMessage({ type: "success", text: "Email updated successfully!" });
        setIsEditingEmail(false);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update email",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setIsChangingPassword(false);
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to change password",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container-wide flex flex-col py-6 sm:py-8 mt-14 sm:mt-20 px-2 sm:px-4">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="apple-display text-[var(--color-text)] text-2xl sm:text-3xl">
            My Profile
          </h1>
          <p className="apple-body mt-1 text-[14px] sm:text-[15px] text-[var(--color-text-muted)]">
            Manage your account settings
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl p-4 ${
              message.type === "success"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <HiCheck className="text-xl" />
            ) : (
              <HiX className="text-xl" />
            )}
            <p className="text-[14px]">{message.text}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)] text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase() ||
                "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                {user?.name || "User"}
              </h2>
              <p className="text-[14px] text-[var(--color-text-muted)]">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Name Field */}
          <div className="mb-6">
            <label className="mb-2 block text-[13px] font-medium text-[var(--color-text-muted)]">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <HiUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: null });
                  }}
                  disabled={!isEditingName}
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-[15px] text-[var(--color-text)] focus:outline-none disabled:opacity-70"
                />
              </div>
              {isEditingName ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-500 hover:bg-green-500/30 transition disabled:opacity-50"
                  >
                    <HiCheck className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setFormData({ ...formData, name: user?.name || "" });
                      setErrors({ ...errors, name: null });
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 transition"
                  >
                    <HiX className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="flex h-12 items-center gap-2 rounded-xl bg-[var(--color-accent)]/20 px-4 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 transition"
                >
                  <HiPencil className="h-4 w-4" />
                  <span className="text-[14px] font-medium">Edit</span>
                </button>
              )}
            </div>
            {errors.name && (
              <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="mb-2 block text-[13px] font-medium text-[var(--color-text-muted)]">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: null });
                  }}
                  disabled={!isEditingEmail}
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-[15px] text-[var(--color-text)] focus:outline-none disabled:opacity-70"
                />
              </div>
              {isEditingEmail ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEmail}
                    disabled={saving}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-500 hover:bg-green-500/30 transition disabled:opacity-50"
                  >
                    <HiCheck className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingEmail(false);
                      setFormData({ ...formData, email: user?.email || "" });
                      setErrors({ ...errors, email: null });
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 transition"
                  >
                    <HiX className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="flex h-12 items-center gap-2 rounded-xl bg-[var(--color-accent)]/20 px-4 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 transition"
                >
                  <HiPencil className="h-4 w-4" />
                  <span className="text-[14px] font-medium">Edit</span>
                </button>
              )}
            </div>
            {errors.email && (
              <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Section */}
          <div className="border-t border-[var(--color-glass-border)] pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--color-text)]">
                  Change Password
                </h3>
                <p className="text-[13px] text-[var(--color-text-muted)]">
                  Update your password regularly for security
                </p>
              </div>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)]/20 px-4 py-2 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 transition"
              >
                <HiLockClosed className="h-4 w-4" />
                <span className="text-[14px] font-medium">
                  {isChangingPassword ? "Cancel" : "Change"}
                </span>
              </button>
            </div>

            {isChangingPassword && (
              <div className="space-y-4 mt-4">
                {/* Current Password */}
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--color-text-muted)]">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      });
                      setErrors({ ...errors, currentPassword: null });
                    }}
                    className="glass-input w-full rounded-xl px-4 py-3 text-[15px] text-[var(--color-text)] focus:outline-none"
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-[12px] text-red-500">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--color-text-muted)]">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, newPassword: e.target.value });
                      setErrors({ ...errors, newPassword: null });
                    }}
                    placeholder="Min 8 chars, uppercase, lowercase, number"
                    className="glass-input w-full rounded-xl px-4 py-3 text-[15px] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-[12px] text-red-500">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--color-text-muted)]">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      });
                      setErrors({ ...errors, confirmPassword: null });
                    }}
                    className="glass-input w-full rounded-xl px-4 py-3 text-[15px] text-[var(--color-text)] focus:outline-none"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-[12px] text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="glass-cta w-full rounded-xl py-3 text-[15px] font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-6 glass-panel rounded-2xl p-6">
          <h3 className="text-[15px] font-semibold text-[var(--color-text)] mb-3">
            Account Information
          </h3>
          <div className="space-y-2 text-[14px] text-[var(--color-text-muted)]">
            <p>
              Account ID:{" "}
              <span className="font-mono text-[12px]">{user?._id}</span>
            </p>
            <p>
              Member since:{" "}
              <span>
                {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
