/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages75) block: 1 column, multiple rows
  // Each row = 1 card, cell contains heading/description/CTA (here: just a link)

  // Header row as per block spec
  const headerRow = ['Cards (cardsNoImages75)'];

  // Defensive: Only process if there is an anchor
  const anchor = element.querySelector('a');
  if (!anchor) return;

  // Reference the existing anchor element (do not clone)
  // Place the anchor element directly in the cell
  const cardRows = [[anchor]];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
