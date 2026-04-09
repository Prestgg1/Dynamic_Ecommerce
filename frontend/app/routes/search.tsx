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

/**
 * Sidebar for categories and price filters
 */
function FilterSidebar({ 
  selectedCategory, 
  onCategoryChange, 
  filters, 
  onFilterChange 
}: { 
  selectedCategory: string; 
  onCategoryChange: (id: string) => void;
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <aside className="hidden md:block w-64 flex-shrink-0">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-28">
        <section className="mb-10">
          <h3 className="font-black text-gray-900 mb-5 text-[10px] uppercase tracking-[0.2em] border-b border-gray-50 pb-3">
            {t("filterByCategory" as TranslationKey)}
          </h3>
          <div className="space-y-1.5">
            {staticCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all relative overflow-hidden group ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/30"
                    : "text-gray-500 hover:bg-orange-50 hover:text-orange-600 font-medium"
                }`}
              >
                <span className="relative z-10">{t(cat.labelKey as TranslationKey)}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-black text-gray-900 mb-5 text-[10px] uppercase tracking-[0.2em] border-b border-gray-50 pb-3">
            {t("priceRange" as TranslationKey)}
          </h3>
          <div className="space-y-3">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₼</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all bg-gray-50 placeholder:text-gray-300"
              />
            </div>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₼</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all bg-gray-50 placeholder:text-gray-300"
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

  // Local state for UI responsiveness
  const [localQuery, setLocalQuery] = useState(queryParam);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    sortBy: "default",
  });

  // Sync state with URL when needed
  useEffect(() => {
    setLocalQuery(queryParam);
  }, [queryParam]);

  // --- Search Logic ---

  // Debounced navigation/param update
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

  const handleCategoryChange = useCallback((catId: string) => {
    const params = new URLSearchParams(searchParams);
    if (catId === "all") params.delete("category");
    else params.set("category", catId);
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // --- Backend Query ---
  const { data: productsData, isLoading } = trpc.useQuery("get", "/products", {
    params: {
      query: {
        categoryId: categoryParam === "all" ? undefined : (categoryParam as any),
        q: queryParam || undefined,
      },
    },
  });

  // --- Client-side filtering & sorting ---
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
          case "price-asc": return aPrice - bPrice;
          case "price-desc": return bPrice - aPrice;
          case "rating": return (Number(b.rating) || 0) - (Number(a.rating) || 0);
          case "new": return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          default: return 0;
        }
      });
  }, [productsData, filters]);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Search Bar Area */}
        <section className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 mb-12 border border-gray-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-40 transition-all group-hover:scale-110"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
              Məhsul Axtarışı
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            </h1>
            
            <div className="relative flex items-center">
              <div className="absolute left-6 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={localQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={t("searchPlaceholder" as TranslationKey)}
                className="w-full pl-16 pr-6 py-5.5 bg-gray-50 border border-gray-100 rounded-3xl text-lg font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all shadow-inner"
              />
              {isLoading && (
                <div className="absolute right-6">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-10">
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
            <header className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-gray-100 sticky top-24 z-20">
              <div className="flex items-center gap-3 pl-2">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{t("searchResults" as TranslationKey)}</span>
                <div className="h-4 w-px bg-gray-200"></div>
                <span className="text-lg font-black text-gray-900">{results.length}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative h-full group">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value as SortOption)}
                    className="appearance-none h-full text-xs font-black uppercase tracking-widest text-gray-700 bg-white border border-gray-100 rounded-2xl pl-5 pr-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 cursor-pointer shadow-sm group-hover:shadow-md transition-all outline-none"
                  >
                    <option value="default">{t("sortBy" as TranslationKey)}</option>
                    <option value="price-asc">{t("sortByPrice" as TranslationKey)} ↑</option>
                    <option value="price-desc">{t("sortByPrice" as TranslationKey)} ↓</option>
                    <option value="rating">{t("sortByRating" as TranslationKey)}</option>
                    <option value="new">{t("sortByNew" as TranslationKey)}</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-orange-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </header>

            {/* Product Rendering */}
            <div className="relative">
              {isLoading && results.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-6 h-96 animate-pulse border border-gray-100 shadow-sm" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100 shadow-xl shadow-gray-200/50">
                  <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg">
                    <svg className="w-14 h-14 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">{t("noResults" as TranslationKey)}</h3>
                  <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                    Axtarışınıza uyğun heç bir məhsul tapılmadı. Zəhmət olmasa başqa sözlərlə cəhd edin və ya filtrləri təmizləyin.
                  </p>
                  <button 
                    onClick={() => {
                        setLocalQuery("");
                        handleCategoryChange("all");
                        setFilters({ minPrice: "", maxPrice: "", sortBy: "default" });
                    }}
                    className="mt-10 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black transition-all hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95"
                  >
                    Filtrləri sıfırla
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-xl"></div>
            <p className="text-gray-900 font-black uppercase tracking-[0.3em] animate-pulse text-xs">Axtarılır...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
