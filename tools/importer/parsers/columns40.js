/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find image column and content column
  const imageCol = element.querySelector('.hero-2-block__image');
  const contentCol = element.querySelector('.hero-2-block__copy');

  // --- Image Column ---
  let imgEl = null;
  if (imageCol) {
    // Reference the actual <img> element (not clone)
    imgEl = imageCol.querySelector('img');
  }

  // --- Content Column ---
  // Compose cell: icon + heading + all text
  const rightCellContent = [];
  if (contentCol) {
    // Reference the actual icon container
    const iconEl = contentCol.querySelector('.icon-container');
    if (iconEl) rightCellContent.push(iconEl);
    // Reference the actual heading
    const headingEl = contentCol.querySelector('h1');
    if (headingEl) rightCellContent.push(headingEl);
    // Extract any additional text content (including from heading)
    // Ensure all text in contentCol is included
    const textNodes = Array.from(contentCol.querySelectorAll('*'))
      .filter(el => el.childNodes.length && Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
    textNodes.forEach(el => {
      const text = el.textContent.trim();
      if (text && !rightCellContent.some(e => e.textContent && e.textContent.trim() === text)) {
        rightCellContent.push(document.createTextNode(text));
      }
    });
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns40)'];
  const columnsRow = [imgEl, rightCellContent];
  const rows = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
