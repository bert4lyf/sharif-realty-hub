const fs = require('fs');

const xml = fs.readFileSync('database/sharifrealty.WordPress.2026-08-24.xml', 'utf8');

// Find all items in XML
const items = xml.split('<item>').slice(1);
console.log('Total XML items:', items.length);

const postTypes = {};
const propertyItems = [];
const blogItems = [];

items.forEach((item, idx) => {
  const postTypeMatch = item.match(/<wp:post_type><!\[CDATA\[(.*?)\]\]><\/wp:post_type>/);
  const postType = postTypeMatch ? postTypeMatch[1] : 'unknown';
  postTypes[postType] = (postTypes[postType] || 0) + 1;

  const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : '';
  const slugMatch = item.match(/<wp:post_name><!\[CDATA\[(.*?)\]\]><\/wp:post_name>/);
  const slug = slugMatch ? slugMatch[1] : '';
  const statusMatch = item.match(/<wp:status><!\[CDATA\[(.*?)\]\]><\/wp:status>/);
  const status = statusMatch ? statusMatch[1] : '';

  if (postType === 'estate_property' || /off-market/i.test(title) || /off-market/i.test(slug)) {
    propertyItems.push({ idx, postType, title, slug, status, itemSnippet: item.slice(0, 500) });
  }

  if (postType === 'post') {
    blogItems.push({ idx, title, slug, status });
  }
});

console.log('Post types breakdown:', postTypes);
console.log('\nProperty items found in XML (count: ' + propertyItems.length + '):');
propertyItems.forEach(p => console.log(p));

console.log('\nBlog items found in XML (count: ' + blogItems.length + '):');
blogItems.forEach(b => console.log(b));
