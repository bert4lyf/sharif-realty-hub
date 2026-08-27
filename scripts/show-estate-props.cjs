const fs = require('fs');
const allContent = JSON.parse(fs.readFileSync('database/all_extracted_content.json', 'utf8'));

console.log('Total properties in allContent.properties:', allContent.properties.length);
allContent.properties.forEach((p, idx) => {
  console.log(`\n[${idx+1}] ID: ${p.id} | Slug: ${p.slug}`);
  console.log(`Title: ${p.title}`);
  console.log(`Content:\n${p.content}`);
  console.log(`Excerpt:\n${p.excerpt}`);
  console.log(`Meta:`, p.meta);
});
