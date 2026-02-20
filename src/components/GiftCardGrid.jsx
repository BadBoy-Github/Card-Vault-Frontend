import { giftCards } from '../data'
import GiftCard from './GiftCard'

const DISPLAY_COUNT = 4
const displayedCards = giftCards.slice(0, DISPLAY_COUNT)

export default function GiftCardGrid() {
  return (
    <section id="gift-cards" className="flex flex-1 flex-col section-padding">
      <div className="container-wide">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="apple-display text-[var(--color-text)]">
            Choose a gift card
          </h2>
          <p className="apple-body mt-2 px-2 text-[15px] sm:mt-3 sm:text-[17px] md:text-[19px]">
            All cards are delivered digitally. Pick one and go.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {displayedCards.map((card) => (
            <GiftCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
