/* global WebImporter */
export default function parse(element, { document }) {
  // Tabs (tabs36) block parsing
  // 1. Header row
  const headerRow = ['Tabs (tabs36)'];

  // 2. Find all tab panes (each tab content)
  const tabPanes = Array.from(element.querySelectorAll(':scope > div.w-tab-pane'));

  // Defensive: If no tab panes, do nothing
  if (!tabPanes.length) return;

  // 3. Build rows: [Tab Label, Tab Content]
  const rows = tabPanes.map((tabPane) => {
    // Tab Label
    const tabLabel = tabPane.getAttribute('data-w-tab') || '';
    // Tab Content: grab everything inside the tab pane
    // Defensive: Some tab panes have a single chart-wrapper, some may vary
    // We'll grab all children of tabPane
    const tabContentEls = Array.from(tabPane.childNodes).filter(node => {
      // Only include elements and meaningful text nodes
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });
    // If only one element, use it directly; if multiple, use array
    const tabContentCell = tabContentEls.length === 1 ? tabContentEls[0] : tabContentEls;
    return [tabLabel, tabContentCell];
  });

  // 4. Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element
  element.replaceWith(table);
}
