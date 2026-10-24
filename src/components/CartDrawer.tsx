import { useState } from 'react'
import { byId } from '../data/products'
import { CITIES, deliveryFor, formatPKR, FREE_DELIVERY_OVER, orderRef, PK_PHONE, waLink } from '../lib/shop'
import { sendCustomerEmail, sendAdminEmail, EMAIL_CONFIGURED } from '../lib/email'
import { useCart, useSubtotal, type CartLine } from '../store/cart'
import { useOrders, type Order } from '../store/orders'
import { useAdminProducts } from '../store/admin-products'
import { CloseIcon, TrashIcon, TruckIcon, WhatsAppIcon } from './Icons'
import { Overlay } from './Overlay'
import { ProductImage } from './ProductImage'
import { QtyStepper } from './QtyStepper'
import { Field } from './Sections'

interface Customer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  notes: string
}

function buildMessage(lines: CartLine[], subtotal: number, adminProducts: import('../data/products').Product[] = [], c?: Customer, ref?: string) {
  const delivery = deliveryFor(subtotal)
  const rows = lines.map((l, i) => {
    const p = byId(l.productId, adminProducts)
    const name = p?.name ?? 'Item'
    const size = p?.size ? ` ${p.size}` : ''
    const price = p?.price ?? 0
    return `${i + 1}) ${name}${size} × ${l.qty} = ${formatPKR(price * l.qty)}`
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
    parts.push('', `Name: ${c.name}`, `Email: ${c.email}`, `Phone: ${c.phone}`, `Address: ${c.address}, ${c.city}`)
    if (c.notes.trim()) parts.push(`Notes: ${c.notes.trim()}`)
  }
  return parts.join('\n')
}

export function CartDrawer() {
  const { open, setOpen, step, setStep, lines } = useCart()
  const subtotal = useSubtotal()
  const adminProducts = useAdminProducts((s) => s.products)
  const close = () => setOpen(false)
  const title = step === 'checkout' ? 'Checkout' : step === 'done' ? 'Order sent' : 'Your cart'

  return (
    <Overlay open={open} onClose={close} label={title} variant="drawer">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-forest/8 px-5">
        <h2 className="font-display text-xl font-bold text-forest">{title}</h2>
        <button type="button" onClick={close} className="press grid h-11 w-11 place-items-center rounded-full text-ink/40 transition-colors hover:bg-forest/5 hover:text-ink" aria-label="Close cart">
          <CloseIcon />
        </button>
      </div>

      {step === 'done' ? <Done onClose={close} /> : lines.length === 0 ? <Empty onClose={close} /> : step === 'checkout' ? (
        <Checkout lines={lines} subtotal={subtotal} onBack={() => setStep('cart')} adminProducts={adminProducts} />
      ) : (
        <CartList lines={lines} subtotal={subtotal} onCheckout={() => setStep('checkout')} adminProducts={adminProducts} />
      )}
    </Overlay>
  )
}

function Empty({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
      {/* Empty cart illustration */}
      <div className="grid h-20 w-20 place-items-center rounded-full bg-ivory-warm text-forest/20">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 7h13l-1.4 8.2a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.7L5.6 4H3" />
          <circle cx="9.5" cy="20" r="1.2" />
          <circle cx="16.5" cy="20" r="1.2" />
        </svg>
      </div>
      <div>
        <p className="font-display text-xl font-bold text-forest">Your cart is empty</p>
        <p className="mt-1 text-ink/60">Start with a shampoo, a face wash or a handmade soap.</p>
      </div>
      <a href="#shampoos" onClick={onClose} className="press mt-2 inline-flex h-12 items-center rounded-full bg-forest px-8 font-semibold text-ivory shadow-[0_4px_16px_-4px_rgb(14_32_24/0.4)] transition-shadow hover:shadow-[0_8px_24px_-4px_rgb(14_32_24/0.5)]">
        Start shopping
      </a>
    </div>
  )
}

function Totals({ subtotal }: { subtotal: number }) {
  const delivery = deliveryFor(subtotal)
  const toFree = FREE_DELIVERY_OVER - subtotal
  return (
    <dl className="space-y-2 text-[15px]">
      <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd className="font-medium tabular-nums">{formatPKR(subtotal)}</dd></div>
      <div className="flex justify-between">
        <dt className="text-ink/60">Delivery</dt>
        <dd className={`font-medium tabular-nums ${!delivery ? 'text-[#22c55e]' : ''}`}>
          {delivery ? formatPKR(delivery) : 'Free ✓'}
        </dd>
      </div>
      <div className="flex justify-between border-t border-forest/8 pt-2.5 text-lg font-bold text-forest">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatPKR(subtotal + delivery)}</dd>
      </div>
      {toFree >= 0 && (
        <div className="!mt-3 overflow-hidden rounded-lg bg-ivory-warm p-3">
          <div className="flex items-center gap-2 text-sm text-forest/70">
            <TruckIcon width={16} height={16} className="shrink-0 text-gold" />
            Add {formatPKR(toFree + 1)} more for free delivery
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-forest/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-gold-bright transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / (FREE_DELIVERY_OVER + 1)) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </dl>
  )
}

function CartList({ lines, subtotal, onCheckout, adminProducts }: { lines: CartLine[]; subtotal: number; onCheckout: () => void; adminProducts: import('../data/products').Product[] }) {
  const { setQty, remove } = useCart()
  return (
    <>
      <ul className="flex-1 divide-y divide-forest/6 overflow-y-auto px-5">
        {lines.map((l) => {
          const p = byId(l.productId, adminProducts)
          if (!p) return null
          return (
            <li key={l.productId} className="flex gap-4 py-5">
              <ProductImage product={p} sizes="80px" className="h-20 w-20 shrink-0 rounded-xl border border-forest/8 bg-gradient-to-br from-white to-ivory-warm object-contain p-1" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug text-forest">{p.name}</p>
                    <p className="text-sm text-ink/50">{p.size} · {formatPKR(p.price)}</p>
                  </div>
                  <button type="button" onClick={() => remove(l.productId)} className="press -mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink/35 transition-colors hover:bg-hibiscus/8 hover:text-hibiscus" aria-label={`Remove ${p.name}`}>
                    <TrashIcon width={18} height={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <QtyStepper size="sm" value={l.qty} onChange={(n) => setQty(l.productId, n)} label={p.name} />
                  <span className="font-bold tabular-nums text-forest">{formatPKR(p.price * l.qty)}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="shrink-0 space-y-3 border-t border-forest/8 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <Totals subtotal={subtotal} />
        <button type="button" onClick={onCheckout} className="press h-13 w-full rounded-full bg-forest font-semibold text-ivory shadow-[0_4px_16px_-4px_rgb(14_32_24/0.4)] transition-all hover:bg-forest-deep hover:shadow-[0_8px_24px_-4px_rgb(14_32_24/0.5)]">
          Checkout · Cash on Delivery
        </button>
        <a
          href={waLink(buildMessage(lines, subtotal, adminProducts))}
          target="_blank"
          rel="noopener"
          className="press flex h-13 w-full items-center justify-center gap-2 rounded-full border border-[#25d366]/40 font-semibold text-[#22c55e] transition-all hover:bg-[#25d366]/5 hover:border-[#25d366]/60"
        >
          <WhatsAppIcon width={20} height={20} /> Order on WhatsApp
        </a>
      </div>
    </>
  )
}

function Checkout({ lines, subtotal, onBack, adminProducts }: { lines: CartLine[]; subtotal: number; onBack: () => void; adminProducts: import('../data/products').Product[] }) {
  const { clear, setStep } = useCart()
  const addOrder = useOrders((s) => s.addOrder)
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({})
  const [sending, setSending] = useState(false)

  return (
    <form
      noValidate
      className="flex flex-1 flex-col overflow-hidden"
      onSubmit={async (e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const c: Customer = {
          name: String(f.get('name') ?? '').trim(),
          email: String(f.get('email') ?? '').trim(),
          phone: String(f.get('phone') ?? '').replace(/\s/g, ''),
          address: String(f.get('address') ?? '').trim(),
          city: String(f.get('city') ?? '').trim(),
          notes: String(f.get('notes') ?? ''),
        }
        const err: typeof errors = {}
        if (c.name.length < 2) err.name = 'Please enter your name.'
        if (!c.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) err.email = 'Please enter a valid email address.'
        if (!PK_PHONE.test(c.phone)) err.phone = 'Use a mobile number like 0330-7072774.'
        if (c.address.length < 6) err.address = 'Please enter your full address with house and street.'
        if (!c.city) err.city = 'Please choose your city.'
        setErrors(err)
        if (Object.keys(err).length) {
          e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
          return
        }

        setSending(true)
        const ref = orderRef()
        const delivery = deliveryFor(subtotal)

        // Build order record
        const order: Order = {
          orderId: ref,
          customerName: c.name,
          customerEmail: c.email,
          customerPhone: c.phone,
          products: lines.map((l) => {
            const p = byId(l.productId, adminProducts)
            return {
              name: p?.name ?? 'Item',
              size: p?.size ?? '',
              qty: l.qty,
              price: p?.price ?? 0,
            }
          }),
          subtotal,
          delivery,
          total: subtotal + delivery,
          city: c.city,
          address: c.address,
          notes: c.notes.trim(),
          dateTime: new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' }),
        }

        // Save the order (Supabase when configured; this never blocks or fails checkout)
        await addOrder(order)

        // Send emails (non-blocking)
        sendCustomerEmail(order).catch(() => {})
        sendAdminEmail(order).catch(() => {})

        // Open WhatsApp
        window.open(waLink(buildMessage(lines, subtotal, adminProducts, c, ref)), '_blank', 'noopener')
        sessionStorage.setItem('nh-last-ref', ref)
        clear()
        setStep('done')
        setSending(false)
      }}
    >
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <Field label="Full name" name="name" autoComplete="name" error={errors.name} />
        <Field label="Email address" name="email" type="email" inputMode="email" autoComplete="email" placeholder="your@email.com" error={errors.email} />
        <Field label="Mobile number" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="03XX-XXXXXXX" error={errors.phone} />
        <Field label="Address" name="address" autoComplete="street-address" placeholder="House, street, area" error={errors.address} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/70">City</span>
          <input
            name="city"
            list="nh-cities"
            autoComplete="address-level2"
            aria-invalid={!!errors.city || undefined}
            className={`h-12 w-full rounded-xl border bg-ivory-warm/50 px-4 outline-none transition-colors focus:bg-white focus:border-forest ${errors.city ? 'border-hibiscus' : 'border-forest/15'}`}
          />
          <datalist id="nh-cities">
            {CITIES.map((c) => <option key={c} value={c} />)}
          </datalist>
          {errors.city && <span className="mt-1 block text-sm text-hibiscus">{errors.city}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/70">Notes (optional)</span>
          <textarea
            name="notes"
            rows={2}
            placeholder="Favourite soap design, delivery timing…"
            className="w-full rounded-xl border border-forest/15 bg-ivory-warm/50 px-4 py-3 outline-none transition-colors focus:bg-white focus:border-forest"
          />
        </label>
        <fieldset className="rounded-xl border border-gold/50 bg-gold/8 p-4">
          <legend className="px-1 text-sm font-semibold text-forest">Payment</legend>
          <label className="flex items-center gap-3 text-forest">
            <input type="radio" checked readOnly className="h-5 w-5 accent-[var(--color-forest)]" /> Cash on Delivery
          </label>
          <p className="mt-1.5 pl-8 text-sm text-ink/60">Pay in cash when your parcel arrives.</p>
        </fieldset>
      </div>
      <div className="shrink-0 space-y-3 border-t border-forest/8 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <Totals subtotal={subtotal} />
        <button type="submit" disabled={sending} className="press flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#25d366] font-semibold text-white shadow-[0_8px_24px_-8px_rgb(37_211_102/0.4)] transition-all hover:bg-[#22c55e] hover:shadow-[0_12px_32px_-8px_rgb(37_211_102/0.5)] disabled:opacity-60">
          <WhatsAppIcon width={20} height={20} /> {sending ? 'Placing order…' : 'Place order on WhatsApp'}
        </button>
        <p className="text-center text-xs text-ink/50">
          {EMAIL_CONFIGURED
            ? 'A confirmation email will be sent to you. Your order also opens in WhatsApp.'
            : 'Your order details open in WhatsApp. Just press send.'}
        </p>
        <button type="button" onClick={onBack} className="w-full py-2 text-sm font-medium text-forest transition-colors underline-offset-4 hover:text-forest-deep hover:underline">
          ← Back to cart
        </button>
      </div>
    </form>
  )
}

function Done({ onClose }: { onClose: () => void }) {
  let ref = ''
  try { ref = sessionStorage.getItem('nh-last-ref') ?? '' } catch { /* storage blocked */ }
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      {/* Success checkmark */}
      <div className="grid h-20 w-20 place-items-center rounded-full bg-[#22c55e]/10">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </div>
      <p className="font-display text-2xl font-bold text-forest">Thank you!</p>
      {ref && <p className="rounded-full bg-gold/15 px-5 py-2 font-semibold tracking-wide text-forest tabular-nums">{ref}</p>}
      <p className="max-w-xs text-ink/65">
        {EMAIL_CONFIGURED
          ? <>A confirmation email has been sent to your inbox. Please also press <strong className="text-forest">send</strong> in WhatsApp so we receive your order.</>
          : <>Please press <strong className="text-forest">send</strong> in WhatsApp so we receive your order. We will call to confirm before delivery.</>}
      </p>
      <button type="button" onClick={onClose} className="press mt-3 h-12 rounded-full bg-forest px-8 font-semibold text-ivory shadow-[0_4px_16px_-4px_rgb(14_32_24/0.4)]">
        Continue shopping
      </button>
    </div>
  )
}
