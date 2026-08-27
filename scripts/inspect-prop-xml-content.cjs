const fs = require('fs');
const allContent = JSON.parse(fs.readFileSync('database/all_extracted_content.json', 'utf8'));

console.log('--- XML PROPERTIES (estate_property) ---');
allContent.properties.forEach(p => {
  console.log(`\nSlug: ${p.slug} | ID: ${p.id}`);
  console.log(`Title: ${p.title}`);
  console.log(`Content: ${p.content}`);
  console.log(`Excerpt: ${p.excerpt}`);
  console.log(`Meta:`, p.meta);
});

console.log('\n--- OFF-MARKET POSTS (post) ---');
allContent.posts.filter(p => p.slug.startsWith('off-market')).forEach(p => {
  console.log(`\nSlug: ${p.slug} | ID: ${p.id}`);
  console.log(`Title: ${p.title}`);
  console.log(`Content: ${p.content}`);
  console.log(`Excerpt: ${p.excerpt}`);
});
