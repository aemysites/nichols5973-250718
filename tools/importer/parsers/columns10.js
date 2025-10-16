/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns10)'];

  // Find all grid sections (two main blocks)
  const grids = element.querySelectorAll('.w-layout-grid.grid-2');

  // Build rows for each grid section
  const rows = Array.from(grids).map(grid => {
    // Left cell: big number + label
    const leftCell = grid.querySelector('.text-wrapper-big-text');
    // Right cell: all icon+text pairs (all .text-wrapper except the first)
    const rightCellFragment = document.createElement('div');
    rightCellFragment.style.display = 'grid';
    rightCellFragment.style.gridTemplateColumns = 'repeat(2, 1fr)';
    rightCellFragment.style.gap = '1em';
    // Select all icon+text pairs (skip the big number cell)
    Array.from(grid.children).forEach((child, idx) => {
      if (!child.classList.contains('text-wrapper-big-text')) {
        rightCellFragment.appendChild(child);
      }
    });
    return [leftCell, rightCellFragment];
  });

  // Compose the table: header + rows
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
