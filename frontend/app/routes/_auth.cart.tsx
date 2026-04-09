import type { Route } from "./+types/_auth.cart";
import { Link } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Səbət - DəmirMart" },
    { name: "description", content: "Sizin alış-veriş səbətiniz" },
  ];
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

const INITIAL_MOCK_DATA: CartItem[] = [
  {
    id: 1,
    name: "Apple iPhone 15 Pro Max, 256GB, Natural Titanium",
    price: 2999.00,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=500&auto=format&fit=crop",
    quantity: 1,
    category: "Smartfonlar"
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    price: 649.00,
    image: "https://images.unsplash.com/photo-1670055745823-10d939f60f64?q=80&w=500&auto=format&fit=crop",
    quantity: 2,
    category: "Aksesuarlar"
  },
  {
    id: 3,
    name: "MacBook Air M3, 13-inch, 16GB RAM, 512GB SSD",
    price: 2499.00,
    image: "https://images.unsplash.com/photo-1517336714460-4c9889a7968b?q=80&w=500&auto=format&fit=crop",
    quantity: 1,
    category: "Noutbuklar"
  }
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_MOCK_DATA);

  const updateQuantity = (id: number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success("Məhsul səbətdən silindi");
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 10;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-36 pb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-16 max-w-2xl mx-auto overflow-hidden relative">
            {/* Abstract Background Shapes */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-orange-100 rotate-6 hover:rotate-0 transition-transform duration-500">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-4">Səbətiniz boşdur</h1>
              <p className="text-gray-500 mb-10 text-lg font-medium max-w-sm mx-auto">Görünür hələ heç bir məhsul əlavə etməmisiniz. Ən yeni məhsullarımızı kəşf edin!</p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-gray-900/20 hover:shadow-orange-500/40 active:scale-95 group"
              >
                Alış-verişə başla
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="ArrowRightIcon" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-2 h-10 bg-orange-500 rounded-full"></div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Səbətim</h1>
              <p className="text-gray-500 font-bold mt-1">{items.length} məhsul seçilib</p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setItems([]);
              toast.success("Səbət təmizləndi");
            }}
            className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Səbəti təmizlə
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 text-sm font-black text-gray-500 hover:text-orange-500 transition-colors mb-2 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Alış-verişə davam et
            </Link>

            {items.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-8 group"
              >
                {/* Image */}
                <div className="w-32 h-32 bg-gray-50 rounded-3xl overflow-hidden shrink-0 border border-gray-100 relative group-hover:bg-white transition-colors">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-orange-600 text-xs font-black uppercase tracking-widest">{item.category}</span>
                  <h3 className="text-lg font-black text-gray-900 mt-1 mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                    <span className="text-xl font-black text-gray-900">{item.price.toFixed(2)} AZN</span>
                    {deltaPrice(item.price) && (
                      <span className="text-sm font-bold text-gray-400 line-through">{(item.price * 1.2).toFixed(2)} AZN</span>
                    )}
                  </div>

                  {/* Mobile Quantity Control (Hidden on Desktop) */}
                  <div className="flex sm:hidden items-center justify-center gap-4 bg-gray-50 rounded-xl p-1 mb-4">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <span className="font-black">-</span>
                    </button>
                    <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <span className="font-black">+</span>
                    </button>
                  </div>
                </div>

                {/* Desktop Quantity & Remove */}
                <div className="hidden sm:flex flex-col items-end gap-6">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-orange-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-400"
                      disabled={item.quantity <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-lg font-black w-12 text-center text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-1.5 px-3 py-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Sil
                  </button>
                </div>

                {/* Mobile Remove (Hidden on Desktop) */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="sm:hidden absolute top-4 right-4 text-gray-300 hover:text-red-500 p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-36">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                Sifarişin xülasəsi
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              </h2>

              {/* Coupon Code */}
              <div className="mb-8 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Kupon kodu</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="YAY2024"
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-300"
                  />
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-xl font-black text-xs transition-all active:scale-95">
                    Tətbiq et
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-500 font-bold">
                  <span>Məhsullar</span>
                  <span className="text-gray-900">{subtotal.toFixed(2)} AZN</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-bold">
                  <span>Çatdırılma</span>
                  <span className={shipping === 0 ? "text-green-500" : "text-gray-900"}>
                    {shipping === 0 ? "Pulsuz" : `${shipping.toFixed(2)} AZN`}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100/50">
                    <p className="text-[10px] text-orange-700 font-black uppercase tracking-wider leading-relaxed">
                      💡 500 AZN üzəri alış-verişdə çatdırılma pulsuzdur! 
                      <span className="block mt-1">Daha {(500 - subtotal).toFixed(2)} AZN əlavə edin.</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 mb-6"></div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-black text-gray-900">Yekun</span>
                <span className="text-3xl font-black text-orange-600">{total.toFixed(2)} AZN</span>
              </div>

              <button className="w-full bg-gray-900 hover:bg-orange-500 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-gray-900/10 hover:shadow-orange-500/30 active:scale-[0.98] flex items-center justify-center gap-3 group">
                Sifarişi tamamla
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Təhlükəsiz ödəniş</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Asan geri qaytarma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function deltaPrice(price: number) {
  return price > 1000;
}
