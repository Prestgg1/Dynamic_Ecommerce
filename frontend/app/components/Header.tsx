import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import { useAuthStore } from "~/store/auth.store";

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (authRef.current && !authRef.current.contains(e.target as Node)) {
        setAuthDropdownOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  const langLabels = { az: "AZ", ru: "RU", en: "EN" };
  const langNames = { az: "Azərbaycanca", ru: "Русский", en: "English" };

  const shippingBanner = {
    az: "Pulsuz çatdırılma - 50 AZN-dən yuxarı sifarişlərə!",
    ru: "Бесплатная доставка при заказе от 50 AZN!",
    en: "Free shipping on orders over 50 AZN!",
  };

  const authLabels = {
    az: { login: "Daxil ol", register: "Qeydiyyatdan keç" },
    ru: { login: "Войти", register: "Зарегистрироваться" },
    en: { login: "Sign In", register: "Sign Up" },
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div className="bg-orange-600 text-white text-xs text-center py-1.5 px-4 hidden sm:block">
        <span className="font-medium">{shippingBanner[language]}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center gap-3 md:gap-4 py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="bg-orange-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-all duration-300">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="hidden lg:block">
              <span className="font-extrabold text-2xl tracking-tighter text-white">
                DəmirMart
              </span>
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest leading-none mt-0.5">
                Premium Tools
              </p>
            </div>
          </Link>

          {/* Search bar - Desktop only */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 items-center bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 focus-within:border-orange-500/50 transition-all duration-300"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder" as TranslationKey)}
              className="flex-1 px-5 py-3 text-white text-sm outline-none bg-transparent placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-3 text-orange-500 hover:text-white hover:bg-orange-500 transition-all duration-300 flex-shrink-0"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-auto">
            {/* Language switch - Desktop only */}
            <div ref={langRef} className="relative hidden md:block">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all text-sm font-bold border border-transparent hover:border-white/10"
              >
                <span className="text-xs text-gray-400 uppercase tracking-tighter">
                  {langLabels[language]}
                </span>
                <svg
                  className={`w-3 h-3 text-gray-400 transition-transform ${
                    langDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden w-48">
                  <div className="p-2">
                    {(["az", "ru", "en"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setLangDropdownOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-all ${
                          language === lang
                            ? "bg-orange-500 text-white font-bold"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <span>{langNames[lang]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile - Desktop */}
            <div ref={profileRef} className="relative hidden md:block">
              {user ? (
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/20">
                    {user?.avatarUrl ? (
                      <img
                        src={
                          user.avatarUrl.startsWith("http")
                            ? user.avatarUrl
                            : `http://localhost:4000${user.avatarUrl}`
                        }
                        alt={user?.fullName || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white font-black text-sm">
                        {user?.fullName?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              ) : null}

              {profileDropdownOpen && user && (
                <div className="absolute right-0 top-full mt-3 bg-gray-800 border border-white/10 rounded-2xl shadow-2xl z-50 w-64 overflow-hidden backdrop-blur-xl">
                  <div className="p-5 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                    <p className="text-sm font-black text-white">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {user?.email || "No email"}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-orange-400 transition-all"
                    >
                      <svg
                        className="w-5 h-5 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profil Bilgiləri
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-orange-400 transition-all"
                    >
                      <svg
                        className="w-5 h-5 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      İstək siyahısı
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all mt-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Çıxış
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart & Wishlist icons */}
            <Link
              to="/wishlist"
              className="p-2 hover:bg-white/5 rounded-xl transition-all relative group hidden sm:block"
            >
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>
            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-white/5 rounded-xl transition-all relative group"
            >
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all"
            >
              <svg
                className="w-6 h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center justify-between gap-8 py-3 border-t border-white/10">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-bold text-orange-500 uppercase tracking-tight hover:text-orange-400 transition-all"
            >
              ANA SƏHİFƏ
            </Link>
            <Link
              to="/search"
              className="text-sm font-bold text-gray-300 uppercase tracking-tight hover:text-orange-500 transition-all"
            >
              MƏHSULLAR
            </Link>
            <Link
              to="/about"
              className="text-sm font-bold text-gray-300 uppercase tracking-tight hover:text-orange-500 transition-all"
            >
              HAQQIMIZDA
            </Link>
            <Link
              to="/services"
              className="text-sm font-bold text-gray-300 uppercase tracking-tight hover:text-orange-500 transition-all"
            >
              XİDMƏTLƏR
            </Link>
            <Link
              to="/contact"
              className="text-sm font-bold text-gray-300 uppercase tracking-tight hover:text-orange-500 transition-all"
            >
              ƏLAQƏ
            </Link>
          </div>
          {!user && (
            <Link
              to="/auth/register"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-black text-xs tracking-tight transition-all active:scale-95 shadow-lg shadow-orange-500/20"
            >
              ALIŞ-SATIŞ PORTAL
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-gray-950/80 backdrop-blur-sm transition-all duration-500 md:hidden ${
          mobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      <div
        className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-gray-900 shadow-2xl z-[100] transform transition-transform duration-500 ease-out md:hidden p-6 overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="font-extrabold text-xl text-orange-500">MENYU</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        <form
          onSubmit={(e) => {
            handleSearch(e);
            setMobileMenuOpen(false);
          }}
          className="mb-6"
        >
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 focus-within:border-orange-500/50 transition-all">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder" as TranslationKey)}
              className="flex-1 px-4 py-2.5 text-white text-sm outline-none bg-transparent placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 text-orange-500 hover:text-white hover:bg-orange-500 transition-all"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        </form>

        {/* Language Select */}
        <div className="mb-6 pb-6 border-b border-white/10">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Dil
          </p>
          <div className="flex gap-2">
            {(["az", "ru", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  language === lang
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {langLabels[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 mb-6 border border-white/5">
            <img
              src={
                user?.avatarUrl
                  ? user.avatarUrl.startsWith("http")
                    ? user.avatarUrl
                    : `http://localhost:4000${user.avatarUrl}`
                  : `https://ui-avatars.com/api/?background=f97316&color=fff&name=${encodeURIComponent(
                      user?.fullName || "User",
                    )}`
              }
              className="w-12 h-12 rounded-full border-2 border-orange-500 object-cover"
              alt={user?.fullName || "User"}
            />
            <div>
              <p className="font-bold text-white leading-tight">
                {user?.fullName || "User"}
              </p>
              <button
                onClick={() => {
                  navigate("/profile");
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-orange-500 font-bold hover:underline"
              >
                Profilə bax
              </button>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 mb-6 pb-6 border-b border-white/10">
          {[
            { to: "/", label: "ANA SƏHİFƏ" },
            { to: "/search", label: "MƏHSULLAR" },
            { to: "/about", label: "HAQQIMIZDA" },
            { to: "/services", label: "XİDMƏTLƏR" },
            { to: "/contact", label: "ƏLAQƏ" },
            { to: "/profile", label: "HESABIM", auth: true },
          ].map(
            (link, i) =>
              ((!link.auth && !link.guest) || (link.auth && user)) && (
                <Link
                  key={i}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-orange-500 transition-all"
                >
                  {link.label}
                </Link>
              ),
          )}
        </nav>

        {/* Auth Section */}
        {!user ? (
          <div className="space-y-2">
            <Link
              to="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              {authLabels[language].login}
            </Link>
            <Link
              to="/auth/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-500/20"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              {authLabels[language].register}
            </Link>
          </div>
        ) : (
          <button
            onClick={() => {
              logout();
              setMobileMenuOpen(false);
            }}
            className="w-full px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold transition-all flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            ÇIXIŞ
          </button>
        )}
      </div>
    </header>
  );
}
