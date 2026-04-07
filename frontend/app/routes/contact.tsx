import type { Route } from "./+types/contact";
import { useState } from "react";
import toast from "react-hot-toast";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Əlaqə - DəmirMart" },
    { name: "description", content: "DəmirMart ilə əlaqə saxlayın — telefon, email və ya əlaqə forması vasitəsilə." },
  ];
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Mesajınız uğurla göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.");
    setForm({ name: "", email: "", phone: "", message: "" });
    setIsSending(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-linear-to-r from-gray-900 to-gray-800 text-white py-24 pt-36">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-bold rounded-full mb-4 uppercase tracking-widest">
            Əlaqə
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Bizimlə əlaqə saxlayın
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Hər hansı sualınız, sifarişiniz və ya təklifiniz üçün aşağıdakı kanallardan birini istifadə edin.
          </p>
        </div>
      </section>

      {/* Contact cards + form */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info cards */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                label: "Ünvan",
                value: "Bakı, Azərbaycan",
                sub: "Nizami küçəsi 25, AZ1000",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                label: "Telefon",
                value: "+994 50 123 45 67",
                sub: "Bazar ertəsi–Şənbə, 09:00–18:00",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                label: "Email",
                value: "info@demirmart.az",
                sub: "24 saat ərzində cavab veririk",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: "İş saatları",
                value: "09:00 – 18:00",
                sub: "Bazar ertəsi – Şənbə",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.label}</p>
                  <p className="font-black text-gray-900 mt-0.5">{item.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Mesaj göndər</h2>
            <p className="text-gray-400 text-sm mb-7">Formu doldurun, ən qısa zamanda sizinlə əlaqə saxlayacağıq.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all bg-gray-50 font-medium text-gray-900 placeholder:text-gray-400"
                    placeholder="Orxan Məmmədov"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all bg-gray-50 font-medium text-gray-900 placeholder:text-gray-400"
                    placeholder="orxan@mail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest">Telefon (İstəyə bağlı)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all bg-gray-50 font-medium text-gray-900 placeholder:text-gray-400"
                  placeholder="+994 50 000 00 00"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest">Mesaj</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all bg-gray-50 font-medium text-gray-900 placeholder:text-gray-400 resize-none"
                  placeholder="Mesajınızı burada yazın..."
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2 text-base"
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Göndərilir...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Mesaj Göndər
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
