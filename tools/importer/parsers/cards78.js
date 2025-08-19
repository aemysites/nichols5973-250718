/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards78) header
  const headerRow = ['Cards (cards78)'];

  // Find all direct card rows
  const rows = Array.from(element.querySelectorAll(':scope .entry-points__row'));

  const cells = [headerRow];

  rows.forEach(row => {
    // Each row: <a>
    const link = row.querySelector('a.entry-point__item');
    if (!link) return;

    // Image cell: first img inside the card
    const imgDiv = link.querySelector('.entry-point__item--img');
    const img = imgDiv ? imgDiv.querySelector('img') : null;

    // Text cell: h3 and p inside the card body
    const bodyDiv = link.querySelector('.entry-point__item--body');
    const cardText = [];
    if (bodyDiv) {
      const h3 = bodyDiv.querySelector('h3');
      if (h3) cardText.push(h3);
      bodyDiv.querySelectorAll('p').forEach(p => cardText.push(p));
    }
    // CTA: Use link as a CTA at the bottom if it has href
    if (link.getAttribute('href')) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = link.title || 'Find out more';
      cardText.push(cta);
    }
    // Add row (always two columns: image, text)
    cells.push([img, cardText]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
