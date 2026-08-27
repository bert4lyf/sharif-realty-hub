const fs = require('fs');
const path = require('path');

const allContent = JSON.parse(fs.readFileSync('database/all_extracted_content.json', 'utf8'));

console.log('=== ALL POSTS IN XML ===');
allContent.posts.forEach((p, idx) => {
  console.log('----------------------------------------');
  console.log('Index:', idx, '| ID:', p.id, '| Status:', p.status);
  console.log('Title:', p.title);
  console.log('Slug:', p.slug);
  console.log('Date:', p.date);
  console.log('Categories:', p.categories.map(c => c.name).join(', '));
  console.log('Thumbnail attachment:', p.meta && p.meta._thumbnail_id ? allContent.attachmentMap[p.meta._thumbnail_id] : 'none');
  console.log('Content (first 400 chars):', p.content ? p.content.substring(0, 400) : 'EMPTY');
});

console.log('\n=== ALL PROPERTIES IN XML ===');
allContent.properties.forEach((pr, idx) => {
  console.log('----------------------------------------');
  console.log('Index:', idx, '| ID:', pr.id, '| Status:', pr.status);
  console.log('Title:', pr.title);
  console.log('Slug:', pr.slug);
  console.log('Date:', pr.date);
  console.log('Categories:', pr.categories.map(c => c.name).join(', '));
  console.log('Meta:', pr.meta);
  console.log('Content (full):', pr.content);
});

console.log('\n=== ALL AT_BIZ_DIR IN XML ===');
allContent.bizDir.forEach((b, idx) => {
  console.log('----------------------------------------');
  console.log('Index:', idx, '| ID:', b.id, '| Status:', b.status);
  console.log('Title:', b.title);
  console.log('Slug:', b.slug);
  console.log('Categories:', b.categories.map(c => c.name).join(', '));
  console.log('Content (full):', b.content);
});
