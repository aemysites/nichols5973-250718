/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name, exactly as in the example
  const headerRow = ['Hero (hero56)'];

  // Row 2: Background image (optional)
  let bgImageUrl = null;
  const styleAttr = element.getAttribute('style') || '';
  const bgImgMatch = styleAttr.match(/background-image:\s*url\(([^)]+)\)/i);
  if (bgImgMatch) {
    // Strip quotes if present
    bgImageUrl = bgImgMatch[1].replace(/^['"]|['"]$/g, '');
  }
  let bgImageEl = null;
  if (bgImageUrl) {
    bgImageEl = document.createElement('img');
    bgImageEl.src = bgImageUrl;
    bgImageEl.alt = '';
  }
  const backgroundRow = [bgImageEl ? bgImageEl : ''];

  // Row 3: Content
  // Find the table > td > all content
  let contentCell = '';
  const layout = element.querySelector('.layout-container');
  if (layout) {
    const table = layout.querySelector('table');
    if (table) {
      const td = table.querySelector('td');
      if (td) {
        // Get all child nodes of td (including text, elements, lists, etc.)
        // Remove empty text nodes
        const nodes = Array.from(td.childNodes).filter(n => {
          return !(n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '');
        });
        if (nodes.length) {
          contentCell = nodes;
        }
      }
    }
  }
  const contentRow = [contentCell];

  // Build the table for the block
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}