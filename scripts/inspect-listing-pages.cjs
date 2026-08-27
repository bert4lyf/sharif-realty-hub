const fs = require('fs');

const files = [
  'database/properties-list-with-ajax-filters/index.html',
  'database/properties-list-just-featured/index.html',
  'database/properties-list-sidebar-left/index.html',
  'database/elementor-home-v6/index.html',
  'database/homepage-elementor/index.html',
  'database/index.html'
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  console.log('=== Checking: ' + f + ' ===');
  const html = fs.readFileSync(f, 'utf8');
  
  // Find listing titles and excerpts
  const listingUnits = [...html.matchAll(/<div class=["']property_listing[^"']*["'][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi)];
  console.log(`Found ${listingUnits.length} property listing units`);
  
  // Also find any property cards
  const titles = [...html.matchAll(/<h4><a href=["']([^"']+)["']>([^<]+)<\/a><\/h4>/gi)].map(m => ({ href: m[1], title: m[2] }));
  console.log('Card titles:', titles);
}
