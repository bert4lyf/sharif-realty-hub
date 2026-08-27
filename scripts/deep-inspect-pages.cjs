const fs = require('fs');

function inspectPage(filePath) {
  console.log(`\n======================================================`);
  console.log(`FILE: ${filePath}`);
  console.log(`======================================================`);
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Find main content between header and footer
  // Look for breadcrumb or main container
  const startIdx = html.indexOf('<div class="content_wrapper');
  const footerIdx = html.indexOf('<footer');
  
  if (startIdx !== -1 && footerIdx !== -1) {
    const mainSection = html.slice(startIdx, footerIdx);
    console.log(`Main section character length: ${mainSection.length}`);
    // Strip tags and show cleaned text preview
    const cleanText = mainSection
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .join('\n');
    console.log(cleanText.slice(0, 2000));
  } else {
    console.log('Could not find start/footer index');
  }
}

inspectPage('database/services/index.html');
inspectPage('database/about-us/index.html');
inspectPage('database/contact-form/index.html');
inspectPage('database/sign-in-2/index.html');
inspectPage('database/properties-list-with-ajax-filters/index.html');
