"use client"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle, XCircle, Eye } from "lucide-react"

const MOCK_PUBLICACIONES = [
  {
    id: 'mp1', title: 'Vestido lino sage', price: 24900, status: 'pendiente',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=160&fit=crop',
    date: '21 jun 2026',
  },
  {
    id: 'mp2', title: 'Blazer crema oversize', price: 18900, status: 'aprobada',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e6f?w=120&h=160&fit=crop',
    date: '19 jun 2026',
  },
  {
    id: 'mp3', title: 'Campera de cuero marrón', price: 42000, status: 'pendiente',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=120&h=160&fit=crop',
    date: '20 jun 2026',
  },
  {
    id: 'mp4', title: 'Top crochet mint', price: 9800, status: 'rechazada',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=120&h=160&fit=crop',
    date: '18 jun 2026',
    reason: 'La foto no muestra bien la prenda. Subí una foto con mejor luz.',
  },
]

const STATUS_CONFIG: Record<string, { icon: typeof Clock; label: string; className: string }> = {
  pendiente: { icon: Clock, label: 'Pendiente', className: 'bg-warning-50 text-warning-500' },
  aprobada: { icon: CheckCircle, label: 'Aprobada', className: 'bg-success-50 text-success-600' },
  rechazada: { icon: XCircle, label: 'Rechazada', className: 'bg-error-50 text-error-500' },
}

export default function PublicacionesPage() {
  const pendientes = MOCK_PUBLICACIONES.filter(p => p.status === 'pendiente')
  const aprobadas = MOCK_PUBLICACIONES.filter(p => p.status === 'aprobada')
  const rechazadas = MOCK_PUBLICACIONES.filter(p => p.status === 'rechazada')

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 flex items-center gap-3 px-5 bg-bg-page border-b border-border-subtle sticky top-0 z-10 lg:top-16">
        <Link href="/perfil" className="w-9 h-9 rounded-full bg-surface-sunken flex items-center justify-center shrink-0">
          <ArrowLeft className="w-4 h-4 text-text-muted" />
        </Link>
        <h1 className="font-display text-xl text-text-strong">Mis publicaciones</h1>
      </header>

      <div className="flex-1 px-4 lg:px-6 py-4 space-y-6 pb-24 lg:pb-10 max-w-lg mx-auto w-full">
        {/* Pendientes */}
        {pendientes.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-warning-500" />
              <h2 className="text-sm font-semibold text-text-strong">Pendientes de aprobación</h2>
              <span className="text-xs text-text-muted">({pendientes.length})</span>
            </div>
            <div className="space-y-3">
              {pendientes.map(p => (
                <div key={p.id}
                  className="bg-surface-card rounded-xl border border-warning-200 overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <img src={p.image} alt={p.title}
                      className="w-20 h-26 rounded-lg object-cover bg-surface-sunken shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-text-strong leading-snug">{p.title}</p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning-50 text-warning-500 shrink-0">
                            Pendiente
                          </span>
                        </div>
                        <p className="text-sm font-bold text-price mt-1">
                          $ {p.price.toLocaleString('es-AR')}
                        </p>
                      </div>
                      <p className="text-[10px] text-text-subtle mt-1">Publicada el {p.date}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2.5 bg-warning-50/50 border-t border-warning-100">
                    <p className="text-[10px] text-warning-600 leading-relaxed">
                      ⏳ Tu prenda está siendo revisada por nuestro equipo. Suele tardar menos de 24 horas.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Aprobadas */}
        {aprobadas.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-success-500" />
              <h2 className="text-sm font-semibold text-text-strong">Publicadas</h2>
              <span className="text-xs text-text-muted">({aprobadas.length})</span>
            </div>
            <div className="space-y-3">
              {aprobadas.map(p => (
                <div key={p.id}
                  className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <img src={p.image} alt={p.title}
                      className="w-20 h-26 rounded-lg object-cover bg-surface-sunken shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-text-strong leading-snug">{p.title}</p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success-50 text-success-600 shrink-0">
                            Activa
                          </span>
                        </div>
                        <p className="text-sm font-bold text-price mt-1">
                          $ {p.price.toLocaleString('es-AR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] text-text-subtle">{p.date}</p>
                        <Link href={`/producto/${p.id}`}
                          className="flex items-center gap-1 text-[10px] font-semibold text-brand hover:underline">
                          <Eye className="w-3 h-3" />
                          Ver publicación
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rechazadas */}
        {rechazadas.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-error-500" />
              <h2 className="text-sm font-semibold text-text-strong">Rechazadas</h2>
              <span className="text-xs text-text-muted">({rechazadas.length})</span>
            </div>
            <div className="space-y-3">
              {rechazadas.map(p => (
                <div key={p.id}
                  className="bg-surface-card rounded-xl border border-error-200 overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <img src={p.image} alt={p.title}
                      className="w-20 h-26 rounded-lg object-cover bg-surface-sunken shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-text-strong leading-snug">{p.title}</p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-error-50 text-error-500 shrink-0">
                            Rechazada
                          </span>
                        </div>
                        <p className="text-sm font-bold text-price mt-1">
                          $ {p.price.toLocaleString('es-AR')}
                        </p>
                      </div>
                      <p className="text-[10px] text-text-subtle mt-1">{p.date}</p>
                    </div>
                  </div>
                  {p.reason && (
                    <div className="px-3 py-2.5 bg-error-50/50 border-t border-error-100">
                      <p className="text-[10px] text-error-600 leading-relaxed">
                        {p.reason}
                      </p>
                      <button
                        className="mt-1.5 text-[10px] font-semibold text-brand hover:underline">
                        Editar y volver a enviar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <Link href="/vender"
          className="flex items-center justify-center gap-2 w-full h-12 bg-brand hover:bg-brand-hover
            text-white font-semibold rounded-full transition-colors text-sm">
          + Publicar otra prenda
        </Link>
      </div>
    </div>
  )
}
