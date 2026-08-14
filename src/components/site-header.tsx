import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";

const NAV = [
  { to: "/properties", label: "Properties" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/faqs", label: "FAQs" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
          <span className="flex size-9 items-center justify-center bg-accent text-accent-foreground">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold">Sharif Realty</span>
            <span className="eyebrow block text-accent">Miami · Luxury Homes</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="link-underline text-xs font-bold uppercase tracking-widest text-primary-foreground/80 transition-colors hover:text-accent"
              activeProps={{ className: "text-accent" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" className="text-primary-foreground hover:text-accent">
            <a href={SITE.phoneHref} onClick={() => track("call_click", { location: "header" })}>
              <Phone className="size-4" aria-hidden="true" />
              {SITE.phone}
            </a>
          </Button>
          <Button asChild className="bg-accent text-xs font-bold uppercase tracking-widest text-accent-foreground hover:bg-accent/90">
            <Link to="/properties">Browse Listings</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-sm border border-primary-foreground/20 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-primary-foreground/10 md:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-primary-foreground/10 py-3 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={SITE.phoneHref}
              className="py-3 text-sm font-semibold text-accent"
              onClick={() => track("call_click", { location: "mobile_menu" })}
            >
              Call {SITE.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
