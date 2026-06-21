"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import { trpc } from "~/lib/trpc";
import { useAuthStore } from "~/store/auth.store";
import { useCartStore } from "~/store/cart.store";
import { fetchSiteSettings, type SiteSettings } from "~/lib/site-settings";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { mutate: logoutServer } = trpc.useMutation("post", "/auth/logout");
  const { language, setLanguage, t } = useLanguage();
  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, item) => acc + item.quantity, 0),
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchPopupOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;
    fetchSiteSettings()
      .then((settings) => {
        if (mounted) setSiteSettings(settings);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const langFlags = { az: "🇦🇿", ru: "🇷🇺", en: "🇬🇧" } as const;
  const langLabels = { az: "AZ", ru: "RU", en: "EN" } as const;

  const bannerText =
    siteSettings?.data.bannerText ??
    ({
      az: "Pulsuz çatdırılma - 50 AZN-dən yuxarı sifarişlərə!",
      ru: "Бесплатная доставка при заказе от 50 AZN!",
      en: "Free shipping on orders over 50 AZN!",
    } as const)[language];

  const brandName = siteSettings?.data.logoText ?? "DəmirMart";
  const brandSlogan = siteSettings?.data.logoSlogan ?? "Metal məhsullar";
  const whatsappNumber = siteSettings?.data.whatsappNumber ?? "994501234567";

  const navLinks = [
    { to: "/", key: "home" as TranslationKey },
    { to: "/search", key: "products" as TranslationKey },
    { to: "/about", key: "about" as TranslationKey },
    { to: "/services", key: "services" as TranslationKey },
    { to: "/contact", key: "contactUs" as TranslationKey },
  ];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    setSearchPopupOpen(false);
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
        <div className="bg-orange-600 px-4 py-1.5 text-center text-xs font-medium hidden sm:block">
          {bannerText}
        </div>

        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 py-4 lg:gap-4">
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="rounded-xl bg-orange-500 p-2 shadow-lg shadow-orange-500/20 transition-transform duration-300 group-hover:scale-110">
                <img src="../logo.png" alt={brandName} className="h-10 w-10" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-extrabold tracking-tighter text-white lg:text-2xl">
                  {brandName}
                </span>
                <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-orange-500 lg:text-sm">
                  {brandSlogan}
                </p>
              </div>
            </Link>

            <div ref={searchRef} className="relative ml-2">
              <button
                type="button"
                onClick={() => setSearchPopupOpen((prev) => !prev)}
                className="hidden md:inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-gray-200 transition-all duration-300 hover:border-orange-500/50"
              >
                <svg
                  className="h-5 w-5 text-orange-400"
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
                <span>{t("searchName" as TranslationKey)}</span>
              </button>

              {searchPopupOpen && (
                <div className="absolute left-0 top-full z-50 mt-3 w-[min(92vw,32rem)] overflow-hidden rounded-3xl border border-white/10 bg-[#0f172a] shadow-2xl">
                  <form onSubmit={handleSearchSubmit} className="p-4">
                    <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-gray-400">
                      {t("searchPlaceholder" as TranslationKey)}
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        autoFocus
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={t("searchPlaceholder" as TranslationKey)}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                      >
                        OK
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {["tools", "hardware", "pipes", "fasteners"].map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setSearchPopupOpen(false);
                            navigate(`/search?category=${category}`);
                          }}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-orange-500 hover:text-orange-400"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </form>
                </div>
              )}

              <button
                onClick={() => setSearchPopupOpen((prev) => !prev)}
                className="mt-0 rounded-xl border border-white/10 bg-white/5 p-2.5 transition-all hover:border-orange-500/50 md:hidden"
                aria-label="Search"
              >
                <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <div className="ml-auto flex flex-shrink-0 items-center gap-1 lg:gap-4">
              <div ref={langRef} className="relative hidden lg:block">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm font-bold transition-all hover:border-white/10 hover:bg-white/5"
                >
                  <span className="text-xl">{langFlags[language]}</span>
                  <span className="text-xs uppercase tracking-tighter text-gray-400">
                    {langLabels[language]}
                  </span>
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 min-w-max overflow-hidden rounded-xl border border-white/10 bg-gray-800 shadow-2xl backdrop-blur-xl">
                    {(["az", "ru", "en"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setLangDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-5 py-2.5 text-sm transition-all ${
                          language === lang
                            ? "bg-orange-500 font-bold text-white"
                            : "text-gray-300 hover:bg-white/5 hover:text-orange-400"
                        }`}
                      >
                        <span className="text-lg">{langFlags[lang]}</span>
                        <span>{langLabels[lang]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/wishlist"
                className="hidden rounded-xl p-2.5 transition-all hover:bg-white/5 lg:inline-flex"
              >
                <svg
                  className="h-5 w-5 text-gray-400 transition-colors group-hover:text-orange-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
              </Link>

              <button
                onClick={() => navigate("/cart")}
                className="relative rounded-xl p-2.5 transition-all hover:bg-white/5"
              >
                <svg className="h-5 w-5 text-gray-400 transition-all lg:h-6 lg:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-black text-white shadow-lg shadow-orange-500/40">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              <div ref={profileRef} className="relative hidden lg:block">
                {user ? (
                  <>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 p-1.5 pr-3 transition-all duration-300 hover:border-orange-500/50"
                    >
                      <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-orange-500 shadow-lg shadow-orange-500/20">
                        {user.avatarUrl ? (
                          <img
                            src={
                              user.avatarUrl.startsWith("http")
                                ? user.avatarUrl
                                : apiUrl(user.avatarUrl)
                            }
                            alt={user.fullName || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-orange-500 text-xs font-black text-white">
                            {user.fullName?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="max-w-[80px] truncate text-xs font-bold leading-tight text-white">
                          {user.fullName || "User"}
                        </p>
                        <p className="text-xs font-medium text-gray-400">
                          {t("account")}
                        </p>
                      </div>
                    </button>

                    {profileDropdownOpen && (
                      <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-gray-800 shadow-2xl backdrop-blur-xl">
                        <div className="border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5">
                          <p className="text-sm font-black text-white">
                            {user.fullName || "User"}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {user.email || "No email"}
                          </p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition-all hover:bg-white/5 hover:text-orange-400"
                          >
                            <span>👤</span>
                            <span>{t("profile")}</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition-all hover:bg-white/5 hover:text-orange-400"
                          >
                            <span>♡</span>
                            <span>{t("wishlist")}</span>
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              logoutServer();
                              setProfileDropdownOpen(false);
                            }}
                            className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition-all hover:bg-red-500/10"
                          >
                            <span>↩</span>
                            <span>{t("logout")}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to="/auth/login"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-300 transition-all hover:border-orange-500/50 hover:bg-white/10 hover:text-orange-500"
                  >
                    <span>👤</span>
                    <span className="hidden xl:inline">{t("login")}</span>
                  </Link>
                )}
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition-all hover:border-orange-500/50 lg:hidden"
              >
                <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <nav className="hidden items-center gap-8 border-t border-white/5 py-3 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative text-sm font-bold transition-all after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-500 after:transition-all ${
                    isActive
                      ? "text-orange-500 after:w-full"
                      : "text-gray-400 hover:text-orange-500 after:w-0 hover:after:w-full"
                  }`
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
            {!user && (
              <Link
                to="/auth/register"
                className="ml-auto rounded-xl bg-orange-500 px-5 py-2 text-xs font-black tracking-tight text-white shadow-lg shadow-orange-500/20 transition-all active:scale-95 hover:bg-orange-600"
              >
                {t("register")}
              </Link>
            )}
          </nav>
        </div>

        <div
          className={`fixed inset-0 z-40 bg-gray-950/80 backdrop-blur-sm transition-all duration-300 lg:hidden ${
            mobileMenuOpen
              ? "visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`fixed bottom-0 right-0 top-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-gray-900 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="sticky top-0 flex items-center justify-between border-b border-white/5 bg-gray-900 p-6">
            <span className="text-lg font-extrabold text-orange-500">
              {t("menu")}
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl bg-white/5 p-2 text-gray-400 transition-all hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6 p-6">
            {user && (
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[2%] p-4">
                <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-orange-500">
                  {user.avatarUrl ? (
                    <img
                      src={
                        user.avatarUrl.startsWith("http")
                          ? user.avatarUrl
                          : apiUrl(user.avatarUrl)
                      }
                      alt={user.fullName || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-orange-500 font-black text-white">
                      {user.fullName?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {user.fullName || "User"}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    {user.email || "No email"}
                  </p>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl border px-5 py-3 text-sm font-bold transition-all ${
                      isActive
                        ? "border-orange-500/50 bg-orange-500/20 text-orange-500"
                        : "border-transparent text-gray-300 hover:border-white/10 hover:bg-white/5 hover:text-orange-500"
                    }`
                  }
                >
                  {t(link.key)}
                </NavLink>
              ))}
            </nav>

            <div className="space-y-2 border-t border-white/5 pt-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                {t("language")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(["az", "ru", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-lg border px-3 py-2 text-xs font-bold transition-all ${
                      language === lang
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:text-orange-400"
                    }`}
                  >
                    <span className="mr-1">{langFlags[lang]}</span>
                    {langLabels[lang]}
                  </button>
                ))}
              </div>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-5 py-3 text-sm text-gray-300 transition-all hover:border-white/10 hover:bg-white/5 hover:text-orange-400"
                  >
                    <span>👤</span>
                    <span>{t("profile")}</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-5 py-3 text-sm text-gray-300 transition-all hover:border-white/10 hover:bg-white/5 hover:text-orange-400"
                  >
                    <span>♡</span>
                    <span>{t("wishlist")}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      logoutServer();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-2 flex w-full items-center gap-3 rounded-xl border border-transparent px-5 py-3 text-sm text-red-400 transition-all hover:border-red-500/20 hover:bg-red-500/10"
                  >
                    <span>↩</span>
                    <span>{t("logout")}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-5 py-3 text-sm text-gray-300 transition-all hover:border-white/10 hover:bg-white/5 hover:text-orange-400"
                  >
                    <span>👤</span>
                    <span>{t("login")}</span>
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-orange-600 bg-orange-500 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600"
                  >
                    <span>+</span>
                    <span>{t("register")}</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-green-500/40 transition-transform hover:scale-105"
        aria-label="WhatsApp"
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </>
  );
}
