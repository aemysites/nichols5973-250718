/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find content container
  let richText = element;
  const layoutContainer = element.querySelector('.layout-container');
  if (layoutContainer) {
    const found = layoutContainer.querySelector('.rich-text-basic__text');
    if (found) richText = found;
  }

  // 2. Find the table node
  const nodes = Array.from(richText.childNodes);
  const tableIdx = nodes.findIndex(n => n.nodeType === 1 && n.tagName === 'TABLE');
  let tableNode = null;
  if (tableIdx !== -1) {
    tableNode = nodes[tableIdx];
  }

  // 3. Gather all content before the table as a single array for one column
  const preTableContent = nodes.slice(0, tableIdx).filter(n => {
    // Only include non-empty nodes
    if (n.nodeType === 3) return n.textContent.trim();
    if (n.nodeType === 1) return n.textContent.trim() || n.tagName === 'P' || n.tagName.match(/^H[1-6]$/);
    return false;
  });

  // 4. Extract columns from the first row of the table
  let columnsRow = [];
  if (tableNode) {
    const firstTr = tableNode.querySelector('tr');
    if (firstTr) {
      columnsRow = Array.from(firstTr.children).map(td => {
        // Reference all non-empty childNodes
        return Array.from(td.childNodes).filter(n => {
          if (n.nodeType === 3) return n.textContent.trim();
          if (n.nodeType === 1) return n.textContent.trim() || n.tagName.match(/^H[1-6]$/);
          return false;
        });
      });
    }
  }

  // 5. Compose the structure as required by the example:
  // - header row (single cell)
  // - columns row (multi-column from table)
  // - all pre-table content must be merged into only the first cell of the columns row
  if (columnsRow.length > 0 && preTableContent.length > 0) {
    columnsRow[0] = preTableContent.concat(columnsRow[0]);
  } else if (columnsRow.length === 0 && preTableContent.length > 0) {
    // If no table, just put content in first cell
    columnsRow = [preTableContent];
  }
  const headerRow = ['Columns (columns106)'];
  const rows = [headerRow, columnsRow];

  // 6. Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
