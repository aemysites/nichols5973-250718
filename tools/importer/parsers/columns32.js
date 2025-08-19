/* global WebImporter */
export default function parse(element, { document }) {
  // The header must be a single column: ['Columns (columns32)']
  const headerRow = ['Columns (columns32)'];

  // Get all direct children with class 'related-article' (i.e., the columns)
  const columns = Array.from(element.querySelectorAll(':scope > .related-article'));

  // For each column, gather its inner content as a single fragment (preserving tags, title, and img)
  const colCells = columns.map((col) => {
    // The layout is: <a> <img> <div .info>...</a>
    const a = col.querySelector('a');
    if (!a) return '';
    // We'll gather all children of the <a> into a fragment
    const frag = document.createDocumentFragment();
    Array.from(a.childNodes).forEach((child) => {
      frag.appendChild(child);
    });
    return frag;
  });

  // Build the table: header row is a single column, next row has N columns
  const tableArray = [
    headerRow,    // 1 column
    colCells      // N columns (as many as found)
  ];

  // Create the table using the helper
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}
