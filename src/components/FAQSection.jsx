import { useState } from "react";
import { HiChevronDown, HiQuestionMarkCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

import { FaAngleRight } from "react-icons/fa6";

const faqs = [
  {
    id: 1,
    question: "How does digital delivery work?",
    answer:
      "Once your payment is verified, you'll receive your gift card code instantly via email and on your dashboard. Most codes are delivered within 5-15 minutes after UTR verification.",
  },
  {
    id: 2,
    question: "What is UTR and why do I need to submit it?",
    answer:
      "UTR (Unique Transaction Reference) is a 12-16 digit number that identifies your payment. We need this to verify your payment was successful before delivering your gift card.",
  },
  {
    id: 3,
    question: "How long does verification take?",
    answer:
      "Our team verifies UTR submissions during business hours (8 AM - 8 PM). Most verifications are completed within 15-30 minutes. You'll receive an email once verified.",
  },
  {
    id: 4,
    question: "Can I get a refund?",
    answer:
      "Yes! If your payment is verified but we can't deliver the gift card, you'll receive a full refund within 3-5 business days. We also offer refunds for duplicate payments.",
  },
  {
    id: 5,
    question: "Are the gift cards 100% authentic?",
    answer:
      "Absolutely. All gift cards are sourced directly from authorized distributors. We guarantee 100% authenticity on every card sold.",
  },
  {
    id: 6,
    question: "What if my card doesn't work?",
    answer:
      "Contact us immediately! We'll help troubleshoot or replace any non-working cards. We're here to make sure you get a working card or your money back.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="section-padding-lg" aria-labelledby="faq-heading">
      <div className="container-wide">
        <div className="mb-10 text-center sm:mb-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
            <HiQuestionMarkCircle className="h-7 w-7 text-[var(--color-accent)]" />
          </div>
          <h2
            id="faq-heading"
            className="apple-display text-[var(--color-text)]"
          >
            Frequently Asked Questions
          </h2>
          <p className="apple-body mx-auto mt-2 max-w-[500px] px-2 text-[15px] sm:mt-3 sm:text-[17px]">
            Got questions? We've got answers. Can't find what you're looking
            for?{" "}
            <Link
              to="/#contact"
              className="apple-link inline-flex justify-center gap-1 items-center text-[15px] sm:text-[16px]"
            >
              Hit us up.
              <FaAngleRight />
            </Link>
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="glass-panel overflow-hidden rounded-xl transition-all duration-300"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                aria-expanded={openId === faq.id}
                aria-controls={`faq-content-${faq.id}`}
              >
                <span className="text-[15px] font-medium text-[var(--color-text)] sm:text-[16px]">
                  {faq.question}
                </span>
                <HiChevronDown
                  className={`h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform duration-300 ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={`faq-content-${faq.id}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openId === faq.id
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 pb-4 text-[14px] leading-relaxed text-[var(--color-text-muted)] sm:px-6 sm:pb-5 sm:text-[15px]">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className=""></div>
      </div>
    </section>
  );
}
