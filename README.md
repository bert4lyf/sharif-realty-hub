# Sharif Realty Hub

Build a high-converting, ultra-fast real estate web application for "Sharif Realty" using React, Tailwind CSS, Shadcn UI, Lucide Icons, React Router, and Supabase.

### 1. Design & Layout Requirements

- Modern, luxury real estate aesthetic using dark slate (#0F172A), warm amber accents (#F59E0B), and crisp white backdrops.

- Fully responsive across mobile, tablet, and desktop viewports.

- Breadcrumb navigation component on all subpages (e.g., Home > Properties > 123 Main St).

- Custom 404 Error Page with search input and a quick link back to active listings.

- Privacy Policy Page (`/privacy-policy`) with standard real estate legal disclosures.

- Thank You Page (`/thank-you`) shown after lead form submissions, featuring next steps and direct contact links.

### 2. Homepage & Public Pages Infrastructure

- **Above-The-Fold Hero Section:** High-impact background visual with headline "Find Your Ideal Property with Sharif Realty", property type selector (Buy, Rent, Commercial), location search input, price range slider, bedroom filter, and prominent CTA ("Search Properties" & "Request Valuation").

- **Response Time Promise Banner:** Callout badge stating: "⚡ Response Guarantee: We respond to all inquiries within 15 minutes."

- **Interactive Property Search & Grid:** Listing cards with price, address, beds, baths, sqft, hover effect, badge status (For Sale/Pending), and accessible image alt text.

- **Maps + Directions Integration:** Interactive Mapbox or Google Maps component showing property locations with custom markers, popups, and a "Get Directions" link opening Google Maps.

- **Sticky Mobile CTA Bar:** Fixed bottom bar on mobile screens (<768px) with quick-action buttons ("Call Now", "WhatsApp", "Book Viewing").

- **Case Studies Section (`/case-studies`):** Showcase past sold properties with metrics (e.g., "Sold in 8 days for 102% of asking price") and client story cards.

- **FAQs Section (`/faqs`):** Accordion UI covering home buying, selling processes, closing fees, and financing questions.

- **Real Reviews & Testimonials Carousel:** Verified customer quotes with star ratings, avatar photos, and structural Schema markup support.

### 3. SEO & Analytics Infrastructure

- **Dynamic Meta & Social Sharing:** Custom metadata provider managing page titles, unique meta descriptions, and OpenGraph tags (`og:image`, `og:title`, `og:description`) on every route.

- **Local Business JSON-LD Schema:** Inject structured `RealEstateAgent` & `LocalBusiness` JSON-LD data into the `<head>` specifying business name, phone number, geo-coordinates, operating hours, and area served.

- **Robots.txt & Sitemap Generator:** Dynamic route for `/robots.txt` allowing crawler indexation.

- **Google Analytics Integration:** Context wrapper loading Google Analytics 4 (GA4) with tracking events triggered on lead form submissions, map interactions, and call clicks.

- **Internal Linking Architecture:** Contextual internal links between listing details, agent profiles, location hubs, and case studies.

### 4. Admin Dashboard & RBAC Architecture

- Protected route at `/admin` backed by Supabase Auth and Row Level Security (RLS).

- **Super Admin Role (Developer):**

  - Access to full platform settings, API key configurations (GA4 ID, Google Maps Key), RBAC user management (grant/revoke Admin or Agent status), and site analytics overview.

- **Admin Role (Majeed Sharif - Site Owner):**

  - **Property Manager:** Add, edit, archive, or feature property listings with multi-image upload placeholders.

  - **CRM & Lead Pipeline (WpEstate CRM Clone):** View incoming inquiry submissions from contact forms, filter by lead status (New, Contacted, In Contract, Closed), and assign leads to agents.

  - **Content & Reviews Manager:** Approve customer reviews, add new FAQs, and update Case Studies.

### 5. Technical Stack Components & Routing

- Routes:

  - `/` (Home)

  - `/properties` & `/properties/:id` (Listings & Property Detail)

  - `/case-studies`

  - `/faqs`

  - `/thank-you`

  - `/privacy-policy`

  - `/admin/dashboard` (Protected RBAC)

  - `/404` (Custom Not Found)

- Use Lucide icons (`Building`, `MapPin`, `Bed`, `Bath`, `Phone`, `Shield`, `Star`, `Clock`, `Search`).

- Ensure all images utilize responsive lazy loading with explicit `alt` attributes.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/96bdf159-d0db-42f8-968a-ee16ecc1867c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
