"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Home, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useShopStore } from "@/store/useShopStore"

export default function ClienteNavbar() {
  const [hidratado, setHidratado] = useState(false)
  useEffect(() => { setHidratado(true) }, [])
  const pathname = usePathname()
  const cartCount = useShopStore(s => s.cartCount())
  const isHome = pathname === "/" || pathname === "/home"
  const isCart = pathname === "/carrito"

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 h-(--nav-h)
        bg-bg-page border-b border-border-subtle z-50
        items-center justify-between px-8">
        <Link href="/home" className="font-display text-xl text-text-strong">
          La Percha
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/home"
            className={`text-sm font-semibold transition-colors ${isHome ? 'text-text-strong' : 'text-text-muted hover:text-text-strong'}`}>
            Catálogo
          </Link>
          <Link href="/carrito" className="relative">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5 text-text-on-brand" />
            </div>
            {hidratado && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full
                bg-surface-inverse flex items-center justify-center
                text-[9px] font-bold text-text-on-dark">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 mx-auto
        w-full max-w-107.5 h-20 bg-bg-page border-t border-border-subtle
        flex items-center justify-between px-8 z-50">
        <Link href="/home"
          className="flex flex-col items-center gap-1 w-14 h-14 justify-center">
          <Home className={`w-5.5 h-5.5 ${isHome ? 'text-text-strong' : 'text-text-muted'}`} />
          <span className={`text-[10px] ${isHome ? 'text-text-strong font-semibold' : 'text-text-muted'}`}>
            Home
          </span>
        </Link>
        <Link href="/carrito"
          className="relative flex flex-col items-center w-14 h-14 justify-center">
          <div className={`w-12.5 h-12.5 rounded-full flex items-center justify-center
            ${isCart ? 'bg-brand ring-2 ring-surface-card' : 'bg-brand'}`}>
            <ShoppingBag className="w-5.5 h-5.5 text-text-on-brand" />
          </div>
          {hidratado && cartCount > 0 && (
            <span className="absolute -top-1 right-0 w-4.5 h-4.5 rounded-full
              bg-surface-inverse flex items-center justify-center
              text-[9px] font-bold text-text-on-dark">
              {cartCount}
            </span>
          )}
        </Link>
        <Link href="/perfil"
          className="flex flex-col items-center gap-1 w-14 h-14 justify-center">
          <User className="w-5.5 h-5.5 text-text-muted" />
          <span className="text-[10px] text-text-muted">Perfil</span>
        </Link>
      </nav>
    </>
  )
}
