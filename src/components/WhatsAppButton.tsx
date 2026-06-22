"use client"

const WHATSAPP_URL = "https://wa.me/5492494371107?text=Hola%20La%20Percha!%20Tengo%20una%20consulta"

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Zm0 0a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  )
}

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-30
        w-12 h-12 rounded-full bg-[#25D366]/80 backdrop-blur-sm text-white
        flex items-center justify-center
        shadow-lg shadow-[#25D366]/15 hover:shadow-xl hover:shadow-[#25D366]/25
        hover:bg-[#25D366] hover:scale-105 active:scale-95
        transition-all duration-200"
    >
      <WhatsAppIcon />
    </a>
  )
}
