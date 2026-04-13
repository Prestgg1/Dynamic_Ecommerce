import { redirect, type MiddlewareFunction } from "react-router";
import { useAuthStore } from "~/store/auth.store";

export const authMiddleware: MiddlewareFunction = async ({ request }, next) => {
  const { user, setUser } = useAuthStore.getState();

  // If already in store, we trust it (or we could re-verify)
  if (user) {
    return next();
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
      credentials: "include",
    });

    if (!res.ok) {
      return redirect("/auth/login");
    }

    const userData = await res.json();
    setUser(userData);
    return next();
  } catch (error) {
    if (error instanceof Response) throw error;
    return redirect("/auth/login");
  }
};
