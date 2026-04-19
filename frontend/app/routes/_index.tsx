"use client";
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";

const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "-60px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
};

export default function Home() {
  const [heroRef, heroVisible] = useScrollReveal();
  const [aboutRef, aboutVisible] = useScrollReveal();
  const [capabilitiesRef, capabilitiesVisible] = useScrollReveal();
  const [productsRef, productsVisible] = useScrollReveal();
  const [globalReachRef, globalReachVisible] = useScrollReveal();
  const [certificationsRef, certificationsVisible] = useScrollReveal();
  const [testimonialsRef, testimonialsVisible] = useScrollReveal();
  const [whyRef, whyVisible] = useScrollReveal();

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  // Easy-to-swap industrial steel images
  const images = {
    hero: "https://images.pexels.com/photos/27382493/pexels-photo-27382493.jpeg", // Steel plant at dusk
    about: "https://images.pexels.com/photos/6804258/pexels-photo-6804258.jpeg", // Factory interior
    steelCoils:
      "https://images.pexels.com/photos/6804258/pexels-photo-6804258.jpeg", // Massive steel coils
    fabrication:
      "https://images.pexels.com/photos/27102103/pexels-photo-27102103.jpeg", // Steel fabrication
    workshop:
      "https://images.pexels.com/photos/27382493/pexels-photo-27382493.jpeg",
  };

  return (
    <main className="bg-[#0a1428] text-white overflow-hidden">
      {/* Top Bar - Orange accent like your reference */}

      {/* HERO - Deep Blue with Strong Parallax */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${images.hero}')`,
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1428]/90 via-[#0a1428]/75 to-[#13223f]/80" />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(#ffffff08_1px,transparent_1px),linear-gradient(90deg,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center z-10">
          <div ref={heroRef} className="space-y-10">
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-full text-sm tracking-[2px] transition-all duration-1000 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              ⚒️ EST. 2010 • BAKU, AZERBAIJAN
            </div>

            <h1
              className={`text-6xl lg:text-7xl font-bold tracking-tighter leading-none transition-all duration-1000 delay-100 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
            >
              Premium Steel Solutions
              <br />
              <span className="text-[#22d3ee]">Built for Enterprise</span>
            </h1>

            <p
              className={`text-xl lg:text-2xl text-zinc-300 max-w-lg transition-all duration-1000 delay-300 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
            >
              Trusted by leading construction, manufacturing, and infrastructure
              companies across 35+ countries.
            </p>

            <div
              className={`flex flex-wrap gap-5 transition-all duration-1000 delay-500 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
            >
              <Link
                to="/contact"
                className="px-10 py-5 bg-orange-500 hover:bg-orange-600 font-semibold rounded-2xl text-lg transition-all active:scale-95 shadow-lg"
              >
                Request a Quote
              </Link>
              <Link
                to="/products"
                className="px-10 py-5 border-2 border-[#22d3ee] text-[#22d3ee] hover:bg-[#22d3ee]/10 font-semibold rounded-2xl text-lg transition-all"
              >
                View Our Catalog
              </Link>
            </div>

            <div
              className={`grid grid-cols-3 gap-8 pt-12 border-t border-white/10 transition-all duration-1000 delay-700 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
            >
              {[
                { num: "15+", label: "Years Experience" },
                { num: "5,000+", label: "Enterprise Clients" },
                { num: "99.8%", label: "Delivery Reliability" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-bold text-[#22d3ee]">
                    {stat.num}
                  </div>
                  <div className="text-sm text-zinc-400 mt-1 tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`hidden lg:block relative transition-all duration-1000 delay-300 ${
              heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <img
              src={images.steelCoils}
              alt="Industrial Steel Facility"
              className="rounded-3xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION - Cool Blue Gradient */}
      <section
        ref={aboutRef}
        className="py-28 bg-gradient-to-br from-[#0f253f] to-[#1a324f] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#22d3ee12_1px,transparent_1px)] bg-[size:50px_50px] opacity-40" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div
              className={`transition-all duration-1000 ${aboutVisible ? "opacity-100 -translate-x-4" : "opacity-0 -translate-x-20"}`}
            >
              <img
                src={images.about}
                alt="Manufacturing Excellence"
                className="rounded-3xl shadow-2xl"
              />
            </div>

            <div
              className={`space-y-8 transition-all duration-1000 delay-200 ${aboutVisible ? "opacity-100 translate-x-4" : "opacity-0 translate-x-20"}`}
            >
              <h2 className="text-5xl font-bold tracking-tighter leading-tight">
                Engineering Trust Through Excellence
              </h2>
              <div className="space-y-6 text-lg text-zinc-300">
                <p>
                  For over 15 years, SultanovSteel has been a reliable partner
                  for large-scale industrial projects. We combine advanced
                  metallurgy with strict quality control.
                </p>
                <p>
                  Our commitment to transparency, consistency, and long-term
                  relationships makes us the preferred supplier for enterprises
                  that demand the best.
                </p>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 text-[#22d3ee] font-semibold hover:gap-5 transition-all"
              >
                Learn more about us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES - Dark Navy with Pattern */}
      <section ref={capabilitiesRef} className="py-28 bg-[#0a1428] relative">
        <div className="absolute inset-0 bg-[linear-gradient(#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${capabilitiesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <h2 className="text-5xl font-bold tracking-tighter">
              Our Capabilities
            </h2>
            <p className="text-xl text-zinc-400 mt-4 max-w-2xl mx-auto">
              State-of-the-art facilities engineered for scale and precision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced Metallurgy",
                desc: "Custom alloy development and heat treatment",
                stat: "120,000 tons/year",
              },
              {
                title: "Precision Processing",
                desc: "Cutting, bending, coating & fabrication",
                stat: "ISO-certified lines",
              },
              {
                title: "Quality Assurance",
                desc: "100% material testing and full traceability",
                stat: "Zero-defect policy",
              },
            ].map((cap, i) => (
              <div
                key={i}
                className={`bg-[#13223f] p-10 rounded-3xl border border-white/10 hover:border-[#22d3ee] transition-all duration-700 hover:-translate-y-3 ${capabilitiesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="text-[#22d3ee] text-4xl font-bold mb-6">
                  {cap.stat}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{cap.title}</h3>
                <p className="text-zinc-400">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION - Clean with Light Blue Tint */}
      <section
        ref={productsRef}
        className="py-28 bg-gradient-to-b from-[#0f253f] to-[#0a1428]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`mb-16 transition-all duration-1000 ${productsVisible ? "opacity-100" : "opacity-0"}`}
          >
            <h2 className="text-5xl font-bold tracking-tighter">
              Our Core Solutions
            </h2>
            <p className="text-xl text-zinc-400 mt-3">
              Reliable materials. Proven performance at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Bulk Steel Supply",
                desc: "Structural steel, plates, coils & profiles in all grades",
                img: images.steelCoils,
              },
              {
                title: "Specialty Alloys",
                desc: "Corrosion-resistant, high-strength and heat-resistant materials",
                img: images.steelCoils,
              },
              {
                title: "Fabrication Services",
                desc: "Custom cutting, welding and pre-assembly solutions",
                img: images.fabrication,
              },
            ].map((product, i) => (
              <div
                key={i}
                className={`group bg-[#13223f] rounded-3xl overflow-hidden border border-white/10 hover:border-[#22d3ee] transition-all duration-700 hover:-translate-y-4 ${productsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="h-72 overflow-hidden">
                  <img
                    src={product.img}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={product.title}
                  />
                </div>
                <div className="p-9">
                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-[#22d3ee] transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {product.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL REACH - Dark with Teal Accents */}
      <section ref={globalReachRef} className="py-28 bg-[#0a1428]">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`text-center mb-16 transition-all ${globalReachVisible ? "opacity-100" : "opacity-0"}`}
          >
            <h2 className="text-5xl font-bold tracking-tighter">
              Global Reach, Local Expertise
            </h2>
            <p className="text-xl text-zinc-400 mt-4">
              Supplying major projects across Europe, Middle East & Central Asia
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              "Azerbaijan",
              "Turkey",
              "Kazakhstan",
              "Georgia",
              "UAE",
              "Germany",
              "Russia",
              "Uzbekistan",
            ].map((country, i) => (
              <div
                key={i}
                className={`py-8 bg-[#13223f] border border-white/10 hover:border-[#22d3ee] rounded-3xl text-center font-medium transition-all duration-700 ${globalReachVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {country}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section ref={certificationsRef} className="py-28 bg-white text-zinc-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div
            className={`mb-16 transition-all ${certificationsVisible ? "opacity-100" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-5xl font-bold tracking-tighter text-zinc-900">
              Certified Excellence
            </h2>
            <p className="text-xl text-zinc-600 mt-4">
              Meeting the highest international industrial standards
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {[
              "ISO 9001:2015",
              "ISO 14001:2015",
              "EN 1090",
              "CE Marking",
              "OHSAS 18001",
              "API Certified",
            ].map((cert, i) => (
              <div
                key={i}
                className={`bg-white border border-zinc-200 px-12 py-9 rounded-3xl text-xl font-semibold shadow-sm hover:shadow-xl hover:border-[#22d3ee] transition-all ${certificationsVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS & WHY US - Combined for better flow */}
      <section
        ref={testimonialsRef}
        className="py-20 bg-zinc-100 text-zinc-900"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className={`text-5xl font-bold tracking-tighter text-center mb-16 transition-all ${testimonialsVisible ? "opacity-100" : "opacity-0"}`}
          >
            Trusted by Industry Leaders
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            <div
              className={`bg-white p-10 rounded-3xl shadow ${testimonialsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
              <p className="italic text-lg">
                "SultanovSteel consistently delivers on time with excellent
                quality. They have become our strategic partner for all major
                projects."
              </p>
              <div className="mt-8 font-semibold">
                Michael Berger — EuroBuild Group
              </div>
            </div>
            <div
              className={`bg-white p-10 rounded-3xl shadow ${testimonialsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
              <p className="italic text-lg">
                "SultanovSteel consistently delivers on time with excellent
                quality. They have become our strategic partner for all major
                projects."
              </p>
              <div className="mt-8 font-semibold">
                Michael Berger — EuroBuild Group
              </div>
            </div>
            <div
              className={`bg-white p-10 rounded-3xl shadow ${testimonialsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
              <p className="italic text-lg">
                "SultanovSteel consistently delivers on time with excellent
                quality. They have become our strategic partner for all major
                projects."
              </p>
              <div className="mt-8 font-semibold">
                Michael Berger — EuroBuild Group
              </div>
            </div>
            <div
              className={`bg-white p-10 rounded-3xl shadow ${testimonialsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
              <p className="italic text-lg">
                "SultanovSteel consistently delivers on time with excellent
                quality. They have become our strategic partner for all major
                projects."
              </p>
              <div className="mt-8 font-semibold">
                Michael Berger — EuroBuild Group
              </div>
            </div>
            {/* You can easily add more testimonial cards here */}
          </div>

       
        </div>
      </section>

      {/* FINAL CTA - Strong Orange + Teal Gradient */}
      <section className="py-24 bg-gradient-to-r from-orange-600 via-orange-500 to-[#22d3ee] text-center text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold tracking-tighter mb-6">
            Ready to secure your next project with confidence?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Let’s discuss how SultanovSteel can support your upcoming
            initiatives.
          </p>
          <Link
            to="/contact"
            className="inline-block px-14 py-6 bg-white text-[#0a1428] font-bold rounded-2xl text-xl hover:bg-zinc-100 transition transform hover:scale-105"
          >
            Get in Touch with Our Team
          </Link>
        </div>
      </section>
    </main>
  );
}
