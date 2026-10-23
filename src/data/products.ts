import { useAdminProducts } from '../store/admin-products'

export type Category = 'shampoos' | 'hair-care' | 'skin-care' | 'soaps'

export interface Product {
  id: string
  name: string
  category: Category
  size: string
  price: number
  short: string
  long: string
  ingredients: string[]
  badges: string[]
  image: string
  alt: string
}

const img = (name: string) => `/products/${name}`

const HAIR_BADGES = ['Paraben free', 'Sulfate free', '100% herbal', 'Safe for all hair types']

export const products: Product[] = [
  {
    id: 'herbal-shampoo',
    name: 'Herbal Shampoo',
    category: 'shampoos',
    size: '200 ml',
    price: 1599,
    short: 'Infused with 27+ herbs. Natural, gentle, effective.',
    long: 'Our everyday shampoo, infused with more than 27 herbs. It cleans gently without stripping, for healthier, stronger and shinier hair.',
    ingredients: ['27+ herbs', 'Botanical extracts'],
    badges: HAIR_BADGES,
    image: img('herbal-shampoo'),
    alt: 'Nana Herbiotics Herbal Shampoo, 200 ml white pump bottle with a green and gold label',
  },
  {
    id: 'hibiscus-shampoo',
    name: 'Hibiscus Shampoo',
    category: 'shampoos',
    size: '200 ml',
    price: 1599,
    short: 'Hibiscus flowers with Vitamin B12 and Vitamin E.',
    long: 'Infused with hibiscus flowers, Vitamin B12 and Vitamin E. Natural, gentle, effective hair care for healthier, stronger and shinier hair.',
    ingredients: ['Hibiscus flowers', 'Vitamin B12', 'Vitamin E'],
    badges: HAIR_BADGES,
    image: img('hibiscus-shampoo'),
    alt: 'Nana Herbiotics Hibiscus Shampoo, 200 ml black pump bottle with a hibiscus flower on the label',
  },
  {
    id: 'herbal-conditioner',
    name: 'Herbal Conditioner',
    category: 'hair-care',
    size: '200 ml',
    price: 1499,
    short: 'Natural botanical extracts to nourish and strengthen.',
    long: 'Enriched with natural botanical extracts to nourish and strengthen hair. Use after either shampoo for softer, smoother lengths.',
    ingredients: ['Natural botanical extracts'],
    badges: ['Paraben free', '100% herbal'],
    image: img('herbal-conditioner'),
    alt: 'Nana Herbiotics Herbal Conditioner, 200 ml clear pump bottle with a creamy conditioner inside',
  },
  {
    id: 'herbal-face-wash',
    name: 'Herbal Face Wash',
    category: 'skin-care',
    size: '150 ml',
    price: 1200,
    short: 'Cleanse, brighten, nourish.',
    long: 'Cleanse, brighten, nourish. A special herbal formula made for brightening skin, gentle enough for every day.',
    ingredients: ['Botanical extracts'],
    badges: ['Paraben free', 'Gentle daily use'],
    image: img('herbal-face-wash'),
    alt: 'Nana Herbiotics Herbal Face Wash, 150 ml blue-tinted pump bottle with a green and gold label',
  },
  {
    id: 'herbal-body-wash',
    name: 'Herbal Body Wash',
    category: 'skin-care',
    size: '300 ml',
    price: 899,
    short: 'Chamomile, green tea and neem. Cleanse, nourish, refresh.',
    long: 'Cleanse, nourish, refresh. Made with natural botanical extracts such as chamomile, green tea and neem. Suitable for all skin types.',
    ingredients: ['Chamomile', 'Green tea', 'Neem'],
    badges: ['Paraben free', 'All skin types'],
    image: img('herbal-body-wash'),
    alt: 'Nana Herbiotics Herbal Body Wash, 300 ml clear bottle of green gel with a green and gold label',
  },
  {
    id: 'brightening-serum',
    name: 'Acne Removal Brightening Serum',
    category: 'skin-care',
    size: '50 ml',
    price: 1099,
    short: 'Radiant, even tone, healthy glow.',
    long: 'A botanical serum with rose for acne-prone skin. A few drops help calm breakouts and bring out a radiant, even tone and a healthy glow.',
    ingredients: ['Rose', 'Botanical extracts'],
    badges: ['Radiant', 'Even tone', 'Healthy glow'],
    image: img('brightening-serum'),
    alt: 'Nana Herbiotics Brightening Serum, 50 ml matte black dropper bottle with a rose on the green and gold label',
  },
  {
    id: 'acne-soap',
    name: 'Herbal Acne Soap',
    category: 'soaps',
    size: '1 bar',
    price: 549,
    short: 'Handmade herbal bar for acne-prone skin.',
    long: 'A handmade herbal bar for acne-prone skin, stamped with a leaf. It cleanses gently and helps keep skin clear.',
    ingredients: ['Herbal blend'],
    badges: ['Handmade'],
    image: img('soap-acne'),
    alt: 'Round dark green handmade Herbal Acne Soap stamped with a leaf',
  },
  {
    id: 'brightening-soap',
    name: 'Herbal Brightening Soap',
    category: 'soaps',
    size: '1 bar',
    price: 499,
    short: 'Handmade bars for a brighter, softer glow. Each one is unique.',
    long: 'Handmade botanical bars for a brighter, softer glow. They come in several designs (honeycomb, flower, mosaic and more) and every bar is a little different. Tell us your favourite design in the order notes.',
    ingredients: ['Botanical blend'],
    badges: ['Handmade', 'Each bar unique'],
    image: img('soap-collection'),
    alt: 'A collection of handmade Herbal Brightening Soaps in honeycomb, lavender flower, mosaic and other designs',
  },
]

/**
 * Returns all products: built-in + admin-added. Pass the admin list from the
 * `useAdminProducts` store when a component already has it (most do, via a hook,
 * so it re-renders when products change); otherwise this reads the store's current
 * state directly, which is always in sync with what the store last loaded.
 */
export function getAllProducts(adminProducts?: Product[]): Product[] {
  if (adminProducts) return [...products, ...adminProducts]
  // admin-products.ts imports only this module's *types*, which compile away,
  // so importing its store value back here is not a real runtime cycle.
  return [...products, ...useAdminProducts.getState().products]
}

export const byId = (id: string, adminProducts?: Product[]) =>
  getAllProducts(adminProducts).find((p) => p.id === id)

export const inCategory = (c: Category, adminProducts?: Product[]) =>
  getAllProducts(adminProducts).filter((p) => p.category === c)

