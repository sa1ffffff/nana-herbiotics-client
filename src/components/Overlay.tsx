import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  label: string
  variant: 'drawer' | 'modal'
  children: ReactNode
}

/** Shared drawer/modal shell: keeps mounted during exit, Esc to close, focus trap, scroll lock. */
export function Overlay({ open, onClose, label, variant, children }: Props) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement
      setMounted(true)
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
      return () => cancelAnimationFrame(r)
    }
    setShown(false)
    const t = setTimeout(() => setMounted(false), 220)
    lastFocus.current?.focus?.()
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!mounted) return null

  const drawer = variant === 'drawer'
  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-forest-deep/50 transition-opacity duration-200 ${shown ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={
          drawer
            ? `absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white text-ink shadow-2xl outline-none transition-transform duration-300 ease-[var(--ease-drawer)] ${shown ? 'translate-x-0' : 'translate-x-full'}`
            : `absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-3xl bg-white text-ink outline-none transition-[transform,opacity] duration-250 ease-[var(--ease-out)] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(880px,calc(100vw-32px))] sm:rounded-3xl ${shown ? 'translate-y-0 opacity-100 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:scale-100' : 'translate-y-8 opacity-0 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:scale-[0.96]'}`
        }
      >
        {children}
      </div>
    </div>
  )
}
