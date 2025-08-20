/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main link that wraps both columns
  const link = element.querySelector('a.entry-point__item');
  if (!link) return;

  // Get the image and body containers
  const imgDiv = link.querySelector('.entry-point__item--img');
  const bodyDiv = link.querySelector('.entry-point__item--body');

  // Defensive check for content
  const col1 = bodyDiv || '';
  const col2 = imgDiv || '';

  // The header row should have exactly one cell, so wrap in an array of one item
  // The second row contains both columns.
  const cells = [
    ['Columns (columns83)'],
    [col1, col2],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
