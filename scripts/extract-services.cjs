const fs = require('fs');
const html = fs.readFileSync('database/services/index.html', 'utf8');

// Find all elements with class 'elementor-widget-wrap' or text content
const sections = html.match(/<div class="elementor-widget-wrap[^"]*">([\s\S]*?)<\/div>/gi);
console.log('Total widget wraps in services:', sections ? sections.length : 0);

if (sections) {
  sections.forEach((s, idx) => {
    const text = s.replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length > 20 && !text.includes('Twitter') && !text.includes('Quick Links')) {
      console.log(`\n[SECTION ${idx+1}]:\n${text}`);
    }
  });
}
