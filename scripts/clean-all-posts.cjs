const fs = require('fs');
const path = require('path');

function cleanVcContent(str) {
  if (!str) return '';
  return str
    .replace(/\[\/?vc_[^\]]*\]/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .trim();
}

const allContent = JSON.parse(fs.readFileSync('database/all_extracted_content.json', 'utf8'));

console.log('=== CLEANED CONTENT SUMMARY FOR ALL POSTS ===');
allContent.posts.forEach((p, idx) => {
  const cleaned = cleanVcContent(p.content);
  console.log(`\n--------------------------------------------------`);
  console.log(`[${idx+1}] ID: ${p.id} | Slug: ${p.slug}`);
  console.log(`Title: ${p.title}`);
  console.log(`Date: ${p.date}`);
  console.log(`Category: ${p.categories.map(c => c.name).join(', ')}`);
  console.log(`Excerpt: ${p.excerpt || cleaned.replace(/<[^>]+>/g, ' ').substring(0, 160) + '...'}`);
  console.log(`Cleaned HTML:\n${cleaned.substring(0, 300)}...`);
});
