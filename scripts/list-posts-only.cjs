const fs = require('fs');
const allContent = JSON.parse(fs.readFileSync('database/all_extracted_content.json', 'utf8'));

console.log('Total posts in allContent.posts:', allContent.posts.length);
allContent.posts.forEach((p, idx) => {
  console.log(`[${idx+1}] ID: ${p.id} | Date: ${p.date} | Status: ${p.status}`);
  console.log(`  Title: ${p.title}`);
  console.log(`  Slug: ${p.slug}`);
  console.log(`  Categories: ${p.categories.map(c => c.name).join(', ')}`);
  console.log(`  Thumb: ${p.meta && p.meta._thumbnail_id ? JSON.stringify(allContent.attachmentMap[p.meta._thumbnail_id]) : 'none'}`);
  console.log(`  Content Preview: ${p.content ? p.content.replace(/\s+/g, ' ').substring(0, 150) : ''}`);
});
