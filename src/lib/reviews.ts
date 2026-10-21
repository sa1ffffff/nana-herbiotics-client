import { create } from 'zustand'

export interface Review {
  id: string
  product_id: string
  name: string
  city: string | null
  rating: number
  title: string | null
  body: string
  created_at: string
}

export type NewReview = Omit<Review, 'id' | 'created_at'>

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True once Supabase env vars are set. Without them reviews live in this browser only. */
export const REVIEWS_LIVE = Boolean(URL && KEY)

// Loaded on demand so the Supabase client never weighs down the first paint.
let clientPromise: Promise<import('@supabase/supabase-js').SupabaseClient> | null = null
function client() {
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(URL!, KEY!, { auth: { persistSession: false } }),
  )
  return clientPromise
}

const LOCAL_KEY = 'nh-reviews-local'
function readLocal(): Review[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]')
  } catch {
    return []
  }
}
function writeLocal(list: Review[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
  } catch {
    /* storage blocked: the review simply isn't kept */
  }
}

async function fetchApproved(): Promise<Review[]> {
  if (!REVIEWS_LIVE) return readLocal()
  const sb = await client()
  const { data, error } = await sb
    .from('reviews')
    .select('id, product_id, name, city, rating, title, body, created_at')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw error
  return data as Review[]
}

async function insert(r: NewReview): Promise<'pending' | 'published'> {
  if (!REVIEWS_LIVE) {
    writeLocal([{ ...r, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...readLocal()])
    return 'published'
  }
  const sb = await client()
  // RLS only allows unapproved inserts; you approve rows in the Supabase dashboard.
  const { error } = await sb.from('reviews').insert({ ...r, approved: false })
  if (error) throw error
  return 'pending'
}

interface ReviewState {
  reviews: Review[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  load: () => Promise<void>
  submit: (r: NewReview) => Promise<'pending' | 'published'>
}

export const useReviews = create<ReviewState>((set, get) => ({
  reviews: [],
  status: 'idle',
  load: async () => {
    if (get().status === 'loading') return
    set({ status: 'loading' })
    try {
      set({ reviews: await fetchApproved(), status: 'ready' })
    } catch {
      set({ status: 'error' })
    }
  },
  submit: async (r) => {
    const result = await insert(r)
    if (result === 'published') set({ reviews: readLocal() })
    return result
  },
}))

export interface RatingSummary {
  average: number
  count: number
  /** counts for 5,4,3,2,1 stars */
  bars: number[]
}

export function summarize(list: Review[]): RatingSummary {
  const bars = [0, 0, 0, 0, 0]
  let total = 0
  for (const r of list) {
    bars[5 - r.rating]++
    total += r.rating
  }
  return { average: list.length ? total / list.length : 0, count: list.length, bars }
}

export const useProductRating = (productId: string) =>
  useReviews((s) => {
    let n = 0, t = 0
    for (const r of s.reviews) if (r.product_id === productId) { n++; t += r.rating }
    return n ? `${(t / n).toFixed(2)}|${n}` : ''
  })
