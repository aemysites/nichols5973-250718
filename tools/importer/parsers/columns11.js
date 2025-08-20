/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Gather columns
  const columns = Array.from(element.querySelectorAll(':scope > div._1-3-flex, :scope > div._1-3-flex.last-sl-1-3'));

  // 2. Build the second row: each cell is a column's content, as a single div preserving the original elements
  const cellsRow = columns.map((col) => {
    const cellDiv = document.createElement('div');
    const counterBlock = col.querySelector('.number-counter-block');
    const desc = col.querySelector('.sl-paragraph-center');
    if (counterBlock) cellDiv.appendChild(counterBlock);
    if (desc) cellDiv.appendChild(desc);
    return cellDiv;
  });

  // 3. Build the table using createTable
  // But after table is created, set colspan on the header cell so it spans all columns
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns11)'],
    cellsRow
  ], document);

  // Fix header colspan for visual correctness (header spans all data columns)
  const headerRow = table.querySelector('tr');
  const headerCell = headerRow && headerRow.querySelector('th');
  if (headerCell && cellsRow.length > 1) {
    headerCell.setAttribute('colspan', cellsRow.length);
  }

  // 4. Replace original element
  element.replaceWith(table);
}
