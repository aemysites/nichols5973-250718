/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero97)'];

  // 2. Background image row
  const bgImg = element.querySelector('img');
  const bgImgRow = [bgImg ? bgImg : ''];

  // 3. Extract all hero content (all text and CTA)
  let contentCell = document.createElement('div');
  contentCell.style.display = 'contents'; // avoid extra wrapper

  // Find the main column that contains hero text
  const column = element.querySelector('.column');
  if (column) {
    // Clone all children inside column, except empty <p> or whitespace-only
    Array.from(column.childNodes).forEach((node) => {
      // Only add elements with visible text or links
      if (node.nodeType === 1) { // Element
        // If <p> or heading or <a>, and has text or children
        if (
          (node.tagName.match(/^H[1-6]$/) && node.textContent.trim()) ||
          (node.tagName === 'P' && node.textContent.replace(/\u00A0/g, '').trim()) ||
          (node.tagName === 'P' && node.querySelector('a'))
        ) {
          contentCell.appendChild(node.cloneNode(true));
        }
      }
    });
  }

  // 4. Table assembly
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    [contentCell],
  ], document);

  element.replaceWith(table);
}
