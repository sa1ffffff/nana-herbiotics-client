import { TruckIcon, WhatsAppIcon } from './Icons'
import { waLink } from '../lib/shop'

export function Hero() {
  return (
    <section id="home" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-forest-deep text-ivory md:items-center">
      {/* Background image with premium treatment */}
      <picture>
        <source media="(max-width: 767px)" srcSet="/hero-mobile.webp" />
        <img
          src="/hero-1600.webp"
          srcSet="/hero-900.webp 900w, /hero-1600.webp 1600w, /hero-2400.webp 2400w"
          sizes="100vw"
          alt="A red hibiscus flower among deep green leaves"
          fetchPriority="high"
          className="hero-photo absolute inset-0 -z-20 h-full w-full object-cover object-[50%_20%] md:object-[70%_center]"
        />
      </picture>

      {/* Multi-layer gradients for depth */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(15_33_25/0.97)_0%,rgb(15_33_25/0.75)_40%,rgb(15_33_25/0.15)_100%)] md:bg-[linear-gradient(to_right,rgb(15_33_25/0.95)_0%,rgb(15_33_25/0.75)_35%,rgb(15_33_25/0.08)_75%)]"
      />
      {/* Subtle gold grain overlay */}
      <div
        aria-hidden
        className="absolute inset-0 -z-[5] opacity-[0.03]"
        style={{ backgroundImage: `radial-gradient(circle, var(--color-gold) 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
      />

      <div className="hero-copy mx-auto w-full max-w-6xl px-5 pb-16 pt-36 md:py-28 lg:py-32">
        {/* Eyebrow */}
        <p className="font-display text-[11px] font-semibold tracking-[0.35em] text-gold uppercase sm:text-[13px]">
          Est. 2026 · Rooted in Nature
        </p>

        {/* Headline */}
        <h1 className="mt-6 font-serif-display text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] font-bold tracking-[-0.02em] text-balance text-ivory">
          Botanical Care,
          <span className="mt-2 block font-semibold text-gold-light italic">
            Naturally
          </span>
        </h1>

        {/* Subline */}
        <p className="mt-7 max-w-[36ch] text-[17px] leading-relaxed text-ivory/80 sm:text-lg sm:leading-relaxed">
          Gentle herbal care for hair and skin, made with real botanicals and free from parabens and harsh sulfates.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#shampoos"
            className="press group/btn relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gold px-10 text-base font-semibold text-forest-deep shadow-[0_12px_40px_-12px_rgb(200_162_74/0.65)] transition-shadow hover:shadow-[0_16px_48px_-12px_rgb(200_162_74/0.8)]"
          >
            <span className="relative z-10">Shop now</span>
            <span className="absolute inset-0 bg-gold-bright opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
          </a>
          <a
            href="#about"
            className="press inline-flex h-14 items-center justify-center rounded-full border border-ivory/30 px-8 text-base font-medium text-ivory backdrop-blur-sm transition-all duration-200 hover:border-gold/50 hover:bg-white/10 hover:text-gold-light"
          >
            Our story
          </a>
        </div>

        {/* Trust bar */}
        <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-ivory/65">
          <span className="inline-flex items-center gap-2">
            <TruckIcon width={18} height={18} className="text-gold" /> Cash on Delivery
          </span>
          <span className="hidden h-4 w-px bg-gold/30 sm:block" aria-hidden />
          <span className="hidden items-center gap-2 sm:inline-flex">
            ✦ Paraben Free
          </span>
          <span className="hidden h-4 w-px bg-gold/30 md:block" aria-hidden />
          <span className="hidden items-center gap-2 md:inline-flex">
            ✦ 100% Herbal
          </span>
        </div>
      </div>

      {/* Circular badge - rotates slowly */}
      <div className="absolute right-4 top-24 hidden lg:block" aria-hidden>
        <div className="circular-badge h-28 w-28 text-gold/40">
          <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
            <defs>
              <path id="badge-circle" d="M60 10 a50 50 0 1 1 -1 0" />
            </defs>
            <text fontSize="11" fontFamily="Cinzel, serif" fontWeight="600" letterSpacing="3" fill="currentColor">
              <textPath href="#badge-circle">ROOTED IN NATURE • ESTD 2026 •</textPath>
            </text>
          </svg>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href={waLink('Assalam-o-Alaikum! I saw your website and I\'m interested in Nana Herbiotics products.')}
        target="_blank"
        rel="noopener"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon width={28} height={28} />
      </a>
    </section>
  )
}
