"use client";
import { createContext, useContext, useState } from "react";

type CartItem = {
    product_id: string;
    product_name: string;
    size: string;
    print: boolean;
    print_name?: string;
    print_number?: string;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    updateItem: (index: number, changes: Partial<CartItem>) => void;
    removeItem: (index: number) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (item: CartItem) => setItems((prev) => [...prev, item]);

    const updateItem = (index: number, changes: Partial<CartItem>) =>
        setItems((prev) =>
            prev.map((it, i) => (i === index ? { ...it, ...changes } : it))
        );

    const removeItem = (index: number) =>
        setItems((prev) => prev.filter((_, i) => i !== index));

    const clear = () => setItems([]);

    return (
        <CartContext.Provider value={{ items, addItem, updateItem, removeItem, clear }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}
