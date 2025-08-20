/* global WebImporter */
export default function parse(element, { document }) {
  // Find the stats container which contains the columns
  const statsContainer = element.querySelector('.stats');
  let columns = [];
  if (statsContainer) {
    // Each .stat div is a column
    columns = Array.from(statsContainer.querySelectorAll(':scope > .stat'));
  }
  // Table cell structure: header row is a single cell; content row has one cell per column
  const rows = [['Columns (columns69)']];
  if (columns.length) {
    rows.push(columns);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
