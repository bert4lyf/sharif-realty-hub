const fs = require('fs');

['database/properties/waterbury-connecticut/index.html', 'database/properties/single-family-4-bedrooms-3-baths/index.html'].forEach(filePath => {
  console.log('=== FILE: ' + filePath + ' ===');
  const html = fs.readFileSync(filePath, 'utf8');
  // find all p tags or content
  const pTags = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(t => t.length > 0);
  console.log('Paragraphs:', pTags);

  const panelBodies = [...html.matchAll(/<div class=["']panel-body["']>([\s\S]*?)<\/div>/gi)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).filter(t => t.length > 0);
  console.log('Panel bodies:', panelBodies);
});
