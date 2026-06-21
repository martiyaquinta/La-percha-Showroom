"use client"
import { useShopStore } from "@/store/useShopStore"
import { X } from "lucide-react"

const SIZES = ['XS','S','M','L','XL']
const CONDITIONS = [
  { value: '', label: 'Todos' },
  { value: 'new_tag', label: 'Nuevo c/etiqueta' },
  { value: 'new', label: 'Nuevo' },
  { value: 'like_new', label: 'Como nuevo' },
  { value: 'used', label: 'Usado' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function FilterBottomSheet({ open, onClose }: Props) {
  const { filters, setFilter, resetFilters } = useShopStore()

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      <div className="fixed bottom-20 inset-x-0 mx-auto w-full max-w-107.5
        bg-surface-card rounded-t-2xl z-50 lg:hidden
        max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border-subtle">
          <h3 className="font-semibold text-text-strong">Filtros</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => { resetFilters(); onClose() }}
              className="text-xs text-text-muted hover:text-brand transition-colors">
              Limpiar
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center">
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Talle */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Talle</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} onClick={() => setFilter('size', filters.size === s ? '' : s)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors
                    ${filters.size === s
                      ? 'bg-brand border-brand text-text-on-brand'
                      : 'border-border-default text-text-body hover:border-brand'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Condición */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Estado</p>
            {CONDITIONS.map(c => (
              <label key={c.value} className="flex items-center gap-3 cursor-pointer py-1.5">
                <input type="radio" name="condition_bs"
                  checked={filters.condition === c.value}
                  onChange={() => setFilter('condition', c.value)}
                  className="accent-brand w-4 h-4" />
                <span className="text-sm text-text-body">{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="px-5 pb-6">
          <button onClick={onClose}
            className="w-full h-13 bg-brand hover:bg-brand-hover
              text-text-on-brand font-semibold rounded-lg transition-colors">
            Ver resultados
          </button>
        </div>
      </div>
    </>
  )
}
