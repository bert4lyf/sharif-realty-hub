import fs from "node:fs";
import path from "node:path";

function inspectHtml(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Extract property details
  const title = (content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim();
  const price = (content.match(/class=["'][^"']*price[^"']*["'][^>]*>([\s\S]*?)<\/span>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim();
  const address = (content.match(/class=["'][^"']*property_address[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim();
  const description = (content.match(/<div class=["']wpestate_property_description["']>([\s\S]*?)<\/div>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim();

  // Extract all property features / details
  const details = {};
  const detailMatches = content.matchAll(/<div class=["']listing_detail[^"']*["']><strong>([^<]+)<\/strong>([\s\S]*?)<\/div>/gi);
  for (const m of detailMatches) {
    const key = m[1].replace(/:/, '').trim();
    const val = m[2].replace(/<[^>]+>/g, '').trim();
    details[key] = val;
  }

  // Extract image gallery
  const imgs = [...content.matchAll(/class=["'][^"']*lightbox_trigger[^"']*["'][^>]*href=["']([^"']+)["']/gi)].map(m => m[1]);

  return { title, price, address, description: description?.substring(0, 200), details, imgs: imgs.slice(0, 10) };
}

const p1 = inspectHtml("database/properties/commercial-property-at-north-main-st-waterbury/index.html");
const p2 = inspectHtml("database/properties/waterbury-connecticut/index.html");
const p3 = inspectHtml("database/properties/single-family-4-bedrooms-3-baths/index.html");

console.log("P1 Commercial:", JSON.stringify(p1, null, 2));
console.log("P2 Waterbury:", JSON.stringify(p2, null, 2));
console.log("P3 Single Family:", JSON.stringify(p3, null, 2));
