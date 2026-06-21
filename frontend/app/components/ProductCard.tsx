import { Link } from "react-router";
import { type Product } from "~/lib/data";
import { useLanguage } from "~/context/LanguageContext";
import { useWishlist } from "~/hooks/useWishlist";
import { useCartStore } from "~/store/cart.store";
import toast from "react-hot-toast";
import { apiUrl } from "~/lib/site-settings";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { isInWishlist, toggle } = useWishlist(product.id);
  const addItem = useCartStore((s) => s.addItem);

  const name =
    language === "az"
      ? product.name
      : language === "ru"
      ? product.nameRu
      : product.nameEn;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;
  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : apiUrl(product.image)
    : "";

  // TODO: Backend inteqrasiyasından sonra doldurul
  const handleAddToCart = () => {
    addItem(product as any);
    toast.success(t("addToCart") + ": " + name);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <Link to={`/products/${product.id}`}>
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              if (!e.currentTarget.src.includes("unsplash")) {
                e.currentTarget.src = imageSrc;
              }
            }}
          />
        </Link>

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
