/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Tabs (tabs67)'];

  // Find all tab panes (each tab's content)
  const tabPanes = Array.from(element.querySelectorAll(':scope > .w-tab-pane'));

  const tabRows = tabPanes.map((pane) => {
    // Get the tab label from the data-w-tab attribute
    let tabLabel = pane.getAttribute('data-w-tab') || '';
    // Gather all content nodes for this tab pane (ignore empty text, keep only elements and non-empty text)
    let contentNodes = Array.from(pane.childNodes).filter((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT') return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) return true;
      return false;
    });
    // If there is only one content node, use it directly, else use the array
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    return [tabLabel, contentCell];
  });

  // Compose the table contents
  const cells = [headerRow, ...tabRows];

  // Create the table block and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
