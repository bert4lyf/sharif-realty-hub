const fs = require('fs');

const files = [
  'database/services/index.html',
  'database/about-us/index.html',
  'database/contact-form/index.html',
  'database/sign-in-2/index.html',
  'database/add-listing-2/index.html',
  'database/properties-list-with-ajax-filters/index.html'
];

for (let file of files) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n================== ${file} ==================`);
  
  // Extract text from elementor sections
  const elementorMatch = html.match(/<div data-elementor-type="wp-page"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<!-- \/content_wrapper -->/i)
    || html.match(/<div class="container content_wrapper[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<!-- \/content_wrapper -->/i)
    || html.match(/<div id="primary"[^>]*>([\s\S]*?)<\/div>\s*<!-- #primary -->/i);
    
  if (elementorMatch) {
    const text = elementorMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 2);
    console.log(text.slice(0, 30).join(' | '));
  } else {
    console.log('No container match, first 300 chars of body:');
    const bodyMatch = html.match(/<body[^>]*>([\s\S]{0,1000})/i);
    console.log(bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300) : 'none');
  }
}
