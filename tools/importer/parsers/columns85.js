/* global WebImporter */
export default function parse(element, { document }) {
  // Find the anchor wrapping the entry point
  const anchor = element.querySelector('a.entry-point__item');
  if (!anchor) return;

  // Extract the two columns: body (text) and image
  const bodyDiv = anchor.querySelector('.entry-point__item--body');
  const imgDiv = anchor.querySelector('.entry-point__item--img');

  // There must be two columns for this block
  const numColumns = 2;

  // The header row should have two columns: first with text, second empty
  const headerRow = ['Columns (columns85)', ''];

  // Content row
  const contentRow = [bodyDiv, imgDiv];

  const cells = [
    headerRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
