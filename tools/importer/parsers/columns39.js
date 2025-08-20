/* global WebImporter */
export default function parse(element, { document }) {
  // Get all tab panes (columns)
  const tabPanes = Array.from(element.querySelectorAll(':scope > .fe-tab-pane'));
  // Prepare rows for the table
  const cells = [];

  // For each tab pane, extract left and right columns
  tabPanes.forEach((tabPane) => {
    const wrap = tabPane.querySelector('.tab-wrap-fe');
    if (!wrap) return;
    const lcol = wrap.querySelector('.l-wrap-fe-tab');
    const rcol = wrap.querySelector('.r-wrap-fe-tab');
    // Defensive: Create empty div if missing to preserve structure
    let leftCell = lcol ? lcol : document.createElement('div');
    let rightCell = rcol ? rcol : document.createElement('div');
    cells.push([leftCell, rightCell]);
  });

  // Create the table with WebImporter.DOMUtils.createTable()
  // First, create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix the header row: insert a row above with one th spanning all columns
  const headerText = 'Columns (columns39)';
  const numCols = cells.length ? cells[0].length : 2; // Assume 2 columns if unknown
  const headerRow = document.createElement('tr');
  const th = document.createElement('th');
  th.innerHTML = headerText;
  if (numCols > 1) th.setAttribute('colspan', numCols);
  headerRow.appendChild(th);
  table.insertBefore(headerRow, table.firstChild);

  // Replace original element
  element.replaceWith(table);
}
