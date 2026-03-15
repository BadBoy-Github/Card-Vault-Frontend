import SEO from "./SEO";

export default function Hero() {
  return (
    <>
      <SEO
        title="Buy Digital Gift Cards Online - Instant Delivery"
        description="Card Vault (card-vault, card vaults, card-vaults) - Your #1 destination for digital gift cards. Shop premium gaming, entertainment & shopping gift cards with instant email delivery. Secure UPI & card payments. 100+ brands at Card Vault."
        keywords="card vault, card-vault, card vaults, card-vaults, buy gift cards online, digital gift cards, gaming gift cards, steam gift card, playstation gift card, xbox gift card, instant gift card delivery"
      />
      <section className="hero-viewport relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-[var(--color-accent)]/10 blur-[120px] animate-pulse-slow" />
          <div
            className="absolute -right-[10%] -bottom-[10%] h-[400px] w-[400px] rounded-full bg-[var(--color-accent)]/5 blur-[100px] animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="container-wide text-center">
          {/* H1 - Primary SEO Target for "card vault" keyword */}
          <h1 className="apple-hero mb-4 text-[var(--color-text)] sm:mb-5 md:mb-6">
            The Ultimate{" "}
            <span className="text-[var(--color-accent)]">Card Vault</span> for
            Digital Gift Cards
          </h1>
          {/* H2 - Supporting keyword */}
          <h2 className="sr-only">
            Buy Gift Cards Online - Instant Digital Delivery - Card Vault
          </h2>
          <p className="apple-body mx-auto max-w-[600px] px-1 text-[15px] sm:text-[17px] md:text-[19px]">
            High-grade digital assets for the discerning spender. We provide the
            cards, you provide the excuse to buy another one.
          </p>
          <p className="apple-body mx-auto mt-2 max-w-[600px] px-1 text-[15px] sm:text-[17px] md:text-[19px]">
            Pick a card. Any card. We know you want to.
          </p>
          <a
            href="#gift-cards"
            className="apple-link mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-medium sm:mt-8 sm:text-[17px]"
          >
            Browse gift cards
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
      </section>
    </>
  );
}
