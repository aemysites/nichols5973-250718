/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content container (row > column if present)
  let main = element;
  const maybeCol = element.querySelector(':scope > div');
  if (maybeCol && maybeCol.classList.contains('column')) {
    main = maybeCol;
  }

  // Find the first image (visual background)
  const img = main.querySelector('img');

  // Gather elements for the content cell (excluding the image itself)
  const cellContent = [];
  for (const node of main.childNodes) {
    // Skip the <p> containing only the img
    if (node.nodeType === 1 && node.tagName === 'P' && node.querySelector('img')) {
      continue;
    }
    // Exclude empty text nodes
    if (node.nodeType === 3 && !node.textContent.trim()) {
      continue;
    }
    cellContent.push(node);
  }

  // Build the table rows
  const rows = [];
  rows.push(['Hero (hero3)']);
  rows.push([img ? img : '']);
  rows.push([cellContent]);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
