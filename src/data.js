/**
 * Gift card catalog data for Card Vault
 */

export const giftCards = [
  {
    id: '01010101',
    brand: 'Croma',
    name: 'Croma Gift Card',
    denomination: 'Rs.400',
    value: 400,
    currency: 'INR',
    category: 'apps',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=250&fit=crop',
    description: 'Redeem for the latest electronics, appliances, and gadgets at any Croma store.',
    price: 400.00,
    createdDateTime: '2026-02-20T10:00:00Z',
    validityEndDateTime: '2027-02-20T23:59:59Z',
    inStock: true,
    stock: 1,
    popular: false,
  },
]


export function getGiftCardById(id) {
  return giftCards.find((card) => card.id === id) ?? null
}
