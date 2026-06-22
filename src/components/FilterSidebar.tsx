"use client"
import { useShopStore } from "@/store/useShopStore"

const SIZES = ['XS','S','M','L','XL']
const CONDITIONS = [
  { value: '', label: 'Todos' },
  { value: 'new_tag', label: 'Nuevo c/etiqueta' },
  { value: 'new', label: 'Nuevo' },
  { value: 'like_new', label: 'Como nuevo' },
  { value: 'used', label: 'Usado' },
]
const CATS = [
  { value: 'all', label: 'Todo' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'kids', label: 'Kids' },
  { value: 'promos', label: 'Promos' },
  { value: 'tienda_percha', label: 'Tienda Percha' },
  { value: 'regaleria', label: '↳ Regalería' },
  { value: 'bazar', label: '↳ Bazar' },
  { value: 'decoracion', label: '↳ Decoración' },
]

export function FilterSidebar() {
  const { filters, setFilter, resetFilters } = useShopStore()
  const hasFilters = filters.category !== 'all' || filters.size !== '' || filters.condition !== ''

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0
      border-r border-border-subtle px-4 py-6 gap-6
      sticky top-[var(--nav-h)] self-start max-h-[calc(100vh-var(--nav-h))] overflow-y-auto">

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-text-strong">Filtros</h2>
        {hasFilters && (
          <button onClick={resetFilters}
            className="text-xs text-text-muted hover:text-brand transition-colors">
            Limpiar
          </button>
        )}
      </div>

      {/* Categoría */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Categoría</p>
        {CATS.map(c => (
          <button key={c.value} onClick={() => setFilter('category', c.value)}
            className={`w-full text-left px-2.5 py-2 rounded-md text-sm font-medium transition-colors
              ${filters.category === c.value
                ? 'bg-sage-100 text-sage-800'
                : 'text-text-body hover:bg-surface-sunken'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Talle */}
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Talle</p>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map(s => (
            <button key={s} onClick={() => setFilter('size', filters.size === s ? '' : s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors
                ${filters.size === s
                  ? 'bg-brand border-brand text-text-on-brand'
                  : 'border-border-default text-text-body hover:border-brand hover:text-brand'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Condición */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Estado</p>
        {CONDITIONS.map(c => (
          <label key={c.value} className="flex items-center gap-2 cursor-pointer py-1">
            <input type="radio" name="condition"
              checked={filters.condition === c.value}
              onChange={() => setFilter('condition', c.value)}
              className="accent-brand" />
            <span className="text-sm text-text-body">{c.label}</span>
          </label>
        ))}
      </div>
    </aside>
  )
}
