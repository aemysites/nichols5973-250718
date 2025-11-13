/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards11) block parsing
  // 1. Find the parent container for all cards
  // 2. For each card, extract image, title, and CTA link

  // Header row for the block
  const headerRow = ['Cards (cards11)'];

  // Find the container holding the cards
  // The cards are inside a div with class 'answer-collection__items'
  const cardsContainer = element.querySelector('.answer-collection__items');
  if (!cardsContainer) return;

  // Each card is a div with class 'answer-block'
  const cardEls = Array.from(cardsContainer.querySelectorAll('.answer-block'));
  const rows = [headerRow];

  cardEls.forEach(cardEl => {
    // Extract image (mandatory)
    const figure = cardEl.querySelector('figure');
    let img = figure ? figure.querySelector('img') : null;
    // Extract title (mandatory)
    let titleText = '';
    if (figure) {
      const figcaption = figure.querySelector('figcaption');
      if (figcaption) {
        titleText = figcaption.textContent.trim();
      }
    }
    // Extract CTA link (optional)
    const cta = cardEl.querySelector('a');
    let ctaEl = null;
    if (cta) {
      // Use the anchor itself as CTA
      ctaEl = cta;
    }

    // Compose the text cell: title as heading, CTA below
    const textCell = document.createElement('div');
    if (titleText) {
      const heading = document.createElement('strong');
      heading.textContent = titleText;
      textCell.appendChild(heading);
    }
    if (ctaEl) {
      // Add a line break between heading and CTA if both exist
      if (titleText) textCell.appendChild(document.createElement('br'));
      textCell.appendChild(ctaEl);
    }

    // Add the row: [image, text content]
    rows.push([
      img || '',
      textCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
