import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import { formatPKR } from '../lib/shop'
import { useCart } from '../store/cart'
import { Corners } from './Ornaments'
import { ProductImage } from './ProductImage'
import { QtyStepper } from './QtyStepper'

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
      className={`press relative h-11 overflow-hidden rounded-full px-3 text-[15px] font-semibold transition-colors duration-200 ${added ? 'bg-gold text-forest-deep' : 'bg-forest text-ivory hover:bg-forest-deep'} ${className}`}
    >
      {/* Crossfade with a little blur so the label swap reads as one morph */}
      <span className={`block transition-[opacity,filter,transform] duration-200 ease-[var(--ease-out)] ${added ? 'scale-95 opacity-0 blur-[3px]' : 'opacity-100'}`}>
        {label}
      </span>
      <span
        aria-hidden={!added}
        className={`absolute inset-0 flex items-center justify-center gap-1.5 transition-[opacity,filter,transform] duration-200 ease-[var(--ease-out)] ${added ? 'opacity-100' : 'scale-95 opacity-0 blur-[3px]'}`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

  return (
    <article className="group flex w-full flex-col rounded-[20px] bg-white p-1.5 shadow-[0_1px_2px_rgba(14,32,24,0.06),0_12px_32px_-16px_rgba(14,32,24,0.22)] sm:p-2">
      <button
        type="button"
        onClick={() => setQuickView(product.id)}
        className="relative block aspect-[4/5] overflow-hidden rounded-[14px] bg-white ring-1 ring-gold/35 ring-inset"
        aria-label={`Quick view: ${product.name}`}
      >
        <ProductImage product={product} className={`zoom-img h-full w-full object-cover ${STUDIO.has(product.id) ? 'scale-[1.18]' : ''}`} />
        <Corners />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-forest px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-gold-light sm:bottom-3 sm:text-xs">
          {product.size}
        </span>
      </button>
      <div className="flex flex-1 flex-col gap-1.5 px-2 pb-2 pt-3 text-center sm:gap-2 sm:px-3 sm:pb-3 sm:pt-4">
        <h3 className="font-display text-[15px] font-semibold leading-tight text-forest text-balance sm:text-lg">
          <button type="button" onClick={() => setQuickView(product.id)} className="hover:underline hover:decoration-gold hover:underline-offset-4">
            {product.name}
          </button>
        </h3>
        <p className="line-clamp-2 text-[13px] leading-snug text-ink/65 sm:text-[15px] sm:leading-relaxed">{product.short}</p>
        <p className="mt-auto pt-1 text-lg font-semibold text-forest tabular-nums sm:text-xl">{formatPKR(product.price)}</p>
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
