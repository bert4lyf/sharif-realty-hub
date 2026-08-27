const fs = require('fs');
const path = require('path');
const allContent = JSON.parse(fs.readFileSync('database/all_extracted_content.json', 'utf8'));

const posts = allContent.posts || [];
posts.slice(0, 8).forEach(p => {
  console.log(`\nBlog #${p.id} (${p.slug}):`);
  if (p.meta && p.meta._thumbnail_id) {
    const att = allContent.attachmentMap[p.meta._thumbnail_id];
    if (att) {
      const relPath = att.file;
      const candidates = [
        path.join('public', 'uploads', relPath),
        path.join('public', 'wp-content', 'uploads', relPath),
      ];
      const exists = candidates.find(c => fs.existsSync(c));
      console.log(`  Thumb: ${relPath} => Found: ${exists || 'MISSING'}`);
    }
  }
  const inlineImgs = [...(p.content || '').matchAll(/src=["']([^"']+)["']/gi)].map(m => m[1]);
  inlineImgs.forEach(src => {
    const clean = src.replace(/^https?:\/\/[^\/]+/, '');
    const cleanRel = clean.replace(/^\/?(wp-content\/uploads\/|uploads\/)/, '');
    const candidates = [
      path.join('public', clean.replace(/^\//, '')),
      path.join('public', 'uploads', cleanRel),
      path.join('public', 'wp-content', 'uploads', cleanRel),
    ];
    const exists = candidates.find(c => fs.existsSync(c));
    console.log(`  Inline: ${src} => ${cleanRel} => Found: ${exists || 'MISSING'}`);
  });
});
