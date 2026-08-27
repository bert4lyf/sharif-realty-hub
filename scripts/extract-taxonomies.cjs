const fs = require('fs');

const extractedData = JSON.parse(fs.readFileSync('database/extracted_site_data.json', 'utf8'));
const allContent = JSON.parse(fs.readFileSync('database/all_extracted_content.json', 'utf8'));

console.log('--- ALL PROPERTIES & TAXONOMIES ---');
const properties = extractedData.properties || [];
console.log('Extracted properties count:', properties.length);

properties.forEach((p, i) => {
  console.log(`\n[Property #${i+1}] ID: ${p.id} | Slug: ${p.slug}`);
  console.log(`Title: ${p.title}`);
  console.log(`Categories:`, p.categories);
  console.log(`Thumbnail ID:`, p.meta?._thumbnail_id);
  console.log(`Gallery string:`, p.meta?.image_to_attach || p.meta?.wpestate_property_gallery);
  console.log(`Address/City:`, p.meta?.property_address, p.meta?.property_city);
  console.log(`Bed/Bath/Size/Tax:`, {
    beds: p.meta?.property_bedrooms,
    baths: p.meta?.property_bathrooms,
    size: p.meta?.property_size,
    price: p.meta?.property_price,
    label: p.meta?.property_label
  });

  // Resolve thumbnail ID to file URL
  if (p.meta?._thumbnail_id && allContent.attachmentMap[p.meta._thumbnail_id]) {
    console.log(`Featured Image Resolved:`, allContent.attachmentMap[p.meta._thumbnail_id]);
  }
});

// Also check all posts in off-market or individual listing directories
console.log('\n--- BIZDIR / OTHER LISTINGS in all_extracted_content.json ---');
if (allContent.bizDir) {
  console.log('bizDir count:', Object.keys(allContent.bizDir).length);
  Object.values(allContent.bizDir).slice(0, 5).forEach((b, idx) => {
    console.log(`BizDir #${idx+1}:`, b.title || b.name, b.slug);
  });
}
