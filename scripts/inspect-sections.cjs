const fs = require('fs');

function inspectFile(file) {
  const html = fs.readFileSync(file, 'utf8');
  const sections = html.match(/<section[^>]*class="[^"]*elementor-section[^"]*"[^>]*>([\s\S]*?)<\/section>/gi);
  console.log(`\n================== ${file} (Sections: ${sections ? sections.length : 0}) ==================`);
  if (sections) {
    sections.forEach((s, idx) => {
      const text = s.replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (text.length > 5) {
        console.log(`[Sec ${idx + 1}]: ${text.slice(0, 250)}`);
      }
    });
  }
}

inspectFile('database/services/index.html');
inspectFile('database/about-us/index.html');
inspectFile('database/contact-form/index.html');
inspectFile('database/sign-in-2/index.html');
inspectFile('database/all-listing-3/index.html');
inspectFile('database/properties-list-with-ajax-filters/index.html');
