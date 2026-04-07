import { Link } from "react-router";
import { type Product } from "~/lib/data";
import { useLanguage } from "~/context/LanguageContext";
import { useWishlist } from "~/hooks/useWishlist";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { isInWishlist, toggle } = useWishlist(product.id);

  const name =
    language === "az"
      ? product.name
      : language === "ru"
      ? product.nameRu
      : product.nameEn;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  // TODO: Backend inteqrasiyasından sonra doldurul
  const handleAddToCart = () => {};

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              if (!e.currentTarget.src.includes("unsplash")) {
                e.currentTarget.src = product.image;
              }
            }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.badge && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {t("outOfStock")}
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-all z-10"
          aria-label={isInWishlist ? "Sevilənlərdən çıxar" : "Sevilənlərə əlavə et"}
        >
          <svg
            className={`w-4 h-4 transition-colors ${
              isInWishlist
                ? "text-red-500 fill-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
            fill={isInWishlist ? "currentColor" : "none"}
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
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-orange-600 transition-colors leading-snug mb-1">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3 h-3 ${
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
          <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
        </div>

        {/* Price + Cart */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base font-bold text-orange-600">
              {Number(product.price).toFixed(2)} AZN
            </span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                {Number(product.oldPrice).toFixed(2)} AZN
              </span>
            )}
          </div>

          <button
            onClick={() => product.inStock && handleAddToCart()}
            disabled={!product.inStock}
            className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
              product.inStock
                ? "bg-orange-500 hover:bg-orange-600 text-white active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {product.inStock ? t("addToCart") : t("outOfStock")}
          </button>
        </div>
      </div>
    </div>
  );
}