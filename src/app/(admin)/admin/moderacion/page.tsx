"use client"
import { useState } from "react"
import { useAdminStore, type AdminProduct } from "@/store/useAdminStore"
import { Check, X, Eye, Search } from "lucide-react"

export default function ModeracionPage() {
  const { products, approveProduct, rejectProduct } = useAdminStore()
  const [selected, setSelected] = useState<AdminProduct | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")

  const filtered = products.filter(p => filter === "all" ? true : p.status === filter)

  const counts = {
    all: products.length,
    pending: products.filter(p => p.status === "pending").length,
    approved: products.filter(p => p.status === "approved").length,
    rejected: products.filter(p => p.status === "rejected").length,
  }

  const FILTERS = [
    { value: "pending" as const, label: "Pendientes", count: counts.pending },
    { value: "approved" as const, label: "Aprobadas", count: counts.approved },
    { value: "rejected" as const, label: "Rechazadas", count: counts.rejected },
    { value: "all" as const, label: "Todas", count: counts.all },
  ]

  return (
    <div className="p-5 lg:p-7 pt-20 lg:pt-7 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-text-strong">Moderación</h1>
          <p className="text-sm text-text-muted mt-1">Aprobá o rechazá publicaciones</p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors
              ${filter === f.value ? 'bg-brand text-text-on-brand' : 'bg-surface-sunken text-text-body'}`}>
            {f.label}
            <span className="ml-1.5 opacity-70">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Product list */}
      <div className="bg-surface-card rounded-xl border border-border-subtle divide-y divide-border-subtle">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-text-muted">
            No hay publicaciones {filter === "pending" ? "pendientes" : filter === "approved" ? "aprobadas" : filter === "rejected" ? "rechazadas" : ""}
          </div>
        ) : (
          filtered.map(p => (
            <div key={p.id} className={`px-4 py-3 transition-colors ${selected?.id === p.id ? 'bg-matcha-50' : ''}`}>
              <div className="flex items-center gap-3">
                <img src={p.image} alt="" className="w-12 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-strong truncate">{p.title}</p>
                  <p className="text-xs text-text-muted">{p.seller} · {p.sellerType === "oficial" ? "Tienda Oficial" : "Feria"}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {p.category} · {p.condition === "new_tag" ? "Nuevo c/etiqueta" : p.condition === "new" ? "Nuevo" : p.condition === "like_new" ? "Como nuevo" : "Usado"}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-sm font-bold text-price">${p.price.toLocaleString("es-AR")}</p>
                    {p.status === "pending" ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-warning-50 text-warning-600">Pendiente</span>
                    ) : p.status === "approved" ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-success-50 text-success-600">Aprobada</span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-error-50 text-error-500">Rechazada</span>
                    )}
                  </div>
                </div>

                {p.status === "pending" && (
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => approveProduct(p.id)}
                      className="w-8 h-8 rounded-full bg-success-50 text-success-600 flex items-center justify-center hover:bg-success-500 hover:text-white transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => rejectProduct(p.id)}
                      className="w-8 h-8 rounded-full bg-error-50 text-error-500 flex items-center justify-center hover:bg-error-500 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
