import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Home,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Search,
  Phone,
  ArrowRight,
  CheckCircle2,
  Users,
  BadgePercent,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { SITE, whatsappHref } from "@/lib/site";
import { useAdmin } from "@/lib/admin-store";
import { PropertyCard } from "@/components/property-card";
import type { Property } from "@/lib/types";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services Offered | Sharif Realty Group Advisory" },
      {
        name: "description",
        content:
          "Services Offered by Sharif Realty Group: Property Management, Mortgage Services (including Islamic Financing referrals), Strategic Real Estate Consulting, Leasing & Tenant Placement, Commercial Brokerage.",
      },
    ],
  }),
  component: ServicesPage,
});

const CORE_SERVICES = [
  {
    icon: Building2,
    badge: "Full-Service Management",
    title: "Property Management",
    description:
      "We manage luxury single-family residences, multi-unit complexes, and commercial properties. Handling rent collection, rigorous accounting, preventive maintenance, and full renovations.",
    features: [
      "Rent collection & fiduciary accounting",
      "24/7 routine & emergency maintenance repairs",
      "Full and partial rehabilitation oversight",
      "Strict seasonal property inspections",
    ],
  },
  {
    icon: BadgePercent,
    badge: "Financial Advisory",
    title: "Mortgage & Islamic Financing",
    description:
      "Whether acquiring a residential home or commercial asset, we connect clients with trusted institutional lenders and Sharia-compliant Islamic financing institutions (Murabaha/Ijara).",
    features: [
      "Residential & commercial lender syndicates",
      "Sharia-compliant Islamic financing advisory",
      "Pre-approval & interest rate optimization",
      "Refinance & equity structuring guidance",
    ],
  },
  {
    icon: Compass,
    badge: "Bespoke Consulting",
    title: "Real Estate & Acquisition Consulting",
    description:
      "Sharif Realty Group provides complimentary initial consultations for investors and estate buyers. We perform deep financial modeling and locate high-yield off-market assets.",
    features: [
      "Free Initial Strategic Acquisition Consultation",
      "Personalized criteria asset discovery",
      "Cap rate & NOI financial modeling",
      "Off-market private deal placement",
    ],
  },
  {
    icon: Users,
    badge: "Vetted Placements",
    title: "Executive Leasing & Tenant Placement",
    description:
      "Full-service leasing solutions ensuring exceptional occupancy. We perform comprehensive background, credit, eviction, and verifiable income checks for discerning landlords.",
    features: [
      "Comprehensive credit & background verification",
      "Criminal record & eviction history screening",
      "Employment & proof-of-funds verification",
      "Custom legal lease preparation & execution",
    ],
  },
  {
    icon: Briefcase,
    badge: "Commercial & Business",
    title: "Commercial Asset Brokerage",
    description:
      "Targeted commercial real estate representation for owners, corporate tenants, and institutional buyers. Specializing in retail hubs, office complexes, medical facilities, and development land.",
    features: [
      "Cap rate, NOI & valuation modeling",
      "Triple-Net (NNN) lease structuring",
      "Zoning & municipal variance representation",
      "Confidential transaction handling (NDAs)",
    ],
  },
  {
    icon: Home,
    badge: "Residential Mastery",
    title: "Residential Buying & Selling",
    description:
      "Whether purchasing your dream residence or maximizing sales proceeds, our 35+ years of market mastery across Connecticut & Massachusetts provides unmatched transactional guidance.",
    features: [
      "Custom absorption & comparative valuation",
      "Bespoke architectural photography & media",
      "Private VIP buyer network outreach",
      "Fiduciary negotiation & closing oversight",
    ],
  },
];

export function ServicesPage() {
  const { posts: adminPosts } = useAdmin();

  // Featured properties for bottom section
  const featuredProperties = adminPosts.slice(0, 3).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    price: p.price,
    status: p.propertyStatus,
    listing_type: p.listingType,
    address: p.address,
    city: p.city,
    state: p.state,
    zip: p.zip,
    beds: p.beds,
    baths: p.baths,
    sqft: p.sqft,
    latitude: p.latitude || 41.554,
    longitude: p.longitude || -73.042,
    images: p.images,
    features: p.features,
    is_featured: p.isFeatured,
    is_archived: p.status === "Draft",
    created_at: p.date,
    updated_at: p.date,
    year_built: p.yearBuilt || 2023,
    category: p.category,
    priceLabel: p.priceLabel,
  })) as Property[];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B]">
      <Breadcrumbs items={[{ label: "Services" }]} />

      {/* Hero Banner with Photography Background and Allys Luxury Scrim */}
      <section className="relative overflow-hidden min-h-[380px] lg:min-h-[440px] flex items-center justify-center py-20 lg:py-28 text-white bg-[#0F172A]">
        <div className="absolute inset-0 size-full">
          <img
            src="/uploads/2025/05/medium-shot-couple-talking-real-estate-agent-scaled.jpg"
            alt="Sharif Realty Services"
            className="size-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/65 to-[#0F172A]/90" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C5A880] mb-4"
          >
            Sharif Realty Group Advisory
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
          >
            Services Offered
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-slate-200 leading-relaxed font-sans font-normal"
          >
            Sharif Realty Group provides clients with creative, strategic, and high-touch real estate services—from acquisition to property management and investment syndication.
          </motion.p>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B59]">
              Comprehensive Portfolio Support
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Bespoke Real Estate &amp; Advisory Solutions
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tailored residential, commercial, and financial guidance rooted in over 35 years of trusted market leadership.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {CORE_SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex flex-col justify-between rounded-2xl border border-[#EAE6DF] bg-white p-8 shadow-sm hover:shadow-xl hover:border-[#C5A880] transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="size-14 rounded-2xl bg-[#F3F0EA] text-[#B38B59] flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition-all shadow-sm">
                        <Icon className="size-7" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#F3F0EA] text-[#0F172A] px-3 py-1 rounded-full border border-[#EAE6DF]">
                        {service.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-[#0F172A] group-hover:text-[#B38B59] transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mt-6 pt-6 border-t border-[#EAE6DF] space-y-2.5">
                      {service.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="size-4 text-[#B38B59] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-between border-[#EAE6DF] bg-white text-[#0F172A] hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] transition-all font-semibold text-xs uppercase tracking-wider rounded-xl shadow-sm"
                    >
                      <Link to="/contact">
                        Inquire About This Service
                        <ArrowRight className="size-4 ml-1 text-[#C5A880]" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties Showcase Section */}
      <section className="py-20 bg-[#F3F0EA]/60 border-y border-[#EAE6DF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B59]">
                Exclusive Listings
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A] mt-1">
                Featured Portfolio
              </h2>
              <p className="mt-1 text-sm text-slate-600 max-w-xl">
                Discover our handpicked portfolio of exclusive residences and commercial developments.
              </p>
            </div>

            <Button asChild className="bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl shadow-sm">
              <Link to="/properties">
                View All Properties &rarr;
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box with Office Info */}
      <section className="py-20 bg-[#0B1120] text-white relative overflow-hidden">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">Direct Advisory</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2">
            Request a Confidential Consultation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed">
            Sharif Realty Group provides complimentary initial consultations for estate sellers, acquisitions, and commercial leases. Connect directly today.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 bg-[#C5A880] hover:bg-[#B39369] text-[#0F172A] px-8 text-sm font-semibold uppercase tracking-wider rounded-xl shadow-lg"
            >
              <a href={`tel:${SITE.phone.replace(/\D/g, "")}`}>
                <Phone className="size-4 mr-2 text-[#0F172A]" />
                Call {SITE.phone}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white px-8 text-sm font-semibold rounded-xl backdrop-blur-md shadow-sm"
            >
              <Link to="/contact">
                Send Us an Inquiry
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-xs text-slate-400">
            Office: 3125 North Main St, Waterbury, CT 06704 · Mon-Fri: 9:00 AM - 6:00 PM
          </div>
        </div>
      </section>
    </div>
  );
}
