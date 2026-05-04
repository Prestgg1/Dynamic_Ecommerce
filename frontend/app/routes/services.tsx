import type { Route } from "./+types/services";
import { useContext } from "react";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Xidmətlər - DəmirMart" },
    {
      name: "description",
      content:
        "DəmirMart-ın göstərdiyi xidmətlər — çatdırılma, kəsmə, istehsal sifarişi və daha çox.",
    },
  ];
}

const services = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8m-9 4v4m4-4v4"
        />
      </svg>
    ),
    titleKey: "deliveryService",
    descKey: "deliveryServiceDesc",
    badgeKey: "freeDeliveryBaku",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
        />
      </svg>
    ),
    titleKey: "metalCutting",
    descKey: "metalCuttingDesc",
    badgeKey: "byOrder",
    color: "from-gray-700 to-gray-900",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    titleKey: "certification",
    descKey: "certificationDesc",
    badgeKey: "iso9001",
    color: "from-green-500 to-green-600",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    titleKey: "corporateSales",
    descKey: "corporateSalesDesc",
    badgeKey: "b2b",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    titleKey: "technicalSupport",
    descKey: "technicalSupportDesc",
    badgeKey: "support24_7",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    titleKey: "returns",
    descKey: "returnsDesc",
    badgeKey: "days30",
    color: "from-red-500 to-red-600",
  },
];

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24 pt-36">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-orange-500/30 bg-orange-500/20 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-orange-400">
            {t("services" as TranslationKey)}
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            {t("howCanWeHelp" as TranslationKey)}
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300">
            {t("fullServicePackage" as TranslationKey)}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                {s.icon}
              </div>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900">
                  {t(s.titleKey as TranslationKey)}
                </h3>
                <span className="rounded-lg bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600">
                  {t(s.badgeKey as TranslationKey)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                {t(s.descKey as TranslationKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-3 text-3xl font-black text-white">
            {t("haveQuestions" as TranslationKey)}
          </h2>
          <p className="mb-8 text-gray-400">
            {t("contactForMoreInfo" as TranslationKey)}
          </p>
          <a
            href="/contact"
            className="active:scale-95 shadow-orange-500/30 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-black text-white shadow-lg transition-all hover:bg-orange-600"
          >
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {t("contactUs" as TranslationKey)}
          </a>
        </div>
      </section>
    </main>
  );
}
