/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards94) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards94)'];
  const rows = [headerRow];

  // Find all card anchor elements
  const cardLinks = Array.from(element.querySelectorAll('.entry-point__item'));

  cardLinks.forEach((card) => {
    // Image: inside .entry-point__item--img > img
    const imgEl = card.querySelector('.entry-point__item--img img');
    // Text: inside .entry-point__item--body
    const body = card.querySelector('.entry-point__item--body');
    if (!imgEl || !body) return; // Defensive: skip if missing

    // Compose text cell: h3, p, and arrow icon (img)
    const title = body.querySelector('h3');
    const desc = body.querySelector('p');
    const arrow = body.querySelector('img'); // The arrow icon

    // Compose the text cell content
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title);
    if (desc) textCell.appendChild(desc);
    if (arrow) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(arrow);
    }

    // Each card row: [image, text content]
    rows.push([imgEl, textCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
