import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhatsApp Catalog MVP",
  description: "Catálogo simples com pedidos e geração de mensagem para WhatsApp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <header className="container py-4">
          <nav className="flex items-center justify-between">
            <a href="/" className="h2">Catálogo</a>
            <div className="flex gap-2">
              <a className="btn btn-primary" href="/order">Fazer Pedido</a>
              <a className="btn" href="/admin">Admin</a>
            </div>
          </nav>
        </header>
        <main className="container pb-24">{children}</main>
      </body>
    </html>
  );
}
