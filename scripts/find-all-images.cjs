const fs = require('fs');
const path = require('path');

function findImagesInDir(dir, max = 50) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        results = results.concat(findImagesInDir(full, max));
      } else if (/\.(png|jpe?g|webp|svg|gif)$/i.test(item)) {
        results.push(full);
      }
    } catch(e) {}
  }
  return results;
}

console.log('Public images:');
const publicImages = findImagesInDir('public');
console.log(`Found ${publicImages.length} images in public/`);
publicImages.slice(0, 20).forEach(img => console.log(' ', img.replace(process.cwd(), '')));

console.log('\nDatabase images:');
const dbImages = findImagesInDir('database');
console.log(`Found ${dbImages.length} images in database/`);
dbImages.slice(0, 20).forEach(img => console.log(' ', img.replace(process.cwd(), '')));
