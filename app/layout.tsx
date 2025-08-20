import "./globals.css";
import { CartProvider } from "./context/CartContext";

export const metadata = {
    title: "Catalog",
    description: "Demo catalog with cart and orders",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt">
        <body>
        <CartProvider>
            <header className="container py-4">
                <nav className="flex items-center justify-between">

                    <div className="flex gap-2">
                        <a className="btn btn-primary" href="/catalog" >
                            Catalog
                        </a>
                        <a className="btn btn-primary" href="/order">
                            Cart
                        </a>
                        <a className="btn" href="/admin">
                            Admin
                        </a>
                    </div>
                </nav>
            </header>
            <main className="container pb-24">{children}</main>
        </CartProvider>
        </body>
        </html>
    );
}