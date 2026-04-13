import type { Route } from "./+types/products.$id";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import { trpc } from "~/lib/trpc";
import { useDebounce } from "~/hooks/useDebounce";
import ProductCard from "~/components/ProductCard";
import toast from "react-hot-toast";
import { useCartStore } from "~/store/cart.store";

export function meta({ data }: Route.MetaArgs) {
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
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const { data: product, isLoading: productLoading } = trpc.useQuery("get", "/products/{id}", {
    params: { path: { id: id as never } },
  });


  const addMutation = trpc.useMutation("post", "/wishlist/{productId}");
  const removeMutation = trpc.useMutation("delete", "/wishlist/{productId}");


  const updateFavoriteApi = useDebounce(async (productId: number, favorited: boolean) => {
    try {
      if (favorited) {
        await addMutation.mutateAsync({ params: { path: { productId } } });
      } else {
        await removeMutation.mutateAsync({ params: { path: { productId } } });
      }
      toast.success(favorited ? "Məhsul sevilənlərə əlavə olundu" : "Məhsul sevilənlərdən çıxarıldı", { id: 'wishlist-toast' });
    } catch {
      toast.error("Bir xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.", { id: 'wishlist-err' });
    }
  }, 500);

  const handleWishlist = () => {
    //Update wishlist
    
  };

  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(product as any, quantity);
    toast.success(t("addToCart") + ": " + name);
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-36 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-36 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Məhsul tapılmadı</h2>
        <Link to="/" className="mt-4 text-orange-500 font-bold hover:underline">Ana səhifəyə qayıt</Link>
      </div>
    );
  }

  const currentImage = selectedImage ?? (product.image.includes('unsplash') ? product.image : `http://localhost:4000${product.image}`);
  
  const name =
    language === "az" ? product.name : language === "ru" ? product.nameRu : product.nameEn;
  const description =
    language === "az"
      ? product.description
      : language === "ru"
      ? product.descriptionRu
      : product.descriptionEn;

  const discount = product.oldPrice
    ? Math.round(((Number(product.oldPrice) - Number(product.price)) / Number(product.oldPrice)) * 100)
    : null;

 

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-orange-500 transition-colors font-semibold">{t("home")}</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to={`/search?category=${product.category?.name}`} className="hover:text-orange-500 transition-colors capitalize font-semibold">
              {product.category?.name || "Kategoriya"}
            </Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-800 font-bold truncate max-w-xs">{name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Main */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Images */}
            <div className="p-6 border-r border-gray-100 flex flex-col gap-4">
              {/* Main image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-4">
                <img
                  src={currentImage}
                  alt={name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    if (!e.currentTarget.src.includes('unsplash')) {
                      e.currentTarget.src = product.image;
                    }
                  }}
                />
                {discount && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-black px-3 py-1 rounded-xl shadow-lg shadow-red-500/30">
                    -{discount}%
                  </span>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-gray-900 border border-gray-800 shadow-xl text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-sm">
                      {t("outOfStock")}
                    </span>
                  </div>
                )}
              </div>
              {/* Thumbnail strip */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[product.image, ...product.images].map((img, i) => {
                    const mappedImg = img.includes('unsplash') ? img : `http://localhost:4000${img}`;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(mappedImg)}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 p-2 bg-gray-50 ${
                          currentImage === mappedImg ? "border-orange-500 shadow-md shadow-orange-500/20" : "border-transparent hover:border-gray-200"
                        }`}
                      >
                        <img src={mappedImg} alt="" className="w-full h-full object-contain" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              {product.badge && (
                <span className="inline-block bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg mb-4 w-max">
                  {product.badge}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">{name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(product.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200 fill-gray-200"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">{product.rating}</span>
                <span className="text-sm font-semibold text-gray-400">({product.reviewCount} {t("reviews")})</span>
              </div>

              {/* Price */}
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 mb-8">
                <div className="flex flex-col gap-1">
                  {product.oldPrice && (
                    <span className="text-lg font-bold text-gray-400 line-through">
                      {Number(product.oldPrice).toFixed(2)} AZN
                    </span>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-orange-600 tracking-tight">
                      {Number(product.price).toFixed(2)} AZN
                    </span>
                    {discount && (
                      <span className="text-sm font-black text-white bg-red-500 px-2.5 py-1 rounded-lg">
                        Qənaət: {discount}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity logic */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <div className="flex items-center justify-between border-2 border-gray-100 bg-white rounded-2xl overflow-hidden p-1 w-full sm:w-40 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-colors font-black text-xl rounded-xl"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-black text-lg text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-colors font-black text-xl rounded-xl"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                    product.inStock
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 active:scale-[0.98]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {t("addToCart")}
                </button>
                
                <button
                  onClick={handleWishlist}
                  className={`shrink-0 w-[68px] h-[68px] rounded-2xl border-2 transition-all flex items-center justify-center ${
                    product.is_favorite
                      ? "border-red-500 bg-red-50 text-red-500"
                      : "border-gray-100 hover:border-red-200 bg-white text-gray-400 hover:text-red-500"
                  }`}
                >
                  <svg
                    className={`w-7 h-7 transition-colors ${product.is_favorite ? "fill-red-500" : ""}`}
                    fill={product.is_favorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Badges/Delivery */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase">Stokda</p>
                    <p className="text-xs text-gray-500 font-medium">Bəli</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase">Çatdırılma</p>
                    <p className="text-xs text-gray-500 font-medium">1-3 Gün</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-12 border border-gray-100">
          <div className="flex border-b border-gray-100 px-4 pt-4">
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-black uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? "text-orange-600 border-b-2 border-orange-500"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {tab === "description" ? t("description") : tab === "specs" ? t("specifications") : t("reviews")}
              </button>
            ))}
          </div>
          <div className="p-8 md:p-10">
            {activeTab === "description" && (
              <p className="text-gray-600 leading-relaxed font-medium text-lg max-w-4xl">{description}</p>
            )}
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
                {[
                  { label: t("weight"), value: product.weight || "Göstərilməyib" },
                  { label: t("material"), value: product.material || "Göstərilməyib" },
                  { label: t("dimensions"), value: product.dimensions || "Göstərilməyib" },
                  { label: t("rating"), value: `${product.rating}/5` },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{spec.label}</span>
                    <span className="text-base font-black text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {[
                  { name: "Əli H.", rating: 5, comment: "Əla keyfiyyət, tez çatdırılma. Tövsiyə edirəm!" },
                  { name: "Ivan P.", rating: 4, comment: "Xüsusilə qiymətinə görə çox əla məhsuldur." },
                  { name: "Ramin Ə.", rating: 5, comment: "Zəmanətli və qüsursuz işləyir." },
                ].map((review, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black text-lg">
                        {review.name[0]}
                      </div>
                      <div>
                        <span className="block font-black text-gray-900">{review.name}</span>
                        <div className="flex mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
       {/* 
       
        {related.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
              <h2 className="text-2xl font-black text-gray-900">{t("relatedProducts")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {related.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
       */}
      </div>
    </main>
  );
}
