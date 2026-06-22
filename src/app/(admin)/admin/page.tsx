import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-text-strong">Panel Admin</h1>
        <Link href="/" className="text-xs text-text-muted hover:text-text-strong transition-colors">← Selector</Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-card rounded-xl p-4 border border-border-subtle">
          <p className="text-xs text-text-muted uppercase tracking-wide">Publicaciones</p>
          <p className="font-display text-3xl text-text-strong mt-1">12</p>
        </div>
        <div className="bg-surface-card rounded-xl p-4 border border-border-subtle">
          <p className="text-xs text-text-muted uppercase tracking-wide">Pendientes</p>
          <p className="font-display text-3xl text-text-strong mt-1">3</p>
        </div>
        <div className="bg-surface-card rounded-xl p-4 border border-border-subtle">
          <p className="text-xs text-text-muted uppercase tracking-wide">Vendedores</p>
          <p className="font-display text-3xl text-text-strong mt-1">8</p>
        </div>
        <div className="bg-surface-card rounded-xl p-4 border border-border-subtle">
          <p className="text-xs text-text-muted uppercase tracking-wide">Ventas hoy</p>
          <p className="font-display text-3xl text-text-strong mt-1">$ 47k</p>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-subtle divide-y divide-border-subtle">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-strong">Vestido lino sage</p>
            <p className="text-xs text-text-muted">Laura M. · Feria</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-warning-50 text-warning-600">Pendiente</span>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-strong">Blazer crema oversize</p>
            <p className="text-xs text-text-muted">Tienda Oficial</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-success-50 text-success-600">Activo</span>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-strong">Top crochet mint</p>
            <p className="text-xs text-text-muted">Sofía R. · Feria</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-warning-50 text-warning-600">Pendiente</span>
        </div>
      </div>
    </div>
  );
}
