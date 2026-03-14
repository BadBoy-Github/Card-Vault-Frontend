import { Link } from 'react-router-dom'

const features = [
  {
    id: 'support',
    title: 'Customer Therapy',
    description: 'Our specialists are here to listen to your problems from 8 AM to 8 PM. Mostly related to cards, hopefully.',
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5a5 5 0 100-10 5 5 0 000 10z" />
      </svg>
    ),
  },
  {
    id: 'genuine',
    title: 'Genuinely Genuine',
    description: 'Sourced from the most authorized of providers. No back-alley deals here, we promise.',
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'trust',
    title: 'Fort Knox Security',
    description: 'Encryption so thick even we can\'t see what you\'re buying. Your secrets are safe in the vault.',
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    id: 'instant',
    title: 'Faster Than Regret',
    description: 'Delivered to your account before you can even think "should I have bought that?" Yes, you should.',
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

export default function FeaturedSection() {
  return (
    <section
      className="section-padding-lg mt-28"
      aria-labelledby="featured-heading"
    >
      <div className="container-wide">
        <div className="mb-8 text-center sm:mb-12">
          <h2
            id="featured-heading"
            className="apple-display text-[var(--color-text)]"
          >
            Why Trust the Vault?
          </h2>
          <p className="apple-body mx-auto mt-2 max-w-[600px] px-2 text-[15px] sm:mt-3 sm:text-[17px] md:text-[19px]">
            We provide a premium experience for people who value their time (and
            their gift cards).
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="glass-panel group flex flex-col items-center rounded-[32px] p-8 text-center transition-all hover:scale-[1.02]"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[var(--color-accent)]/10 text-[var(--color-accent)] sm:h-20 sm:w-20">
                {feature.icon}
              </div>
              <h3 className="line-clamp-1 text-[19px] font-bold text-[var(--color-text)]">
                {feature.title}
              </h3>
              <p className="apple-body mt-3 text-[15px] leading-relaxed text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
