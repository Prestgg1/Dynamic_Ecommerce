import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import { trpc } from "~/lib/trpc";
import { categories as staticCategories } from "~/lib/data";
import ProductCard from "~/components/ProductCard";
import type { TranslationKey } from "~/lib/translations";

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "new";

function SearchContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";

  const [query, setQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Sync internal state when URL changes
  useEffect(() => {
    setQuery(queryParam);
    setSelectedCategory(categoryParam);
  }, [queryParam, categoryParam]);

  // Fetch live products from backend
  const { data: productsData, isLoading } = trpc.useQuery("get", "/products", {
    params: {
      query: {
        categoryId: selectedCategory === "all" ? undefined : (selectedCategory as any),
        q: queryParam || undefined,
      },
    },
  });

  const rawResults = productsData || [];

  const filteredResults = [...rawResults]
    .filter((p) => {
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    })
    .sort((a, b: any) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "new") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    navigate(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (catId: string) => {
    const params = new URLSearchParams(searchParams);
    if (catId === "all") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    navigate(`/search?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder" as TranslationKey)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all bg-gray-50"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/20 transition-all text-base active:scale-95"
            >
              {t("search" as TranslationKey)}
            </button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-28">
              <h3 className="font-bold text-gray-900 mb-5 text-xs uppercase tracking-widest border-b border-gray-100 pb-2">
                {t("filterByCategory" as TranslationKey)}
              </h3>
              <div className="space-y-1.5">
                {staticCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all group relative overflow-hidden ${
                      selectedCategory === cat.id
                        ? "bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <span className="relative z-10">{t(cat.labelKey as TranslationKey)}</span>
                  </button>
                ))}
              </div>

              <div className="mt-10">
                <h3 className="font-bold text-gray-900 mb-5 text-xs uppercase tracking-widest border-b border-gray-100 pb-2">
                  {t("priceRange" as TranslationKey)}
                </h3>
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₼</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 bg-gray-50"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₼</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">{isLoading ? "..." : filteredResults.length}</span>{" "}
                  {t("searchResults" as TranslationKey)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="md:hidden flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-orange-400 transition-colors"
                >
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  <span>Filter</span>
                </button>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none text-sm font-medium border border-gray-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 bg-gray-50 cursor-pointer"
                  >
                    <option value="default">{t("sortBy" as TranslationKey)}</option>
                    <option value="price-asc">{t("sortByPrice" as TranslationKey)} ↑</option>
                    <option value="price-desc">{t("sortByPrice" as TranslationKey)} ↓</option>
                    <option value="rating">{t("sortByRating" as TranslationKey)}</option>
                    <option value="new">{t("sortByNew" as TranslationKey)}</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-80"></div>
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("noResults" as TranslationKey)}</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Axtarış meyarlarını dəyişdirərək yenidən yoxlayın</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResults.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Yüklənir...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
