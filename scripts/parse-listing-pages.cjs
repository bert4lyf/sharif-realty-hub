const fs = require('fs');

const pages = [
  'database/off-market-2-bed-2-5-bath-1400sqft-1400-square-/index.html',
  'database/off-market-3-bed-3-bath-1184sqft-1184-square-fe/index.html',
  'database/off-market-4-bed-2-5-bath-3239sqft-3239-square-/index.html',
  'database/off-market-4-bed-3-bath-1724sqft-1724-square-fe/index.html',
  'database/properties/commercial-property-at-north-main-st-waterbury/index.html',
  'database/properties/single-family-4-bedrooms-3-baths/index.html',
  'database/properties/waterbury-connecticut/index.html'
];

for (let p of pages) {
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    console.log(`\n=================== ${p} ===================`);
    
    // Find images referenced in the page
    const imgs = [];
    const imgRegex = /src=["']([^"']*(?:jpg|jpeg|png|webp))["']/gi;
    let m;
    while ((m = imgRegex.exec(html)) !== null) {
      if (!m[1].includes('logo') && !m[1].includes('icon') && !m[1].includes('svg')) {
        imgs.push(m[1]);
      }
    }
    console.log('Images referenced:', [...new Set(imgs)]);
    
    // Find title and address
    const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    console.log('H1 Title:', title ? title[1].replace(/<[^>]+>/g, '').trim() : 'N/A');
    
    // Find property details / breadcrumb
    const propertyAddress = html.match(/class="property_categs">([\s\S]*?)<\/div>/i)
      || html.match(/class="price_area">([\s\S]*?)<\/div>/i);
    if (propertyAddress) console.log('Details:', propertyAddress[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }
}
