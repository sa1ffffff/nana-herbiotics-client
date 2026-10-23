import { create } from 'zustand'
import type { Category, Product } from '../data/products'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'

export type AdminProduct = Product & { adminAdded: true }

const LOCAL_KEY = 'nh-admin-products'
function readLocal(): AdminProduct[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]')
  } catch {
    return []
  }
}
function writeLocal(list: AdminProduct[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
  } catch {
    /* storage blocked: product simply isn't kept */
  }
}

type NewProduct = Omit<Product, 'id'> & { imageFile?: File | null }

/** Image path/URL for a brand-new admin product, before the row has an id to name a path with. */
async function uploadImage(id: string, file: File): Promise<string> {
  const sb = await supabase()
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const path = `${id}.${ext}`
  const { error } = await sb.storage.from('product-images').upload(path, file, { upsert: true, cacheControl: '3600' })
  if (error) throw error
  const { data } = sb.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

function slugify(name: string) {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return `${base || 'product'}-${Date.now().toString(36)}`
}

interface AdminProductsState {
  products: AdminProduct[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  load: () => Promise<void>
  addProduct: (p: NewProduct) => Promise<void>
  removeProduct: (id: string) => Promise<void>
}

async function fetchAll(): Promise<AdminProduct[]> {
  if (!SUPABASE_CONFIGURED) return readLocal()
  const sb = await supabase()
  const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map((row) => ({ ...row, adminAdded: true }) as AdminProduct)
}

export const useAdminProducts = create<AdminProductsState>((set, get) => ({
  products: [],
  status: 'idle',
  load: async () => {
    if (get().status === 'loading') return
    set({ status: 'loading' })
    try {
      set({ products: await fetchAll(), status: 'ready' })
    } catch {
      set({ status: 'error' })
    }
  },
  addProduct: async (p) => {
    const id = slugify(p.name)
    let image = p.image
    if (p.imageFile) image = await uploadImage(id, p.imageFile)

    const row = {
      id,
      name: p.name,
      category: p.category as Category,
      size: p.size,
      price: p.price,
      short: p.short,
      long: p.long,
      ingredients: p.ingredients,
      badges: p.badges,
      image,
      alt: p.alt,
    }

    if (!SUPABASE_CONFIGURED) {
      const next = [...readLocal(), { ...row, adminAdded: true as const }]
      writeLocal(next)
      set({ products: next })
      return
    }
    const sb = await supabase()
    const { error } = await sb.from('products').insert(row)
    if (error) throw error
    set({ products: [...get().products, { ...row, adminAdded: true }] })
  },
  removeProduct: async (id) => {
    if (!SUPABASE_CONFIGURED) {
      const next = readLocal().filter((p) => p.id !== id)
      writeLocal(next)
      set({ products: next })
      return
    }
    const sb = await supabase()
    const { error } = await sb.from('products').delete().eq('id', id)
    if (error) throw error
    // Best-effort: also remove any uploaded image at <id>.<ext>; harmless if none exists.
    try {
      const { data } = await sb.storage.from('product-images').list('', { search: id })
      const names = (data ?? []).map((f) => f.name).filter((n) => n.startsWith(`${id}.`))
      if (names.length) await sb.storage.from('product-images').remove(names)
    } catch {
      /* image cleanup is best-effort */
    }
    set({ products: get().products.filter((p) => p.id !== id) })
  },
}))

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'shampoos', label: 'Shampoos' },
  { value: 'hair-care', label: 'Hair Care' },
  { value: 'skin-care', label: 'Skin Care' },
  { value: 'soaps', label: 'Soaps' },
]
