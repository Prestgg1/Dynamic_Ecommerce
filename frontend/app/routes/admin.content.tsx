import { useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { fetchSiteSettings, saveSiteSettings } from "~/lib/site-settings";

type SlideItem = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

type StatItem = {
  value: string;
  label: string;
};

type CapabilityItem = {
  title: string;
  desc: string;
  stat: string;
};

type ProductItem = {
  title: string;
  desc: string;
  image: string;
};

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
  capabilitiesTitle: string;
  productsTitle: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  contactTitle: string;
  contactSubtitle: string;
  contactBackgroundImage: string;
  contactButtonLabel: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
  heroSlides: SlideItem[];
  heroStats: StatItem[];
  capabilities: CapabilityItem[];
  products: ProductItem[];
  aboutHighlights: string[];
};

const emptySlide = (): SlideItem => ({
  title: "",
  subtitle: "",
  description: "",
  image: "",
});

const emptyStat = (): StatItem => ({
  value: "",
  label: "",
});

const emptyCapability = (): CapabilityItem => ({
  title: "",
  desc: "",
  stat: "",
});

const emptyProduct = (): ProductItem => ({
  title: "",
  desc: "",
  image: "",
});

const moveItem = <T,>(items: T[], index: number, direction: -1 | 1) => {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  const current = next[index] as T;
  next[index] = next[nextIndex] as T;
  next[nextIndex] = current;
  return next;
};

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
    capabilitiesTitle: "",
    productsTitle: "",
    aboutTitle: "",
    aboutDescription: "",
    aboutImage: "",
    contactTitle: "",
    contactSubtitle: "",
    contactBackgroundImage: "",
    contactButtonLabel: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
    heroSlides: [],
    heroStats: [],
    capabilities: [],
    products: [],
    aboutHighlights: [],
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
          capabilitiesTitle: home.capabilitiesTitle ?? "",
          productsTitle: home.productsTitle ?? "",
          aboutTitle: home.aboutTitle ?? "",
          aboutDescription: home.aboutDescription ?? "",
          aboutImage: home.aboutImage ?? "",
          contactTitle: home.contactTitle ?? "",
          contactSubtitle: home.contactSubtitle ?? "",
          contactBackgroundImage: home.contactBackgroundImage ?? "",
          contactButtonLabel: home.contactButtonLabel ?? "",
          instagram: data.socialLinks?.instagram ?? "",
          tiktok: data.socialLinks?.tiktok ?? "",
          whatsapp: data.socialLinks?.whatsapp ?? "",
          heroSlides: (home.heroSlides ?? []) as SlideItem[],
          heroStats: (home.heroStats ?? []) as StatItem[],
          capabilities: (home.capabilities ?? []) as CapabilityItem[],
          products: (home.products ?? []) as ProductItem[],
          aboutHighlights: home.aboutHighlights ?? [],
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Site settings yüklənmədi");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateHeroSlide = (
    index: number,
    field: keyof SlideItem,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateHeroStat = (
    index: number,
    field: keyof StatItem,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      heroStats: prev.heroStats.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateCapability = (
    index: number,
    field: keyof CapabilityItem,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      capabilities: prev.capabilities.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateProduct = (
    index: number,
    field: keyof ProductItem,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      aboutHighlights: prev.aboutHighlights.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const handleSave = async () => {
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
          heroSlides: form.heroSlides as any,
          heroStats: form.heroStats as any,
          capabilitiesTitle: form.capabilitiesTitle,
          capabilities: form.capabilities as any,
          productsTitle: form.productsTitle,
          products: form.products as any,
          aboutTitle: form.aboutTitle,
          aboutDescription: form.aboutDescription,
          aboutImage: form.aboutImage,
          aboutHighlights: form.aboutHighlights as any,
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
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Site Content
          </h2>
          <p className="text-sm text-gray-500">
            Ana səhifə, haqqımızda, əlaqə, footer və banner buradan idarə
            olunur.
          </p>
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
          <Field
            label="Brand name"
            value={form.brandName}
            onChange={(v) => updateField("brandName", v)}
          />
          <Field
            label="Logo text"
            value={form.logoText}
            onChange={(v) => updateField("logoText", v)}
          />
          <Field
            label="Logo slogan"
            value={form.logoSlogan}
            onChange={(v) => updateField("logoSlogan", v)}
          />
          <Field
            label="Banner text"
            value={form.bannerText}
            onChange={(v) => updateField("bannerText", v)}
          />
          <Field
            label="WhatsApp number"
            value={form.whatsappNumber}
            onChange={(v) => updateField("whatsappNumber", v)}
          />
          <Field
            label="Display phone"
            value={form.displayPhone}
            onChange={(v) => updateField("displayPhone", v)}
          />
          <Field
            label="Email"
            value={form.email}
            onChange={(v) => updateField("email", v)}
          />
          <Field
            label="Address"
            value={form.address}
            onChange={(v) => updateField("address", v)}
          />
          <Field
            label="Working hours"
            value={form.workingHours}
            onChange={(v) => updateField("workingHours", v)}
          />
          <Field
            label="Google Maps embed URL"
            value={form.contactMapUrl}
            onChange={(v) => updateField("contactMapUrl", v)}
          />
          <Field
            label="Google Maps link"
            value={form.contactMapLink}
            onChange={(v) => updateField("contactMapLink", v)}
          />
          <Field
            label="Footer text"
            value={form.footerPreparedBy}
            onChange={(v) => updateField("footerPreparedBy", v)}
          />
          <Field
            label="Instagram"
            value={form.instagram}
            onChange={(v) => updateField("instagram", v)}
          />
          <Field
            label="TikTok"
            value={form.tiktok}
            onChange={(v) => updateField("tiktok", v)}
          />
          <Field
            label="WhatsApp link"
            value={form.whatsapp}
            onChange={(v) => updateField("whatsapp", v)}
          />
        </Panel>

        <Panel title="Basic Page Text">
          <Field
            label="Hero established"
            value={form.heroEstablished}
            onChange={(v) => updateField("heroEstablished", v)}
          />
          <Field
            label="Capabilities title"
            value={form.capabilitiesTitle}
            onChange={(v) => updateField("capabilitiesTitle", v)}
          />
          <Field
            label="Products title"
            value={form.productsTitle}
            onChange={(v) => updateField("productsTitle", v)}
          />
          <Field
            label="About title"
            value={form.aboutTitle}
            onChange={(v) => updateField("aboutTitle", v)}
          />
          <Field
            label="About image"
            value={form.aboutImage}
            onChange={(v) => updateField("aboutImage", v)}
          />
          <TextArea
            label="About description"
            value={form.aboutDescription}
            onChange={(v) => updateField("aboutDescription", v)}
          />
          <Field
            label="Contact title"
            value={form.contactTitle}
            onChange={(v) => updateField("contactTitle", v)}
          />
          <Field
            label="Contact subtitle"
            value={form.contactSubtitle}
            onChange={(v) => updateField("contactSubtitle", v)}
          />
          <Field
            label="Contact background image"
            value={form.contactBackgroundImage}
            onChange={(v) => updateField("contactBackgroundImage", v)}
          />
          <Field
            label="Contact button label"
            value={form.contactButtonLabel}
            onChange={(v) => updateField("contactButtonLabel", v)}
          />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ListEditor
          title="Hero Slaydları"
          description="Ana səhifədə görünən bannerləri buradan kart kimi idarə edin."
          actionLabel="Yeni slayd"
          onAdd={() =>
            setForm((prev) => ({
              ...prev,
              heroSlides: [...prev.heroSlides, emptySlide()],
            }))
          }
        >
          {form.heroSlides.map((slide, index) => (
            <ItemCard
              key={`slide-${index}`}
              index={index}
              title={slide.title || `Slayd ${index + 1}`}
              onMoveUp={() =>
                setForm((prev) => ({
                  ...prev,
                  heroSlides: moveItem(prev.heroSlides, index, -1),
                }))
              }
              onMoveDown={() =>
                setForm((prev) => ({
                  ...prev,
                  heroSlides: moveItem(prev.heroSlides, index, 1),
                }))
              }
              onRemove={() =>
                setForm((prev) => ({
                  ...prev,
                  heroSlides: prev.heroSlides.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Başlıq"
                  value={slide.title}
                  onChange={(v) => updateHeroSlide(index, "title", v)}
                />
                <Field
                  label="Alt başlıq"
                  value={slide.subtitle}
                  onChange={(v) => updateHeroSlide(index, "subtitle", v)}
                />
              </div>
              <Field
                label="Şəkil linki"
                value={slide.image}
                onChange={(v) => updateHeroSlide(index, "image", v)}
              />
              <TextArea
                label="Təsvir"
                value={slide.description}
                onChange={(v) => updateHeroSlide(index, "description", v)}
              />
            </ItemCard>
          ))}
        </ListEditor>

        <ListEditor
          title="Hero statistika"
          description="Qısa göstəriciləri ayrıca kartlarla redaktə edin."
          actionLabel="Yeni göstərici"
          onAdd={() =>
            setForm((prev) => ({
              ...prev,
              heroStats: [...prev.heroStats, emptyStat()],
            }))
          }
        >
          {form.heroStats.map((stat, index) => (
            <ItemCard
              key={`stat-${index}`}
              index={index}
              title={stat.value || `Göstərici ${index + 1}`}
              onMoveUp={() =>
                setForm((prev) => ({
                  ...prev,
                  heroStats: moveItem(prev.heroStats, index, -1),
                }))
              }
              onMoveDown={() =>
                setForm((prev) => ({
                  ...prev,
                  heroStats: moveItem(prev.heroStats, index, 1),
                }))
              }
              onRemove={() =>
                setForm((prev) => ({
                  ...prev,
                  heroStats: prev.heroStats.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Dəyər"
                  value={stat.value}
                  onChange={(v) => updateHeroStat(index, "value", v)}
                />
                <Field
                  label="Açıqlama"
                  value={stat.label}
                  onChange={(v) => updateHeroStat(index, "label", v)}
                />
              </div>
            </ItemCard>
          ))}
        </ListEditor>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ListEditor
          title="Bizim imkanlarımız"
          description="Ana səhifədəki imkan kartları məhsul kartlarına daha yaxın görünür."
          actionLabel="Yeni kart"
          onAdd={() =>
            setForm((prev) => ({
              ...prev,
              capabilities: [...prev.capabilities, emptyCapability()],
            }))
          }
        >
          {form.capabilities.map((item, index) => (
            <ItemCard
              key={`cap-${index}`}
              index={index}
              title={item.title || `Kart ${index + 1}`}
              onMoveUp={() =>
                setForm((prev) => ({
                  ...prev,
                  capabilities: moveItem(prev.capabilities, index, -1),
                }))
              }
              onMoveDown={() =>
                setForm((prev) => ({
                  ...prev,
                  capabilities: moveItem(prev.capabilities, index, 1),
                }))
              }
              onRemove={() =>
                setForm((prev) => ({
                  ...prev,
                  capabilities: prev.capabilities.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            >
              <Field
                label="Stat"
                value={item.stat}
                onChange={(v) => updateCapability(index, "stat", v)}
              />
              <Field
                label="Başlıq"
                value={item.title}
                onChange={(v) => updateCapability(index, "title", v)}
              />
              <TextArea
                label="Təsvir"
                value={item.desc}
                onChange={(v) => updateCapability(index, "desc", v)}
              />
            </ItemCard>
          ))}
        </ListEditor>

        <ListEditor
          title="Əsas məhsullar"
          description="Ana səhifədə göstərilən seçilmiş məhsul blokları."
          actionLabel="Yeni məhsul"
          onAdd={() =>
            setForm((prev) => ({
              ...prev,
              products: [...prev.products, emptyProduct()],
            }))
          }
        >
          {form.products.map((item, index) => (
            <ItemCard
              key={`product-${index}`}
              index={index}
              title={item.title || `Məhsul ${index + 1}`}
              onMoveUp={() =>
                setForm((prev) => ({
                  ...prev,
                  products: moveItem(prev.products, index, -1),
                }))
              }
              onMoveDown={() =>
                setForm((prev) => ({
                  ...prev,
                  products: moveItem(prev.products, index, 1),
                }))
              }
              onRemove={() =>
                setForm((prev) => ({
                  ...prev,
                  products: prev.products.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            >
              <Field
                label="Başlıq"
                value={item.title}
                onChange={(v) => updateProduct(index, "title", v)}
              />
              <Field
                label="Şəkil linki"
                value={item.image}
                onChange={(v) => updateProduct(index, "image", v)}
              />
              <TextArea
                label="Təsvir"
                value={item.desc}
                onChange={(v) => updateProduct(index, "desc", v)}
              />
            </ItemCard>
          ))}
        </ListEditor>
      </div>

      <Panel title="Haqqımızda mətnləri">
        <p className="mb-4 text-sm text-gray-500">
          Giriş səhifəsi ilə Haqqımızda səhifəsi eyni highlight siyahısını
          paylaşır.
        </p>
        <div className="space-y-4">
          {form.aboutHighlights.map((item, index) => (
            <div
              key={`highlight-${index}`}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Item {index + 1}
                  </p>
                  <h4 className="text-sm font-bold text-gray-900">
                    {item || `Mətn ${index + 1}`}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        aboutHighlights: moveItem(prev.aboutHighlights, index, -1),
                      }))
                    }
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-600"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        aboutHighlights: moveItem(prev.aboutHighlights, index, 1),
                      }))
                    }
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-600"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        aboutHighlights: prev.aboutHighlights.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      }))
                    }
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                  >
                    Sil
                  </button>
                </div>
              </div>
              <Field
                label="Mətn"
                value={item}
                onChange={(v) => updateHighlight(index, v)}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              aboutHighlights: [...prev.aboutHighlights, ""],
            }))
          }
          className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          + Yeni mətn
        </button>
      </Panel>
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

function ListEditor({
  title,
  description,
  actionLabel,
  onAdd,
  children,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          + {actionLabel}
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ItemCard({
  index,
  title,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
}: {
  index: number;
  title: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Item {index + 1}
          </p>
          <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-600"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-600"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
          >
            Sil
          </button>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
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
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-orange-500"
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
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-orange-500"
      />
    </label>
  );
}
