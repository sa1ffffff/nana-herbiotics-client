/**
 * One shared Supabase client for the whole app (auth, reviews, products, orders).
 * Sharing a single instance matters: once the admin signs in with Google, every
 * query made through this client automatically carries their session, which is
 * what lets the database's "is_admin()" policies recognise them.
 */
const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const SUPABASE_CONFIGURED = Boolean(URL && KEY)

let clientPromise: Promise<import('@supabase/supabase-js').SupabaseClient> | null = null

/** Loaded on demand so the Supabase SDK never weighs down the first paint. */
export function supabase() {
  if (!SUPABASE_CONFIGURED) {
    throw new Error('Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(URL!, KEY!, { auth: { persistSession: true, autoRefreshToken: true } }),
  )
  return clientPromise
}
