/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table Header for block name (exact from example)
  const headerRow = ['Columns (columns40)'];

  // 2. Get the first row of the table containing columns
  // Handles both <tbody><tr> and direct <tr>
  const row = element.querySelector('tbody tr') || element.querySelector('tr');

  // 3. For each <td>, reference its actual content (usually a link)
  // Don't clone, just reference directly
  const columns = [];
  if (row) {
    for (const td of row.children) {
      // Reference all children (not just 'a'), but in this HTML it's a single 'a'
      // Could be text nodes, but here it's a single link per cell
      if (td.children.length === 1) {
        columns.push(td.children[0]);
      } else {
        // Fallback: reference all children
        columns.push(Array.from(td.childNodes).filter(n => n.nodeType === 1));
      }
    }
  }

  // Edge case: if no row or columns found, don't create table
  if (!columns.length) return;

  // 4. Create block table structure
  const cells = [
    headerRow,
    columns,
  ];

  // 5. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
