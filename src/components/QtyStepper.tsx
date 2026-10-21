import { MAX_QTY } from '../store/cart'
import { MinusIcon, PlusIcon } from './Icons'

interface Props {
  value: number
  onChange: (n: number) => void
  label: string
  size?: 'sm' | 'md'
}

export function QtyStepper({ value, onChange, label, size = 'md' }: Props) {
  const h = size === 'sm' ? 'h-9' : 'h-11'
  const btn = `press grid ${h} w-10 place-items-center text-forest transition-colors disabled:opacity-30 hover:text-gold`
  return (
    <div
      className={`inline-flex ${h} items-center rounded-full border border-forest/15 bg-white shadow-[0_1px_3px_rgb(14_32_24/0.04)]`}
      role="group"
      aria-label={`Quantity for ${label}`}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <MinusIcon width={16} height={16} />
      </button>
      <span className="min-w-7 text-center text-[15px] font-bold text-forest tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  )
}
