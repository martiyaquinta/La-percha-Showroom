import NavbarWrapper from "@/components/NavbarWrapper";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-page flex flex-col lg:pt-[6.5rem]">
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <NavbarWrapper />
    </div>
  );
}
