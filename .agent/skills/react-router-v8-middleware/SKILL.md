---
name: react-router-v8-auth-middleware
description: >
  Step-by-step guide for implementing authentication middleware in React Router v8
  framework mode with file-based routing. Use this skill whenever the user wants to
  protect routes, add auth guards, implement role-based access control (RBAC), or
  organize routes into public/protected groups in a React Router v8 project. Trigger
  even if the user just mentions "auth", "protected routes", "login redirect",
  "middleware", or "route guards" in a React Router context — this skill covers the
  full pattern from context setup to loader usage.
---

# React Router v8 — Auth Middleware (File-Based Routing)

This skill covers the canonical pattern for protecting routes with middleware in React Router v8 framework mode using file-based routing.

## Prerequisites

- React Router v8 with framework mode
- File-based routing (Vite plugin)
- `v8_middleware: true` flag enabled

---

## Step 1 — Enable Middleware in Config

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  future: {
    v8_middleware: true,
  },
} satisfies Config;
```

> ⚠️ Enabling this flag changes the type of the `context` parameter in loaders and actions. If you use `getLoadContext`, see Step 5.

---

## Step 2 — Create a Typed Auth Context

Middleware passes data down the chain via `context`. Create a typed context object:

```ts
// app/context/auth.ts
import { createContext } from "react-router";
import type { User } from "~/types";

export const userContext = createContext<User | null>(null);
```

---

## Step 3 — Write the Auth Middleware Function

Keep middleware functions in a dedicated folder for reuse across routes:

```ts
// app/middleware/auth.ts
import { redirect } from "react-router";
import { userContext } from "~/context/auth";
import { getUserFromSession } from "~/lib/session";

export async function authMiddleware({ request, context }) {
  const user = await getUserFromSession(request);

  if (!user) {
    // Preserve the intended destination for post-login redirect
    const returnTo = new URL(request.url).pathname;
    throw redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  // Inject user into context — available to all loaders below this middleware
  context.set(userContext, user);
}
```

---

## Step 4 — File Structure: Pathless Layout Routes (Core Pattern)

In file-based routing, **pathless layout routes** (prefixed with `_`) are the canonical way to group routes under shared middleware. They do not add a URL segment.

```
app/routes/
│
├── _public/
│   ├── _layout.tsx          ← no middleware (public)
│   ├── index.tsx            → /
│   └── about.tsx            → /about
│
├── _protected/
│   ├── _layout.tsx          ← authMiddleware applied here ✅
│   ├── dashboard.tsx        → /dashboard
│   ├── profile.tsx          → /profile
│   └── orders/
│       ├── _layout.tsx      → /orders (nested layout)
│       └── index.tsx        → /orders
│
├── _admin/
│   ├── _layout.tsx          ← authMiddleware + adminMiddleware ✅
│   └── users.tsx            → /admin/users
│
└── auth.login.tsx           → /auth/login (public)
```

**Rule:** Every route file inside `_protected/` automatically inherits the middleware from `_protected/_layout.tsx`. No per-file configuration needed.

---

## Step 5 — Export Middleware from the Layout Route

```tsx
// app/routes/_protected/_layout.tsx
import { Outlet } from "react-router";
import { authMiddleware } from "~/middleware/auth";
import type { Route } from "./+types/_layout";

// All child routes under _protected/ will pass through this middleware
export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export default function ProtectedLayout() {
  return <Outlet />;
}
```

---

## Step 6 — Consume the User in Loaders

Once middleware sets the context, any loader inside `_protected/` can read it without re-fetching:

```tsx
// app/routes/_protected/dashboard.tsx
import { userContext } from "~/context/auth";
import type { Route } from "./+types/dashboard";

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext); // already set by authMiddleware
  const orders = await getOrders(user.id);
  return { user, orders };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return <h1>Salam, {loaderData.user.name}</h1>;
}
```

---

## Role-Based Access Control (RBAC)

Chain multiple middleware functions for layered access control:

```ts
// app/middleware/admin.ts
import { redirect } from "react-router";
import { userContext } from "~/context/auth";

export async function adminMiddleware({ context }) {
  const user = context.get(userContext); // authMiddleware must run first
  if (user?.role !== "admin") throw redirect("/dashboard");
}
```

```tsx
// app/routes/_admin/_layout.tsx
import { authMiddleware } from "~/middleware/auth";
import { adminMiddleware } from "~/middleware/admin";
import type { Route } from "./+types/_layout";

// Order matters: auth first, then role check
export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  adminMiddleware,
];

export default function AdminLayout() {
  return <Outlet />;
}
```

---

## Single-Route Middleware (Without Layout Group)

If only one specific route needs auth, export middleware directly from that route file:

```tsx
// app/routes/settings.tsx
import { authMiddleware } from "~/middleware/auth";
import type { Route } from "./+types/settings";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user };
}
```

---

## Client Middleware (Optional — SPA Navigations)

Server middleware only runs when the server is hit. For SPA navigations without a loader, add `clientMiddleware` to redirect unauthenticated users before they see the page:

```tsx
// app/routes/_protected/_layout.tsx
import type { Route } from "./+types/_layout";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async (_args, next) => {
    // Read auth state from client-side store (e.g. Zustand, cookie)
    const isAuthenticated = checkAuthFromStore();
    if (!isAuthenticated) {
      throw redirect("/auth/login");
    }
    await next();
  },
];
```

---

## Middleware Execution Order

Middleware runs as a nested chain: parent → child on the way down, child → parent on the way back up.

```
GET /dashboard

Root middleware (start)
  └── _protected/_layout middleware (start)  ← authMiddleware runs here
        └── dashboard loader runs
  └── _protected/_layout middleware (end)
Root middleware (end)
```

---

## Custom Server: Update `getLoadContext`

If using a custom Express/Hono server with `getLoadContext`, return a `RouterContextProvider` instead of a plain object:

```ts
// server.ts
import { createContext, RouterContextProvider } from "react-router";
import { createDb } from "./db";

const dbContext = createContext<Database>();

function getLoadContext(req, res) {
  const context = new RouterContextProvider();
  context.set(dbContext, createDb());
  return context;
}
```

---

## Quick Reference

| Use Case                       | Where to Put Middleware                      |
| ------------------------------ | -------------------------------------------- |
| All authenticated routes       | `_protected/_layout.tsx`                     |
| Admin-only routes              | `_admin/_layout.tsx` with chained middleware |
| Single route guard             | Directly in that route file                  |
| SPA nav guard (no loader)      | `clientMiddleware` in layout                 |
| Seed shared data (db, session) | `getLoadContext` in custom server            |

---

## Common Mistakes

- **Do not** use `useContext` or React hooks inside middleware — it runs on the server, not in a component.
- **Do not** try to read `context` before the middleware that sets it has run — order in the chain matters.
- **Do not** forget to add the `v8_middleware: true` flag — without it, the `middleware` export is silently ignored.
- **Do not** put protected and public routes in the same pathless layout group — they will all inherit the middleware.
