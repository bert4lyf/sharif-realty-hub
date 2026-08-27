const fs = require('fs');

const xml = fs.readFileSync('database/sharifrealty.WordPress.2026-08-24.xml', 'utf8');

function extractElementorForSlug(targetSlug) {
  console.log(`\n=================== SLUG: ${targetSlug} ===================`);
  const regex = new RegExp(`<wp:post_name><!\\[CDATA\\[${targetSlug}\\]\\]><\\/wp:post_name>`, 'i');
  const match = xml.match(regex);
  if (!match) {
    console.log(`Slug ${targetSlug} not found in XML.`);
    return null;
  }
  const idx = match.index;
  const itemStart = xml.lastIndexOf('<item>', idx);
  const itemEnd = xml.indexOf('</item>', idx);
  const itemXml = xml.slice(itemStart, itemEnd + 7);
  
  const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
  console.log('Title:', titleMatch ? titleMatch[1] : 'N/A');

  const elementorMatch = itemXml.match(/<wp:meta_key><!\[CDATA\[_elementor_data\]\]><\/wp:meta_key>[\s\S]*?<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/);
  if (elementorMatch) {
    try {
      const data = JSON.parse(elementorMatch[1]);
      
      // Recursive extraction of all widget text and settings
      const extractedWidgets = [];
      function recurseElements(elements) {
        if (!elements || !Array.isArray(elements)) return;
        for (let el of elements) {
          if (el.widgetType) {
            extractedWidgets.push({
              type: el.widgetType,
              settings: el.settings
            });
          }
          if (el.elements) recurseElements(el.elements);
        }
      }
      recurseElements(data);
      console.log('Widgets count:', extractedWidgets.length);
      extractedWidgets.forEach((w, i) => {
        console.log(`\n--- Widget #${i+1}: ${w.type} ---`);
        if (w.settings.title) console.log('Title:', w.settings.title);
        if (w.settings.editor) console.log('Editor text:', w.settings.editor);
        if (w.settings.description) console.log('Description:', w.settings.description);
        if (w.settings.caption) console.log('Caption:', w.settings.caption);
        if (w.settings.text) console.log('Text:', w.settings.text);
        if (w.settings.header_title) console.log('Header title:', w.settings.header_title);
        if (w.settings.section_title) console.log('Section title:', w.settings.section_title);
      });
      return extractedWidgets;
    } catch(e) {
      console.log('JSON Parse Error:', e.message);
    }
  } else {
    console.log('No _elementor_data found in item.');
  }
}

extractElementorForSlug('about-us');
extractElementorForSlug('services');
extractElementorForSlug('contact-form');
extractElementorForSlug('all-listings-3');
extractElementorForSlug('sign-in-2');
