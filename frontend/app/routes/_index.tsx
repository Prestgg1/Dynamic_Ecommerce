import { Link } from "react-router";
import ProductCard from "~/components/ProductCard";
import { categories as staticCategories } from "~/lib/data";
import { trpc } from "~/lib/trpc";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import { IconDisplay, type CategoryIconKey, getGradient } from "~/lib/admin-icons";

const categoryIcons: Record<string, React.ReactNode> = {
  tools: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
  ),
  hardware: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  ),
  pipes: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  fasteners: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  electrical: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  welding: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  safety: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

const categoryColors: Record<string, string> = {
  tools: "from-orange-500 to-orange-600",
  hardware: "from-blue-500 to-blue-600",
  pipes: "from-gray-500 to-gray-600",
  fasteners: "from-yellow-500 to-yellow-600",
  electrical: "from-yellow-400 to-orange-500",
  welding: "from-red-500 to-red-600",
  safety: "from-green-500 to-green-600",
};

export default function Home() {
  const { t,language } = useLanguage();

  // Fetch live data from backend
  const { data: featuredData, isLoading: isFeaturedLoading } = trpc.useQuery("get", "/products/featured");
  const { data: allProductsData, isLoading: isAllLoading } = trpc.useQuery("get", "/products");
  const { data: dynamicCategories, isLoading: isCategoriesLoading } = trpc.useQuery("get", "/categories");

  const featured = featuredData || [];
  const products = allProductsData || [];
  const categories = dynamicCategories || [];
  const bestSellers = products.filter((p) => p.isBestSeller);
  const newArrivals = products.filter((p) => p.isNew);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              #1 Metal Store
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              {t("heroTitle" as TranslationKey)}
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              {t("heroSubtitle" as TranslationKey)}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/search"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-orange-500/30"
              >
                {t("shopNow" as TranslationKey)}
              </Link>
              <Link
                to="/about"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-xl font-semibold transition-all"
              >
                {t("about" as TranslationKey)}
              </Link>
            </div>
          </div>
          {/* Hero stats */}
          <div className="flex-1 flex gap-4 justify-center">
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "500+", label: t("categories" as TranslationKey) },
                { num: "12K+", label: t("reviews" as TranslationKey) },
                { num: "2010", label: "Year Est." },
                { num: "99%", label: "Satisfaction" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                  <p className="text-3xl font-extrabold text-orange-400">{stat.num}</p>
                  <p className="text-xs text-gray-300 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L720 0L1440 40H0Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t("categories" as TranslationKey)}</h2>
          <Link to="/search" className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
            {t("viewAll" as TranslationKey)}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {isCategoriesLoading 
            ? Array(7).fill(0).map((_, i) => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-2xl" />)
            : categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/search?category=${cat.id}`}
                className="flex flex-col items-center gap-2 group"
              >
                    <IconDisplay icon={cat.icon as CategoryIconKey} size="md" />
                <span className="text-xs text-gray-600 text-center font-medium group-hover:text-orange-600 transition-colors leading-tight">
                     {(cat[`label${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof typeof cat] as string) || (cat.labelEn as string)}
                </span>
              </Link>
            ))
          }
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t("featuredProducts" as TranslationKey)}</h2>
          <Link to="/search" className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
            {t("viewAll" as TranslationKey)}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {isFeaturedLoading 
            ? Array(5).fill(0).map((_, i) => <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-64" />)
            : featured.map((product) => <ProductCard key={product.id} product={product as any} />)
          }
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">{t("bestSellers" as TranslationKey)}</h2>
            </div>
            <Link to="/search" className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
              {t("viewAll" as TranslationKey)}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {isAllLoading 
              ? Array(4).fill(0).map((_, i) => <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-64" />)
              : bestSellers.map((product) => <ProductCard key={product.id} product={product as any} />)
            }
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">{t("newArrivals" as TranslationKey)}</h2>
          </div>
          <Link to="/search" className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
            {t("viewAll" as TranslationKey)}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {isAllLoading 
            ? Array(4).fill(0).map((_, i) => <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-64" />)
            : newArrivals.map((product) => <ProductCard key={product.id} product={product as any} />)
          }
        </div>
      </section>
    </main>
  );
}