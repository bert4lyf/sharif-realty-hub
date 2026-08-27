const http = require('http');

const endpoints = [
  '/',
  '/services',
  '/about',
  '/about-us',
  '/contact',
  '/contact-form',
  '/sign-in',
  '/login',
  '/add-listing',
  '/properties',
  '/properties/commercial-property-at-north-main-st-waterbury',
  '/properties/waterbury-connecticut',
  '/properties/single-family-4-bedrooms-3-baths',
  '/properties/off-market-4-bed-2-5-bath-3239sqft-5-shire-way-burlington-ct',
  '/properties/off-market-2-bed-2-5-bath-1400sqft-270-new-britain-rd-berlin-ct',
  '/properties/off-market-3-bed-3-bath-1184sqft-71-avon-ave-waterbury-ct',
  '/properties/off-market-4-bed-3-bath-1724sqft-102-madera-dr-waterbury-ct',
  '/blogs',
  '/blogs/selling-your-home-during-the-holidays',
  '/blogs/heres-this-weeks-commloan-commercial-rate-snapshot',
  '/admin/dashboard',
  '/admin/posts',
  '/admin/crm',
  '/admin/media',
  '/admin/settings',
  '/staff/dashboard'
];

async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:8080${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path: urlPath,
          status: res.statusCode,
          ok: res.statusCode === 200,
          length: data.length
        });
      });
    });
    req.on('error', (err) => {
      resolve({ path: urlPath, error: err.message });
    });
    req.setTimeout(5000, () => {
      req.abort();
      resolve({ path: urlPath, error: 'TIMEOUT' });
    });
  });
}

async function run() {
  console.log('=== TESTING LOCAL SERVER ENDPOINTS ===\n');
  let passed = 0;
  let failed = 0;
  for (let ep of endpoints) {
    const res = await checkUrl(ep);
    if (res.ok) {
      console.log(`✅ [200 OK] ${ep} (${res.length} bytes)`);
      passed++;
    } else {
      console.log(`❌ [FAILED: ${res.status || res.error}] ${ep}`);
      failed++;
    }
  }
  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
}

run();
