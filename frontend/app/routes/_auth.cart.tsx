import type { Route } from "./+types/_auth.cart";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useCartStore } from "~/store/cart.store";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import { fetchSiteSettings } from "~/lib/site-settings";
import { apiUrl } from "~/lib/site-settings";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Səbət - MetalX" },
    { name: "description", content: "Sizin alış-veriş səbətiniz" },
  ];
}

/**
 * Format cart items into a WhatsApp message
 */
const generateWhatsAppMessage = (
  items: any[],
  total: number,
  language: string
): string => {
  const itemsText = items
    .map((item) => {
      const name =
        language === "az" ? item.name : language === "ru" ? item.nameRu : item.nameEn;
      return `• ${name}\n  ${item.quantity}x ${item.price} AZN = ${(item.price * item.quantity).toFixed(2)} AZN`;
    })
    .join("\n\n");

  const greetings = {
    az: "Salam,\n\nMən bu məhsulları sifarişlə vermək istəyirəm:\n\n",
    ru: "Здравствуйте,\n\nЯ хотел бы заказать эти товары:\n\n",
    en: "Hello,\n\nI would like to order these products:\n\n",
  };

  const totalLabels = {
    az: "\n\n📦 *Ümumi Cəmi:*",
    ru: "\n\n📦 *Всего:*",
    en: "\n\n📦 *Total:*",
  };

  return (
    greetings[language as keyof typeof greetings] +
    itemsText +
    totalLabels[language as keyof typeof totalLabels] +
    ` ${total.toFixed(2)} AZN`
  );
};

export default function CartPage() {
  const { language, t } = useLanguage();
  const [whatsappNumber, setWhatsappNumber] = useState("994501234567");

  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } =
    useCartStore();

  useEffect(() => {
    fetchSiteSettings()
      .then((settings) => {
        if (settings.data.whatsappNumber) {
          setWhatsappNumber(settings.data.whatsappNumber);
        }
      })
      .catch(() => undefined);
  }, []);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 10;
  const total = subtotal + shipping;
  const resolveImage = (src: string) =>
    src ? (src.startsWith("http") ? src : apiUrl(src)) : "";

  /**
   * Handle WhatsApp checkout
   */
  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const message = generateWhatsAppMessage(items, total, language);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;

    window.open(url, "_blank");

    clearCart();
    toast.success(
      t("messageSentSuccess" as TranslationKey) || "Order sent to WhatsApp!"
    );
  };

  // ===== EMPTY CART STATE =====
  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#001446] pb-12 pt-36">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#041d23] p-16">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0080e8]/10 blur-3xl" />

            <div className="relative z-10">
              <h1 className="mb-4 text-4xl font-bold text-white">
                {t("emptyCart" as TranslationKey)}
              </h1>
              <p className="mb-10 text-zinc-400">
                Hələ məhsul əlavə etməmisiniz.
              </p>

              <Link
                to="/search"
                className="rounded-2xl bg-[#0080e8] px-10 py-5 font-bold text-white hover:bg-[#0080e8]/90"
              >
                Alış-verişə başla →
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ===== CART WITH ITEMS =====
  return (
    <main className="min-h-screen bg-[#001446] pb-24 pt-28 text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* ===== HEADER ===== */}
        <div className="mb-12 flex justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              {t("cartTitle" as TranslationKey)}
            </h1>
            <p className="text-zinc-400">{items.length} məhsul</p>
          </div>

          <button
            onClick={() => {
              clearCart();
              toast.success(t("cartCleared" as TranslationKey));
            }}
            className="text-red-400 transition-colors hover:text-red-300"
          >
            {t("clearCart" as TranslationKey)}
          </button>
        </div>

        <div className="gap-10 grid lg:grid-cols-12">
          {/* ===== LEFT: CART ITEMS ===== */}
          <div className="space-y-6 lg:col-span-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 rounded-3xl bg-[#041d23] p-6"
              >
                {/* Product Image */}
                <img
                  src={resolveImage(item.image)}
                  alt={item.name}
                  className="h-32 w-32 rounded-2xl object-cover"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {language === "az"
                      ? item.name
                      : language === "ru"
                        ? item.nameRu
                        : item.nameEn}
                  </h3>

                  <p className="mb-4 text-[#0080e8]">
                    {item.price.toFixed(2)} AZN
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="rounded px-3 py-1 hover:bg-[#001446] disabled:opacity-50"
                    >
                      −
                    </button>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="rounded px-3 py-1 hover:bg-[#001446]"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-400 transition-colors hover:text-red-300"
                    >
                      {t("remove" as TranslationKey)}
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-xl font-bold">
                  {(item.price * item.quantity).toFixed(2)} AZN
                </div>
              </div>
            ))}
          </div>

          {/* ===== RIGHT: ORDER SUMMARY ===== */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl bg-[#041d23] p-8">
              <h2 className="mb-6 text-2xl font-bold">
                {t("cartTitle" as TranslationKey)}
              </h2>

              {/* Pricing Breakdown */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between">
                  <span>{t("total" as TranslationKey)}</span>
                  <span>{subtotal.toFixed(2)} AZN</span>
                </div>

                <div className="flex justify-between">
                  <span>Çatdırılma</span>
                  <span>
                    {shipping === 0
                      ? t("freeDeliveryBaku" as TranslationKey)
                      : `${shipping} AZN`}
                  </span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mb-8 flex justify-between border-t border-white/10 py-4 text-xl font-bold">
                <span>{t("total" as TranslationKey)}</span>
                <span className="text-[#0080e8]">
                  {total.toFixed(2)} AZN
                </span>
              </div>

              {/* WhatsApp Checkout Button */}
              <button
                onClick={handleWhatsAppCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-5 font-bold text-white transition-all hover:bg-green-600 active:scale-95"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.75 5.41 2.174 7.723L2 22l4.555-1.339C8.946 21.396 11.4 22 13.979 22c5.465 0 9.96-4.495 9.96-9.96 0-2.659-1.028-5.161-2.882-7.04C20.215 2.712 17.19 1.04 13.979 1.04c-5.464 0-9.96 4.495-9.96 9.96Z" />
                </svg>
                WhatsApp ilə sifariş ver
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
