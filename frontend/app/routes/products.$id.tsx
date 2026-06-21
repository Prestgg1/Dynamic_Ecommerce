import type { Route } from "./+types/products.$id";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import { trpc } from "~/lib/trpc";
import toast from "react-hot-toast";
import { useCartStore } from "~/store/cart.store";
import { apiUrl } from "~/lib/site-settings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Məhsul Detalları - DəmirMart" },
    { name: "description", content: "DəmirMart məhsulları" },
  ];
}

export default function ProductDetailPage({ params }: Route.ComponentProps) {
  const { id } = params;
  const { language, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading: productLoading } = trpc.useQuery("get", "/products/{id}", {
    params: { path: { id: id as never } },
  });

  const addItem = useCartStore((s) => s.addItem);

  const images = useMemo(() => {
    if (!product) return [];
    const ordered = [product.image, ...(product.images || [])].filter(Boolean);
    return Array.from(new Set(ordered));
  }, [product]);

  const resolvedImages = useMemo(
    () => images.map((img) => (img.startsWith("http") ? img : apiUrl(img))),
    [images],
  );

  useEffect(() => {
    if (!resolvedImages.length) {
      setSelectedImage(null);
      return;
    }

    setSelectedImage((current) =>
      current && resolvedImages.includes(current) ? current : resolvedImages[0],
    );
  }, [resolvedImages]);

  if (productLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-36">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 pt-36">
        <h2 className="text-2xl font-bold text-gray-800">Məhsul tapılmadı</h2>
        <Link to="/" className="mt-4 font-bold text-orange-500 hover:underline">
          Ana səhifəyə qayıt
        </Link>
      </div>
    );
  }

  const name =
    language === "az" ? product.name : language === "ru" ? product.nameRu : product.nameEn;
  const description =
    language === "az"
      ? product.description
      : language === "ru"
      ? product.descriptionRu
      : product.descriptionEn;

  const currentImage =
    selectedImage ??
    (product.image.startsWith("http") ? product.image : apiUrl(product.image));

  const handleAddToCart = () => {
    addItem(product as any, quantity);
    toast.success(t("addToCart") + ": " + name);
  };

  const mappedImages = resolvedImages;

  return (
    <main className="min-h-screen bg-gray-50 pb-12 pt-32">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="font-semibold transition-colors hover:text-orange-500">
              {t("home")}
            </Link>
            <span>›</span>
            <Link
              to={`/search?category=${product.categoryId || product.category?.slug || ""}`}
              className="font-semibold capitalize transition-colors hover:text-orange-500"
            >
              {product.category?.name || "Kategoriya"}
            </Link>
            <span>›</span>
            <span className="max-w-xs truncate font-bold text-gray-800">{name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            <div className="border-r border-gray-100 p-6">
              <div className="relative aspect-square rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <img
                  src={currentImage}
                  alt={name}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                {mappedImages.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    onClick={() => setSelectedImage(img)}
                    className={`overflow-hidden rounded-xl border-2 bg-gray-50 p-2 transition-all ${
                      currentImage === img
                        ? "border-orange-500 shadow-md shadow-orange-500/20"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="h-20 w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 md:p-10">
              {product.badge && (
                <span className="mb-4 inline-block w-max rounded-lg bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-orange-600">
                  {product.badge}
                </span>
              )}
              <h1 className="mb-4 text-3xl font-black leading-tight text-gray-900 md:text-4xl">
                {name}
              </h1>

              <div className="mb-8 rounded-3xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex flex-col gap-1">
                  {product.oldPrice && (
                    <span className="text-lg font-bold text-gray-400 line-through">
                      {Number(product.oldPrice).toFixed(2)} AZN
                    </span>
                  )}
                  <span className="text-4xl font-black tracking-tight text-orange-600">
                    {Number(product.price).toFixed(2)} AZN
                  </span>
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center justify-between overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-1 sm:w-40">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black text-gray-500 transition-colors hover:bg-orange-50 hover:text-orange-500"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-black text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black text-gray-500 transition-colors hover:bg-orange-50 hover:text-orange-500"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-2xl bg-orange-500 py-4 text-lg font-black text-white shadow-xl shadow-orange-500/30 transition-all hover:bg-orange-600 active:scale-[0.98]"
                >
                  {t("addToCart")}
                </button>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Çatdırılma
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  Çatdırılma var
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 pt-4">
            <div className="inline-flex border-b-2 border-orange-500 px-6 py-4 text-sm font-black uppercase tracking-widest text-orange-600">
              {t("description")}
            </div>
          </div>
          <div className="p-8 md:p-10">
            <p className="max-w-4xl text-lg leading-relaxed font-medium text-gray-600">
              {description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
