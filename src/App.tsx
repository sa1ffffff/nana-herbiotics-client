import { useEffect, useState } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ArrowUpIcon } from './components/Icons'
import { QuickView } from './components/QuickView'
import { About, Contact, Footer, ProductSection, Promises } from './components/Sections'
import { useCart } from './store/cart'

function Toast() {
  const toast = useCart((s) => s.toast)
  const setOpen = useCart((s) => s.setOpen)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!toast) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2600)
    return () => clearTimeout(t)
  }, [toast])
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-2xl bg-forest-deep px-4 py-3 text-ivory shadow-xl transition-[transform,opacity] duration-200 ease-[var(--ease-out)] sm:bottom-6 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <span className="text-[15px]">{toast?.text}</span>
      <button type="button" onClick={() => setOpen(true)} className="press shrink-0 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-forest-deep">
        View cart
      </button>
    </div>
  )
}

function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      className={`press fixed right-4 bottom-20 z-30 grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-forest text-gold-light shadow-lg transition-[opacity,transform] duration-200 sm:bottom-6 ${show ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
    >
      <ArrowUpIcon width={20} height={20} />
    </button>
  )
}

export default function App() {
  return (
    <>
      <a href="#shampoos" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2">
        Skip to products
      </a>
      <Header />
      <main>
        <Hero />
        <ProductSection id="shampoos" category="shampoos" title="Shampoos" intro="Two herbal shampoos for clean, healthy, shiny hair. Both are paraben free and sulfate free." />
        <ProductSection id="hair-care" category="hair-care" title="Hair Care" tone="white" intro="Follow your shampoo with our herbal conditioner for softer, stronger lengths." />
        <ProductSection id="skin-care" category="skin-care" title="Skin Care" intro="Gentle botanical care for face and body, from a daily face wash to a brightening serum." />
        <ProductSection id="soaps" category="soaps" title="Handmade Soaps" tone="white" intro="Small-batch herbal bars, poured and finished by hand. No two are exactly alike." />
        <Promises />
        <About />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <QuickView />
      <Toast />
      <BackToTop />
    </>
  )
}
