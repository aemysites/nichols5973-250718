/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Hero (hero35)'];

  // Find the main content container
  const container = element.querySelector('.container');
  if (!container) return;
  const innerRow = container.querySelector('.row');
  if (!innerRow) return;

  const titleDiv = innerRow.querySelector('.rich-text__title');
  const bodyDiv = innerRow.querySelector('.rich-text__body');

  // Compose the content cell
  const contentCell = [];

  // Add all heading elements from titleDiv and bodyDiv
  if (titleDiv) {
    Array.from(titleDiv.children).forEach(child => {
      if (/^H[1-6]$/i.test(child.tagName)) {
        contentCell.push(child);
      }
    });
  }
  if (bodyDiv) {
    Array.from(bodyDiv.children).forEach(child => {
      // Only skip empty paragraphs (e.g. <p>&nbsp;</p>), include everything else
      if (child.tagName === 'P' && child.textContent.trim() === '') return;
      contentCell.push(child);
    });
  }

  // No image in screenshots or HTML, so leave row 2 empty
  const imageRow = [''];
  const contentRow = [contentCell];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
