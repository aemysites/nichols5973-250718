/* global WebImporter */
export default function parse(element, { document }) {
  // Gather all columns: direct children with class _1-3-flex (including last-sl-1-3)
  const columns = element.querySelectorAll(':scope > ._1-3-flex');

  // Compose the content row: one cell per column
  const contentRow = Array.from(columns).map((col) => col);

  // Build the table: header row with one cell, then the multi-column content row
  // The header row must contain exactly one column - the block name
  const cells = [['Columns (columns14)'], contentRow];

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
