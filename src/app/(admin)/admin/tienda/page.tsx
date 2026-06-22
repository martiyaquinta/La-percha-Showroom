"use client"
import { useState } from "react"
import { useAdminStore, type StoreProductForm } from "@/store/useAdminStore"
import { Plus, X, Pencil, Trash2 } from "lucide-react"

const CATEGORIES = [
  { value: "mujer", label: "Mujer" },
  { value: "hombre", label: "Hombre" },
  { value: "kids", label: "Kids" },
]

const SUBCATEGORIES: Record<string, string[]> = {
  mujer: ["ropa", "calzado", "accesorios", "belleza"],
  hombre: ["ropa", "calzado", "accesorios"],
  kids: ["bebes", "ninas", "ninos"],
}

const CONDITIONS = [
  { value: "new_tag", label: "Nuevo con etiqueta" },
  { value: "new", label: "Nuevo" },
  { value: "like_new", label: "Como nuevo" },
  { value: "used", label: "Usado" },
]

const SIZES = ["XS", "S", "M", "L", "XL", "Único"]

const EMPTY_FORM: StoreProductForm = {
  title: "", price: 0, description: "", category: "mujer",
  subcategory: "ropa", condition: "new_tag", sizes: [], image: "", free_shipping: true,
}

export default function TiendaPage() {
  const { products, addStoreProduct, updateStoreProduct, removeStoreProduct } = useAdminStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<StoreProductForm>(EMPTY_FORM)

  const storeProducts = products.filter(p => p.sellerType === "oficial")

  function openNew() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(id: string) {
    const p = products.find(p => p.id === id)
    if (!p) return
    setForm({
      title: p.title, price: p.price, description: "", category: p.category,
      subcategory: "", condition: p.condition, sizes: [], image: p.image, free_shipping: false,
    })
    setEditingId(id)
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.image || form.price <= 0) return
    if (editingId) {
      updateStoreProduct(editingId, form)
    } else {
      addStoreProduct(form)
    }
    setShowForm(false)
    setEditingId(null)
  }

  function toggleSize(size: string) {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
    }))
  }

  return (
    <div className="p-5 lg:p-7 pt-20 lg:pt-7 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-text-strong">Tienda La Percha</h1>
          <p className="text-sm text-text-muted mt-1">Gestioná los productos oficiales</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-1.5 bg-brand text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-hover transition-colors">
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-surface-card rounded-xl border border-border-subtle p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-text-strong">
              {editingId ? "Editar producto" : "Nuevo producto"}
            </h2>
            <button onClick={() => { setShowForm(false); setEditingId(null) }}
              className="w-7 h-7 rounded-full bg-surface-sunken flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-text-muted" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Título</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Precio</label>
                <input required type="number" value={form.price || ""} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Categoría</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value, subcategory: "" }))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Subcategoría</label>
                <select value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none">
                  {SUBCATEGORIES[form.category]?.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Estado</label>
                <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none">
                  {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Imagen URL</label>
                <input required value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">Talles</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button key={s} type="button" onClick={() => toggleSize(s)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors
                      ${form.sizes.includes(s) ? 'bg-brand text-white border-brand' : 'bg-surface-sunken text-text-body border-transparent'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="fs" checked={form.free_shipping}
                onChange={e => setForm(f => ({ ...f, free_shipping: e.target.checked }))}
                className="accent-brand w-4 h-4" />
              <label htmlFor="fs" className="text-sm text-text-body">Envío gratis</label>
            </div>

            <button type="submit"
              className="w-full h-11 bg-brand text-white font-semibold rounded-full text-sm hover:bg-brand-hover transition-colors">
              {editingId ? "Guardar cambios" : "Publicar producto"}
            </button>
          </form>
        </div>
      )}

      {/* Products list */}
      <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
        <div className="px-4 py-3 border-b border-border-subtle">
          <h2 className="font-display text-base text-text-strong">{storeProducts.length} productos</h2>
        </div>
        <div className="divide-y divide-border-subtle">
          {storeProducts.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-text-muted">No hay productos en la tienda</div>
          ) : (
            storeProducts.map(p => (
              <div key={p.id} className="px-4 py-3 flex items-center gap-3">
                <img src={p.image} alt="" className="w-12 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-strong truncate">{p.title}</p>
                  <p className="text-xs text-text-muted">{p.category} · {p.condition}</p>
                  <p className="text-sm font-bold text-price mt-0.5">${p.price.toLocaleString("es-AR")}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(p.id)}
                    className="w-7 h-7 rounded-full bg-surface-sunken flex items-center justify-center hover:bg-matcha-100 transition-colors">
                    <Pencil className="w-3.5 h-3.5 text-text-muted" />
                  </button>
                  <button onClick={() => removeStoreProduct(p.id)}
                    className="w-7 h-7 rounded-full bg-surface-sunken flex items-center justify-center hover:bg-error-50 hover:text-error-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-text-muted" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
