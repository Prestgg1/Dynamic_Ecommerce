import type { Route } from "./+types/contact";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import {
  createContactMessage,
  fetchSiteSettings,
  type SiteSettings,
} from "~/lib/site-settings";

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

export default function ContactPage() {
  const { t } = useLanguage();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSiteSettings)
      .catch(() => undefined);
  }, []);

  const data = siteSettings?.data;
  const social = data?.socialLinks ?? {};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await createContactMessage({
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });
      toast.success(t("messageSentSuccess" as TranslationKey));
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Contact submission error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const contactInfo = [
    { labelKey: "address", value: data?.address ?? "Bakı, Azərbaycan" },
    { labelKey: "phone", value: data?.displayPhone ?? "+994 50 123 45 67" },
    { labelKey: "email_label", value: data?.email ?? "info@demirmart.az" },
    { labelKey: "workingHours", value: data?.workingHours ?? "09:00 - 18:00" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-24 pt-36 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-orange-500/30 bg-orange-500/20 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-orange-400">
            {t("contactUs" as TranslationKey)}
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            {data?.home?.contactTitle ?? t("getInTouch" as TranslationKey)}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-gray-300">
            {data?.home?.contactSubtitle ?? t("contactViaChannels" as TranslationKey)}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:col-span-2">
            {contactInfo.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                  {i === 0 ? "⌁" : i === 1 ? "☎" : i === 2 ? "✉" : "◷"}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {t(item.labelKey as TranslationKey)}
                  </p>
                  <p className="mt-1 font-black text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Social
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a href={social.instagram || "#"} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                  Instagram
                </a>
                <a href={social.tiktok || "#"} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                  TikTok
                </a>
                <a href={social.whatsapp || "#"} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:p-10 lg:col-span-3">
            <h2 className="mb-2 text-2xl font-black text-gray-900">
              {t("sendMessage" as TranslationKey)}
            </h2>
            <p className="mb-7 text-sm text-gray-400">
              {t("fillFormResponse" as TranslationKey)}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                  placeholder={t("nameExample" as TranslationKey)}
                />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                  placeholder={t("emailExample" as TranslationKey)}
                />
              </div>

              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                placeholder={t("phoneExample" as TranslationKey)}
              />

              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                placeholder={t("messagePlaceholder" as TranslationKey)}
              />

              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 font-black text-white transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? "Göndərilir..." : t("send" as TranslationKey)}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <iframe
            title="Google Maps"
            src={data?.contactMapUrl ?? "https://www.google.com/maps?q=Bakı,+Azərbaycan&output=embed"}
            className="h-[420px] w-full"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}
