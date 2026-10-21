import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import { formatPKR } from '../lib/shop'
import { useCart } from '../store/cart'
import { Corners } from './Ornaments'
import { ProductImage } from './ProductImage'
import { QtyStepper } from './QtyStepper'
import { useTilt } from '../lib/useTilt'
import { useProductRating } from '../lib/reviews'
import { Stars } from './Stars'

/** Products shot in the studio have extra white margin, so they can fill the well more. */
const STUDIO = new Set(['herbal-shampoo', 'hibiscus-shampoo', 'herbal-conditioner', 'herbal-body-wash', 'herbal-face-wash'])

export function AddButton({ onAdd, label = 'Add to cart', className = '' }: { onAdd: () => void; label?: string; className?: string }) {
  const [added, setAdded] = useState(false)
  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 1400)
    return () => clearTimeout(t)
  }, [added])
  return (
    <button
      type="button"
      onClick={() => {
        onAdd()
        setAdded(true)
      }}
      className={`press relative h-12 overflow-hidden rounded-full px-4 text-[15px] font-semibold transition-all duration-300 ${
        added
          ? 'bg-gold text-forest-deep shadow-[0_4px_16px_-4px_rgb(200_162_74/0.5)]'
          : 'bg-forest text-ivory shadow-[0_2px_8px_-2px_rgb(14_32_24/0.3)] hover:bg-forest-deep hover:shadow-[0_4px_16px_-4px_rgb(14_32_24/0.5)]'
      } ${className}`}
    >
      {/* Crossfade with a little blur so the label swap reads as one morph */}
      <span className={`block transition-[opacity,filter,transform] duration-250 ease-[var(--ease-out)] ${added ? 'scale-95 opacity-0 blur-[3px]' : 'opacity-100'}`}>
        {label}
      </span>
      <span
        aria-hidden={!added}
        className={`absolute inset-0 flex items-center justify-center gap-1.5 transition-[opacity,filter,transform] duration-250 ease-[var(--ease-out)] ${added ? 'opacity-100' : 'scale-95 opacity-0 blur-[3px]'}`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
        Added
      </span>
    </button>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const add = useCart((s) => s.add)
  const setQuickView = useCart((s) => s.setQuickView)
  const tilt = useTilt<HTMLButtonElement>({ max: 5, response: 0.4 })

  return (
    <article className="card-glow group flex w-full flex-col rounded-[22px] bg-white text-ink p-2 shadow-[0_1px_2px_rgba(14,32,24,0.04),0_12px_36px_-16px_rgba(14,32,24,0.2)] sm:p-2.5">
      {/* Image well with tilt */}
      <button
        type="button"
        ref={tilt}
        onClick={() => setQuickView(product.id)}
        className="tilt-flat relative block aspect-[4/5] overflow-hidden rounded-[16px] bg-gradient-to-b from-white to-ivory-warm ring-1 ring-gold/20 ring-inset"
        aria-label={`Quick view: ${product.name}`}
      >
        <ProductImage product={product} className={`zoom-img h-full w-full object-cover ${STUDIO.has(product.id) ? 'scale-[1.18]' : ''}`} />
        <Corners />
        <span className="tilt-sheen absolute inset-0" aria-hidden />
        {/* Size pill */}
        <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-forest/90 px-3 py-1 text-[11px] font-medium tracking-wider text-gold-light uppercase backdrop-blur-sm sm:bottom-3 sm:text-xs">
          {product.size}
        </span>
        {/* Quick view hint on hover */}
        <span className="absolute inset-0 flex items-center justify-center bg-forest-deep/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full border border-gold/50 bg-forest/80 px-4 py-2 text-xs font-semibold text-gold-light">
            Quick view
          </span>
        </span>
      </button>

      {/* Card info */}
      <div className="flex flex-1 flex-col gap-1.5 px-2 pb-2 pt-3.5 text-center sm:gap-2 sm:px-3 sm:pb-3 sm:pt-4">
        <h3 className="font-display text-[15px] font-semibold leading-tight text-forest text-balance sm:text-lg">
          <button
            type="button"
            onClick={() => setQuickView(product.id)}
            className="transition-colors hover:text-gold hover:underline hover:decoration-gold/40 hover:underline-offset-4"
          >
            {product.name}
          </button>
        </h3>
        <ProductRating id={product.id} />
        <p className="line-clamp-2 text-[13px] leading-snug text-ink/60 sm:text-[15px] sm:leading-relaxed">{product.short}</p>
        <p className="mt-auto pt-1 text-lg font-bold text-forest tabular-nums sm:text-xl">{formatPKR(product.price)}</p>
        <div className="flex items-center gap-2 pt-1">
          <div className="hidden sm:block">
            <QtyStepper value={qty} onChange={setQty} label={product.name} />
          </div>
          <AddButton
            className="flex-1"
            onAdd={() => {
              add(product.id, qty)
              setQty(1)
            }}
          />
        </div>
      </div>
    </article>
  )
}

export function ProductRating({ id, className = 'justify-center' }: { id: string; className?: string }) {
  const r = useProductRating(id)
  if (!r) return null
  const [avg, n] = r.split('|')
  return (
    <a href="#reviews" className={`flex items-center gap-1.5 text-xs text-ink/60 hover:text-forest ${className}`}>
      <Stars value={Number(avg)} size={14} className="text-ink" />
      <span className="tabular-nums">({n})</span>
    </a>
  )
}
