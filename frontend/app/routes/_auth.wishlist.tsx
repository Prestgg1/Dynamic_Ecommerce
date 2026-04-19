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
  const navigate = useNavigate();
  
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
    return (
      <div className="min-h-screen bg-[#0a1428] pt-36 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1428] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-3 h-9 bg-red-500 rounded" />
          <h1 className="text-4xl font-bold tracking-tighter">Sevilənlər</h1>
          {_localWishlist.length > 0 && (
            <span className="bg-red-500/20 text-red-400 text-sm font-bold px-4 py-1.5 rounded-full border border-red-500/30">
              {_localWishlist.length}
            </span>
          )}
        </div>

        {_localWishlist.length === 0 ? (
          <div className="bg-[#13223f] rounded-3xl p-20 text-center border border-white/10">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <svg className="w-14 h-14 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Sevilənlər siyahısı boşdur</h2>
            <p className="text-zinc-400 mb-10 max-w-md mx-auto">
              Bəyəndiyiniz məhsulları bura əlavə edə bilərsiniz
            </p>
            <Link
              to="/search"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold transition-all active:scale-95"
            >
              Kataloqa keç
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {_localWishlist.map((item) => {
              const product = item.product as Product;
              const discount = product.oldPrice
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : null;

              return (
                <div
                  key={product.id}
                  className="bg-[#13223f] border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/30 transition-all group flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-[#0a1428]">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={product.image || "https://picsum.photos/id/1015/600/600"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "https://picsum.photos/id/1015/600/600";
                        }}
                      />
                    </Link>

                    {/* Discount Badge */}
                    {discount && (
                      <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-lg">
                        -{discount}%
                      </span>
                    )}

                    {/* Wishlist Button (Filled Heart) */}
                    <button
                      onClick={() => toggleWishlist(product.id, true)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                    >
                      <svg className="w-5 h-5 text-red-500 fill-red-500" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <Link to={`/products/${product.id}`} className="flex-1">
                      <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-orange-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-6">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-orange-400">
                          {product.price.toFixed(2)} AZN
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-zinc-500 line-through">
                            {product.oldPrice.toFixed(2)} AZN
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => product.inStock }
                        disabled={!product.inStock}
                        className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                          product.inStock
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
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