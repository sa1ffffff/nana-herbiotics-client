import { Monogram } from './Header'
import { WhatsAppIcon } from './Icons'
import { Divider } from './Ornaments'
import { EMAIL, waLink } from '../lib/shop'

/** Full-screen notice shown instead of the storefront while MAINTENANCE_MODE is on. */
export function Maintenance() {
  return (
    <div className="engraved grid min-h-screen place-items-center px-6 text-center text-ivory">
      <div className="reveal in max-w-sm">
        <Monogram className="mx-auto h-14 w-14 text-gold-light" />
        <p className="mt-5 font-display text-xs font-semibold tracking-[0.32em] text-gold uppercase">
          Nana Herbiotics
        </p>
        <h1 className="mt-4 font-serif-display text-[clamp(1.75rem,6vw,2.5rem)] font-bold leading-tight text-ivory text-balance">
          We'll be right back
        </h1>
        <Divider className="mx-auto mt-5 justify-center" />
        <p className="mt-6 text-[17px] leading-relaxed text-ivory/75">
          We're making a few improvements to the shop. Please check back shortly — we'll be open again soon.
        </p>
        <div className="mt-9 flex flex-col items-center gap-3">
          <a
            href={waLink("Assalam-o-Alaikum! I'd like to place an order while the website is being updated.")}
            target="_blank"
            rel="noopener"
            className="press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-7 text-[15px] font-semibold text-forest-deep hover:bg-gold-light"
          >
            <WhatsAppIcon width={18} height={18} /> Order on WhatsApp instead
          </a>
          <a href={`mailto:${EMAIL}`} className="text-sm text-ivory/60 underline-offset-4 hover:text-gold-light hover:underline">
            {EMAIL}
          </a>
        </div>
      </div>
    </div>
  )
}
