"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CatalogItem = {
    id: string;
    name: string;
};

export default function OrderPage() {
    const [mode, setMode] = useState<"catalog" | "custom">("catalog");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [items, setItems] = useState<
        {
            product_id: string;
            product_name: string;
            size: string;
            print: boolean;
            print_name?: string;
            print_number?: string;
        }[]
    >([]);
    const [customNotes, setCustomNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    // ⚠️ Para já, produtos fake. Mais tarde substituímos pelo fetch real do catálogo
    const fakeProducts: CatalogItem[] = [
        { id: "1", name: "Nike Pegasus" },
        { id: "2", name: "Adidas Predator" },
    ];

    const addItem = (p: CatalogItem) => {
        setItems([
            ...items,
            { product_id: p.id, product_name: p.name, size: "M", print: false },
        ]);
    };

    const updateItem = (
        idx: number,
        changes: Partial<typeof items[number]>
    ) => {
        setItems((prev) =>
            prev.map((it, i) => (i === idx ? { ...it, ...changes } : it))
        );
    };

    const submitOrder = async () => {
        if (!name || !phone) {
            setMsg("❌ Nome e telefone são obrigatórios.");
            return;
        }

        setLoading(true);
        setMsg("");

        const { error } = await supabase.from("orders").insert({
            customer_name: name,
            customer_phone: phone,
            type: mode,
            items: mode === "catalog" ? items : null,
            notes: mode === "custom" ? customNotes : null,
        });

        setLoading(false);

        if (error) {
            setMsg("❌ Erro: " + error.message);
        } else {
            setMsg("✅ Pedido enviado com sucesso!");
            setItems([]);
            setCustomNotes("");
            setName("");
            setPhone("");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="h1">Checkout</h1>

            {/* Escolha do modo */}
            <div className="flex gap-4">
                <button
                    className={`btn ${mode === "catalog" ? "btn-primary" : ""}`}
                    onClick={() => setMode("catalog")}
                >
                    Do Catálogo
                </button>
                <button
                    className={`btn ${mode === "custom" ? "btn-primary" : ""}`}
                    onClick={() => setMode("custom")}
                >
                    Custom
                </button>
            </div>

            {/* Dados do cliente */}
            <div className="space-y-4">
                <input
                    className="input w-full"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="input w-full"
                    placeholder="Telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>

            {/* Modo Catálogo */}
            {mode === "catalog" ? (
                <div className="space-y-4">
                    <h2 className="h2">Selecionar Produtos</h2>
                    <div className="flex flex-wrap gap-2">
                        {fakeProducts.map((p) => (
                            <button key={p.id} className="btn" onClick={() => addItem(p)}>
                                + {p.name}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {items.map((it, idx) => (
                            <div key={idx} className="card p-3 space-y-2">
                                <div className="flex gap-3 items-center">
                                    <span className="font-bold flex-1">{it.product_name}</span>

                                    <select
                                        value={it.size}
                                        onChange={(e) =>
                                            updateItem(idx, { size: e.target.value })
                                        }
                                        className="input"
                                    >
                                        <option>S</option>
                                        <option>M</option>
                                        <option>L</option>
                                        <option>XL</option>
                                    </select>

                                    <label className="flex items-center gap-1">
                                        <input
                                            type="checkbox"
                                            checked={it.print}
                                            onChange={(e) =>
                                                updateItem(idx, { print: e.target.checked })
                                            }
                                        />
                                        Print
                                    </label>
                                </div>

                                {it.print && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Nome na camisola"
                                            className="input"
                                            value={it.print_name || ""}
                                            onChange={(e) =>
                                                updateItem(idx, { print_name: e.target.value })
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="Número"
                                            className="input"
                                            value={it.print_number || ""}
                                            onChange={(e) =>
                                                updateItem(idx, { print_number: e.target.value })
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Modo Custom
                <textarea
                    className="input w-full"
                    placeholder="Descreve o teu pedido"
                    rows={4}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                />
            )}

            {/* Botão Submit */}
            <button
                className="btn btn-primary"
                onClick={submitOrder}
                disabled={loading}
            >
                {loading ? "A enviar..." : "Enviar Pedido"}
            </button>

            {msg && <p>{msg}</p>}
        </div>
    );
}
