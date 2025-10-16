/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns52)'];

  // Find the two main columns: charts (left) and text (right)
  // The main wrapper is .glm-graph-comment-block
  // The chart wrapper is .chart-wrapper-glmq4
  // The right text column is .chart-para

  // Defensive: find chart wrapper and text column
  const chartWrapper = element.querySelector('.chart-wrapper-glmq4');
  let chartsColumn = null;
  let textColumn = null;

  if (chartWrapper) {
    // The left column is the chartWrapper minus the .chart-para
    // The chart-para is a sibling of the chart stack
    const chartPara = chartWrapper.querySelector('.chart-para');
    // The left column is everything except chart-para
    // We'll create a wrapper div for all chart rows
    const chartRows = Array.from(chartWrapper.querySelectorAll('.glm-horiz-chart-wrap'));
    if (chartRows.length > 0) {
      chartsColumn = document.createElement('div');
      chartRows.forEach(row => chartsColumn.appendChild(row));
    }
    // The right column is the chart-para
    if (chartPara) {
      textColumn = chartPara;
    }
  }

  // Fallback: if not found, use first two children
  if (!chartsColumn || !textColumn) {
    const children = Array.from(element.children);
    if (!chartsColumn && children.length > 0) chartsColumn = children[0];
    if (!textColumn && children.length > 1) textColumn = children[1];
  }

  // Second row: two columns (charts, text)
  const secondRow = [chartsColumn, textColumn];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
