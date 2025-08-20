/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container
  const layout = element.querySelector('.layout-container');
  if (!layout) return;
  const content = layout.querySelector('.rich-text-basic__text');
  if (!content) return;

  // Find the right column table and extract its second <td>'s child nodes
  let rightCellContent = [];
  const table = content.querySelector('table');
  if (table) {
    const td = table.querySelector('td:nth-child(2)');
    if (td) {
      rightCellContent = Array.from(td.childNodes).filter(
        node => node.nodeType !== Node.TEXT_NODE || node.textContent.trim()
      );
    }
  }

  // For the left column, collect all nodes not in the table
  const leftNodes = [];
  for (const node of content.childNodes) {
    if (node === table) continue;
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) continue;
    leftNodes.push(node);
  }

  // Compose the table rows
  const headerRow = ['Columns (columns95)'];
  const columnsRow = [leftNodes, rightCellContent];
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
