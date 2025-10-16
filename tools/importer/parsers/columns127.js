/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match block name exactly
  const headerRow = ['Columns (columns127)'];

  // Find all direct column children
  const columns = Array.from(element.querySelectorAll(':scope > div._1-3-flex'));
  if (!columns.length) return;

  // For each column, extract chart and text
  const cells = columns.map((col) => {
    // Reference the chart element (do not clone)
    const chart = col.querySelector('.pie-block-i-tt');
    // Reference the text block
    const text = col.querySelector('.tt-para');
    // Compose cell content, preserving order and layout
    const cellContent = [];
    if (chart) cellContent.push(chart);
    if (text) cellContent.push(text);
    // Always reference, never clone
    return cellContent;
  });

  // Table structure: header, then one row of columns
  const tableRows = [headerRow, cells];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
