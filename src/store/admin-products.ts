import { create } from 'zustand'
import type { Category, Product } from '../data/products'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'

export type AdminProduct = Product & { adminAdded: true }

const LOCAL_KEY = 'nh-admin-products'
const LOCAL_REMOVED_KEY = 'nh-removed-products'

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

function readLocalRemoved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_REMOVED_KEY) ?? '[]')
  } catch {
    return []
  }
}
function writeLocalRemoved(list: string[]) {
  try {
    localStorage.setItem(LOCAL_REMOVED_KEY, JSON.stringify(list))
  } catch {
    /* storage blocked */
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
  removedIds: string[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  load: () => Promise<void>
  addProduct: (p: NewProduct) => Promise<void>
  removeProduct: (id: string) => Promise<void>
  restoreProduct: (id: string) => Promise<void>
}

async function fetchAll(): Promise<AdminProduct[]> {
  if (!SUPABASE_CONFIGURED) return readLocal()
  const sb = await supabase()
  const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map((row) => ({ ...row, adminAdded: true }) as AdminProduct)
}

async function fetchRemoved(): Promise<string[]> {
  if (!SUPABASE_CONFIGURED) return readLocalRemoved()
  try {
    const sb = await supabase()
    const { data, error } = await sb.storage.from('product-images').download('removed-products.json')
    if (error || !data) return readLocalRemoved()
    const text = await data.text()
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) {
      writeLocalRemoved(parsed)
      return parsed
    }
  } catch {
    /* fallback to local cache */
  }
  return readLocalRemoved()
}

async function persistRemoved(ids: string[]): Promise<void> {
  writeLocalRemoved(ids)
  if (!SUPABASE_CONFIGURED) return
  try {
    const sb = await supabase()
    const blob = new Blob([JSON.stringify(ids)], { type: 'application/json' })
    await sb.storage.from('product-images').upload('removed-products.json', blob, {
      upsert: true,
      cacheControl: '0',
    })
  } catch (err) {
    console.warn('Could not persist removed-products.json to Supabase storage:', err)
  }
}

export const useAdminProducts = create<AdminProductsState>((set, get) => ({
  products: readLocal(),
  removedIds: readLocalRemoved(),
  status: 'idle',
  load: async () => {
    if (get().status === 'loading') return
    set({ status: 'loading' })
    try {
      const [remoteProducts, remoteRemoved] = await Promise.all([
        fetchAll(),
        fetchRemoved(),
      ])
      writeLocal(remoteProducts)
      writeLocalRemoved(remoteRemoved)
      set({ products: remoteProducts, removedIds: remoteRemoved, status: 'ready' })
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
    const next = [...get().products, { ...row, adminAdded: true as const }]
    writeLocal(next)
    set({ products: next })
  },
  removeProduct: async (id) => {
    const state = get()
    const isAdminAdded = state.products.some((p) => p.id === id)

    // 1. If it was added to the Supabase products table, remove it there and clean up images.
    if (isAdminAdded) {
      if (!SUPABASE_CONFIGURED) {
        const next = readLocal().filter((p) => p.id !== id)
        writeLocal(next)
        set({ products: next })
      } else {
        const sb = await supabase()
        const { error } = await sb.from('products').delete().eq('id', id)
        if (error) throw error
        try {
          const { data } = await sb.storage.from('product-images').list('', { search: id })
          const names = (data ?? []).map((f) => f.name).filter((n) => n.startsWith(`${id}.`))
          if (names.length) await sb.storage.from('product-images').remove(names)
        } catch {
          /* image cleanup is best-effort */
        }
        const next = state.products.filter((p) => p.id !== id)
        writeLocal(next)
        set({ products: next })
      }
    }

    // 2. Mark in removedIds so built-in products (and any cached products) disappear everywhere.
    if (!state.removedIds.includes(id)) {
      const nextRemoved = [...state.removedIds, id]
      set({ removedIds: nextRemoved })
      await persistRemoved(nextRemoved)
    }
  },
  restoreProduct: async (id) => {
    const state = get()
    if (!state.removedIds.includes(id)) return
    const nextRemoved = state.removedIds.filter((item) => item !== id)
    set({ removedIds: nextRemoved })
    await persistRemoved(nextRemoved)
  },
}))

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'shampoos', label: 'Shampoos' },
  { value: 'hair-care', label: 'Hair Care' },
  { value: 'skin-care', label: 'Skin Care' },
  { value: 'soaps', label: 'Soaps' },
]
