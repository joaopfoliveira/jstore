"use client";

import { useSiteAuth } from "../context/SiteAuthContext";
import SiteLogin from "./SiteLogin";

export default function SiteAuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useSiteAuth();

    if (isLoading) {
        // Loading spinner
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <SiteLogin />;
    }

    return <>{children}</>;
}
