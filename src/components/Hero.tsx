import { byId } from '../data/products'
import { ProductImage } from './ProductImage'
import { LeafIcon, TruckIcon } from './Icons'

const trio = ['herbal-shampoo', 'hibiscus-shampoo', 'herbal-conditioner'].map((id) => byId(id)!)

export function Hero() {
  return (
    <section id="home" className="engraved relative overflow-hidden text-ivory">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 pb-12 md:grid-cols-[1.1fr_1fr] md:gap-12 md:py-20">
        <div className="text-center md:text-left">
          <h1 className="font-display text-[clamp(2.25rem,7vw,4rem)] font-bold leading-[1.05] text-balance text-ivory">
            Botanical Care, <span className="text-gold-light">Naturally</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-ivory/80 md:mx-0">
            Gentle, paraben-free hair and skin care made with herbs, flowers and botanical extracts. Made in small batches
            in Pakistan.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="#shampoos"
              className="press inline-flex h-12 w-full items-center justify-center rounded-full bg-gold px-8 text-base font-semibold text-forest-deep hover:bg-gold-light sm:w-auto"
            >
              Shop now
            </a>
            <a
              href="#about"
              className="press inline-flex h-12 w-full items-center justify-center rounded-full border border-gold/50 px-8 text-base font-medium text-ivory hover:bg-white/5 sm:w-auto"
            >
              Our story
            </a>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-ivory/70">
            <TruckIcon width={18} height={18} className="text-gold" /> Cash on Delivery across Pakistan
          </p>
        </div>

        <div className="label-frame relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-t-[999px] rounded-b-3xl bg-white px-3 pt-10 md:max-w-md">
          <div className="grid grid-cols-3 items-end gap-1">
            {trio.map((p, i) => (
              <ProductImage
                key={p.id}
                product={p}
                eager
                sizes="(min-width: 768px) 160px, 30vw"
                className={`aspect-[2/5] w-full object-cover ${i === 1 ? '' : 'origin-bottom scale-90'}`}
              />
            ))}
          </div>
          <p className="flex items-center justify-center gap-2 py-3 text-center font-display text-sm font-semibold tracking-wider text-forest">
            <LeafIcon width={16} height={16} className="text-gold" /> Rooted in Nature · Est. 2024
          </p>
        </div>
      </div>
    </section>
  )
}
