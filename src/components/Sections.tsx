import { useEffect, useRef, type ReactNode } from 'react'
import { inCategory, type Category } from '../data/products'
import { EMAIL, FACEBOOK_URL, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_TEL, waLink } from '../lib/shop'
import { ProductCard } from './ProductCard'
import { Monogram } from './Header'
import { Corners, Divider } from './Ornaments'
import {
  DropIcon, FacebookIcon, FlaskIcon, HeartIcon, InstagramIcon, MailIcon, PhoneIcon, SproutIcon, TruckIcon, WhatsAppIcon,
} from './Icons'

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

export function SectionHead({ title, intro, light = false }: { title: string; intro: string; light?: boolean }) {
  return (
    <div className="mx-auto mb-12 max-w-xl text-center">
      <h2 className={`font-display text-[clamp(1.85rem,5vw,2.75rem)] font-bold leading-tight ${light ? 'text-forest' : 'text-ivory'}`}>
        {title}
      </h2>
      <Divider className="mt-4 justify-center" />
      <p className={`mt-5 text-[17px] leading-relaxed text-pretty ${light ? 'text-ink/65' : 'text-ivory/70'}`}>
        {intro}
      </p>
    </div>
  )
}

/* ── Marquee Band ─────────────────────────── */

export function MarqueeBand() {
  const items = ['Paraben Free', 'Sulfate Free', '100% Herbal', 'Handmade in Pakistan', 'Cash on Delivery', 'Free Delivery over Rs 3,000']
  return (
    <div className="relative overflow-hidden border-y border-gold/15 bg-forest-deep py-4">
      <div className="marquee-track">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-4 px-4 font-display text-sm tracking-[0.15em] text-gold/70 uppercase sm:text-base sm:px-6">
            {item}
            <span className="text-gold/40" aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Product Section ──────────────────────── */

export function ProductSection({ id, category, title, intro, tone = 'dark' }: {
  id: string; category: Category; title: string; intro: string; tone?: 'dark' | 'light'
}) {
  const ref = useReveal<HTMLDivElement>()
  const items = inCategory(category)
  const cols = items.length === 2
    ? 'grid-cols-1 sm:grid-cols-2 mx-auto max-w-4xl'
    : 'grid-cols-2 lg:grid-cols-3'

  return (
    <section
      id={id}
      className={`relative ${
        tone === 'light'
          ? 'bg-ivory-warm text-ink'
          : 'gradient-mesh bg-forest text-ivory'
      }`}
    >
      {/* Top separator */}
      <div className="section-sep" />

      <div ref={ref} className="reveal mx-auto max-w-6xl px-4 py-16 md:py-24">
        <SectionHead title={title} intro={intro} light={tone === 'light'} />
        <div className={`stagger grid gap-4 sm:gap-6 lg:gap-8 ${cols}`}>
          {items.map((p, i) => (
            <div key={p.id} style={{ '--i': i } as React.CSSProperties} className="flex">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Promises / Why Nana Herbiotics ────────── */

const PROMISES: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <FlaskIcon />, title: 'Paraben free', text: 'No parabens in any of our formulas. Just pure, clean ingredients.' },
  { icon: <DropIcon />, title: 'Sulfate free', text: 'Gentle cleansing that does not strip your hair of its natural oils.' },
  { icon: <SproutIcon />, title: '100% herbal', text: 'Herbs, flowers and botanical extracts. Nothing synthetic.' },
  { icon: <HeartIcon />, title: 'Safe for all hair types', text: 'Kind to every kind of hair, from straight to curly, for the whole family.' },
]

export function Promises() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="engraved border-y border-gold/15 text-ivory" aria-labelledby="why">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 id="why" className="text-center font-display text-[clamp(1.85rem,5vw,2.75rem)] font-bold text-ivory">
          Why Nana Herbiotics
        </h2>
        <Divider className="mx-auto mt-4 justify-center" />
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8">
          {PROMISES.map((p) => (
            <li key={p.title} className="group flex flex-col items-center text-center">
              <span className="grid h-18 w-18 place-items-center rounded-2xl border border-gold/50 bg-forest-soft/40 text-gold-light shadow-[0_4px_24px_-8px_rgb(200_162_74/0.15)] transition-all duration-300 group-hover:border-gold/70 group-hover:shadow-[0_8px_32px_-8px_rgb(200_162_74/0.25)]">
                {p.icon}
              </span>
              <h3 className="mt-5 font-display text-base font-semibold text-gold-light">{p.title}</h3>
              <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-ivory/65">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── About Section ────────────────────────── */

export function About() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="relative bg-ivory-warm text-ink">
      <div className="section-sep" />
      <div ref={ref} className="reveal mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[auto_1fr] md:gap-20 md:py-24">
        {/* Monogram card */}
        <div className="relative mx-auto grid h-56 w-48 place-items-center rounded-2xl bg-forest text-gold-light label-frame shadow-[0_16px_48px_-16px_rgb(14_32_24/0.5)] md:h-72 md:w-60">
          <Corners className="text-gold/60" size="h-6 w-6" inset="m-2" />
          <div className="text-center">
            <Monogram className="mx-auto h-22 w-22 md:h-28 md:w-28" />
            <p className="mt-3 font-display text-xs tracking-[0.25em] text-gold/70 uppercase">ESTD · 2024</p>
          </div>
        </div>
        {/* Story */}
        <div className="relative max-w-2xl">
          <span className="quote-mark">"</span>
          <h2 className="font-display text-[clamp(1.85rem,5vw,2.75rem)] font-bold leading-tight text-forest">Rooted in nature</h2>
          <Divider className="mt-4" />
          <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-ink/75">
            <p>
              Nana Herbiotics started in 2024 with a simple idea: care for your hair and skin the way our grandmothers did,
              with plants instead of harsh chemicals.
            </p>
            <p>
              We make our shampoos, washes, serum and handmade soaps in small batches, using herbs, flowers and botanical
              extracts. Every formula is paraben free and gentle enough for the whole family.
            </p>
          </div>
          <p className="mt-8 inline-block rounded-xl border border-gold/30 bg-forest/[0.04] px-6 py-3 font-serif-display text-xl font-semibold text-forest italic">
            Botanical care, naturally.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Contact Section ──────────────────────── */

export function Contact() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="contact" className="gradient-mesh bg-forest">
      <div className="section-sep" />
      <div ref={ref} className="reveal mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:gap-14 md:py-24">
        <div>
          <h2 className="font-display text-[clamp(1.85rem,5vw,2.75rem)] font-bold leading-tight text-ivory">Get in touch</h2>
          <Divider className="mt-4" />
          <p className="mt-5 mb-8 max-w-md text-[17px] leading-relaxed text-ivory/70">
            Questions about a product, or want to order by message? We usually reply the same day.
          </p>
          <div className="flex flex-col gap-4">
            <a
              href={waLink('Assalam-o-Alaikum! I have a question about Nana Herbiotics products.')}
              target="_blank"
              rel="noopener"
              className="press group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-[#25d366] px-7 font-semibold text-white shadow-[0_8px_24px_-8px_rgb(37_211_102/0.4)] transition-all hover:bg-[#22c55e] hover:shadow-[0_12px_32px_-8px_rgb(37_211_102/0.5)] sm:self-start"
            >
              <WhatsAppIcon width={22} height={22} /> Chat on WhatsApp
            </a>

            {/* Contact info cards */}
            <div className="mt-2 space-y-3">
              <a href={`tel:${PHONE_TEL}`} className="glass flex items-center gap-4 rounded-xl px-5 py-4 text-ivory transition-all hover:border-gold/30 hover:bg-forest-soft/60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <PhoneIcon width={20} height={20} />
                </span>
                <span>{PHONE_DISPLAY}</span>
              </a>
              <a href={`mailto:${EMAIL}`} className="glass flex items-center gap-4 rounded-xl px-5 py-4 break-all text-ivory transition-all hover:border-gold/30 hover:bg-forest-soft/60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <MailIcon width={20} height={20} />
                </span>
                <span>{EMAIL}</span>
              </a>
            </div>

            <p className="mt-2 inline-flex items-center gap-3 rounded-xl border border-gold/20 bg-gold/[0.06] px-5 py-3.5 text-[15px] text-ivory/80">
              <TruckIcon width={20} height={20} className="shrink-0 text-gold" />
              Cash on Delivery · Free above Rs 3,000
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}

/* ── Contact Form ─────────────────────────── */

function ContactForm() {
  return (
    <form
      className="rounded-2xl bg-white p-6 text-ink shadow-[0_8px_32px_-12px_rgba(14,32,24,0.15),0_2px_4px_rgba(14,32,24,0.05)] sm:p-8"
      onSubmit={(e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const subject = `Website message from ${f.get('name')}`
        const body = `${f.get('message')}\n\n${f.get('name')} (${f.get('email')})`
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      }}
    >
      <h3 className="font-display text-xl font-bold text-forest">Send us a message</h3>
      <p className="mt-1 text-sm text-ink/50">Opens your email app with the message ready to send.</p>
      <div className="mt-6 space-y-4">
        <Field label="Your name" name="name" autoComplete="name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/70">Message</span>
          <textarea
            name="message"
            required
            rows={4}
            className="w-full rounded-xl border border-forest/15 bg-ivory-warm/50 px-4 py-3 outline-none transition-colors focus:border-forest focus:bg-white"
          />
        </label>
      </div>
      <button
        type="submit"
        className="press mt-6 h-12 w-full rounded-full bg-forest font-semibold text-ivory shadow-[0_4px_16px_-4px_rgb(14_32_24/0.4)] transition-all hover:bg-forest-deep hover:shadow-[0_8px_24px_-4px_rgb(14_32_24/0.5)]"
      >
        Send message
      </button>
    </form>
  )
}

/* ── Field ────────────────────────────────── */

export function Field({ label, error, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/70">{label}</span>
      <input
        required
        {...rest}
        aria-invalid={!!error || undefined}
        className={`h-12 w-full rounded-xl border bg-ivory-warm/50 px-4 outline-none transition-colors focus:bg-white focus:border-forest ${
          error ? 'border-hibiscus' : 'border-forest/15'
        }`}
      />
      {error && <span className="mt-1 block text-sm text-hibiscus">{error}</span>}
    </label>
  )
}

/* ── Footer ───────────────────────────────── */

export function Footer() {
  return (
    <footer className="bg-forest-deep text-ivory/80">
      {/* Top border with gold gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-4 text-gold-light">
            <Monogram className="h-12 w-12" />
            <div>
              <p className="font-display text-xl font-semibold">Nana Herbiotics</p>
              <p className="mt-0.5 text-sm text-ivory/50">Botanical Care, Naturally</p>
              <p className="text-[10px] tracking-[0.2em] text-gold/40 uppercase">Est. 2024 · Handmade in Pakistan</p>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3 text-[15px]">
            <a href="#shampoos" className="transition-colors hover:text-gold-light">Shampoos</a>
            <a href="#skin-care" className="transition-colors hover:text-gold-light">Skin Care</a>
            <a href="#hair-care" className="transition-colors hover:text-gold-light">Hair Care</a>
            <a href="#soaps" className="transition-colors hover:text-gold-light">Soaps</a>
            <a href="#about" className="transition-colors hover:text-gold-light">About</a>
            <a href="#contact" className="transition-colors hover:text-gold-light">Contact</a>
          </nav>

          {/* Social links */}
          <div className="flex gap-3">
            <a href={INSTAGRAM_URL} aria-label="Instagram" className="press grid h-12 w-12 place-items-center rounded-full border border-gold/20 text-ivory/60 transition-all hover:border-gold/50 hover:text-gold-light hover:bg-gold/[0.06]">
              <InstagramIcon width={20} height={20} />
            </a>
            <a href={FACEBOOK_URL} aria-label="Facebook" className="press grid h-12 w-12 place-items-center rounded-full border border-gold/20 text-ivory/60 transition-all hover:border-gold/50 hover:text-gold-light hover:bg-gold/[0.06]">
              <FacebookIcon width={20} height={20} />
            </a>
            <a href={waLink()} target="_blank" rel="noopener" aria-label="WhatsApp" className="press grid h-12 w-12 place-items-center rounded-full border border-gold/20 text-ivory/60 transition-all hover:border-gold/50 hover:text-gold-light hover:bg-gold/[0.06]">
              <WhatsAppIcon width={20} height={20} />
            </a>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-white/8 pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-ivory/40">© {new Date().getFullYear()} Nana Herbiotics · All rights reserved</p>
          <p className="flex items-center gap-2 text-sm text-ivory/40">
            <TruckIcon width={16} height={16} className="text-gold/50" />
            Cash on Delivery across Pakistan
          </p>
        </div>
      </div>
    </footer>
  )
}
