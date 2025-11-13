/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns33)'];

  // Defensive: get all direct column children
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, collect its content as a single cell (reference, not clone)
  const cells = columns.map((col) => col);

  // Build the table rows
  const tableRows = [headerRow, cells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
