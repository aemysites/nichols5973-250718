/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row
  const headerRow = ['Cards (cards90)'];
  const rows = [];

  // Find all cards in this block (may be 1 or more)
  // For generality, select all .entry-point__item descendants
  const cards = element.querySelectorAll('.entry-point__item');

  cards.forEach(card => {
    // Image cell
    const imgWrapper = card.querySelector('.entry-point__item--img');
    let img = imgWrapper ? imgWrapper.querySelector('img') : null;

    // Text cell
    const body = card.querySelector('.entry-point__item--body');

    // Only add row if both are present
    if (img && body) {
      rows.push([img, body]);
    }
  });

  // Fallback: if no .entry-point__item, try to find a similar structure
  if (!rows.length) {
    const imgs = element.querySelectorAll('img');
    const h3 = element.querySelector('h3');
    const p = element.querySelector('p');
    if (imgs.length && (h3 || p)) {
      const textContent = document.createElement('div');
      if (h3) textContent.appendChild(h3);
      if (p) textContent.appendChild(p);
      rows.push([imgs[0], textContent]);
    }
  }

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
