"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
    product_id: string;
    product_name: string;
    size: string;
    print: boolean;
    print_name?: string;
    print_number?: string;
    quantity?: number;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    updateItem: (index: number, changes: Partial<CartItem>) => void;
    removeItem: (index: number) => void;
    clear: () => void;
    getItemCount: () => number;
    getTotalItems: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cart from localStorage after hydration
    useEffect(() => {
        try {
            const saved = localStorage.getItem("cart");
            if (saved) {
                setItems(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Error loading cart from localStorage:", error);
        }
        setIsHydrated(true);
    }, []);

    // Save cart to localStorage whenever items change (but only after hydration)
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem("cart", JSON.stringify(items));
            } catch (error) {
                console.error("Error saving cart to localStorage:", error);
            }
        }
    }, [items, isHydrated]);

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        const existingItemIndex = items.findIndex(
            (existingItem) =>
                existingItem.product_id === item.product_id &&
                existingItem.size === item.size &&
                existingItem.print === item.print &&
                existingItem.print_name === item.print_name &&
                existingItem.print_number === item.print_number
        );

        if (existingItemIndex !== -1) {
            // If item already exists, increase quantity

            setItems((prev) =>
                prev.map((it, i) =>
                    i === existingItemIndex
                        ? { ...it, quantity: (it.quantity || 1) + 1 }
                        : it
                )
            );
        } else {
            // Add new item with quantity 1
            setItems((prev) => [...prev, { ...item, quantity: 1 }]);
        }
    };

    const updateItem = (index: number, changes: Partial<CartItem>) => {
        setItems((prev) =>
            prev.map((it, i) => (i === index ? { ...it, ...changes } : it))
        );
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const clear = () => {
        setItems([]);
    };

    const getItemCount = () => items.length;

    const getTotalItems = () => items.reduce((total, item) => total + (item.quantity || 1), 0);

    return (
        <CartContext.Provider value={{ 
            items, 
            addItem, 
            updateItem, 
            removeItem, 
            clear, 
            getItemCount, 
            getTotalItems
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used inside CartProvider");
    }
    return ctx;
}
