/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages76) block: 1 column, multiple rows, each row is a card
  // Header row as required
  const headerRow = ['Cards (cardsNoImages76)'];

  // Defensive: get the link element inside the block
  const link = element.querySelector('a');

  // Defensive: if no link, fallback to text content
  let cardContent;
  if (link) {
    // Reference the existing anchor element directly (do not clone)
    cardContent = link;
  } else {
    // fallback: create a paragraph with the text
    const p = document.createElement('p');
    p.textContent = element.textContent.trim();
    cardContent = p;
  }

  // Each card is a single row, single cell
  const rows = [headerRow, [cardContent]];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
