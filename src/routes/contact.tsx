import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FULL_ADDRESS, SITE } from "@/lib/site";
import { useAdmin } from "@/lib/admin-store";
import { PropertyCard } from "@/components/property-card";
import type { Property } from "@/lib/types";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Sharif Realty Group Advisory" },
      {
        name: "description",
        content:
          "Connect with Sharif Realty Group for private consultations, property valuations, acquisition mandates, and property management inquiries.",
      },
    ],
  }),
  component: ContactPage,
});

export function ContactPage() {
  const { siteOptions, addLead, posts: adminPosts } = useAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error("Please fill in your first name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      addLead({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone || "Not provided",
        property: "General Contact Form Inquiry",
        message: formData.message,
        agent: "Majeed Sharif",
        status: "New",
      });

      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to Majeed Sharif.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      toast.error("Error sending message. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B]">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />

      {/* Hero Header with Photography Background and Luxury Scrim */}
      <section className="relative overflow-hidden min-h-[380px] lg:min-h-[440px] flex items-center justify-center py-16 lg:py-24 text-white bg-[#0F172A]">
        <div className="absolute inset-0 size-full">
          <img
            src="/uploads/2025/05/realtor-making-deal-with-customer-office-scaled.jpg"
            alt="Contact Sharif Realty"
            className="size-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/70 to-[#0F172A]/90" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#C5A880] mb-3"
          >
            Direct Client Concierge
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
          >
            How Can We Assist You?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-200 font-sans"
          >
            Connect directly with principal broker Majeed Sharif for discreet acquisition advisory, property listings, and portfolio management.
          </motion.p>
        </div>
      </section>

      {/* Main Section: Form + Visit Our Office */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7 rounded-2xl border border-[#EAE6DF] bg-white p-8 sm:p-10 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B59]">Inquiry Form</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">
                  Send Us A Message
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Fill out your details below and our advisory team will respond promptly.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-3">
                  <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-2xl font-bold text-emerald-900">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Majeed Sharif has received your message and will contact you directly within 24 hours.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="mt-4 rounded-xl"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        First Name <span className="text-[#B38B59]">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                        className="h-12 border-[#EAE6DF] bg-[#FAF8F5] text-slate-900 rounded-xl focus-visible:ring-[#C5A880] focus-visible:border-[#C5A880]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        className="h-12 border-[#EAE6DF] bg-[#FAF8F5] text-slate-900 rounded-xl focus-visible:ring-[#C5A880] focus-visible:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Email Address <span className="text-[#B38B59]">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="h-12 border-[#EAE6DF] bg-[#FAF8F5] text-slate-900 rounded-xl focus-visible:ring-[#C5A880] focus-visible:border-[#C5A880]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(203) 802-8099"
                        className="h-12 border-[#EAE6DF] bg-[#FAF8F5] text-slate-900 rounded-xl focus-visible:ring-[#C5A880] focus-visible:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Message <span className="text-[#B38B59]">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please let us know how we can assist you with your residential, commercial, or property management needs..."
                      className="border-[#EAE6DF] bg-[#FAF8F5] text-slate-900 rounded-xl focus-visible:ring-[#C5A880] focus-visible:border-[#C5A880]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-serif text-base font-semibold uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    {isSubmitting ? "Sending..." : "Send Your Message"}
                    <Send className="size-4 ml-2 text-[#C5A880]" />
                  </Button>
                </form>
              )}
            </div>

            {/* Right: Visit Our Office Card & Map */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B59]">
                    Headquarters
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0F172A] mt-1">
                    Visit Our Office
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-slate-700">
                  <div className="flex items-start gap-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                    <MapPin className="size-5 text-[#B38B59] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Office Address</span>
                      <p className="font-semibold text-slate-900">3125 North Main St, Waterbury, CT 06704.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                    <Phone className="size-5 text-[#B38B59] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Direct Phone</span>
                      <a href="tel:2038028099" className="font-serif text-base font-bold text-[#0F172A] hover:text-[#B38B59]">
                        +1 (203) 802-8099
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                    <Mail className="size-5 text-[#B38B59] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Email</span>
                      <a href="mailto:SharifRealty19@gmail.com" className="font-semibold text-slate-900 hover:text-[#B38B59]">
                        SharifRealty19@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                    <Clock className="size-5 text-[#B38B59] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Office Hours</span>
                      <p className="font-semibold text-slate-900">Mon-Fri: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Google Maps Embed for 3125 North Main St Waterbury CT */}
                <div className="overflow-hidden rounded-2xl border border-[#EAE6DF] aspect-[16/10] bg-slate-100 shadow-sm">
                  <iframe
                    title="Sharif Realty Office Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2984.887640248231!2d-73.04169722346614!3d41.57169888456102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e7c00e1cf3e7ef%3A0x446e16ad71597f80!2s3125%20N%20Main%20St%2C%20Waterbury%2C%20CT%2006704!5e0!3m2!1sen!2sus!4v1700000000000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-[#F3F0EA]/60 border-t border-[#EAE6DF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B59]">
                Exclusive Portfolio
              </span>
              <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#0F172A]">
                Featured Properties
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Discover our handpicked portfolio of exclusive residences and commercial opportunities.
              </p>
            </div>

            <Button asChild className="bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl shadow-sm">
              <Link to="/properties">
                Browse All Properties &rarr;
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
    </div>
  );
}
