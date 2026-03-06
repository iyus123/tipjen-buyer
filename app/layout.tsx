import "./globals.css";
import type { Metadata } from "next";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: `${env.storeName} Shop`,
  description: `Katalog cozy dan modern untuk toko ${env.storeName}`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
