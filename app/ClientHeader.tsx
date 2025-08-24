"use client";

import { useCart } from "./context/CartContext";
import { usePathname } from "next/navigation";
import { useSiteAuth } from "./context/SiteAuthContext";

export default function ClientHeader() {
    const { getTotalItems } = useCart();
    const pathname = usePathname();
    const { logout } = useSiteAuth();
    const cartItemCount = getTotalItems();

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout from the site?")) {
            logout();
        }
    };

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
                    <div className="flex items-center gap-2">
                        {/* Primary Actions */}
                        <a 
                            className={`btn text-sm px-4 py-2 transition-all duration-200 ${
                                pathname === '/'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-200'
                            }`} 
                            href="/"
                        >
                            Catalog
                        </a>
                        
                        {/* Icon-only buttons */}
                        <a 
                            className={`btn p-3 transition-all duration-200 relative ${
                                pathname === '/order' 
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-200'
                            }`} 
                            href="/order"
                            title="Shopping Cart"
                        >
                            🛒
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                                    {cartItemCount}
                                </span>
                            )}
                        </a>
                        
                        <a 
                            className={`btn p-3 transition-all duration-200 ${
                                pathname === '/track' 
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-200'
                            }`} 
                            href="/track"
                            title="Track Order"
                        >
                            📦
                        </a>
                        
                        <a 
                            className={`btn p-3 transition-all duration-200 ${
                                pathname === '/pricing' 
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-200'
                            }`} 
                            href="/pricing"
                            title="Pricing"
                        >
                            💰
                        </a>
                        
                        {/* Custom CTA */}
                        <a 
                            className={`btn text-sm px-4 py-2 transition-all duration-200 ${
                                pathname === '/custom-order'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md'
                            }`} 
                            href="/custom-order"
                            title="Request custom products"
                        >
                            Custom
                        </a>
                        
                        {/* Logout button */}
                        <button 
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all duration-200 ml-2"
                            title="Logout from site"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
