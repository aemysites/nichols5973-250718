/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header as specified in the example
  const headerRow = ['Columns (columns40)'];

  // 2. Get the first <tr> from the table body
  const tr = element.querySelector('tbody tr');
  if (!tr) {
    // If no row found, do nothing (edge case handling)
    return;
  }
  // 3. For each <td> (column), use its direct child <a> (the link)
  const dataRow = Array.from(tr.children).map(td => {
    const anchor = td.querySelector('a');
    // Use the anchor element as the cell, if present
    return anchor || td;
  });

  // 4. Build the table rows: header and data row
  const rows = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace the original element
  element.replaceWith(table);
}
