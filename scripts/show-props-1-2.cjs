const fs = require('fs');
const allContent = JSON.parse(fs.readFileSync('database/all_extracted_content.json', 'utf8'));

[0, 1].forEach(idx => {
  const p = allContent.properties[idx];
  console.log(`\n[${idx+1}] ID: ${p.id} | Slug: ${p.slug} | Title: ${p.title}`);
  console.log(`Content:\n"${p.content}"`);
  console.log(`Excerpt:\n"${p.excerpt}"`);
  console.log(`Address: ${p.meta.property_address} | City: ${p.meta.property_city}`);
  console.log(`Price: ${p.meta.property_price} | Label: ${p.meta.property_label}`);
  console.log(`Bedrooms: ${p.meta.property_bedrooms} | Bathrooms: ${p.meta.property_bathrooms} | Size: ${p.meta.property_size}`);
});
