/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract background image url from style attribute
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]*)\)/i);
    return match ? match[1].replace(/['"]/g, '') : null;
  }

  // Header row
  const headerRow = ['Hero (hero56)'];

  // Background image row
  const bgUrl = getBackgroundImageUrl(element);
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // Content row: get main inner content block
  // Find the div.layout-container
  let contentCell = '';
  const layout = Array.from(element.children).find(child => child.classList && child.classList.contains('layout-container'));
  if (layout) {
    // Find the table within layout
    const table = layout.querySelector('table');
    if (table) {
      const td = table.querySelector('td');
      if (td) {
        // Use all childNodes of td (including text, elements, keep structure)
        // Remove empty text nodes only
        const nodes = Array.from(td.childNodes).filter(
          node => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
        );
        contentCell = nodes.length > 1 ? nodes : (nodes[0] || '');
      }
    }
  }
  if (!contentCell) {
    contentCell = '';
  }
  const contentRow = [contentCell];

  // Compose rows
  const cells = [
    headerRow,
    bgRow,
    contentRow
  ];

  // Create and insert the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
