import { useEffect, useMemo, useState } from 'react'
import { create } from 'zustand'
import { byId, products } from '../data/products'
import { REVIEWS_LIVE, summarize, useReviews, type Review } from '../lib/reviews'
import { CloseIcon } from './Icons'
import { Overlay } from './Overlay'
import { SectionHead, useReveal } from './Sections'
import { StarInput, Stars } from './Stars'

/* Form open state lives in a tiny store so the quick view can open it too. */
export const useReviewForm = create<{ open: boolean; productId: string; show: (productId?: string) => void; hide: () => void }>((set) => ({
  open: false,
  productId: '',
  show: (productId = '') => set({ open: true, productId }),
  hide: () => set({ open: false }),
}))

const dateFmt = new Intl.DateTimeFormat('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })

function ReviewCard({ r }: { r: Review }) {
  const product = byId(r.product_id)
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-gold/20 bg-forest-soft/40 p-5 text-ivory">
      <div className="flex items-center justify-between gap-3">
        <Stars value={r.rating} className="text-ivory" />
        <time dateTime={r.created_at} className="text-xs text-ivory/50">{dateFmt.format(new Date(r.created_at))}</time>
      </div>
      {r.title && <h3 className="font-display text-base font-semibold leading-snug text-gold-light">{r.title}</h3>}
      <p className="text-[15px] leading-relaxed whitespace-pre-line text-ivory/80">{r.body}</p>
      <footer className="mt-auto flex items-end justify-between gap-3 border-t border-gold/15 pt-3 text-sm">
        <span>
          <span className="font-semibold text-ivory">{r.name}</span>
          {r.city && <span className="text-ivory/55"> · {r.city}</span>}
        </span>
        {product && <span className="text-right text-xs text-gold/80">{product.name}</span>}
      </footer>
    </article>
  )
}

export function Reviews() {
  const ref = useReveal<HTMLDivElement>()
  const { reviews, status, load } = useReviews()
  const show = useReviewForm((s) => s.show)
  const [filter, setFilter] = useState('all')
  const [limit, setLimit] = useState(6)

  useEffect(() => {
    load()
  }, [load])

  const list = useMemo(() => (filter === 'all' ? reviews : reviews.filter((r) => r.product_id === filter)), [reviews, filter])
  const sum = summarize(list)
  const reviewed = useMemo(() => new Set(reviews.map((r) => r.product_id)), [reviews])

  return (
    <section id="reviews" className="relative bg-forest-deep text-ivory" aria-labelledby="reviews-title">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div id="reviews-title">
          <SectionHead title="Customer Reviews" intro="Honest words from people using Nana Herbiotics at home. Tried one of our products? Tell others how it went." />
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-gold/25 bg-forest/60 p-6 lg:sticky lg:top-24">
            {sum.count > 0 ? (
              <>
                <p className="font-serif-display text-5xl font-bold text-gold-light tabular-nums">{sum.average.toFixed(1)}</p>
                <Stars value={sum.average} size={20} className="mt-2 text-ivory" />
                <p className="mt-1 text-sm text-ivory/60">
                  {sum.count} review{sum.count === 1 ? '' : 's'}
                </p>
                <ul className="mt-5 space-y-1.5" aria-label="Rating breakdown">
                  {sum.bars.map((n, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-ivory/70 tabular-nums">{5 - i}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <span className="block h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${(n / sum.count) * 100}%` }} />
                      </span>
                      <span className="w-6 text-right text-ivory/50 tabular-nums">{n}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-ivory/70">No reviews {filter === 'all' ? 'yet' : 'for this product yet'}. Be the first to share your experience.</p>
            )}
            <button
              type="button"
              onClick={() => show(filter === 'all' ? '' : filter)}
              className="press mt-6 h-12 w-full rounded-full bg-gold font-semibold text-forest-deep hover:bg-gold-light"
            >
              Write a review
            </button>
            {!REVIEWS_LIVE && (
              <p className="mt-3 text-xs leading-relaxed text-ivory/45">Preview mode: reviews are saved in this browser until Supabase is connected.</p>
            )}
          </aside>

          {/* List */}
          <div>
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label="Filter reviews by product">
              {[{ id: 'all', name: 'All products' }, ...products.filter((p) => reviewed.has(p.id))].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === p.id}
                  onClick={() => {
                    setFilter(p.id)
                    setLimit(6)
                  }}
                  className={`press shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${filter === p.id ? 'border-gold bg-gold text-forest-deep' : 'border-gold/30 text-ivory/80 hover:border-gold/60'}`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {status === 'loading' && reviews.length === 0 && (
              <div className="grid gap-4 sm:grid-cols-2" aria-busy>
                {[0, 1].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-white/5" />)}
              </div>
            )}
            {status === 'error' && (
              <p className="rounded-2xl border border-hibiscus/40 bg-hibiscus/10 p-5 text-ivory/85">
                We couldn't load reviews right now. Please refresh the page in a moment.
              </p>
            )}
            {status !== 'error' && list.length === 0 && status !== 'loading' && (
              <div className="grid place-items-center rounded-2xl border border-dashed border-gold/25 px-6 py-14 text-center">
                <Stars value={0} size={26} className="text-ivory" />
                <p className="mt-4 font-display text-lg text-gold-light">Your words could be the first here</p>
                <p className="mt-2 max-w-sm text-ivory/65">Reviews help other families choose with confidence.</p>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {list.slice(0, limit).map((r) => <ReviewCard key={r.id} r={r} />)}
            </div>
            {list.length > limit && (
              <button type="button" onClick={() => setLimit((l) => l + 6)} className="press mx-auto mt-6 block h-11 rounded-full border border-gold/40 px-6 text-sm font-semibold text-gold-light hover:bg-white/5">
                Show more reviews
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

interface Errors { product?: string; rating?: string; name?: string; body?: string; form?: string }

export function ReviewForm() {
  const { open, productId, hide } = useReviewForm()
  const submit = useReviews((s) => s.submit)
  const [rating, setRating] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'form' | 'sending' | 'pending' | 'published'>('form')

  useEffect(() => {
    if (open) {
      setRating(0)
      setErrors({})
      setState('form')
    }
  }, [open])

  const inputCls = (bad?: string) =>
    `w-full rounded-xl border bg-forest/[0.03] px-4 outline-none focus:border-forest ${bad ? 'border-hibiscus' : 'border-forest/20'}`

  return (
    <Overlay open={open} onClose={hide} label="Write a review" variant="modal">
      <div className="mx-auto max-w-xl p-5 sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-forest">{state === 'form' || state === 'sending' ? 'Write a review' : 'Thank you!'}</h2>
          <button type="button" onClick={hide} className="press -mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-forest/5" aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {state === 'pending' || state === 'published' ? (
          <div className="space-y-4 text-ink/80">
            <p>
              {state === 'pending'
                ? 'Your review has been received. It will appear on the site once we have checked it, usually within a day.'
                : 'Your review is now showing on this page.'}
            </p>
            <button type="button" onClick={hide} className="press h-12 rounded-full bg-forest px-8 font-semibold text-ivory">
              Done
            </button>
          </div>
        ) : (
          <form
            noValidate
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              if (f.get('website')) return // honeypot: bots fill every field
              const data = {
                product_id: String(f.get('product') ?? ''),
                name: String(f.get('name') ?? '').trim(),
                city: String(f.get('city') ?? '').trim() || null,
                title: String(f.get('title') ?? '').trim() || null,
                body: String(f.get('body') ?? '').trim(),
                rating,
              }
              const err: Errors = {}
              if (!byId(data.product_id)) err.product = 'Please choose the product you used.'
              if (!rating) err.rating = 'Please tap a star to rate.'
              if (data.name.length < 2) err.name = 'Please enter your name.'
              if (data.body.length < 10) err.body = 'Please write at least a sentence (10 characters).'
              setErrors(err)
              if (Object.keys(err).length) return
              setState('sending')
              try {
                setState(await submit(data))
              } catch {
                setState('form')
                setErrors({ form: 'Something went wrong sending your review. Please try again.' })
              }
            }}
          >
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/80">Product</span>
              <select name="product" defaultValue={productId} aria-invalid={!!errors.product || undefined} className={`h-12 ${inputCls(errors.product)}`}>
                <option value="" disabled>Choose a product</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {errors.product && <span className="mt-1 block text-sm text-hibiscus">{errors.product}</span>}
            </label>
            <StarInput value={rating} onChange={setRating} error={errors.rating} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink/80">Your name</span>
                <input name="name" autoComplete="given-name" maxLength={60} aria-invalid={!!errors.name || undefined} className={`h-12 ${inputCls(errors.name)}`} />
                {errors.name && <span className="mt-1 block text-sm text-hibiscus">{errors.name}</span>}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink/80">City (optional)</span>
                <input name="city" autoComplete="address-level2" maxLength={60} className={`h-12 ${inputCls()}`} />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/80">Headline (optional)</span>
              <input name="title" maxLength={80} placeholder="Softer hair in two weeks" className={`h-12 ${inputCls()}`} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/80">Your review</span>
              <textarea name="body" rows={4} maxLength={1000} aria-invalid={!!errors.body || undefined} placeholder="How did it work for you?" className={`py-3 ${inputCls(errors.body)}`} />
              {errors.body && <span className="mt-1 block text-sm text-hibiscus">{errors.body}</span>}
            </label>
            {/* Honeypot, hidden from people */}
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            {errors.form && <p className="rounded-xl bg-hibiscus/10 p-3 text-sm text-hibiscus">{errors.form}</p>}
            <button type="submit" disabled={state === 'sending'} className="press h-12 w-full rounded-full bg-forest font-semibold text-ivory hover:bg-forest-deep disabled:opacity-60">
              {state === 'sending' ? 'Sending…' : 'Submit review'}
            </button>
            <p className="text-center text-xs text-ink/55">Your review appears right away with your name and city. We never ask for your phone or email.</p>
          </form>
        )}
      </div>
    </Overlay>
  )
}
