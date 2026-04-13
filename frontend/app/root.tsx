import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Route } from "./+types/root";
import "./app.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { useWishlistStore } from "~/store/useWishlistStore";


export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// ─── Middleware ───────────────────────────────────────────────────────────────


import { useAuthStore } from "~/store/auth.store";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async (_args, next) => {
    await next();

    const { user, setUser } = useAuthStore.getState();
    const { isHydrated, hydrate } = useWishlistStore.getState();
    
    // Auth Hydration
    if (!user) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, { credentials: "include" });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {}
    }

    // Wishlist Hydration
    if (isHydrated) return; 

    try {
      const res = await fetch("/api/wishlist", { credentials: "include" });
      if (res.ok) {
        const items = await res.json();
        hydrate(items ?? []);
      }
    } catch {}
  },
];

// ─── QueryClient ─────────────────────────────────────────────────────────────

const queryClient = new QueryClient();

// ─── Layout ──────────────────────────────────────────────────────────────────

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
              <Header />
              {children}
              <Footer />
              <Toaster position="top-right" />
          </LanguageProvider>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return <Outlet />;
}

// ─── Error Boundary ───────────────────────────────────────────────────────────

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Gözlənilməz xəta baş verdi.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Xəta";
    details =
      error.status === 404
        ? "Axtardığınız səhifə tapılmadı."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}