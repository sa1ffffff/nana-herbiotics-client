import { create } from 'zustand'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'

const ADMIN_EMAILS = ['saifullahwasim1@gmail.com', 'nanaherbiotics@gmail.com']
export const isAdminEmail = (email: string) => ADMIN_EMAILS.includes(email.toLowerCase())

interface AuthState {
  user: { email: string; id: string } | null
  isAdmin: boolean
  loading: boolean
  showLogin: boolean
  setShowLogin: (show: boolean) => void
  init: () => Promise<void>
  signInWithGoogle: () => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  showLogin: false,
  setShowLogin: (show) => set({ showLogin: show }),

  init: async () => {
    if (!SUPABASE_CONFIGURED) {
      set({ loading: false })
      return
    }
    try {
      const sb = await supabase()
      const {
        data: { session },
      } = await sb.auth.getSession()
      if (session?.user?.email) {
        const email = session.user.email
        set({ user: { email, id: session.user.id }, isAdmin: isAdminEmail(email), loading: false })
      } else {
        set({ loading: false })
      }
      sb.auth.onAuthStateChange((_event, session) => {
        if (session?.user?.email) {
          const email = session.user.email
          set({ user: { email, id: session.user.id }, isAdmin: isAdminEmail(email), showLogin: false })
        } else {
          set({ user: null, isAdmin: false })
        }
      })
    } catch {
      set({ loading: false })
    }
  },

  // Google is the only sign-in method. Anyone can sign in; only the two emails
  // above get the admin panel (see isAdmin above and the database's is_admin()).
  signInWithGoogle: async () => {
    try {
      const sb = await supabase()
      const { error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname },
      })
      if (error) return { error: error.message }
      return {}
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Sign in failed' }
    }
  },

  signOut: async () => {
    try {
      const sb = await supabase()
      await sb.auth.signOut()
    } catch {
      /* ignore */
    }
    set({ user: null, isAdmin: false, showLogin: false })
  },
}))
