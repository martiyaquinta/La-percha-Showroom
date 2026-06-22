"use client"
import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"

const MOCK_COMPRAS = [
  {
    id: 'c1', date: '20 jun 2026', status: 'entregado',
    items: [{ title: 'Vestido lino sage', price: 24900, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=100&fit=crop' }]
  },
  {
    id: 'c2', date: '15 jun 2026', status: 'en camino',
    items: [
      { title: 'Blazer crema oversize', price: 18900, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e6f?w=80&h=100&fit=crop' },
      { title: 'Remera oversized blanca', price: 7200, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=100&fit=crop' },
    ]
  },
  {
    id: 'c3', date: '02 jun 2026', status: 'entregado',
    items: [
      { title: 'Camisa bordada off-white', price: 14500, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=80&h=100&fit=crop' },
    ]
  },
]

const STATUS_STYLE: Record<string, string> = {
  'entregado': 'bg-success-50 text-success-600',
  'en camino': 'bg-info-50 text-info-600',
  'preparando': 'bg-warning-50 text-warning-500',
}

export default function ComprasPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 flex items-center gap-3 px-5 bg-bg-page border-b border-border-subtle sticky top-0 z-10 lg:top-16">
        <Link href="/perfil" className="w-9 h-9 rounded-full bg-surface-sunken flex items-center justify-center shrink-0">
          <ArrowLeft className="w-4 h-4 text-text-muted" />
        </Link>
        <h1 className="font-display text-xl text-text-strong">Mis compras</h1>
      </header>

      <div className="flex-1 px-4 lg:px-6 py-4 space-y-4 pb-24 lg:pb-10 max-w-lg mx-auto w-full">
        {MOCK_COMPRAS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Package className="w-12 h-12 text-text-subtle" />
            <p className="text-text-muted text-sm">Todavía no hiciste ninguna compra</p>
            <Link href="/home"
              className="mt-2 px-5 py-2 rounded-full bg-brand text-white font-semibold text-sm hover:bg-brand-hover transition-colors">
              Descubrir prendas
            </Link>
          </div>
        ) : (
          MOCK_COMPRAS.map(compra => (
            <div key={compra.id}
              className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-text-muted" />
                  <span className="text-xs text-text-muted">{compra.date}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[compra.status]}`}>
                  {compra.status}
                </span>
              </div>

              {compra.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-3">
                  <img src={item.image} alt={item.title}
                    className="w-14 h-18 rounded-lg object-cover bg-surface-sunken shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-strong truncate">{item.title}</p>
                    <p className="text-sm font-bold text-price mt-0.5">
                      $ {item.price.toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}

              <div className="px-4 py-2.5 bg-surface-sunken flex justify-between items-center">
                <span className="text-xs text-text-muted">
                  {compra.items.length} prenda{compra.items.length !== 1 ? 's' : ''}
                </span>
                <span className="text-sm font-bold text-text-strong">
                  $ {compra.items.reduce((sum, i) => sum + i.price, 0).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
