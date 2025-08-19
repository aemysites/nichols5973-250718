/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate tab panes (tab content sections)
  const tabPanes = element.querySelectorAll(':scope > div.w-tab-pane');

  // Prepare the header row exactly as required
  const rows = [['Tabs (tabs66)']];

  // Iterate over each tab pane to extract tab label and content
  tabPanes.forEach(tabPane => {
    // Tab label from data-w-tab (dynamic)
    const label = tabPane.getAttribute('data-w-tab') || '';
    // Collect all content inside the tab pane
    const contentHolder = document.createElement('div');
    while (tabPane.firstChild) {
      contentHolder.appendChild(tabPane.firstChild);
    }
    rows.push([label, contentHolder]);
  });

  // Create the table using the block helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(table);
}
