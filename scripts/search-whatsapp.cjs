const fs = require('fs');
const path = require('path');

function searchFiles(dir, term) {
  let matches = [];
  if (!fs.existsSync(dir)) return matches;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        matches = matches.concat(searchFiles(full, term));
      } else if (item.toLowerCase().includes(term.toLowerCase())) {
        matches.push(full);
      }
    } catch(e) {}
  }
  return matches;
}

console.log('WhatsApp images found:');
const found = searchFiles('.', 'whatsapp');
found.forEach(f => console.log(f.replace(process.cwd(), '')));
