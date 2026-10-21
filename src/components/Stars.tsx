import { useId, useState } from 'react'

const STAR = 'M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3L2.8 9.5l6.4-.8L12 2.8Z'

/** Read-only stars; supports fractional values (4.3 fills 30% of the fifth star). */
export function Stars({ value, size = 16, className = '' }: { value: number; size?: number; className?: string }) {
  const id = useId()
  return (
    <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <defs>
              <linearGradient id={`${id}-${i}`}>
                <stop offset={fill} stopColor="var(--color-gold)" />
                <stop offset={fill} stopColor="currentColor" stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <path d={STAR} fill={`url(#${id}-${i})`} />
          </svg>
        )
      })}
    </span>
  )
}

const LABELS = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent']

/** Star picker built on a native radio group, so arrow keys and screen readers just work. */
export function StarInput({ value, onChange, error }: { value: number; onChange: (n: number) => void; error?: string }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  const name = useId()
  return (
    <fieldset aria-invalid={!!error || undefined}>
      <legend className="mb-1.5 text-sm font-medium text-ink/80">Your rating</legend>
      <div className="flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="press cursor-pointer p-1" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name={name}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                className="peer sr-only"
                aria-label={`${n} star${n > 1 ? 's' : ''}, ${LABELS[n - 1]}`}
              />
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                aria-hidden
                className={`rounded-md transition-[color,transform] duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-gold ${n <= shown ? 'scale-105 text-gold' : 'text-ink/20'}`}
              >
                <path d={STAR} fill="currentColor" />
              </svg>
            </label>
          ))}
        </div>
        <span className="min-w-20 text-sm font-medium text-forest" aria-hidden>
          {shown ? LABELS[shown - 1] : ''}
        </span>
      </div>
      {error && <span className="mt-1 block text-sm text-hibiscus">{error}</span>}
    </fieldset>
  )
}
