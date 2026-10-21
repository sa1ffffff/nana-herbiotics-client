import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { byId } from '../data/products'

export interface CartLine {
  productId: string
  qty: number
}

interface CartState {
  lines: CartLine[]
  open: boolean
  step: 'cart' | 'checkout' | 'done'
  quickView: string | null
  toast: { id: number; text: string } | null
  add: (productId: string, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  setOpen: (open: boolean) => void
  setStep: (step: CartState['step']) => void
  setQuickView: (id: string | null) => void
}

export const MAX_QTY = 99
const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, n))

const storage = createJSONStorage(() => {
  try {
    localStorage.setItem('__nh', '1')
    localStorage.removeItem('__nh')
    return localStorage
  } catch {
    const mem = new Map<string, string>()
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    }
  }
})

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      step: 'cart',
      quickView: null,
      toast: null,
      add: (productId, qty = 1) =>
        set((s) => {
          const has = s.lines.some((l) => l.productId === productId)
          const lines = has
            ? s.lines.map((l) => (l.productId === productId ? { ...l, qty: clamp(l.qty + qty) } : l))
            : [...s.lines, { productId, qty: clamp(qty) }]
          return { lines, toast: { id: Date.now(), text: `${byId(productId)?.name ?? 'Item'} added to cart` } }
        }),
      setQty: (productId, qty) =>
        set((s) => ({ lines: s.lines.map((l) => (l.productId === productId ? { ...l, qty: clamp(qty) } : l)) })),
      remove: (productId) => set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set((s) => ({ open, step: open && s.step === 'done' ? 'cart' : s.step })),
      setStep: (step) => set({ step }),
      setQuickView: (quickView) => set({ quickView }),
    }),
    { name: 'nh-cart', storage, partialize: (s) => ({ lines: s.lines }) as Partial<CartState> },
  ),
)

export const useCartCount = () => useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0))
export const useSubtotal = () =>
  useCart((s) => s.lines.reduce((n, l) => n + (byId(l.productId)?.price ?? 0) * l.qty, 0))
