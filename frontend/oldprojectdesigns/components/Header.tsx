"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Language } from "@/lib/translations";
import { categories } from "@/lib/data";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { wishlist } = useWishlist();
  const { cartCount } = useCart();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const { cart, removeFromCart } = useCart();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartDropdownOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams({ q: searchQuery });
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    router.push(`/search?${params.toString()}`);
  };

  const langFlags: Record<Language, string> = {
    az: "🇦🇿",
    ru: "🇷🇺",
    en: "🇬🇧",
  };

  const langLabels: Record<Language, string> = {
    az: "AZ",
    ru: "RU",
    en: "EN",
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div className="bg-orange-600 text-white text-xs text-center py-1 px-4">
        <span className="font-medium">
          {language === "az" && "Pulsuz çatdırılma - 50 AZN-dən yuxarı sifarişlərə!"}
          {language === "ru" && "Бесплатная доставка при заказе от 50 AZN!"}
          {language === "en" && "Free shipping on orders over 50 AZN!"}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center gap-3 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-orange-500 p-2 rounded-lg">
              {/* Wrench + gear icon */}
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-orange-400">DəmirMart</span>
              <p className="text-[10px] text-gray-400 leading-none">Iron &amp; Metal Store</p>
            </div>
          </Link>

          {/* Category dropdown + Search bar */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white rounded-lg overflow-hidden shadow">
            {/* Category selector */}
            <div ref={catRef} className="relative flex-shrink-0 hidden md:block">
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 px-3 py-2.5 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors border-r border-gray-200 h-full"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span className="text-gray-600 max-w-[80px] truncate">
                  {selectedCategory === "all"
                    ? t("allCategories")
                    : t(`cat_${selectedCategory}` as Parameters<typeof t>[0])}
                </span>
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-48 py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCategoriesOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors ${
                        selectedCategory === cat.id ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      {t(cat.labelKey as Parameters<typeof t>[0])}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 px-3 py-2.5 text-gray-800 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-white transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Language switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <span className="text-lg">{langFlags[language]}</span>
                <span className="hidden sm:inline text-xs">{langLabels[language]}</span>
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  {(["az", "ru", "en"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${
                        language === lang ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      <span className="text-base">{langFlags[lang]}</span>
                      <span>{langLabels[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <svg className="w-6 h-6 text-gray-300 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlist.length > 9 ? "9+" : wishlist.length}
                </span>
              )}
              <span className="hidden sm:block text-[10px] text-gray-400 mt-0.5">{t("wishlist")}</span>
            </Link>

            {/* Cart */}
            <div ref={cartRef} className="relative">
              <button
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                className="relative flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 transition-colors group"
              >
                <svg className="w-6 h-6 text-gray-300 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
                <span className="hidden sm:block text-[10px] text-gray-400 mt-0.5">{t("cart")}</span>
              </button>

              {/* Cart mini dropdown */}
              {cartDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-80">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm">{t("cartTitle")}</h3>
                  </div>
                  {cart.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">{t("emptyCart")}</div>
                  ) : (
                    <>
                      <div className="max-h-60 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 border-b border-gray-50 hover:bg-gray-50">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 font-medium truncate">{item.name}</p>
                              <p className="text-xs text-orange-600 font-semibold">{item.price} AZN x{item.quantity}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                          {t("checkout")}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Login / Register */}
            <div className="hidden sm:flex items-center gap-1">
              <Link
                href="/login"
                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 transition-colors group"
              >
                <svg className="w-6 h-6 text-gray-300 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[10px] text-gray-400 mt-0.5">{t("login")}</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Nav bar */}
        <nav className="hidden sm:flex items-center gap-6 pb-2 text-sm border-t border-gray-800 pt-2">
          <Link href="/" className="text-gray-300 hover:text-orange-400 transition-colors font-medium">{t("home")}</Link>
          <Link href="/search" className="text-gray-300 hover:text-orange-400 transition-colors">{t("categories")}</Link>
          <Link href="/about" className="text-gray-300 hover:text-orange-400 transition-colors">{t("about")}</Link>
          <Link href="/wishlist" className="text-gray-300 hover:text-orange-400 transition-colors">{t("wishlist")}</Link>
          <Link href="/register" className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors text-xs">
            {t("register")}
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-gray-800 border-t border-gray-700 px-4 py-3">
          <nav className="flex flex-col gap-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-orange-400 transition-colors">{t("home")}</Link>
            <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-orange-400 transition-colors">{t("categories")}</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-orange-400 transition-colors">{t("about")}</Link>
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-orange-400 transition-colors">{t("wishlist")}</Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-orange-400 transition-colors">{t("login")}</Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-center">{t("register")}</Link>
          </nav>
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="mt-3 flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 px-3 py-2 rounded-lg text-gray-800 text-sm"
            />
            <button type="submit" className="bg-orange-500 px-3 py-2 rounded-lg text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
