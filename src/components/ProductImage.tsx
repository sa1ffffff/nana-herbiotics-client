import type { Product } from '../data/products'

interface Props {
  product: Product
  sizes?: string
  eager?: boolean
  className?: string
}

/** Built-in products ship as local /products/<id>.webp + <id>-500.webp; an admin
 *  product's image is a full Supabase Storage URL, with no size variants. */
const isRemote = (src: string) => /^https?:\/\//.test(src)

export function ProductImage({ product, sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw', eager, className = '' }: Props) {
  if (isRemote(product.image)) {
    return (
      <img
        src={product.image}
        alt={product.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    )
  }

  return (
    <img
      src={`${product.image}-500.webp`}
      srcSet={`${product.image}-500.webp 500w, ${product.image}.webp 1000w`}
      sizes={sizes}
      width={1000}
      height={1000}
      alt={product.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
}
