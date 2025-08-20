/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract tab label from data-w-tab attribute
  function getTabLabel(tabPane) {
    // Defensive: fallback to empty string if missing
    return tabPane.getAttribute('data-w-tab') || '';
  }

  // Get all tab panes (immediate children with class w-tab-pane)
  const tabPanes = Array.from(element.querySelectorAll(':scope > .w-tab-pane'));

  // Defensive: if no panes found, do nothing
  if (!tabPanes.length) return;

  // Block header as shown in the example, no variant or metadata
  const headerRow = ['Tabs (tabs18)'];
  const cells = [headerRow];

  tabPanes.forEach((tabPane) => {
    // 1st cell: Tab Label
    const tabLabel = getTabLabel(tabPane);

    // 2nd cell: All of tabPane's content, preserving wrappers and structure
    // Use a DocumentFragment to hold all children
    const tabContent = document.createDocumentFragment();
    Array.from(tabPane.childNodes).forEach((child) => tabContent.appendChild(child));

    // Add the row only if it contains content (tab label and content)
    if (tabLabel.trim() !== '' || tabContent.childNodes.length > 0) {
      cells.push([
        tabLabel,
        tabContent
      ]);
    }
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
