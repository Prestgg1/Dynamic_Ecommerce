import type { Route } from "./+types/contact";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import { BUSINESS_CONTACT } from "~/lib/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Əlaqə - DəmirMart" },
    {
      name: "description",
      content:
        "DəmirMart ilə əlaqə saxlayın — telefon, email və ya əlaqə forması vasitəsilə.",
    },
  ];
}

/**
 * Format contact form data into WhatsApp message
 */
const formatWhatsAppMessage = (form: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): string => {
  return encodeURIComponent(
    `Yeni Əlaqə Formu,\n\n` +
    `Ad Soyad: ${form.name},\n` +
    `Email: ${form.email},\n` +
    `Telefon: ${form.phone || "Verilmədi"},\n` +
    `Mesaj:\n${form.message},`
  );
};

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const whatsappMessage = formatWhatsAppMessage(form);
      const whatsappUrl = `https://wa.me/${BUSINESS_CONTACT.whatsappNumber}?text=${whatsappMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      // Show success toast
      toast.success(t("messageSentSuccess" as TranslationKey));

      // Reset form
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message");
      console.error("WhatsApp integration error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      labelKey: "address",
      value: BUSINESS_CONTACT.city,
      subKey: "addressDetails",
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      labelKey: "phone",
      value: BUSINESS_CONTACT.displayPhone,
      subKey: "phoneHours",
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      labelKey: "email_label",
      value: BUSINESS_CONTACT.email,
      subKey: "emailResponse",
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      labelKey: "workingHours",
      value: "09:00 – 18:00",
      subKey: "workingDays",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ===== HERO SECTION ===== */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-24 pt-36 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-orange-500/30 bg-orange-500/20 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-orange-400">
            {t("contactUs" as TranslationKey)}
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            {t("getInTouch" as TranslationKey)}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-gray-300">
            {t("contactViaChannels" as TranslationKey)}
          </p>
        </div>
      </section>

      {/* ===== CONTACT CARDS + FORM ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="gap-10 grid grid-cols-1 lg:grid-cols-5">
          {/* LEFT: Info Cards */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {contactInfo.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {t(item.labelKey as TranslationKey)}
                  </p>
                  <p className="mt-0.5 font-black text-gray-900">
                    {item.value}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {t(item.subKey as TranslationKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Contact Form */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:p-10 lg:col-span-3">
            <h2 className="mb-2 text-2xl font-black text-gray-900">
              {t("sendMessage" as TranslationKey)}
            </h2>
            <p className="mb-7 text-sm text-gray-400">
              {t("fillFormResponse" as TranslationKey)}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email Row */}
              <div className="gap-5 grid grid-cols-1 sm:grid-cols-2">
                {/* Name Input */}
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-700">
                    {t("fullName" as TranslationKey)}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                    placeholder={t("nameExample" as TranslationKey)}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-700">
                    {t("email_label" as TranslationKey)}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                    placeholder={t("emailExample" as TranslationKey)}
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-700">
                  {t("phoneOptional" as TranslationKey)}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                  placeholder={t("phoneExample" as TranslationKey)}
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-700">
                  {t("message" as TranslationKey)}
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                  placeholder={t("messagePlaceholder" as TranslationKey)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 text-base font-black text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 active:scale-[0.97] disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t("sending" as TranslationKey)}
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    {t("sendMessage" as TranslationKey)}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}