import { useState } from 'react'
import type { Product } from '../data/products'
import { formatPKR } from '../lib/shop'
import { useCart } from '../store/cart'
import { ProductImage } from './ProductImage'
import { QtyStepper } from './QtyStepper'

export function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const add = useCart((s) => s.add)
  const setQuickView = useCart((s) => s.setQuickView)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(14,32,24,0.06),0_8px_24px_-12px_rgba(14,32,24,0.18)]">
      <button
        type="button"
        onClick={() => setQuickView(product.id)}
        className="relative block aspect-square overflow-hidden bg-white"
        aria-label={`Quick view: ${product.name}`}
      >
        <ProductImage product={product} className="zoom-img h-full w-full object-contain" />
        <span className="absolute left-2 top-2 rounded-full bg-forest/90 px-2 py-0.5 text-[11px] font-medium text-gold-light sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
          {product.size}
        </span>
      </button>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-forest/10 p-3 sm:gap-2 sm:p-5">
        <h3 className="font-display text-[15px] font-semibold leading-tight sm:text-lg text-forest">
          <button type="button" onClick={() => setQuickView(product.id)} className="text-left hover:underline hover:underline-offset-4 hover:decoration-gold">
            {product.name}
          </button>
        </h3>
        <p className="line-clamp-2 text-[13px] leading-snug text-ink/70 sm:line-clamp-none sm:text-[15px] sm:leading-relaxed">{product.short}</p>
        <p className="mt-auto pt-1 text-lg font-semibold sm:text-xl text-forest tabular-nums">{formatPKR(product.price)}</p>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <QtyStepper value={qty} onChange={setQty} label={product.name} />
          </div>
          <button
            type="button"
            onClick={() => {
              add(product.id, qty)
              setQty(1)
            }}
            className="press h-11 flex-1 rounded-full bg-forest px-3 text-[15px] font-semibold text-ivory hover:bg-forest-deep"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}
