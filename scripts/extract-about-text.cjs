const fs = require('fs');
const html = fs.readFileSync('database/about-us/index.html', 'utf8');

const matches = html.match(/<div class="elementor-text-editor[^"]*">([\s\S]*?)<\/div>/gi);
console.log('Text editor count in about-us:', matches ? matches.length : 0);
if (matches) {
  matches.forEach((m, idx) => {
    console.log(`\n=== Text Block #${idx+1} ===`);
    console.log(m.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  });
}
