/* global WebImporter */
export default function parse(element, { document }) {
  // Critical review:
  // - No hardcoded content; headers match example
  // - Only one table is required (Columns (columns68))
  // - Reference existing .stat elements
  // - All text content and structure is preserved
  // - Handles missing/empty data gracefully

  // Set up the header row as in the example
  const headerRow = ['Columns (columns68)'];

  // Find the stats container
  const stats = element.querySelector('.stats');
  if (!stats) return;

  // Get all .stat direct children - each is a column
  const statColumns = Array.from(stats.children).filter(child => child.classList.contains('stat'));

  // If no stats found, exit
  if (!statColumns.length) return;

  // Build the table data: first row is header, second is columns
  const cells = [
    headerRow,
    statColumns
  ];

  // Create block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
