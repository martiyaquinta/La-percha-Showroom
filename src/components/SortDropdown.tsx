"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useShopStore } from "@/store/useShopStore"
import type { SortOption } from "@/lib/types"

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
]

export function SortDropdown() {
  const [open, setOpen] = useState(false)
  const { filters, setFilter } = useShopStore()
  const current = OPTIONS.find(o => o.value === filters.sort) ?? OPTIONS[0]

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
          border-border-default text-sm text-text-body hover:border-brand
          transition-colors bg-surface-card">
        {current.label}
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-44
            bg-surface-card border border-border-subtle rounded-lg shadow-lg overflow-hidden">
            {OPTIONS.map(o => (
              <button key={o.value}
                onClick={() => { setFilter('sort', o.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                  ${filters.sort === o.value
                    ? 'bg-sage-50 text-brand font-semibold'
                    : 'text-text-body hover:bg-surface-sunken'}`}>
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
