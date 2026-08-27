import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const xmlPath = path.resolve(process.cwd(), "database/sharifrealty.WordPress.2026-08-24.xml");
console.log("Reading XML from:", xmlPath);

if (!fs.existsSync(xmlPath)) {
  console.error("XML file not found at", xmlPath);
  process.exit(1);
}

const xmlContent = fs.readFileSync(xmlPath, "utf-8");
const parser = new XMLParser({
  ignoreAttributes: false,
  cdataPropName: "__cdata",
});

const parsed = parser.parse(xmlContent);
const channel = parsed?.rss?.channel;

if (!channel) {
  console.error("Invalid WordPress WXR format");
  process.exit(1);
}

console.log("Site Title:", channel.title);
console.log("Site Link:", channel.link);
console.log("Total items in channel:", Array.isArray(channel.item) ? channel.item.length : 1);

const items = Array.isArray(channel.item) ? channel.item : [channel.item].filter(Boolean);

const postTypes = {};
const properties = [];
const posts = [];
const pages = [];
const attachments = [];
const agents = [];
const testimonials = [];

function getText(val) {
  if (val === undefined || val === null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (val.__cdata !== undefined) return String(val.__cdata);
    if (val["#text"] !== undefined) return String(val["#text"]);
    return JSON.stringify(val);
  }
  return String(val);
}

function parsePostMeta(item) {
  const meta = {};
  const rawMeta = item["wp:postmeta"];
  if (!rawMeta) return meta;
  const list = Array.isArray(rawMeta) ? rawMeta : [rawMeta];
  for (const m of list) {
    const key = getText(m["wp:meta_key"]);
    const val = getText(m["wp:meta_value"]);
    if (key) meta[key] = val;
  }
  return meta;
}

function parseCategories(item) {
  const cats = [];
  const raw = item.category;
  if (!raw) return cats;
  const list = Array.isArray(raw) ? raw : [raw];
  for (const c of list) {
    const domain = c["@_domain"] || "";
    const nicename = c["@_nicename"] || "";
    const name = getText(c);
    cats.push({ domain, nicename, name });
  }
  return cats;
}

for (const item of items) {
  const postType = getText(item["wp:post_type"]) || "unknown";
  postTypes[postType] = (postTypes[postType] || 0) + 1;
  const status = getText(item["wp:status"]);
  const title = getText(item.title);
  const postName = getText(item["wp:post_name"]);
  const content = getText(item["content:encoded"]);
  const excerpt = getText(item["excerpt:encoded"]);
  const date = getText(item["wp:post_date"]);
  const meta = parsePostMeta(item);
  const categories = parseCategories(item);

  const obj = {
    id: getText(item["wp:post_id"]),
    title,
    slug: postName,
    status,
    date,
    content,
    excerpt,
    meta,
    categories,
  };

  if (postType === "estate_property") {
    properties.push(obj);
  } else if (postType === "post") {
    posts.push(obj);
  } else if (postType === "page") {
    pages.push(obj);
  } else if (postType === "estate_agent") {
    agents.push(obj);
  } else if (postType === "attachment") {
    attachments.push(obj);
  } else if (postType.includes("testimonial")) {
    testimonials.push(obj);
  }
}

console.log("\n--- Post Types Breakdown ---");
console.log(postTypes);

console.log(`\nFound ${properties.length} properties:`);
for (const p of properties) {
  console.log(`- [${p.id}] ${p.title} (slug: ${p.slug}, status: ${p.status})`);
  console.log(`  Price: ${p.meta.property_price || p.meta.property_price_label || "N/A"}`);
  console.log(`  Address: ${p.meta.property_address || "N/A"}, City: ${p.meta.property_city || "N/A"}, State: ${p.meta.property_state || "N/A"}`);
  console.log(`  Beds: ${p.meta.property_bedrooms || "N/A"}, Baths: ${p.meta.property_bathrooms || "N/A"}, Size: ${p.meta.property_size || "N/A"}`);
  console.log(`  Meta keys count: ${Object.keys(p.meta).length}`);
}

console.log(`\nFound ${posts.length} blog posts:`);
for (const p of posts) {
  console.log(`- [${p.id}] ${p.title} (${p.date}, status: ${p.status}, slug: ${p.slug})`);
}

console.log(`\nFound ${agents.length} agents:`);
for (const a of agents) {
  console.log(`- [${a.id}] ${a.title} (${a.slug})`);
}

console.log(`\nFound ${pages.length} pages:`);
for (const pg of pages) {
  console.log(`- [${pg.id}] ${pg.title} (${pg.slug})`);
}

// Save detailed extracted data to JSON
const outputData = {
  postTypes,
  properties,
  posts,
  agents,
  pages: pages.map(p => ({ id: p.id, title: p.title, slug: p.slug, status: p.status, date: p.date })),
  totalAttachments: attachments.length,
};

fs.writeFileSync(
  path.resolve(process.cwd(), "database/extracted_site_data.json"),
  JSON.stringify(outputData, null, 2),
  "utf-8"
);
console.log("\nSaved extracted data to database/extracted_site_data.json");
