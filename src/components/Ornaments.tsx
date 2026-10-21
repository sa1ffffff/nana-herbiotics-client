/** Line-art ornaments taken from the label: corner sprigs and a leaf divider. */

export function Sprig({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden>
      <path d="M3 3h20M3 3v20" />
      <path d="M7 7h9M7 7v9" opacity=".6" />
      <path d="M8 8c8 2 15 7 20 16" />
      <path d="M14 11c1-4 4-6 8-6-1 4-4 6-8 6Z" />
      <path d="M11 14c-4 1-6 4-6 8 4-1 6-4 6-8Z" />
      <path d="M20 16c2-3 5-4 8-3-2 3-5 4-8 3Z" />
      <path d="M17 20c-3 2-4 5-3 8 3-2 4-5 3-8Z" />
    </svg>
  )
}

/** Four sprigs pinned into the corners of a relative parent. */
export function Corners({ className = 'text-gold/70', size = 'h-7 w-7 sm:h-9 sm:w-9', inset = 'm-1.5 sm:m-2' }: { className?: string; size?: string; inset?: string }) {
  const base = `pointer-events-none absolute ${size} ${inset} ${className}`
  return (
    <>
      <Sprig className={`${base} left-0 top-0`} />
      <Sprig className={`${base} right-0 top-0 -scale-x-100`} />
      <Sprig className={`${base} bottom-0 left-0 -scale-y-100`} />
      <Sprig className={`${base} bottom-0 right-0 -scale-100`} />
    </>
  )
}

export function Divider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-gold ${className}`} aria-hidden>
      <span className="h-px w-10 bg-current opacity-70" />
      <svg viewBox="0 0 24 12" className="h-3 w-6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M12 11V3" />
        <path d="M12 6c-2-3-5-4-8-3 2 3 5 4 8 3ZM12 6c2-3 5-4 8-3-2 3-5 4-8 3Z" />
      </svg>
      <span className="h-px w-10 bg-current opacity-70" />
    </div>
  )
}
