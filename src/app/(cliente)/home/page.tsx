"use client"
import { useState } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, ChevronRight, Store, Heart } from "lucide-react"
import { PRODUCTS } from "@/lib/placeholder-products"
import { filterProducts } from "@/lib/filterProducts"
import { useShopStore } from "@/store/useShopStore"
import { ProductCard } from "@/components/ProductCard"
import { FilterBottomSheet } from "@/components/FilterBottomSheet"
import { SortDropdown } from "@/components/SortDropdown"

const CAT_CHIPS = [
  { value: 'all', label: 'Todo' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'kids', label: 'Kids' },
  { value: 'promos', label: 'Promos' },
  { value: 'tienda_percha', label: 'Tienda Percha' },
]

const TIENDA_CHIPS = [
  { value: 'regaleria', label: 'Regalería' },
  { value: 'bazar', label: 'Bazar' },
  { value: 'decoracion', label: 'Decoración' },
]

function SectionHeader({
  icon, title, sub, onVerTodo,
}: {
  icon: React.ReactNode
  title: string
  sub: string
  onVerTodo: () => void
}) {
  return (
    <div className="flex items-center justify-between px-4 lg:px-6 mb-3">
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-xl bg-sage-100 flex items-center justify-center shrink-0">
          {icon}
        </span>
        <div>
          <p className="font-display text-[1.1rem] text-text-strong leading-none">{title}</p>
          <p className="text-[11px] text-text-muted mt-0.5">{sub}</p>
        </div>
      </div>
      <button onClick={onVerTodo}
        className="text-sm font-bold text-brand hover:underline shrink-0">
        Ver todo
      </button>
    </div>
  )
}

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const { filters, setFilter } = useShopStore()

  const isTienda = ['tienda_percha', 'regaleria', 'bazar', 'decoracion'].includes(filters.category)
  const activeChip = isTienda ? 'tienda_percha' : filters.category
  const isDiscovery = filters.category === 'all' && !filters.subcategory && !filters.search

  const oficialProducts = PRODUCTS.filter(p => p.store_type === 'oficial')
  const feriaProducts = PRODUCTS.filter(p => p.store_type === 'feria')
  const filteredProducts = filterProducts(PRODUCTS, filters)

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Mobile header ── */}
      <header className="lg:hidden h-16 flex items-center justify-between px-5
        bg-bg-page border-b border-border-subtle sticky top-0 z-10">
        <h1 className="font-display text-xl text-text-strong flex items-center gap-2">
          <img src="/logo.jpg" alt="" className="w-7 h-7 rounded-lg object-cover" />
          La Percha
        </h1>
        <button className="w-9 h-9 rounded-full bg-surface-sunken flex items-center justify-center">
          <Search className="w-4.5 h-4.5 text-text-muted" />
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-w-0">

          {/* Category chips — mobile */}
          <div className="lg:hidden px-4 pt-3 pb-1">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CAT_CHIPS.map(c => (
                <button key={c.value}
                  onClick={() => setFilter('category', c.value)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold
                    whitespace-nowrap transition-colors
                    ${activeChip === c.value
                      ? 'bg-brand text-text-on-brand'
                      : 'bg-surface-sunken text-text-body'}`}>
                  {c.label}
                </button>
              ))}
            </div>
            {isTienda && (
              <div className="flex gap-2 overflow-x-auto pt-2 pb-1">
                {TIENDA_CHIPS.map(c => (
                  <button key={c.value}
                    onClick={() => setFilter('category', c.value)}
                    className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold
                      whitespace-nowrap transition-colors border
                      ${filters.category === c.value
                        ? 'bg-surface-inverse text-text-on-dark border-surface-inverse'
                        : 'bg-transparent border-border-default text-text-body'}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isDiscovery ? (
            /* ── Modo discovery: secciones curadas ── */
            <div className="pb-24 lg:pb-10">

              {/* Tienda Oficial — scroll horizontal */}
              <div className="mt-8 lg:mt-10 mb-6">
                <SectionHeader
                  icon={<Store className="w-4 h-4 text-sage-700" />}
                  title="Tienda Oficial"
                  sub="Seleccionado por Silvina"
                  onVerTodo={() => setFilter('category', 'tienda_percha')}
                />
                <div className="flex gap-3 overflow-x-auto px-4 lg:px-6 pb-2">
                  {oficialProducts.map(p => (
                    <div key={p.id} className="w-40 shrink-0">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Banners */}
              <div className="px-4 lg:px-6 mb-7 grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Hero — Feria de Ropa */}
                <div className="relative rounded-2xl overflow-hidden
                  bg-gradient-to-br from-mint-200 to-sage-200 p-5 lg:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest
                    text-sage-700 mb-1.5">
                    Feria de Ropa
                  </p>
                  <h2 className="font-display text-[1.6rem] lg:text-[1.8rem] text-ink-900
                    leading-tight mb-2 max-w-[14rem]">
                    Renová tu placard, cerca tuyo
                  </h2>
                  <p className="text-sm text-ink-800 mb-4 max-w-[15rem] leading-relaxed">
                    Ropa seleccionada por vendedores de la comunidad.
                    Envío gratis desde $25.000.
                  </p>
                  <button
                    onClick={() => {
                      const el = document.getElementById('feria-section')
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="inline-flex items-center gap-1.5 bg-ink-900 text-text-on-dark
                      px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                    Ver la feria <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Banner vender */}
                <div className="relative rounded-2xl overflow-hidden
                  bg-gradient-to-br from-taupe-300 to-taupe-200 p-5 lg:p-6">
                  <span className="absolute right-3 top-1 text-7xl opacity-10 select-none
                    pointer-events-none leading-none">👗</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest
                    text-taupe-700 mb-1.5">
                    ¿Tenés ropa que ya no usás?
                  </p>
                  <h2 className="font-display text-[1.6rem] lg:text-[1.8rem] text-ink-900
                    leading-tight mb-2">
                    Vendela en La Percha
                  </h2>
                  <p className="text-sm text-ink-800 mb-4 max-w-[16rem] leading-relaxed">
                    Publicá tus prendas y llegá a toda la comunidad.
                    Vos te quedás con el <strong>80%</strong> de cada venta —
                    el 20% restante es la comisión de La Percha.
                  </p>
                  <Link href="/vender"
                    className="inline-flex items-center gap-1.5 bg-ink-900 text-text-on-dark
                      px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                    Empezar a vender <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Feria de Ropa — grid */}
              <div id="feria-section">
                <SectionHeader
                  icon={<Heart className="w-4 h-4 text-sage-700" />}
                  title="Feria de Ropa"
                  sub="De la comunidad"
                  onVerTodo={() => setFilter('category', 'mujer')}
                />
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5
                  gap-3 px-4 lg:px-6">
                  {feriaProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </div>

          ) : (
            /* ── Modo filtrado / búsqueda ── */
            <>
              {/* Barra superior: filtros móviles + contador + sort + Ver todo */}
              <div className="flex items-center justify-between px-4 lg:px-6 py-2 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSheetOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      border border-border-default text-sm text-text-body
                      hover:border-brand transition-colors bg-surface-card">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filtros
                  </button>
                  <p className="text-xs text-text-muted">
                    {filteredProducts.length} prenda{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => useShopStore.getState().resetFilters()}
                    className="text-sm font-bold text-brand hover:underline shrink-0
                      hidden lg:inline-flex">
                    Ver todo
                  </button>
                  <SortDropdown />
                </div>
              </div>

              <div className="mx-4 lg:mx-6 h-px bg-border-subtle" />

              {/* Tienda Oficial — visibles al tope si no hay búsqueda activa */}
              {!filters.search && oficialProducts.length > 0 && (
                <div className="mt-6 lg:mt-8 mb-5">
                  <div className="flex items-center justify-between px-4 lg:px-6 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-sage-100 flex items-center justify-center shrink-0">
                        <Store className="w-4 h-4 text-sage-700" />
                      </span>
                      <div>
                        <p className="font-display text-[1.1rem] text-text-strong leading-none">Tienda Oficial</p>
                        <p className="text-[11px] text-text-muted mt-0.5">Seleccionado por Silvina</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 overflow-x-auto px-4 lg:px-6 pb-2">
                    {oficialProducts.map(p => (
                      <div key={p.id} className="w-40 shrink-0">
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <p className="text-4xl">🪣</p>
                  <p className="text-text-muted text-sm">No hay prendas con esos filtros</p>
                  <button
                    onClick={() => useShopStore.getState().resetFilters()}
                    className="text-brand text-sm font-semibold hover:underline">
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5
                  gap-3 p-4 lg:p-6 pb-24 lg:pb-10">
                  {filteredProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <FilterBottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
