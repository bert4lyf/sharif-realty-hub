import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const xmlData = fs.readFileSync(path.resolve(process.cwd(), "export.xml"), "utf8");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  cdataPropName: "__cdata",
  trimValues: true,
});

const parsed = parser.parse(xmlData);
const items = parsed.rss.channel.item;

const typeCounts = {};
const allProperties = [];
const allPosts = [];
const allPages = [];

function extractText(node) {
  if (node === null || node === undefined) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (typeof node === "object") {
    if (node.__cdata !== undefined) return String(node.__cdata);
    if (node["#text"] !== undefined) return String(node["#text"]);
    return JSON.stringify(node);
  }
  return String(node);
}

for (const item of items) {
  const postType = extractText(item["wp:post_type"]);
  const title = extractText(item["title"]);
  const slug = extractText(item["wp:post_name"]);
  const status = extractText(item["wp:status"]);

  typeCounts[postType] = (typeCounts[postType] || 0) + 1;

  if (postType === "estate_property" || postType === "property" || postType === "atbdp_listings") {
    allProperties.push({ title, slug, postType, status });
  } else if (postType === "post") {
    allPosts.push({ title, slug, status });
  } else if (postType === "page") {
    allPages.push({ title, slug, status });
  }
}

console.log("Post Types Breakdown:", typeCounts);
console.log("\nProperties found:", allProperties.length, allProperties);
console.log("\nPosts (Blog):", allPosts.length, allPosts.slice(0, 10));
console.log("\nPages:", allPages.length, allPages.slice(0, 15));
