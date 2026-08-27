import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("database/all_extracted_content.json", "utf-8"));

console.log("=== ALL 16 BLOG POSTS ===");
data.posts.forEach((p, i) => {
  console.log(`\n[${i + 1}] ID: ${p.id} | TITLE: ${p.title} | DATE: ${p.date} | STATUS: ${p.status}`);
  console.log(`SLUG: ${p.slug}`);
  console.log(`CATEGORIES:`, p.categories.map(c => c.name).join(", "));
  console.log(`CONTENT PREVIEW:`, p.content.substring(0, 300).replace(/\s+/g, " "));
});

console.log("\n=== BUSINESS DIRECTORY (SAMPLE 10) ===");
data.bizDir.slice(0, 10).forEach((b, i) => {
  console.log(`\n[${i + 1}] ID: ${b.id} | TITLE: ${b.title} | SLUG: ${b.slug}`);
  console.log(`CATEGORIES:`, b.categories.map(c => c.name).join(", "));
  console.log(`CONTENT:`, b.content.substring(0, 200).replace(/\s+/g, " "));
  console.log(`META:`, Object.entries(b.meta).slice(0, 5).map(([k, v]) => `${k}: ${v}`).join(" | "));
});
