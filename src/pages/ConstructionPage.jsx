import { HiWrenchScrewdriver } from 'react-icons/hi2'

export default function ConstructionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-section-bg)] px-4 py-12 sm:px-6 md:px-8">
      <div className="glass-panel w-full max-w-[500px] overflow-hidden rounded-[32px] p-8 text-center sm:p-12 md:p-16">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[var(--color-accent)]/10 text-[var(--color-accent)] animate-pulse">
          <HiWrenchScrewdriver className="h-12 w-12" />
        </div>
        <h1 className="apple-display mb-4 text-[var(--color-text)]">Under Construction</h1>
        <p className="apple-body text-[17px] leading-relaxed sm:text-[19px]">
          The Card Vault is currently undergoing scheduled maintenance to enhance your experience.
        </p>
        <div className="mt-10 space-y-4">
          <div className="glass-pill mx-auto w-fit rounded-full px-4 py-2 text-[14px] font-medium text-[var(--color-text-muted)]">
            Coming Back Soon
          </div>
          <p className="text-[13px] text-[var(--color-text-muted)] italic">
            Thank you for your patience while we polish our systems.
          </p>
        </div>
      </div>
    </div>
  )
}
