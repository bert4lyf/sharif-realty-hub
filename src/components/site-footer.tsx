import { Link } from "@tanstack/react-router";
import { Building2, Clock, Mail, MapPin, Phone, Shield } from "lucide-react";
import { FULL_ADDRESS, SITE } from "@/lib/site";
import { track } from "@/lib/analytics";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold">Sharif Realty</span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/70">
            A boutique South Florida brokerage led by {SITE.owner}. We price correctly, market
            aggressively, and answer every inquiry within 15 minutes.
          </p>
          <p className="flex items-center gap-2 text-sm text-primary-foreground/70">
            <Shield className="size-4 text-accent" aria-hidden="true" />
            Licensed Florida real estate brokerage · Equal Housing Opportunity
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="eyebrow text-accent">Explore</h2>
          <ul className="space-y-2 text-sm text-primary-foreground/75">
            <li>
              <Link to="/properties" className="hover:text-accent">
                All Listings
              </Link>
            </li>
            <li>
              <Link to="/case-studies" className="hover:text-accent">
                Case Studies
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="hover:text-accent">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-accent">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-accent">
                Team Login
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="eyebrow text-accent">Contact</h2>
          <ul className="space-y-3 text-sm text-primary-foreground/75">
            <li>
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 hover:text-accent"
                onClick={() => track("call_click", { location: "footer" })}
              >
                <Phone className="size-4 text-accent" aria-hidden="true" />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-accent">
                <Mail className="size-4 text-accent" aria-hidden="true" />
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{FULL_ADDRESS}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{SITE.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-6">
        <p className="mx-auto max-w-7xl px-4 text-xs text-primary-foreground/55 sm:px-6">
          © {new Date().getFullYear()} Sharif Realty. All rights reserved. Listing information is
          deemed reliable but not guaranteed and should be independently verified.
        </p>
      </div>
    </footer>
  );
}
