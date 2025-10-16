/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block header row
  const headerRow = ['Columns (columns113)'];

  // Find the main columns within the entry-point__item
  const item = element.querySelector('.entry-point__item');
  if (!item) return;

  const leftCol = item.querySelector('.entry-point__item--img');
  const rightCol = item.querySelector('.entry-point__item--body');
  if (!leftCol || !rightCol) return;

  // Ensure all content is preserved and referenced
  // Do not clone or create new elements; reference existing ones
  // All text, images, links, and buttons must be included

  // Compose the table rows
  const rows = [
    headerRow,
    [leftCol, rightCol],
  ];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
