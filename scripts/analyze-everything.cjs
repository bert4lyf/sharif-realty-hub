const fs = require('fs');
const path = require('path');

console.log('=== 1. ANALYZING BLOGS IN DATABASE ===');
const allContent = JSON.parse(fs.readFileSync('database/all_extracted_content.json', 'utf8'));
console.log('Posts count in all_extracted_content.json:', allContent.posts ? allContent.posts.length : 0);

if (allContent.posts) {
  allContent.posts.forEach((p, idx) => {
    console.log(`\nBlog #${idx+1}:`);
    console.log(`  ID: ${p.id}`);
    console.log(`  Title: ${p.title}`);
    console.log(`  Slug: ${p.slug}`);
    console.log(`  Date: ${p.date}`);
    console.log(`  Status: ${p.status}`);
    console.log(`  Categories:`, p.categories);
    console.log(`  Thumbnail ID:`, p.meta ? p.meta._thumbnail_id : undefined);
    if (p.meta && p.meta._thumbnail_id && allContent.attachmentMap && allContent.attachmentMap[p.meta._thumbnail_id]) {
      console.log(`  Thumbnail attachment:`, allContent.attachmentMap[p.meta._thumbnail_id]);
    }
    console.log(`  Excerpt:`, p.excerpt ? p.excerpt.substring(0, 150) : '');
    console.log(`  Content length:`, p.content ? p.content.length : 0);
  });
}

// Check database folders that might be blog posts
const dbDirs = fs.readdirSync('database').filter(f => {
  try {
    return fs.statSync(path.join('database', f)).isDirectory();
  } catch(e) {
    return false;
  }
});

console.log('\n=== Checking individual database directories for HTML content ===');
const blogFolders = [
  '7-reasons-why-you-should-work-with-a-realtor',
  'existing-home-sales-slid-5-4-in-june',
  'florida-realtors-work-to-defeat-rent-control',
  'heres-this-weeks-commloan-commercial-rate-snaps',
  'heres-this-weeks-commloan-commercial-rate-snapshot',
  'heres-this-weeks-commloan-commercial-rate-snapshot-2',
  'latest-news-from-nar',
  'latest-news-from-nar-2',
  'selling-your-home-during-the-holidays'
];

blogFolders.forEach(folder => {
  const indexHtml = path.join('database', folder, 'index.html');
  if (fs.existsSync(indexHtml)) {
    const html = fs.readFileSync(indexHtml, 'utf8');
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
    console.log(`Folder [${folder}]: Title = ${titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'N/A'}`);
    
    // Find images in the blog HTML
    const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log(`  Images (${imgMatches.length}):`, imgMatches.slice(0, 5));
  } else {
    console.log(`Folder [${folder}]: No index.html found`);
  }
});

console.log('\n=== 2. ANALYZING PROPERTIES IN DATABASE ===');
const propertyFolders = [
  'commercial-property-at-north-main-st-waterbury',
  'waterbury-connecticut',
  'single-family-4-bedrooms-3-baths',
  'off-market-4-bed-2-5-bath-3239sqft-3239-square-',
  'off-market-2-bed-2-5-bath-1400sqft-1400-square-',
  'off-market-3-bed-3-bath-1184sqft-1184-square-fe',
  'off-market-4-bed-3-bath-1724sqft-1724-square-fe'
];

propertyFolders.forEach(folder => {
  let fullPath = path.join('database', 'properties', folder, 'index.html');
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join('database', folder, 'index.html');
  }
  if (fs.existsSync(fullPath)) {
    const html = fs.readFileSync(fullPath, 'utf8');
    const titleM = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const descM = html.match(/<div class=["']wpestate_property_description["']>([\s\S]*?)<\/div>/i) 
      || html.match(/<div class=["']entry-content["']>([\s\S]*?)<\/div>/i)
      || html.match(/<div[^>]*class=["'][^"']*description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    
    console.log(`\nProperty Folder [${folder}]:`);
    console.log(`  Title: ${titleM ? titleM[1].replace(/<[^>]+>/g, '').trim() : 'N/A'}`);
    console.log(`  Description Preview: ${descM ? descM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 250) : 'N/A'}`);
  }
});
