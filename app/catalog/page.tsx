"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
    id: string | number;
    name: string;
    image_url: string | null;
    created_at?: string;
};

export default function CatalogPage() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 24;

    // Reset to page 1 whenever search changes
    useEffect(() => setPage(1), [debouncedQuery]);

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            setLoading(true);
            setErrorMsg(null);

            let q = supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(200); // fetch a reasonable batch to paginate on the client

            if (debouncedQuery.trim() !== "") {
                // Full-text search (preferred)
                q = q.textSearch("search_vector", debouncedQuery, { type: "websearch" });

                // Fallback if you haven’t created search_vector yet:
                // q = q.ilike("name", `%${debouncedQuery}%`);
            }

            const { data, error } = await q;

            if (!cancelled) {
                if (error) setErrorMsg(error.message);
                setProducts(data || []);
                setLoading(false);
            }
        };

        fetchProducts();
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
    const pageSafe = Math.min(page, totalPages);
    const pageItems = useMemo(() => {
        const start = (pageSafe - 1) * PAGE_SIZE;
        return products.slice(start, start + PAGE_SIZE);
    }, [products, pageSafe]);

    const clearSearch = () => setQuery("");

    return (
        <div className="space-y-4">
            <h1 className="h1">Catálogo</h1>

            <div className="flex gap-2 items-center">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Pesquisar (ex: Nike Pegasus)"
                    className="input flex-1"
                />
                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="btn"
                        aria-label="Limpar pesquisa"
                        title="Limpar pesquisa"
                    >
                        Limpar
                    </button>
                )}
            </div>

            {loading && <p className="small">A procurar…</p>}
            {errorMsg && <p className="small text-red-400">Erro: {errorMsg}</p>}

            {/* Results */}
            <div className="grid grid-cols-1 gap-4">
                {pageItems.map((p) => {
                    const proxied = `/api/img?url=${encodeURIComponent(p.image_url!)}`;

                    return (
                        <div key={p.id} className="card">
                            {p.image_url && (
                                <img
                                    src={proxied}
                                    alt={p.name}
                                    className="w-full h-56 object-cover rounded-xl"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                />
                            )}
                            <div className="mt-3">
                                <div className="h2">{p.name}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!loading && products.length === 0 && (
                <p className="small">Sem resultados.</p>
            )}

            {/* Pagination */}
            {products.length > 0 && (
                <Pagination
                    page={pageSafe}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}

/** Debounce hook */
function useDebounce<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState(value);
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            setDebounced(value);
            return;
        }
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}

/** Simple pagination controls with compact page numbers */
function Pagination({
                        page,
                        totalPages,
                        onPageChange,
                    }: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}) {
    // Build a compact page list: 1 … near current … last
    const neighbors = 1;
    const pages: (number | "ellipsis")[] = [];

    const push = (n: number | "ellipsis") => pages.push(n);

    const start = Math.max(1, page - neighbors);
    const end = Math.min(totalPages, page + neighbors);

    if (1 < start) {
        push(1);
        if (start > 2) push("ellipsis");
    }

    for (let n = start; n <= end; n++) push(n);

    if (end < totalPages) {
        if (end < totalPages - 1) push("ellipsis");
        push(totalPages);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                className="btn"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
            >
                Anterior
            </button>

            <div className="flex items-center gap-1">
                {pages.map((p, idx) =>
                    p === "ellipsis" ? (
                        <span key={`e${idx}`} className="small px-2">…</span>
                    ) : (
                        <button
                            key={p}
                            className={`btn ${p === page ? "btn-primary" : ""}`}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </button>
                    )
                )}
            </div>

            <button
                className="btn"
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
            >
                Seguinte
            </button>
        </div>
    );
}
