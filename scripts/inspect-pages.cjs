const fs = require('fs');

const pages = [
  'database/services/index.html',
  'database/about-us/index.html',
  'database/contact-form/index.html',
  'database/sign-in-2/index.html',
  'database/add-listing-2/index.html',
  'database/properties-list-with-ajax-filters/index.html',
  'database/property-list-directory-design/index.html'
];

for (let p of pages) {
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    console.log(`=== ${p} (length: ${html.length}) ===`);
    // Extract title
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'N/A');
    
    // Check for elementor sections or main container
    const entryContent = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<!-- \.entry-content -->/i)
      || html.match(/<div[^>]*class="[^"]*single-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    
    if (entryContent) {
      console.log('Content preview (first 400 chars):', entryContent[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400));
    } else {
      console.log('No entry-content match found');
    }
  } else {
    console.log(`NOT FOUND: ${p}`);
  }
}
