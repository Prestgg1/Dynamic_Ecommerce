import type { MiddlewareFunction } from "react-router";
import { redirect } from "react-router";
import { userContext } from "~/root";

export const globalMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const cookie = request.headers.get("Cookie") ?? "";

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
      headers: { Cookie: cookie },
    });

    const user = await res.json();
    console.log(user);
    context.set(userContext, user);
  } catch (error) {
    context.set(userContext, null);
  }
  next();
};
