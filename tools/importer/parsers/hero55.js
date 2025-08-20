/* global WebImporter */
export default function parse(element, { document }) {
  // Header row -- matches example exactly
  const headerRow = ['Hero (hero55)'];

  // Second row: background image (from style)
  let bgImgElem = null;
  const styleAttr = element.getAttribute('style') || '';
  const bgMatch = styleAttr.match(/background-image:\s*url\(([^)]+)\)/);
  if (bgMatch && bgMatch[1]) {
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgMatch[1].replace(/['"]/g, '');
    bgImgElem.alt = '';
  }
  const bgImgRow = [bgImgElem ? bgImgElem : ''];

  // Third row: all content in the visible block (preserve order and semantics)
  let contentCell = [];
  const layoutContainer = element.querySelector('.layout-container');
  if (layoutContainer) {
    // Find table -- but preserve all content in its cell
    const table = layoutContainer.querySelector('table');
    if (table) {
      const td = table.querySelector('td');
      if (td) {
        // Reference ALL child nodes (elements and text nodes with visible content)
        contentCell = Array.from(td.childNodes).filter(node => {
          // Element nodes
          if (node.nodeType === 1) return true;
          // Text nodes (avoid whitespace-only)
          if (node.nodeType === 3 && node.textContent.trim()) return true;
          return false;
        });
      }
    }
  }
  // Structure: always an array in the cell (even if empty)
  const contentRow = [contentCell];

  // Compose table: 1 column x 3 rows
  const cells = [headerRow, bgImgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
