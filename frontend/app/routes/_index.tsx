"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import { fetchSiteSettings, type SiteSettings } from "~/lib/site-settings";

export default function Home() {
  const { t } = useLanguage();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideVisible, setSlideVisible] = useState(true);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSiteSettings)
      .catch(() => undefined);
  }, []);

  const home = siteSettings?.data.home;
  const slides = home?.heroSlides?.length ? home.heroSlides : [];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length) {
      setActiveSlide(0);
      return;
    }

    setActiveSlide((current) => current % slides.length);
  }, [slides.length]);

  useEffect(() => {
    setSlideVisible(false);
    const frame = window.requestAnimationFrame(() => {
      setSlideVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeSlide]);

  const currentSlideIndex = slides.length ? activeSlide % slides.length : 0;
  const currentSlide = slides[currentSlideIndex] ?? {
    title: t("heroMainTitle" as TranslationKey),
    subtitle: t("heroMainSubtitle" as TranslationKey),
    description: t("heroDescription" as TranslationKey),
    image: "https://images.pexels.com/photos/27382493/pexels-photo-27382493.jpeg",
  };

  const capabilities = home?.capabilities ?? [];
  const products = home?.products ?? [];
  const stats = home?.heroStats ?? [];
  const aboutHighlights = home?.aboutHighlights ?? [];

  const slideDots = useMemo(() => slides.map((_, i) => i), [slides]);
  const goToSlide = (nextIndex: number) => {
    if (!slides.length) return;
    setActiveSlide(((nextIndex % slides.length) + slides.length) % slides.length);
  };

  return (
    <main className="overflow-hidden bg-[#0a1428] text-white">
      <section className="relative min-h-screen overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ backgroundImage: `url('${currentSlide.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1428]/90 via-[#0a1428]/70 to-[#13223f]/70" />
        <div className="absolute inset-0 bg-[linear-gradient(#ffffff08_1px,transparent_1px),linear-gradient(90deg,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:min-h-screen lg:grid-cols-2">
          <div
            className={`space-y-8 transition-all duration-700 ease-out motion-reduce:transition-none ${
              slideVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm tracking-[2px] backdrop-blur">
              ⚒️ {home?.heroEstablished ?? "TƏSIS EDILDI 2010 • BAKI, AZƏRBAYCAN"}
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-none tracking-tighter md:text-7xl">
                {currentSlide.title}
                <br />
                <span className="text-[#22d3ee]">{currentSlide.subtitle}</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-zinc-300 md:text-xl">
                {currentSlide.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-semibold transition-all active:scale-95 hover:bg-orange-600"
              >
                {t("requestQuote" as TranslationKey)}
              </Link>
              <Link
                to="/search"
                className="rounded-2xl border-2 border-[#22d3ee] px-8 py-4 text-lg font-semibold text-[#22d3ee] transition-all hover:bg-[#22d3ee]/10"
              >
                {t("viewCatalog" as TranslationKey)}
              </Link>
            </div>

            {!!stats.length && (
              <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-[#22d3ee] md:text-4xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm tracking-wide text-zinc-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className={`relative transition-all duration-700 ease-out motion-reduce:transition-none ${
              slideVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className={`h-[36rem] w-full object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
                  slideVisible ? "scale-100" : "scale-105"
                }`}
              />
              {!!slides.length && (
                <>
                  <button
                    type="button"
                    onClick={() => goToSlide(currentSlideIndex - 1)}
                    className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-3 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/55 lg:-left-6"
                    aria-label="Previous slide"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlide(currentSlideIndex + 1)}
                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-3 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/55 lg:-right-6"
                    aria-label="Next slide"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-300">
                  {home?.capabilitiesTitle ?? "Bizim imkanlarımız"}
                </p>
                <p className="mt-2 text-xl font-bold transition-all duration-700 ease-out motion-reduce:transition-none">
                  {currentSlide.title}
                </p>
                <p className="mt-1 text-sm text-zinc-300 transition-all duration-700 ease-out motion-reduce:transition-none">
                  {currentSlide.description}
                </p>
              </div>
            </div>

            {!!slideDots.length && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {slideDots.map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setActiveSlide(dot)}
                    className={`h-2.5 rounded-full transition-all ${
                      dot === activeSlide ? "w-10 bg-orange-500" : "w-2.5 bg-white/30"
                    }`}
                    aria-label={`Slide ${dot + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              {home?.aboutTitle ?? t("aboutUs" as TranslationKey)}
            </p>
            <h2 className="text-4xl font-bold tracking-tighter md:text-5xl">
              {home?.aboutTitle ?? t("aboutUs" as TranslationKey)}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
              {home?.aboutDescription ??
                t("aboutDescription" as TranslationKey)}
            </p>

            {!!aboutHighlights.length && (
              <div className="mt-8 space-y-4">
                {aboutHighlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                      ✓
                    </div>
                    <span className="text-zinc-200">{item}</span>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/about"
              className="mt-8 inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold transition-all hover:border-orange-500/50 hover:text-orange-400"
            >
              {t("learnMoreAboutUs" as TranslationKey)}
            </Link>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10">
            <img
              src={home?.aboutImage ?? "https://images.pexels.com/photos/6804258/pexels-photo-6804258.jpeg"}
              alt={home?.aboutTitle ?? "Haqqımızda"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {!!capabilities.length && (
        <section className="bg-[#0f1a33] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
                  {home?.capabilitiesTitle ?? "Bizim imkanlarımız"}
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">
                  {home?.capabilitiesTitle ?? "Bizim imkanlarımız"}
                </h2>
              </div>
              <Link
                to="/search"
                className="hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold hover:border-orange-500/50 hover:text-orange-400 md:inline-flex"
              >
                {t("viewCatalog" as TranslationKey)}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#13223f] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden bg-gray-50">
                    <img
                      src={
                        cap.image ??
                        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=80"
                      }
                      alt={cap.title}
                      className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-white backdrop-blur-md">
                      {cap.stat ?? `0${i + 1}`}
                    </div>
                  </div>
                  <div className="space-y-3 p-7">
                    <h3 className="text-2xl font-bold">{cap.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-300">
                      {cap.desc}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
                        {home?.capabilitiesTitle ?? "Bizim imkanlarımız"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!products.length && (
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
                {home?.productsTitle ?? "Əsas məhsullar"}
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tighter md:text-5xl">
                {home?.productsTitle ?? "Əsas məhsullar"}
              </h2>
            </div>
            <Link
              to="/search"
              className="hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold hover:border-orange-500/50 hover:text-orange-400 md:inline-flex"
            >
              {t("viewCatalog" as TranslationKey)}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {products.map((product, i) => (
              <article
                key={i}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#13223f] shadow-xl"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-64 w-full object-cover"
                />
                <div className="p-7">
                  <h3 className="text-2xl font-bold">{product.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {product.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section
        className="relative overflow-hidden bg-cover bg-center py-24"
        style={{
          backgroundImage: `url('${home?.contactBackgroundImage ?? "https://images.pexels.com/photos/8728388/pexels-photo-8728388.jpeg"}')`,
        }}
      >
        <div className="absolute inset-0 bg-[#0a1428]/80" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-300">
            {home?.contactTitle ?? "BİZİMLƏ ƏLAQƏ"}
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">
            {home?.contactTitle ?? "BİZİMLƏ ƏLAQƏ"}
          </h2>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded-2xl bg-orange-500 px-8 py-4 text-lg font-semibold transition-all hover:bg-orange-600"
          >
            {home?.contactButtonLabel ?? "Bizimlə əlaqə saxlayın"}
          </Link>
        </div>
      </section>
    </main>
  );
}
