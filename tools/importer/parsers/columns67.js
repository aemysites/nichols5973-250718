/* global WebImporter */
export default function parse(element, { document }) {
  // The table header must be a single cell row
  const headerRow = ['Columns (columns67)'];

  // Extract each .stat as a column for the second row
  let columns = [];
  const stats = element.querySelector('.stats');
  if (stats) {
    columns = Array.from(stats.children);
  }

  // Defensive: If there are no .stat children, ensure at least one cell
  if (columns.length === 0) {
    columns = [''];
  }

  // The cells array for createTable (header row: 1 column, next row: N columns)
  const cells = [
    headerRow,    // 1 cell
    columns      // N cells (1 for each stat column)
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
