import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useWishlistStore } from "~/store/useWishlistStore";
import { trpc } from "~/lib/trpc";
import { useDebounce } from "~/hooks/useDebounce";
import { useAuthStore } from "~/store/auth.store";

export function useWishlist(productId: number) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const isInWishlist = useWishlistStore((s) => s.isInWishlist(productId));
  const optimisticAdd = useWishlistStore((s) => s.optimisticAdd);
  const optimisticRemove = useWishlistStore((s) => s.optimisticRemove);

  const addMutation = trpc.useMutation("post", "/wishlist/{productId}");
  const removeMutation = trpc.useMutation("delete", "/wishlist/{productId}");

  // Debounce ilə API çağırışı — rapid click-lərin qarşısını alır
  const syncWithApi = useDebounce(async (id: number, adding: boolean) => {
    try {
      if (adding) {
        await addMutation.mutateAsync({ params: { path: { productId: id } } });
      } else {
        await removeMutation.mutateAsync({
          params: { path: { productId: id } },
        });
      }
      toast.success(
        adding
          ? "Məhsul sevilənlərə əlavə olundu"
          : "Məhsul sevilənlərdən çıxarıldı",
        { id: "wishlist-toast" },
      );
    } catch {
      if (adding) {
        optimisticRemove(id);
      } else {
        optimisticAdd(id);
      }
      toast.error("Bir xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.", {
        id: "wishlist-err",
      });
    }
  }, 500);

  const toggle = () => {
    if (!user) {
      toast.error("Əvvəlcə daxil olmalısınız.");
      navigate("/auth/login");
      return;
    }

    const willAdd = !isInWishlist;

    // 1. Dərhal UI-ı yenilə (optimistic)
    if (willAdd) {
      optimisticAdd(productId);
    } else {
      optimisticRemove(productId);
    }

    // 2. Arxa planda API-yə sorğu at (debounced)
    syncWithApi(productId, willAdd);
  };

  return { isInWishlist, toggle };
}
