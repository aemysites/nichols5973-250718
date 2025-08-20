/* global WebImporter */
export default function parse(element, { document }) {
  // Get the entry point row
  const row = element.querySelector('.entry-points__row');
  if (!row) return;

  // Extract the columns (each a.entry-point__item is a column)
  const entryLinks = row.querySelectorAll(':scope > a.entry-point__item');
  if (entryLinks.length === 0) return;

  // For this HTML, we expect only one column (one a.entry-point__item)
  // The best structure is: first row is header, next row is one cell for all the content
  const headerRow = ['Columns (columns59)'];

  // Compose the column cell contents
  const columnsRow = [];
  entryLinks.forEach((link) => {
    const colContent = [];
    // Image (if present)
    const imgDiv = link.querySelector('.entry-point__item--img');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) colContent.push(img);
    }
    // Heading and text
    const body = link.querySelector('.entry-point__item--body');
    if (body) {
      Array.from(body.children).forEach((child) => {
        colContent.push(child);
      });
    }
    // If there are any additional elements (e.g., icon links), add them
    Array.from(link.children).forEach((child) => {
      // Avoid duplicates already processed above
      if (!colContent.includes(child) && child !== imgDiv && child !== body) {
        colContent.push(child);
      }
    });
    columnsRow.push(colContent);
  });

  // The table rows: header, then columns
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
