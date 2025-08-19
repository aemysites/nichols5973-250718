/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header as in the example
  const headerRow = ['Columns (columns93)'];

  // Find the headline (h3)
  const h3 = element.querySelector('h3');

  // Find the paragraph after the h3
  let description = null;
  if (h3) {
    let next = h3.nextElementSibling;
    while (next && next.tagName !== 'P') {
      next = next.nextElementSibling;
    }
    description = next;
  }

  // Find the right-hand stats box
  // It's inside a table align=right, in .row > .column
  const statsTable = element.querySelector('table[align="right"]');
  let statsBox = null;
  if (statsTable) {
    statsBox = statsTable.querySelector('.row .column');
  }

  // Compose left column: headline + description
  const leftColumn = [];
  if (h3) leftColumn.push(h3);
  if (description) leftColumn.push(description);

  // Compose content array: 2 columns
  const contentRow = [leftColumn, statsBox];
  const cells = [headerRow, contentRow];

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
