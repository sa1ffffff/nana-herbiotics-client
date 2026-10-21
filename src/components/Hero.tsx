import { TruckIcon } from './Icons'

export function Hero() {
  return (
    <section id="home" className="relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-forest-deep text-ivory md:items-center">
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
      {/* Deep green fade so the headline reads over the leaves */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_32_24/0.95)_0%,rgb(14_32_24/0.7)_45%,rgb(14_32_24/0.15)_100%)] md:bg-[linear-gradient(to_right,rgb(14_32_24/0.92)_0%,rgb(14_32_24/0.72)_38%,rgb(14_32_24/0.1)_75%)]"
      />

      <div className="hero-copy mx-auto w-full max-w-6xl px-5 pb-14 pt-32 md:py-24">
        <p className="font-sans text-xs font-semibold tracking-[0.32em] text-gold-light uppercase sm:text-sm">
          Est. 2024 · Rooted in Nature
        </p>
        <h1 className="mt-5 font-serif-display text-[clamp(2.9rem,9vw,6rem)] leading-[0.98] font-bold tracking-[-0.02em] text-balance text-ivory">
          Botanical Care,
          <span className="mt-1 block font-semibold text-gold-light italic">Naturally</span>
        </h1>
        <p className="mt-6 max-w-[34ch] text-[17px] leading-relaxed text-ivory/85 sm:text-lg">
          Gentle herbal care for hair and skin, made with real botanicals and free from parabens and harsh sulfates.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#shampoos"
            className="press inline-flex h-13 items-center justify-center rounded-full bg-gold px-9 text-base font-semibold text-forest-deep shadow-[0_10px_30px_-10px_rgb(200_162_74/0.7)] hover:bg-gold-light"
          >
            Shop now
          </a>
          <a
            href="#about"
            className="press inline-flex h-13 items-center justify-center rounded-full border border-ivory/35 px-7 text-base font-medium text-ivory backdrop-blur-sm hover:bg-white/10"
          >
            Our story
          </a>
        </div>
        <p className="mt-8 inline-flex items-center gap-2 text-sm text-ivory/75">
          <TruckIcon width={18} height={18} className="text-gold" /> Cash on Delivery across Pakistan
        </p>
      </div>
    </section>
  )
}
