/* global WebImporter */
export default function parse(element, { document }) {
  // Tabs block: extract tab labels and content panels
  // Header row as specified
  const headerRow = ['Tabs (tabs121)'];
  const rows = [headerRow];

  // Defensive: get all tab panes (each tab's content)
  const tabPanes = Array.from(element.querySelectorAll(':scope > div.w-tab-pane'));

  tabPanes.forEach((pane) => {
    // Tab label from data-w-tab attribute
    const tabLabel = pane.getAttribute('data-w-tab') || '';
    // Content: find the main chart wrapper (all content for this tab)
    const chartWrapper = pane.querySelector('.chart-wrapper-coo');
    // Defensive: if not found, use the pane itself
    const tabContent = chartWrapper || pane;
    // Add row: [label, content]
    rows.push([tabLabel, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
