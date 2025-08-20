/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one cell as specified, even if data rows have two columns
  const headerRow = ['Tabs (tabs111)'];
  const rows = [];

  // Get all immediate tab panes
  const tabPanes = Array.from(element.querySelectorAll(':scope > .w-tab-pane'));

  tabPanes.forEach((pane) => {
    // Tab label from data-w-tab attribute
    const tabLabel = pane.getAttribute('data-w-tab') || '';
    // Find the main content for the tab
    let tabContent = null;
    const chartWrapper = pane.querySelector(':scope > .chart-wrapper-coo');
    if (chartWrapper) {
      tabContent = chartWrapper;
    } else {
      tabContent = Array.from(pane.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      if (tabContent.length === 0) tabContent = pane;
    }
    rows.push([tabLabel, tabContent]);
  });

  // Compose table rows: header is single cell, following rows are [label, content]
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
