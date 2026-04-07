import type { Route } from "./+types/wishlist";
import { Link, useNavigate } from "react-router";
import { trpc } from "~/lib/trpc";
import { useDebounce } from "~/hooks/useDebounce";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import type { components } from "~/lib/types";

type Product = components["schemas"]["Product"];
type WishlistItem = components["schemas"]["Wishlist"];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sevilənlər - DəmirMart" },
    { name: "description", content: "Sevilənlər siyahınız" },
  ];
}

export default function WishlistPage() {
  const { data: wishlistItems, refetch: refetchWishlist, isLoading: wishlistLoading } = trpc.useQuery("get", "/wishlist");

  const addMutation = trpc.useMutation("post", "/wishlist/{productId}");
  const removeMutation = trpc.useMutation("delete", "/wishlist/{productId}");

  const [_localWishlist, setLocalWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (wishlistItems) {
      setLocalWishlist(wishlistItems as WishlistItem[]);
    }
  }, [wishlistItems]);

  const updateFavoriteApi = useDebounce(async (id: number, favorited: boolean) => {
    try {
      if (favorited) {
        await addMutation.mutateAsync({ params: { path: { productId: id } } });
      } else {
        await removeMutation.mutateAsync({ params: { path: { productId: id } } });
      }
      
      toast.success(favorited ? "Məhsul sevilənlərə əlavə olundu" : "Məhsul sevilənlərdən çıxarıldı");
      refetchWishlist();
    } catch {
      toast.error("Bir xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
      refetchWishlist();
    }
  }, 1000);

  const toggleWishlist = (productId: number, currentlyFavorited: boolean) => {

    // Optimistic UI update
    if (currentlyFavorited) {
      setLocalWishlist((prev) => prev.filter((item) => item.product.id !== productId));
    }

    updateFavoriteApi(productId, !currentlyFavorited);
  };




  if (wishlistLoading) {
    return <div className="min-h-screen pt-36 bg-gray-50 flex justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-36 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
          <h1 className="text-3xl font-black text-gray-900">Sevilənlər</h1>
          {_localWishlist.length > 0 && (
            <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">
              {_localWishlist.length}
            </span>
          )}
        </div>

        {_localWishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-2">Sevilənlər siyahısı boşdur</h2>
            <p className="text-gray-500 mb-6 text-sm font-medium">Bəyəndiyiniz məhsulları bura əlavə edə bilərsiniz</p>
            <Link
              to="/search"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/30"
            >
              Kataloqa keç
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {_localWishlist.map((item) => {
              const product = item.product as Product;
              const discount = product.oldPrice
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : null;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={`${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    {discount && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-lg shadow-red-500/30">
                        -{discount}%
                      </span>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id, true)}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-red-500 fill-red-500" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-sm font-black text-gray-900 line-clamp-2 hover:text-orange-500 transition-colors mb-2 leading-snug">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-black text-orange-600">{product.price.toFixed(2)} AZN</span>
                        {product.oldPrice && (
                          <span className="text-xs font-bold text-gray-400 line-through">{product.oldPrice.toFixed(2)} AZN</span>
                        )}
                      </div>
                      <button
                        disabled={!product.inStock}
                        className={`w-full py-3 rounded-xl text-sm font-black transition-all ${
                          product.inStock
                            ? "bg-gray-900 hover:bg-orange-500 text-white shadow-lg hover:shadow-orange-500/30 active:scale-[0.98]"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {product.inStock ? "Səbətə at" : "Bitib"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
