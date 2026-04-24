import type { Route } from "./+types/_auth.cart";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useCartStore } from "~/store/cart.store";
import { useLanguage } from "~/context/LanguageContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Səbət - DəmirMart" },
    { name: "description", content: "Sizin alış-veriş səbətiniz" },
  ];
}

export default function CartPage() {
  const { language } = useLanguage();

  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } =
    useCartStore();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 10;
  const total = subtotal + shipping;

  // 🧠 Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const itemsText = items
      .map((item) => `• ${item.name}\n  ${item.quantity} x ${item.price} AZN`)
      .join("\n\n");

    return `
Salam,

Sifariş vermək istəyirəm:

${itemsText}

 Ümumi: ${total.toFixed(2)} AZN
`.trim();
  };

  // 🚀 WhatsApp redirect
  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const phoneNumber = "994501234567"; // 🔴 CHANGE THIS

    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);

    const url = `https://wa.me/${phoneNumber}?text=${encoded}`;

    window.open(url, "_blank");

    clearCart();
    toast.success("WhatsApp-a yönləndirilir...");
  };

  // Empty Cart
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0a1428] pt-36 pb-12 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-[#13223f] rounded-3xl p-16 border border-white/10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white mb-4">
                Səbətiniz boşdur
              </h1>
              <p className="text-zinc-400 mb-10">
                Hələ məhsul əlavə etməmisiniz.
              </p>

              <Link
                to="/search"
                className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-bold"
              >
                Alış-verişə başla →
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
        {/* Header */}
        <div className="flex justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold">Səbətim</h1>
            <p className="text-zinc-400">{items.length} məhsul</p>
          </div>

          <button
            onClick={() => {
              clearCart();
              toast.success("Səbət təmizləndi");
            }}
            className="text-red-400"
          >
            Səbəti təmizlə
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Items */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#13223f] rounded-3xl p-6 flex gap-6"
              >
                <img
                  src={item.image}
                  className="w-32 h-32 object-cover rounded-2xl"
                />

                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {language === "az"
                      ? item.name
                      : language === "ru"
                        ? item.nameRu
                        : item.nameEn}
                  </h3>

                  <p className="text-orange-400 mb-4">
                    {item.price.toFixed(2)} AZN
                  </p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <div className="text-xl font-bold">
                  {(item.price * item.quantity).toFixed(2)} AZN
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#13223f] rounded-3xl p-8 sticky top-28">
              <h2 className="text-2xl font-bold mb-6">Sifariş</h2>

              <div className="mb-6">
                <div className="flex justify-between">
                  <span>Məhsullar</span>
                  <span>{subtotal.toFixed(2)} AZN</span>
                </div>

                <div className="flex justify-between">
                  <span>Çatdırılma</span>
                  <span>{shipping === 0 ? "Pulsuz" : `${shipping} AZN`}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-8">
                <span>Yekun</span>
                <span className="text-orange-400">{total.toFixed(2)} AZN</span>
              </div>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-bold"
              >
                WhatsApp ilə sifariş ver
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
