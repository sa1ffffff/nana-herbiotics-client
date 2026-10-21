import { useEffect, useState } from 'react'
import { byId } from '../data/products'
import { formatPKR } from '../lib/shop'
import { useCart } from '../store/cart'
import { CloseIcon } from './Icons'
import { Overlay } from './Overlay'
import { ProductImage } from './ProductImage'
import { QtyStepper } from './QtyStepper'

export function QuickView() {
  const id = useCart((s) => s.quickView)
  const setQuickView = useCart((s) => s.setQuickView)
  const add = useCart((s) => s.add)
  const [qty, setQty] = useState(1)
  const [lastId, setLastId] = useState(id)
  if (id && id !== lastId) setLastId(id)
  const product = byId(id ?? lastId ?? '')

  useEffect(() => setQty(1), [id])

  return (
    <Overlay open={!!id} onClose={() => setQuickView(null)} label={product?.name ?? 'Product'} variant="modal">
      {product && (
        <div className="grid sm:grid-cols-2">
          <div className="relative bg-white sm:rounded-l-3xl">
            <ProductImage product={product} sizes="(min-width: 640px) 440px, 100vw" className="mx-auto aspect-square w-full max-w-sm object-contain sm:max-w-none" />
          </div>
          <div className="flex flex-col gap-4 border-t border-forest/10 p-5 sm:border-l sm:border-t-0 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold leading-tight text-forest">{product.name}</h2>
                <p className="mt-1 text-sm text-ink/60">{product.size}</p>
              </div>
              <button type="button" onClick={() => setQuickView(null)} className="press -mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-forest/5" aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            <p className="text-2xl font-semibold text-forest tabular-nums">{formatPKR(product.price)}</p>
            <p className="text-[16px] leading-relaxed text-ink/80">{product.long}</p>
            <div>
              <h3 className="text-sm font-semibold text-forest">Key ingredients</h3>
              <p className="mt-1 text-[15px] text-ink/75">{product.ingredients.join(', ')}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <li key={b} className="rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-medium text-forest">
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center gap-2 pt-2">
              <QtyStepper value={qty} onChange={setQty} label={product.name} />
              <button
                type="button"
                onClick={() => {
                  add(product.id, qty)
                  setQuickView(null)
                }}
                className="press h-11 flex-1 rounded-full bg-forest px-5 font-semibold text-ivory hover:bg-forest-deep"
              >
                Add to cart · {formatPKR(product.price * qty)}
              </button>
            </div>
          </div>
        </div>
      )}
    </Overlay>
  )
}
