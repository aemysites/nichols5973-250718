/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero31) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (the image in the HTML)
  // Row 3: Title, subheading, CTA (all text content in this case)

  // Find the image element
  const img = element.querySelector('img');
  let imageCell = '';
  if (img) {
    // Clone the image node to preserve attributes
    imageCell = img.cloneNode(true);
  }

  // Extract all text content from the original HTML (including text nodes)
  // We'll use textContent to ensure all text is captured
  const text = element.textContent.trim();

  const headerRow = ['Hero (hero31)'];
  const imageRow = [imageCell];
  const contentRow = [text ? text : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
