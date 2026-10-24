/**
 * Site-wide maintenance switch. Flip to `true`, commit, and push to take the
 * storefront offline for everyone except the two admin accounts (who keep full
 * access, so they can finish work and flip it back). No redeploy step beyond
 * the normal push — Vercel rebuilds on every push to main.
 */
export const MAINTENANCE_MODE = false
