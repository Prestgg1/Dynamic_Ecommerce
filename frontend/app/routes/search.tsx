"use client";
import { useState, Suspense, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import { trpc } from "~/lib/trpc";
import { categories as staticCategories } from "~/lib/data";
import ProductCard from "~/components/ProductCard";
import type { TranslationKey } from "~/lib/translations";
import { useDebounce } from "~/hooks/useDebounce";

// --- Types ---
type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "new";

interface FilterState {
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
}

// --- Sub-components ---
function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  filters,
  onFilterChange,
}: {
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <aside className="hidden md:block w-72 flex-shrink-0">
      <div className="bg-[#13223f] border border-white/10 rounded-3xl p-8 sticky top-28 shadow-xl">
        <section className="mb-12">
          <h3 className="font-black text-[#22d3ee] mb-6 text-xs uppercase tracking-[0.2em] border-b border-white/10 pb-4">
            {t("filterByCategory" as TranslationKey)}
          </h3>
          <div className="space-y-2">
            {staticCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl text-sm transition-all duration-300 relative overflow-hidden group ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/30"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="relative z-10">
                  {t(cat.labelKey as TranslationKey)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-black text-[#22d3ee] mb-6 text-xs uppercase tracking-[0.2em] border-b border-white/10 pb-4">
            {t("priceRange" as TranslationKey)}
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">
                ₼
              </span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-[#0a1428] border border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#22d3ee] transition-all placeholder:text-zinc-500"
              />
            </div>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">
                ₼
              </span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-[#0a1428] border border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#22d3ee] transition-all placeholder:text-zinc-500"
              />
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}

/**
 * Main search results content
 */
function SearchContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  // URL state
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";

  // Local state
  const [localQuery, setLocalQuery] = useState(queryParam);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    sortBy: "default",
  });

  // Sync with URL
  useEffect(() => {
    setLocalQuery(queryParam);
  }, [queryParam]);

  // Debounced search
  const navigateWithDebounce = useDebounce((q: string) => {
    const params = new URLSearchParams(searchParams);
    if (q) params.set("q", q);
    else params.delete("q");
    setSearchParams(params, { replace: true });
  }, 400);

  const handleQueryChange = (val: string) => {
    setLocalQuery(val);
    navigateWithDebounce(val);
  };

  const handleCategoryChange = useCallback(
    (catId: string) => {
      const params = new URLSearchParams(searchParams);
      if (catId === "all") params.delete("category");
      else params.set("category", catId);
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Backend Query
  const { data: productsData, isLoading } = trpc.useQuery("get", "/products", {
    params: {
      query: {
        categoryId:
          categoryParam === "all" ? undefined : (categoryParam as any),
        q: queryParam || undefined,
      },
    },
  });

  // Client-side filtering & sorting
  const results = useMemo(() => {
    if (!productsData) return [];

    return [...productsData]
      .filter((p) => {
        const price = Number(p.price);
        if (filters.minPrice && price < Number(filters.minPrice)) return false;
        if (filters.maxPrice && price > Number(filters.maxPrice)) return false;
        return true;
      })
      .sort((a, b) => {
        const aPrice = Number(a.price);
        const bPrice = Number(b.price);

        switch (filters.sortBy) {
          case "price-asc":
            return aPrice - bPrice;
          case "price-desc":
            return bPrice - aPrice;
          case "rating":
            return (Number(b.rating) || 0) - (Number(a.rating) || 0);
          case "new":
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          default:
            return 0;
        }
      });
  }, [productsData, filters]);

  return (
    <main className="min-h-screen bg-[#0a1428] text-white pt-24 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Search Bar Area - Premium Blue Style */}
        <section className="relative bg-[#13223f] border border-white/10 rounded-3xl shadow-2xl p-10 mb-16 overflow-hidden">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#22d3ee]/5 rounded-full blur-3xl -mr-40 -mt-40" />

          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tighter mb-10 flex items-center gap-4">
              Məhsul Axtarışı
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            </h1>

            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#22d3ee] transition-colors">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={localQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={t("searchPlaceholder" as TranslationKey)}
                className="w-full pl-20 pr-8 py-6 bg-[#0a1428] border border-white/10 rounded-3xl text-xl font-medium placeholder:text-zinc-500 focus:outline-none focus:border-[#22d3ee] transition-all"
              />
              {isLoading && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Filters Sidebar */}
          <FilterSidebar
            selectedCategory={categoryParam}
            onCategoryChange={handleCategoryChange}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Results Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <header className="flex flex-wrap items-center justify-between gap-6 mb-10 bg-[#13223f]/80 backdrop-blur-lg border border-white/10 p-6 rounded-3xl sticky top-24 z-30">
              <div className="flex items-center gap-4 pl-2">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                  {t("searchResults" as TranslationKey)}
                </span>
                <div className="h-5 w-px bg-white/10" />
                <span className="text-2xl font-bold text-white">
                  {results.length}
                </span>
              </div>

              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange("sortBy", e.target.value as SortOption)
                  }
                  className="appearance-none bg-[#0a1428] border border-white/10 text-sm font-medium px-6 py-4 pr-12 rounded-2xl focus:outline-none focus:border-[#22d3ee] cursor-pointer transition-all"
                >
                  <option value="default">
                    {t("sortBy" as TranslationKey)}
                  </option>
                  <option value="price-asc">
                    {t("sortByPrice" as TranslationKey)} ↑
                  </option>
                  <option value="price-desc">
                    {t("sortByPrice" as TranslationKey)} ↓
                  </option>
                  <option value="rating">
                    {t("sortByRating" as TranslationKey)}
                  </option>
                  <option value="new">
                    {t("sortByNew" as TranslationKey)}
                  </option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </header>

            {/* Product Grid */}
            <div className="relative">
              {isLoading && results.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-[#13223f] border border-white/10 rounded-3xl h-96 animate-pulse"
                    />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="bg-[#13223f] border border-white/10 rounded-3xl p-20 text-center">
                  <div className="w-28 h-28 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-10">
                    <svg
                      className="w-16 h-16 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    {t("noResults" as TranslationKey)}
                  </h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    Axtarışınıza uyğun heç bir məhsul tapılmadı. Zəhmət olmasa
                    başqa sözlərlə cəhd edin və ya filtrləri təmizləyin.
                  </p>
                  <button
                    onClick={() => {
                      setLocalQuery("");
                      handleCategoryChange("all");
                      setFilters({
                        minPrice: "",
                        maxPrice: "",
                        sortBy: "default",
                      });
                    }}
                    className="mt-10 px-12 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all active:scale-95"
                  >
                    Filtrləri sıfırla
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Main Page Component ---
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a1428] flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-xs">
              Axtarılır...
            </p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
