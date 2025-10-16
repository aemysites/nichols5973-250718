/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages77) block: 1 column, multiple rows
  // Header row must be block name
  const headerRow = ['Cards (cardsNoImages77)'];

  // Only one card in this case, which is the anchor element itself
  // Place the anchor element as-is in the cell
  const cardRows = [[element.firstElementChild]];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}