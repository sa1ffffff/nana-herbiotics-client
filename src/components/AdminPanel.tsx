import { useEffect, useRef, useState } from 'react'
import { type Category, type Product, getAllProducts, getAllKnownProducts } from '../data/products'
import { useAdminProducts, CATEGORIES } from '../store/admin-products'
import { useOrders } from '../store/orders'
import { useReviews, type Review } from '../lib/reviews'
import { useAuth } from '../store/auth'
import { exportOrdersToExcel } from '../lib/export-orders'
import { formatPKR } from '../lib/shop'
import { CloseIcon, TrashIcon, UndoIcon } from './Icons'
import { Stars } from './Stars'
import { Monogram } from './Header'

type Tab = 'products' | 'reviews' | 'orders'

export function AdminPanel({ onViewSite }: { onViewSite?: () => void } = {}) {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('products')
  const { reviews, load } = useReviews()

  useEffect(() => { load() }, [load])

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'products', label: 'Products' },
    { key: 'reviews', label: 'Reviews', count: reviews.length },
    { key: 'orders', label: 'Orders' },
  ]

  return (
    <div className="min-h-screen bg-ivory-warm">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-forest/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 text-forest">
              <Monogram className="h-9 w-9" />
              <span className="font-display text-base font-semibold">Nana Herbiotics</span>
            </a>
            <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-forest">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink/60 sm:block">{user?.email}</span>
            <button
              type="button"
              onClick={onViewSite ? onViewSite : () => { window.location.hash = '' }}
              className="press rounded-full border border-forest/15 px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest/5"
            >
              View Site
            </button>
            <button
              type="button"
              onClick={signOut}
              className="press rounded-full bg-forest px-4 py-2 text-sm font-semibold text-ivory transition-all hover:bg-forest-deep"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-forest/10 bg-white">
        <div className="mx-auto flex max-w-6xl gap-1 px-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`relative px-5 py-4 text-sm font-semibold transition-colors ${
                tab === t.key ? 'text-forest' : 'text-ink/50 hover:text-ink/70'
              }`}
            >
              {t.label}
              {t.count != null && (
                <span className="ml-1.5 rounded-full bg-forest/10 px-2 py-0.5 text-xs tabular-nums">{t.count}</span>
              )}
              {tab === t.key && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gold" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {tab === 'products' && <ProductsTab />}
        {tab === 'reviews' && <ReviewsTab />}
        {tab === 'orders' && <OrdersTab />}
      </div>
    </div>
  )
}

/* ─── Products Tab ────────────────────────── */

function ProductsTab() {
  const adminProducts = useAdminProducts((s) => s.products)
  const removedIds = useAdminProducts((s) => s.removedIds)
  const status = useAdminProducts((s) => s.status)
  const load = useAdminProducts((s) => s.load)
  const removeProduct = useAdminProducts((s) => s.removeProduct)
  const restoreProduct = useAdminProducts((s) => s.restoreProduct)
  const [showForm, setShowForm] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [filter, setFilter] = useState<'active' | 'removed'>('active')

  const activeProducts = getAllProducts(adminProducts, removedIds)
  const allKnown = getAllKnownProducts(adminProducts)
  const removedProducts = allKnown.filter((p) => removedIds.includes(p.id))

  useEffect(() => { load() }, [load])

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}"? It will no longer be visible to customers on the website.`)) return
    setRemoving(id)
    try {
      await removeProduct(id)
    } catch {
      alert('Could not remove the product. Please try again.')
    }
    setRemoving(null)
  }

  const handleRestore = async (id: string) => {
    setRestoring(id)
    try {
      await restoreProduct(id)
    } catch {
      alert('Could not restore the product. Please try again.')
    }
    setRestoring(null)
  }

  const displayedProducts = filter === 'active' ? activeProducts : removedProducts

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-forest">Products</h2>
          <p className="mt-1 text-sm text-ink/60">
            {activeProducts.length} active {activeProducts.length === 1 ? 'product' : 'products'} on store
            {removedProducts.length > 0 && ` · ${removedProducts.length} removed`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {removedProducts.length > 0 && (
            <div className="flex rounded-full border border-forest/15 bg-white p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setFilter('active')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filter === 'active' ? 'bg-forest text-ivory' : 'text-ink/60 hover:text-forest'
                }`}
              >
                Active ({activeProducts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('removed')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filter === 'removed' ? 'bg-hibiscus text-white' : 'text-ink/60 hover:text-hibiscus'
                }`}
              >
                Removed ({removedProducts.length})
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="press rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory shadow-[0_4px_16px_-4px_rgb(14_32_24/0.4)] transition-all hover:bg-forest-deep"
          >
            + Add Product
          </button>
        </div>
      </div>

      {status === 'error' && (
        <p className="mb-6 rounded-xl bg-hibiscus/10 p-4 text-sm text-hibiscus">
          Could not load live products from server. Showing local cache. Check your connection.
        </p>
      )}

      {showForm && <AddProductForm onClose={() => setShowForm(false)} />}

      {filter === 'active' && activeProducts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-forest/20 px-6 py-14 text-center">
          <p className="font-semibold text-forest">No active products on the store.</p>
          <p className="mt-1 text-sm text-ink/60">All products have been removed or none were added yet.</p>
          {removedProducts.length > 0 && (
            <button
              type="button"
              onClick={() => setFilter('removed')}
              className="mt-4 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-ivory hover:bg-forest-deep"
            >
              View {removedProducts.length} removed {removedProducts.length === 1 ? 'product' : 'products'} to restore
            </button>
          )}
        </div>
      )}

      {filter === 'removed' && removedProducts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-forest/20 px-6 py-14 text-center">
          <p className="font-semibold text-forest">No removed products.</p>
          <p className="mt-1 text-sm text-ink/60">All products are currently active on the store.</p>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className="mt-4 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-ivory hover:bg-forest-deep"
          >
            Back to Active Products
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedProducts.map((p) => {
          const isRem = removedIds.includes(p.id)
          return (
            <ProductAdminCard
              key={p.id}
              product={p}
              isAdmin={'adminAdded' in p}
              isRemoved={isRem}
              removing={removing === p.id}
              restoring={restoring === p.id}
              onRemove={() => handleRemove(p.id, p.name)}
              onRestore={() => handleRestore(p.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function ProductAdminCard({
  product,
  isAdmin,
  isRemoved,
  onRemove,
  onRestore,
  removing,
  restoring,
}: {
  product: Product
  isAdmin: boolean
  isRemoved?: boolean
  onRemove: () => void
  onRestore?: () => void
  removing: boolean
  restoring?: boolean
}) {
  const imgSrc = /^https?:\/\//.test(product.image) ? product.image : `${product.image}-500.webp`

  return (
    <div
      className={`flex gap-4 rounded-2xl border p-4 shadow-sm transition-all ${
        isRemoved
          ? 'border-hibiscus/25 bg-white/75 opacity-80'
          : 'border-forest/10 bg-white'
      } ${removing || restoring ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <img
        src={imgSrc}
        alt={product.alt}
        className="h-20 w-20 shrink-0 rounded-xl border border-forest/8 bg-gradient-to-br from-white to-ivory-warm object-contain p-1"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-forest">{product.name}</p>
            <p className="text-sm text-ink/50">{product.size} · {product.category}</p>
          </div>
          {isRemoved ? (
            <button
              type="button"
              onClick={onRestore}
              disabled={restoring}
              className="press flex items-center gap-1.5 rounded-full border border-forest/20 bg-forest/5 px-3 py-1.5 text-xs font-semibold text-forest transition-colors hover:bg-forest hover:text-ivory disabled:opacity-40"
              aria-label={`Restore ${product.name}`}
              title="Restore to storefront"
            >
              <UndoIcon width={13} height={13} />
              <span>{restoring ? 'Restoring…' : 'Restore'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onRemove}
              disabled={removing}
              className="press grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/35 transition-colors hover:bg-hibiscus/10 hover:text-hibiscus disabled:opacity-40"
              aria-label={`Remove ${product.name}`}
              title={`Remove ${product.name} from store`}
            >
              {removing ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-hibiscus/30 border-t-hibiscus" />
              ) : (
                <TrashIcon width={16} height={16} />
              )}
            </button>
          )}
        </div>
        <p className="mt-1 text-sm font-bold text-forest tabular-nums">{formatPKR(product.price)}</p>
        <p className="mt-1 line-clamp-2 text-xs text-ink/60">{product.short}</p>
        <div className="mt-2 flex items-center gap-2">
          {isRemoved ? (
            <span className="rounded-full bg-hibiscus/15 px-2 py-0.5 text-[10px] font-semibold text-hibiscus">
              Removed from Store
            </span>
          ) : isAdmin ? (
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-forest">
              Admin Added
            </span>
          ) : (
            <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-semibold text-forest/70">
              Built-in
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function AddProductForm({ onClose }: { onClose: () => void }) {
  const addProduct = useAdminProducts((s) => s.addProduct)
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!imageFile) {
      setError('Please choose a product photo.')
      return
    }
    setError('')
    setSaving(true)
    const f = new FormData(e.currentTarget)
    const name = String(f.get('name') ?? '').trim()

    try {
      await addProduct({
        name,
        category: String(f.get('category') ?? 'shampoos') as Category,
        size: String(f.get('size') ?? '').trim(),
        price: Number(f.get('price') ?? 0),
        short: String(f.get('short') ?? '').trim(),
        long: String(f.get('long') ?? '').trim(),
        ingredients: String(f.get('ingredients') ?? '').split(',').map((s) => s.trim()).filter(Boolean),
        badges: String(f.get('badges') ?? '').split(',').map((s) => s.trim()).filter(Boolean),
        image: '',
        alt: `${name} product image`,
        imageFile,
      })
      onClose()
    } catch {
      setError('Could not save the product. Please check your connection and try again.')
      setSaving(false)
    }
  }

  const inputCls = 'h-12 w-full rounded-xl border border-forest/15 bg-ivory-warm/50 px-4 outline-none transition-colors focus:border-forest focus:bg-white'

  return (
    <div className="mb-8 rounded-2xl border border-gold/30 bg-white p-6 shadow-[0_8px_32px_-12px_rgba(14,32,24,0.12)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h3 className="font-display text-xl font-bold text-forest">Add New Product</h3>
        <button type="button" onClick={onClose} className="press grid h-9 w-9 place-items-center rounded-full hover:bg-forest/5" aria-label="Close form">
          <CloseIcon />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/70">Product Name</span>
            <input name="name" required className={inputCls} placeholder="e.g. Rose Shampoo" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/70">Category</span>
            <select name="category" required className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/70">Size</span>
            <input name="size" required className={inputCls} placeholder="e.g. 200 ml" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/70">Price (Rs)</span>
            <input name="price" type="number" min="1" required className={inputCls} placeholder="e.g. 1599" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/70">Product Photo</span>
            <input ref={fileRef} type="file" accept="image/*" required onChange={handleImageChange} className="h-12 w-full cursor-pointer rounded-xl border border-forest/15 bg-ivory-warm/50 px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-forest/10 file:px-3 file:py-1 file:text-xs file:font-medium" />
          </label>
        </div>

        {imagePreview && (
          <div className="flex items-center gap-4">
            <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-xl border border-forest/10 object-contain" />
            <button type="button" onClick={() => { setImagePreview(''); setImageFile(null); if (fileRef.current) fileRef.current.value = '' }} className="text-sm text-hibiscus hover:underline">Remove image</button>
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/70">Short Description</span>
          <input name="short" required className={inputCls} placeholder="One-liner for the product card" />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/70">Long Description</span>
          <textarea name="long" required rows={3} className="w-full rounded-xl border border-forest/15 bg-ivory-warm/50 px-4 py-3 outline-none transition-colors focus:border-forest focus:bg-white" placeholder="Detailed product description" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/70">Ingredients (comma-separated)</span>
            <input name="ingredients" className={inputCls} placeholder="e.g. Rose extract, Vitamin E" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/70">Badges (comma-separated)</span>
            <input name="badges" className={inputCls} placeholder="e.g. Paraben free, 100% herbal" />
          </label>
        </div>

        {error && <p className="rounded-xl bg-hibiscus/10 p-3 text-sm text-hibiscus">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="press h-12 flex-1 rounded-full bg-forest font-semibold text-ivory shadow-[0_4px_16px_-4px_rgb(14_32_24/0.4)] transition-all hover:bg-forest-deep disabled:opacity-60">
            {saving ? 'Saving…' : 'Add Product'}
          </button>
          <button type="button" onClick={onClose} disabled={saving} className="press h-12 rounded-full border border-forest/15 px-6 font-medium text-forest hover:bg-forest/5 disabled:opacity-60">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

/* ─── Reviews Tab ─────────────────────────── */

function ReviewsTab() {
  const { reviews, status, load, deleteReview } = useReviews()
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review? This cannot be undone.')) return
    setDeleting(id)
    try {
      await deleteReview(id)
    } catch (err) {
      alert('Failed to delete review.')
    }
    setDeleting(null)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-forest">Reviews</h2>
        <p className="mt-1 text-sm text-ink/60">{reviews.length} reviews · Click the trash icon to delete</p>
      </div>

      {status === 'loading' && reviews.length === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-forest/5" />)}
        </div>
      )}

      {reviews.length === 0 && status !== 'loading' && (
        <div className="rounded-2xl border border-dashed border-forest/20 px-6 py-14 text-center">
          <p className="text-ink/60">No reviews yet.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <ReviewAdminCard key={r.id} review={r} onDelete={() => handleDelete(r.id)} deleting={deleting === r.id} />
        ))}
      </div>
    </div>
  )
}

const reviewDateFmt = new Intl.DateTimeFormat('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })

function ReviewAdminCard({ review: r, onDelete, deleting }: { review: Review; onDelete: () => void; deleting: boolean }) {
  return (
    <div className={`relative flex flex-col gap-2.5 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm transition-opacity ${deleting ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <Stars value={r.rating} size={14} className="text-ink" />
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="press grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/35 transition-colors hover:bg-hibiscus/10 hover:text-hibiscus disabled:opacity-40"
          aria-label="Delete review"
        >
          <TrashIcon width={16} height={16} />
        </button>
      </div>
      {r.title && <p className="font-semibold text-forest">{r.title}</p>}
      <p className="text-sm leading-relaxed text-ink/70 line-clamp-3">{r.body}</p>
      <div className="mt-auto flex items-end justify-between gap-2 border-t border-forest/8 pt-2.5 text-xs">
        <span>
          <span className="font-semibold text-forest">{r.name}</span>
          {r.city && <span className="text-ink/50"> · {r.city}</span>}
        </span>
        <time className="text-ink/40">{reviewDateFmt.format(new Date(r.created_at))}</time>
      </div>
      <span className="text-[10px] text-ink/40">Product: {r.product_id}</span>
    </div>
  )
}

/* ─── Orders Tab ──────────────────────────── */

function OrdersTab() {
  const orders = useOrders((s) => s.orders)
  const status = useOrders((s) => s.status)
  const load = useOrders((s) => s.load)

  useEffect(() => { load() }, [load])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-forest">Orders</h2>
          <p className="mt-1 text-sm text-ink/60">{orders.length} orders placed</p>
        </div>
        {orders.length > 0 && (
          <button
            type="button"
            onClick={() => exportOrdersToExcel(orders)}
            className="press flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory shadow-[0_4px_16px_-4px_rgb(14_32_24/0.4)] transition-all hover:bg-forest-deep"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export to Excel
          </button>
        )}
      </div>

      {status === 'error' && (
        <p className="mb-6 rounded-xl bg-hibiscus/10 p-4 text-sm text-hibiscus">
          Could not load orders. Check your connection and refresh.
        </p>
      )}

      {orders.length === 0 && status !== 'error' && (
        <div className="rounded-2xl border border-dashed border-forest/20 px-6 py-14 text-center">
          <p className="text-ink/60">{status === 'loading' ? 'Loading orders…' : 'No orders have been placed yet.'}</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-forest/10 bg-ivory-warm/50">
                <th className="px-4 py-3 font-semibold text-forest">Order ID</th>
                <th className="px-4 py-3 font-semibold text-forest">Customer</th>
                <th className="px-4 py-3 font-semibold text-forest">Email</th>
                <th className="px-4 py-3 font-semibold text-forest">Phone</th>
                <th className="px-4 py-3 font-semibold text-forest">Products</th>
                <th className="px-4 py-3 font-semibold text-forest text-right">Total</th>
                <th className="px-4 py-3 font-semibold text-forest">City</th>
                <th className="px-4 py-3 font-semibold text-forest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/6">
              {orders.map((o) => (
                <tr key={o.orderId} className="transition-colors hover:bg-ivory-warm/30">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-forest">{o.orderId}</td>
                  <td className="px-4 py-3 text-ink/80">{o.customerName}</td>
                  <td className="px-4 py-3 text-ink/60">{o.customerEmail}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink/60">{o.customerPhone}</td>
                  <td className="max-w-[200px] px-4 py-3 text-xs text-ink/60">
                    {o.products.map((p) => `${p.name} ×${p.qty}`).join(', ')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-forest tabular-nums">{formatPKR(o.total)}</td>
                  <td className="px-4 py-3 text-ink/60">{o.city}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-ink/50">{o.dateTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
