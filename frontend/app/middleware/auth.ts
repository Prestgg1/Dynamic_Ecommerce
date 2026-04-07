import { redirect, type MiddlewareFunction } from "react-router";
import { userContext } from "~/root";

export const authMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const cookie = request.headers.get("Cookie") ?? "";

  try {
    const res = await fetch(`${process.env.VITE_API_BASE_URL}/auth/me`, {
      headers: { Cookie: cookie },
    });

    if (!res.ok) {
      return redirect(`/auth/login`);
    }

    const user = await res.json();
    context.set(userContext, user);
    return next();
  } catch (error) {
    if (error instanceof Response) throw error;
    throw redirect(`/auth/login`);
  }
};
