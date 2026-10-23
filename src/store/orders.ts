import { create } from 'zustand'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'

export interface Order {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  products: { name: string; size: string; qty: number; price: number }[]
  subtotal: number
  delivery: number
  total: number
  city: string
  address: string
  notes: string
  dateTime: string
}

const LOCAL_KEY = 'nh-orders-local'
function readLocal(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]')
  } catch {
    return []
  }
}
function writeLocal(list: Order[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
  } catch {
    /* storage blocked: the order still reached WhatsApp, it just isn't cached here */
  }
}

function fromRow(row: Record<string, unknown>): Order {
  return {
    orderId: row.order_id as string,
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    customerPhone: row.customer_phone as string,
    products: row.products as Order['products'],
    subtotal: row.subtotal as number,
    delivery: row.delivery as number,
    total: row.total as number,
    city: row.city as string,
    address: row.address as string,
    notes: (row.notes as string) ?? '',
    dateTime: new Date(row.created_at as string).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' }),
  }
}

interface OrdersState {
  orders: Order[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  /** Saves the order (Supabase when configured, otherwise this browser only). Never throws: a failed save still lets checkout continue to WhatsApp. */
  addOrder: (o: Order) => Promise<void>
  /** Loads every order. Requires an admin session when Supabase is configured. */
  load: () => Promise<void>
}

export const useOrders = create<OrdersState>((set, get) => ({
  orders: [],
  status: 'idle',
  addOrder: async (o) => {
    if (!SUPABASE_CONFIGURED) {
      const next = [o, ...readLocal()]
      writeLocal(next)
      set({ orders: next })
      return
    }
    try {
      const sb = await supabase()
      const { error } = await sb.from('orders').insert({
        order_id: o.orderId,
        customer_name: o.customerName,
        customer_email: o.customerEmail,
        customer_phone: o.customerPhone,
        products: o.products,
        subtotal: o.subtotal,
        delivery: o.delivery,
        total: o.total,
        city: o.city,
        address: o.address,
        notes: o.notes || null,
      })
      if (error) throw error
    } catch (err) {
      console.error('[orders] could not save order to Supabase; it is only on this device:', err)
      writeLocal([o, ...readLocal()])
    }
  },
  load: async () => {
    if (get().status === 'loading') return
    set({ status: 'loading' })
    if (!SUPABASE_CONFIGURED) {
      set({ orders: readLocal(), status: 'ready' })
      return
    }
    try {
      const sb = await supabase()
      const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false }).limit(500)
      if (error) throw error
      set({ orders: (data ?? []).map(fromRow), status: 'ready' })
    } catch {
      set({ status: 'error' })
    }
  },
}))
