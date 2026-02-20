/**
 * Gift card catalog data for Card Vault
 */

export const giftCards = [
  {
    id: 'gc-7',
    brand: 'Xbox',
    name: 'Xbox Gift Card',
    denomination: '$25',
    value: 25,
    currency: 'USD',
    category: 'gaming',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=250&fit=crop',
    description: 'Games, add-ons, and subscriptions on Xbox.',
    inStock: true,
    popular: false,
  },
]


export function getGiftCardById(id) {
  return giftCards.find((card) => card.id === id) ?? null
}
