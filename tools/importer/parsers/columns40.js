/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse if the element is a table
  const rows = element.querySelectorAll('tr');
  if (!rows.length) return;

  // Collect all cells from all rows (for flexibility)
  const allCells = [];
  rows.forEach(row => {
    const cells = Array.from(row.children);
    if (cells.length) {
      allCells.push(...cells);
    }
  });
  if (!allCells.length) return;

  // Each cell: preserve all content and append right arrow symbol after label
  const columns = allCells.map(td => {
    // Clone all child nodes
    const clonedNodes = Array.from(td.childNodes).map(node => node.cloneNode(true));
    // Add right arrow symbol after content
    const arrow = document.createElement('span');
    arrow.textContent = '\u2192';
    clonedNodes.push(arrow);
    return clonedNodes;
  });

  // Build the table: header row, then one row with each column's full content
  const tableRows = [
    ['Columns (columns40)'],
    columns
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
