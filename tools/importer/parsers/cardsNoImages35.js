/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages35) block: 1 column, header row, each card in its own row
  const headerRow = ['Cards (cardsNoImages35)'];
  const rows = [headerRow];

  // Find the parent container for cards
  const linkItems = element.querySelector('.link-items');
  if (!linkItems) return;

  // Select all card elements
  const cards = linkItems.querySelectorAll('.link-item');

  cards.forEach((card) => {
    // Extract heading (h3 > a)
    const headingLink = card.querySelector('h3 a');
    let headingEl = null;
    if (headingLink) {
      headingEl = document.createElement('h3');
      headingEl.appendChild(headingLink.cloneNode(true));
    }

    // Extract description (p)
    const descEl = card.querySelector('p');
    let descClone = null;
    if (descEl) {
      descClone = descEl.cloneNode(true);
    }

    // Extract CTA (arrow link) - must include the arrow image and always include the CTA link
    let ctaEl = null;
    const ctaLink = card.querySelector('a:last-of-type');
    if (ctaLink) {
      ctaEl = ctaLink.cloneNode(true); // clone the full link including the arrow img
    }

    // Compose cell content: heading, description, CTA
    const cellContent = [];
    if (headingEl) cellContent.push(headingEl);
    if (descClone) cellContent.push(descClone);
    if (ctaEl) cellContent.push(ctaEl);

    if (cellContent.length === 0) return;
    rows.push([cellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
