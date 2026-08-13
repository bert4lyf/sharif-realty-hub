import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  HeadContent,
  Scripts,
  ClientOnly,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Search, Building2 } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import { Analytics } from "@/components/analytics";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { localBusinessJsonLd } from "@/components/jsonld";

function NotFoundComponent() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Building2 className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-5xl font-semibold text-foreground">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-foreground">
          This address isn't on the market
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has moved or sold. Search our active listings instead.
        </p>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void navigate({ to: "/properties", search: term ? { q: term } : {} });
          }}
        >
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search by city, ZIP or address"
            aria-label="Search properties"
            maxLength={120}
          />
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Search className="size-4" aria-hidden="true" />
            Search
          </Button>
        </form>
        <div className="mt-4">
          <Link to="/properties" className="text-sm font-semibold text-accent hover:underline">
            Browse all active listings →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Button asChild variant="secondary">
            <a href="/">Go home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sharif Realty | Miami Luxury Homes & Commercial Space" },
      {
        name: "description",
        content:
          "Sharif Realty helps buyers, sellers and tenants across Miami and South Florida. Browse listings and get a reply within 15 minutes.",
      },
      { name: "author", content: "Sharif Realty" },
      { property: "og:site_name", content: "Sharif Realty" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(localBusinessJsonLd()),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col pb-16 md:pb-0">
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
        <StickyMobileCta />
      </div>
      <Toaster position="top-center" />
      <ClientOnly fallback={null}>
        <Analytics />
      </ClientOnly>
    </QueryClientProvider>
  );
}
