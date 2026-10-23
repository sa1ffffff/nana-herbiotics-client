import { useState } from 'react'
import { useAuth } from '../store/auth'
import { CloseIcon } from './Icons'
import { Overlay } from './Overlay'

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.7 34.9 27 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.9 39.6 16.4 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.6C41.4 36.1 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  )
}

export function AdminLogin() {
  const { showLogin, setShowLogin, signInWithGoogle } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <Overlay open={showLogin} onClose={() => setShowLogin(false)} label="Sign in" variant="modal">
      <div className="mx-auto max-w-sm p-6 text-center sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="text-left">
            <h2 className="font-display text-2xl font-bold text-forest">Sign in</h2>
            <p className="mt-1 text-sm text-ink/60">Store administrators sign in with Google.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="press -mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-forest/5"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            setError('')
            setLoading(true)
            const result = await signInWithGoogle()
            if (result.error) {
              setError(result.error)
              setLoading(false)
            }
            // On success the browser redirects to Google; nothing more to do here.
          }}
          className="press flex h-13 w-full items-center justify-center gap-3 rounded-full border border-forest/15 bg-white font-semibold text-forest shadow-sm transition-colors hover:bg-ivory-warm disabled:opacity-60"
        >
          <GoogleMark />
          {loading ? 'Opening Google…' : 'Continue with Google'}
        </button>

        {error && <p className="mt-4 rounded-xl bg-hibiscus/10 p-3 text-sm text-hibiscus">{error}</p>}

        <p className="mt-5 text-xs leading-relaxed text-ink/45">
          Anyone can sign in. Only the store's two admin accounts see the admin dashboard.
        </p>
      </div>
    </Overlay>
  )
}
