const fs = require('fs');

const xml = fs.readFileSync('database/sharifrealty.WordPress.2026-08-24.xml', 'utf8');
const regex = /all-listing[^\s"'<>]*/gi;
const matches = new Set(xml.match(regex) || []);
console.log('Matches in XML:', Array.from(matches));

const extracted = fs.readFileSync('database/extracted_site_data.json', 'utf8');
const matches2 = new Set(extracted.match(regex) || []);
console.log('Matches in extracted_site_data:', Array.from(matches2));

const htmls = [];
function walk(dir) {
  for (let f of fs.readdirSync(dir)) {
    let p = dir + '/' + f;
    let st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (f.endsWith('.html')) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('all-listing')) htmls.push(p);
    }
  }
}
walk('database');
console.log('HTML files containing all-listing:', htmls);
