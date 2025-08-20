/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure the header row matches the example exactly
  const headerRow = ['Columns (columns81)'];

  // 1. Find the .layout-container, which holds all content
  const layoutContainer = element.querySelector('.layout-container');
  if (!layoutContainer) return;
  const richText = layoutContainer.querySelector('.rich-text-basic__text');
  if (!richText) return;

  // 2. Find the right-aligned table (columns block)
  const tableElement = richText.querySelector('table[align="right"]');

  // 3. Gather all content for left column (all except the table)
  //    Reference *existing* elements, keep structure and all text
  const leftColumn = [];
  Array.from(richText.childNodes).forEach((node) => {
    // Skip the right table
    if (node === tableElement) return;
    // Skip empty paragraphs
    if (node.nodeType === 1 && node.tagName === 'P' && !node.textContent.trim()) return;
    // Only add nodes with meaningful content
    if ((node.nodeType === 1 && node.textContent.trim()) || (node.nodeType === 3 && node.textContent.trim())) {
      leftColumn.push(node);
    }
  });

  // 4. For right column: reference the entire table as one cell (preserves layout, color, headings, etc)
  const rightColumn = tableElement ? [tableElement] : [];

  // 5. Build the final table row with the two columns
  const blockRow = [leftColumn, rightColumn];

  // 6. Compose the array for createTable
  const cells = [headerRow, blockRow];

  // 7. Replace the original element with the new block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
