/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards96) block: 2 columns, multiple rows, header row is block name
  const headerRow = ['Cards (cards96)'];
  const rows = [headerRow];

  // Find all card items within the container
  // Specific selector: .entry-point__item (not generic :scope > div)
  const cardItems = element.querySelectorAll('.entry-point__item');

  cardItems.forEach((card) => {
    // Image: .entry-point__item--img img
    const imgWrapper = card.querySelector('.entry-point__item--img');
    let img = imgWrapper ? imgWrapper.querySelector('img') : null;
    // Text content: .entry-point__item--body
    const body = card.querySelector('.entry-point__item--body');
    // Defensive: if either is missing, skip
    if (!img || !body) return;
    // Place image and body in separate cells
    rows.push([img, body]);
  });

  // Defensive: If no cards found, fallback: try to parse single card structure
  if (rows.length === 1) {
    // Try to find image and body in the element directly
    const img = element.querySelector('img');
    const body = element.querySelector('.entry-point__item--body');
    if (img && body) {
      rows.push([img, body]);
    }
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
