import { useEffect, useState } from 'react'
import { byId } from '../data/products'
import { useAdminProducts } from '../store/admin-products'
import { formatPKR } from '../lib/shop'
import { useCart } from '../store/cart'
import { CloseIcon } from './Icons'
import { Overlay } from './Overlay'
import { ProductImage } from './ProductImage'
import { QtyStepper } from './QtyStepper'
import { AddButton, ProductRating } from './ProductCard'
import { useReviewForm } from './Reviews'

export function QuickView() {
  const id = useCart((s) => s.quickView)
  const setQuickView = useCart((s) => s.setQuickView)
  const add = useCart((s) => s.add)
  const [qty, setQty] = useState(1)
  const showReviewForm = useReviewForm((s) => s.show)
  const adminProducts = useAdminProducts((s) => s.products)
  const [lastId, setLastId] = useState(id)
  if (id && id !== lastId) setLastId(id)
  const product = byId(id ?? lastId ?? '', adminProducts)

  useEffect(() => setQty(1), [id])

  return (
    <Overlay open={!!id} onClose={() => setQuickView(null)} label={product?.name ?? 'Product'} variant="modal">
      {product && (
        <div className="grid sm:grid-cols-2">
          {/* Image panel */}
          <div className="relative overflow-hidden bg-gradient-to-br from-white to-ivory-warm sm:rounded-l-3xl">
            <ProductImage
              product={product}
              sizes="(min-width: 640px) 440px, 100vw"
              className="mx-auto aspect-square w-full max-w-sm object-contain p-6 sm:max-w-none sm:p-8"
            />
            {/* Badges floating on image */}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 sm:bottom-4 sm:left-4">
              {product.badges.slice(0, 2).map((b) => (
                <span key={b} className="rounded-full bg-forest/90 px-3 py-1 text-[11px] font-medium text-gold-light backdrop-blur-sm">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-5 border-t border-forest/8 p-6 sm:border-l sm:border-t-0 sm:p-8">
            {/* Title & close */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold leading-tight text-forest sm:text-[1.75rem]">{product.name}</h2>
                <p className="mt-1 text-sm text-ink/50">{product.size}</p>
                <ProductRating id={product.id} className="mt-2 justify-start" />
              </div>
              <button type="button" onClick={() => setQuickView(null)} className="press -mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink/40 transition-colors hover:bg-forest/5 hover:text-ink" aria-label="Close">
                <CloseIcon />
              </button>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-forest tabular-nums">{formatPKR(product.price)}</p>

            {/* Description */}
            <p className="text-[16px] leading-relaxed text-ink/75">{product.long}</p>

            {/* Ingredients */}
            <div className="rounded-xl bg-ivory-warm/80 p-4">
              <h3 className="text-sm font-semibold text-forest">Key ingredients</h3>
              <p className="mt-1.5 text-[15px] text-ink/70">{product.ingredients.join(' · ')}</p>
            </div>

            {/* Badges */}
            <ul className="flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <li key={b} className="rounded-full border border-gold/40 bg-gold/8 px-3.5 py-1.5 text-xs font-medium text-forest">
                  {b}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                setQuickView(null)
                showReviewForm(product.id)
              }}
              className="self-start text-sm font-medium text-forest underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
            >
              Used this? Write a review
            </button>

            {/* Actions */}
            <div className="mt-auto flex items-center gap-3 pt-3">
              <QtyStepper value={qty} onChange={setQty} label={product.name} />
              <AddButton
                className="flex-1"
                label={`Add to cart · ${formatPKR(product.price * qty)}`}
                onAdd={() => {
                  add(product.id, qty)
                  setQuickView(null)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Overlay>
  )
}
