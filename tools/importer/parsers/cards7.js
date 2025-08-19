/* global WebImporter */
export default function parse(element, { document }) {
  // EXACT header per example
  const headerRow = ['Cards (cards7)'];
  const cells = [headerRow];

  // Find card row(s): in given HTML, cards are inside .entry-points__row
  const cardRows = element.querySelectorAll('.entry-points__row');
  cardRows.forEach(row => {
    // Each card is a .entry-point__item (which is an <a>)
    const cards = row.querySelectorAll('.entry-point__item');
    cards.forEach(card => {
      // Image: first img in .entry-point__item--img
      const imgWrapper = card.querySelector('.entry-point__item--img');
      const img = imgWrapper ? imgWrapper.querySelector('img') : null;

      // Text: all content inside .entry-point__item--body (preserving structure)
      const body = card.querySelector('.entry-point__item--body');
      let textContent;
      if (body) {
        // Gather all body children (including text nodes)
        // This is robust against missing/extra elements
        textContent = [];
        body.childNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            textContent.push(node);
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            // For non-empty text nodes, wrap in <span> to preserve text
            const span = document.createElement('span');
            span.textContent = node.textContent.trim();
            textContent.push(span);
          }
        });
        // If only one element, use that element directly
        if (textContent.length === 1) textContent = textContent[0];
      } else {
        textContent = '';
      }

      // Add table row: two columns (image, text)
      cells.push([img || '', textContent]);
    });
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}