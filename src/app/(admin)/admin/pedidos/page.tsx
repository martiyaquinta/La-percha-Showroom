"use client"
import { useState } from "react"
import { useAdminStore } from "@/store/useAdminStore"
import { Check, Truck, PackageCheck, MapPin, Mail } from "lucide-react"

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending_shipment: { label: "Pendiente de envío", className: "bg-warning-50 text-warning-600" },
  shipped: { label: "Enviado", className: "bg-info-50 text-info-600" },
  delivered: { label: "Entregado", className: "bg-success-50 text-success-600" },
  cancelled: { label: "Cancelado", className: "bg-error-50 text-error-500" },
}

export default function PedidosPage() {
  const { orders, markOrderShipped, markOrderDelivered } = useAdminStore()
  const [filter, setFilter] = useState<"all" | "pending_shipment" | "shipped" | "delivered">("pending_shipment")
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = orders.filter(o => filter === "all" ? true : o.status === filter)

  const counts = {
    all: orders.length,
    pending_shipment: orders.filter(o => o.status === "pending_shipment").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  }

  const FILTERS = [
    { value: "pending_shipment" as const, label: "Pendientes", count: counts.pending_shipment },
    { value: "shipped" as const, label: "Enviados", count: counts.shipped },
    { value: "delivered" as const, label: "Entregados", count: counts.delivered },
    { value: "all" as const, label: "Todos", count: counts.all },
  ]

  const totalSales = orders.reduce((sum, o) => sum + o.price, 0)

  return (
    <div className="p-5 lg:p-7 pt-20 lg:pt-7 space-y-5 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl text-text-strong">Pedidos</h1>
        <p className="text-sm text-text-muted mt-1">
          {orders.length} pedidos · ${totalSales.toLocaleString("es-AR")} total
        </p>
      </div>

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

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-surface-card rounded-xl border border-border-subtle px-4 py-12 text-center text-sm text-text-muted">
            No hay pedidos {filter === "pending_shipment" ? "pendientes" : filter === "shipped" ? "enviados" : filter === "delivered" ? "entregados" : ""}
          </div>
        ) : (
          filtered.map(o => {
            const isOpen = expanded === o.id
            const st = STATUS_LABEL[o.status]
            return (
              <div key={o.id} className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <img src={o.productImage} alt="" className="w-14 h-18 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-text-strong truncate">{o.productTitle}</p>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${st.className}`}>{st.label}</span>
                      </div>
                      <p className="text-xs text-text-muted">Comprador: {o.buyerName} · {o.buyerEmail}</p>
                      <p className="text-xs text-text-muted">Vendedor: {o.sellerName} · Talle {o.size}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-sm font-bold text-price">${o.price.toLocaleString("es-AR")}</p>
                        <p className="text-[10px] text-text-muted">{o.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {o.status === "pending_shipment" && (
                        <button onClick={() => markOrderShipped(o.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-info-50 text-info-600 hover:bg-info-500 hover:text-white transition-colors">
                          <Truck className="w-3 h-3" /> Enviar
                        </button>
                      )}
                      {o.status === "shipped" && (
                        <button onClick={() => markOrderDelivered(o.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-success-50 text-success-600 hover:bg-success-500 hover:text-white transition-colors">
                          <PackageCheck className="w-3 h-3" /> Entregado
                        </button>
                      )}
                      <button onClick={() => setExpanded(isOpen ? null : o.id)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-medium text-text-muted hover:bg-surface-sunken transition-colors">
                        {isOpen ? "Menos" : "Detalles"}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-border-subtle space-y-2">
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <MapPin className="w-3.5 h-3.5" />
                        {o.address}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Mail className="w-3.5 h-3.5" />
                        Comprador: {o.buyerEmail} · Vendedor: {o.sellerEmail}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
