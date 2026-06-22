import Link from "next/link"
import { Sparkles, ShoppingBag, Shirt, Truck } from "lucide-react"

export default function RootPage() {
  return (
    <main className="min-h-screen bg-bg-page flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <img src="/logo.jpg" alt="La Percha Showroom"
          className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl mx-auto object-cover shadow-lg" />

        {/* Título + tagline */}
        <div className="space-y-3">
          <h1 className="font-display text-4xl lg:text-5xl text-text-strong tracking-tight leading-tight">
            La Percha{" "}
            <span className="text-brand">Showroom</span>
          </h1>
          <p className="text-text-muted text-sm lg:text-base leading-relaxed">
            Tu espacio de moda circular y accesorios en un solo lugar
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Shirt, label: "Comprá ropa\ny regalería" },
            { icon: ShoppingBag, label: "Vendé lo que\nya no usás" },
            { icon: Truck, label: "Envíos a todo\nel país" },
          ].map(f => (
            <div key={f.label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-sunken">
              <span className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-sage-600" />
              </span>
              <p className="text-[11px] text-text-muted leading-snug whitespace-pre-line">
                {f.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full">
          <Link href="/ingresar/registrarse"
            className="w-full h-13 bg-brand hover:bg-brand-hover text-white
              font-semibold rounded-full flex items-center justify-center gap-2
              transition-colors text-sm lg:text-base shadow-lg shadow-brand/20">
            <Sparkles className="w-4 h-4" />
            Registrarme — comprá y vendé ropa
          </Link>
          <div className="flex gap-3">
            <Link href="/home"
              className="flex-1 h-12 border border-border-default text-text-body
                font-semibold rounded-full flex items-center justify-center
                hover:border-brand hover:text-brand transition-colors text-sm">
              Entrar a ver qué hay
            </Link>
            <Link href="/ingresar"
              className="flex-1 h-12 text-brand font-semibold rounded-full
                flex items-center justify-center hover:bg-sage-50 transition-colors text-sm">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
