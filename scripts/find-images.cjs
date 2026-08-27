const fs = require('fs');
const path = require('path');

const imgFiles = [];
function findImages(dir) {
  try {
    for (let f of fs.readdirSync(dir)) {
      let p = path.join(dir, f);
      let st = fs.statSync(p);
      if (st.isDirectory()) {
        findImages(p);
      } else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f)) {
        imgFiles.push({ path: p, name: f, size: st.size });
      }
    }
  } catch(e) {}
}

findImages('database');
console.log('Total images found in database folder:', imgFiles.length);
console.log('Sample images (first 20):', imgFiles.slice(0, 20));
