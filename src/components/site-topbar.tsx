import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";

export function SiteTopbar() {
  return (
    <div className="bg-[#0b1220] text-primary-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 text-xs sm:px-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a
            href={SITE.phoneHref}
            onClick={() => track("call_click", { location: "topbar" })}
            className="link-underline inline-flex items-center gap-1.5 font-semibold tracking-wide"
          >
            <Phone className="size-3.5 text-accent" aria-hidden="true" />
            {SITE.phone}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="link-underline hidden items-center gap-1.5 text-primary-foreground/80 sm:inline-flex"
          >
            <Mail className="size-3.5 text-accent" aria-hidden="true" />
            {SITE.email}
          </a>
          <span className="hidden items-center gap-1.5 text-primary-foreground/70 lg:inline-flex">
            <MapPin className="size-3.5 text-accent" aria-hidden="true" />
            {SITE.locations.join("  |  ")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2.5">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Sharif Realty on Facebook"
              className="text-primary-foreground/70 transition-colors hover:text-accent"
            >
              <Facebook className="size-3.5" aria-hidden="true" />
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Sharif Realty on Instagram"
              className="text-primary-foreground/70 transition-colors hover:text-accent"
            >
              <Instagram className="size-3.5" aria-hidden="true" />
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Sharif Realty on LinkedIn"
              className="text-primary-foreground/70 transition-colors hover:text-accent"
            >
              <Linkedin className="size-3.5" aria-hidden="true" />
            </a>
          </span>
          <Link
            to="/list-your-property"
            className="bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-accent-foreground transition-colors hover:bg-accent/90"
          >
            List Your Property
          </Link>
        </div>
      </div>
    </div>
  );
}
