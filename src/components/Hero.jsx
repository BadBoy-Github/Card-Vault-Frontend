export default function Hero() {
  return (
    <section className="hero-viewport relative overflow-hidden">
      <div className="container-wide text-center">
        <h1 className="apple-hero mb-4 text-[var(--color-text)] sm:mb-5 md:mb-6">
          Gift cards.{' '}
          <span className="text-[var(--color-accent)]">
            Delivered instantly.
          </span>
        </h1>
        <p className="apple-body mx-auto max-w-[600px] px-1 text-[15px] sm:text-[17px] md:text-[19px]">
          Premium digital gift cards from top brands. Secure, fast, and ready to use.
        </p>
        <p className="apple-body mx-auto mt-2 max-w-[600px] px-1 text-[15px] sm:text-[17px] md:text-[19px]">
          Pick a card and treat yourself or someone special.
        </p>
        <a
          href="#gift-cards"
          className="apple-link mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-medium sm:mt-8 sm:text-[17px]"
        >
          Browse gift cards
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  )
}
