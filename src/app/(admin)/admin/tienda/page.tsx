"use client"
import { useState } from "react"
import { useAdminStore, type StoreProductForm, type AdminProduct } from "@/store/useAdminStore"
import { Plus, X, Pencil, Trash2, Shirt, Store, ChevronLeft, Star, Truck, Upload, AlertCircle } from "lucide-react"

const CATEGORIES_ROPA = [
  { value: "mujer", label: "Mujer" },
  { value: "hombre", label: "Hombre" },
  { value: "kids", label: "Kids" },
]
const SUBS_ROPA: Record<string, string[]> = {
  mujer: ["ropa", "calzado", "accesorios", "belleza"],
  hombre: ["ropa", "calzado", "accesorios"],
  kids: ["bebes", "ninas", "ninos"],
}
const CATEGORIES_TIENDA = [
  { value: "tienda", label: "Tienda Percha" },
]
const SUBS_TIENDA = ["regaleria", "bazar", "decoracion"]
const CONDITIONS = [
  { value: "new_tag", label: "Nuevo con etiqueta" },
  { value: "new", label: "Nuevo" },
  { value: "like_new", label: "Como nuevo" },
  { value: "used", label: "Usado" },
]
const SIZES = ["XS", "S", "M", "L", "XL", "Único"]
const COLORES = ["Negro", "Blanco", "Beige", "Gris", "Verde", "Azul", "Rojo", "Rosa", "Amarillo", "Marrón"]

const EMPTY: StoreProductForm = {
  title: "", price: 0, description: "", category: "mujer",
  subcategory: "ropa", condition: "new_tag", sizes: [], colors: [],
  images: [], free_shipping: false, destacado: false,
  productType: "ropa",
}

export default function TiendaPage() {
  const { products, addStoreProduct, updateStoreProduct, removeStoreProduct } = useAdminStore()
  const [view, setView] = useState<"list" | "type" | "form">("list")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<StoreProductForm>(EMPTY)
  const [showPrevPrice, setShowPrevPrice] = useState(false)
  const [newImage, setNewImage] = useState("")
  const [newColor, setNewColor] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [showDelete, setShowDelete] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<"all" | "ropa" | "tienda">("all")

  const storeProducts = products.filter(p => {
    if (p.sellerType !== "oficial") return false
    if (filterType !== "all" && p.productType !== filterType) return false
    return true
  })

  function openNew() {
    setForm(EMPTY)
    setShowPrevPrice(false)
    setEditingId(null)
    setError("")
    setView("type")
  }

  function selectType(type: "ropa" | "tienda") {
    setForm(f => ({
      ...f, productType: type,
      category: type === "ropa" ? "mujer" : "tienda",
      subcategory: type === "ropa" ? "ropa" : "regaleria",
      condition: type === "ropa" ? "new_tag" : "",
      sizes: type === "ropa" ? [] : [],
      brand: type === "ropa" ? "" : undefined,
    }))
    setView("form")
  }

  function openEdit(p: AdminProduct) {
    setForm({
      title: p.title, price: p.price, prevPrice: p.prevPrice,
      description: p.description || "", brand: p.brand,
      category: p.category, subcategory: p.subcategory || "",
      condition: p.condition || "", sizes: p.sizes || [],
      colors: p.colors || [], images: p.images || [p.image],
      free_shipping: p.free_shipping || false, destacado: p.destacado || false,
      productType: p.productType,
    })
    setShowPrevPrice(!!p.prevPrice)
    setEditingId(p.id)
    setError("")
    setView("form")
  }

  function addImage() {
    if (!newImage.trim()) return
    setForm(f => ({ ...f, images: [...f.images, newImage.trim()] }))
    setNewImage("")
  }

  function toggleSize(s: string) {
    setForm(f => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(z => z !== s) : [...f.sizes, s] }))
  }

  function addColor() {
    if (!newColor.trim()) return
    setForm(f => ({ ...f, colors: [...f.colors, newColor.trim()] }))
    setNewColor("")
  }

  function validate(): boolean {
    if (!form.title.trim()) { setError("El título es obligatorio"); return false }
    if (!form.price || form.price <= 0) { setError("El precio debe ser mayor a 0"); return false }
    if (form.images.length === 0) { setError("Agregá al menos una imagen"); return false }
    if (form.productType === "ropa" && form.sizes.length === 0) { setError("Seleccioná al menos un talle"); return false }
    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    const data = { ...form, prevPrice: showPrevPrice ? form.prevPrice : undefined }
    if (editingId) updateStoreProduct(editingId, data)
    else addStoreProduct(data)
    setTimeout(() => { setSaving(false); setView("list") }, 300)
  }

  // ---- VIEW: Lista ----
  if (view === "list") {
    return (
      <div className="p-5 lg:p-7 pt-20 lg:pt-7 space-y-5 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-text-strong">Tienda La Percha</h1>
            <p className="text-sm text-text-muted mt-1">{storeProducts.length} productos</p>
          </div>
          <button onClick={openNew}
            className="flex items-center gap-1.5 bg-brand text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-hover transition-colors">
            <Plus className="w-4 h-4" /> Nuevo
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[{ v: "all" as const, l: "Todos" }, { v: "ropa" as const, l: "Ropa" }, { v: "tienda" as const, l: "Tienda" }].map(f => (
            <button key={f.v} onClick={() => setFilterType(f.v)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors
                ${filterType === f.v ? 'bg-brand text-white' : 'bg-surface-sunken text-text-body'}`}>
              {f.l}
            </button>
          ))}
        </div>

        {storeProducts.length === 0 ? (
          <div className="bg-surface-card rounded-xl border border-border-subtle px-4 py-16 text-center text-sm text-text-muted">
            No hay productos. Tocá "Nuevo" para agregar el primero.
          </div>
        ) : (
          <div className="space-y-2">
            {storeProducts.map(p => (
              <div key={p.id} className="bg-surface-card rounded-xl border border-border-subtle p-3 flex items-center gap-3">
                <img src={p.image} alt="" className="w-14 h-18 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-text-strong truncate">{p.title}</p>
                    {p.destacado && <Star className="w-3 h-3 text-chai-500 fill-chai-500" />}
                    {p.free_shipping && <Truck className="w-3 h-3 text-success-500" />}
                  </div>
                  <p className="text-xs text-text-muted">{p.category}{p.subcategory ? ` · ${p.subcategory}` : ""}{p.brand ? ` · ${p.brand}` : ""}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm font-bold text-price">${p.price.toLocaleString("es-AR")}</p>
                    {p.prevPrice && <p className="text-[11px] text-text-muted line-through">${p.prevPrice.toLocaleString("es-AR")}</p>}
                  </div>
                  {p.sizes && p.sizes.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {p.sizes.map(s => <span key={s} className="px-1.5 py-0.5 rounded text-[9px] bg-surface-sunken text-text-muted">{s}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-full bg-surface-sunken flex items-center justify-center hover:bg-matcha-100 transition-colors">
                    <Pencil className="w-3.5 h-3.5 text-text-muted" />
                  </button>
                  <button onClick={() => setShowDelete(p.id)} className="w-7 h-7 rounded-full bg-surface-sunken flex items-center justify-center hover:bg-error-50 hover:text-error-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-text-muted" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
            <div className="absolute inset-0 bg-carob-900/40 backdrop-blur-sm" onClick={() => setShowDelete(null)} />
            <div className="relative bg-surface-card rounded-t-2xl lg:rounded-2xl p-6 w-full lg:max-w-sm">
              <p className="font-semibold text-text-strong mb-2">¿Eliminar producto?</p>
              <p className="text-sm text-text-muted mb-5">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDelete(null)} className="flex-1 h-10 rounded-full border border-border-default text-sm font-semibold">Cancelar</button>
                <button onClick={() => { removeStoreProduct(showDelete); setShowDelete(null) }} className="flex-1 h-10 rounded-full bg-error-500 text-white text-sm font-semibold">Eliminar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ---- VIEW: Tipo de producto ----
  if (view === "type") {
    return (
      <div className="p-5 lg:p-7 pt-20 lg:pt-7 space-y-6 max-w-lg mx-auto">
        <button onClick={() => setView("list")} className="flex items-center gap-1 text-sm text-text-muted hover:text-text-strong transition-colors">
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
        <div>
          <h1 className="font-display text-2xl text-text-strong">Nuevo producto</h1>
          <p className="text-sm text-text-muted mt-1">¿Qué tipo de producto vas a publicar?</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <button onClick={() => selectType("ropa")}
            className="flex items-center gap-4 p-5 rounded-2xl border-2 border-border-subtle hover:border-matcha-500 bg-surface-card text-left transition-all group">
            <div className="w-14 h-14 rounded-xl bg-matcha-100 flex items-center justify-center shrink-0 group-hover:bg-matcha-200 transition-colors">
              <Shirt className="w-7 h-7 text-matcha-600" />
            </div>
            <div>
              <p className="font-semibold text-text-strong text-lg">Prenda de ropa</p>
              <p className="text-xs text-text-muted mt-0.5">Camisas, pantalones, vestidos, calzado, accesorios, kids</p>
            </div>
          </button>
          <button onClick={() => selectType("tienda")}
            className="flex items-center gap-4 p-5 rounded-2xl border-2 border-border-subtle hover:border-chai-400 bg-surface-card text-left transition-all group">
            <div className="w-14 h-14 rounded-xl bg-chai-100 flex items-center justify-center shrink-0 group-hover:bg-chai-200 transition-colors">
              <Store className="w-7 h-7 text-chai-600" />
            </div>
            <div>
              <p className="font-semibold text-text-strong text-lg">Tienda</p>
              <p className="text-xs text-text-muted mt-0.5">Bazar, regalería, decoración, velas, tazas y más</p>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // ---- VIEW: Formulario ----
  const isRopa = form.productType === "ropa"
  const catOpts = isRopa ? CATEGORIES_ROPA : CATEGORIES_TIENDA
  const subs = isRopa ? SUBS_ROPA[form.category] || [] : SUBS_TIENDA

  return (
    <div className="p-5 lg:p-7 pt-20 lg:pt-7 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => setView("list")} className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center shrink-0">
          <ChevronLeft className="w-4 h-4 text-text-muted" />
        </button>
        <div>
          <h1 className="font-display text-xl text-text-strong">{editingId ? "Editar producto" : "Nuevo producto"}</h1>
          <p className="text-xs text-text-muted">{isRopa ? "Prenda de ropa" : "Tienda — bazar, regalería, decoración"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Título *</label>
          <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="ej: Vestido lino sage"
            className="w-full h-11 px-4 rounded-xl bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none placeholder:text-text-muted" />
        </div>

        {/* Precio */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Precio *</label>
            <input required type="number" value={form.price || ""} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              className="w-full h-11 px-4 rounded-xl bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none" />
          </div>
        </div>

        {/* Precio anterior toggle */}
        <div>
          <button type="button" onClick={() => setShowPrevPrice(!showPrevPrice)}
            className={`flex items-center gap-2 text-xs font-semibold transition-colors ${showPrevPrice ? 'text-text-strong' : 'text-text-muted'}`}>
            <div className={`w-9 h-5 rounded-full transition-colors ${showPrevPrice ? 'bg-matcha-500' : 'bg-border-default'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${showPrevPrice ? 'ml-4' : 'ml-0.5'}`} />
            </div>
            Mostrar precio tachado
          </button>
          {showPrevPrice && (
            <input type="number" value={form.prevPrice || ""} onChange={e => setForm(f => ({ ...f, prevPrice: Number(e.target.value) }))}
              placeholder="Precio anterior"
              className="w-full h-11 px-4 mt-3 rounded-xl bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none" />
          )}
        </div>

        {/* Marca (solo ropa) */}
        {isRopa && (
          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Marca</label>
            <input value={form.brand || ""} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
              placeholder="ej: Zara, COS, Adidas"
              className="w-full h-11 px-4 rounded-xl bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none placeholder:text-text-muted" />
          </div>
        )}

        {/* Categoría / Subcategoría */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Categoría</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value, subcategory: isRopa ? (SUBS_ROPA[e.target.value]?.[0] || "") : SUBS_TIENDA[0] }))}
              className="w-full h-11 px-3 rounded-xl bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none">
              {catOpts.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Subcategoría</label>
            <select value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
              className="w-full h-11 px-3 rounded-xl bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none">
              {subs.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* Estado (solo ropa) */}
        {isRopa && (
          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">Estado *</label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => (
                <button key={c.value} type="button" onClick={() => setForm(f => ({ ...f, condition: c.value }))}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-colors
                    ${form.condition === c.value ? 'bg-brand text-white border-brand' : 'bg-surface-sunken text-text-body border-transparent'}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Talles (solo ropa) */}
        {isRopa && (
          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">Talles *</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} type="button" onClick={() => toggleSize(s)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-colors
                    ${form.sizes.includes(s) ? 'bg-brand text-white border-brand' : 'bg-surface-sunken text-text-body border-transparent'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colores */}
        <div>
          <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">Colores</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {COLORES.map(c => (
              <button key={c} type="button" onClick={() => setForm(f => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter(x => x !== c) : [...f.colors, c] }))}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors
                  ${form.colors.includes(c) ? 'bg-surface-inverse text-white border-surface-inverse' : 'bg-surface-sunken text-text-body border-transparent'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newColor} onChange={e => setNewColor(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addColor() } }}
              placeholder="Agregar color..."
              className="flex-1 h-9 px-3 rounded-lg bg-surface-sunken text-xs border border-transparent focus:border-brand outline-none" />
            <button type="button" onClick={addColor} className="px-3 h-9 rounded-full bg-surface-sunken text-xs font-semibold hover:bg-matcha-100 transition-colors">+</button>
          </div>
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">Imágenes *</label>
          {form.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative shrink-0">
                  <img src={url} alt="" className="w-20 h-26 rounded-lg object-cover" />
                  <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error-500 text-white flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input value={newImage} onChange={e => setNewImage(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addImage() } }}
              placeholder="URL de la imagen..."
              className="flex-1 h-11 px-4 rounded-xl bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none placeholder:text-text-muted" />
            <button type="button" onClick={addImage}
              className="h-11 px-4 rounded-full bg-surface-sunken flex items-center gap-1.5 text-sm font-semibold hover:bg-matcha-100 transition-colors">
              <Upload className="w-4 h-4" /> +
            </button>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">Descripción</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3} placeholder="Describí el producto, material, cuidados..."
            className="w-full px-4 py-3 rounded-xl bg-surface-sunken text-sm border border-transparent focus:border-brand outline-none placeholder:text-text-muted resize-none" />
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.free_shipping}
              onChange={e => setForm(f => ({ ...f, free_shipping: e.target.checked }))}
              className="accent-brand w-4 h-4 rounded" />
            <span className="flex items-center gap-1.5 text-sm text-text-body">
              <Truck className="w-4 h-4 text-success-500" /> Envío gratis
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.destacado}
              onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
              className="accent-brand w-4 h-4 rounded" />
            <span className="flex items-center gap-1.5 text-sm text-text-body">
              <Star className="w-4 h-4 text-chai-500 fill-chai-500" /> Producto destacado
            </span>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error-50 text-error-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={saving}
          className="w-full h-12 bg-brand text-white font-semibold rounded-full text-sm hover:bg-brand-hover transition-colors disabled:opacity-50">
          {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Publicar producto"}
        </button>
      </form>
    </div>
  )
}
