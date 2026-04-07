import { create } from "zustand";

interface WishlistItem {
  product?: {
    id: number;
    [key: string]: unknown;
  };
}

interface WishlistStore {
  wishlistIds: Set<number>;
  isHydrated: boolean;

  // Actions
  hydrate: (items: WishlistItem[]) => void;
  optimisticAdd: (productId: number) => void;
  optimisticRemove: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistIds: new Set(),
  isHydrated: false,

  hydrate: (items) => {
    const ids = new Set(
      items
        .map((item) => item.product?.id)
        .filter((id): id is number => id !== undefined),
    );
    set({ wishlistIds: ids, isHydrated: true });
  },

  optimisticAdd: (productId) => {
    set((state) => ({
      wishlistIds: new Set([...state.wishlistIds, productId]),
    }));
  },

  optimisticRemove: (productId) => {
    set((state) => {
      const next = new Set(state.wishlistIds);
      next.delete(productId);
      return { wishlistIds: next };
    });
  },

  isInWishlist: (productId) => {
    return get().wishlistIds.has(productId);
  },
}));
