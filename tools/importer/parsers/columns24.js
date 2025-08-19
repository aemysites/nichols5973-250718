/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Compose the header row as required in the example
  const headerRow = ['Columns (columns24)'];

  // Step 2: Find all immediate child columns (footer--top-column)
  // Defensive check if no such columns exist
  const columns = Array.from(element.querySelectorAll(':scope > .footer--top-column'));

  // If there are no columns, do nothing
  if (columns.length === 0) return;

  // Step 3: Compose the second row: each cell is the actual column content (existing elements)
  // Reference the actual column elements, not clones
  const row = columns;

  // Step 4: Create the block table
  const cells = [headerRow, row];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Step 5: Replace the original element with the new block table
  element.replaceWith(block);
}
