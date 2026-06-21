import Link from "next/link"
import { Check } from "lucide-react"

const STEPS = [
  { n: 1, label: 'Entrega', href: '/checkout/paso-1' },
  { n: 2, label: 'Pago', href: '/checkout/paso-2' },
  { n: 3, label: 'Confirmación', href: '/checkout/paso-3' },
]

export function CheckoutStepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-0 px-4 py-4">
      {STEPS.map((step, i) => {
        const done = step.n < currentStep
        const active = step.n === currentStep

        return (
          <div key={step.n} className="flex items-center">
            {done ? (
              <Link href={step.href}
                className="flex items-center gap-1.5 group">
                <span className="w-7 h-7 rounded-full bg-brand flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-text-on-brand" />
                </span>
                <span className="text-xs font-medium text-brand
                  hidden sm:block group-hover:underline">
                  {step.label}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center
                  text-xs font-bold
                  ${active
                    ? 'bg-brand text-text-on-brand'
                    : 'bg-surface-sunken text-text-muted'}`}>
                  {step.n}
                </span>
                <span className={`text-xs font-medium hidden sm:block
                  ${active ? 'text-text-strong' : 'text-text-muted'}`}>
                  {step.label}
                </span>
              </div>
            )}

            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px mx-2
                ${step.n < currentStep ? 'bg-brand' : 'bg-border-default'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
