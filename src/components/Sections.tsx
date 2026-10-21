import { useEffect, useRef, type ReactNode } from 'react'
import { inCategory, type Category } from '../data/products'
import { EMAIL, FACEBOOK_URL, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_TEL, waLink } from '../lib/shop'
import { ProductCard } from './ProductCard'
import { Monogram } from './Header'
import { Corners, Divider } from './Ornaments'
import {
  DropIcon, FacebookIcon, FlaskIcon, HeartIcon, InstagramIcon, MailIcon, PhoneIcon, SproutIcon, TruckIcon, WhatsAppIcon,
} from './Icons'

function useReveal<T extends HTMLElement>() {
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
      { rootMargin: '0px 0px -80px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function SectionHead({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="mx-auto mb-10 max-w-xl text-center">
      <h2 className="font-display text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold leading-tight text-forest">{title}</h2>
      <Divider className="mt-3 justify-center" />
      <p className="mt-4 text-[17px] leading-relaxed text-pretty text-ink/75">{intro}</p>
    </div>
  )
}

export function ProductSection({ id, category, title, intro, tone = 'ivory' }: {
  id: string; category: Category; title: string; intro: string; tone?: 'ivory' | 'white'
}) {
  const ref = useReveal<HTMLDivElement>()
  const items = inCategory(category)
  const cols = items.length === 2 ? 'grid-cols-2 mx-auto max-w-4xl' : 'grid-cols-2 lg:grid-cols-3'
  return (
    <section id={id} className={tone === 'white' ? 'bg-white/60' : ''}>
      <div ref={ref} className="reveal mx-auto max-w-6xl px-4 py-14 md:py-20">
        <SectionHead title={title} intro={intro} />
        <div className={`stagger grid gap-3 sm:gap-6 ${cols}`}>
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

const PROMISES: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <FlaskIcon />, title: 'Paraben free', text: 'No parabens in any of our formulas.' },
  { icon: <DropIcon />, title: 'Sulfate free', text: 'Gentle cleansing that does not strip your hair.' },
  { icon: <SproutIcon />, title: '100% herbal', text: 'Herbs, flowers and botanical extracts.' },
  { icon: <HeartIcon />, title: 'Safe for all hair types', text: 'Kind to every kind of hair, for the whole family.' },
]

export function Promises() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="engraved text-ivory" aria-labelledby="why">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 id="why" className="text-center font-display text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold text-ivory">
          Why Nana Herbiotics
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {PROMISES.map((p) => (
            <li key={p.title} className="flex flex-col items-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/70 text-gold-light outline outline-1 outline-offset-4 outline-gold/30">
                {p.icon}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-gold-light">{p.title}</h3>
              <p className="mt-1.5 max-w-[22ch] text-sm leading-relaxed text-ivory/75">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function About() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="bg-white/60">
      <div ref={ref} className="reveal mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[auto_1fr] md:gap-16 md:py-20">
        <div className="relative mx-auto grid h-52 w-44 place-items-center rounded-2xl bg-forest text-gold-light label-frame md:h-64 md:w-56">
          <Corners className="text-gold/60" size="h-6 w-6" inset="m-2" />
          <div className="text-center">
            <Monogram className="mx-auto h-20 w-20 md:h-24 md:w-24" />
            <p className="mt-2 font-display text-xs tracking-[0.2em]">ESTD · 2024</p>
          </div>
        </div>
        <div className="max-w-2xl">
          <h2 className="font-display text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold leading-tight text-forest">Rooted in nature</h2>
          <Divider className="mt-3" />
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink/80">
            <p>
              Nana Herbiotics started in 2024 with a simple idea: care for your hair and skin the way our grandmothers did,
              with plants instead of harsh chemicals.
            </p>
            <p>
              We make our shampoos, washes, serum and handmade soaps in small batches, using herbs, flowers and botanical
              extracts. Every formula is paraben free and gentle enough for the whole family.
            </p>
            <p className="font-display text-lg text-forest">Botanical care, naturally.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="contact">
      <div ref={ref} className="reveal mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <h2 className="font-display text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold leading-tight text-forest">Get in touch</h2>
          <Divider className="mt-3" />
          <p className="mt-4 mb-8 max-w-md text-[17px] leading-relaxed text-ink/75">Questions about a product, or want to order by message? We usually reply the same day.</p>
          <div className="flex flex-col gap-3">
            <a
              href={waLink('Assalam-o-Alaikum! I have a question about Nana Herbiotics products.')}
              target="_blank"
              rel="noopener"
              className="press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1f8f4e] px-6 font-semibold text-white hover:bg-[#197a42] sm:self-start"
            >
              <WhatsAppIcon width={20} height={20} /> Chat on WhatsApp
            </a>
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-3 py-2 text-forest hover:underline">
              <PhoneIcon width={20} height={20} className="text-gold" /> {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 py-2 break-all text-forest hover:underline">
              <MailIcon width={20} height={20} className="shrink-0 text-gold" /> {EMAIL}
            </a>
            <p className="mt-2 inline-flex items-center gap-3 rounded-xl bg-forest/5 px-4 py-3 text-[15px] text-forest">
              <TruckIcon width={20} height={20} className="shrink-0 text-gold" />
              Cash on Delivery available across Pakistan
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}

function ContactForm() {
  return (
    <form
      className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_-12px_rgba(14,32,24,0.18)] sm:p-6"
      onSubmit={(e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const subject = `Website message from ${f.get('name')}`
        const body = `${f.get('message')}\n\n${f.get('name')} (${f.get('email')})`
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      }}
    >
      <h3 className="font-display text-xl font-semibold text-forest">Send us an email</h3>
      <div className="mt-5 space-y-4">
        <Field label="Your name" name="name" autoComplete="name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/80">Message</span>
          <textarea name="message" required rows={4} className="w-full rounded-xl border border-forest/20 bg-ivory/40 px-4 py-3 outline-none focus:border-forest" />
        </label>
      </div>
      <button type="submit" className="press mt-5 h-12 w-full rounded-full bg-forest font-semibold text-ivory hover:bg-forest-deep">
        Send message
      </button>
      <p className="mt-3 text-center text-xs text-ink/60">Opens your email app with the message ready to send.</p>
    </form>
  )
}

export function Field({ label, error, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      <input
        required
        {...rest}
        aria-invalid={!!error || undefined}
        className={`h-12 w-full rounded-xl border bg-ivory/40 px-4 outline-none focus:border-forest ${error ? 'border-hibiscus' : 'border-forest/20'}`}
      />
      {error && <span className="mt-1 block text-sm text-hibiscus">{error}</span>}
    </label>
  )
}

export function Footer() {
  return (
    <footer className="bg-forest-deep text-ivory/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3 text-gold-light">
          <Monogram className="h-11 w-11" />
          <div>
            <p className="font-display text-lg font-semibold">Nana Herbiotics</p>
            <p className="text-sm text-ivory/60">Botanical Care, Naturally</p>
          </div>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-[15px]">
          <a href="#shampoos" className="hover:text-gold-light">Shampoos</a>
          <a href="#skin-care" className="hover:text-gold-light">Skin Care</a>
          <a href="#hair-care" className="hover:text-gold-light">Hair Care</a>
          <a href="#soaps" className="hover:text-gold-light">Soaps</a>
          <a href="#about" className="hover:text-gold-light">About</a>
          <a href="#contact" className="hover:text-gold-light">Contact</a>
        </nav>
        <div className="flex gap-2">
          <a href={INSTAGRAM_URL} aria-label="Instagram" className="press grid h-11 w-11 place-items-center rounded-full border border-gold/30 hover:text-gold-light">
            <InstagramIcon width={20} height={20} />
          </a>
          <a href={FACEBOOK_URL} aria-label="Facebook" className="press grid h-11 w-11 place-items-center rounded-full border border-gold/30 hover:text-gold-light">
            <FacebookIcon width={20} height={20} />
          </a>
          <a href={waLink()} target="_blank" rel="noopener" aria-label="WhatsApp" className="press grid h-11 w-11 place-items-center rounded-full border border-gold/30 hover:text-gold-light">
            <WhatsAppIcon width={20} height={20} />
          </a>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-5 text-center text-sm text-ivory/50">
        © {new Date().getFullYear()} Nana Herbiotics · Cash on Delivery across Pakistan
      </p>
    </footer>
  )
}
