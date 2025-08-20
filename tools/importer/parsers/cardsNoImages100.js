/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, exactly matching component name and variant
  const headerRow = ['Cards (cardsNoImages100)'];
  
  // Get all direct card elements
  const cardEls = element.querySelectorAll('.link-item');
  const rows = [headerRow];

  cardEls.forEach(card => {
    // Each card typically contains: h3 (with a link), p, and a trailing link with arrow img
    const h3 = card.querySelector('h3'); // heading (may include <a>)
    const desc = card.querySelector('p'); // description
    const ctaAnchor = card.querySelector('a[href]:not(h3 a)'); // trailing link (may only have an img)

    // Compose the cell content, referencing existing elements, not cloning
    const cellParts = [];
    if (h3) cellParts.push(h3);
    if (desc) cellParts.push(desc);
    // For CTA, only include if it contains text or meaningful link text
    // In this example, the CTA link contains only an arrow image, so not user-facing text. Include only if it has text.
    if (ctaAnchor && ctaAnchor.textContent.trim()) {
      cellParts.push(ctaAnchor);
    }
    rows.push([cellParts]);
  });

  // Create and replace table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
