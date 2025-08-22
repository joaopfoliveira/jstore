"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "@/app/context/CartContext";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OrderPage() {
    const { items, updateItem, removeItem, clear } = useCart();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [orderCode, setOrderCode] = useState("");



    // Function to handle tracking navigation
    const handleTrackOrder = () => {
        // Clear cart when user goes to track their order
        clear();
        window.location.href = '/track';
    };

    // Function to handle cart clearing with confirmation
    const handleClearCart = () => {
        if (confirm("Are you sure you want to clear your cart? This action cannot be undone.")) {
            clear();
            setMsg("");
            setOrderCode("");
        }
    };

    // Generate unique order code based on phone and products
    const generateOrderCode = (phone: string, items: any[]) => {
        const phoneDigits = phone.replace(/\D/g, '').slice(-4); // Last 4 digits
        const itemsHash = items.map(i => i.product_id).join('').slice(0, 4);
        const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
        return `JS${phoneDigits}${itemsHash}${timestamp}`.toUpperCase().slice(0, 12);
    };

    // Send order confirmation email
    const sendOrderConfirmationEmail = async (email: string, customerName: string, orderCode: string, items: any[]) => {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                customerName,
                orderCode,
                items
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return response.json();
    };

    const submitOrder = async () => {
        if (!name || !email || !phone) {
            setMsg("❌ Name, email, and phone are required.");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMsg("❌ Please enter a valid email address.");
            return;
        }

        if (items.length === 0) {
            setMsg("❌ Cart is empty. Add some items first.");
            return;
        }

        setLoading(true);
        setMsg("");
        setOrderCode(""); // Clear any previous order code

        try {
            const orderCode = generateOrderCode(phone, items);
            
            const { error } = await supabase.from("orders").insert({
                customer_name: name,
                customer_email: email,
                customer_phone: phone,
                type: "catalog",
                items: items,
                notes: null,
                order_code: orderCode,
            });

            if (error) {
                setMsg("❌ Error: " + error.message);
                setOrderCode("");
            } else {
                // Send email with order code
                try {
                    await sendOrderConfirmationEmail(email, name, orderCode, items);
                } catch (emailError) {
                    console.error("Email sending failed:", emailError);
                    // Don't fail the order if email fails
                }
                
                setMsg("✅ Order submitted successfully! Check your email for the order code.");
                setOrderCode(orderCode);
                
                // Clear form fields
                setName("");
                setEmail("");
                setPhone("");
                
                // Clear cart after successful checkout
                clear();
            }
        } catch (err) {
            setMsg("❌ Unexpected error occurred.");
            setOrderCode("");
            console.error("Order submission error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="h1">Shopping Cart</h1>

            {/* Order Confirmation - Always visible when there's a message */}
            {msg && (
                <div className={`p-4 rounded-lg ${msg.includes("✅") ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300"}`}>
                    <div className={`${msg.includes("✅") ? "text-green-800" : "text-red-800"}`}>
                        {msg}
                    </div>
                    {orderCode && (
                        <div className="mt-4 space-y-3">
                            <div className="bg-white p-3 rounded border">
                                <p className="text-sm text-gray-600 mb-1">Your Order Code:</p>
                                <p className="font-mono text-xl font-bold text-blue-600">{orderCode}</p>
                                <p className="text-xs text-gray-500 mt-1">Save this code to track your order</p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => navigator.clipboard.writeText(orderCode)}
                                    className="btn text-sm px-3 py-1"
                                >
                                    📋 Copy Code
                                </button>
                                <a
                                    href={`/track?code=${orderCode}`}
                                    className="btn btn-primary text-sm px-3 py-1"
                                >
                                    🔍 Track Order
                                </a>
                                <a
                                    href="/catalog"
                                    className="btn bg-green-600 text-white hover:bg-green-700 text-sm px-3 py-1"
                                >
                                    🛍️ Continue Shopping
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {items.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <a href="/catalog" className="btn btn-primary">
                        Continue Shopping
                    </a>
                </div>
            ) : (
                <>
                    {/* Cart Items */}
                    <div className="space-y-3">
                        <h2 className="h2">Cart Items ({items.length})</h2>
                        {items.map((item, idx) => (
                            <div key={idx} className="card p-4 space-y-3">
                                <div className="flex gap-3 items-start">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{item.product_name}</h3>
                                        <p className="text-sm text-gray-600">
                                            Size: {item.size} | Quantity: {item.quantity || 1}
                                        </p>
                                        {item.print && (
                                            <p className="text-sm text-blue-600">
                                                Print: {item.print_name || "No name"} 
                                                {item.print_number && ` #${item.print_number}`}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeItem(idx)}
                                        className="btn bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>

                                {/* Item customization */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Size</label>
                                        <select
                                            value={item.size}
                                            onChange={(e) => updateItem(idx, { size: e.target.value })}
                                            className="input w-full"
                                        >
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Quantity</label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => updateItem(idx, { 
                                                    quantity: Math.max(1, (item.quantity || 1) - 1) 
                                                })}
                                                className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 p-0 flex items-center justify-center text-lg font-bold"
                                                disabled={(item.quantity || 1) <= 1}
                                            >
                                                −
                                            </button>
                                            <input
                                                type="text"
                                                value={item.quantity || 1}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value);
                                                    if (!isNaN(value) && value >= 1 && value <= 10) {
                                                        updateItem(idx, { quantity: value });
                                                    }
                                                }}
                                                className="input w-16 text-center"
                                                min="1"
                                                max="10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => updateItem(idx, { 
                                                    quantity: Math.min(10, (item.quantity || 1) + 1) 
                                                })}
                                                className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 p-0 flex items-center justify-center text-lg font-bold"
                                                disabled={(item.quantity || 1) >= 10}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={item.print}
                                                onChange={(e) => updateItem(idx, { print: e.target.checked })}
                                            />
                                            <span className="text-sm font-medium">Add Print</span>
                                        </label>
                                    </div>
                                </div>

                                {item.print && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Name on jersey"
                                            className="input w-full"
                                            value={item.print_name || ""}
                                            onChange={(e) => updateItem(idx, { print_name: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Number"
                                            className="input w-full"
                                            value={item.print_number || ""}
                                            onChange={(e) => updateItem(idx, { print_number: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Customer Information */}
                    <div className="space-y-4">
                        <h2 className="h2">Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                className="input w-full"
                                placeholder="Full Name *"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                className="input w-full"
                                type="email"
                                placeholder="Email Address *"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                className="input w-full"
                                placeholder="Phone Number *"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            className="btn bg-gray-500 text-white hover:bg-gray-600"
                            onClick={clear}
                            disabled={loading}
                        >
                            Clear Cart
                        </button>
                        <button
                            className="btn btn-primary flex-1"
                            onClick={submitOrder}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Checkout"}
                        </button>
                    </div>


                </>
            )}
        </div>
    );
}
