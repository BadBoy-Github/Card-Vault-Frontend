import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: "The Ultimate Destination",
    subtitle: "For Digital Gift Cards",
    description:
      "Premium gaming, entertainment & shopping cards with instant delivery",
    cta: "Browse gift cards",
    link: "/#gift-cards",
  },
  {
    id: 2,
    title: "Secure Payments",
    subtitle: "UPI Transaction",
    description: "Safe and secure transactions for your peace of mind",
    cta: "View all cards",
    link: "/#gift-cards",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      className="relative py-10"
      style={{ height: "80vh", minHeight: "500px" }}
    >
      <div className="container-wide h-full flex items-center">
        <div className="relative overflow-hidden rounded-3xl glass-strong border border-[var(--color-glass-border)] p-8 md:p-12 w-full h-full flex items-center transition-all duration-500 ease-in-out">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[var(--color-accent)]/5 blur-3xl animate-pulse" />
            <div
              className="absolute -left-40 -bottom-40 h-96 w-96 rounded-full bg-[var(--color-accent)]/5 blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          {/* Slide content */}
          <div className="relative z-10 flex flex-col items-center text-center w-full animate-fade-in">
            <h2 className="apple-hero text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-1">
              {CAROUSEL_SLIDES[currentSlide].title}
            </h2>
            <p className="apple-body text-base md:text-lg text-[var(--color-accent)] font-semibold mb-2">
              {CAROUSEL_SLIDES[currentSlide].subtitle}
            </p>
            <p className="apple-body text-sm md:text-base text-[var(--color-text-muted)] mb-4 max-w-md">
              {CAROUSEL_SLIDES[currentSlide].description}
            </p>
            <a
              href={CAROUSEL_SLIDES[currentSlide].link}
              className="bg-[var(--color-accent)] px-5 py-3 rounded-full inline-flex items-center gap-2 text-[15px] font-medium"
            >
              {CAROUSEL_SLIDES[currentSlide].cta}
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          {/* Navigation dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {CAROUSEL_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-[var(--color-accent)] w-10 md:w-12"
                    : "bg-[var(--color-text-muted)]/40 hover:bg-[var(--color-text-muted)]/60 hover:scale-110"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow navigation */}
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length,
              )
            }
            className="absolute cursor-pointer border border-[var(--color-text-muted)]/20 left-3 md:left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-[var(--color-glass-bg)]/80 hover:bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-text)] hover:text-white transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute cursor-pointer border border-[var(--color-text-muted)]/20 right-3 md:right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-[var(--color-glass-bg)]/80 hover:bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-text)] hover:text-white transition-all duration-300"
            aria-label="Next slide"
          >
            <svg
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
