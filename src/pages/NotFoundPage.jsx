import { Link } from "react-router-dom";
import { HiExclamation } from "react-icons/hi";

export default function NotFoundPage() {
  return (
    <div className="container-wide flex flex-col py-6 sm:py-8 mt-20">
      <div className="glass-panel mx-auto flex w-full max-w-5xl flex-col items-center justify-center rounded-[40px] p-6 text-center">
        <div className="mb-4 flex justify-center sm:mb-6">
          <div className="relative">
            <HiExclamation className="text-5xl sm:text-7xl text-[var(--color-accent)] animate-pulse" />
          </div>
        </div>

        <h1 className="apple-display mb-3 text-[var(--color-text)] sm:mb-5">
          404 - Page Not Found
        </h1>

        <div className="max-w-lg mx-auto">
          <p className="apple-body mb-4 text-[16px] leading-relaxed sm:text-[18px]">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="glass-cta inline-flex items-center gap-3 rounded-2xl bg-[var(--color-accent)] px-8 py-3 text-[17px] font-semibold text-white transition-all hover:scale-105 active:scale-95 sm:px-10 sm:py-4 sm:text-[18px]"
        >
          Go to Vault
        </Link>
      </div>
    </div>
  );
}
