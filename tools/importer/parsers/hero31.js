/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero31) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional, not present here)
  // Row 3: Title, subheading, CTA (text + link)

  // Header row
  const headerRow = ['Hero (hero31)'];

  // Row 2: No image present
  const imageRow = [''];

  // Row 3: Text content and CTA
  // Defensive: get the <p> element
  let paragraph = element.tagName === 'P' ? element : element.querySelector('p');
  if (!paragraph) paragraph = element;

  // Clone paragraph to avoid DOM mutation issues
  const paraClone = paragraph.cloneNode(true);

  // Place the full paragraph (with all links intact) in the cell
  const textRow = [paraClone];

  // Assemble table
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
