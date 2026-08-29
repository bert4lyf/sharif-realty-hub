import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Building,
  CheckCircle2,
  ChevronDown,
  Compass,
  FileCheck,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Scale,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  ArrowRight,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { FULL_ADDRESS, SITE, whatsappHref } from "@/lib/site";
import { OFFICIAL_MEDIA } from "@/lib/media";
import { useAdmin, withImageFallback } from "@/lib/admin-store";
import { PropertyCard } from "@/components/property-card";
import type { Property } from "@/lib/types";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Sharif Realty Group Advisory" },
      {
        name: "description",
        content:
          "Welcome to Sharif Realty Group. Fiduciary real estate advisory for residential estates, commercial investments, and private transactions led by Majeed Sharif with over 35 years of market mastery.",
      },
    ],
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    icon: Award,
    title: "Our Mission",
    description:
      "With decades of trusted transactional advisory, Sharif Realty is the region's top luxury and commercial producer, delivering bespoke marketing for prestigious properties across CT & MA.",
  },
  {
    icon: Shield,
    title: "Our Values",
    description:
      "With 35+ years of experience, an impressive property portfolio, and market acumen, our fiduciary advisory is sophisticated, discrete, and steadfast in client advocacy.",
  },
  {
    icon: Compass,
    title: "Our Vision",
    description:
      "Due to our proven results, technical expertise, and relentless dedication, we maintain leadership across residential and commercial sectors, offering seamless access to off-market opportunities.",
  },
  {
    icon: Globe2,
    title: "Our Resources",
    description:
      "Proprietary off-market listings, private institutional buyer syndicates, commercial debt networks, and a deep database of verified pre-qualified buyers worldwide.",
  },
];

const FAQS = [
  {
    q: "Why can't a business or homeowner just put a 'For Sale' sign in the window?",
    a: "Selling a business or high-value real estate requires strict confidentiality to prevent staff turnover, supplier panic, or compromised negotiations. A dedicated broker vets buyers, signs binding Non-Disclosure Agreements (NDAs), verifies financial capacity, and strategically markets without alerting competitors.",
  },
  {
    q: "What geographic areas does Sharif Realty Group serve?",
    a: "We are licensed and actively represent clients across the entire state of Connecticut (License REB.0792811) and Massachusetts (License 952104), with strong dominance in Waterbury, Southington, East Hartford, Berlin, Burlington, and surrounding metros.",
  },
  {
    q: "Do you offer Islamic Financing assistance for homebuyers?",
    a: "Yes. Sharif Realty proudly connects homebuyers and commercial borrowers with verified Sharia-compliant Islamic financing institutions providing Murabaha and Ijara structured property acquisition programs.",
  },
  {
    q: "How do I schedule a confidential consultation with Majeed Sharif?",
    a: "You can call our direct office line at +1 (203) 802-8099, email SharifRealty19@gmail.com, or use our online contact form to book a private consultation at our office at 96 Beach Rd, Wolcott, CT.",
  },
];

export function AboutPage() {
  const { posts: adminPosts } = useAdmin();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      <Breadcrumbs items={[{ label: "About Us" }]} />

      {/* Hero Header with Background Image and Allys Luxury Scrim */}
      <section className="relative overflow-hidden min-h-[380px] lg:min-h-[440px] flex items-center justify-center py-20 lg:py-28 text-white bg-[#0F172A]">
        <div className="absolute inset-0 size-full">
          <img
            src="/uploads/2025/05/modern-luxury-house-with-swimming-pool-scaled.jpg"
            alt="About Sharif Realty"
            className="size-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/65 to-[#0F172A]/90" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs sm:text-sm font-serif italic text-[#C5A880] tracking-wider uppercase font-semibold max-w-2xl mx-auto"
          >
            "When a business or estate owner requires absolute discretion and fiduciary mastery."
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white capitalize"
          >
            Sharif Realty Group Heritage
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-3xl text-sm sm:text-base font-normal text-slate-200"
          >
            Bespoke Residential, Commercial, and Business Sales Across Connecticut &amp; Massachusetts
          </motion.p>
        </div>
      </section>

      {/* Narrative Section with Broker Photo */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B59]">
                Our Philosophy &amp; Brokerage Standard
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight">
                Discreet, Seasoned Representation for High-Net-Worth Owners &amp; Commercial Investors
              </h2>
              <div className="space-y-4 text-base text-slate-600 leading-relaxed font-sans">
                <p>
                  When a business or estate owner needs to transition their property, they cannot simply place a generic sign in the window. They require an experienced Real Estate &amp; Business Broker to locate, vet, and negotiate with qualified buyers without disrupting ongoing operations or market standing.
                </p>
                <p>
                  On the acquisition side, buyers and institutional syndicates need guidance to identify high-yield off-market assets matching exact portfolio criteria. Sharif Realty Group was founded on this principle: delivering uncompromising fiduciary care, complete discretion, and strategic advisory.
                </p>
                <p>
                  Whether navigating complex commercial zoning, acquiring waterfront estates, or structuring Sharia-compliant Islamic financing programs, Sharif Realty provides full-lifecycle advisory tailored to your success.
                </p>
              </div>

              {/* Badges / Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="rounded-2xl border border-[#EAE6DF] bg-white p-5 text-center shadow-sm">
                  <div className="font-serif text-3xl font-bold text-[#B38B59]">35+</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Years Experience</div>
                </div>
                <div className="rounded-2xl border border-[#EAE6DF] bg-white p-5 text-center shadow-sm">
                  <div className="font-serif text-3xl font-bold text-[#0F172A]">100%</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Fiduciary Care</div>
                </div>
                <div className="rounded-2xl border border-[#EAE6DF] bg-white p-5 text-center col-span-2 sm:col-span-1 shadow-sm">
                  <div className="font-serif text-3xl font-bold text-[#B38B59]">2 States</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">CT &amp; MA Licensed</div>
                </div>
              </div>
            </div>

            {/* Right: Principal Broker Card */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-[#EAE6DF] bg-white p-6 shadow-xl">
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-950">
                  <img
                    src="/uploads/2025/05/Sharif-Photo.jpg"
                    onError={withImageFallback}
                    alt="Majeed Sharif - Principal Broker & Founder"
                    className="size-full object-cover object-top"
                  />
                </div>

                <div className="mt-6 text-center space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-[#0F172A]">
                    Majeed Sharif
                  </h3>
                  <p className="text-sm font-semibold text-[#B38B59]">
                    Principal Broker &amp; Founder
                  </p>
                  <p className="text-xs text-slate-500">
                    CT License: REB.0792811 · MA License: 952104
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#EAE6DF] space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="size-3.5 text-[#C5A880]" />
                      <a href="tel:2038028099" className="font-semibold text-[#0F172A] hover:text-[#B38B59]">+1 (203) 802-8099</a>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="size-3.5 text-[#C5A880]" />
                      <a href="mailto:SharifRealty19@gmail.com" className="font-semibold text-[#0F172A] hover:text-[#B38B59]">SharifRealty19@gmail.com</a>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="size-3.5 text-[#C5A880]" />
                      <span>{FULL_ADDRESS}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-2">
                    <Button asChild className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl shadow-sm">
                      <Link to="/contact">
                        Contact Majeed Sharif Directly
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-20 bg-[#F3F0EA]/60 border-y border-[#EAE6DF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B59]">
              Guiding Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Mission, Values &amp; Institutional Resources
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-[#EAE6DF] bg-white p-6 shadow-sm hover:border-[#C5A880] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="size-12 rounded-xl bg-[#F3F0EA] text-[#B38B59] flex items-center justify-center mb-4">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#0F172A] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Verified Client Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[#0B1120] text-white scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
              Client Endorsements &amp; Reviews
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              What Our Clients Say
            </h2>
            <p className="text-sm text-slate-400">
              Verified experiences from estate buyers, commercial investors, and sellers across Connecticut &amp; Massachusetts.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                id: 1,
                name: "Robert Thompson",
                role: "CEO, Thompson Enterprises",
                avatar: OFFICIAL_MEDIA.client1,
                quote:
                  "\"Working with Sharif Realty was an absolute pleasure. Their team's expertise and dedication helped us find the perfect commercial property for our expanding business. The entire process was smooth and professional from start to finish.\"",
              },
              {
                id: 2,
                name: "Jennifer Williams",
                role: "Interior Designer & Homeowner",
                avatar: OFFICIAL_MEDIA.client2,
                quote:
                  "\"I've worked with several real estate agencies in the past, but none compare to the level of service and attention to detail that Sharif Realty provides. They truly understood my vision and found me a home that exceeded all my expectations.\"",
              },
              {
                id: 3,
                name: "David & Sarah Johnson",
                role: "Single Family Homeowners",
                avatar: OFFICIAL_MEDIA.client1,
                quote:
                  "\"When we decided to sell our family home of 20 years, we were nervous about the process. The team at Sharif Realty guided us every step of the way, securing a sale above asking price in just two weeks. We couldn't be happier with the results!\"",
              },
            ].map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl space-y-5 flex flex-col justify-between backdrop-blur-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="size-14 rounded-full border-2 border-[#C5A880] object-cover"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="font-serif text-base font-bold text-white">{t.name}</h3>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#C5A880]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    {t.quote}
                  </p>
                </div>

                <div className="pt-2 text-right">
                  <span className="text-[11px] font-semibold text-[#C5A880] uppercase tracking-wider">
                    Verified Client
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-white border-b border-[#EAE6DF]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B59]">
              Fiduciary Guidance
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#EAE6DF] bg-[#FAF8F5] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-[#0F172A] text-lg hover:text-[#B38B59] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-5 text-[#B38B59] shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-[#EAE6DF] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
