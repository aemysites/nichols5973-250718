/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const cells = [['Cards (cards88)']];

  // Defensive: locate main container
  const container = element.querySelector('.layout-container');
  if (!container) return;

  // Get each row of cards
  const rows = Array.from(container.querySelectorAll(':scope > .entry-points__row'));

  rows.forEach(row => {
    // Get each card (anchor)
    const cards = Array.from(row.querySelectorAll(':scope > a.entry-point__item'));
    cards.forEach(card => {
      // Image cell: direct reference to the img element
      let imgEl = null;
      const imgContainer = card.querySelector('.entry-point__item--img');
      if (imgContainer) {
        imgEl = imgContainer.querySelector('img');
      }
      // Text cell: collect all immediate children of .entry-point__item--body
      const textContainer = card.querySelector('.entry-point__item--body');
      const textElements = [];
      if (textContainer) {
        // Add heading if present
        const h3 = textContainer.querySelector('h3');
        if (h3) textElements.push(h3);
        // Add all paragraphs (if any)
        textContainer.querySelectorAll('p').forEach(p => textElements.push(p));
      }
      // Assemble the row: image in first cell, all text elements in second cell
      cells.push([
        imgEl,
        textElements
      ]);
    });
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
