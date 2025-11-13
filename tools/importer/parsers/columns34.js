/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (block name)
  const headerRow = ['Columns (columns34)'];

  // 2. Find all rich-text-collection-item columns
  const items = Array.from(
    element.querySelectorAll('.rich-text-collection-block__inner > .rich-text-collection-item')
  );

  // Defensive: If no items found, do nothing
  if (!items.length) return;

  // 3. For each column, extract the full column element (icon, heading, description)
  //    This ensures resilience to minor markup changes and preserves all content
  const columnsRow = items.map(item => item);

  // 4. Build the table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the original element with the new table
  element.replaceWith(table);
}
