import { useEffect, useState } from 'react'
import { useCart, useCartCount } from '../store/cart'
import { CartIcon, CloseIcon, MenuIcon } from './Icons'

export const NAV = [
  { href: '#home', label: 'Home' },
  { href: '#shampoos', label: 'Shampoos' },
  { href: '#hair-care', label: 'Hair Care' },
  { href: '#skin-care', label: 'Skin Care' },
  { href: '#soaps', label: 'Soaps' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Monogram({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <text x="20" y="25.5" textAnchor="middle" fontFamily="Cinzel, Georgia, serif" fontWeight="700" fontSize="14" fill="currentColor">
        NH
      </text>
    </svg>
  )
}

export function Header() {
  const count = useCartCount()
  const setOpen = useCart((s) => s.setOpen)
  const toast = useCart((s) => s.toast)
  const [menu, setMenu] = useState(false)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    if (!toast) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 300)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  return (
    <header className="sticky top-0 z-40 border-b border-gold/25 bg-forest/95 text-ivory backdrop-blur-md supports-[backdrop-filter]:bg-forest/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <a href="#home" className="flex items-center gap-2.5 text-gold-light" aria-label="Nana Herbiotics home">
          <Monogram className="h-9 w-9" />
          <span className="font-display text-[17px] font-semibold tracking-wide">Nana Herbiotics</span>
        </a>

        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex gap-6 text-[15px]">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-ivory/85 transition-colors hover:text-gold-light">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="press relative grid h-11 w-11 place-items-center rounded-full hover:bg-white/10"
            aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
          >
            <CartIcon />
            {count > 0 && (
              <span
                className={`absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-forest-deep transition-transform duration-200 ${bump ? 'scale-125' : 'scale-100'}`}
              >
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            className="press grid h-11 w-11 place-items-center rounded-full hover:bg-white/10 lg:hidden"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? 'Close menu' : 'Open menu'}
          >
            {menu ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        className={`fixed inset-x-0 top-16 bottom-0 bg-forest-deep transition-[opacity,visibility] duration-200 lg:hidden ${menu ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <ul className="flex flex-col px-4 py-4">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={() => setMenu(false)}
                tabIndex={menu ? 0 : -1}
                className="block border-b border-gold/15 py-4 font-display text-xl text-ivory"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
