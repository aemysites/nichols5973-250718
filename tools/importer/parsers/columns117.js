/* global WebImporter */
export default function parse(element, { document }) {
  // The block name is exactly 'Columns (columns117)' as required
  const headerRow = ['Columns (columns117)'];

  // Get all top-level columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, extract both the pie-block (with lottie/svg) and the text description
  const contentRow = columns.map(col => {
    // pie chart (lottie/svg)
    const pieBlock = col.querySelector('.pie-block-i-tt');
    // descriptive text
    const para = col.querySelector('.tt-para');
    // Gather non-null elements in order
    const items = [];
    if (pieBlock) items.push(pieBlock);
    if (para) items.push(para);
    // If both exist, use both, else just one
    if (items.length === 1) return items[0];
    return items;
  });

  // Compose the table structure
  const cells = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
