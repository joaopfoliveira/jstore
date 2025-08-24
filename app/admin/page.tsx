'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

type Order = {
  id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  type: string;
  notes: string;
  items?: any[] | null;
  order_code?: string;
  image_urls?: string[] | null;
  created_at: string;
};

// Clean product title by removing size references
function cleanProductTitle(productName: string): string {
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
}

export default function AdminPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  // ✅ TODOS os hooks devem ser declarados ANTES de qualquer early return
  const [orders, setOrders] = useState<Order[]>([]);
  const [phone, setPhone] = useState('351XXXXXXXXX');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');

  const load = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading orders:', error);
      setLoading(false);
      return;
    }

    // Safely parse JSON fields
    const parsedOrders = (data as Order[])?.map(order => ({
      ...order,
      items: safeJSONParse(order.items),
      image_urls: safeJSONParse(order.image_urls)
    })) || [];

    setOrders(parsedOrders);
    setLoading(false);
  };

  // Helper function to safely parse JSON
  const safeJSONParse = (value: any) => {
    if (!value) return null;
    if (typeof value === 'object') return value; // Already parsed
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return null; // Invalid JSON
      }
    }
    return null;
  };

  // Filter orders by type
  const catalogOrders = useMemo(() => 
    orders.filter(o => o.type === 'catalog'), [orders]);
  
  const customOrders = useMemo(() => 
    orders.filter(o => o.type === 'custom'), [orders]);

  const currentOrders = activeTab === 'catalog' ? catalogOrders : customOrders;

  const message = useMemo(() => {
    if (!currentOrders.length) return `Sem pedidos ${activeTab === 'catalog' ? 'de catálogo' : 'customizados'}.`;
    const lines = currentOrders.map(o => `• ${o.customer_name}: ${o.notes}`);
    return `Pedidos ${activeTab === 'catalog' ? 'de Catálogo' : 'Customizados'}:\n\n${lines.join('\n')}`;
  }, [currentOrders, activeTab]);

  const waUrl = useMemo(() => {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [phone, message]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => { load(); }, []);

  // ✅ Early return DEPOIS de todos os hooks
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 md:p-3 rounded-lg shadow-lg">
              <span className="text-white text-xl md:text-2xl">👑</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300 text-sm">Manage orders and customer requests</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-red-200 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm"
          >
            🔓 <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Config */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-xl p-6 shadow-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg shadow-lg">
            <span className="text-white text-lg">📱</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">WhatsApp Configuration</h2>
            <p className="text-gray-600 text-sm">Set your supplier's WhatsApp number for order forwarding</p>
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Supplier WhatsApp (country code + number)
          </label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" 
            value={phone} 
            onChange={e => setPhone(e.target.value)}
            placeholder="351912345678"
          />
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
            💡 Example for Portugal: 351912345678 (no spaces or special characters)
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`relative px-4 md:px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'catalog' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700'
              }`}
            >
              <span className="flex items-center gap-2 justify-center">
                🛍️ <span className="hidden sm:inline">Catalog Orders</span><span className="sm:hidden">Catalog</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'catalog' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {catalogOrders.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`relative px-4 md:px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'custom' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-purple-50 hover:to-pink-50 hover:text-purple-700'
              }`}
            >
              <span className="flex items-center gap-2 justify-center">
                🎯 <span className="hidden sm:inline">Custom Requests</span><span className="sm:hidden">Custom</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'custom' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                }`}>
                  {customOrders.length}
                </span>
              </span>
            </button>
          </div>
          <button 
            onClick={load} 
            className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <span className="flex items-center gap-2 justify-center">
              🔄 <span className="hidden sm:inline">Refresh</span>
            </span>
          </button>
        </div>

        <div className="mb-6">
          {activeTab === 'catalog' ? (
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-blue-100/50 to-cyan-50 p-4 rounded-xl border border-blue-200 shadow-sm">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-300/20 to-transparent"></div>
              <div className="relative flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg shadow-lg">
                  <span className="text-white text-lg">📦</span>
                </div>
                <div>
                  <p className="text-blue-900 font-semibold text-lg">Catalog Orders</p>
                  <p className="text-blue-700 text-sm">Ready to be processed and sent directly to the supplier.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 via-purple-100/50 to-pink-50 p-4 rounded-xl border border-purple-200 shadow-sm">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-300/20 to-transparent"></div>
              <div className="relative flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg shadow-lg">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <div>
                  <p className="text-purple-900 font-semibold text-lg">Custom Requests</p>
                  <p className="text-purple-700 text-sm">Require manual sourcing and approval before processing.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin">
                <div className="absolute inset-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xl">⏳</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {currentOrders.map(o => (
              <div key={o.id} className={`relative overflow-hidden rounded-xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                o.type === 'catalog' 
                  ? 'bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200'
                  : 'bg-gradient-to-br from-purple-50 via-white to-pink-50 border border-purple-200'
              }`}>
                {/* Decorative gradient overlay */}
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 ${
                  o.type === 'catalog'
                    ? 'bg-gradient-to-bl from-blue-400 to-transparent'
                    : 'bg-gradient-to-bl from-purple-400 to-transparent'
                }`}></div>
                
                <div className="relative flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-semibold text-lg text-gray-800">{o.customer_name}</div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        o.type === 'catalog' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      }`}>
                        {o.type === 'catalog' ? '📦 Catalog' : '🎯 Custom'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-4 mb-1">
                      <span className="flex items-center gap-1">
                        📧 {o.customer_email}
                      </span>
                      <span className="flex items-center gap-1">
                        📞 {o.customer_phone}
                      </span>
                    </div>
                    {o.order_code && (
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-mono font-medium shadow-sm ${
                        o.type === 'catalog'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}>
                        🔢 {o.order_code}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      📅 {new Date(o.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className={`relative mt-3 p-4 rounded-xl shadow-inner ${
                  o.type === 'catalog'
                    ? 'bg-gradient-to-br from-blue-50/50 to-white border border-blue-100'
                    : 'bg-gradient-to-br from-purple-50/50 to-white border border-purple-100'
                }`}>
                  {o.type === 'catalog' ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                        <p className="font-semibold text-sm text-blue-800">Order Items</p>
                      </div>
                      {o.items && Array.isArray(o.items) && o.items.length > 0 ? (
                        <div className="space-y-2">
                          {o.items.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-blue-100/50 shadow-sm">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800 text-sm">
                                    🏷️ {item.product_name || 'Unknown Product'}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1 flex gap-3">
                                    <span className="bg-blue-100 px-2 py-0.5 rounded-full">📏 Size: {item.size || 'N/A'}</span>
                                    <span className="bg-green-100 px-2 py-0.5 rounded-full">📦 Qty: {item.quantity || 1}</span>
                                  </div>
                                  {item.print && (
                                    <div className="mt-2 p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200">
                                      <span className="text-xs font-medium text-blue-700 flex items-center gap-1">
                                        ✨ Custom Print: 
                                        <span className="font-semibold">{item.print_name || 'No name'}</span>
                                        {item.print_number && <span className="bg-blue-200 px-1.5 py-0.5 rounded text-blue-800">#{item.print_number}</span>}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <div className="text-2xl mb-2">📭</div>
                          <p className="text-sm italic">No items data available</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                        <p className="font-semibold text-sm text-purple-800">Custom Request Details</p>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-100/50 shadow-sm mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {o.notes ? o.notes
                            .replace(/Images:.*?\n\n/s, '') // Remove "Images: ..." section
                            .trim() : "No details available"}
                        </p>
                      </div>
                      
                      {/* Display uploaded images */}
                      {o.image_urls && Array.isArray(o.image_urls) && o.image_urls.length > 0 && (
                        <div className="mt-3">
                          <p className="font-medium text-sm mb-2 text-purple-800">Reference Images:</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {o.image_urls.map((imageUrl: string, imgIndex: number) => (
                              <div key={imgIndex} className="relative">
                                <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 shadow-md">
                                  <img
                                    src={imageUrl}
                                    alt={`Reference ${imgIndex + 1}`}
                                    className="w-full h-24 object-cover"
                                  />
                                  {/* Corner gradient accent */}
                                  <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-purple-400 to-transparent opacity-60"></div>
                                </div>
                                {/* Image number badge */}
                                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                                  {imgIndex + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {!currentOrders.length && (
              <div className={`text-center py-12 rounded-xl ${
                activeTab === 'catalog'
                  ? 'bg-gradient-to-br from-blue-50/50 to-white border border-blue-100'
                  : 'bg-gradient-to-br from-purple-50/50 to-white border border-purple-100'
              }`}>
                <div className="text-6xl mb-4">
                  {activeTab === 'catalog' ? '📦' : '🎯'}
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${
                  activeTab === 'catalog' ? 'text-blue-800' : 'text-purple-800'
                }`}>
                  No {activeTab === 'catalog' ? 'Catalog Orders' : 'Custom Requests'} Yet
                </h3>
                <p className="text-gray-600 text-sm">
                  {activeTab === 'catalog' 
                    ? 'Catalog orders will appear here when customers make purchases from the store.'
                    : 'Custom requests will appear here when customers submit product requests.'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-xl p-6 border border-green-200 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg shadow-lg">
                <span className="text-white text-xl">📱</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 text-lg">Send to Supplier</h3>
                <p className="text-green-700 text-sm">
                  Export {activeTab === 'catalog' ? 'catalog orders' : 'custom requests'} to WhatsApp for processing
                </p>
              </div>
            </div>
          </div>
          <a 
            href={waUrl} 
            target="_blank" 
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
          >
            💬 Open WhatsApp
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
