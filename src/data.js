/**
 * Gift card catalog data for Card Vault
 */

export const giftCards = [
  {
    id: 'gc-1',
    brand: 'PlayStation',
    name: 'PSN Store Credit',
    denomination: '$50',
    value: 50,
    currency: 'USD',
    category: 'gaming',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=250&fit=crop',
    description: 'Purchase games, DLC, and subscriptions on the PlayStation Store.',
    price: 50.00,
    createdDateTime: '2026-02-20T10:00:00Z',
    validityEndDateTime: '2027-02-20T23:59:59Z',
    inStock: true,
    stock: 5,
    popular: true,
  },
  {
    id: 'gc-2',
    brand: 'Amazon',
    name: 'Amazon Gift Card',
    denomination: '$100',
    value: 100,
    currency: 'USD',
    category: 'shopping',
    image: 'https://images.unsplash.com/photo-1523474253046-2cd2c78a9df1?w=400&h=250&fit=crop',
    description: 'Shop millions of items storewide on Amazon.com.',
    price: 100.00,
    createdDateTime: '2026-02-20T10:00:00Z',
    validityEndDateTime: '2028-02-20T23:59:59Z',
    inStock: true,
    stock: 2,
    popular: true,
  },
  {
    id: 'gc-3',
    brand: 'Apple',
    name: 'App Store & iTunes',
    denomination: '$20',
    value: 20,
    currency: 'USD',
    category: 'apps',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=250&fit=crop',
    description: 'Get apps, games, music, movies, and TV shows on all Apple devices.',
    price: 20.00,
    createdDateTime: '2026-02-20T10:00:00Z',
    validityEndDateTime: '2027-02-20T23:59:59Z',
    inStock: true,
    stock: 1,
    popular: false,
  },
  {
    id: 'gc-4',
    brand: 'Netflix',
    name: 'Netflix Subscription',
    denomination: '$30',
    value: 30,
    currency: 'USD',
    category: 'streaming',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=250&fit=crop',
    description: 'Unlimited movies, TV shows, and more on your Netflix account.',
    price: 30.00,
    createdDateTime: '2026-02-20T10:00:00Z',
    validityEndDateTime: '2027-02-20T23:59:59Z',
    inStock: false,
    stock: 0,
    popular: false,
  },
]


export function getGiftCardById(id) {
  return giftCards.find((card) => card.id === id) ?? null
}
