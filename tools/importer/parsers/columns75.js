/* global WebImporter */
export default function parse(element, { document }) {
  // Find main content node
  const textNode = element.querySelector('.rich-text-basic__text') || element;
  const children = Array.from(textNode.childNodes);

  // Find the first <table> (if any)
  const table = textNode.querySelector('table');
  const tableIdx = table ? children.indexOf(table) : -1;

  // Helper: Is empty <p>?
  const isEmpty = (n) => n.nodeType === Node.ELEMENT_NODE && n.tagName === 'P' && n.textContent.trim() === '';
  // Helper: Filter empty nodes
  const filterNodes = (arr) => arr.filter(n => {
    if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '') return false;
    if (isEmpty(n)) return false;
    return true;
  });

  const cells = [];
  // Header row: must match example exactly
  cells.push(['Columns (columns75)']);

  if (table) {
    // All nodes before <table>: typically headings, intro text
    const beforeTable = filterNodes(children.slice(0, tableIdx));
    if (beforeTable.length > 0) {
      // Use single node directly, else use array
      cells.push([beforeTable.length === 1 ? beforeTable[0] : beforeTable]);
    }
    // Table columns: each <td> becomes a column cell
    const statsRow = table.querySelector('tr');
    if (statsRow) {
      const statsCells = Array.from(statsRow.children);
      const statsDivs = statsCells.map(td => {
        // Filter out empty nodes in each <td>
        const tdNodes = Array.from(td.childNodes).filter(n => {
          if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '') return false;
          if (isEmpty(n)) return false;
          return true;
        });
        // If just one node, use it; else wrap in <div>
        if (tdNodes.length === 1) return tdNodes[0];
        const div = document.createElement('div');
        tdNodes.forEach(n => div.appendChild(n));
        return div;
      });
      if (statsDivs.length > 0) {
        cells.push(statsDivs);
      }
    }
    // All nodes after <table>: typically CTA or outro text
    const afterTable = filterNodes(children.slice(tableIdx + 1));
    if (afterTable.length > 0) {
      cells.push([afterTable.length === 1 ? afterTable[0] : afterTable]);
    }
  } else {
    // No table: just put all non-empty content in a single row
    const contentNodes = filterNodes(children);
    if (contentNodes.length > 0) {
      cells.push([contentNodes.length === 1 ? contentNodes[0] : contentNodes]);
    }
  }

  // Create the table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
