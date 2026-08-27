import fs from "node:fs";
import path from "node:path";

const databaseDir = path.resolve(process.cwd(), "database");
const folders = fs.readdirSync(databaseDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log("Found folders in database/:", folders);

const extractedPages = [];

for (const folder of folders) {
  const folderPath = path.join(databaseDir, folder);
  const indexPath = path.join(folderPath, "index.html");
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, "utf-8");
    
    // Extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/&#038;/g, "&").replace(/&#8211;/g, "-").trim() : folder;

    // Extract H1
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : "";

    // Extract Meta Description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    const metaDesc = descMatch ? descMatch[1].trim() : "";

    // Extract images inside the HTML
    const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    const uniqueImages = [...new Set(imgMatches)].filter(src => !src.includes("gravatar") && !src.includes("pixel"));

    // Extract property specific details if any
    const priceMatch = html.match(/class=["'][^"']*price[^"']*["'][^>]*>([^<]+)</i);
    const addressMatch = html.match(/class=["'][^"']*property_categs[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);

    extractedPages.push({
      folder,
      title,
      h1,
      metaDesc,
      imageCount: uniqueImages.length,
      sampleImages: uniqueImages.slice(0, 5),
      size: html.length,
    });
  }
}

console.log(`\nExtracted details from ${extractedPages.length} HTML pages:`);
for (const p of extractedPages) {
  console.log(`- Folder: ${p.folder}`);
  console.log(`  Title: ${p.title}`);
  console.log(`  H1: ${p.h1}`);
  console.log(`  Desc: ${p.metaDesc.substring(0, 80)}...`);
  console.log(`  Images (${p.imageCount}):`, p.sampleImages.slice(0, 2));
}

fs.writeFileSync(
  "database/all_extracted_html_pages.json",
  JSON.stringify(extractedPages, null, 2),
  "utf-8"
);
console.log("\nSaved database/all_extracted_html_pages.json");
