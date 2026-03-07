import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-section-bg)] px-4 py-12 sm:px-6 md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-8 cursor-pointer"
        >
          <HiArrowLeft className="h-5 w-5" />
          <span>Back to Registration</span>
        </Link>

        <div className="glass-panel rounded-2xl p-6 sm:p-10 md:p-12">
          <h1 className="apple-display text-[var(--color-text)] text-3xl sm:text-4xl">
            Terms & Conditions
          </h1>
          <p className="apple-body mt-3 text-[var(--color-text-muted)]">
            Last updated: March 2026
          </p>

          <div className="mt-10 space-y-8">
            {/* Section 1: Acceptance of Terms */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                By creating an account with Card Vault, you acknowledge that you
                have read, understood, and agree to be bound by these Terms &
                Conditions. If you do not agree to these terms, please do not
                use our services.
              </p>
            </section>

            {/* Section 2: Account Registration */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                2. Account Registration
              </h2>
              <ul className="space-y-3 text-[var(--color-text-muted)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You must provide accurate and complete information during
                  registration
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You are responsible for maintaining the confidentiality of
                  your account credentials
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You must be at least 18 years old to create an account
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You agree to accept responsibility for all activities that
                  occur under your account
                </li>
              </ul>
            </section>

            {/* Section 3: Products and Services */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                3. Products & Services
              </h2>
              <ul className="space-y-3 text-[var(--color-text-muted)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  All digital gift cards and products are delivered
                  electronically upon successful payment
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  Product images are for illustration purposes only and may not
                  represent the actual product
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  We reserve the right to modify, suspend, or discontinue any
                  product or service at any time
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  Prices are subject to change without prior notice
                </li>
              </ul>
            </section>

            {/* Section 4: Payment and Billing */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                4. Payment & Billing
              </h2>
              <ul className="space-y-3 text-[var(--color-text-muted)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  All payments are processed securely through our authorized
                  payment providers
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You agree to provide valid payment information and authorize
                  us to charge the total amount
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  In case of payment failure, your order will not be processed
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You are responsible for any applicable taxes associated with
                  your purchases
                </li>
              </ul>
            </section>

            {/* Section 5: No Refund Policy */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                5. No Refund Policy
              </h2>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                <p className="text-[var(--color-text)] font-medium mb-3">
                  All purchases are final and non-refundable
                </p>
                <ul className="space-y-3 text-[var(--color-text-muted)]">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    Once a transaction is completed, no refunds will be issued
                    under any circumstances
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    This includes but is not limited to: accidental purchases,
                    change of mind, or failure to use the product
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    Digital gift cards and digital products cannot be returned
                    or exchanged
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    If you encounter issues with a gift card, please contact our
                    support team for assistance rather than a refund
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    By completing your purchase, you acknowledge and accept this
                    no refund policy
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6: User Conduct */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                6. User Conduct
              </h2>
              <ul className="space-y-3 text-[var(--color-text-muted)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You agree to use our services only for lawful purposes
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You will not engage in any activity that interferes with or
                  disrupts our services
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You will not attempt to gain unauthorized access to any part
                  of our platform
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You will not reproduce, distribute, or exploit any content
                  without permission
                </li>
              </ul>
            </section>

            {/* Section 7: Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                7. Intellectual Property
              </h2>
              <ul className="space-y-3 text-[var(--color-text-muted)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  All content, trademarks, and materials on this platform are
                  owned by Card Vault
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You may not use, copy, or distribute our intellectual property
                  without prior written consent
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  User-generated content remains your property, but you grant us
                  license to use it
                </li>
              </ul>
            </section>

            {/* Section 8: Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                8. Limitation of Liability
              </h2>
              <ul className="space-y-3 text-[var(--color-text-muted)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  Our services are provided "as is" without any warranties,
                  express or implied
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  We do not guarantee that our services will be uninterrupted or
                  error-free
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  We shall not be liable for any indirect, incidental, or
                  consequential damages
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  Our total liability shall not exceed the amount paid for the
                  specific product or service
                </li>
              </ul>
            </section>

            {/* Section 9: Privacy and Data Protection */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                9. Privacy & Data Protection
              </h2>
              <ul className="space-y-3 text-[var(--color-text-muted)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  We collect and process your personal data in accordance with
                  our Privacy Policy
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  By using our services, you consent to the collection and use
                  of your information as described
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  We implement appropriate security measures to protect your
                  data
                </li>
              </ul>
            </section>

            {/* Section 10: Account Termination */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                10. Account Termination
              </h2>
              <ul className="space-y-3 text-[var(--color-text-muted)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  We reserve the right to suspend or terminate your account at
                  any time for violations of these terms
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  You may delete your account at any time by contacting our
                  support team
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                  Upon termination, all data associated with your account will
                  be deleted
                </li>
              </ul>
            </section>

            {/* Section 11: Changes to Terms */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                11. Changes to These Terms
              </h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                We reserve the right to modify these Terms & Conditions at any
                time. Any changes will be posted on this page with an updated
                "Last updated" date. Your continued use of our services after
                any changes constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Section 12: Contact Information */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                12. Contact Information
              </h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
                If you have any questions about these Terms & Conditions, please
                contact us:
              </p>
              <div className="bg-[var(--color-section-bg)] rounded-xl p-5 border border-[var(--color-glass-border)]">
                <p className="text-[var(--color-text)]">
                  <strong>Card Vault Support Team</strong>
                </p>
                <Link
                  to="/contact"
                  className="apple-link mt-2 inline-block cursor-pointer"
                >
                  Contact Page
                </Link>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--color-glass-border)]">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 glass-cta min-h-[44px] px-8 rounded-full py-3.5 text-[16px] font-medium text-white cursor-pointer"
            >
              I Agree - Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
