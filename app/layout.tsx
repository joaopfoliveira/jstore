import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { SiteAuthProvider } from "./context/SiteAuthContext";
import ClientHeader from "./ClientHeader";
import SiteAuthGuard from "./components/SiteAuthGuard";

export const metadata = {
    metadataBase: new URL('https://jstore.vercel.app'), // Update this with your actual domain
    title: "JPlus",
    description: "Discover high-quality sports merchandise and premium products. Custom printing, fast delivery, and custom product requests. Your ultimate sports experience destination.",
    keywords: "sports merchandise, custom printing, premium quality, fast delivery, sports apparel, custom products",
    
    // Favicon
    icons: {
        icon: "/icon-reduced.png",
    },
    
    // Open Graph for Facebook, WhatsApp, LinkedIn, etc.
    openGraph: {
        title: "JPlus",
        description: "Discover high-quality sports merchandise and premium products. Custom printing, fast delivery, and custom product requests.",
        url: "/",
        siteName: "JPlus",
        type: "website",
        locale: "pt_PT",
        images: [
            {
                url: "/og-image.svg",
                width: 1200,
                height: 630,
                alt: "JPlus",
            },
        ],
    },
    
    // Twitter Card
    twitter: {
        card: "summary_large_image",
        title: "JPlus",
        description: "Discover high-quality sports merchandise and premium products. Custom printing, fast delivery, and custom product requests.",
        images: ["/og-image.svg"],
        creator: "@jplusSports", // Update with your actual Twitter handle if you have one
    },
    
    // Additional metadata
    robots: {
        index: true,
        follow: true,
    },
    
    // Theme color for mobile browsers
    themeColor: "#4A90E2",
    
    // App info
    applicationName: "JPlus",
    
    // Authors and generator
    authors: [{ name: "JPlus Team" }],
    generator: "Next.js",
    
    // Referrer policy
    referrer: "origin-when-cross-origin",
    
    // Color scheme
    colorScheme: "light",
    
    // Viewport
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt">
        <body>
        <SiteAuthProvider>
            <SiteAuthGuard>
                <AuthProvider>
                    <CartProvider>
                        <ClientHeader />
                        <main className="container pt-8 pb-24">{children}</main>
                    </CartProvider>
                </AuthProvider>
            </SiteAuthGuard>
        </SiteAuthProvider>
        </body>
        </html>
    );
}