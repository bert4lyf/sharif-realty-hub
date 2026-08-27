const fs = require('fs');

const html = fs.readFileSync('database/properties-list-with-ajax-filters/index.html', 'utf8');

const regex = /<div class=["'][^"']*listing_wrapper[^"']*["'][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi;
const matches = [...html.matchAll(regex)];
console.log('Matches:', matches.length);

matches.forEach((m, idx) => {
  console.log(`\n--- Unit #${idx+1} ---`);
  console.log(m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
});
