import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Haqqımızda - DəmirMart" },
    {
      name: "description",
      content:
        "DəmirMart haqqında ətraflı məlumat — missiyamız, komandamız və tariximiz.",
    },
  ];
}

const teamMembers = [
  {
    name: "Əli Məmmədov",
    role: "CEO & Kurucu",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Nigar Həsənova",
    role: "Satış Direktoru",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Ruslan Babayev",
    role: "Texniki Rəhbər",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
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
    <main className="min-h-screen bg-[#0a1428] text-white overflow-hidden">
      {/* HERO - Deep Blue with Parallax Feel */}
      <section className="relative py-32 pt-40 bg-gradient-to-br from-[#0a1428] via-[#13223f] to-[#0f253f] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#22d3ee12_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <span className="inline-block px-6 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-bold rounded-full mb-6 uppercase tracking-widest">
            Haqqımızda
          </span>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            DəmirMart
          </h1>

          <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            2010-cu ildən bəri Azərbaycanda keyfiyyətli dəmir, metal və tikinti
            materiallarının etibarlı tədarükçüsü.
          </p>
        </div>

        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1428] to-transparent" />
      </section>

      {/* STATS BAR - Orange Accent */}
      <section className="bg-orange-600 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "14+", label: "İl təcrübə" },
              { num: "500+", label: "Məhsul çeşidi" },
              { num: "10K+", label: "Müştəri" },
              { num: "99%", label: "Məmnuniyyət" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-5xl font-black text-white transition-transform group-hover:scale-110 duration-300">
                  {stat.num}
                </p>
                <p className="text-orange-100 text-sm mt-2 font-medium tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-orange-400 font-bold text-sm uppercase tracking-[0.125em]">
              Missiyamız
            </span>

            <h2 className="text-4xl font-bold tracking-tighter leading-tight text-white">
              Keyfiyyəti hamıya əlçatan etmək
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed">
              DəmirMart, müştərilərimizə ən yüksək keyfiyyətli dəmir və metal
              məhsullarını əlverişli qiymətlərlə çatdırmaq missiyası ilə
              yaradılmışdır. İnşaat, sənaye və ev istifadəsi üçün geniş çeşidli
              məhsul portfelimiz mövcuddur.
            </p>

            <div className="space-y-5 pt-4">
              {[
                "Sertifikatlı məhsullar",
                "Sürətli çatdırılma",
                "Peşəkar məsləhət",
                "Rəqabətli qiymətlər",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="mt-1 w-7 h-7 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/30 group-hover:border-orange-400 transition-colors">
                    <svg
                      className="w-4 h-4 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-zinc-300 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80"
              alt="Haqqımızda"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* TIMELINE - Dark Background */}
      <section className="bg-[#13223f] py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold tracking-tighter text-center mb-16 text-white">
            Tariximiz
          </h2>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-orange-500/30 to-transparent" />

            <div className="space-y-20">
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-10 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div
                    className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}
                  >
                    <div className="inline-block bg-[#0a1428] border border-white/10 rounded-2xl px-8 py-5 shadow-xl">
                      <p className="text-zinc-300 text-lg">{m.text}</p>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-orange-500/40 border-4 border-[#13223f]">
                      {m.year}
                    </div>
                  </div>

                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold tracking-tighter text-center mb-16 text-white">
          Komandamız
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="group bg-[#13223f] border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              <div className="p-8 text-center">
                <h3 className="font-bold text-2xl text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-orange-400 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
