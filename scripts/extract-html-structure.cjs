const fs = require('fs');

function cleanHTML(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  // Remove scripts, styles, svg
  const cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');
  
  // Extract main headings, paragraphs, and list items
  const matches = cleaned.match(/<(h[1-6]|p|li|span|a)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
  const textBlocks = [];
  for (let m of matches) {
    const txt = m.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (txt.length > 5 && !textBlocks.includes(txt) && !txt.includes('var ') && !txt.includes('function(')) {
      textBlocks.push(txt);
    }
  }
  return textBlocks;
}

console.log('=== SERVICES TEXT BLOCKS ===');
console.log(cleanHTML('database/services/index.html').join('\n---\n'));

console.log('\n=== ABOUT-US TEXT BLOCKS ===');
console.log(cleanHTML('database/about-us/index.html').join('\n---\n'));

console.log('\n=== CONTACT-FORM TEXT BLOCKS ===');
console.log(cleanHTML('database/contact-form/index.html').join('\n---\n'));

console.log('\n=== SIGN-IN-2 TEXT BLOCKS ===');
console.log(cleanHTML('database/sign-in-2/index.html').join('\n---\n'));
