"use client";
import dynamic from "next/dynamic";
const ClienteNavbar = dynamic(() => import("@/components/ClienteNavbar"), { ssr: false });
export default function NavbarWrapper() {
  return <ClienteNavbar />;
}
