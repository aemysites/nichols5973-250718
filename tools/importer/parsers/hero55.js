/* global WebImporter */
export default function parse(element, { document }) {
  // Get background image from style attribute
  let bgImageUrl = '';
  if (element.hasAttribute('style')) {
    const style = element.getAttribute('style');
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      bgImageUrl = match[1].replace(/['"]/g, '');
    }
  }

  // Find the main content cell
  let contentCell = null;
  const layoutContainer = element.querySelector('.layout-container');
  if (layoutContainer) {
    const table = layoutContainer.querySelector('table');
    if (table) {
      const td = table.querySelector('td');
      if (td) {
        contentCell = td;
      }
    }
  }

  // Build the table rows
  const headerRow = ['Hero (hero55)'];

  // Row 2: background image (if present)
  let bgImgRow = [''];
  if (bgImageUrl) {
    const img = document.createElement('img');
    img.src = bgImageUrl;
    img.alt = '';
    bgImgRow = [img];
  }

  // Row 3: cell containing all significant existing elements from the contentCell
  // We'll skip empty <p> and whitespace-only nodes
  const contentElements = [];
  if (contentCell) {
    Array.from(contentCell.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // skip empty <p> and <strong>&nbsp;</strong> or similar empties
        if (node.tagName === 'P' && node.innerHTML.replace(/\s|&nbsp;/g, '') === '' && node.querySelectorAll('img').length === 0) {
          return;
        }
        contentElements.push(node);
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim() !== '') {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          contentElements.push(span);
        }
      }
    });
  }
  const contentRow = [contentElements];

  // Assemble the block
  const cells = [headerRow, bgImgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
