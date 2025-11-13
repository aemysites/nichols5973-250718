/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards3) block parsing
  // 1. Find the parent container holding all cards
  const cardsContainer = element.querySelector('.teaser-collection__items');
  if (!cardsContainer) return;

  // 2. Find all card elements inside the container
  const cardEls = cardsContainer.querySelectorAll('.teaser-block--collection');
  if (!cardEls.length) return;

  // 3. Prepare the table rows
  const rows = [];
  // Header row as required
  rows.push(['Cards (cards3)']);

  // 4. For each card, extract image and text content
  cardEls.forEach(cardEl => {
    // Image extraction
    let imgEl = cardEl.querySelector('.v-image img');
    // Defensive: if not found, fallback to any img
    if (!imgEl) imgEl = cardEl.querySelector('img');

    // Text content extraction
    const contentEl = cardEl.querySelector('.teaser-block__content');
    let textCellContent = [];
    if (contentEl) {
      // Title (h3)
      const titleEl = contentEl.querySelector('.teaser-block__title');
      if (titleEl) textCellContent.push(titleEl);
      // Description (desc)
      const descEl = contentEl.querySelector('.teaser-block__desc');
      if (descEl) textCellContent.push(descEl);
    }
    // Defensive: if no content found, fallback to all text
    if (!textCellContent.length) {
      textCellContent.push(document.createTextNode(cardEl.textContent.trim()));
    }

    // Add the row: [image, text content]
    rows.push([
      imgEl || '',
      textCellContent
    ]);
  });

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element with the block
  element.replaceWith(block);
}
