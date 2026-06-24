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
              <a
                href={social.instagram || "#"}
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-pink-600"
              >
                <InstagramIcon />
              </a>
              <a
                href={social.tiktok || "#"}
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-black"
              >
                <TikTokIcon />
              </a>
              <a
                href={social.whatsapp || "#"}
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-green-600"
              >
                <WhatsAppIcon />
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

function InstagramIcon() {
  return (
    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth={2} />
      <circle cx="12" cy="12" r="4" strokeWidth={2} />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14.5 3c.3 2.4 1.8 4 4 4.2v2.8c-1.5.1-2.8-.3-4-1v5.8c0 3.1-2.5 5.2-5.3 5.2-3 0-5.5-2.4-5.5-5.4s2.4-5.4 5.5-5.4c.4 0 .8.1 1.1.1v2.9c-.3-.1-.7-.2-1.1-.2-1.4 0-2.6 1.1-2.6 2.6 0 1.4 1.1 2.6 2.6 2.6 1.5 0 2.8-1.1 2.8-3.1V3h2.5Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.5 11.9a8.5 8.5 0 0 1-12.4 7.5L4 20l.6-4.1A8.5 8.5 0 1 1 20.5 11.9Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.2 9.5c.2-.4.4-.4.7-.4h.6c.2 0 .5-.1.7.3l.8 1.6c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.4 0 .7.3.6.8 1.4 1.8 2.2.2.2.4.2.6.1l.7-.4c.2-.1.5-.1.7 0l1.5.7c.3.1.4.4.4.7 0 .7-.2 1.2-.7 1.5-.5.3-1 .4-1.7.2-1.4-.4-2.8-1.2-4.1-2.5s-2.1-2.7-2.5-4.1c-.2-.7-.1-1.2.2-1.7Z"
      />
    </svg>
  );
}
