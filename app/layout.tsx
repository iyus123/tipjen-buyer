import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipjen Shop",
  description: "Web pembeli Tipjen",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <div className="container page-shell">{children}</div>
      </body>
    </html>
  );
}
