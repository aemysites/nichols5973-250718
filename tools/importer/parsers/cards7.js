/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const cells = [['Cards (cards7)']];

  // Find all the entry-points__row blocks within the element
  const rows = element.querySelectorAll('.entry-points__row');
  rows.forEach(row => {
    // Each card is an <a> with .entry-point__item
    const cards = row.querySelectorAll('.entry-point__item');
    cards.forEach(card => {
      // First cell: the image from the card
      let img = null;
      const imgContainer = card.querySelector('.entry-point__item--img');
      if (imgContainer) {
        img = imgContainer.querySelector('img');
      }
      // Second cell: all content (headings, paragraphs, etc.) from the card's body, preserving structure and order
      const body = card.querySelector('.entry-point__item--body');
      const bodyContent = [];
      if (body) {
        body.childNodes.forEach(node => {
          // Only include non-empty text nodes/elements
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.textContent.trim()) {
              bodyContent.push(node);
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim()) {
              const span = document.createElement('span');
              span.textContent = node.textContent.trim();
              bodyContent.push(span);
            }
          }
        });
      }
      // Add the card only if both image and bodyContent have valid content
      if (img && bodyContent.length) {
        cells.push([img, bodyContent]);
      }
    });
  });
  // Build and replace the block in the DOM
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
