import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { OFFICIAL_MEDIA } from "@/lib/media";
import { track } from "@/lib/analytics";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/blogs", label: "Blog" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF8F5]/95 text-[#1E293B] shadow-sm backdrop-blur-md border-b border-[#EAE6DF]/90 py-2"
          : "bg-[#FAF8F5]/90 text-[#1E293B] backdrop-blur-sm border-b border-[#EAE6DF]/60 py-3.5"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Logo on the Left */}
        <Link
          to="/"
          className="flex items-center group transition-transform duration-300 hover:scale-[1.02]"
          aria-label={`${SITE.name} home`}
        >
          <img
            src={OFFICIAL_MEDIA.logo}
            alt="Sharif Realty Group"
            className="h-13 sm:h-15 md:h-16 w-auto object-contain transition-all"
            fetchPriority="high"
          />
        </Link>

        {/* Center Navigation Menu: Home, Properties, About Us, Services, Blog */}
        <nav aria-label="Main Navigation" className="hidden items-center gap-7 lg:gap-10 md:flex">
          {NAV.map((item) => {
            const isHome = item.to === "/";
            const active = isHome
              ? pathname === "/"
              : pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`font-serif text-[16px] tracking-tight font-semibold transition-all relative py-1 ${
                  active
                    ? "text-[#B38B59] font-bold"
                    : "text-slate-700 hover:text-[#B38B59]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A880] rounded-full animate-in fade-in" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons: Add Listing (Deep Navy) & Contact Us (Outline) */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            className="h-10 bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Link to="/add-listing">
              <Plus className="size-3.5 mr-1 stroke-[2.5] text-[#C5A880]" />
              Add Listing
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-10 border border-[#EAE6DF] hover:bg-[#F3F0EA] text-[#0F172A] px-5 rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Link to="/contact">
              Contact Us
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-[#EAE6DF] text-slate-800 md:hidden hover:bg-[#F3F0EA] transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5 text-[#B38B59]" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Slide-down Drawer */}
      {open && (
        <div className="border-t border-[#EAE6DF] bg-[#FAF8F5] px-6 py-5 md:hidden animate-in slide-in-from-top-2 shadow-xl">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2">
            {NAV.map((item) => {
              const isHome = item.to === "/";
              const active = isHome ? pathname === "/" : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 font-serif text-base font-semibold transition-colors ${
                    active
                      ? "bg-[#F3F0EA] text-[#B38B59] font-bold"
                      : "text-slate-800 hover:bg-[#F3F0EA] hover:text-[#B38B59]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-[#EAE6DF] space-y-3">
              <Button
                asChild
                className="w-full h-11 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm rounded-xl shadow-sm"
              >
                <Link to="/add-listing" onClick={() => setOpen(false)}>
                  <Plus className="size-4 mr-1.5 text-[#C5A880]" /> Add Listing
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full h-11 border border-[#EAE6DF] hover:bg-[#F3F0EA] text-[#0F172A] font-semibold text-sm rounded-xl"
              >
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Contact Us
                </Link>
              </Button>

              <a
                href={SITE.phoneHref}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#F3F0EA] py-3 text-xs font-semibold text-[#0F172A]"
                onClick={() => track("call_click", { location: "mobile_header" })}
              >
                <Phone className="size-3.5 text-[#B38B59]" />
                Direct Advisory: {SITE.phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
