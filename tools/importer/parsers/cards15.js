/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) block parsing

  // Header row for the block
  const headerRow = ['Cards (cards15)'];

  // Find the parent container for all cards
  // Look for the section with class 'fleet-teaser-collection' or 'teaser-collection__wrapper'
  const section = element.querySelector('section.fleet-teaser-collection, section.teaser-collection__wrapper');
  if (!section) return;

  // Find all card elements inside the section
  // Each card is a div with class 'teaser-block--collection'
  const cardEls = section.querySelectorAll('.teaser-block--collection');

  const rows = [];
  cardEls.forEach(cardEl => {
    // Image: find the first img inside the card
    const img = cardEl.querySelector('img');
    // Text content: find the title and description
    const content = cardEl.querySelector('.teaser-block__content');
    let textCellContent = [];
    if (content) {
      // Title (h3)
      const title = content.querySelector('.teaser-block__title');
      if (title) textCellContent.push(title);
      // Description (div > p)
      const desc = content.querySelector('.teaser-block__desc');
      if (desc) textCellContent.push(desc);
    }
    // Each row: [image, text content]
    rows.push([img, textCellContent]);
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
