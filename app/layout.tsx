import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ClientHeader from "./ClientHeader";

export const metadata = {
    title: "JStore - Football Jerseys Store",
    description: "Discover high-quality football jerseys from top clubs worldwide. Premium designs, custom printing, and fast delivery.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt">
        <body>
        <AuthProvider>
            <CartProvider>
                <ClientHeader />
                <main className="container pb-24">{children}</main>
            </CartProvider>
        </AuthProvider>
        </body>
        </html>
    );
}