"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SiteAuthContextType {
    isAuthenticated: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const SiteAuthContext = createContext<SiteAuthContextType | undefined>(undefined);

// Get site password from environment variables with fallback
const SITE_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD || "jplus2024";

export function SiteAuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated
        const savedAuth = localStorage.getItem("site_authenticated");
        if (savedAuth === "true") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (password: string): Promise<boolean> => {
        // Add a small delay to prevent brute force attacks and improve UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (password === SITE_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem("site_authenticated", "true");
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("site_authenticated");
    };

    return (
        <SiteAuthContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            isLoading
        }}>
            {children}
        </SiteAuthContext.Provider>
    );
}

export function useSiteAuth() {
    const context = useContext(SiteAuthContext);
    if (context === undefined) {
        throw new Error("useSiteAuth must be used within a SiteAuthProvider");
    }
    return context;
}
