export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (<div className="mx-auto max-w-[430px] min-h-screen relative bg-bg-page">{children}</div>);
}
