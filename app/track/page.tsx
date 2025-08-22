"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_key"
);

type Order = {
    id: number;
    customer_name: string;
    customer_email?: string;
    customer_phone: string;
    order_code: string;
    items?: Array<{
        product_id: string;
        product_name: string;
        size: string;
        quantity?: number;
        print: boolean;
        print_name?: string;
        print_number?: string;
    }> | null;
    created_at: string;
    type: string;
    notes?: string;
    image_urls?: string;
};

export default function TrackOrderPage() {
    const searchParams = useSearchParams();
    const [orderCode, setOrderCode] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Check for order code in URL parameters and auto-track
    useEffect(() => {
        const codeFromUrl = searchParams.get('code');
        if (codeFromUrl) {
            setOrderCode(codeFromUrl.toUpperCase());
            // Auto-track the order
            setTimeout(() => {
                if (codeFromUrl.trim()) {
                    trackOrderWithCode(codeFromUrl.trim().toUpperCase());
                }
            }, 100);
        }
    }, [searchParams]);

    const trackOrderWithCode = async (codeToTrack: string) => {
        if (!codeToTrack.trim()) {
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
                .eq("order_code", codeToTrack.trim().toUpperCase());

            if (supabaseError) {
                console.error("Supabase error:", supabaseError);
                setError("An error occurred while searching for your order.");
                return;
            }

            if (!data || data.length === 0) {
                setError("Order not found. Please check your order code and try again.");
                return;
            }

            const orderData = data[0];
            
            // Parse items if they exist and are a string
            if (orderData.items && typeof orderData.items === 'string') {
                try {
                    orderData.items = JSON.parse(orderData.items);
                } catch (parseError) {
                    console.error("Error parsing items:", parseError);
                    orderData.items = [];
                }
            }

            console.log("Order found:", orderData);
            setOrder(orderData);
        } catch (err) {
            setError("An error occurred while searching for your order.");
            console.error("Track order error:", err);
        } finally {
            setLoading(false);
        }
    };

    const trackOrder = () => trackOrderWithCode(orderCode);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getTotalItems = (items: Order['items']) => {
        if (!items || !Array.isArray(items)) return 0;
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
                        placeholder="e.g., JS1234ABCD56 or CU1234ABCD56"
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && trackOrder()}
                        className="flex-1 px-4 py-3 border-2 border-orange-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-colors bg-white"
                        maxLength={12}
                    />
                    <button
                        onClick={trackOrder}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-md"
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

                    {/* Order Content - Different for Catalog vs Custom */}
                    {order.type === 'catalog' && order.items && Array.isArray(order.items) ? (
                        /* Catalog Orders - Show Items */
                        <div className="card p-6">
                            <h2 className="h2 mb-4">📦 Catalog Order - Items ({getTotalItems(order.items)} items)</h2>
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
                    ) : (
                        /* Custom Orders - Show Request Details */
                        <div className="card p-6">
                            <h2 className="h2 mb-4">🎯 Custom Product Request</h2>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <p className="font-medium text-purple-800 mb-2">Request Details:</p>
                                <div className="text-gray-700 whitespace-pre-line">
                                    {order.notes ? order.notes
                                        .replace(/Images:.*?\n\n/s, '') // Remove "Images: ..." section
                                        .trim() : "No details available"}
                                </div>
                                
                                {/* Display images if available */}
                                {order.image_urls && (
                                    <div className="mt-4">
                                        <p className="font-medium text-purple-800 mb-2">Reference Images:</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {JSON.parse(order.image_urls).map((imageUrl: string, imgIndex: number) => (
                                                <div key={imgIndex} className="relative">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Reference ${imgIndex + 1}`}
                                                        className="w-full h-20 object-cover rounded border"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-yellow-800 text-sm">
                                    ⏳ <strong>Custom Request Status:</strong> We're currently sourcing this product for you. 
                                    We'll contact you soon with availability and pricing information.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div className="card p-6 bg-blue-50">
                        <h2 className="h2 mb-3">Need Help?</h2>
                        <p className="text-gray-700 mb-3">
                            If you have any questions about your order, please contact us with your order code.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <span className="text-sm bg-gray-800 text-white px-3 py-2 rounded border">
                                📧 support@jstore.com
                            </span>
                            <span className="text-sm bg-gray-800 text-white px-3 py-2 rounded border">
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
                        <p>• <strong>Catalog Orders:</strong> Start with "JS" followed by 10 characters (e.g., JS1234ABCD56)</p>
                        <p>• <strong>Custom Requests:</strong> Start with "CU" followed by 10 characters (e.g., CU1234ABCD56)</p>
                        <p>• Make sure to enter it exactly as shown</p>
                        <p>• Order codes are case-insensitive</p>
                        <p>• If you can't find your code, check your email for the order confirmation</p>
                    </div>
                </div>
            )}
        </div>
    );
}
