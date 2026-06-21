interface Props {
  id: string
  value: string
  selected: string
  onChange: (value: string) => void
  label: string
  description: string
  children?: React.ReactNode
}

export function PaymentMethodCard({ id, value, selected, onChange, label, description, children }: Props) {
  const isSelected = selected === value
  return (
    <label htmlFor={id}
      className={`block cursor-pointer rounded-xl border-2 p-4 transition-colors
        ${isSelected
          ? 'border-brand bg-sage-50'
          : 'border-border-subtle hover:border-border-default'}`}>
      <div className="flex items-center gap-3">
        <input
          type="radio"
          id={id}
          name="payment"
          value={value}
          checked={isSelected}
          onChange={() => onChange(value)}
          className="accent-brand w-4 h-4 shrink-0"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-strong">{label}</p>
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        </div>
      </div>
      {isSelected && children && (
        <div className="mt-3 pt-3 border-t border-border-subtle">
          {children}
        </div>
      )}
    </label>
  )
}
