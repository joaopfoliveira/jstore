"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CustomOrderPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [customRequest, setCustomRequest] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [orderCode, setOrderCode] = useState("");
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const generateOrderCode = (phone: string): string => {
        const timestamp = Date.now().toString().slice(-6);
        const phoneDigits = phone.replace(/\D/g, '').slice(-4);
        return `CU${phoneDigits}${timestamp}`;
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files).slice(0, 5); // Max 5 images
            setUploadedImages(prev => [...prev, ...newImages].slice(0, 5));
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async (orderCode: string): Promise<string[]> => {
        if (uploadedImages.length === 0) return [];
        
        setUploading(true);
        const imageUrls: string[] = [];
        
        try {
            for (let i = 0; i < uploadedImages.length; i++) {
                const file = uploadedImages[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${orderCode}_${i + 1}.${fileExt}`;
                const filePath = `custom-orders/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('custom-order-images')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    continue;
                }

                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from('custom-order-images')
                    .getPublicUrl(filePath);

                if (publicUrlData?.publicUrl) {
                    imageUrls.push(publicUrlData.publicUrl);
                }
            }
        } catch (error) {
            console.error('Image upload error:', error);
        } finally {
            setUploading(false);
        }
        
        return imageUrls;
    };

    const submitCustomOrder = async () => {
        if (!name || !email || !phone || !customRequest.trim()) {
            setMsg("❌ All fields are required.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMsg("❌ Please enter a valid email address.");
            return;
        }

        if (customRequest.trim().length < 10) {
            setMsg("❌ Please provide more details about what you're looking for (at least 10 characters).");
            return;
        }

        setLoading(true);
        setMsg("");
        setOrderCode("");

        try {
            const orderCode = generateOrderCode(phone);

            // Upload images first
            const imageUrls = await uploadImages(orderCode);

            const { error } = await supabase.from("orders").insert({
                customer_name: name,
                customer_email: email,
                customer_phone: phone,
                type: "custom", // Different from catalog orders
                items: null, // Custom orders don't have structured items
                notes: `Custom Request: ${customRequest}\n\n${imageUrls.length > 0 ? `Images: ${imageUrls.join(', ')}\n\n` : ''}Status: Requires manual processing`,
                order_code: orderCode,
                image_urls: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
            });

            if (error) {
                setMsg("❌ Error: " + error.message);
                setOrderCode("");
            } else {
                setMsg("✅ Custom order submitted successfully! We'll review your request and contact you soon.");
                setOrderCode(orderCode);
                
                // Clear form
                setName("");
                setEmail("");
                setPhone("");
                setCustomRequest("");
                setUploadedImages([]);
            }
        } catch (err) {
            setMsg("❌ Unexpected error occurred.");
            setOrderCode("");
            console.error("Custom order submission error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center">
                <h1 className="h1">🎯 Custom Product Request</h1>
                <p className="text-gray-600 mt-2">
                    Can't find what you're looking for? Describe any sports product you need and we'll try to source it for you!
                </p>
            </div>

            {/* Order Confirmation */}
            {msg && (
                <div className={`p-4 rounded-lg ${msg.includes("✅") ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300"}`}>
                    <div className={`${msg.includes("✅") ? "text-green-800" : "text-red-800"}`}>
                        {msg}
                    </div>
                    {orderCode && (
                        <div className="mt-4 space-y-3">
                            <div className="bg-white p-3 rounded border">
                                <p className="text-sm text-gray-600 mb-1">Your Custom Order Code:</p>
                                <p className="font-mono text-xl font-bold text-purple-600">{orderCode}</p>
                                <p className="text-xs text-gray-500 mt-1">Save this code - we'll contact you about availability and pricing</p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => navigator.clipboard.writeText(orderCode)}
                                    className="btn text-sm px-3 py-1"
                                >
                                    📋 Copy Code
                                </button>
                                <a
                                    href="/"
                                    className="btn btn-primary text-sm px-3 py-1"
                                >
                                    🛍️ Browse Catalog
                                </a>
                                <a
                                    href="/track"
                                    className="btn bg-purple-600 text-white hover:bg-purple-700 text-sm px-3 py-1"
                                >
                                    🔍 Track Orders
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="card p-6 space-y-6">
                <h2 className="h2">Tell us what you're looking for</h2>
                
                {/* Custom Request */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Describe the product you need *
                    </label>
                    <textarea
                        value={customRequest}
                        onChange={(e) => setCustomRequest(e.target.value)}
                        placeholder="Examples:&#10;• Manchester United 2008/09 Champions League final jersey, size L, with Ronaldo #7 print&#10;• Nike Air Jordan 4 Retro 'White Cement' size 42&#10;• Adidas Portugal training jacket 2022, size M&#10;• Puma football boots, size 40, black/gold color"
                        className="input w-full h-32 resize-none"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Be as specific as possible: brand, model, size, color, special edition, etc.
                    </p>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Upload reference images (optional)
                    </label>
                    <div className="space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="input w-full"
                            disabled={uploading || uploadedImages.length >= 5}
                        />
                        <p className="text-xs text-gray-500">
                            Upload up to 5 images to help us understand exactly what you're looking for. Supported formats: JPG, PNG, WEBP
                        </p>
                        
                        {/* Image Previews */}
                        {uploadedImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                                {uploadedImages.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            ✕
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer Information */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Your Contact Information</h3>
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

                {/* Submit */}
                <button
                    className="btn btn-primary w-full text-lg py-3"
                    onClick={submitCustomOrder}
                    disabled={loading || uploading}
                >
                    {uploading ? "📸 Uploading Images..." : loading ? "🔄 Submitting Request..." : "🎯 Submit Custom Product Request"}
                </button>

                <div className="text-center text-sm text-gray-600">
                    <p>💡 <strong>How it works:</strong></p>
                    <p>1. We'll search for your requested product</p>
                    <p>2. If available, we'll contact you with pricing and availability</p>
                    <p>3. You can decide whether to proceed with the order</p>
                    <p className="mt-2 text-purple-600">📸 <strong>Tip:</strong> Images help us find exactly what you want!</p>
                </div>
            </div>

            <div className="text-center">
                <a href="/" className="btn">
                    ← Back to Catalog
                </a>
            </div>
        </div>
    );
}
