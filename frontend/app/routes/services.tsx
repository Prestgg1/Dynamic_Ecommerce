import type { Route } from "./+types/services";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Xidmətlər - DəmirMart" },
    { name: "description", content: "DəmirMart-ın göstərdiyi xidmətlər — çatdırılma, kəsmə, istehsal sifarişi və daha çox." },
  ];
}

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8m-9 4v4m4-4v4" />
      </svg>
    ),
    title: "Çatdırılma Xidməti",
    desc: "Sifarişləriniz 24-48 saat ərzində ünvanınıza çatdırılır. Bakı daxilindəki sifarişlər üçün pulsuz çatdırılma mövcuddur.",
    badge: "Pulsuz (Bakı daxili)",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
    title: "Metal Kəsmə",
    desc: "Sifarişinizə uyğun ölçüdə dəmir, polad və alüminium materialların dəqiq kəsilməsi. Sifariş minimumu yoxdur.",
    badge: "Sifarişlə",
    color: "from-gray-700 to-gray-900",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Sertifikasiya",
    desc: "Bütün məhsullarımız beynəlxalq sertifikatlara malikdir. Sertifikat sənədlərini istənilən vaxt ala bilərsiniz.",
    badge: "ISO 9001",
    color: "from-green-500 to-green-600",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Korporativ Satış",
    desc: "Böyük həcmli sifarişlər üçün xüsusi endirimlər və fərdi şərtlər. B2B müştərilərimiz üçün ayrıca hesab açılır.",
    badge: "B2B",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Texniki Dəstək",
    desc: "Məhsul seçimi, quraşdırma məsləhəti və texniki suallar üçün mütəxəssislərimiz həmişə sizinlədir.",
    badge: "7/24",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Geri Qaytarma",
    desc: "30 gün ərzində heç bir problem olmadan məhsulunuzu geri qaytara bilərsiniz. Pul qaytarılması zaminatlıdır.",
    badge: "30 gün",
    color: "from-red-500 to-red-600",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-linear-to-r from-gray-900 to-gray-800 text-white py-24 pt-36">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-bold rounded-full mb-4 uppercase tracking-widest">
            Xidmətlər
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Necə kömək edə bilərik?
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Sadəcə məhsul satmırıq — başdan sona tam xidmət paketi təqdim edirik.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${s.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {s.icon}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-black text-gray-900 text-lg">{s.title}</h3>
                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg">
                  {s.badge}
                </span>
              </div>
              <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-3">Sualınız var mı?</h2>
          <p className="text-gray-400 mb-8">
            Hər hansı bir xidmətimizlə bağlı ətraflı məlumat üçün bizimlə əlaqə saxlayın.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/30 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Bizimlə əlaqə saxla
          </a>
        </div>
      </section>
    </main>
  );
}
