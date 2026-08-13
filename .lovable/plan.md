# Sharif Realty — Luxury Real Estate Platform

A fast, SEO-strong real estate site with public listings, lead capture, and a role-based admin back office.

Two notes up front:
- Routing uses TanStack Router (this stack's built-in router) instead of React Router — same URLs, same behavior.
- Maps: interactive Google/Mapbox maps need an API key. Phase 1 ships a static, styled location card with a working "Get Directions" link to Google Maps; I'll wire the live interactive map as soon as you add a key (configurable from the Super Admin settings screen).

## Design direction

- Dark slate `#0F172A` surfaces, warm amber `#F59E0B` accents, crisp white content areas — all as semantic tokens (light + dark safe).
- Editorial-luxury type pairing, generous spacing, large photography, subtle hover lift on cards.
- Responsive at mobile / tablet / desktop; sticky bottom action bar under 768px (Call, WhatsApp, Book Viewing).
- Breadcrumbs on every subpage, lazy-loaded images with real alt text, Lucide icons throughout.

## Public pages

- `/` — hero with headline "Find Your Ideal Property with Sharif Realty", search panel (Buy/Rent/Commercial, location, price range slider, bedrooms), CTAs "Search Properties" and "Request Valuation"; 15-minute response guarantee banner; featured listings; testimonials carousel with star ratings; location + directions block; lead form.
- `/properties` — filterable, sortable grid: price, address, beds, baths, sqft, status badge (For Sale / Pending / Sold).
- `/properties/:id` — gallery, full specs, description, agent card, location + Get Directions, inquiry form, internal links to related listings and case studies.
- `/case-studies` — sold-property results cards with metrics ("Sold in 8 days for 102% of asking") and client stories.
- `/faqs` — accordion: buying, selling, closing costs, financing.
- `/thank-you` — post-submission next steps plus call / WhatsApp / email links.
- `/privacy-policy` — standard real estate disclosures (data use, cookies, fair housing, IDX/listing disclaimer).
- 404 — custom page with search input and a link back to active listings.

## Lead capture and SEO

- Every inquiry form writes a lead to the database, then redirects to `/thank-you`. Client and server validation, length limits, no sensitive logging.
- Per-route titles, descriptions, and OpenGraph/Twitter tags; `RealEstateAgent` + `LocalBusiness` JSON-LD with phone, geo, hours, area served; review schema on testimonials; `/robots.txt` and a generated `/sitemap.xml`.
- GA4 loaded from a configurable measurement ID, with events on lead submit, map/directions clicks, and call clicks.

## Admin (`/admin/dashboard`)

Email/password sign-in, protected routes, roles stored in a separate roles table with server-side checks.

- Super Admin: platform settings (GA4 ID, Maps key), user role grant/revoke, analytics overview.
- Admin (site owner): Property Manager (add / edit / archive / feature, multi-image upload), CRM lead pipeline (New → Contacted → In Contract → Closed, filter and assign to agents), Content manager (approve reviews, edit FAQs and case studies).

## Technical notes

- Enable Lovable Cloud for database, auth, and image storage.
- Tables: `properties`, `property_images`, `leads`, `reviews`, `faqs`, `case_studies`, `agents`, `site_settings`, `profiles`, `user_roles` (+ `app_role` enum and a `has_role` security-definer function). RLS on all: public read only for published/approved rows, owner/admin-only writes, leads insertable by anyone but readable only by admins.
- Seeded demo content (properties with images, reviews, FAQs, case studies) in the migration so the site looks complete on first load.
- Data access via typed server functions; public reads stay public so listing pages render server-side for crawlers.
- Shared components: `Breadcrumbs`, `PropertyCard`, `SearchPanel`, `StickyMobileCTA`, `LeadForm`, `TestimonialCarousel`, `SeoHead`/JSON-LD helpers, admin table + dialog primitives.

## Build order

1. Cloud enablement, schema, RLS, seed data.
2. Design tokens, layout shell, breadcrumbs, footer, sticky mobile CTA.
3. Home, properties list, property detail.
4. Case studies, FAQs, thank-you, privacy, 404.
5. SEO, JSON-LD, robots, sitemap, GA4.
6. Auth, roles, admin dashboard (properties, CRM, content, settings).
