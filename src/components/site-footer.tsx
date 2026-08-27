import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Shield, ArrowUpRight } from "lucide-react";
import { FULL_ADDRESS, SITE } from "@/lib/site";
import { OFFICIAL_MEDIA } from "@/lib/media";
import { track } from "@/lib/analytics";

export function SiteFooter() {
  return (
    <footer className="bg-[#0B1120] text-white border-t border-white/10">
      {/* Top Footer Grid */}
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Brand & Logo */}
        <div className="space-y-4">
          <Link to="/" className="inline-block bg-white p-2.5 rounded-2xl shadow-md">
            <img
              src={OFFICIAL_MEDIA.logo}
              alt="Sharif Realty Group"
              className="h-13 w-auto object-contain"
              loading="lazy"
            />
          </Link>
          <p className="text-xs leading-relaxed text-slate-300">
            Sharif Realty Group is a premier real estate advisory specializing in bespoke luxury estates, commercial investments, and private off-market assets across Connecticut and Massachusetts.
          </p>
          <div className="flex items-center gap-2.5 pt-2">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Sharif Realty on Facebook"
              className="size-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-[#C5A880] hover:text-[#0F172A] transition-colors"
            >
              <Facebook className="size-3.5" />
            </a>
            <a
              href={SITE.social.twitter}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Sharif Realty on Twitter"
              className="size-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-[#C5A880] hover:text-[#0F172A] transition-colors"
            >
              <Twitter className="size-3.5" />
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Sharif Realty on Instagram"
              className="size-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-[#C5A880] hover:text-[#0F172A] transition-colors"
            >
              <Instagram className="size-3.5" />
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Sharif Realty on LinkedIn"
              className="size-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-[#C5A880] hover:text-[#0F172A] transition-colors"
            >
              <Linkedin className="size-3.5" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-serif text-sm font-bold tracking-widest text-[#C5A880] uppercase mb-4">
            Navigation
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li>
              <Link to="/" className="hover:text-[#C5A880] transition-colors flex items-center gap-1">
                Home Collection
              </Link>
            </li>
            <li>
              <Link to="/properties" className="hover:text-[#C5A880] transition-colors flex items-center gap-1">
                Property Portfolio
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#C5A880] transition-colors flex items-center gap-1">
                About Majeed Sharif
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-[#C5A880] transition-colors flex items-center gap-1">
                Fiduciary Services
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-[#C5A880] transition-colors flex items-center gap-1">
                Market Intelligence &amp; Blogs
              </Link>
            </li>
            <li>
              <Link to="/add-listing" className="hover:text-[#C5A880] transition-colors flex items-center gap-1">
                List Your Property
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Headquarters */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-bold tracking-widest text-[#C5A880] uppercase mb-4">
            Headquarters
          </h3>
          <p className="flex items-start gap-2.5 text-xs text-slate-300">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#C5A880]" />
            <span>{FULL_ADDRESS}</span>
          </p>
          <p className="flex items-center gap-2.5 text-xs text-slate-300">
            <Phone className="size-3.5 shrink-0 text-[#C5A880]" />
            <a
              href={SITE.phoneHref}
              onClick={() => track("call_click", { location: "footer" })}
              className="hover:text-[#C5A880] transition-colors font-semibold"
            >
              {SITE.phone}
            </a>
          </p>
          <p className="flex items-center gap-2.5 text-xs text-slate-300">
            <Mail className="size-3.5 shrink-0 text-[#C5A880]" />
            <a href={`mailto:${SITE.email}`} className="hover:text-[#C5A880] transition-colors">
              {SITE.email}
            </a>
          </p>
          <p className="flex items-center gap-2.5 text-xs text-slate-400">
            <Clock className="size-3.5 shrink-0 text-[#C5A880]" />
            <span>{SITE.hours}</span>
          </p>
        </div>

        {/* Column 4: Fiduciary Governance & Licensing */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-bold tracking-widest text-[#C5A880] uppercase mb-4">
            Licensing &amp; Trust
          </h3>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-[#C5A880] font-bold text-xs">
              <Shield className="size-3.5" />
              <span>State Licensed Brokerage</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Connecticut License: <strong>{SITE.licenses?.ct || "RES.0792184"}</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Massachusetts License: <strong>{SITE.licenses?.ma || "9563211"}</strong>
            </p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-white/10">
              35+ Years Proven Track Record
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-white/10 bg-[#070B14] py-6 text-xs text-slate-400">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Sharif Realty Group. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact Advisory
            </Link>
            <Link to="/admin/dashboard" className="text-[#C5A880] hover:underline font-semibold">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
