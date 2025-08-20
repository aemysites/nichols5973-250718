/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label from data-w-tab
  function getTabLabel(tabPane) {
    return tabPane.getAttribute('data-w-tab')?.trim() || '';
  }
  // Get all direct tab panes
  const tabPanes = Array.from(element.querySelectorAll(':scope > .w-tab-pane'));
  // For each tab pane, build: [label, content]
  const rows = tabPanes.map(tabPane => {
    const label = getTabLabel(tabPane);
    // Collect *existing* top-level children of tabPane for content cell
    const children = Array.from(tabPane.children);
    // If there are no children, preserve emptiness with an empty doc fragment
    let content;
    if (children.length === 0) {
      content = document.createDocumentFragment();
    } else if (children.length === 1) {
      content = children[0];
    } else {
      content = children;
    }
    return [label, content];
  });
  // Compose table cells
  const cells = [
    ['Tabs (tabs18)'],
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
