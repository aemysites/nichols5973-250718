/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Hero (hero4)'];

  // Extract background image from style="background-image: url( ... )"
  let backgroundCell = '';
  const styleAttr = element.getAttribute('style') || '';
  const bgMatch = styleAttr.match(/background-image:\s*url\(([^)]+)\)/i);
  if (bgMatch && bgMatch[1]) {
    const img = document.createElement('img');
    img.src = bgMatch[1].replace(/['"]/g, '');
    backgroundCell = img;
  }

  // Find the layout container, which holds all the content
  const layoutContainer = element.querySelector(':scope > .layout-container');
  let contentCell = '';
  if (layoutContainer) {
    // Reference the entire block of content for robustness
    contentCell = layoutContainer;
  }

  // Compose the table as per instructions: 1 col, 3 rows
  const cells = [
    headerRow,
    [backgroundCell],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
