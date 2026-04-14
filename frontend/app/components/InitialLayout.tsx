import { useEffect } from "react";
import { Outlet } from "react-router";
import { trpc } from "~/lib/trpc";
import { useAuthStore } from "~/store/auth.store";
import { useWishlistStore } from "~/store/useWishlistStore";

export default function InitialLayout({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  const { hydrate } = useWishlistStore();

  const { data: userData } = trpc.useQuery('get', '/auth/me');
  const { data: wishlistData } = trpc.useQuery('get', '/wishlist');

  useEffect(() => {
    if (userData) setUser(userData);
  }, [userData]);

  useEffect(() => {
    if (wishlistData) hydrate(wishlistData);
  }, [wishlistData]);

  return <>{children}</>;
}