import type { Route } from "./+types/about";
import { useContext } from "react";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";

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
  { year: "2010", textKey: "milestone2010" },
  { year: "2013", textKey: "milestone2013" },
  { year: "2017", textKey: "milestone2017" },
  { year: "2020", textKey: "milestone2020" },
  { year: "2024", textKey: "milestone2024" },
];

export default function AboutPage() {
 const { t } = useLanguage();

  return (
    <main className="min-h-screen overflow-hidden bg-[#0a1428] text-white">
      {/* HERO - Deep Blue with Parallax Feel */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1428] via-[#13223f] to-[#0f253f] py-32 pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(#22d3ee12_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="mb-6 inline-block rounded-full border border-orange-500/30 bg-orange-500/20 px-6 py-2 text-sm font-bold uppercase tracking-widest text-orange-400">
            {t("aboutUs" as TranslationKey)}
          </span>

          <h1 className="mb-6 text-6xl font-bold tracking-tighter md:text-7xl">
            DəmirMart
          </h1>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-300">
            {t("aboutDescription" as TranslationKey)}
          </p>
        </div>

        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1428] to-transparent" />
      </section>

      {/* STATS BAR - Orange Accent */}
      <section className="bg-orange-600 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="gap-8 grid grid-cols-2 md:grid-cols-4">
            {[
              { num: "14+", labelKey: "yearsExperience" },
              { num: "500+", labelKey: "productsRange" },
              { num: "10K+", labelKey: "totalCustomers" },
              { num: "99%", labelKey: "satisfactionRate" },
            ].map((stat, i) => (
              <div key={i} className="group text-center">
                <p className="text-5xl font-black text-white transition-transform duration-300 group-hover:scale-110">
                  {stat.num}
                </p>
                <p className="mt-2 text-sm font-medium tracking-wide text-orange-100">
                  {t(stat.labelKey as TranslationKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="items-center gap-16 grid grid-cols-1 lg:grid-cols-2">
          <div className="space-y-8">
            <span className="text-sm font-bold uppercase tracking-[0.125em] text-orange-400">
              {t("ourMission" as TranslationKey)}
            </span>

            <h2 className="text-4xl font-bold leading-tight tracking-tighter text-white">
              {t("makeQualityAccessible" as TranslationKey)}
            </h2>

            <p className="text-lg leading-relaxed text-zinc-400">
              {t("missionDescription" as TranslationKey)}
            </p>

            <div className="space-y-5 pt-4">
              {[
                "certifiedProducts",
                "fastDelivery",
                "professionalAdvice",
                "competitivePrice",
              ].map((item, i) => (
                <div key={i} className="group flex items-start gap-4">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 transition-colors group-hover:border-orange-400">
                    <svg
                      className="h-4 w-4 text-orange-400"
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
                  <span className="text-lg text-zinc-300">
                    {t(item as TranslationKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80"
              alt={t("aboutUs" as TranslationKey)}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* TIMELINE - Dark Background */}
      <section className="relative bg-[#13223f] py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-16 text-center text-4xl font-bold tracking-tighter text-white">
            {t("ourHistory" as TranslationKey)}
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
                    <div className="shadow-xl inline-block rounded-2xl border border-white/10 bg-[#0a1428] px-8 py-5">
                      <p className="text-lg text-zinc-300">
                        {t(m.textKey as TranslationKey)}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="shadow-orange-500/40 border-4 border-[#13223f] flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500 text-2xl font-black text-white shadow-xl">
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
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-16 text-center text-4xl font-bold tracking-tighter text-white">
          {t("ourTeam" as TranslationKey)}
        </h2>

        <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-[#13223f] transition-all duration-500 hover:-translate-y-3 hover:border-orange-500/50"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              <div className="p-8 text-center">
                <h3 className="mb-2 text-2xl font-bold text-white">
                  {member.name}
                </h3>
                <p className="font-medium text-orange-400">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
