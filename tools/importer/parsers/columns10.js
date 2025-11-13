/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns10)'];

  // Find all immediate children that are columns
  // These are .rich-text-collection-item elements inside the block
  const items = Array.from(
    element.querySelectorAll('.rich-text-collection-block__inner > .rich-text-collection-item')
  );

  // Defensive: If no items found, fallback to direct children
  const columns = items.length ? items : Array.from(
    element.querySelectorAll(':scope > div > .rich-text-collection-item')
  );

  // For each column, gather its content as a single cell
  const cells = columns.map((col) => {
    // Each column contains:
    // - icon (div.icon-container)
    // - heading (h2)
    // - description (div.rich-text-collection-item__description)
    const icon = col.querySelector('.icon-container');
    const heading = col.querySelector('h2');
    const desc = col.querySelector('.rich-text-collection-item__description');
    // Compose cell contents, filter out nulls
    const cellContent = [icon, heading, desc].filter(Boolean);
    return cellContent;
  });

  // Build the table: header row, then one row with all columns
  const tableRows = [headerRow, cells];
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
