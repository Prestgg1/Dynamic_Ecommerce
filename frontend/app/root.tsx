import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import type { Route } from "./+types/root";
import "./app.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "react-hot-toast";
import { AuthorizedError } from "./routes/home";
import { createContext } from "react-router";
import type { User } from "./lib/trpc";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
export const userContext = createContext<User | null>(null);
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const queryClient = new QueryClient({

})

export async function loader({
  request,
  context,
}: Route.LoaderArgs) {

  const cookie = request.headers.get("Cookie") ?? "";
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
    headers: { Cookie: cookie },
  });
  if (res.ok) {
    const user = await res.json();
    return user;
  }
  return null;
}


export function Layout({ children }: React.PropsWithChildren) {
  const user = useLoaderData<typeof loader>()
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => {
    setUser(user ?? null);
  }, [user])

  return (
    <html lang="en">
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

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (error instanceof AuthorizedError) {
    return redirect("/auth/login");
  }
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
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
