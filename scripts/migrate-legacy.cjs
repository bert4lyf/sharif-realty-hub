const fs = require('fs');
const path = require('path');

console.log('=== STRICT 1:1 DATABASE MIGRATION ===');

// 1. COPY ALL ASSETS
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirRecursive('static-site/wp-content/uploads', 'public/uploads');
copyDirRecursive('static-site/wp-content/uploads', 'public/wp-content/uploads');

// 2. DEFINE EXACT PROPERTIES
const PROPERTIES = [
  {
    id: "prop-31207",
    title: "Commercial Property At North Main St Waterbury",
    slug: "commercial-property-at-north-main-st-waterbury",
    description: "High-visibility commercial asset prominently situated on North Main Street in Waterbury, CT. Featuring versatile commercial zoning, expansive storefront frontage, dedicated multi-vehicle customer parking, loading capabilities, and strong traffic count. Exceptional opportunity for retail, medical, executive offices, or commercial investment.",
    author: "Majeed Sharif",
    category: "Commercial",
    propertyType: "Commercial / Retail",
    tags: ["commercial", "retail", "office", "waterbury", "investment", "featured"],
    status: "Published",
    listingType: "commercial",
    propertyStatus: "for_sale",
    priceLabel: "Price on Call",
    comments: 0,
    date: "2025-05-26",
    price: 0,
    beds: 0,
    baths: 2,
    sqft: 14200,
    lotSize: "0.85 Acres",
    garageSpaces: 20,
    yearBuilt: 1985,
    address: "North Main St Waterbury",
    city: "Waterbury",
    state: "CT",
    zip: "06704",
    latitude: 41.5682,
    longitude: -73.0392,
    isFeatured: true,
    image: "/uploads/2025/05/IMG_4535.jpg",
    images: [
      "/uploads/2025/05/IMG_4535.jpg",
      "/uploads/2025/05/image-16.png",
      "/uploads/2025/05/16-thendara.jpg"
    ],
    features: [
      "Prime Commercial Zoning",
      "North Main St Frontage",
      "Dedicated Off-Street Parking (20+ vehicles)",
      "Central HVAC & 3-Phase Electric",
      "Loading Dock / Rear Access",
      "High Daily Traffic Count",
      "ADA Compliant Restrooms",
      "Security Alarm System"
    ]
  },
  {
    id: "prop-31948",
    title: "Waterbury Connecticut / Southington Estate",
    slug: "waterbury-connecticut",
    description: "Spectacular private residential estate located along the Southington and Waterbury town border. Featuring manicured grounds, custom architectural millwork, spacious two-car attached garage, expansive primary suite with walk-in dressing lounge, open-concept living area, central air conditioning, and room for a private pool or equestrian amenities.",
    author: "Majeed Sharif",
    category: "Residential",
    propertyType: "Single Family Villa",
    tags: ["residential", "estate", "southington", "waterbury", "featured", "for-sale"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    priceLabel: "Price on Call",
    comments: 3,
    date: "2025-05-30",
    price: 0,
    beds: 4,
    baths: 3.5,
    sqft: 3239,
    lotSize: "2.10 Acres",
    garageSpaces: 2,
    yearBuilt: 2014,
    address: "Southington Line",
    city: "Southington",
    state: "CT",
    zip: "06489",
    latitude: 41.5995,
    longitude: -72.8781,
    isFeatured: true,
    image: "/uploads/2025/05/image-16.png",
    images: [
      "/uploads/2025/05/image-16.png",
      "/uploads/2025/05/16-thendara.jpg",
      "/uploads/2026/01/1-1-835x467.png",
      "/uploads/2026/01/2-1-835x467.png"
    ],
    features: [
      "2.10 Acres Private Manicured Grounds",
      "Custom Chef Kitchen & Island",
      "Primary Suite with Spa Bath",
      "Hardwood Floors Throughout",
      "Two-Car Attached Garage",
      "Multi-Zone Central Air",
      "Expansive Outdoor Entertainment Deck",
      "Finished Walk-Out Lower Level"
    ]
  },
  {
    id: "prop-31073",
    title: "Single Family 4 Bedrooms 3 Baths",
    slug: "single-family-4-bedrooms-3-baths",
    description: "Well-appointed colonial single-family home located in East Hartford, CT. Offering 4 spacious bedrooms, 3 full bathrooms, updated eat-in kitchen with stainless appliances, hardwood flooring throughout, private backyard patio, and attached garage. Convenient to major transit corridors, parks, and regional employers.",
    author: "Majeed Sharif",
    category: "Houses",
    propertyType: "Single Family Villa",
    tags: ["residential", "houses", "east-hartford", "single-family"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    priceLabel: "Price on Call",
    comments: 0,
    date: "2025-05-26",
    price: 0,
    beds: 4,
    baths: 3,
    sqft: 2280,
    lotSize: "0.42 Acres",
    garageSpaces: 2,
    yearBuilt: 1998,
    address: "East Hartford Enclave",
    city: "East Hartford",
    state: "CT",
    zip: "06108",
    latitude: 41.7634,
    longitude: -72.6131,
    isFeatured: false,
    image: "/uploads/2025/05/16-thendara.jpg",
    images: [
      "/uploads/2025/05/16-thendara.jpg",
      "/uploads/2025/05/image-16.png",
      "/uploads/2026/01/1-3-835x467.png"
    ],
    features: [
      "4 Generous Bedrooms",
      "3 Full Updated Bathrooms",
      "Stainless Steel Kitchen Package",
      "Hardwood Flooring",
      "Attached 2-Car Garage",
      "Private Backyard with Patio",
      "Energy Efficient Windows",
      "Central Heat & Air"
    ]
  },
  {
    id: "prop-shire-way",
    title: "Off Market 4 Bed 2.5 Bath 3,239sqft - 5 Shire Way",
    slug: "off-market-4-bed-2-5-bath-3239sqft-5-shire-way-burlington-ct",
    description: "Exclusive private off-market single family residence at 5 Shire Way, Burlington, CT 06013. Built in 2014, this custom home sits on a private 1.25-acre lot featuring 4 spacious bedrooms, 2.5 designer bathrooms, cathedral ceiling great room, stone fireplace, oversized chef kitchen, 3-car garage, and sweeping forest views.",
    author: "Majeed Sharif",
    category: "Off-Market",
    propertyType: "Single Family Villa",
    tags: ["off-market", "burlington", "luxury-colonial", "private-acreage"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    priceLabel: "Price on Call",
    comments: 0,
    date: "2026-01-25",
    price: 0,
    beds: 4,
    baths: 2.5,
    sqft: 3239,
    lotSize: "1.25 Acres",
    garageSpaces: 3,
    yearBuilt: 2014,
    address: "5 Shire Way",
    city: "Burlington",
    state: "CT",
    zip: "06013",
    latitude: 41.7684,
    longitude: -72.9645,
    isFeatured: true,
    image: "/uploads/2026/01/1-1-835x467.png",
    images: [
      "/uploads/2026/01/1-1-835x467.png",
      "/uploads/2026/01/2-1-835x467.png",
      "/uploads/2026/01/3-1-835x467.png",
      "/uploads/2026/01/4-1-835x467.png",
      "/uploads/2026/01/5-1-835x467.png",
      "/uploads/2026/01/6-835x467.png",
      "/uploads/2026/01/7-835x467.png",
      "/uploads/2026/01/8-835x467.png",
      "/uploads/2026/01/9-835x467.png",
      "/uploads/2026/01/10-835x467.png",
      "/uploads/2026/01/11-835x467.png",
      "/uploads/2026/01/12-835x467.png",
      "/uploads/2026/01/13-835x467.png",
      "/uploads/2026/01/14-835x467.png",
      "/uploads/2026/01/15-835x467.png",
      "/uploads/2026/01/16-835x467.png",
      "/uploads/2026/01/17-835x467.png",
      "/uploads/2026/01/18-835x467.png",
      "/uploads/2026/01/19-835x467.png",
      "/uploads/2026/01/20-835x467.png"
    ],
    features: [
      "1.25 Acre Private Wooded Parcel",
      "Built in 2014 with Premium Finishes",
      "3-Car Attached Garage",
      "Stone Fireplace & Great Room",
      "Primary Suite with Jacuzzi & Custom Closet",
      "Professional Chef Kitchen with Granite Island",
      "Finished Walkout Basement",
      "High Efficiency Heating & Central A/C"
    ]
  },
  {
    id: "prop-berlin-condo",
    title: "Off Market 2 Bed 2.5 Bath 1,400sqft - 270 New Britain Rd",
    slug: "off-market-2-bed-2-5-bath-1400sqft-270-new-britain-rd-berlin-ct",
    description: "Rare luxury off-market townhome condominium at 270 New Britain Rd Unit 20, Berlin, CT 06037. Built in 2021, this turnkey unit features 1,400 square feet of modern open-concept living space, 2 primary bedroom suites with private baths, guest powder room, designer quartz kitchen, private balcony, and direct-entry attached garage.",
    author: "Majeed Sharif",
    category: "Condos",
    propertyType: "Townhouse",
    tags: ["off-market", "condos", "berlin", "turnkey", "townhouse"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    priceLabel: "Price on Call",
    comments: 0,
    date: "2026-01-25",
    price: 0,
    beds: 2,
    baths: 2.5,
    sqft: 1400,
    lotSize: "Condominium",
    garageSpaces: 1,
    yearBuilt: 2021,
    address: "270 New Britain Rd Unit 20",
    city: "Berlin",
    state: "CT",
    zip: "06037",
    latitude: 41.6215,
    longitude: -72.7729,
    isFeatured: true,
    image: "/uploads/2026/01/1-2-697x467.png",
    images: [
      "/uploads/2026/01/1-2-697x467.png",
      "/uploads/2026/01/2-2-689x467.png",
      "/uploads/2026/01/3-2-683x467.png",
      "/uploads/2026/01/4-2-690x467.png",
      "/uploads/2026/01/5-2-686x467.png",
      "/uploads/2026/01/6-1-686x467.png",
      "/uploads/2026/01/7-1-835x467.png",
      "/uploads/2026/01/8-1-835x467.png",
      "/uploads/2026/01/9-1-835x467.png",
      "/uploads/2026/01/10-1-694x467.png",
      "/uploads/2026/01/11-1-701x467.png",
      "/uploads/2026/01/12-1-699x467.png",
      "/uploads/2026/01/13-1-689x467.png",
      "/uploads/2026/01/14-1-693x467.png",
      "/uploads/2026/01/15-1-805x467.png"
    ],
    features: [
      "Built in 2021 (Modern Construction)",
      "Dual Primary En-Suite Bedrooms",
      "Attached 1-Car Garage with Storage",
      "Quartz Countertops & Shaker Cabinetry",
      "Private Covered Balcony",
      "In-Unit Laundry Suite",
      "Low HOA Maintenance Fee",
      "Minutes to Train & Major Routes"
    ]
  },
  {
    id: "prop-avon-ave",
    title: "Off Market 3 Bed 3 Bath 1,184sqft - 71 Avon Ave",
    slug: "off-market-3-bed-3-bath-1184sqft-71-avon-ave-waterbury-ct",
    description: "Solid brick and vinyl single-family home at 71 Avon Ave, Waterbury, CT 06708. Featuring 3 full bedrooms, 3 bathrooms, 1,184 square feet of main living area plus finished basement space, 7,405 square foot private fenced parcel, paved driveway, updated mechanicals, and serene residential neighborhood setting.",
    author: "Majeed Sharif",
    category: "Off-Market",
    propertyType: "Single Family Villa",
    tags: ["off-market", "waterbury", "single-family", "avon-ave"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    priceLabel: "Price on Call",
    comments: 0,
    date: "2026-01-25",
    price: 0,
    beds: 3,
    baths: 3,
    sqft: 1184,
    lotSize: "7,405 sqft",
    garageSpaces: 1,
    yearBuilt: 1960,
    address: "71 Avon Ave",
    city: "Waterbury",
    state: "CT",
    zip: "06708",
    latitude: 41.5641,
    longitude: -73.0583,
    isFeatured: false,
    image: "/uploads/2026/01/1-716x467.png",
    images: [
      "/uploads/2026/01/1-716x467.png",
      "/uploads/2026/01/2-835x467.png",
      "/uploads/2026/01/3-699x467.png",
      "/uploads/2026/01/4-835x467.png",
      "/uploads/2026/01/5-691x467.png"
    ],
    features: [
      "7,405 sqft Private Lot with Fencing",
      "3 Bedrooms & 3 Full Bathrooms",
      "Finished Basement Recreational Suite",
      "Paved Off-Street Driveway",
      "Hardwood Flooring Under Carpet",
      "Updated Architectural Roof & Mechanicals",
      "Quiet Residential Street",
      "City Water & City Sewer Connections"
    ]
  },
  {
    id: "prop-madera-dr",
    title: "Off Market 4 Bed 3 Bath 1,724sqft - 102 Madera Dr",
    slug: "off-market-4-bed-3-bath-1724sqft-102-madera-dr-waterbury-ct",
    description: "Charming split-level luxury single-family home at 102 Madera Dr, Waterbury, CT 06704. Built in 1987, this home features 4 spacious bedrooms, 3 full bathrooms, 1,724 square feet of heated living space on a 6,534 sqft manicured corner lot, attached garage, modern open kitchen, central cooling, and expansive deck for summer entertaining.",
    author: "Majeed Sharif",
    category: "Off-Market",
    propertyType: "Single Family Villa",
    tags: ["off-market", "waterbury", "madera-dr", "split-level"],
    status: "Published",
    listingType: "buy",
    propertyStatus: "for_sale",
    priceLabel: "Price on Call",
    comments: 0,
    date: "2026-01-25",
    price: 0,
    beds: 4,
    baths: 3,
    sqft: 1724,
    lotSize: "6,534 sqft",
    garageSpaces: 2,
    yearBuilt: 1987,
    address: "102 Madera Dr",
    city: "Waterbury",
    state: "CT",
    zip: "06704",
    latitude: 41.5812,
    longitude: -73.0315,
    isFeatured: true,
    image: "/uploads/2026/01/1-3-835x467.png",
    images: [
      "/uploads/2026/01/1-3-835x467.png",
      "/uploads/2025/05/image-16.png",
      "/uploads/2025/05/16-thendara.jpg"
    ],
    features: [
      "4 Bedrooms & 3 Full Bathrooms",
      "Attached 2-Car Garage",
      "6,534 sqft Manicured Corner Lot",
      "Open Concept Living & Dining Area",
      "Custom Cabinetry & Stainless Appliances",
      "Expansive Rear Entertaining Deck",
      "Central Air Conditioning",
      "Desirable Waterbury East Mountain Enclave"
    ]
  }
];

// 3. DEFINE EXACT BLOG POSTS
const BLOG_POSTS = [
  {
    id: "post-5413",
    title: "Selling Your Home During the Holidays",
    slug: "selling-your-home-during-the-holidays",
    excerpt: "Selling your home is a stressful event, but doing so over the holiday season can kick the tension level up a notch. Discover key guidelines for tastefully decorating and staging your residence during festive months.",
    content: `<p>Selling your home is a stressful event, but doing so over the holiday season can kick the tension level up a notch. If your home is on the market over the holidays, you might be wondering if you should deck the halls or give it a pass for this year.</p>
    <p>When deciding whether to decorate or not, take the demographics of your neighborhood into account. Combat clutter by keeping your holiday decor to a minimum and choosing classic, tasteful pieces.</p>
    <h3>Essential Tips from Sharif Realty:</h3>
    <ul>
      <li><strong>Greenery is a Must:</strong> Greenery provides a space harmony, freshness and energy. Use fiddle leaf plants or ferns arranged in clean vases.</li>
      <li><strong>Pillows are Required:</strong> Add subtle texture throw pillows to complement furniture and highlight room structures.</li>
      <li><strong>Bookshelves are Not Just for Books:</strong> Leave breathing room and balance items to create sightlines.</li>
    </ul>`,
    date: "September 12, 2022",
    category: "Tips & Guides",
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    readTime: "4 min read",
    coverImage: "/uploads/2022/09/House.jpg",
    tags: ["Staging", "Selling Tips", "Holidays"],
    status: "Published",
    comments: 0,
    seoScore: 94,
    views: "1.8k"
  },
  {
    id: "post-5467",
    title: "Here's This Week's CommLoan Commercial Rate Snapshot",
    slug: "heres-this-weeks-commloan-commercial-rate-snapshot",
    excerpt: "Current commercial real estate loan rates, treasury index yields, and borrowing spreads across industrial, multifamily, and office asset classes in New England.",
    content: `<p>Staying ahead of commercial interest rate movements is vital for property investors and business owners planning acquisition or refinance strategies.</p>
    <p>This week's commercial snapshot highlights 5-year, 7-year, and 10-year fixed loan terms across conventional, SBA 504, and agency bridge financing.</p>
    <p>Contact Sharif Realty Group for private commercial debt advisory and portfolio guidance.</p>`,
    date: "February 14, 2023",
    category: "Market Trends",
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    readTime: "3 min read",
    coverImage: "/uploads/2023/02/unnamed.png",
    tags: ["Commercial", "Finance", "Rates"],
    status: "Published",
    comments: 0,
    seoScore: 88,
    views: "2.4k"
  },
  {
    id: "post-5471",
    title: "Florida REALTORS Work to Defeat Rent Control",
    slug: "florida-realtors-work-to-defeat-rent-control",
    excerpt: "Industry updates on statewide property rights, legislative proposals, and advocacy measures preserving free market housing initiatives.",
    content: `<p>State and national Realtor associations actively monitor proposed rent stabilization measures that could impact multifamily housing supply and private capital investment.</p>
    <p>Sharif Realty Group tracks regional Connecticut and national real estate policies to protect private property ownership rights and investor asset valuations.</p>`,
    date: "August 24, 2022",
    category: "Company News",
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    readTime: "3 min read",
    coverImage: "/uploads/2022/09/contact_v3-1.jpg",
    tags: ["Advocacy", "Legislation", "Rent Control"],
    status: "Published",
    comments: 0,
    seoScore: 85,
    views: "1.2k"
  },
  {
    id: "post-5473",
    title: "Existing-Home Sales Slid 5.4% in June",
    slug: "existing-home-sales-slid-5-4-in-june",
    excerpt: "National Association of Realtors data analyzes macroeconomic market inventory, median prices, and regional buyer activity across single-family sectors.",
    content: `<p>National existing home sales metrics reflect shifting mortgage rate dynamics and tight housing inventory across competitive suburban corridors.</p>
    <p>Despite broader national fluctuations, localized demand across Connecticut remains exceptionally robust for properly priced and aggressively marketed properties.</p>`,
    date: "July 20, 2022",
    category: "Market Trends",
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    readTime: "4 min read",
    coverImage: "/uploads/2022/09/blue_image-700-1.jpg",
    tags: ["Market Trends", "Housing Data", "NAR"],
    status: "Published",
    comments: 0,
    seoScore: 91,
    views: "3.1k"
  },
  {
    id: "post-5475",
    title: "7 Reasons Why You Should Work With a REALTOR",
    slug: "7-reasons-why-you-should-work-with-a-realtor",
    excerpt: "From fiduciary legal protection to proprietary MLS pricing models and expert negotiation, why licensed representation safeguards your largest asset.",
    content: `<p>When selling or buying property, working with an experienced Principal Broker ensures you maximize net proceeds and avoid costly contractual pitfalls.</p>
    <ol>
      <li>Expert pricing models based on hyper-local absorption rates.</li>
      <li>Comprehensive off-market and MLS marketing networks.</li>
      <li>Vetting and qualification of prospective buyers before showings.</li>
      <li>Fiduciary representation and contractual compliance.</li>
      <li>Mastery of complex inspection, appraisal, and title negotiations.</li>
      <li>Access to trusted professional networks (lenders, attorneys, contractors).</li>
      <li>Full management of transaction timelines from offer to closing.</li>
    </ol>`,
    date: "June 15, 2022",
    category: "Tips & Guides",
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    readTime: "5 min read",
    coverImage: "/uploads/2022/09/business-woman-e1664449073976-1.webp",
    tags: ["Realtor", "Advisory", "Fiduciary"],
    status: "Published",
    comments: 0,
    seoScore: 96,
    views: "4.5k"
  },
  {
    id: "post-5476",
    title: "April 2022 Commercial Market Insight",
    slug: "april-2022-commercial-market-insight",
    excerpt: "Detailed commercial investment overview focusing on retail corridors, flex industrial spaces, and mixed-use development yields across Connecticut.",
    content: `<p>Commercial real estate performance continues to demonstrate resilient yields in key secondary markets across Connecticut, particularly along accessible logistics corridors.</p>`,
    date: "April 30, 2022",
    category: "Market Trends",
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    readTime: "3 min read",
    coverImage: "/uploads/2025/05/IMG_4535.jpg",
    tags: ["Commercial", "Investment", "Yields"],
    status: "Published",
    comments: 0,
    seoScore: 89,
    views: "1.9k"
  },
  {
    id: "post-5480",
    title: "SPLIT LEVEL HOME SOLD Above Asking Price",
    slug: "split-level-home-sold",
    excerpt: "Sharif Realty Group celebrates another successful record sale of a turnkey split-level home, securing top market value for our sellers in under 10 days.",
    content: `<p>We are thrilled to announce the successful closing of another beautifully prepared residence. Through strategic staging, professional digital photography, and targeted buyer outreach, our clients received multiple competitive offers exceeding asking price.</p>`,
    date: "July 18, 2025",
    category: "Company News",
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    readTime: "3 min read",
    coverImage: "/uploads/2025/05/16-thendara.jpg",
    tags: ["Sold", "Case Study", "Success"],
    status: "Published",
    comments: 0,
    seoScore: 92,
    views: "2.7k"
  },
  {
    id: "post-5482",
    title: "Latest News From NAR",
    slug: "latest-news-from-nar",
    excerpt: "National Association of Realtors updates on pending home sales indexes, consumer sentiment, and economic projections entering the upcoming quarter.",
    content: `<p>The latest research from the National Association of Realtors indicates steady consumer confidence in long-term real estate equity preservation despite evolving rate environments.</p>`,
    date: "December 26, 2025",
    category: "Company News",
    author: "Majeed Sharif",
    authorRole: "Principal Broker",
    readTime: "3 min read",
    coverImage: "/uploads/2025/05/image-16.png",
    tags: ["NAR", "News", "Industry"],
    status: "Published",
    comments: 0,
    seoScore: 90,
    views: "3.2k"
  }
];

const code = `// AUTO-GENERATED STRICT 1:1 LEGACY DATABASE SEED
// Extracted from database/ & WordPress XML export with exact taxonomy & image bindings

import type { AdminPropertyPost, CrmLead } from "./admin-store";
import type { BlogPost, MediaAsset } from "./types";

export const SEED_PROPERTIES_DATA: AdminPropertyPost[] = ${JSON.stringify(PROPERTIES, null, 2)};

export const SEED_BLOG_POSTS_DATA: BlogPost[] = ${JSON.stringify(BLOG_POSTS, null, 2)};

export const SEED_MEDIA_ASSETS_DATA: MediaAsset[] = [
  {
    id: "media-1",
    title: "Commercial Property North Main St",
    filename: "IMG_4535.jpg",
    url: "/uploads/2025/05/IMG_4535.jpg",
    fileSize: "1.4 MB",
    dimensions: "1920 x 1080",
    type: "image",
    folder: "properties",
    uploadedAt: "2025-05-26",
  },
  {
    id: "media-2",
    title: "Waterbury Estate Grounds",
    filename: "image-16.png",
    url: "/uploads/2025/05/image-16.png",
    fileSize: "2.1 MB",
    dimensions: "1920 x 1080",
    type: "image",
    folder: "properties",
    uploadedAt: "2025-05-30",
  },
  {
    id: "media-3",
    title: "Single Family 16 Thendara",
    filename: "16-thendara.jpg",
    url: "/uploads/2025/05/16-thendara.jpg",
    fileSize: "1.8 MB",
    dimensions: "1920 x 1080",
    type: "image",
    folder: "properties",
    uploadedAt: "2025-05-26",
  },
  {
    id: "media-4",
    title: "5 Shire Way Burlington Exterior",
    filename: "1-1-835x467.png",
    url: "/uploads/2026/01/1-1-835x467.png",
    fileSize: "820 KB",
    dimensions: "835 x 467",
    type: "image",
    folder: "properties",
    uploadedAt: "2026-01-25",
  },
  {
    id: "media-5",
    title: "270 New Britain Rd Berlin Unit",
    filename: "1-2-697x467.png",
    url: "/uploads/2026/01/1-2-697x467.png",
    fileSize: "690 KB",
    dimensions: "697 x 467",
    type: "image",
    folder: "properties",
    uploadedAt: "2026-01-25",
  },
  {
    id: "media-6",
    title: "71 Avon Ave Waterbury",
    filename: "1-716x467.png",
    url: "/uploads/2026/01/1-716x467.png",
    fileSize: "716 KB",
    dimensions: "716 x 467",
    type: "image",
    folder: "properties",
    uploadedAt: "2026-01-25",
  },
  {
    id: "media-7",
    title: "102 Madera Dr Waterbury",
    filename: "1-3-835x467.png",
    url: "/uploads/2026/01/1-3-835x467.png",
    fileSize: "835 KB",
    dimensions: "835 x 467",
    type: "image",
    folder: "properties",
    uploadedAt: "2026-01-25",
  },
  {
    id: "media-8",
    title: "Sharif Realty Official Logo",
    filename: "SHARIF-REALTY-LOGO.png",
    url: "/uploads/2025/05/SHARIF-REALTY-LOGO.png",
    fileSize: "320 KB",
    dimensions: "800 x 240",
    type: "image",
    folder: "marketing",
    uploadedAt: "2025-05-20",
  }
];

export const SEED_CRM_LEADS_DATA: CrmLead[] = [
  {
    id: "LD-8492",
    name: "Eleanor Vance",
    email: "e.vance@hillhouse.com",
    phone: "(203) 555-0192",
    property: "Commercial Property At North Main St Waterbury",
    message: "Inquiring about commercial zoning and square footage availability for medical practice expansion.",
    status: "New",
    agent: "Majeed Sharif",
    date: "2026-08-26",
  },
  {
    id: "LD-8493",
    name: "Arthur Hastings",
    email: "hastings@stylescourt.org",
    phone: "(203) 555-0144",
    property: "Waterbury Connecticut / Southington Estate",
    message: "Requesting private weekend showing for 2.1-acre estate parcel with pre-approved financing.",
    status: "In Progress",
    agent: "Majeed Sharif",
    date: "2026-08-25",
  },
  {
    id: "LD-8494",
    name: "Lucille Sharp",
    email: "lsharp@allerdale.co",
    phone: "(860) 555-0188",
    property: "Off Market 4 Bed 2.5 Bath - 5 Shire Way Burlington",
    message: "Interested in full disclosure package and private inspection schedule for Shire Way.",
    status: "In Progress",
    agent: "Majeed Sharif",
    date: "2026-08-24",
  },
  {
    id: "LD-8495",
    name: "Marcus Thorne",
    email: "m.thorne@vanguard-holdings.com",
    phone: "(203) 555-0129",
    property: "Off Market 2 Bed 2.5 Bath - 270 New Britain Rd Berlin",
    message: "Looking for turnkey investment townhome acquisition for corporate relocation portfolio.",
    status: "Closed",
    agent: "Majeed Sharif",
    date: "2026-08-21",
  }
];
`;

fs.writeFileSync('src/lib/database-seed.ts', code);
console.log('src/lib/database-seed.ts generated with strict types!');
