import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, NavLink, Form } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import { trpc } from "~/lib/trpc";
import { useAuthStore } from "~/store/auth.store";
import { useCartStore } from "~/store/cart.store";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { mutate: logoutServer } = trpc.useMutation('post', '/auth/logout');
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);


  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const cartCount = useCartStore((s) => s.items.reduce((acc, item) => acc + item.quantity, 0));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current &&!langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
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

  const langFlags = { az: "🇦🇿", ru: "🇷🇺", en: "🇬🇧" } as const;
  const langLabels = { az: "AZ", ru: "RU", en: "EN" } as const;

  const shippingBanner = {
    az: "Pulsuz çatdırılma - 50 AZN-dən yuxarı sifarişlərə!",
    ru: "Бесплатная доставка при заказе от 50 AZN!",
    en: "Free shipping on orders over 50 AZN!",
  } as const;

  const navLinks = [
    { to: "/", key: "home" as TranslationKey },
    { to: "/search", key: "products" as TranslationKey },
    { to: "/about", key: "about" as TranslationKey },
    { to: "/services", key: "services" as TranslationKey },
    { to: "/contact", key: "contactUs" as TranslationKey },
  ];

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div className="bg-orange-600 text-white text-xs text-center py-1.5 px-4 hidden sm:block">
        <span className="font-medium">{shippingBanner[language]}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center gap-4 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="bg-orange-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-all duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
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
              <p className="text- text-orange-500 font-bold uppercase tracking-widest leading-none mt-0.5">
                Premium Tools
              </p>
            </div>
          </Link>

          {/* Search bar - RRv7 Form component, no onSubmit, no FormEvent */}
          <Form
            method="get"
            action="/search"
            className="flex-1 flex items-center bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 focus-within:border-orange-500/50 transition-all duration-300 group ml-2"
          >
            <input
              type="text"
              name="q"
              defaultValue={new URLSearchParams(location.search).get("q")?? ""}
              placeholder={t("searchPlaceholder")}
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
          </Form>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0 ml-2">
            {/* Language switch */}
            <div ref={langRef} className="relative hidden md:block">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all text-sm font-bold border border-transparent hover:border-white/10"
              >
                <span className="text-xl">{langFlags[language]}</span>
                <span className="text-xs text-gray-400 uppercase tracking-tighter">
                  {langLabels[language]}
                </span>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                  {(["az", "ru", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-5 py-2.5 text-sm transition-all ${
                        language === lang
                        ? "bg-orange-500 text-white font-bold"
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

            {/* Profile */}
            <div ref={profileRef} className="relative">
              {user? (
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/20">
                    {user?.avatarUrl? (
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
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white truncate max-w- leading-tight">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text- text-gray-400 font-medium">Hesabım</p>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 hidden lg:block transition-transform duration-300 ${
                      profileDropdownOpen? "rotate-180" : ""
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
              ) : (
                <Link
                  to="/auth/login"
                  className="flex flex-col items-center p-2 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
              )}

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
                          d="M4.318 6.318a4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 0 00-6.364 0z"
                        />
                      </svg>
                      İstək siyahısı
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        logoutServer();
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

            {/* Cart icons */}
            <div className="flex items-center gap-1">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364L12 7.636l-1.318-1.318a4.5 0 00-6.364 0z"
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
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all"
            >
              <svg
                className="w-6 h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen? (
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
        <nav className="hidden lg:flex items-center gap-8 py-3 border-t border-white/5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-bold transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-500 after:transition-all ${
                  isActive
                  ? "text-orange-500 after:w-full"
                    : "text-gray-400 hover:text-orange-500 after:w-0 hover:after:w-full"
                }`
              }
            >
              {(link as any).key ? t((link as any).key) : (link as any).label}
            </NavLink>
          ))}


          {!user && (
            <Link
              to="/auth/register"
              className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-black text-xs tracking-tight transition-all active:scale-95 shadow-lg shadow-orange-500/20"
            >
              QEYDİYYAT
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-gray-950/80 backdrop-blur-sm transition-all duration-500 lg:hidden ${
          mobileMenuOpen? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      <div
        className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-gray-900 shadow-2xl z-100 transform transition-transform duration-500 ease-out lg:hidden p-6 ${
          mobileMenuOpen? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="font-extrabold text-xl text-orange-500">MENYU</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl bg-white/5 text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {user && (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 mb-6 border border-white/5">
            <img
              src={
                user?.avatarUrl
                ? user.avatarUrl.startsWith("http")
                  ? user.avatarUrl
                    : `http://localhost:4000${user.avatarUrl}`
                  : `https://ui-avatars.com/api/?background=f97316&color=fff&name=${encodeURIComponent(
                      user?.fullName || "User"
                    )}`
              }
              className="w-12 h-12 rounded-full border-2 border-orange-500 object-cover"
              alt={user?.fullName || "User"}
            />
            <div>
              <p className="font-bold text-white leading-tight">{user?.fullName || "User"}</p>
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

        <nav className="flex flex-col gap-2">
          {[
            { to: "/", key: "home" as TranslationKey },
            { to: "/search", key: "products" as TranslationKey },
            { to: "/about", key: "about" as TranslationKey },
            { to: "/profile", key: "profile" as TranslationKey, auth: true },
            { to: "/auth/login", key: "login" as TranslationKey, guest: true },
          ].map(
            (link, i) =>
              ((!link.auth &&!link.guest) || (link.auth && user) || (link.guest &&!user)) && (
                <NavLink
                  key={i}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-5 py-4 rounded-2xl text-base font-extrabold transition-all border ${
                      isActive
                      ? "bg-orange-500/20 text-orange-500 border-orange-500/50"
                        : "text-gray-300 hover:bg-white/5 hover:text-orange-500 border-transparent hover:border-white/5"
                    }`
                  }
                >
                  {t(link.key)}
                </NavLink>
              )
          )}
          {user && (
            <button
              onClick={() => {
                logout();
                logoutServer();
                setMobileMenuOpen(false);
              }}
              className="px-5 py-4 rounded-2xl text-base font-extrabold text-red-500 hover:bg-red-500/10 transition-all text-left"
            >
              ÇIXIŞ
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}