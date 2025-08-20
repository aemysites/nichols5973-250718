/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct columns in the block
  const columns = Array.from(element.querySelectorAll(':scope > .footer--top-column'));
  if (columns.length === 0) return;

  // Build header row: first cell is header, rest are empty, for alignment
  const headerRow = ['Columns (columns48)'];
  for (let i = 1; i < columns.length; i++) {
    headerRow.push('');
  }

  // Build data row: each cell is a column element
  const dataRow = columns;

  const tableRows = [headerRow, dataRow];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
