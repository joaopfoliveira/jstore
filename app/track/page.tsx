"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Order = {
    id: number;
    customer_name: string;
    customer_phone: string;
    order_code: string;
    items: Array<{
        product_id: string;
        product_name: string;
        size: string;
        quantity?: number;
        print: boolean;
        print_name?: string;
        print_number?: string;
    }>;
    created_at: string;
    type: string;
    notes?: string;
};

export default function TrackOrderPage() {
    const [orderCode, setOrderCode] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const trackOrder = async () => {
        if (!orderCode.trim()) {
            setError("Please enter an order code.");
            return;
        }

        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const { data, error: supabaseError } = await supabase
                .from("orders")
                .select("*")
                .eq("order_code", orderCode.trim().toUpperCase())
                .single();

            if (supabaseError || !data) {
                setError("Order not found. Please check your order code and try again.");
            } else {
                setOrder(data);
            }
        } catch (err) {
            setError("An error occurred while searching for your order.");
            console.error("Track order error:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getTotalItems = (items: Order['items']) => {
        return items.reduce((total, item) => total + (item.quantity || 1), 0);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="h1">Track Your Order</h1>
            
            {/* Search Section */}
            <div className="card p-6">
                <h2 className="h2 mb-4">Enter Your Order Code</h2>
                <p className="text-gray-600 mb-4">
                    Enter the order code you received after placing your order to track its status.
                </p>
                
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="e.g., JS1234ABCD56"
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                        className="input flex-1"
                        maxLength={12}
                    />
                    <button
                        onClick={trackOrder}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? "Searching..." : "Track Order"}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
                        {error}
                    </div>
                )}
            </div>

            {/* Order Details */}
            {order && (
                <div className="space-y-6">
                    {/* Order Info */}
                    <div className="card p-6">
                        <h2 className="h2 mb-4">Order Details</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Order Code</p>
                                <p className="font-mono text-lg font-bold text-blue-600">{order.order_code}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Order Date</p>
                                <p className="font-medium">{formatDate(order.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Customer Name</p>
                                <p className="font-medium">{order.customer_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phone Number</p>
                                <p className="font-medium">{order.customer_phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="card p-6">
                        <h2 className="h2 mb-4">Order Status</h2>
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                            </div>
                            <div>
                                <p className="font-medium">Order Received</p>
                                <p className="text-sm text-gray-600">Your order has been successfully placed and is being processed.</p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="card p-6">
                        <h2 className="h2 mb-4">Ordered Items ({getTotalItems(order.items)} items)</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{item.product_name}</h3>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Size:</span> {item.size}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Quantity:</span> {item.quantity || 1}
                                                </p>
                                                {item.print && (
                                                    <div className="text-sm text-blue-600">
                                                        <p className="font-medium">Custom Print:</p>
                                                        {item.print_name && <p>Name: {item.print_name}</p>}
                                                        {item.print_number && <p>Number: {item.print_number}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="card p-6 bg-blue-80">
                        <h2 className="h2 mb-3">Need Help?</h2>
                        <p className="text-gray-700 mb-3">
                            If you have any questions about your order, please contact us with your order code.
                        </p>
                        <div className="flex gap-4">
                            <span className="text-sm bg-black px-3 py-1 rounded border">
                                📧 support@jstore.com
                            </span>
                            <span className="text-sm bg-black px-3 py-1 rounded border">
                                📞 +351 XXX XXX XXX
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Help Section */}
            {!order && (
                <div className="card p-6 bg-gray-50">
                    <h2 className="h2 mb-3">How to Find Your Order Code</h2>
                    <div className="space-y-2 text-gray-700">
                        <p>• Your order code was displayed after completing your purchase</p>
                        <p>• It starts with "JS" followed by 10 characters (e.g., JS1234ABCD56)</p>
                        <p>• Make sure to enter it exactly as shown</p>
                        <p>• Order codes are case-insensitive</p>
                    </div>
                </div>
            )}
        </div>
    );
}
