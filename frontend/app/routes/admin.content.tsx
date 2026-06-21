import { useEffect, useMemo, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { fetchSiteSettings, saveSiteSettings } from "~/lib/site-settings";

type FormState = {
  brandName: string;
  logoText: string;
  logoSlogan: string;
  bannerText: string;
  whatsappNumber: string;
  displayPhone: string;
  email: string;
  address: string;
  workingHours: string;
  contactMapUrl: string;
  contactMapLink: string;
  footerPreparedBy: string;
  heroEstablished: string;
  heroSlidesJson: string;
  heroStatsJson: string;
  capabilitiesTitle: string;
  capabilitiesJson: string;
  productsTitle: string;
  productsJson: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  aboutHighlightsJson: string;
  contactTitle: string;
  contactSubtitle: string;
  contactBackgroundImage: string;
  contactButtonLabel: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
};

const defaultJson = (value: unknown) => JSON.stringify(value, null, 2);

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    brandName: "",
    logoText: "",
    logoSlogan: "",
    bannerText: "",
    whatsappNumber: "",
    displayPhone: "",
    email: "",
    address: "",
    workingHours: "",
    contactMapUrl: "",
    contactMapLink: "",
    footerPreparedBy: "",
    heroEstablished: "",
    heroSlidesJson: "[]",
    heroStatsJson: "[]",
    capabilitiesTitle: "",
    capabilitiesJson: "[]",
    productsTitle: "",
    productsJson: "[]",
    aboutTitle: "",
    aboutDescription: "",
    aboutImage: "",
    aboutHighlightsJson: "[]",
    contactTitle: "",
    contactSubtitle: "",
    contactBackgroundImage: "",
    contactButtonLabel: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
  });

  useEffect(() => {
    fetchSiteSettings()
      .then((settings) => {
        const data = settings.data;
        const home = data.home ?? {};
        setForm({
          brandName: data.brandName ?? "",
          logoText: data.logoText ?? "",
          logoSlogan: data.logoSlogan ?? "",
          bannerText: data.bannerText ?? "",
          whatsappNumber: data.whatsappNumber ?? "",
          displayPhone: data.displayPhone ?? "",
          email: data.email ?? "",
          address: data.address ?? "",
          workingHours: data.workingHours ?? "",
          contactMapUrl: data.contactMapUrl ?? "",
          contactMapLink: data.contactMapLink ?? "",
          footerPreparedBy: data.footerPreparedBy ?? "",
          heroEstablished: home.heroEstablished ?? "",
          heroSlidesJson: defaultJson(home.heroSlides ?? []),
          heroStatsJson: defaultJson(home.heroStats ?? []),
          capabilitiesTitle: home.capabilitiesTitle ?? "",
          capabilitiesJson: defaultJson(home.capabilities ?? []),
          productsTitle: home.productsTitle ?? "",
          productsJson: defaultJson(home.products ?? []),
          aboutTitle: home.aboutTitle ?? "",
          aboutDescription: home.aboutDescription ?? "",
          aboutImage: home.aboutImage ?? "",
          aboutHighlightsJson: defaultJson(home.aboutHighlights ?? []),
          contactTitle: home.contactTitle ?? "",
          contactSubtitle: home.contactSubtitle ?? "",
          contactBackgroundImage: home.contactBackgroundImage ?? "",
          contactButtonLabel: home.contactButtonLabel ?? "",
          instagram: data.socialLinks?.instagram ?? "",
          tiktok: data.socialLinks?.tiktok ?? "",
          whatsapp: data.socialLinks?.whatsapp ?? "",
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Site settings yüklənmədi");
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const parsed = useMemo(() => {
    const parseArray = (value: string) => {
      try {
        const parsedValue = JSON.parse(value);
        return Array.isArray(parsedValue) ? parsedValue : [];
      } catch {
        return null;
      }
    };

    return {
      heroSlides: parseArray(form.heroSlidesJson),
      heroStats: parseArray(form.heroStatsJson),
      capabilities: parseArray(form.capabilitiesJson),
      products: parseArray(form.productsJson),
      aboutHighlights: parseArray(form.aboutHighlightsJson),
    };
  }, [form]);

  const handleSave = async () => {
    const arrays = [parsed.heroSlides, parsed.heroStats, parsed.capabilities, parsed.products, parsed.aboutHighlights];
    if (arrays.some((item) => item === null)) {
      toast.error("JSON sahələrində səhv var");
      return;
    }

    setSaving(true);
    try {
      await saveSiteSettings({
        brandName: form.brandName,
        logoText: form.logoText,
        logoSlogan: form.logoSlogan,
        bannerText: form.bannerText,
        whatsappNumber: form.whatsappNumber,
        displayPhone: form.displayPhone,
        email: form.email,
        address: form.address,
        workingHours: form.workingHours,
        contactMapUrl: form.contactMapUrl,
        contactMapLink: form.contactMapLink,
        footerPreparedBy: form.footerPreparedBy,
        socialLinks: {
          instagram: form.instagram,
          tiktok: form.tiktok,
          whatsapp: form.whatsapp,
        },
        home: {
          heroEstablished: form.heroEstablished,
          heroSlides: parsed.heroSlides as any,
          heroStats: parsed.heroStats as any,
          capabilitiesTitle: form.capabilitiesTitle,
          capabilities: parsed.capabilities as any,
          productsTitle: form.productsTitle,
          products: parsed.products as any,
          aboutTitle: form.aboutTitle,
          aboutDescription: form.aboutDescription,
          aboutImage: form.aboutImage,
          aboutHighlights: parsed.aboutHighlights as any,
          contactTitle: form.contactTitle,
          contactSubtitle: form.contactSubtitle,
          contactBackgroundImage: form.contactBackgroundImage,
          contactButtonLabel: form.contactButtonLabel,
        },
      });
      toast.success("Site content updated");
    } catch (error) {
      console.error(error);
      toast.error("Saxlamaq alınmadı");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-gray-500">Yüklənir...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">Site Content</h2>
          <p className="text-sm text-gray-500">Ana səhifə, haqqımızda, əlaqə, footer və banner buradan idarə olunur.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Brand & Contact">
          <Field label="Brand name" value={form.brandName} onChange={(v) => update("brandName", v)} />
          <Field label="Logo text" value={form.logoText} onChange={(v) => update("logoText", v)} />
          <Field label="Logo slogan" value={form.logoSlogan} onChange={(v) => update("logoSlogan", v)} />
          <Field label="Banner text" value={form.bannerText} onChange={(v) => update("bannerText", v)} />
          <Field label="WhatsApp number" value={form.whatsappNumber} onChange={(v) => update("whatsappNumber", v)} />
          <Field label="Display phone" value={form.displayPhone} onChange={(v) => update("displayPhone", v)} />
          <Field label="Email" value={form.email} onChange={(v) => update("email", v)} />
          <Field label="Address" value={form.address} onChange={(v) => update("address", v)} />
          <Field label="Working hours" value={form.workingHours} onChange={(v) => update("workingHours", v)} />
          <Field label="Google Maps embed URL" value={form.contactMapUrl} onChange={(v) => update("contactMapUrl", v)} />
          <Field label="Google Maps link" value={form.contactMapLink} onChange={(v) => update("contactMapLink", v)} />
          <Field label="Footer text" value={form.footerPreparedBy} onChange={(v) => update("footerPreparedBy", v)} />
          <Field label="Instagram" value={form.instagram} onChange={(v) => update("instagram", v)} />
          <Field label="TikTok" value={form.tiktok} onChange={(v) => update("tiktok", v)} />
          <Field label="WhatsApp link" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} />
        </Panel>

        <Panel title="Hero & About">
          <Field label="Hero established" value={form.heroEstablished} onChange={(v) => update("heroEstablished", v)} />
          <Field label="Capabilities title" value={form.capabilitiesTitle} onChange={(v) => update("capabilitiesTitle", v)} />
          <Field label="Products title" value={form.productsTitle} onChange={(v) => update("productsTitle", v)} />
          <Field label="About title" value={form.aboutTitle} onChange={(v) => update("aboutTitle", v)} />
          <Field label="About image" value={form.aboutImage} onChange={(v) => update("aboutImage", v)} />
          <Field label="Contact title" value={form.contactTitle} onChange={(v) => update("contactTitle", v)} />
          <Field label="Contact subtitle" value={form.contactSubtitle} onChange={(v) => update("contactSubtitle", v)} />
          <Field label="Contact background image" value={form.contactBackgroundImage} onChange={(v) => update("contactBackgroundImage", v)} />
          <Field label="Contact button label" value={form.contactButtonLabel} onChange={(v) => update("contactButtonLabel", v)} />
          <TextArea label="About description" value={form.aboutDescription} onChange={(v) => update("aboutDescription", v)} />
          <TextArea label="Hero slides JSON" value={form.heroSlidesJson} onChange={(v) => update("heroSlidesJson", v)} />
          <TextArea label="Hero stats JSON" value={form.heroStatsJson} onChange={(v) => update("heroStatsJson", v)} />
          <TextArea label="Capabilities JSON" value={form.capabilitiesJson} onChange={(v) => update("capabilitiesJson", v)} />
          <TextArea label="Products JSON" value={form.productsJson} onChange={(v) => update("productsJson", v)} />
          <TextArea label="About highlights JSON" value={form.aboutHighlightsJson} onChange={(v) => update("aboutHighlightsJson", v)} />
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-orange-500"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-orange-500"
      />
    </label>
  );
}
