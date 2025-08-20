/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as a single column cell exactly as in the example
  const headerRow = ['Columns (columns68)'];

  // Attempt to find all .stat elements for columns
  let statsBlock = element.querySelector('.statistics-content .stats');
  if (!statsBlock) statsBlock = element.querySelector('.stats');
  const statColumns = statsBlock ? Array.from(statsBlock.children) : [];

  // Only create the block if there are stat columns
  if (statColumns.length > 0) {
    // Table structure: first row single cell header; second row, one cell per stat
    const tableCells = [
      headerRow,
      statColumns
    ];
    const table = WebImporter.DOMUtils.createTable(tableCells, document);
    element.replaceWith(table);
  }
}
