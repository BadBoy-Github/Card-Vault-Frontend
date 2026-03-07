import { useToast } from "../context/ToastContext";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiXCircle,
  HiX,
} from "react-icons/hi";

const icons = {
  success: HiCheckCircle,
  error: HiXCircle,
  warning: HiExclamationCircle,
  info: HiInformationCircle,
};

const colors = {
  success: "text-green-500 bg-green-500/10 border-green-500/30",
  error: "text-red-500 bg-red-500/10 border-red-500/30",
  warning: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  info: "text-blue-500 bg-blue-500/10 border-blue-500/30",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || icons.info;
        const colorClass = colors[toast.type] || colors.info;

        return (
          <div
            key={toast.id}
            className={`glass-panel flex items-center gap-3 rounded-xl px-4 py-3 border ${colorClass} animate-slide-in-right`}
            role="alert"
          >
            <Icon className="h-5 w-5 shrink-0" />
            <p className="flex-1 text-[14px] font-medium text-[var(--color-text)]">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition"
              aria-label="Dismiss"
            >
              <HiX className="h-4 w-4 text-[var(--color-text-muted)]" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
