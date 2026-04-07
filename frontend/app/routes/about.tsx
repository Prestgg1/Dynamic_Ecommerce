import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Haqqımızda - DəmirMart" },
    { name: "description", content: "DəmirMart haqqında ətraflı məlumat — missiyamız, komandamız və tariximiz." },
  ];
}

const teamMembers = [
  {
    name: "Əli Məmmədov",
    role: "CEO & Kurucu",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Nigar Həsənova",
    role: "Satış Direktoru",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    name: "Ruslan Babayev",
    role: "Texniki Rəhbər",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
];

const milestones = [
  { year: "2010", text: "Şirkətin əsası qoyuldu" },
  { year: "2013", text: "İlk mağaza açıldı" },
  { year: "2017", text: "Online satış başlandı" },
  { year: "2020", text: "500+ məhsul çeşidi" },
  { year: "2024", text: "10.000+ müştəri" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-linear-to-r from-gray-900 to-gray-800 text-white py-24 pt-36">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-bold rounded-full mb-4 uppercase tracking-widest">
            Haqqımızda
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            DəmirMart
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            2010-cu ildən bəri Azərbaycanda keyfiyyətli dəmir, metal və tikinti
            materiallarının etibarlı tədarükçüsü.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-orange-500">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "14+", label: "İl təcrübə" },
              { num: "500+", label: "Məhsul çeşidi" },
              { num: "10K+", label: "Müştəri" },
              { num: "99%", label: "Məmnuniyyət" },
            ].map((stat, i) => (
              <div key={i} className="text-center text-white">
                <p className="text-4xl font-black">{stat.num}</p>
                <p className="text-orange-100 text-sm mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">
              Missiyamız
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-2 mb-4 leading-tight">
              Keyfiyyəti hamıya əlçatan etmək
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              DəmirMart, müştərilərimizə ən yüksək keyfiyyətli dəmir və metal
              məhsullarını əlverişli qiymətlərlə çatdırmaq missiyası ilə
              yaradılmışdır. İnşaat, sənaye və ev istifadəsi üçün geniş çeşidli
              məhsul portfelimiz mövcuddur.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Sertifikatlı məhsullar",
                "Sürətli çatdırılma",
                "Peşəkar məsləhət",
                "Rəqabətli qiymətlər",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200">
            <img
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80"
              alt="Haqqımızda"
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Tariximiz</h2>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px h-full w-0.5 bg-orange-100" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div className="inline-block bg-white border border-orange-100 rounded-2xl px-5 py-3 shadow-sm">
                      <p className="text-sm text-gray-600 font-medium">{m.text}</p>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-xs z-10 shrink-0 shadow-lg shadow-orange-500/30">
                    {m.year}
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Komandamız</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-sm overflow-hidden text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-52 object-cover object-top"
              />
              <div className="p-5">
                <h3 className="font-black text-gray-900 text-lg">{member.name}</h3>
                <p className="text-sm text-orange-500 font-semibold mt-1">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
