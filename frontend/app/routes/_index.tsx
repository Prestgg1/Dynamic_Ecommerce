"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import { fetchSiteSettings, type SiteSettings } from "~/lib/site-settings";

export default function Home() {
  const { t } = useLanguage();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [displaySlideIndex, setDisplaySlideIndex] = useState(0);
  const [transitionSlideIndex, setTransitionSlideIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    }, 3000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length) {
      setActiveSlide(0);
      setDisplaySlideIndex(0);
      setTransitionSlideIndex(null);
      setIsTransitioning(false);
      return;
    }

    setActiveSlide((current) => current % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    if (activeSlide === displaySlideIndex || isTransitioning) {
      return;
    }

    setTransitionSlideIndex(activeSlide);
    setIsTransitioning(true);

    const timer = window.setTimeout(() => {
      setDisplaySlideIndex(activeSlide);
      setTransitionSlideIndex(null);
      setIsTransitioning(false);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [activeSlide, displaySlideIndex, isTransitioning, slides.length]);

  const currentSlide = slides[displaySlideIndex] ?? {
    title: t("heroMainTitle" as TranslationKey),
    subtitle: t("heroMainSubtitle" as TranslationKey),
    description: t("heroDescription" as TranslationKey),
    image: "https://images.pexels.com/photos/27382493/pexels-photo-27382493.jpeg",
  };
  const nextSlide = transitionSlideIndex != null ? slides[transitionSlideIndex] : null;

  const capabilities = home?.capabilities ?? [];
  const products = home?.products ?? [];
  const stats = home?.heroStats ?? [];
  const aboutHighlights = home?.aboutHighlights ?? [];

  return (
    <main className="overflow-hidden bg-[#001446] text-white">
      <section className="relative min-h-screen overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
              isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
          />
          {nextSlide && (
            <img
              src={nextSlide.image}
              alt={nextSlide.title}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
                isTransitioning ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#001446]/90 via-[#001446]/70 to-[#041d23]/70" />
        <div className="absolute inset-0 bg-[linear-gradient(#ffffff08_1px,transparent_1px),linear-gradient(90deg,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:min-h-screen lg:grid-cols-2">
          <div className="space-y-8 transition-all duration-700 ease-out motion-reduce:transition-none">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm tracking-[2px] backdrop-blur">
              ⚒️ {home?.heroEstablished ?? "TƏSIS EDILDI 2010 • BAKI, AZƏRBAYCAN"}
            </div>

            <div className="relative min-h-[13rem]">
              <div
                className={`space-y-4 transition-all duration-700 ease-out motion-reduce:transition-none ${
                  isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                <h1 className="text-5xl font-bold leading-none tracking-tighter md:text-7xl">
                  {currentSlide.title}
                  <br />
                  <span className="text-[#0080e8]">{currentSlide.subtitle}</span>
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-zinc-300 md:text-xl">
                  {currentSlide.description}
                </p>
              </div>
              {nextSlide && (
                <div
                  className={`pointer-events-none absolute inset-0 space-y-4 transition-all duration-700 ease-out motion-reduce:transition-none ${
                    isTransitioning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  aria-hidden="true"
                >
                  <h1 className="text-5xl font-bold leading-none tracking-tighter md:text-7xl">
                    {nextSlide.title}
                    <br />
                    <span className="text-[#0080e8]">{nextSlide.subtitle}</span>
                  </h1>
                  <p className="max-w-xl text-lg leading-relaxed text-zinc-300 md:text-xl">
                    {nextSlide.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="rounded-2xl bg-[#0080e8] px-8 py-4 text-lg font-semibold transition-all active:scale-95 hover:bg-[#0080e8]/90"
              >
                {t("requestQuote" as TranslationKey)}
              </Link>
              <Link
                to="/search"
                className="rounded-2xl border-2 border-[#0080e8] px-8 py-4 text-lg font-semibold text-[#0080e8] transition-all hover:bg-[#0080e8]/10"
              >
                {t("viewCatalog" as TranslationKey)}
              </Link>
            </div>

            {!!stats.length && (
              <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-[#0080e8] md:text-4xl">
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

          <div className="relative">
            <div className="relative h-[36rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
              <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md transition-opacity duration-700 ease-out motion-reduce:transition-none">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-300">
                  {home?.capabilitiesTitle ?? "Bizim imkanlarımız"}
                </p>
                <div className="relative mt-2 min-h-16">
                  <p
                    className={`absolute inset-0 text-xl font-bold transition-all duration-700 ease-out motion-reduce:transition-none ${
                      isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                    }`}
                  >
                    {currentSlide.title}
                  </p>
                  {nextSlide && (
                    <p
                      className={`absolute inset-0 text-xl font-bold transition-all duration-700 ease-out motion-reduce:transition-none ${
                        isTransitioning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      }`}
                    >
                      {nextSlide.title}
                    </p>
                  )}
                </div>
                <div className="relative mt-1 min-h-10">
                  <p
                    className={`absolute inset-0 text-sm text-zinc-300 transition-all duration-700 ease-out motion-reduce:transition-none ${
                      isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                    }`}
                  >
                    {currentSlide.description}
                  </p>
                  {nextSlide && (
                    <p
                      className={`absolute inset-0 text-sm text-zinc-300 transition-all duration-700 ease-out motion-reduce:transition-none ${
                        isTransitioning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      }`}
                    >
                      {nextSlide.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#0080e8]">
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0080e8]/10 text-[#0080e8]">
                      ✓
                    </div>
                    <span className="text-zinc-200">{item}</span>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/about"
              className="mt-8 inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold transition-all hover:border-[#0080e8]/50 hover:text-[#0080e8]"
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
        <section className="bg-[#041d23] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0080e8]">
                  {home?.capabilitiesTitle ?? "Bizim imkanlarımız"}
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">
                  {home?.capabilitiesTitle ?? "Bizim imkanlarımız"}
                </h2>
              </div>
              <Link
                to="/search"
                className="hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold hover:border-[#0080e8]/50 hover:text-[#0080e8] md:inline-flex"
              >
                {t("viewCatalog" as TranslationKey)}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#041d23] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
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
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0080e8]">
                {home?.productsTitle ?? "Əsas məhsullar"}
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tighter md:text-5xl">
                {home?.productsTitle ?? "Əsas məhsullar"}
              </h2>
            </div>
            <Link
              to="/search"
              className="hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold hover:border-[#0080e8]/50 hover:text-[#0080e8] md:inline-flex"
            >
              {t("viewCatalog" as TranslationKey)}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {products.map((product, i) => (
              <article
                key={i}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#041d23] shadow-xl"
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
        <div className="absolute inset-0 bg-[#001446]/80" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0080e8]">
            {home?.contactTitle ?? "BİZİMLƏ ƏLAQƏ"}
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">
            {home?.contactTitle ?? "BİZİMLƏ ƏLAQƏ"}
          </h2>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded-2xl bg-[#0080e8] px-8 py-4 text-lg font-semibold transition-all hover:bg-[#0080e8]/90"
          >
            {home?.contactButtonLabel ?? "Bizimlə əlaqə saxlayın"}
          </Link>
        </div>
      </section>
    </main>
  );
}
