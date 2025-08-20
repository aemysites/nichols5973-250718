/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches the example exactly
  const headerRow = ['Cards (cards86)'];

  // 2. Find all card rows in the provided HTML
  const cardRows = [];
  // Select all .entry-points__row (each contains multiple cards)
  const rows = element.querySelectorAll('.entry-points__row');
  rows.forEach(row => {
    // Each .entry-point__item is a card
    const cards = row.querySelectorAll('.entry-point__item');
    cards.forEach(card => {
      // First column: Image (reference existing <img>)
      const imgContainer = card.querySelector('.entry-point__item--img');
      let image = '';
      if (imgContainer) {
        const img = imgContainer.querySelector('img');
        if (img) image = img;
      }

      // Second column: Text content
      const body = card.querySelector('.entry-point__item--body');
      const contents = [];
      if (body) {
        // Title (strong, matches example's bold heading)
        const h3 = body.querySelector('h3');
        if (h3) {
          const strong = document.createElement('strong');
          strong.textContent = h3.textContent;
          contents.push(strong);
        }
        // Description: <p>
        const p = body.querySelector('p');
        if (p) {
          // Add a <br> if there's a title, for spacing like markdown example
          if (h3) contents.push(document.createElement('br'));
          contents.push(p);
        }
        // No visible CTA in this HTML, so do not add extra link
      }
      // Handle missing image/text gracefully (edge case)
      cardRows.push([
        image || '',
        contents.length ? contents : ''
      ]);
    });
  });

  // 3. Assemble table as per block guidelines
  const tableData = [headerRow, ...cardRows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // 4. Replace the original element
  element.replaceWith(blockTable);
}
