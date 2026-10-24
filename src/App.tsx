import { lazy, Suspense, useEffect, useState } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ArrowUpIcon } from './components/Icons'
import { QuickView } from './components/QuickView'
import { ReviewForm, Reviews } from './components/Reviews'
import { About, Contact, Footer, MarqueeBand, ProductSection, Promises } from './components/Sections'
import { useCart } from './store/cart'
import { useAuth } from './store/auth'
import { AdminLogin } from './components/AdminLogin'
import { Maintenance } from './components/Maintenance'
import { MAINTENANCE_MODE } from './lib/maintenance'
import { useAdminProducts } from './store/admin-products'

// The admin dashboard (and the xlsx export library it pulls in) is heavy and only
// ever rendered for the two admin accounts, so it ships as its own chunk.
const AdminPanel = lazy(() => import('./components/AdminPanel').then((m) => ({ default: m.AdminPanel })))

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
      className={`fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-2xl bg-forest-deep/95 px-5 py-3.5 text-ivory shadow-[0_16px_48px_-16px_rgb(14_32_24/0.6)] backdrop-blur-lg transition-[transform,opacity] duration-300 ease-[var(--ease-out)] sm:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <span className="text-[15px]">{toast?.text}</span>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="press shrink-0 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-forest-deep shadow-[0_4px_12px_-4px_rgb(200_162_74/0.5)] transition-shadow hover:shadow-[0_6px_16px_-4px_rgb(200_162_74/0.6)]"
      >
        View cart
      </button>
    </div>
  )
}

function BackToTop() {
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight)
      // Calculate scroll progress
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      className={`press fixed right-4 bottom-[7.5rem] z-30 grid h-12 w-12 place-items-center rounded-full bg-forest/90 text-gold-light shadow-[0_8px_24px_-8px_rgb(14_32_24/0.5)] backdrop-blur-sm transition-[opacity,transform] duration-300 sm:bottom-6 ${
        show ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      {/* Scroll progress ring */}
      <svg className="scroll-progress-ring absolute inset-0" viewBox="0 0 48 48" aria-hidden>
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.15"
        />
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <ArrowUpIcon width={18} height={18} />
    </button>
  )
}

function PublicSite() {
  return (
    <>
      <a href="#shampoos" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-forest-deep focus:font-semibold">
        Skip to products
      </a>
      <Header />
      <main>
        <Hero />
        <MarqueeBand />
        <ProductSection id="shampoos" category="shampoos" title="Shampoos" intro="Two herbal shampoos for clean, healthy, shiny hair. Both are paraben free and sulfate free." />
        <ProductSection id="hair-care" category="hair-care" title="Hair Care" tone="light" intro="Follow your shampoo with our herbal conditioner for softer, stronger lengths." />
        <ProductSection id="skin-care" category="skin-care" title="Skin Care" intro="Gentle botanical care for face and body, from a daily face wash to a brightening serum." />
        <ProductSection id="soaps" category="soaps" title="Handmade Soaps" tone="light" intro="Small-batch herbal bars, poured and finished by hand. No two are exactly alike." />
        <Promises />
        <Reviews />
        <About />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <QuickView />
      <ReviewForm />
      <Toast />
      <BackToTop />
    </>
  )
}

export default function App() {
  const { user, isAdmin, loading, init, setShowLogin } = useAuth()
  const [page, setPage] = useState<'public' | 'admin'>('public')

  // Initialize auth on mount
  useEffect(() => { init() }, [init])

  // Admin-added products are shared across every visitor, so everyone loads them,
  // not only the admin.
  const loadAdminProducts = useAdminProducts((s) => s.load)
  useEffect(() => { loadAdminProducts() }, [loadAdminProducts])

  // Auto-redirect to admin if admin user
  useEffect(() => {
    if (isAdmin) setPage('admin')
    else setPage('public')
  }, [isAdmin])

  // Handle hash-based routing
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        if (isAdmin) {
          setPage('admin')
        } else {
          setShowLogin(true)
        }
      }
    }
    window.addEventListener('hashchange', handleHash)
    if (window.location.hash === '#admin') {
      if (isAdmin) setPage('admin')
      else setShowLogin(true)
    }
    return () => window.removeEventListener('hashchange', handleHash)
  }, [isAdmin, setShowLogin])

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-forest-deep">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
          <p className="mt-4 font-display text-ivory/60">Loading…</p>
        </div>
      </div>
    )
  }

  if (page === 'admin' && isAdmin) {
    return (
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-forest-deep">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
          </div>
        }
      >
        <AdminPanel onViewSite={() => setPage('public')} />
      </Suspense>
    )
  }

  // Admins always bypass maintenance mode, so they can keep working (and flip
  // the flag back off) while the public sees the notice below.
  if (MAINTENANCE_MODE && !isAdmin) {
    return (
      <>
        <Maintenance />
        <AdminLogin />
      </>
    )
  }

  return (
    <>
      <AdminLogin />
      {isAdmin && (
        <aside
          aria-label="Admin bar"
          className="sticky top-0 z-50 flex h-10 items-center justify-between border-b border-gold/30 bg-forest-deep/95 px-4 text-xs text-gold-light backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="font-medium">Admin: <span className="text-ivory">{user?.email}</span></span>
          </div>
          <button
            type="button"
            onClick={() => setPage('admin')}
            className="press flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1 font-semibold text-gold-light transition-colors hover:bg-gold/30"
          >
            Go to Admin Dashboard &rarr;
          </button>
        </aside>
      )}
      <PublicSite />
    </>
  )
}
