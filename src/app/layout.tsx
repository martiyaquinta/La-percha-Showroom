import type { Metadata, Viewport } from "next";
import { Marcellus, Mulish } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({ variable: "--font-display", subsets: ["latin"], weight: ["400"] });
const mulish = Mulish({ variable: "--font-ui", subsets: ["latin"], weight: ["300","400","500","600","700","800"] });

export const metadata: Metadata = {
  title: "La Percha Showroom", description: "Tienda Oficial + Feria de Ropa",
  icons: { apple: "/apple-touch-icon.png" },
  appleWebApp: { capable: true, statusBarStyle: "default" },
};
export const viewport: Viewport = {
  themeColor: "#faf7f2", width: "device-width", initialScale: 1, maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${marcellus.variable} ${mulish.variable}`}>
      <body className="min-h-screen bg-bg-page text-text-body font-ui">{children}</body>
    </html>
  );
}
