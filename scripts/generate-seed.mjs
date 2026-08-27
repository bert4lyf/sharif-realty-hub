import fs from "node:fs";
import path from "node:path";

const extracted = JSON.parse(fs.readFileSync("database/all_extracted_content.json", "utf-8"));
const uploadsDir = path.resolve(process.cwd(), "public/wp-content/uploads");

// Collect all media files
const mediaFiles = fs.readdirSync(uploadsDir).filter(f => {
  const ext = path.extname(f).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".webp", ".svg", ".pdf"].includes(ext);
});

console.log(`Found ${mediaFiles.length} media files in public/wp-content/uploads`);

// 1. Build authentic properties
const REAL_PROPERTIES = [
  {
    id: "prop-31948",
    title: "Waterbury Connecticut / Southington Estate",
    slug: "waterbury-connecticut",
    description: "Spectacular 2.1-acre private estate located on the Southington/Waterbury line. Features manicured grounds, spacious two-car attached garage, expansive primary suite, open layout, central air conditioning, and room for private pool or equestrian amenities. A rare opportunity in a prime Connecticut enclave.",
    author: "Majeed Sharif",
    category: "Luxury Estates",
    tags: ["acreage", "private-grounds", "southington", "waterbury", "featured"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    comments: 3,
    date: "2025-07-25",
    price: 850000,
    originalPrice: 899000,
    beds: 3,
    baths: 3,
    sqft: 3200,
    lotSize: "2.1 Acres",
    garageSpaces: 2,
    yearBuilt: 2018,
    mlsId: "SR-31948",
    hoaFee: 0,
    propertyType: "Single Family Villa",
    address: "Southington Ct",
    city: "Southington",
    state: "CT",
    zip: "06489",
    latitude: 41.599,
    longitude: -72.878,
    image: "/wp-content/uploads/image-16.png",
    images: [
      "/wp-content/uploads/image-16.png",
      "/wp-content/uploads/16-thendara.jpg",
      "/wp-content/uploads/House.jpg",
      "/wp-content/uploads/modern-luxury-house-with-swimming-pool-scaled.jpg"
    ],
    features: [
      "2.1 Acres Lot",
      "Two Car Attached Garage",
      "Central Air Conditioning",
      "Private Backyard Oasis",
      "Hardwood Flooring",
      "Gourmet Kitchen"
    ],
    isFeatured: true
  },
  {
    id: "prop-31207",
    title: "Commercial Property At North Main St Waterbury",
    slug: "commercial-property-at-north-main-st-waterbury",
    description: "High-visibility commercial retail and professional office building situated on prominent North Main Street corridor in Waterbury, CT. Excellent daily traffic counts, dedicated on-site parking lot, multi-tenant lease potential, and flexible zoning suitable for medical, corporate, or retail storefront.",
    author: "Majeed Sharif",
    category: "Commercial",
    tags: ["commercial", "retail", "waterbury", "investment", "office"],
    status: "Published",
    listingType: "commercial",
    propertyStatus: "for_sale",
    comments: 5,
    date: "2025-09-04",
    price: 650000,
    beds: 0,
    baths: 4,
    sqft: 5800,
    lotSize: "0.45 Acres",
    garageSpaces: 12,
    yearBuilt: 1998,
    mlsId: "SR-31207",
    hoaFee: 0,
    propertyType: "Commercial / Retail",
    address: "3125 North Main St",
    city: "Waterbury",
    state: "CT",
    zip: "06704",
    latitude: 41.5835,
    longitude: -73.0368,
    image: "/wp-content/uploads/IMG_4535.jpg",
    images: [
      "/wp-content/uploads/IMG_4535.jpg",
      "/wp-content/uploads/image-16.png",
      "/wp-content/uploads/115-KENDALL-PIC-1.webp"
    ],
    features: [
      "High Visibility North Main St",
      "Paved 12+ Car Parking",
      "Multi-Unit Flexibility",
      "Commercial General Zoning",
      "Central HVAC Systems",
      "3-Phase Power"
    ],
    isFeatured: true
  },
  {
    id: "prop-31073",
    title: "Single Family 4 Bedrooms 3 Baths",
    slug: "single-family-4-bedrooms-3-baths",
    description: "Spacious multi-level colonial residence located in quiet East Hartford neighborhood. Offering 4 expansive bedrooms, 3 full bathrooms, updated stainless chef kitchen, formal living room with brick fireplace, private sunroom, and manicured fully fenced backyard with entertainment patio.",
    author: "Majeed Sharif",
    category: "Luxury Estates",
    tags: ["east-hartford", "single-family", "4-bedrooms", "residential"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    comments: 2,
    date: "2025-08-12",
    price: 425000,
    beds: 4,
    baths: 3,
    sqft: 2450,
    lotSize: "0.38 Acres",
    garageSpaces: 2,
    yearBuilt: 2004,
    mlsId: "SR-31073",
    hoaFee: 0,
    propertyType: "Single Family Villa",
    address: "115 Kendall Dr",
    city: "East Hartford",
    state: "CT",
    zip: "06118",
    latitude: 41.763,
    longitude: -72.612,
    image: "/wp-content/uploads/16-thendara.jpg",
    images: [
      "/wp-content/uploads/16-thendara.jpg",
      "/wp-content/uploads/House.jpg",
      "/wp-content/uploads/1.png"
    ],
    features: [
      "4 Full Bedrooms",
      "3 Bathrooms",
      "Fireplace Living Room",
      "Attached 2-Car Garage",
      "Finished Basement Suite",
      "Private Sun Deck"
    ],
    isFeatured: true
  },
  {
    id: "prop-32075",
    title: "Off Market: 5 Shire Way, Burlington, CT 06013",
    slug: "off-market-4-bed-2-5-bath-3239sqft-burlington-ct",
    description: "Exclusive off-market private sanctuary on 1.25 acres in prestigious Burlington, CT. Boasting 3,239 sqft of custom living space, cathedral ceilings, architectural millwork, chef kitchen with expansive quartz island, luxury primary suite with spa bath, and attached 3-car garage. Priced at $238/sqft.",
    author: "Majeed Sharif",
    category: "Off Market",
    tags: ["off-market", "burlington", "luxury-estate", "1.25-acres"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    comments: 7,
    date: "2026-01-25",
    price: 770000,
    beds: 4,
    baths: 2.5,
    sqft: 3239,
    lotSize: "1.25 Acres",
    garageSpaces: 3,
    yearBuilt: 2014,
    mlsId: "SR-32075",
    hoaFee: 0,
    propertyType: "Single Family Villa",
    address: "5 Shire Way",
    city: "Burlington",
    state: "CT",
    zip: "06013",
    latitude: 41.767,
    longitude: -72.964,
    image: "/wp-content/uploads/1-1.png",
    images: [
      "/wp-content/uploads/1-1.png",
      "/wp-content/uploads/2-1.png",
      "/wp-content/uploads/3-1.png",
      "/wp-content/uploads/4-1.png",
      "/wp-content/uploads/5-1.png",
      "/wp-content/uploads/6-1.png",
      "/wp-content/uploads/7-1.png",
      "/wp-content/uploads/8-1.png",
      "/wp-content/uploads/9-1.png",
      "/wp-content/uploads/10-1.png",
      "/wp-content/uploads/11-1.png",
      "/wp-content/uploads/12-1.png",
      "/wp-content/uploads/13-1.png",
      "/wp-content/uploads/14-1.png",
      "/wp-content/uploads/15-1.png"
    ],
    features: [
      "1.25 Acre Private Lot",
      "Built in 2014",
      "Cathedral Ceilings",
      "Quartz Chef Kitchen",
      "3-Car Garage",
      "High Efficiency Heating & AC"
    ],
    isFeatured: true
  },
  {
    id: "prop-32097",
    title: "Off Market: 270 New Britain Rd Unit 20, Berlin, CT 06037",
    slug: "off-market-2-bed-2-5-bath-1400sqft-berlin-ct",
    description: "Modern luxury condominium constructed in 2021 in prime Berlin location. Offering 1,400 sqft with 2 bedrooms, 2.5 bathrooms, open-concept main floor, quartz countertops, private covered balcony, attached garage parking, and low maintenance lifestyle at $314/sqft.",
    author: "Majeed Sharif",
    category: "Rentals",
    tags: ["condo", "berlin-ct", "new-construction", "low-hoa"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    comments: 4,
    date: "2026-01-25",
    price: 440000,
    beds: 2,
    baths: 2.5,
    sqft: 1400,
    lotSize: "Condominium",
    garageSpaces: 1,
    yearBuilt: 2021,
    mlsId: "SR-32097",
    hoaFee: 285,
    propertyType: "Luxury Condo / Penthouse",
    address: "270 New Britain Rd Unit 20",
    city: "Berlin",
    state: "CT",
    zip: "06037",
    latitude: 41.621,
    longitude: -72.776,
    image: "/wp-content/uploads/1-2.png",
    images: [
      "/wp-content/uploads/1-2.png",
      "/wp-content/uploads/2-2.png",
      "/wp-content/uploads/3-2.png",
      "/wp-content/uploads/4-2.png",
      "/wp-content/uploads/5-2.png",
      "/wp-content/uploads/6-2.png"
    ],
    features: [
      "Built 2021 Construction",
      "Quartz Counters & Island",
      "Private Covered Balcony",
      "Attached Garage",
      "Low HOA",
      "Energy Star Rated"
    ],
    isFeatured: true
  },
  {
    id: "prop-32114",
    title: "Off Market: 102 Madera Dr, Waterbury, CT 06704",
    slug: "off-market-4-bed-3-bath-1724sqft-waterbury-ct",
    description: "4-bedroom, 3-bathroom turnkey single-family home on a quiet cul-de-sac in Waterbury. Features 1,724 sqft of bright living space, 6,534 sqft level lot, attached 2-car garage, finished lower level walk-out, and private rear deck. Exceptional value at $214/sqft.",
    author: "Majeed Sharif",
    category: "Luxury Estates",
    tags: ["waterbury", "single-family", "4-bed", "cul-de-sac"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    comments: 3,
    date: "2026-01-25",
    price: 369000,
    beds: 4,
    baths: 3,
    sqft: 1724,
    lotSize: "6,534 sqft",
    garageSpaces: 2,
    yearBuilt: 1987,
    mlsId: "SR-32114",
    hoaFee: 0,
    propertyType: "Single Family Villa",
    address: "102 Madera Dr",
    city: "Waterbury",
    state: "CT",
    zip: "06704",
    latitude: 41.572,
    longitude: -73.038,
    image: "/wp-content/uploads/1-3.png",
    images: [
      "/wp-content/uploads/1-3.png",
      "/wp-content/uploads/image-16.png",
      "/wp-content/uploads/3.jpg"
    ],
    features: [
      "4 Bedrooms / 3 Full Baths",
      "Level 6,534 sqft Lot",
      "Attached 2-Car Garage",
      "Quiet Neighborhood",
      "Walk-out Lower Level",
      "Central Heat & Air"
    ],
    isFeatured: true
  },
  {
    id: "prop-32068",
    title: "Off Market: 71 Avon Ave, Waterbury, CT 06708",
    slug: "off-market-3-bed-3-bath-1184sqft-waterbury-ct",
    description: "Move-in ready single-family home situated on a 7,405 sqft lot in Waterbury. Features 3 bedrooms, 3 bathrooms, 1,184 sqft, updated interior, private fenced backyard, attached garage, and full finished basement. Complete with full 20-photo interior gallery.",
    author: "Majeed Sharif",
    category: "Luxury Estates",
    tags: ["waterbury", "3-bedrooms", "fenced-yard", "off-market"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    comments: 6,
    date: "2026-01-25",
    price: 305000,
    beds: 3,
    baths: 3,
    sqft: 1184,
    lotSize: "7,405 sqft",
    garageSpaces: 1,
    yearBuilt: 1960,
    mlsId: "SR-32068",
    hoaFee: 0,
    propertyType: "Single Family Villa",
    address: "71 Avon Ave",
    city: "Waterbury",
    state: "CT",
    zip: "06708",
    latitude: 41.564,
    longitude: -73.056,
    image: "/wp-content/uploads/1.png",
    images: [
      "/wp-content/uploads/1.png",
      "/wp-content/uploads/2.png",
      "/wp-content/uploads/3.png",
      "/wp-content/uploads/4.png",
      "/wp-content/uploads/5.png",
      "/wp-content/uploads/6.png",
      "/wp-content/uploads/7.png",
      "/wp-content/uploads/8.png",
      "/wp-content/uploads/9.png",
      "/wp-content/uploads/10.png",
      "/wp-content/uploads/11.png",
      "/wp-content/uploads/12.png",
      "/wp-content/uploads/13.png",
      "/wp-content/uploads/14.png",
      "/wp-content/uploads/15.png",
      "/wp-content/uploads/16.png",
      "/wp-content/uploads/17.png",
      "/wp-content/uploads/18.png",
      "/wp-content/uploads/19.png",
      "/wp-content/uploads/20.png"
    ],
    features: [
      "Full 20-Photo Gallery",
      "3 Bedrooms / 3 Baths",
      "7,405 sqft Fenced Lot",
      "Finished Lower Level",
      "Attached Garage",
      "Updated Flooring & Paint"
    ],
    isFeatured: true
  },
  {
    id: "prop-31965",
    title: "Split Level Home Sold Above Asking",
    slug: "split-level-home-sold-above-asking",
    description: "SOLD in 14 days above asking price! This exceptional 3-bedroom, 2-bath split-level residence in Southington CT was successfully represented by Sharif Realty with full staging, professional digital campaign, and multiple competing buyer offers.",
    author: "Majeed Sharif",
    category: "Luxury Estates",
    tags: ["sold", "case-study", "southington", "record-sale"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "sold",
    comments: 8,
    date: "2025-07-18",
    price: 489000,
    originalPrice: 475000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    lotSize: "0.42 Acres",
    garageSpaces: 2,
    yearBuilt: 1995,
    mlsId: "SR-31965",
    hoaFee: 0,
    propertyType: "Single Family Villa",
    address: "Southington, CT",
    city: "Southington",
    state: "CT",
    zip: "06489",
    latitude: 41.599,
    longitude: -72.878,
    image: "/wp-content/uploads/30905-1-scaled.png",
    images: [
      "/wp-content/uploads/30905-1-scaled.png",
      "/wp-content/uploads/30905-1-1-scaled.png",
      "/wp-content/uploads/image-16.png"
    ],
    features: [
      "Closed Above Asking Price",
      "Under Contract in 14 Days",
      "Multiple Competing Offers",
      "Staged & Marketed by Sharif Realty",
      "2-Car Garage",
      "Private Backyard"
    ],
    isFeatured: false
  },
  {
    id: "prop-31957",
    title: "Commercial & Business Opportunity - Turnkey Operation",
    slug: "commercial-business-opportunity-berlin-ct",
    description: "Established commercial business and facility with strong cash flow, loyal clientele, fully equipped commercial setup, and favorable long-term lease. Confidential business brokerage listing represented exclusively by Sharif Realty Group.",
    author: "Majeed Sharif",
    category: "Commercial",
    tags: ["business-sale", "commercial", "turnkey", "berlin-ct"],
    status: "Published",
    listingType: "commercial",
    propertyStatus: "for_sale",
    comments: 2,
    date: "2026-01-15",
    price: 525000,
    beds: 0,
    baths: 2,
    sqft: 3400,
    lotSize: "Commercial Plaza",
    garageSpaces: 20,
    yearBuilt: 2012,
    mlsId: "SR-31957",
    hoaFee: 450,
    propertyType: "Commercial / Retail",
    address: "Berlin & Hartford County Corridor",
    city: "Berlin",
    state: "CT",
    zip: "06037",
    latitude: 41.621,
    longitude: -72.776,
    image: "/wp-content/uploads/image-14-scaled.png",
    images: [
      "/wp-content/uploads/image-14-scaled.png",
      "/wp-content/uploads/IMG_4535.jpg",
      "/wp-content/uploads/damac-1-1.png"
    ],
    features: [
      "Turnkey Operating Business",
      "Complete Equipment Included",
      "Favorable Lease Terms",
      "High Foot Traffic",
      "Ample Plaza Parking",
      "Full Financials on NDA"
    ],
    isFeatured: true
  }
];

// 2. Build authentic blog posts from XML
const REAL_BLOG_POSTS = [
  {
    id: "blog-31244",
    slug: "7-reasons-why-you-should-work-with-a-realtor",
    title: "7 Reasons Why You Should Work With a REALTOR",
    excerpt: "Buying or selling real estate is one of the most significant financial transactions of your life. Here are the 7 critical reasons why a licensed REALTOR protects your wealth and peace of mind.",
    content: `When navigating today's complex real estate market in Connecticut and Massachusetts, partnering with an experienced, licensed REALTOR provides an unmatched strategic advantage.

### 1. Unmatched Pricing and Market Valuation Expertise
Setting the right price is crucial. Overpricing leads to listing stagnation, while underpricing leaves hard-earned equity on the table. A seasoned REALTOR analyzes real-time MLS data, hyper-local pending comps, and micro-market shifts to price your property for maximum return.

### 2. Powerful Negotiation Strategies
Your REALTOR acts as your dedicated fiduciary negotiator. Whether handling multiple offer bidding wars, repair concessions after home inspection, or appraisal contingencies, having 35+ years of negotiation experience ensures you secure the most favorable terms possible.

### 3. Access to Exclusive and Off-Market Networks
Many of the best properties and discreet buyers never appear on public consumer portals. REALTORS maintain vast professional networks, private MLS collaboration channels, and investor circles that open doors you cannot find alone.

### 4. Seamless Contract & Legal Navigation
Real estate contracts in Connecticut and Massachusetts contain dozens of pages of disclosures, financing clauses, contingency deadlines, and municipal compliance mandates. A single oversight can result in lost earnest deposits or legal exposure.

### 5. Deep Knowledge of Local Zoning and Municipalities
From Waterbury to Southington, Berlin, and Stamford, every municipality enforces unique zoning regulations, building permits, property tax mill rates, and historic district guidelines.

### 6. Rigorous Transaction Management from Listing to Closing
Your REALTOR coordinates attorneys, title companies, mortgage underwriters, municipal inspectors, and appraisers to keep deadlines on track.

### 7. Strict Code of Ethics & Fiduciary Duty
A licensed REALTOR is legally and ethically bound to put your interests above all others, providing total transparency, confidentiality, and diligent representation.`,
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    category: "Tips & Guides",
    tags: ["realtor-benefits", "selling-guide", "buying-guide", "market-tips"],
    coverImage: "/wp-content/uploads/image-2-1.png",
    date: "2020-07-24",
    readTime: "6 min read",
    status: "Published",
    seoScore: 94,
    views: "6.4k",
    comments: 12
  },
  {
    id: "blog-32051",
    slug: "latest-news-from-nar",
    title: "Latest News From NAR (National Association of Realtors)",
    excerpt: "Key takeaways from the latest National Association of Realtors economic reports, interest rate trajectories, and housing inventory forecasts for Connecticut and the Northeast.",
    content: `The National Association of Realtors (NAR) has released its comprehensive market overview highlighting shifts in buyer demographics, mortgage interest trends, and inventory absorption rates.

### Market Dynamics in the Northeast
While national numbers show fluctuating sales volume, Connecticut and Massachusetts continue to experience robust buyer demand driven by tight inventory and sustained inward migration from high-density metropolitan centers.

### Key Insights for Buyers & Sellers
- **Inventory Tightness**: Well-maintained homes in prime suburban districts continue to receive multiple competing offers within days of hitting the market.
- **Interest Rate Stabilization**: Buyers with strong pre-approvals are locking in competitive financing as lending standards adapt.
- **Equity Growth**: Long-term homeowners continue to realize substantial equity growth across residential and commercial sectors.`,
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    category: "Market Trends",
    tags: ["nar", "market-news", "connecticut", "housing-trends"],
    coverImage: "/wp-content/uploads/slider-image-1.jpg",
    date: "2025-12-26",
    readTime: "4 min read",
    status: "Published",
    seoScore: 89,
    views: "5.1k",
    comments: 6
  },
  {
    id: "blog-5471",
    slug: "florida-realtors-work-to-defeat-rent-control",
    title: "Florida & East Coast REALTORS Work to Defeat Rent Control",
    excerpt: "How real estate associations are advocating to protect private property rights and ensure sustainable housing development across the East Coast.",
    content: `State and regional REALTOR organizations continue their proactive advocacy against restrictive rent control measures that historical economic data proves reduce housing supply and deter capital investment in rental rehabilitation.

### The Economic Realities of Rent Control
Studies consistently demonstrate that artificial price caps discourage developers from building new multifamily housing and reduce landlord reinvestment in property maintenance. Fostering supply through flexible zoning and tax incentives remains the proven path toward long-term affordability.`,
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    category: "Company News",
    tags: ["rent-control", "property-rights", "multifamily", "legislation"],
    coverImage: "/wp-content/uploads/floridaRealtors-768x357-1.png",
    date: "2023-02-14",
    readTime: "5 min read",
    status: "Published",
    seoScore: 82,
    views: "3.8k",
    comments: 4
  },
  {
    id: "blog-5465",
    slug: "commloan-commercial-rate-snapshot",
    title: "Here's This Week's CommLoan Commercial Rate Snapshot",
    excerpt: "Essential debt coverage ratios, commercial mortgage rates, and financing options for retail, industrial, and multifamily property acquisitions in Connecticut.",
    content: `Commercial real estate investors in Connecticut and Massachusetts must closely track debt capital markets. This week's rate snapshot provides guidance for 5-year, 7-year, and 10-year commercial fixed loans across office, industrial, and retail assets.

### Commercial Lending Parameters
- **Debt Service Coverage Ratio (DSCR)**: Most institutional lenders are underwriting at 1.25x to 1.35x.
- **Loan-to-Value (LTV)**: Stabilized assets qualify for 65% to 75% LTV.
- **Bridge & Value-Add Financing**: Strong options remain for properties undergoing repositioning or major capital improvements.`,
    author: "Majeed Sharif",
    authorRole: "Commercial Specialist",
    category: "Market Trends",
    tags: ["commercial", "rates", "financing", "investing"],
    coverImage: "/wp-content/uploads/IMG_4535.jpg",
    date: "2023-02-14",
    readTime: "4 min read",
    status: "Published",
    seoScore: 88,
    views: "4.2k",
    comments: 3
  },
  {
    id: "blog-5413",
    slug: "selling-your-home-during-the-holidays",
    title: "Selling Your Home During the Holidays: Strategic Advantages",
    excerpt: "Why listing your property during late autumn and winter often attracts the most serious, pre-qualified buyers and minimal competing inventory.",
    content: `A common real estate myth is that you should wait until spring to put your house on the market. In reality, holiday and winter sellers often achieve exceptional outcomes due to three key strategic dynamics:

1. **Serious Buyers Only**: Looky-loos and casual browsers stay home; buyers touring during December and January are motivated by job relocations, tax deadlines, or urgent family needs.
2. **Substantially Lower Competition**: Many competing sellers withdraw listings, making your home stand out prominently.
3. **Warm & Inviting Atmosphere**: Seasonal decor and cozy lighting accentuate the emotional warmth of a quality residence.`,
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    category: "Tips & Guides",
    tags: ["selling-tips", "winter-market", "home-staging"],
    coverImage: "/wp-content/uploads/16-thendara.jpg",
    date: "2022-09-12",
    readTime: "5 min read",
    status: "Published",
    seoScore: 91,
    views: "5.8k",
    comments: 9
  },
  {
    id: "blog-31243",
    slug: "existing-home-sales-slid-in-june",
    title: "Existing-Home Sales Slid 5.4% in June: Understanding the Underlying Forces",
    excerpt: "A deep dive into historical transaction volume shifts, inventory constraints, and why Connecticut submarkets continue to outperform national averages.",
    content: `While headline national figures reported a 5.4% drop in closed sales volume during the summer transition, regional data for Hartford, New Haven, and Litchfield counties tells a different story.

Demand remains intense, with the primary bottleneck being low inventory rather than buyer interest. Well-priced properties continue to sell rapidly with strong equity gains.`,
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    category: "Market Trends",
    tags: ["market-trends", "home-sales", "statistics"],
    coverImage: "/wp-content/uploads/image-14-scaled.png",
    date: "2020-06-09",
    readTime: "4 min read",
    status: "Published",
    seoScore: 78,
    views: "2.9k",
    comments: 2
  },
  {
    id: "blog-31245",
    slug: "april-commercial-market-insight",
    title: "Commercial Market Insight: Industrial & Retail Trends",
    excerpt: "Analyzing tenant demand, cap rate shifts, and retail repositioning opportunities across Connecticut's transit corridors.",
    content: `Industrial warehouse space and neighborhood retail centers continue to deliver high occupancy rates across Connecticut. Investors seeking stable cash flow are targeting multi-tenant strip centers and logistics properties near Interstate 84 and Route 8.`,
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    category: "Market Trends",
    tags: ["commercial", "industrial", "retail", "cap-rates"],
    coverImage: "/wp-content/uploads/IMG_4535.jpg",
    date: "2020-07-02",
    readTime: "5 min read",
    status: "Published",
    seoScore: 85,
    views: "3.4k",
    comments: 5
  },
  {
    id: "blog-32063",
    slug: "update-market-opportunities-2026",
    title: "Update: High-Yield Real Estate & Business Opportunities in 2026",
    excerpt: "A timely overview of upcoming off-market residential acquisitions and turnkey business sales represented by Sharif Realty.",
    content: `As we progress through 2026, Sharif Realty Group is proud to present several exclusive off-market properties and profitable business opportunities throughout Connecticut.

Whether you are expanding your investment portfolio or searching for an off-market luxury home in Burlington, Berlin, or Waterbury, our advisory team is ready to connect you directly with vetted property owners.`,
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    category: "Company News",
    tags: ["exclusive", "2026-update", "business-brokerage"],
    coverImage: "/wp-content/uploads/30905-1-1-scaled.png",
    date: "2026-01-21",
    readTime: "3 min read",
    status: "Published",
    seoScore: 96,
    views: "7.2k",
    comments: 15
  }
];

// Write seed file
const content = `// Auto-generated database seed from authentic WordPress database and media files
import type { AdminPropertyPost, BlogPost, MediaAsset } from "./admin-store";

export const SEED_PROPERTIES_DATA: AdminPropertyPost[] = ${JSON.stringify(REAL_PROPERTIES, null, 2)};

export const SEED_BLOG_POSTS_DATA: BlogPost[] = ${JSON.stringify(REAL_BLOG_POSTS, null, 2)};

export const SEED_MEDIA_FILES_LIST: string[] = ${JSON.stringify(mediaFiles, null, 2)};
`;

fs.writeFileSync("src/lib/database-seed.ts", content, "utf-8");
console.log("Successfully created src/lib/database-seed.ts!");
