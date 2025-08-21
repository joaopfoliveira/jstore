"use client";

import { useCart } from "./context/CartContext";
import { usePathname } from "next/navigation";

export default function ClientHeader() {
    const { getTotalItems } = useCart();
    const pathname = usePathname();
    const cartItemCount = getTotalItems();

    return (
        <header className="container py-4">
            <nav className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    <a 
                        className={`btn ${pathname === '/' ? 'btn-primary' : ''}`} 
                        href="/"
                    >
                        Home
                    </a>
                    <a 
                        className={`btn ${pathname === '/catalog' ? 'btn-primary' : ''}`} 
                        href="/catalog"
                    >
                        Catalog
                    </a>
                    <a 
                        className={`btn ${pathname === '/order' ? 'btn-primary' : ''} relative`} 
                        href="/order"
                    >
                        Cart
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </a>
                    <a 
                        className={`btn ${pathname === '/track' ? 'btn-primary' : ''}`} 
                        href="/track"
                    >
                        Track Order
                    </a>

                </div>
            </nav>
        </header>
    );
}
