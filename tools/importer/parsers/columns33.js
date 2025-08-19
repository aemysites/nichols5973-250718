/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, must match the example exactly
  const headerRow = ['Columns (columns33)'];

  // The block structure is two columns:
  // - Left: All chart rows (the vertical list of horizontal bar charts, each labelled)
  // - Right: Commentary paragraph

  // Find these from the HTML
  const chartWrapper = element.querySelector('.chart-wrapper-glmq4');
  const chartPara = element.querySelector('.chart-para');

  // Edge case: If these are missing, fallback to empty HTML elements
  const leftCol = chartWrapper || document.createElement('div');
  const rightCol = chartPara || document.createElement('div');

  // Cells row: matches the screenshot and markdown example (2 columns)
  const row = [leftCol, rightCol];

  // Build table structure
  const cells = [headerRow, row];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
