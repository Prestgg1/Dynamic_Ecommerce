import type { Route } from "./+types/about";
import { useEffect, useState } from "react";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import {
  fetchSiteSettings,
  mediaUrl,
  type SiteSettings,
} from "~/lib/site-settings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Haqqımızda - MetalX" },
    {
      name: "description",
      content:
        "MetalX haqqında məlumatlar ana səhifə ilə eyni məzmundan gəlir.",
    },
  ];
}

export default function AboutPage() {
  const { t } = useLanguage();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSiteSettings)
      .catch(() => undefined);
  }, []);

  const home = siteSettings?.data.home;

  return (
    <main className="min-h-screen overflow-hidden bg-[#001446] text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001446] via-[#041d23] to-[#041d23] py-32 pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(#0080e812_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="mb-6 inline-block rounded-full border border-[#0080e8]/30 bg-[#0080e8]/20 px-6 py-2 text-sm font-bold uppercase tracking-widest text-[#0080e8]">
            {t("aboutUs" as TranslationKey)}
          </span>
          <h1 className="mb-6 text-6xl font-bold tracking-tighter md:text-7xl">
            {home?.aboutTitle ?? "Haqqımızda"}
          </h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-300">
            {home?.aboutDescription ?? t("aboutDescription" as TranslationKey)}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#001446] to-transparent" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={mediaUrl(
                home?.aboutImage ??
                  "https://images.pexels.com/photos/6804258/pexels-photo-6804258.jpeg",
              )}
              alt={home?.aboutTitle ?? "Haqqımızda"}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-8">
            <span className="text-sm font-bold uppercase tracking-[0.125em] text-[#0080e8]">
              {t("ourMission" as TranslationKey)}
            </span>
            <h2 className="text-4xl font-bold leading-tight tracking-tighter text-white">
              {home?.aboutTitle ?? "Haqqımızda"}
            </h2>
            <p className="text-lg leading-relaxed text-zinc-300">
              {home?.aboutDescription ??
                t("missionDescription" as TranslationKey)}
            </p>

            {!!(home?.aboutHighlights?.length ?? 0) && (
              <div className="space-y-4 pt-2">
                {(home?.aboutHighlights ?? []).map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-xl border border-[#0080e8]/30 bg-[#0080e8]/10 text-[#0080e8]">
                      ✓
                    </div>
                    <span className="text-lg text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
