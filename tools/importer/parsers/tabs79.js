/* global WebImporter */
export default function parse(element, { document }) {
  // Tabs (tabs79) block: 2 columns, multiple rows
  // First row: block name
  // Each subsequent row: tab label (col 1), tab content (col 2)

  // Helper: Get all tab panes (each tab content)
  const tabPanes = Array.from(element.querySelectorAll(':scope > div.w-tab-pane'));

  // Compose table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs79)']);

  tabPanes.forEach((pane) => {
    // Tab label from data-w-tab attribute
    const tabLabel = pane.getAttribute('data-w-tab') || '';
    // Tab content: everything inside the pane
    // Defensive: use the pane itself as content cell for resilience
    rows.push([tabLabel, pane]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
