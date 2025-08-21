"use client";
import { useEffect, useState } from "react";

export type CartItem = {
    product_id: string;
    product_name: string;
    size: string;
    print: boolean;
    print_name?: string;
    print_number?: string;
};

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("cart");
            if (saved) setItems(JSON.parse(saved));
        } catch {}
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addItem = (item: CartItem) => {
        setItems((prev) => [...prev, item]);
        console.log(items);
    }
    const updateItem = (index: number, changes: Partial<CartItem>) =>
        setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...changes } : it)));
    const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));
    const clear = () => setItems([]);

    return { items, addItem, updateItem, removeItem, clear };
}
