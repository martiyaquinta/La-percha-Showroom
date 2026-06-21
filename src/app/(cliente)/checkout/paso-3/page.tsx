"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useShopStore } from "@/store/useShopStore"
import { CheckoutStepper } from "@/components/CheckoutStepper"

export default function CheckoutPaso3() {
  const cart = useShopStore(s => s.cart)
  const total = useShopStore(s => s.cartTotal())
  const clearCart = useShopStore(s => s.clearCart)
  const [orderNumber] = useState(() => `LP-${Math.floor(10000 + Math.random() * 90000)}`)
  const [email, setEmail] = useState('')
  const [items, setItems] = useState(cart)
  const [orderTotal, setOrderTotal] = useState(total)

  useEffect(() => {
    // Capturar datos antes de limpiar
    setItems([...cart])
    setOrderTotal(total)
    const stored = sessionStorage.getItem('checkout_address')
    if (stored) {
      try { setEmail(JSON.parse(stored).email) } catch {}
    }
    clearCart()
    sessionStorage.removeItem('checkout_address')
    sessionStorage.removeItem('checkout_payment')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full lg:max-w-lg lg:mx-auto">
      <CheckoutStepper currentStep={3} />

      <div className="px-4 lg:px-0 py-8 flex flex-col items-center gap-6">
        {/* Ícono éxito */}
        <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-success-500" />
        </div>

        <div className="text-center">
          <h1 className="font-display text-2xl text-text-strong">¡Pedido confirmado!</h1>
          <p className="text-text-muted text-sm mt-1">
            Orden <span className="font-mono font-semibold text-text-strong">#{orderNumber}</span>
          </p>
          {email && (
            <p className="text-text-muted text-sm mt-1">
              Te enviamos los detalles a <strong>{email}</strong>
            </p>
          )}
        </div>

        {/* Resumen de items */}
        {items.length > 0 && (
          <div className="w-full bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
            <div className="px-4 py-3 border-b border-border-subtle">
              <p className="text-sm font-semibold text-text-strong">Tu pedido</p>
            </div>
            <div className="divide-y divide-border-subtle">
              {items.map(item => (
                <div key={item.productId} className="flex items-center gap-3 px-4 py-3">
                  <img src={item.image} alt={item.title}
                    className="w-12 h-12 rounded-md object-cover bg-surface-sunken shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-strong truncate">{item.title}</p>
                    <p className="text-xs text-text-muted">Talle {item.size}</p>
                  </div>
                  <p className="text-sm font-bold text-price shrink-0">
                    $ {item.price.toLocaleString('es-AR')}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border-subtle flex justify-between">
              <span className="font-semibold text-text-strong">Total</span>
              <span className="font-bold text-price">
                $ {orderTotal.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        )}

        <Link href="/home"
          className="w-full h-13 flex items-center justify-center
            bg-brand hover:bg-brand-hover text-text-on-brand
            font-semibold rounded-lg transition-colors">
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
