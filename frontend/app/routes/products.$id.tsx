import type { Route } from "./+types/products.$id";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import { trpc } from "~/lib/trpc";
import { useAuthStore } from "~/store/auth.store";
import toast from "react-hot-toast";

// ... rest of imports and code

export default function ProductDetailPage({ params }: Route.ComponentProps) {
  const { id } = params;
  const { language, t } = useLanguage();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // ✅ Now using isAuthenticated flag
  const isLoggedIn = isAuthenticated && !!user;

  useEffect(() => {
    console.log("📱 Product Page - Auth Debug:", {
      user: user?.email || null,
      isAuthenticated,
      isLoggedIn,
      userId: user?.id || null,
    });
  }, [user, isAuthenticated, isLoggedIn]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");

  // Review form states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Queries
  const { data: product, isLoading: productLoading } = trpc.useQuery(
    "get",
    "/products/{id}",
    {
      params: { path: { id: id as never } },
    },
  );

  const {
    data: reviews,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = trpc.useQuery("get", "/reviews/product/{productId}", {
    params: { path: { productId: id as never } },
  });

  // Mutations
  const { mutate: createReview } = trpc.useMutation("post", "/reviews");
  const { mutate: deleteReview } = trpc.useMutation("delete", "/reviews/{id}");
  const addToWishlist = trpc.useMutation("post", "/wishlist/{productId}");
  const removeFromWishlist = trpc.useMutation(
    "delete",
    "/wishlist/{productId}",
  );

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      toast.error("Rəy yazmaq üçün daxil olmalısınız");
      return;
    }

    if (!reviewMessage.trim()) {
      toast.error("Zəhmət olmasa rəy yazın");
      return;
    }

    if (reviewMessage.trim().length < 10) {
      toast.error("Rəy ən azı 10 simvol olmalıdır");
      return;
    }

    setIsSubmittingReview(true);

    try {
      await createReview(
        {
          body: {
            message: reviewMessage,
            starCount: reviewRating,
            productId: Number(id),
          },
        },
        {
          onSuccess: () => {
            toast.success("Rəy uğurla göndərildi");
            setReviewMessage("");
            setReviewRating(5);
            refetchReviews();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Rəy göndərilə bilmədi");
          },
        },
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    if (confirm("Bu rəyi silmək istədiyinizə əminsiniz?")) {
      deleteReview(
        { params: { path: { id: reviewId } } },
        {
          onSuccess: () => {
            toast.success("Rəy silindi");
            refetchReviews();
          },
          onError: () => {
            toast.error("Rəy silinə bilmədi");
          },
        },
      );
    }
  };

  const handleWishlist = () => {
    if (!isLoggedIn) {
      toast.error("Sevilənlərə əlavə etmək üçün daxil olmalısınız");
      return;
    }

    if (product?.is_favorite) {
      removeFromWishlist(
        { params: { path: { productId: product.id } } },
        {
          onSuccess: () => {
            toast.success("Sevilənlərdən çıxarıldı");
          },
          onError: () => toast.error("Xəta baş verdi"),
        },
      );
    } else {
      addToWishlist(
        { params: { path: { productId: product!.id } } },
        {
          onSuccess: () => {
            toast.success("Sevilənlərə əlavə olundu");
          },
          onError: () => toast.error("Xəta baş verdi"),
        },
      );
    }
  };

  const handleAddToCart = () => {
    toast.success("Səbətə əlavə olundu (Mock)");
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
        <Link to="/" className="mt-4 text-orange-500 font-bold hover:underline">
          Ana səhifəyə qayıt
        </Link>
      </div>
    );
  }

  const currentImage =
    selectedImage ??
    (product.image.includes("unsplash")
      ? product.image
      : `http://localhost:4000${product.image}`);

  const name =
    language === "az"
      ? product.name
      : language === "ru"
        ? product.nameRu
        : product.nameEn;
  const description =
    language === "az"
      ? product.description
      : language === "ru"
        ? product.descriptionRu
        : product.descriptionEn;

  const discount = product.oldPrice
    ? Math.round(
        ((Number(product.oldPrice) - Number(product.price)) /
          Number(product.oldPrice)) *
          100,
      )
    : null;

  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  const averageRating =
    reviewsArray.length > 0
      ? (
          reviewsArray.reduce(
            (sum: number, r: any) => sum + (r.starCount || 0),
            0,
          ) / reviewsArray.length
        ).toFixed(1)
      : product.rating || 0;

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviewsArray.filter((r: any) => r.starCount === rating).length,
    percentage:
      reviewsArray.length > 0
        ? Math.round(
            (reviewsArray.filter((r: any) => r.starCount === rating).length /
              reviewsArray.length) *
              100,
          )
        : 0,
  }));

  // ✅ Get username from email or fullName
  const getUserDisplayName = (reviewer: any) => {
    if (reviewer.fullName) return reviewer.fullName;
    return reviewer.email?.split("@")[0] || "User";
  };

  // ✅ Get user avatar
  const getUserAvatar = (reviewer: any) => {
    if (reviewer.avatarUrl) {
      return reviewer.avatarUrl.startsWith("http")
        ? reviewer.avatarUrl
        : `http://localhost:4000${reviewer.avatarUrl}`;
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 overflow-x-auto">
            <Link
              to="/"
              className="hover:text-orange-500 transition-colors font-semibold whitespace-nowrap"
            >
              {t("home")}
            </Link>
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link
              to={`/search?category=${product.category?.name}`}
              className="hover:text-orange-500 transition-colors capitalize font-semibold whitespace-nowrap truncate"
            >
              {product.category?.name || "Kategoriya"}
            </Link>
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-800 font-bold truncate max-w-xs">
              {name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Product Main */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Images */}
            <div className="p-4 md:p-6 md:border-r md:border-gray-200 flex flex-col gap-4">
              {/* Main image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 p-4">
                <img
                  src={currentImage}
                  alt={name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    if (!e.currentTarget.src.includes("unsplash")) {
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
                    <span className="bg-gray-900 border border-gray-800 shadow-xl text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs md:text-sm">
                      {t("outOfStock")}
                    </span>
                  </div>
                )}
              </div>
              {/* Thumbnail strip */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[product.image, ...product.images].map((img, i) => {
                    const mappedImg = img.includes("unsplash")
                      ? img
                      : `http://localhost:4000${img}`;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(mappedImg)}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 p-2 bg-gray-50 ${
                          currentImage === mappedImg
                            ? "border-orange-500 shadow-md shadow-orange-500/20"
                            : "border-transparent hover:border-gray-200"
                        }`}
                      >
                        <img
                          src={mappedImg}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 md:p-10 flex flex-col justify-center">
              {product.badge && (
                <span className="inline-block bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg mb-4 w-max">
                  {product.badge}
                </span>
              )}
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                {name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 md:gap-3 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 md:w-5 h-4 md:h-5 ${
                        star <= Math.round(Number(averageRating))
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
                <span className="text-sm font-bold text-gray-700">
                  {averageRating}
                </span>
                <span className="text-xs md:text-sm font-semibold text-gray-400">
                  ({reviewsArray.length} {t("reviews")})
                </span>
              </div>

              {/* Price */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6 md:mb-8">
                <div className="flex flex-col gap-1">
                  {product.oldPrice && (
                    <span className="text-sm md:text-lg font-bold text-gray-400 line-through">
                      {Number(product.oldPrice).toFixed(2)} AZN
                    </span>
                  )}
                  <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                    <span className="text-3xl md:text-4xl font-black text-orange-600 tracking-tight">
                      {Number(product.price).toFixed(2)} AZN
                    </span>
                    {discount && (
                      <span className="text-xs md:text-sm font-black text-white bg-red-500 px-2.5 py-1 rounded-lg">
                        Qənaət: {discount}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity & Buttons */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center justify-between border-2 border-gray-200 bg-white rounded-2xl overflow-hidden p-1 w-full sm:w-40 shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-colors font-black text-lg md:text-xl rounded-lg"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-black text-base md:text-lg text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-colors font-black text-lg md:text-xl rounded-lg"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 py-3 md:py-4 rounded-2xl font-black text-base md:text-lg transition-all flex items-center justify-center gap-2 md:gap-3 ${
                      product.inStock
                        ? "bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 active:scale-[0.98]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6"
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
                    {t("addToCart")}
                  </button>

                  <button
                    onClick={handleWishlist}
                    className={`shrink-0 w-14 h-14 md:w-[68px] md:h-[68px] rounded-2xl border-2 transition-all flex items-center justify-center ${
                      product.is_favorite
                        ? "border-red-500 bg-red-50 text-red-500"
                        : "border-gray-200 hover:border-red-200 bg-white text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 md:w-7 md:h-7 transition-colors ${product.is_favorite ? "fill-red-500" : ""}`}
                      fill={product.is_favorite ? "currentColor" : "none"}
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
                  </button>
                </div>

                {/* Badges/Delivery */}
                <div className="grid grid-cols-2 gap-3 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 uppercase">
                        Stokda
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {product.inStock ? "Bəli" : "Xeyr"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 uppercase">
                        Çatdırılma
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        1-3 Gün
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-12 border border-gray-200">
          <div className="flex border-b border-gray-200 px-4 pt-4 overflow-x-auto">
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "text-orange-600 border-b-2 border-orange-500"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {tab === "description"
                  ? t("description")
                  : tab === "specs"
                    ? t("specifications")
                    : `${t("reviews")} (${reviewsArray.length})`}
              </button>
            ))}
          </div>
          <div className="p-4 md:p-8 md:p-10">
            {activeTab === "description" && (
              <p className="text-gray-600 leading-relaxed font-medium text-base md:text-lg max-w-4xl">
                {description}
              </p>
            )}
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-4xl">
                {[
                  {
                    label: t("weight"),
                    value: product.weight || "Göstərilməyib",
                  },
                  {
                    label: t("material"),
                    value: product.material || "Göstərilməyib",
                  },
                  {
                    label: t("dimensions"),
                    value: product.dimensions || "Göstərilməyib",
                  },
                  { label: t("rating"), value: `${averageRating}/5` },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200"
                  >
                    <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      {spec.label}
                    </span>
                    <span className="text-sm md:text-base font-black text-gray-900">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                {/* Review Stats */}
                {reviewsArray.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 max-w-2xl">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="text-center">
                        <p className="text-4xl md:text-5xl font-black text-orange-600">
                          {averageRating}
                        </p>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(Number(averageRating))
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 fill-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {reviewsArray.length} rəy
                        </p>
                      </div>

                      <div className="flex-1 space-y-3">
                        {ratingDistribution.map((dist) => (
                          <div
                            key={dist.rating}
                            className="flex items-center gap-3"
                          >
                            <span className="text-sm font-semibold text-gray-600 w-12">
                              {dist.rating}⭐
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full transition-all"
                                style={{ width: `${dist.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 w-8 text-right">
                              {dist.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Form */}
                {isLoggedIn ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 max-w-2xl">
                    <h3 className="text-lg font-black text-gray-900 mb-4">
                      Rəy Yazın
                    </h3>

                    <div className="mb-4">
                      <label className="text-sm font-bold text-gray-700 block mb-2">
                        Qiymətləndirmə
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <svg
                              className={`w-8 h-8 ${
                                star <= reviewRating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 fill-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-bold text-gray-700 block mb-2">
                        Rəy
                      </label>
                      <textarea
                        value={reviewMessage}
                        onChange={(e) => setReviewMessage(e.target.value)}
                        placeholder="Məhsul haqqında fikirlərinizi bölüşün..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {reviewMessage.length} simvol (
                        {10 - Math.max(0, 10 - reviewMessage.length)} minimum
                        qalır)
                      </p>
                    </div>

                    <button
                      onClick={handleSubmitReview}
                      disabled={isSubmittingReview}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      {isSubmittingReview ? "Göndərilir..." : "Rəy Göndər"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                    <p className="text-sm text-blue-900">
                      Rəy yazmaq üçün{" "}
                      <Link
                        to="/auth/login"
                        className="font-bold text-blue-600 hover:underline"
                      >
                        daxil olmalısınız
                      </Link>
                    </p>
                  </div>
                )}

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : reviewsArray.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl">
                    {reviewsArray.map((review) => {
                      const displayName = getUserDisplayName(review.user);
                      const avatarUrl = getUserAvatar(review.user);
                      const initials = displayName[0]?.toUpperCase() || "U";

                      return (
                        <div
                          key={review.id}
                          className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-6"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black text-sm md:text-lg flex-shrink-0 overflow-hidden">
                                {avatarUrl ? (
                                  <img
                                    src={avatarUrl}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  initials
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-gray-900 text-sm md:text-base truncate">
                                  {displayName}
                                </p>
                                <div className="flex mt-1 gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-3.5 h-3.5 ${
                                        star <= review.starCount
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300 fill-gray-300"
                                      }`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {isLoggedIn && user?.id === review.user.id && (
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-bold"
                              >
                                Sil
                              </button>
                            )}
                          </div>
                          <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed mb-3">
                            {review.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              language === "az"
                                ? "az-AZ"
                                : language === "ru"
                                  ? "ru-RU"
                                  : "en-US",
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 font-medium">
                      Hələ heç bir rəy yoxdur
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
