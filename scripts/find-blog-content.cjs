const fs = require('fs');

const html = fs.readFileSync('database/7-reasons-why-you-should-work-with-a-realtor/index.html', 'utf8');

// Find all elements between the title and footer
const startIdx = html.indexOf('<h1');
const endIdx = html.indexOf('id="comments"');
if (startIdx !== -1 && endIdx !== -1) {
  console.log('HTML slice between title and comments:');
  console.log(html.substring(startIdx, endIdx));
} else {
  console.log('Not found between title and comments. Start:', startIdx, 'End:', endIdx);
}
