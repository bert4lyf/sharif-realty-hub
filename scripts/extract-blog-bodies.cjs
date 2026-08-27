const fs = require('fs');
const path = require('path');

const folders = [
  '7-reasons-why-you-should-work-with-a-realtor',
  'selling-your-home-during-the-holidays',
  'existing-home-sales-slid-5-4-in-june',
  'florida-realtors-work-to-defeat-rent-control',
  'heres-this-weeks-commloan-commercial-rate-snapshot',
  'heres-this-weeks-commloan-commercial-rate-snapshot-2',
  'latest-news-from-nar',
  'latest-news-from-nar-2'
];

folders.forEach(f => {
  const p = path.join('database', f, 'index.html');
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const bodyM = html.match(/<div class=["']single-content["']>([\s\S]*?)<\/div>\s*<!-- end single content -->/i)
      || html.match(/<div class=["']single-content["']>([\s\S]*?)<\/div>/i);
    
    console.log(`\n================== ${f} ==================`);
    if (bodyM) {
      console.log(bodyM[1].replace(/<script[\s\S]*?<\/script>/gi, '').trim());
    }
  }
});
