import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const xmlPath = path.resolve(process.cwd(), "database/sharifrealty.WordPress.2026-08-24.xml");
const xmlContent = fs.readFileSync(xmlPath, "utf-8");
const parser = new XMLParser({
  ignoreAttributes: false,
  cdataPropName: "__cdata",
});

const parsed = parser.parse(xmlContent);
const channel = parsed.rss.channel;
const items = Array.isArray(channel.item) ? channel.item : [channel.item].filter(Boolean);

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

const bizDir = [];
const allPosts = [];
const properties = [];
const attachmentMap = {};

for (const item of items) {
  const postType = getText(item["wp:post_type"]);
  const id = getText(item["wp:post_id"]);
  const title = getText(item.title);
  const slug = getText(item["wp:post_name"]);
  const content = getText(item["content:encoded"]);
  const excerpt = getText(item["excerpt:encoded"]);
  const date = getText(item["wp:post_date"]);
  const status = getText(item["wp:status"]);
  const meta = parsePostMeta(item);
  const categories = parseCategories(item);

  if (postType === "attachment") {
    attachmentMap[id] = {
      id,
      title,
      url: getText(item["wp:attachment_url"]),
      file: meta["_wp_attached_file"] || "",
    };
  }

  const entry = { id, title, slug, content, excerpt, date, status, meta, categories, postType };

  if (postType === "at_biz_dir") {
    bizDir.push(entry);
  } else if (postType === "post") {
    allPosts.push(entry);
  } else if (postType === "estate_property") {
    properties.push(entry);
  }
}

console.log(`=== BUSINESS DIRECTORY (at_biz_dir) (${bizDir.length} items) ===`);
for (const b of bizDir) {
  console.log(`[${b.id}] "${b.title}" (${b.slug})`);
  console.log(`  Categories:`, b.categories.map(c => `${c.domain}:${c.name}`).join(", "));
  console.log(`  Meta keys:`, Object.keys(b.meta).slice(0, 10).join(", "));
}

console.log(`\n=== BLOG POSTS (post) (${allPosts.length} items) ===`);
for (const p of allPosts) {
  console.log(`[${p.id}] "${p.title}" (${p.date}) [${p.status}]`);
  console.log(`  Categories:`, p.categories.map(c => c.name).join(", "));
  console.log(`  Excerpt:`, p.excerpt ? p.excerpt.substring(0, 100) : (p.content ? p.content.substring(0, 100).replace(/<[^>]+>/g, '') : ''));
}

console.log(`\n=== PROPERTIES (estate_property) (${properties.length} items) ===`);
for (const pr of properties) {
  console.log(`[${pr.id}] "${pr.title}"`);
  console.log(`  Meta:`, JSON.stringify(pr.meta, null, 2));
}

// Write out full structured database
fs.writeFileSync(
  "database/all_extracted_content.json",
  JSON.stringify({ properties, bizDir, posts: allPosts, attachmentMap }, null, 2),
  "utf-8"
);
console.log("\nWrote database/all_extracted_content.json successfully!");
