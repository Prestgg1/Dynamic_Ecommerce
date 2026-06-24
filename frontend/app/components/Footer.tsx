import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import { fetchSiteSettings, type SiteSettings } from "~/lib/site-settings";

export default function Footer() {
  const { t } = useLanguage();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSiteSettings)
      .catch(() => undefined);
  }, []);

  const data = siteSettings?.data;
  const social = data?.socialLinks ?? {};

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-lg bg-orange-500 p-2">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-orange-400">
                {data?.logoText ?? "MetaLoft"}
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              {t("footerTagline" as TranslationKey)}
            </p>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {t("followUs" as TranslationKey)}
            </p>
            <div className="mt-2 flex gap-3">
              <a href={social.instagram || "#"} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-pink-600">
                IG
              </a>
              <a href={social.tiktok || "#"} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-black">
                TT
              </a>
              <a href={social.whatsapp || "#"} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-green-600">
                WA
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              {t("quickLinks" as TranslationKey)}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="transition-colors hover:text-orange-400">{t("home" as TranslationKey)}</Link></li>
              <li><Link to="/search" className="transition-colors hover:text-orange-400">{t("categories" as TranslationKey)}</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-orange-400">{t("about" as TranslationKey)}</Link></li>
              <li><Link to="/wishlist" className="transition-colors hover:text-orange-400">{t("wishlist" as TranslationKey)}</Link></li>
              <li><Link to="/auth/login" className="transition-colors hover:text-orange-400">{t("login" as TranslationKey)}</Link></li>
              <li><Link to="/auth/register" className="transition-colors hover:text-orange-400">{t("register" as TranslationKey)}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              {t("categories" as TranslationKey)}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search?category=tools" className="transition-colors hover:text-orange-400">{t("cat_tools" as TranslationKey)}</Link></li>
              <li><Link to="/search?category=hardware" className="transition-colors hover:text-orange-400">{t("cat_hardware" as TranslationKey)}</Link></li>
              <li><Link to="/search?category=pipes" className="transition-colors hover:text-orange-400">{t("cat_pipes" as TranslationKey)}</Link></li>
              <li><Link to="/search?category=fasteners" className="transition-colors hover:text-orange-400">{t("cat_fasteners" as TranslationKey)}</Link></li>
              <li><Link to="/search?category=electrical" className="transition-colors hover:text-orange-400">{t("cat_electrical" as TranslationKey)}</Link></li>
              <li><Link to="/search?category=welding" className="transition-colors hover:text-orange-400">{t("cat_welding" as TranslationKey)}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              {t("contactUs" as TranslationKey)}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-orange-400">⌁</span>
                <span className="text-gray-400">{data?.address ?? "Bakı, Azərbaycan"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400">☎</span>
                <span className="text-gray-400">{data?.displayPhone ?? "+994 50 123 45 67"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400">✉</span>
                <span className="text-gray-400">{data?.email ?? "info@demirmart.az"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400">◷</span>
                <span className="text-gray-400">{data?.workingHours ?? "09:00 - 18:00"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-gray-500 sm:flex-row">
          <p>© 2026 {data?.logoText ?? "MetaLoft"}. {t("allRightsReserved" as TranslationKey)}.</p>
          <p>{data?.footerPreparedBy ?? "Devit Group tərəfindən hazırlanıb"}</p>
        </div>
      </div>
    </footer>
  );
}
