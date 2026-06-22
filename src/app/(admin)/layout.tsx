import type { Metadata, Viewport } from "next";
import "./admin.css";
import { AdminSidebar } from "./sidebar";

export const metadata: Metadata = {
  title: "Panel Admin — La Percha Showroom",
  robots: "noindex",
};
export const viewport: Viewport = {
  themeColor: "#f8f6f2", width: "device-width", initialScale: 1, maximumScale: 1,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-page">
      <AdminSidebar />
      <main className="flex-1 lg:pl-56">{children}</main>
    </div>
  );
}
