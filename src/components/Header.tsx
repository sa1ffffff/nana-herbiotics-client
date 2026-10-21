import { useEffect, useRef, useState } from 'react'
import { useCart, useCartCount } from '../store/cart'
import { CartIcon, CloseIcon, MenuIcon } from './Icons'

export const NAV = [
  { href: '#home', label: 'Home' },
  { href: '#shampoos', label: 'Shampoos' },
  { href: '#hair-care', label: 'Hair Care' },
  { href: '#skin-care', label: 'Skin Care' },
  { href: '#soaps', label: 'Soaps' },
  { href: '#reviews', label: 'Reviews' },
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
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('#home')
  const headerRef = useRef<HTMLElement>(null)

  // Badge bump animation on add-to-cart
  useEffect(() => {
    if (!toast) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 300)
    return () => clearTimeout(t)
  }, [toast])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  // Track scroll for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking with IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV.map((n) => n.href.slice(1))
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <header
      ref={headerRef}
      className={`header-glass sticky top-0 z-40 text-ivory transition-all duration-500 ${scrolled ? '' : 'at-top'}`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 text-gold-light transition-colors hover:text-gold" aria-label="Nana Herbiotics home">
          <Monogram className="h-10 w-10" />
          <div className="hidden min-[400px]:block">
            <span className="block font-display text-[17px] font-semibold tracking-wide">Nana Herbiotics</span>
            <span className="block text-[10px] font-medium tracking-[0.2em] text-gold/60 uppercase">Botanical Care</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex gap-1 text-[15px]">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className={`relative px-3.5 py-2 transition-colors duration-200 ${
                    activeSection === n.href
                      ? 'text-gold-light'
                      : 'text-ivory/75 hover:text-ivory'
                  }`}
                >
                  {n.label}
                  {activeSection === n.href && (
                    <span className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="press relative grid h-12 w-12 place-items-center rounded-full transition-colors hover:bg-white/10"
            aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
          >
            <CartIcon />
            {count > 0 && (
              <span
                className={`absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-forest-deep ${bump ? 'badge-bump' : ''}`}
              >
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            className="press grid h-12 w-12 place-items-center rounded-full transition-colors hover:bg-white/10 lg:hidden"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? 'Close menu' : 'Open menu'}
          >
            {menu ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu - full screen overlay with staggered animation */}
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        className={`fixed inset-x-0 top-[72px] bottom-0 bg-forest-deep/98 backdrop-blur-xl transition-[opacity,visibility] duration-300 lg:hidden ${
          menu ? 'visible opacity-100 menu-open' : 'invisible opacity-0'
        }`}
      >
        <ul className="menu-stagger flex flex-col px-6 py-6">
          {NAV.map((n, i) => (
            <li key={n.href} style={{ '--i': i } as React.CSSProperties}>
              <a
                href={n.href}
                onClick={() => setMenu(false)}
                tabIndex={menu ? 0 : -1}
                className={`flex items-center justify-between border-b border-gold/10 py-5 font-display text-xl transition-colors ${
                  activeSection === n.href ? 'text-gold-light' : 'text-ivory'
                }`}
              >
                {n.label}
                {activeSection === n.href && (
                  <span className="h-2 w-2 rounded-full bg-gold" />
                )}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 px-6 text-center">
          <p className="text-sm text-ivory/50">Botanical Care, Naturally</p>
          <p className="mt-1 font-display text-xs tracking-[0.2em] text-gold/40 uppercase">ESTD 2024</p>
        </div>
      </nav>
    </header>
  )
}
