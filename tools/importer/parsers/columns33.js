/* global WebImporter */
export default function parse(element, { document }) {
  // Get the columns for the second row: left (chart items), right (text)
  // Left column: collect all chart row elements
  const leftDiv = document.createElement('div');
  let chartRows = [];
  // Try both possible structures for robustness
  const mainChartContainer = element.querySelector('.chart-wrapper-glmq4');
  if (mainChartContainer) {
    chartRows = mainChartContainer.querySelectorAll(':scope > .w-layout-vflex.glm-horiz-chart-wrap');
  } else {
    chartRows = element.querySelectorAll(':scope > .w-layout-vflex.glm-horiz-chart-wrap');
  }
  chartRows.forEach(row => leftDiv.appendChild(row));

  // Right column: the chart-para
  const rightDiv = document.createElement('div');
  const para = element.querySelector('.chart-para');
  if (para) rightDiv.appendChild(para);

  // Compose the cells array, with header row as a single column
  const cells = [
    ['Columns (columns33)'],
    [leftDiv, rightDiv]
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // To visually stretch the <th> across both columns, set colspan=2 on the header cell
  // (the importer may not do this by default, but we'll set it to ensure structure)
  const headerRow = table.querySelector('tr');
  if (headerRow && headerRow.children.length === 1 && cells[1].length > 1) {
    headerRow.children[0].setAttribute('colspan', cells[1].length);
  }

  element.replaceWith(table);
}
