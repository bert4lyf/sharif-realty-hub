const fs = require('fs');
const path = require('path');

const propertyFiles = [
  { name: 'commercial-property-at-north-main-st-waterbury', path: 'database/properties/commercial-property-at-north-main-st-waterbury/index.html' },
  { name: 'waterbury-connecticut', path: 'database/properties/waterbury-connecticut/index.html' },
  { name: 'single-family-4-bedrooms-3-baths', path: 'database/properties/single-family-4-bedrooms-3-baths/index.html' },
  { name: '5-shire-way', path: 'database/off-market-4-bed-2-5-bath-3239sqft-3239-square-/index.html' },
  { name: '270-new-britain-rd', path: 'database/off-market-2-bed-2-5-bath-1400sqft-1400-square-/index.html' },
  { name: '71-avon-ave', path: 'database/off-market-3-bed-3-bath-1184sqft-1184-square-fe/index.html' },
  { name: '102-madera-dr', path: 'database/off-market-4-bed-3-bath-1724sqft-1724-square-fe/index.html' }
];

console.log('=== EXTRACTING EXACT PROPERTY DETAILS FROM DATABASE FOLDERS ===\n');

for (const prop of propertyFiles) {
  if (!fs.existsSync(prop.path)) {
    console.log(`[!] File not found: ${prop.path}`);
    continue;
  }
  const html = fs.readFileSync(prop.path, 'utf8');
  console.log(`================================================================`);
  console.log(`PROPERTY: ${prop.name} (${prop.path})`);
  
  // Title
  const titleM = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  console.log(`TITLE: ${titleM ? titleM[1].replace(/<[^>]+>/g, '').trim() : 'N/A'}`);

  // Description
  const descM = html.match(/<div class=["']wpestate_property_description["']>([\s\S]*?)<\/div>/i)
    || html.match(/<div class=["']entry-content["']>([\s\S]*?)<\/div>/i)
    || html.match(/<div[^>]*class=["'][^"']*property_description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  
  console.log(`DESCRIPTION HTML:\n${descM ? descM[1].trim() : 'N/A'}\n`);

  // Details
  const details = [];
  const detailMatches = html.matchAll(/<div class=["']listing_detail[^"']*["']>([\s\S]*?)<\/div>/gi);
  for (const m of detailMatches) {
    details.push(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }
  console.log(`DETAILS (${details.length}):`, details.slice(0, 10));

  // Features / Amenities
  const features = [];
  const featMatches = html.matchAll(/<div class=["']listing_detail_feature[^"']*["']>([\s\S]*?)<\/div>/gi);
  for (const m of featMatches) {
    features.push(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }
  console.log(`FEATURES (${features.length}):`, features);
}
