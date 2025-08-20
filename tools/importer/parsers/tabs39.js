/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main text block that contains the tabs table
  const main = element.querySelector('.rich-text-basic__text') || element;
  // Locate the table (the tabs structure)
  const table = main.querySelector('table');
  if (!table) return;
  const row = table.querySelector('tr');
  if (!row) return;
  const tds = Array.from(row.querySelectorAll('td'));
  if (tds.length < 2) return;

  // Build the header row exactly as in the example
  const cells = [['Tabs (tabs39)']];

  // For each tab <td>, extract tab label and all content (preserving all text and inline formatting)
  tds.forEach(td => {
    // Tab label: the <h3> text
    const h3 = td.querySelector('h3');
    let tabLabel = '';
    if (h3) {
      tabLabel = h3.textContent.trim();
    } else {
      // fallback: first text node
      tabLabel = td.textContent.trim().split('\n')[0];
    }
    // Tab content: all children of td except the h3
    const tabContentNodes = [];
    for (const child of td.childNodes) {
      if (child === h3) continue;
      // Exclude pure whitespace nodes
      if (child.nodeType === 3 && !child.textContent.trim()) continue;
      tabContentNodes.push(child);
    }
    // If no content nodes, forcibly include all td contents (this should never happen, but is safe)
    let tabContent;
    if (tabContentNodes.length) {
      tabContent = tabContentNodes.length === 1 ? tabContentNodes[0] : tabContentNodes;
    } else {
      tabContent = td.innerHTML;
    }
    cells.push([tabLabel, tabContent]);
  });

  // Replace the entire block with the created tabs table
  const tabsTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(tabsTable);
}
