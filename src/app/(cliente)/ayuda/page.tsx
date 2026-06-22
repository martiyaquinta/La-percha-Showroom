"use client"
import { useState } from "react"
import { useAdminStore } from "@/store/useAdminStore"
import { ChevronDown, HelpCircle } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AyudaPage() {
  const faq = useAdminStore(s => s.faq)
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 flex items-center gap-3 px-5 bg-bg-page border-b border-border-subtle sticky top-0 z-10 lg:top-16">
        <Link href="/perfil" className="w-9 h-9 rounded-full bg-surface-sunken flex items-center justify-center shrink-0">
          <ArrowLeft className="w-4 h-4 text-text-muted" />
        </Link>
        <h1 className="font-display text-xl text-text-strong">Preguntas frecuentes</h1>
      </header>

      <div className="flex-1 p-5 lg:p-7 max-w-2xl mx-auto w-full space-y-2 pb-24">
        {faq.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-muted">
            <HelpCircle className="w-10 h-10" />
            <p className="text-sm">No hay preguntas cargadas todavía.</p>
          </div>
        ) : (
          faq.map(item => {
            const isOpen = openId === item.id
            return (
              <div key={item.id} className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
                <button onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-surface-sunken transition-colors">
                  <span className="text-sm font-semibold text-text-strong pr-4">{item.pregunta}</span>
                  <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4">
                    <div className="border-t border-border-subtle pt-3 text-sm text-text-body leading-relaxed whitespace-pre-line">
                      {item.respuesta}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
