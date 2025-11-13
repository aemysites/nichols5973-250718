/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards9) block: 2 columns, multiple rows, each row = [image, text]
  // Header row
  const headerRow = ['Cards (cards9)'];

  // Find the card container
  // The cards are inside .teaser-collection__items > .teaser-block--collection
  const cardNodes = Array.from(
    element.querySelectorAll('.teaser-collection__items > .teaser-block--collection')
  );

  // Defensive: fallback if not found
  if (!cardNodes.length) return;

  // Build rows for each card
  const rows = cardNodes.map(card => {
    // Image: inside .v-image__image img
    const img = card.querySelector('.v-image__image img');
    // Text: title and description
    const title = card.querySelector('.teaser-block__title');
    const desc = card.querySelector('.teaser-block__desc');
    // Compose text cell: title (heading), then description
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title);
    if (desc) textCell.appendChild(desc);
    // Row: [image, text]
    return [img, textCell];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
