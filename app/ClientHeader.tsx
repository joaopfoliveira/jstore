"use client";

import { useCart } from "./context/CartContext";
import { usePathname } from "next/navigation";

export default function ClientHeader() {
    const { getTotalItems } = useCart();
    const pathname = usePathname();
    const cartItemCount = getTotalItems();

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 shadow-sm">
            <div className="container py-4">
                <nav className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img 
                            src="/icon.png" 
                            alt="JPlus Sports" 
                            className="h-20 w-auto -my-5"
                        />
                    </div>
                    
                    {/* Navigation */}
                    <div className="flex gap-3 flex-wrap">
                        <a 
                            className={`btn transition-all duration-200 ${
                                pathname === '/'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-200'
                            }`} 
                            href="/"
                        >
                            Catalog
                        </a>
                        <a 
                            className={`btn transition-all duration-200 relative ${
                                pathname === '/order' 
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-200'
                            }`} 
                            href="/order"
                        >
                            Cart
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                                    {cartItemCount}
                                </span>
                            )}
                        </a>
                        <a 
                            className={`btn transition-all duration-200 ${
                                pathname === '/track' 
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-200'
                            }`} 
                            href="/track"
                        >
                            Track
                        </a>
                        <a 
                            className={`btn transition-all duration-200 ${
                                pathname === '/custom-order'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md'
                            }`} 
                            href="/custom-order"
                            title="Request custom products"
                        >
                            Custom
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    );
}
