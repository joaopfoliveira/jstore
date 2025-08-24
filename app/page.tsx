"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "@/app/context/CartContext";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_key"
);

type Product = {
    id: string | number;
    name: string;
    image_url: string | null;
    created_at?: string;
};

export default function Home() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);
    const [totalCount, setTotalCount] = useState(0);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Image modal state
    const [modalImage, setModalImage] = useState<{url: string, alt: string} | null>(null);

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

            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            let q;
            if (debouncedQuery.trim() !== "") {
                q = supabase
                    .from("products")
                    .select("*", { count: "exact" })
                    .ilike("name", `%${debouncedQuery}%`)
                    .order("created_at", { ascending: true })
                    .range(from, to);
            } else {
                q = supabase
                    .from("products")
                    .select("*", { count: "exact" })
                    .order("created_at", { ascending: true })
                    .range(from, to);
            }

            const { data, error, count } = await q;

            console.log(
                "DEBUG page", page, "from", from, "to", to,
                "count", count, "rows", data?.length
            );

            if (!cancelled) {
                if (error) setErrorMsg(error.message);
                setProducts(data || []);
                setTotalCount(count || 0);
                setLoading(false);
            }
        };

        fetchProducts();
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery, page]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const clearSearch = () => setQuery("");
    const { addItem } = useCart();

    // Two different size systems that are commonly used
    const TRADITIONAL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];
    const NUMERIC_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

    // Extract available sizes from product title
    const extractSizesFromTitle = (productName: string): string[] => {
        // Look for size ranges like "S-XL", "S-4XL", "M-XXL", etc.
        const sizeRangePattern = /(XS|S|M|L|XL|XXL|XXXL|XXXXL|2XL|3XL|4XL|5XL)-(XS|S|M|L|XL|XXL|XXXL|XXXXL|2XL|3XL|4XL|5XL)/gi;
        const matches = productName.match(sizeRangePattern);
        
        if (matches && matches.length > 0) {
            // Take the first match and extract the range
            const match = matches[0].toUpperCase();
            const [startSize, endSize] = match.split('-');
            
            // Determine which system to use based on the end size
            const isNumericSystem = /^\d/.test(endSize) || endSize.includes('XL') && endSize.length <= 3;
            const isTraditionalSystem = endSize === 'XXL' || endSize === 'XXXL' || endSize === 'XXXXL';
            
            let sizeSystem;
            if (isTraditionalSystem) {
                sizeSystem = TRADITIONAL_SIZES;
            } else if (isNumericSystem || /[2-5]XL/.test(endSize)) {
                sizeSystem = NUMERIC_SIZES;
            } else {
                // Default to traditional for basic ranges like S-XL
                sizeSystem = TRADITIONAL_SIZES;
            }
            
            // Find positions in the appropriate system
            const startIndex = sizeSystem.findIndex(size => size === startSize);
            const endIndex = sizeSystem.findIndex(size => size === endSize);
            
            if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
                // Return the range of sizes
                return sizeSystem.slice(startIndex, endIndex + 1);
            }
        }
        
        // Look for individual sizes mentioned (like "Size S, M, L available")
        const individualSizes = productName.match(/\b(XS|S|M|L|XL|XXL|XXXL|XXXXL|2XL|3XL|4XL|5XL)\b/gi);
        if (individualSizes && individualSizes.length > 2) {
            // If we find multiple individual sizes, use them
            const uniqueSizes = [...new Set(individualSizes.map(s => s.toUpperCase()))];
            
            // Determine which system based on what sizes we found
            const hasNumeric = uniqueSizes.some(size => /[2-5]XL/.test(size));
            const hasTraditional = uniqueSizes.some(size => ['XXL', 'XXXL', 'XXXXL'].includes(size));
            
            const referenceSystem = hasNumeric ? NUMERIC_SIZES : TRADITIONAL_SIZES;
            
            return uniqueSizes.sort((a, b) => {
                const aIndex = referenceSystem.indexOf(a);
                const bIndex = referenceSystem.indexOf(b);
                return aIndex - bIndex;
            });
        }
        
        // Default sizes if nothing found (traditional system)
        return ['S', 'M', 'L', 'XL', 'XXL'];
    };

    // Clean product title by removing size references
    const cleanProductTitle = (productName: string): string => {
        // Remove size ranges like "S-XXL", "M-4XL", etc.
        let cleanTitle = productName.replace(/(XS|S|M|L|XL|XXL|XXXL|XXXXL|2XL|3XL|4XL|5XL)-(XS|S|M|L|XL|XXL|XXXL|XXXXL|2XL|3XL|4XL|5XL)/gi, '');
        
        // Remove individual size mentions like "Available in S, M, L" or "S,M,L,XL"
        cleanTitle = cleanTitle.replace(/\b(?:available\s+in\s+|sizes?\s+)?(?:XS|S|M|L|XL|XXL|XXXL|XXXXL|2XL|3XL|4XL|5XL)(?:\s*,\s*(?:XS|S|M|L|XL|XXL|XXXL|XXXXL|2XL|3XL|4XL|5XL))+\b/gi, '');
        
        // Remove size-related words/phrases
        cleanTitle = cleanTitle.replace(/\b(available|disponível|tamanhos?|sizes?|range|faixa|available\s+in)\b/gi, '');
        
        // Clean up extra spaces, dashes, and punctuation
        cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();
        cleanTitle = cleanTitle.replace(/[-,\s]+$/, '').trim();
        cleanTitle = cleanTitle.replace(/^[-,\s]+/, '').trim();
        
        return cleanTitle;
    };

    // Get the default size for a product (first available size)
    const getDefaultSize = (productName: string): string => {
        const availableSizes = extractSizesFromTitle(productName);
        return availableSizes[0] || 'M';
    };

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setModalImage(null);
            }
        };
        
        if (modalImage) {
            document.addEventListener('keydown', handleEsc);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [modalImage]);

    return (
        <div className="space-y-4">


            <div className="flex gap-2 items-center">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search (e.g.: Real Madrid 14/15)"
                    className="input flex-1"
                />
                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="btn"
                        aria-label="Clear search"
                        title="Clear search"
                    >
                        Clear
                    </button>
                )}
            </div>

            {loading && <p className="small">Searching…</p>}
            {errorMsg && <p className="small text-red-400">Error: {errorMsg}</p>}

            {/* Results */}
            <div className="grid grid-cols-1 gap-4">
                {products.map((p) => {
                    const proxied = `/api/img?url=${encodeURIComponent(p.image_url!)}`;

                    return (
                        <div key={p.id} className="card">
                            {p.image_url && (
                                <img
                                    src={proxied}
                                    alt={p.name}
                                    className="w-full h-56 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    onClick={() => setModalImage({url: proxied, alt: p.name})}
                                    title="Click to view full size"
                                />
                            )}
                            <div className="mt-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="h2 flex-1">{p.name}</div>
                                    <button
                                        className="btn bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 flex-shrink-0 px-3 py-2 shadow-sm"
                                        onClick={() =>
                                            addItem({
                                                product_id: p.id.toString(),
                                                product_name: p.name,
                                                size: getDefaultSize(p.name),   // dynamic default based on title
                                                print: false,
                                            })
                                        }
                                        title="Add to Cart"
                                        aria-label="Add to Cart"
                                    >
                                        🛒
                                    </button>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

            {!loading && products.length === 0 && (
                <div className="text-center py-8">
                    <p className="small mb-4">No results found.</p>
                    <a href="/custom-order" className="btn bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md transition-all duration-200">
                        Request Custom Product
                    </a>
                </div>
            )}

            {/* Custom Order CTA - Always visible */}
            <div className="card p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">
                        Can't find what you're looking for?
                    </h3>
                    <p className="text-orange-600 mb-4">
                        Request any sports product and we'll try to source it for you!
                    </p>
                    <a 
                        href="/custom-order" 
                        className="btn bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md transition-all duration-200"
                    >
                        Make Custom Request
                    </a>
                </div>
            </div>

            {/* Pagination */}
            {products.length > 0 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}

            {/* Image Modal */}
            {modalImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setModalImage(null)}
                >
                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                        {/* Close button */}
                        <button
                            onClick={() => setModalImage(null)}
                            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
                            title="Close (ESC)"
                        >
                            ✕
                        </button>
                        
                        {/* Image */}
                        <img
                            src={modalImage.url}
                            alt={modalImage.alt}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        
                        {/* Image title */}
                        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg text-center">
                            <h3 className="font-semibold">{modalImage.alt}</h3>
                            <p className="text-sm opacity-75 mt-1">Click outside or press ESC to close</p>
                        </div>
                    </div>
                </div>
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
                Previous
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
                Next
            </button>
        </div>
    );
}