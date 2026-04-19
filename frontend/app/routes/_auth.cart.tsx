import type { Route } from "./+types/_auth.cart";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "~/store/cart.store";
import { useLanguage } from "~/context/LanguageContext";
import { trpc } from "~/lib/trpc";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Səbət - DəmirMart" },
    { name: "description", content: "Sizin alış-veriş səbətiniz" },
  ];
}

export default function CartPage() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } =
    useCartStore();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressData, setAddressData] = useState({
    city: "",
    district: "",
    address: "",
    zipCode: "",
    phone: "",
    note: "",
  });

  const { mutate: createOrder, isPending: isCheckingOut } = trpc.useMutation(
    "post",
    "/orders",
  );

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 10;
  const total = subtotal + shipping;

  const handleCheckoutClick = () => {
    if (items.length === 0) return;
    setIsAddressModalOpen(true);
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderData = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      ...addressData,
    };

    createOrder(
      { body: orderData as any },
      {
        onSuccess: () => {
          toast.success(
            t("checkoutSuccess") || "Sifarişiniz uğurla tamamlandı!",
          );
          clearCart();
          setIsAddressModalOpen(false);
          navigate("/profile");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Sifariş zamanı xəta baş verdi");
        },
      },
    );
  };

  // Empty Cart State
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0a1428] pt-36 pb-12 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-[#13223f] rounded-3xl p-16 border border-white/10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-28 h-28 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-orange-500/20">
                <svg
                  className="w-16 h-16 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>

              <h1 className="text-4xl font-bold tracking-tighter text-white mb-4">
                Səbətiniz boşdur
              </h1>
              <p className="text-zinc-400 text-lg max-w-sm mx-auto mb-10">
                Görünür hələ heç bir məhsul əlavə etməmisiniz. Ən yeni
                məhsullarımızı kəşf edin!
              </p>

              <Link
                to="/search"
                className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg"
              >
                Alış-verişə başla
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1428] text-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-3 h-8 bg-orange-500 rounded" />
              <h1 className="text-4xl font-bold tracking-tighter">Səbətim</h1>
            </div>
            <p className="text-zinc-400">{items.length} məhsul seçilib</p>
          </div>

          <button
            onClick={() => {
              clearCart();
              toast.success("Səbət təmizləndi");
            }}
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-red-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Səbəti təmizlə
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-orange-400 transition-colors mb-4"
            >
              ← Alış-verişə davam et
            </Link>

            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#13223f] border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 group hover:border-orange-500/30 transition-all"
              >
                {/* Image */}
                <div className="w-full md:w-40 h-40 bg-[#0a1428] rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 relative group">
                  <img
                    src={item.image }
                    alt={item.name || "Product"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-white mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {language === "az"
                      ? item.name
                      : language === "ru"
                        ? item.nameRu
                        : item.nameEn}
                  </h3>
                  <p className="text-orange-400 text-sm font-medium mb-4">
                    {item.price.toFixed(2)} AZN
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-[#0a1428] rounded-2xl border border-white/10">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white/5 disabled:opacity-40 transition-all"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-bold text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white/5 transition-all"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-500 text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right md:min-w-[140px] flex items-center md:items-start justify-end">
                  <p className="text-2xl font-bold text-white">
                    {(item.price * item.quantity).toFixed(2)} AZN
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#13223f] border border-white/10 rounded-3xl p-8 sticky top-28">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                Sifarişin xülasəsi
                <div className="flex-1 h-px bg-white/10" />
              </h2>

              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-zinc-400">
                  <span>Məhsullar ({items.length})</span>
                  <span className="text-white font-medium">
                    {subtotal.toFixed(2)} AZN
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Çatdırılma</span>
                  <span
                    className={
                      shipping === 0 ? "text-emerald-400" : "text-white"
                    }
                  >
                    {shipping === 0 ? "Pulsuz" : `${shipping.toFixed(2)} AZN`}
                  </span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5 mb-8 text-sm text-orange-300">
                  500 AZN üzəri sifarişdə çatdırılma pulsuzdur.
                </div>
              )}

              <div className="h-px bg-white/10 my-8" />

              <div className="flex justify-between items-end mb-10">
                <span className="text-xl">Yekun məbləğ</span>
                <span className="text-4xl font-bold text-orange-400">
                  {total.toFixed(2)} AZN
                </span>
              </div>

              <button
                onClick={handleCheckoutClick}
                disabled={isCheckingOut}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white py-5 rounded-2xl font-bold text-lg transition-all active:scale-[0.98]"
              >
                {isCheckingOut ? "Sifariş tamamlanır..." : "Sifarişi tamamla"}
              </button>

              <p className="text-center text-xs text-zinc-500 mt-6">
                Təhlükəsiz ödəniş • Ən yaxşı qiymət zəmanəti
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-10 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Çatdırılma Ünvanı</h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitOrder} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Şəhər *
                  </label>
                  <input
                    required
                    value={addressData.city}
                    onChange={(e) =>
                      setAddressData((d) => ({ ...d, city: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:border-orange-500 outline-none"
                    placeholder="Bakı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rayon *
                  </label>
                  <input
                    required
                    value={addressData.district}
                    onChange={(e) =>
                      setAddressData((d) => ({
                        ...d,
                        district: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:border-orange-500 outline-none"
                    placeholder="Nəsimi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tam ünvan *
                </label>
                <input
                  required
                  value={addressData.address}
                  onChange={(e) =>
                    setAddressData((d) => ({ ...d, address: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:border-orange-500 outline-none"
                  placeholder="Nizami küç., ev 45, mənzil 12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Poçt indeksi
                  </label>
                  <input
                    value={addressData.zipCode}
                    onChange={(e) =>
                      setAddressData((d) => ({ ...d, zipCode: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:border-orange-500 outline-none"
                    placeholder="AZ1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Telefon *
                  </label>
                  <input
                    required
                    value={addressData.phone}
                    onChange={(e) =>
                      setAddressData((d) => ({ ...d, phone: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:border-orange-500 outline-none"
                    placeholder="+994 50 123 45 67"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Əlavə qeyd
                </label>
                <textarea
                  value={addressData.note}
                  onChange={(e) =>
                    setAddressData((d) => ({ ...d, note: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:border-orange-500 outline-none resize-y min-h-[100px]"
                  placeholder="Kuryer üçün əlavə məlumat..."
                />
              </div>

              <button
                type="submit"
                disabled={isCheckingOut}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white py-4 rounded-2xl font-bold text-lg transition-all mt-4"
              >
                {isCheckingOut ? "Sifariş tamamlanır..." : "Sifarişi təsdiqlə"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
