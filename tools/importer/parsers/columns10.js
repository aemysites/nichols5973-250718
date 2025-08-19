/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by the example
  const headerRow = ['Columns (columns10)'];
  const cells = [headerRow];

  // Find the flex container holding the grids
  const flex = element.querySelector('._1-2-flex');
  if (!flex) return;
  // Get all the grid rows (each is a row in the block table)
  const grids = flex.querySelectorAll(':scope > .w-layout-grid.grid-2');
  if (!grids.length) return;
  
  for (const grid of grids) {
    // Get all direct children of the grid (each is a column in the row)
    const columns = Array.from(grid.querySelectorAll(':scope > div'));
    // Only add row if there is at least one column
    if (columns.length) {
      cells.push(columns);
    }
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
