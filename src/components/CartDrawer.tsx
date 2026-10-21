import { useState } from 'react'
import { byId } from '../data/products'
import { CITIES, deliveryFor, formatPKR, FREE_DELIVERY_OVER, orderRef, PK_PHONE, waLink } from '../lib/shop'
import { useCart, useSubtotal, type CartLine } from '../store/cart'
import { CloseIcon, TrashIcon, TruckIcon, WhatsAppIcon } from './Icons'
import { Overlay } from './Overlay'
import { ProductImage } from './ProductImage'
import { QtyStepper } from './QtyStepper'
import { Field } from './Sections'

interface Customer {
  name: string
  phone: string
  address: string
  city: string
  notes: string
}

function buildMessage(lines: CartLine[], subtotal: number, c?: Customer, ref?: string) {
  const delivery = deliveryFor(subtotal)
  const rows = lines.map((l, i) => {
    const p = byId(l.productId)!
    return `${i + 1}) ${p.name} ${p.size} × ${l.qty} = ${formatPKR(p.price * l.qty)}`
  })
  const parts = [
    ref ? `Assalam-o-Alaikum! New order ${ref} from the Nana Herbiotics website:` : 'Assalam-o-Alaikum! I would like to order:',
    '',
    ...rows,
    '',
    `Subtotal: ${formatPKR(subtotal)}`,
    `Delivery: ${delivery ? formatPKR(delivery) : 'Free'}`,
    `Total: ${formatPKR(subtotal + delivery)}`,
    'Payment: Cash on Delivery',
  ]
  if (c) {
    parts.push('', `Name: ${c.name}`, `Phone: ${c.phone}`, `Address: ${c.address}, ${c.city}`)
    if (c.notes.trim()) parts.push(`Notes: ${c.notes.trim()}`)
  }
  return parts.join('\n')
}

export function CartDrawer() {
  const { open, setOpen, step, setStep, lines } = useCart()
  const subtotal = useSubtotal()
  const close = () => setOpen(false)
  const title = step === 'checkout' ? 'Checkout' : step === 'done' ? 'Order sent' : 'Your cart'

  return (
    <Overlay open={open} onClose={close} label={title} variant="drawer">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-forest/10 px-4">
        <h2 className="font-display text-xl font-bold text-forest">{title}</h2>
        <button type="button" onClick={close} className="press grid h-11 w-11 place-items-center rounded-full hover:bg-forest/5" aria-label="Close cart">
          <CloseIcon />
        </button>
      </div>
      {step === 'done' ? <Done onClose={close} /> : lines.length === 0 ? <Empty onClose={close} /> : step === 'checkout' ? (
        <Checkout lines={lines} subtotal={subtotal} onBack={() => setStep('cart')} />
      ) : (
        <CartList lines={lines} subtotal={subtotal} onCheckout={() => setStep('checkout')} />
      )}
    </Overlay>
  )
}

function Empty({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-display text-lg text-forest">Your cart is empty</p>
      <p className="text-ink/70">Start with a shampoo, a face wash or a handmade soap.</p>
      <a href="#shampoos" onClick={onClose} className="press mt-2 inline-flex h-12 items-center rounded-full bg-forest px-8 font-semibold text-ivory">
        Start shopping
      </a>
    </div>
  )
}

function Totals({ subtotal }: { subtotal: number }) {
  const delivery = deliveryFor(subtotal)
  const toFree = FREE_DELIVERY_OVER - subtotal
  return (
    <dl className="space-y-1.5 text-[15px]">
      <div className="flex justify-between"><dt className="text-ink/70">Subtotal</dt><dd className="tabular-nums">{formatPKR(subtotal)}</dd></div>
      <div className="flex justify-between"><dt className="text-ink/70">Delivery</dt><dd className="tabular-nums">{delivery ? formatPKR(delivery) : 'Free'}</dd></div>
      <div className="flex justify-between border-t border-forest/10 pt-2 text-lg font-semibold text-forest"><dt>Total</dt><dd className="tabular-nums">{formatPKR(subtotal + delivery)}</dd></div>
      {toFree >= 0 && (
        <p className="flex items-center gap-2 pt-1 text-sm text-forest/80">
          <TruckIcon width={16} height={16} className="shrink-0 text-gold" /> Add {formatPKR(toFree + 1)} more for free delivery
        </p>
      )}
    </dl>
  )
}

function CartList({ lines, subtotal, onCheckout }: { lines: CartLine[]; subtotal: number; onCheckout: () => void }) {
  const { setQty, remove } = useCart()
  return (
    <>
      <ul className="flex-1 divide-y divide-forest/10 overflow-y-auto px-4">
        {lines.map((l) => {
          const p = byId(l.productId)
          if (!p) return null
          return (
            <li key={l.productId} className="flex gap-3 py-4">
              <ProductImage product={p} sizes="80px" className="h-20 w-20 shrink-0 rounded-xl border border-forest/10 bg-white object-contain" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug text-forest">{p.name}</p>
                    <p className="text-sm text-ink/60">{p.size} · {formatPKR(p.price)}</p>
                  </div>
                  <button type="button" onClick={() => remove(l.productId)} className="press -mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink/50 hover:text-hibiscus" aria-label={`Remove ${p.name}`}>
                    <TrashIcon width={18} height={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <QtyStepper size="sm" value={l.qty} onChange={(n) => setQty(l.productId, n)} label={p.name} />
                  <span className="font-semibold tabular-nums">{formatPKR(p.price * l.qty)}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="shrink-0 space-y-3 border-t border-forest/10 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Totals subtotal={subtotal} />
        <button type="button" onClick={onCheckout} className="press h-12 w-full rounded-full bg-forest font-semibold text-ivory hover:bg-forest-deep">
          Checkout · Cash on Delivery
        </button>
        <a
          href={waLink(buildMessage(lines, subtotal))}
          target="_blank"
          rel="noopener"
          className="press flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#1f8f4e] font-semibold text-[#17733e] hover:bg-[#1f8f4e]/5"
        >
          <WhatsAppIcon width={20} height={20} /> Order on WhatsApp
        </a>
      </div>
    </>
  )
}

function Checkout({ lines, subtotal, onBack }: { lines: CartLine[]; subtotal: number; onBack: () => void }) {
  const { clear, setStep } = useCart()
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({})

  return (
    <form
      noValidate
      className="flex flex-1 flex-col overflow-hidden"
      onSubmit={(e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const c: Customer = {
          name: String(f.get('name') ?? '').trim(),
          phone: String(f.get('phone') ?? '').replace(/\s/g, ''),
          address: String(f.get('address') ?? '').trim(),
          city: String(f.get('city') ?? '').trim(),
          notes: String(f.get('notes') ?? ''),
        }
        const err: typeof errors = {}
        if (c.name.length < 2) err.name = 'Please enter your name.'
        if (!PK_PHONE.test(c.phone)) err.phone = 'Use a mobile number like 0330-7072774.'
        if (c.address.length < 6) err.address = 'Please enter your full address with house and street.'
        if (!c.city) err.city = 'Please choose your city.'
        setErrors(err)
        if (Object.keys(err).length) {
          e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
          return
        }
        const ref = orderRef()
        window.open(waLink(buildMessage(lines, subtotal, c, ref)), '_blank', 'noopener')
        sessionStorage.setItem('nh-last-ref', ref)
        clear()
        setStep('done')
      }}
    >
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <Field label="Full name" name="name" autoComplete="name" error={errors.name} />
        <Field label="Mobile number" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="03XX-XXXXXXX" error={errors.phone} />
        <Field label="Address" name="address" autoComplete="street-address" placeholder="House, street, area" error={errors.address} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/80">City</span>
          <input
            name="city"
            list="nh-cities"
            autoComplete="address-level2"
            aria-invalid={!!errors.city || undefined}
            className={`h-12 w-full rounded-xl border bg-forest/[0.03] px-4 outline-none focus:border-forest ${errors.city ? 'border-hibiscus' : 'border-forest/20'}`}
          />
          <datalist id="nh-cities">
            {CITIES.map((c) => <option key={c} value={c} />)}
          </datalist>
          {errors.city && <span className="mt-1 block text-sm text-hibiscus">{errors.city}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/80">Notes (optional)</span>
          <textarea name="notes" rows={2} placeholder="Favourite soap design, delivery timing…" className="w-full rounded-xl border border-forest/20 bg-forest/[0.03] px-4 py-3 outline-none focus:border-forest" />
        </label>
        <fieldset className="rounded-xl border border-gold/60 bg-gold/10 p-4">
          <legend className="px-1 text-sm font-semibold text-forest">Payment</legend>
          <label className="flex items-center gap-3 text-forest">
            <input type="radio" checked readOnly className="h-5 w-5 accent-[var(--color-forest)]" /> Cash on Delivery
          </label>
          <p className="mt-1.5 pl-8 text-sm text-ink/70">Pay in cash when your parcel arrives.</p>
        </fieldset>
      </div>
      <div className="shrink-0 space-y-3 border-t border-forest/10 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Totals subtotal={subtotal} />
        <button type="submit" className="press flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1f8f4e] font-semibold text-white hover:bg-[#197a42]">
          <WhatsAppIcon width={20} height={20} /> Place order on WhatsApp
        </button>
        <p className="text-center text-xs text-ink/60">Your order details open in WhatsApp. Just press send.</p>
        <button type="button" onClick={onBack} className="w-full py-2 text-sm font-medium text-forest underline-offset-4 hover:underline">
          Back to cart
        </button>
      </div>
    </form>
  )
}

function Done({ onClose }: { onClose: () => void }) {
  let ref = ''
  try { ref = sessionStorage.getItem('nh-last-ref') ?? '' } catch { /* storage blocked */ }
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="font-display text-2xl font-bold text-forest">Thank you!</p>
      {ref && <p className="rounded-full bg-gold/15 px-4 py-1.5 font-semibold tracking-wide text-forest tabular-nums">{ref}</p>}
      <p className="max-w-xs text-ink/75">
        Please press <strong>send</strong> in WhatsApp so we receive your order. We will call to confirm before delivery.
      </p>
      <button type="button" onClick={onClose} className="press mt-3 h-12 rounded-full bg-forest px-8 font-semibold text-ivory">
        Continue shopping
      </button>
    </div>
  )
}
